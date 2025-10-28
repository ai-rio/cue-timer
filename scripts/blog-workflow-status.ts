#!/usr/bin/env bun
/* eslint-disable @typescript-eslint/no-explicit-any */

import chalk from 'chalk';
import { Command } from 'commander';
import { promises as fs } from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import { join } from 'path';

import { BlogPost, MultiLanguagePost, SyncStatus } from '../lib/blog-scripts/types';

// CLI interface for workflow status options
interface WorkflowStatusOptions {
  slug?: string;
  language?: string;
  status?: string;
  pending?: boolean;
  detailed?: boolean;
}

// Content directory configuration
const CONTENT_DIR = join(process.cwd(), 'content', 'blog');
const WORKFLOW_DIR = join(process.cwd(), 'data', 'workflow');

// Workflow states
const WORKFLOW_STATES = {
  draft: { label: 'Draft', color: 'gray', description: 'Initial draft stage' },
  'in-translation': {
    label: 'In Translation',
    color: 'yellow',
    description: 'Being translated to other languages',
  },
  'in-review': { label: 'In Review', color: 'blue', description: 'Content review and approval' },
  scheduled: { label: 'Scheduled', color: 'cyan', description: 'Scheduled for publication' },
  published: { label: 'Published', color: 'green', description: 'Published and live' },
};

// Supported languages
const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧' },
  'pt-br': { name: 'Português (Brazil)', flag: '🇧🇷' },
  es: { name: 'Español', flag: '🇪🇸' },
};

// Helper function to find all blog posts
async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  try {
    const years = await fs.readdir(CONTENT_DIR);

    for (const year of years) {
      const yearDir = join(CONTENT_DIR, year);
      const yearItems = await fs.readdir(yearDir);

      for (const item of yearItems) {
        const itemPath = join(yearDir, item);
        const stat = await fs.stat(itemPath);

        if (stat.isDirectory()) {
          // This is a month directory
          const files = await fs.readdir(itemPath);
          for (const file of files) {
            if (file.endsWith('.mdx') || file.endsWith('.md')) {
              const filePath = join(itemPath, file);
              const content = await fs.readFile(filePath, 'utf-8');
              const frontmatter = parseFrontmatter(content);
              posts.push(frontmatter);
            }
          }
        } else if (stat.isFile() && (item.endsWith('.mdx') || item.endsWith('.md'))) {
          // This is a file directly in the year directory
          const content = await fs.readFile(itemPath, 'utf-8');
          const frontmatter = parseFrontmatter(content);
          posts.push(frontmatter);
        }
      }
    }
  } catch (error) {
    // Directory might not exist or be empty
  }

  return posts;
}

// Helper function to parse frontmatter from MDX content
function parseFrontmatter(content: string): BlogPost {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = frontmatterRegex.exec(content);

  if (!match) {
    throw new Error('Invalid frontmatter format');
  }

  const frontmatterText = match[1] || '';
  const frontmatter: Record<string, string | string[]> = {};

  const lines = frontmatterText.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    // Parse arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayValue = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/"/g, ''));
      frontmatter[key] = arrayValue;
      continue;
    }

    // Parse booleans
    if (value === 'true') {
      frontmatter[key] = 'true' as any;
      continue;
    }
    if (value === 'false') {
      frontmatter[key] = 'false' as any;
      continue;
    }

    frontmatter[key] = value;
  }

  return frontmatter as unknown as BlogPost;
}

// Helper function to load workflow data
async function loadWorkflowData(): Promise<Map<string, MultiLanguagePost>> {
  const workflowData = new Map<string, MultiLanguagePost>();

  try {
    await fs.mkdir(WORKFLOW_DIR, { recursive: true });
    const files = await fs.readdir(WORKFLOW_DIR);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = join(WORKFLOW_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content) as MultiLanguagePost;

        // Convert string dates back to Date objects
        if (data.synchronizationStatus.lastSynced) {
          data.synchronizationStatus.lastSynced = new Date(data.synchronizationStatus.lastSynced);
        }

        workflowData.set(data.masterPost.slug, data);
      }
    }
  } catch (error) {
    // Directory might not exist or be empty
  }

  return workflowData;
}

