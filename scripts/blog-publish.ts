#!/usr/bin/env bun
/* eslint-disable @typescript-eslint/no-explicit-any */

import chalk from 'chalk';
import { Command } from 'commander';
import { promises as fs } from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import { join } from 'path';

import { BlogPost, SEOIssue, SEORecommendation, SEOResult } from '../lib/blog-scripts/types';

// CLI interface for publishing options
interface PublishOptions {
  slug?: string;
  schedule?: string;
  dryRun?: boolean;
  force?: boolean;
  list?: boolean;
}

// Content directory configuration
const CONTENT_DIR = join(process.cwd(), 'content', 'blog');

// Helper function to parse frontmatter from MDX files
async function parseFrontmatter(
  filePath: string
): Promise<{ frontmatter: BlogPost; content: string }> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = frontmatterRegex.exec(fileContent);

  if (!match) {
    throw new Error(`Invalid frontmatter format in ${filePath}`);
  }

  const frontmatterText = match[1] || '';
  const content = match[2] || '';

  // Parse YAML frontmatter
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

  return { frontmatter: frontmatter as any, content };
}

// Helper function to write frontmatter back to file
async function writeFrontmatter(
  filePath: string,
  frontmatter: BlogPost,
  content: string
): Promise<void> {
  const frontmatterYaml = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${value.map((v) => `"${v}"`).join(', ')}]`;
      }
      return `${key}: ${typeof value === 'string' ? `"${value}"` : value}`;
    })
    .join('\n');

  const fileContent = `---\n${frontmatterYaml}\n---\n\n${content}`;
  await fs.writeFile(filePath, fileContent, 'utf-8');
}

// Helper function to find blog post by slug
async function findPostBySlug(
  slug: string
): Promise<{ filePath: string; frontmatter: BlogPost; content: string } | null> {
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
              const { frontmatter } = await parseFrontmatter(filePath);

              if (frontmatter.slug === slug) {
                return { filePath, frontmatter, content: '' };
              }
            }
          }
        } else if (stat.isFile() && (item.endsWith('.mdx') || item.endsWith('.md'))) {
          // This is a file directly in the year directory
          const { frontmatter } = await parseFrontmatter(itemPath);

          if (frontmatter.slug === slug) {
            return { filePath: itemPath, frontmatter, content: '' };
          }
        }
      }
    }
  } catch (error) {
    // Directory might not exist or be empty
  }

  return null;
}

// Helper function to get all draft posts
async function getDraftPosts(): Promise<Array<{ filePath: string; frontmatter: BlogPost }>> {
  const drafts: Array<{ filePath: string; frontmatter: BlogPost }> = [];

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
              const { frontmatter } = await parseFrontmatter(filePath);

              if (frontmatter.isDraft) {
                drafts.push({ filePath, frontmatter });
              }
            }
          }
        } else if (stat.isFile() && (item.endsWith('.mdx') || item.endsWith('.md'))) {
          // This is a file directly in the year directory
          const { frontmatter } = await parseFrontmatter(itemPath);

          if (frontmatter.isDraft) {
            drafts.push({ filePath: itemPath, frontmatter });
          }
        }
      }
    }
  } catch (error) {
    // Directory might not exist or be empty
  }

  return drafts;
}

// Helper function to validate post before publishing
async function validatePostForPublishing(
  frontmatter: BlogPost
): Promise<{ valid: boolean; warnings: string[]; errors: string[] }> {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Required fields
  if (!frontmatter.title || frontmatter.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!frontmatter.summary || frontmatter.summary.trim().length === 0) {
    warnings.push('Summary is missing or empty');
  }

  if (!frontmatter.author || frontmatter.author.trim().length === 0) {
    warnings.push('Author is missing');
  }

  // SEO validations
  if (frontmatter.summary && frontmatter.summary.length < 120) {
    warnings.push('Summary is shorter than recommended 120 characters for SEO');
  }

  if (frontmatter.summary && frontmatter.summary.length > 160) {
    warnings.push('Summary is longer than recommended 160 characters for SEO');
  }

  if (!frontmatter.tags || frontmatter.tags.length === 0) {
    warnings.push('No tags specified - tags help with SEO and discoverability');
  }

  if (!frontmatter.readTime || frontmatter.readTime === 0) {
    warnings.push('Read time is not estimated');
  }

  // Content validations
  const filePath = await findPostBySlug(frontmatter.slug);
  if (filePath) {
    const { content } = await parseFrontmatter(filePath.filePath);
    if (content.trim().length === 0) {
      errors.push('Post content is empty');
    }

    if (content.trim().length < 500) {
      warnings.push('Content is quite short - consider adding more detail for better SEO');
    }
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

// Helper function to perform basic SEO check
async function performBasicSEOCheck(frontmatter: BlogPost, content: string): Promise<SEOResult> {
  const issues: SEOIssue[] = [];
  const recommendations: SEORecommendation[] = [];
  let score = 100;

  // Title checks
  if (!frontmatter.title) {
    issues.push({
      type: 'missing',
      field: 'title',
      message: 'Title is required',
      severity: 'error',
    });
    score -= 30;
  } else if (frontmatter.title.length < 30) {
    issues.push({
      type: 'suboptimal',
      field: 'title',
      message: 'Title is too short for optimal SEO (recommended: 30-60 characters)',
      severity: 'warning',
    });
    score -= 10;
  } else if (frontmatter.title.length > 60) {
    issues.push({
      type: 'suboptimal',
      field: 'title',
      message: 'Title is too long for optimal SEO (recommended: 30-60 characters)',
      severity: 'warning',
    });
    score -= 5;
  }

  // Summary checks
  if (!frontmatter.summary) {
    issues.push({
      type: 'missing',
      field: 'summary',
      message: 'Summary is required for SEO',
      severity: 'error',
    });
    score -= 20;
  } else if (frontmatter.summary.length < 120) {
    recommendations.push({
      category: 'content',
      priority: 'medium',
      action: 'Expand summary to 120-160 characters for better SEO',
      impact: 'Better search engine snippet display',
    });
    score -= 10;
  }

  // Tags check
  if (!frontmatter.tags || frontmatter.tags.length === 0) {
    recommendations.push({
      category: 'content',
      priority: 'high',
      action: 'Add relevant tags to improve categorization and SEO',
      impact: 'Better content discoverability and targeting',
    });
    score -= 15;
  }

  // Content length check
  if (content.trim().length < 300) {
    recommendations.push({
      category: 'content',
      priority: 'high',
      action: 'Expand content to at least 300 words for better SEO',
      impact: 'Better search engine ranking potential',
    });
    score -= 20;
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
    keywords: [],
  };
}

// Main publish function
async function publishPost(options: PublishOptions): Promise<void> {
  try {
    console.log(chalk.blue.bold('\n🚀 CueTimer Blog Publishing CLI\n'));

    if (options.list) {
      // List all draft posts
      const spinner = ora('Finding draft posts...').start();

      try {
        const drafts = await getDraftPosts();
        spinner.succeed(chalk.green('Found draft posts'));

        if (drafts.length === 0) {
          console.log(chalk.yellow('\n✨ No draft posts found.'));
          return;
        }

        console.log(chalk.blue('\n📝 Draft Posts:\n'));

        drafts.forEach((draft, index) => {
          console.log(chalk.white(`${index + 1}. ${draft.frontmatter.title}`));
          console.log(chalk.gray(`   Slug: ${draft.frontmatter.slug}`));
          console.log(chalk.gray(`   Category: ${draft.frontmatter.category}`));
          console.log(chalk.gray(`   Language: ${draft.frontmatter.language}`));
          console.log(chalk.gray(`   Last Modified: ${draft.frontmatter.lastModified}`));
          console.log();
        });

        console.log(chalk.blue('💡 Use --slug <slug> to publish a specific post'));
      } catch (error) {
        spinner.fail(chalk.red('Failed to find draft posts'));
        throw error;
      }

      return;
    }

    // Find the post to publish
    let { slug } = options;

    if (!slug) {
      const drafts = await getDraftPosts();

      if (drafts.length === 0) {
        console.log(chalk.yellow('\n✨ No draft posts found.'));
        return;
      }

      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'slug',
          message: 'Select a draft post to publish:',
          choices: drafts.map((draft) => ({
            name: `${draft.frontmatter.title} (${draft.frontmatter.slug})`,
            value: draft.frontmatter.slug,
          })),
        },
      ]);

      ({ slug } = answer);
    }

    // Find the post
    const spinner = ora(`Finding post "${slug || ''}"...`).start();

    const postData = await findPostBySlug(slug || '');

    if (!postData) {
      spinner.fail(chalk.red('Post not found'));
      throw new Error(`Post with slug "${slug}" not found`);
    }

    spinner.succeed(chalk.green('Post found'));

    const { filePath, frontmatter } = postData;
    const { content } = await parseFrontmatter(filePath);

    // Check if already published
    if (!frontmatter.isDraft && !options.force) {
      console.log(chalk.yellow('\n⚠️  This post is already published.'));

      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to continue with publishing anyway?',
          default: false,
        },
      ]);

      if (!answer.proceed) {
        console.log(chalk.gray('\n❌ Publishing cancelled.'));
        return;
      }
    }

    // Validate post for publishing
    console.log(chalk.blue('\n🔍 Validating post for publishing...'));
    const validation = await validatePostForPublishing(frontmatter);

    if (validation.errors.length > 0) {
      console.log(chalk.red('\n❌ Publishing validation failed:'));
      validation.errors.forEach((error) => {
        console.log(chalk.red(`  • ${error}`));
      });

      if (!options.force) {
        console.log(chalk.yellow('\n💡 Use --force to publish anyway'));
        return;
      }
    }

    if (validation.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Publishing warnings:'));
      validation.warnings.forEach((warning) => {
        console.log(chalk.yellow(`  • ${warning}`));
      });
    }

    // Perform SEO check
    console.log(chalk.blue('\n🔍 Performing SEO check...'));
    const seoResult = await performBasicSEOCheck(frontmatter, content);

    console.log(
      chalk.white(
        `\n📊 SEO Score: ${seoResult.score >= 80 ? chalk.green(seoResult.score) : seoResult.score >= 60 ? chalk.yellow(seoResult.score) : chalk.red(seoResult.score)}/100`
      )
    );

    if (seoResult.issues.length > 0) {
      console.log(chalk.red('\n❌ SEO Issues:'));
      seoResult.issues.forEach((issue) => {
        console.log(chalk.red(`  • ${issue.field}: ${issue.message}`));
      });
    }

    if (seoResult.recommendations.length > 0) {
      console.log(chalk.blue('\n💡 SEO Recommendations:'));
      seoResult.recommendations.forEach((rec) => {
        console.log(chalk.blue(`  • ${rec.action} (${rec.priority} priority)`));
      });
    }

    // Show post summary
    console.log(chalk.blue('\n📋 Post Summary:'));
    console.log(chalk.white(`  Title: ${frontmatter.title}`));
    console.log(chalk.white(`  Slug: ${frontmatter.slug}`));
    console.log(chalk.white(`  Category: ${frontmatter.category}`));
    console.log(chalk.white(`  Language: ${frontmatter.language}`));
    console.log(chalk.white(`  Author: ${frontmatter.author}`));
    console.log(chalk.white(`  Read Time: ${frontmatter.readTime} minutes`));
    console.log(chalk.white(`  SEO Score: ${seoResult.score}/100`));

    // Handle scheduling
    let publishDate = new Date().toISOString();

    if (options.schedule) {
      const scheduledDate = new Date(options.schedule);
      if (isNaN(scheduledDate.getTime())) {
        throw new Error(`Invalid schedule date format: ${options.schedule}`);
      }
      publishDate = scheduledDate.toISOString();
      console.log(chalk.white(`  Scheduled: ${publishDate}`));
    } else {
      console.log(chalk.white('  Publishing: Immediately'));
    }

    // Confirm publishing
    if (!options.dryRun) {
      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: '\nProceed with publishing?',
          default: true,
        },
      ]);

      if (!answer.confirm) {
        console.log(chalk.gray('\n❌ Publishing cancelled.'));
        return;
      }
    }

    // Publish the post
    const publishSpinner = ora(
      options.dryRun ? 'Previewing publish changes...' : 'Publishing post...'
    ).start();

    try {
      if (options.dryRun) {
        publishSpinner.succeed(chalk.green('Dry run completed'));
        console.log(chalk.blue('\n🔍 Changes that would be made:'));
        console.log(chalk.white('  • Set isDraft: false'));
        console.log(chalk.white(`  • Update publishedAt: ${publishDate}`));
        console.log(chalk.white(`  • Update lastModified: ${new Date().toISOString()}`));
        console.log(chalk.gray(`  File: ${filePath}`));
      } else {
        // Update frontmatter
        const updatedFrontmatter: BlogPost = {
          ...frontmatter,
          isDraft: false,
          publishedAt: publishDate,
          lastModified: new Date().toISOString(),
        };

        await writeFrontmatter(filePath, updatedFrontmatter, content || '');

        publishSpinner.succeed(chalk.green('Post published successfully!'));

        console.log(chalk.green('\n✅ Post Published Successfully!'));
        console.log(chalk.white(`  Title: ${updatedFrontmatter.title}`));
        console.log(chalk.white(`  Slug: ${updatedFrontmatter.slug}`));
        console.log(chalk.white(`  Published: ${updatedFrontmatter.publishedAt}`));
        console.log(chalk.white(`  SEO Score: ${seoResult.score}/100`));
        console.log(chalk.green(`\n📁 File: ${filePath}`));

        console.log(chalk.blue('\n📝 Next Steps:'));
        console.log(chalk.white('  1. Verify the post appears correctly on your website'));
        console.log(chalk.white('  2. Share on social media platforms'));
        console.log(chalk.white('  3. Monitor performance and engagement'));
      }
    } catch (error) {
      publishSpinner.fail(chalk.red('Failed to publish post'));
      throw error;
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Error publishing post:'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

// Setup CLI program
const program = new Command();

program
  .name('blog-publish')
  .description('Publish draft posts and manage publication workflow')
  .version('1.0.0');

program
  .option('--slug <slug>', 'Post slug to publish')
  .option('--schedule <datetime>', 'Schedule for later publication (ISO format)')
  .option('--dry-run', 'Preview changes without publishing')
  .option('--force', 'Force publish even with warnings')
  .option('--list', 'List all draft posts')
  .action(publishPost);

// Help command
program
  .command('help')
  .description('Show publishing help and examples')
  .action(() => {
    console.log(chalk.blue.bold('\n📋 Blog Publishing Guide:\n'));

    console.log(chalk.green('List draft posts:'));
    console.log(chalk.gray('  bun run scripts/blog-publish.ts --list\n'));

    console.log(chalk.green('Publish a post:'));
    console.log(chalk.gray('  bun run scripts/blog-publish.ts --slug my-post-slug\n'));

    console.log(chalk.green('Schedule a post:'));
    console.log(
      chalk.gray(
        '  bun run scripts/blog-publish.ts --slug my-post-slug --schedule "2024-12-31T10:00:00Z"\n'
      )
    );

    console.log(chalk.green('Dry run (preview changes):'));
    console.log(chalk.gray('  bun run scripts/blog-publish.ts --slug my-post-slug --dry-run\n'));

    console.log(chalk.green('Force publish with warnings:'));
    console.log(chalk.gray('  bun run scripts/blog-publish.ts --slug my-post-slug --force\n'));

    console.log(chalk.blue('📊 SEO Scores:'));
    console.log(chalk.white('  80-100: Excellent'));
    console.log(chalk.white('  60-79:  Good'));
    console.log(chalk.white('  0-59:   Needs improvement'));
    console.log();
  });

// Parse command line arguments
program.parse();

// Export for testing
export { publishPost };
export type { PublishOptions };