// Helper function to save workflow data
async function saveWorkflowData(workflowData: MultiLanguagePost): Promise<void> {
  try {
    await fs.mkdir(WORKFLOW_DIR, { recursive: true });
    const filePath = join(WORKFLOW_DIR, `${workflowData.masterPost.slug}.json`);
    await fs.writeFile(filePath, JSON.stringify(workflowData, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Warning: Could not save workflow data');
  }
}

// Helper function to generate workflow data from blog posts
function generateWorkflowData(posts: BlogPost[]): Map<string, MultiLanguagePost> {
  const workflowMap = new Map<string, MultiLanguagePost>();
  const baseSlugs = new Map<string, BlogPost[]>(); // baseSlug -> posts

  // Group posts by base slug (remove language suffix)
  posts.forEach((post) => {
    const baseSlug = post.slug.replace(/-([a-z]{2}(-[a-z]{2})?)$/, '');
    if (!baseSlugs.has(baseSlug)) {
      baseSlugs.set(baseSlug, []);
    }
    baseSlugs.get(baseSlug)!.push(post);
  });

  // Create MultiLanguagePost for each base slug
  for (const [baseSlug, postGroup] of baseSlugs.entries()) {
    if (postGroup.length === 0) continue;

    // Find master post (prefer English or first created)
    const masterPostCandidate = postGroup.find((p) => p.language === 'en') || postGroup[0];

    if (!masterPostCandidate) {
      continue;
    }

    const masterPost = masterPostCandidate;

    // Determine workflow state
    let workflowState: MultiLanguagePost['workflowState'] = 'draft';
    if (postGroup.some((p) => !p.isDraft)) {
      workflowState = postGroup.every((p) => !p.isDraft) ? 'published' : 'in-review';
    }

    // Create translations map
    const translations = new Map<string, BlogPost>();
    postGroup.forEach((post) => {
      if (post.slug !== masterPost.slug) {
        translations.set(post.language, post);
      }
    });

    // Create sync status
    const syncStatus: SyncStatus = {
      isMaster: masterPost.language === 'en',
      lastSynced: new Date(),
      pendingTranslations: (
        Object.keys(SUPPORTED_LANGUAGES) as Array<keyof typeof SUPPORTED_LANGUAGES>
      ).filter((lang) => lang !== masterPost.language && !translations.has(lang)),
      inconsistentFields: [],
    };

    // Check for inconsistencies
    if (translations.size > 0) {
      const masterFields = Object.keys(masterPost).filter(
        (key) => !['slug', 'language', 'lastModified', 'publishedAt'].includes(key)
      );

      masterFields.forEach((field) => {
        const masterValue = masterPost[field as keyof BlogPost];
        translations.forEach((translation, lang) => {
          const translationValue = translation[field as keyof BlogPost];
          if (JSON.stringify(masterValue) !== JSON.stringify(translationValue)) {
            syncStatus.inconsistentFields.push(`${field} (${lang})`);
          }
        });
      });
    }

    const multiLangPost: MultiLanguagePost = {
      masterPost,
      translations,
      workflowState,
      synchronizationStatus: syncStatus,
    };

    workflowMap.set(baseSlug, multiLangPost);
  }

  return workflowMap;
}

// Helper function to format workflow status
function formatWorkflowStatus(workflowData: MultiLanguagePost, detailed: boolean = false): string {
  const { masterPost, translations, workflowState, synchronizationStatus } = workflowData;
  const stateInfo = WORKFLOW_STATES[workflowState as keyof typeof WORKFLOW_STATES];
  let output = chalk.blue.bold(`📋 ${masterPost.title}\n`);
  output += chalk.gray(`   Slug: ${masterPost.slug}\n`);

  // Status with appropriate color
  switch (stateInfo.color) {
    case 'gray':
      output += chalk.gray(`   Status: ${stateInfo.label}\n`);
      break;
    case 'yellow':
      output += chalk.yellow(`   Status: ${stateInfo.label}\n`);
      break;
    case 'blue':
      output += chalk.blue(`   Status: ${stateInfo.label}\n`);
      break;
    case 'cyan':
      output += chalk.cyan(`   Status: ${stateInfo.label}\n`);
      break;
    case 'green':
      output += chalk.green(`   Status: ${stateInfo.label}\n`);
      break;
    default:
      output += chalk.white(`   Status: ${stateInfo.label}\n`);
  }
  output += chalk.gray(`   Category: ${masterPost.category}\n`);
  output += chalk.gray(`   Author: ${masterPost.author}\n`);

  // Language status
  output += chalk.blue.bold('\n   🌐 Language Status:\n');
  output += chalk.white(
    `   ${SUPPORTED_LANGUAGES[masterPost.language as keyof typeof SUPPORTED_LANGUAGES]?.flag || '🏳️'} `
  );
  output += chalk.white(
    `${SUPPORTED_LANGUAGES[masterPost.language as keyof typeof SUPPORTED_LANGUAGES]?.name || masterPost.language} (Master)\n`
  );

  translations.forEach((translation, lang) => {
    const langInfo = SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES];
    const flag = langInfo?.flag || '🏳️';
    const name = langInfo?.name || lang;
    const status = translation.isDraft ? 'Draft' : 'Published';
    const statusText = translation.isDraft ? chalk.gray(status) : chalk.green(status);

    output += chalk.white(`   ${flag} ${name} (${statusText})\n`);
  });

  // Pending translations
  if (synchronizationStatus.pendingTranslations.length > 0) {
    output += chalk.yellow.bold('\n   ⏳ Pending Translations:\n');
    synchronizationStatus.pendingTranslations.forEach((lang) => {
      const langInfo = SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES];
      output += chalk.yellow(`   ${langInfo?.flag || '🏳️'} ${langInfo?.name || lang}\n`);
    });
  }

  // Synchronization status
  if (detailed) {
    output += chalk.blue.bold('\n   🔗 Synchronization:\n');
    output += chalk.gray(
      `   Last Synced: ${synchronizationStatus.lastSynced.toLocaleDateString()}\n`
    );
    output += chalk.gray(`   Is Master: ${synchronizationStatus.isMaster ? 'Yes' : 'No'}\n`);

    if (synchronizationStatus.inconsistentFields.length > 0) {
      output += chalk.red.bold('\n   ⚠️  Inconsistencies:\n');
      synchronizationStatus.inconsistentFields.forEach((field) => {
        output += chalk.red(`   • ${field}\n`);
      });
    }

    // Content comparison
    if (translations.size > 0) {
      output += chalk.blue.bold('\n   📊 Content Comparison:\n');

      const masterWords = (masterPost.content || '').split(/\s+/).length;
      output += chalk.white(`   Master (${masterPost.language}): ${masterWords} words\n`);

      translations.forEach((translation, lang) => {
        const langWords = (translation.content || '').split(/\s+/).length;
        const diff = langWords - masterWords;
        const diffText = diff > 0 ? `+${diff}` : diff.toString();
        const coloredDiffText =
          diff > 0 ? chalk.green(diffText) : diff < 0 ? chalk.red(diffText) : chalk.gray(diffText);

        output += chalk.white(`   ${lang}: ${langWords} words (${coloredDiffText})\n`);
      });
    }
  }

  return output;
}

// Helper function to filter workflow data
function filterWorkflowData(
  workflowMap: Map<string, MultiLanguagePost>,
  options: WorkflowStatusOptions
): Map<string, MultiLanguagePost> {
  let filtered = new Map(workflowMap);

  // Filter by slug
  if (options.slug) {
    filtered = new Map(
      Array.from(filtered.entries()).filter(
        ([slug]) => slug.includes(options.slug!) || slug === options.slug
      )
    );
  }

  // Filter by language
  if (options.language) {
    filtered = new Map(
      Array.from(filtered.entries()).filter(
        ([_, data]) =>
          data.masterPost.language === options.language ||
          Array.from(data.translations.keys()).includes(options.language!)
      )
    );
  }

  // Filter by status
  if (options.status) {
    filtered = new Map(
      Array.from(filtered.entries()).filter(([_, data]) => data.workflowState === options.status)
    );
  }

  // Filter pending translations
  if (options.pending) {
    filtered = new Map(
      Array.from(filtered.entries()).filter(
        ([_, data]) =>
          data.synchronizationStatus.pendingTranslations.length > 0 ||
          data.workflowState === 'in-translation'
      )
    );
  }

  return filtered;
}

// Helper function to generate workflow summary
function generateWorkflowSummary(workflowMap: Map<string, MultiLanguagePost>): {
  totalPosts: number;
  byStatus: Record<string, number>;
  byLanguage: Record<string, number>;
  pendingTranslations: number;
  inconsistencies: number;
} {
  const summary = {
    totalPosts: workflowMap.size,
    byStatus: {} as Record<string, number>,
    byLanguage: {} as Record<string, number>,
    pendingTranslations: 0,
    inconsistencies: 0,
  };

  workflowMap.forEach((data) => {
    // Status breakdown
    summary.byStatus[data.workflowState] = (summary.byStatus[data.workflowState] || 0) + 1;

    // Language breakdown
    summary.byLanguage[data.masterPost.language] =
      (summary.byLanguage[data.masterPost.language] || 0) + 1;
    data.translations.forEach((_, lang) => {
      summary.byLanguage[lang] = (summary.byLanguage[lang] || 0) + 1;
    });

    // Pending translations
    summary.pendingTranslations += data.synchronizationStatus.pendingTranslations.length;

    // Inconsistencies
    summary.inconsistencies += data.synchronizationStatus.inconsistentFields.length;
  });

  return summary;
}

// Main workflow status function
async function checkWorkflowStatus(options: WorkflowStatusOptions): Promise<void> {
  try {
    console.log(chalk.blue.bold('\n📋 CueTimer Blog Workflow Status CLI\n'));

    // Load existing workflow data or generate from posts
    let workflowMap = await loadWorkflowData();

    if (workflowMap.size === 0) {
      console.log(chalk.yellow('No workflow data found, generating from blog posts...'));

      const posts = await getAllBlogPosts();
      if (posts.length === 0) {
        console.log(chalk.yellow('\n✨ No blog posts found.'));
        return;
      }

      workflowMap = generateWorkflowData(posts);

      // Save generated data
      const spinner = ora('Saving workflow data...').start();
      for (const [slug, data] of workflowMap.entries()) {
        await saveWorkflowData(data);
      }
      spinner.succeed(chalk.green('Workflow data generated and saved'));
    }

    // Apply filters
    const filteredMap = filterWorkflowData(workflowMap, options);

    if (filteredMap.size === 0) {
      console.log(chalk.yellow('\n✨ No posts match the specified criteria.'));
      return;
    }

    // Display results
    if (options.slug || filteredMap.size === 1) {
      // Single post detailed view
      const firstEntry = Array.from(filteredMap.entries())[0];
      if (!firstEntry) {
        console.log(chalk.yellow('\n✨ No workflow data available.'));
        return;
      }
      const [slug, data] = firstEntry;
      console.log(formatWorkflowStatus(data, options.detailed || false));
    } else {
      // Multiple posts summary
      console.log(chalk.blue.bold(`\n📊 Workflow Status (${filteredMap.size} posts)\n`));

      const summary = generateWorkflowSummary(filteredMap);

      // Status breakdown
      console.log(chalk.blue.bold('📈 Status Breakdown:'));
      Object.entries(summary.byStatus).forEach(([status, count]) => {
        const stateInfo = WORKFLOW_STATES[status as keyof typeof WORKFLOW_STATES];
        let coloredLabel;
        switch (stateInfo.color) {
          case 'gray':
            coloredLabel = chalk.gray(stateInfo.label);
            break;
          case 'yellow':
            coloredLabel = chalk.yellow(stateInfo.label);
            break;
          case 'blue':
            coloredLabel = chalk.blue(stateInfo.label);
            break;
          case 'cyan':
            coloredLabel = chalk.cyan(stateInfo.label);
            break;
          case 'green':
            coloredLabel = chalk.green(stateInfo.label);
            break;
          default:
            coloredLabel = chalk.white(stateInfo.label);
        }
        console.log(chalk.white(`  ${coloredLabel}: ${count} posts`));
      });

      // Language breakdown
      console.log(chalk.blue.bold('\n🌐 Language Breakdown:'));
      Object.entries(summary.byLanguage).forEach(([lang, count]) => {
        const langInfo = SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES];
        const flag = langInfo?.flag || '🏳️';
        const name = langInfo?.name || lang;
        console.log(chalk.white(`  ${flag} ${name}: ${count} posts`));
      });

      // Issues and pending items
      if (summary.pendingTranslations > 0 || summary.inconsistencies > 0) {
        console.log(chalk.blue.bold('\n⚠️  Issues & Pending Items:'));
        if (summary.pendingTranslations > 0) {
          console.log(chalk.yellow(`  ⏳ Pending translations: ${summary.pendingTranslations}`));
        }
        if (summary.inconsistencies > 0) {
          console.log(chalk.red(`  ⚠️  Content inconsistencies: ${summary.inconsistencies}`));
        }
      }

      // List posts
      console.log(chalk.blue.bold('\n📝 Posts:'));
      Array.from(filteredMap.entries()).forEach(([slug, data]) => {
        const stateInfo = WORKFLOW_STATES[data.workflowState as keyof typeof WORKFLOW_STATES];
        const stateColor = stateInfo.color as keyof typeof chalk;
        const langCount = data.translations.size + 1;
        const pendingCount = data.synchronizationStatus.pendingTranslations.length;

        console.log(chalk.white(`  • ${data.masterPost.title}`));

        let coloredState;
        switch (stateInfo.color) {
          case 'gray':
            coloredState = chalk.gray(stateInfo.label);
            break;
          case 'yellow':
            coloredState = chalk.yellow(stateInfo.label);
            break;
          case 'blue':
            coloredState = chalk.blue(stateInfo.label);
            break;
          case 'cyan':
            coloredState = chalk.cyan(stateInfo.label);
            break;
          case 'green':
            coloredState = chalk.green(stateInfo.label);
            break;
          default:
            coloredState = chalk.white(stateInfo.label);
        }

        console.log(chalk.gray(`    Slug: ${slug} | ${coloredState} | ${langCount} languages`));

        if (pendingCount > 0) {
          console.log(chalk.yellow(`    ⏳ ${pendingCount} pending translations`));
        }

        if (data.synchronizationStatus.inconsistentFields.length > 0) {
          console.log(
            chalk.red(
              `    ⚠️  ${data.synchronizationStatus.inconsistentFields.length} inconsistencies`
            )
          );
        }

        console.log();
      });

      // Recommendations
      console.log(chalk.blue.bold('💡 Recommendations:'));

      if (summary.pendingTranslations > 0) {
        console.log(chalk.white('  • Complete pending translations to reach global audience'));
      }

      if (summary.inconsistencies > 0) {
        console.log(chalk.white('  • Resolve content inconsistencies across languages'));
      }

      const draftCount = summary.byStatus['draft'] || 0;
      if (draftCount > 0) {
        console.log(chalk.white(`  • Move ${draftCount} draft posts through the workflow`));
      }

      const inReviewCount = summary.byStatus['in-review'] || 0;
      if (inReviewCount > 0) {
        console.log(
          chalk.white(`  • Review and approve ${inReviewCount} posts waiting for publication`)
        );
      }
    }

    // Interactive options
    if (!options.slug && filteredMap.size > 1) {
      console.log(chalk.blue('\n🔍 Additional Options:'));
      console.log(chalk.gray('  • Use --slug <slug> for detailed post analysis'));
      console.log(chalk.gray('  • Use --detailed for comprehensive information'));
      console.log(chalk.gray('  • Use --pending to show only posts needing translation'));
      console.log(chalk.gray('  • Use --language <lang> to filter by language'));
      console.log(chalk.gray('  • Use --status <status> to filter by workflow status'));
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Error checking workflow status:'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

// Setup CLI program
const program = new Command();

program
  .name('blog-workflow-status')
  .description('Multi-language workflow status tracking')
  .version('1.0.0');

program
  .option('--slug <slug>', 'Status of specific post')
  .option('--language <lang>', 'Filter by language (en, pt-br, es)')
  .option(
    '--status <status>',
    'Filter by workflow status (draft, in-translation, in-review, scheduled, published)'
  )
  .option('--pending', 'Show posts pending translation/review')
  .option('--detailed', 'Show detailed synchronization information')
  .action(checkWorkflowStatus);

// Help command
program
  .command('help')
  .description('Show workflow status help and examples')
  .action(() => {
    console.log(chalk.blue.bold('\n📋 Blog Workflow Status Guide:\n'));

    console.log(chalk.green('Check specific post:'));
    console.log(chalk.gray('  bun run scripts/blog-workflow-status.ts --slug my-post-slug\n'));

    console.log(chalk.green('Show posts pending translation:'));
    console.log(chalk.gray('  bun run scripts/blog-workflow-status.ts --pending\n'));

    console.log(chalk.green('Filter by language:'));
    console.log(chalk.gray('  bun run scripts/blog-workflow-status.ts --language pt-br\n'));

    console.log(chalk.green('Filter by status:'));
    console.log(chalk.gray('  bun run scripts/blog-workflow-status.ts --status published\n'));

    console.log(chalk.green('Detailed information:'));
    console.log(
      chalk.gray('  bun run scripts/blog-workflow-status.ts --slug my-post-slug --detailed\n')
    );

    console.log(chalk.blue('🌐 Supported Languages:'));
    Object.entries(SUPPORTED_LANGUAGES).forEach(([code, info]) => {
      console.log(chalk.white(`  ${info.flag} ${code}: ${info.name}`));
    });

    console.log(chalk.blue('\n📊 Workflow States:'));
    Object.entries(WORKFLOW_STATES).forEach(([state, info]) => {
      let coloredLabel;
      switch (info.color) {
        case 'gray':
          coloredLabel = chalk.gray(info.label);
          break;
        case 'yellow':
          coloredLabel = chalk.yellow(info.label);
          break;
        case 'blue':
          coloredLabel = chalk.blue(info.label);
          break;
        case 'cyan':
          coloredLabel = chalk.cyan(info.label);
          break;
        case 'green':
          coloredLabel = chalk.green(info.label);
          break;
        default:
          coloredLabel = chalk.white(info.label);
      }
      console.log(chalk.white(`  ${coloredLabel}: ${info.description}`));
    });
    console.log();
  });

// Parse command line arguments
program.parse();

// Export for testing
export { checkWorkflowStatus };
export type { WorkflowStatusOptions };
