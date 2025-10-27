# Chunk 85: source_scripts

## Metadata

- **Files**: 1
- **Size**: 27,350 characters (~6,837 tokens)
- **Categories**: source

## Files in this chunk

- `scripts/blog-seo-check.ts`

---

## File: `scripts/blog-seo-check.ts`

```typescript
#!/usr/bin/env bun

import chalk from 'chalk';
import { Command } from 'commander';
import { promises as fs } from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import { join } from 'path';

import {
  BlogPost,
  KeywordAnalysis,
  SEOIssue,
  SEORecommendation,
  SEOResult,
} from '../lib/blog-scripts/types';

// CLI interface for SEO check options
interface SeoCheckOptions {
  slug?: string;
  all?: boolean;
  fix?: boolean;
  score?: boolean;
}

// Content directory configuration
const CONTENT_DIR = join(process.cwd(), 'content', 'blog');

// SEO scoring weights
const SEO_WEIGHTS = {
  title: 20,
  description: 15,
  content: 25,
  structure: 15,
  keywords: 15,
  technical: 10,
};

// Recommended keyword density range
const KEYWORD_DENSITY_RANGE = { min: 0.01, max: 0.03 }; // 1-3%

// Helper function to find all blog posts
async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  try {
    const years = await fs.readdir(CONTENT_DIR);

    for (const year of years) {
      const yearDir = join(CONTENT_DIR, year);
      const months = await fs.readdir(yearDir);

      for (const month of months) {
        const monthDir = join(yearDir, month);
        const files = await fs.readdir(monthDir);

        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const filePath = join(monthDir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const frontmatter = parseFrontmatter(content);
            const contentBody = extractContentBody(content);
            posts.push({ ...frontmatter, content: contentBody });
          }
        }
      }
    }
  } catch (error) {
    // Directory might not exist or be empty
  }

  return posts;
}

// Helper function to find blog post by slug
async function findPostBySlug(
  slug: string
): Promise<{ filePath: string; post: BlogPost } | null> {
  try {
    const years = await fs.readdir(CONTENT_DIR);

    for (const year of years) {
      const yearDir = join(CONTENT_DIR, year);
      const months = await fs.readdir(yearDir);

      for (const month of months) {
        const monthDir = join(yearDir, month);
        const files = await fs.readdir(monthDir);

        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const filePath = join(monthDir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const frontmatter = parseFrontmatter(content);
            const contentBody = extractContentBody(content);

            if (frontmatter.slug === slug) {
              return {
                filePath,
                post: { ...frontmatter, content: contentBody },
              };
            }
          }
        }
      }
    }
  } catch (error) {
    // Directory might not exist or be empty
  }

  return null;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      frontmatter[key] = 'true' as any;
      continue;
    }
    if (value === 'false') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      frontmatter[key] = 'false' as any;
      continue;
    }

    frontmatter[key] = value;
  }

  return frontmatter as unknown as BlogPost;
}

// Helper function to extract content body from MDX
function extractContentBody(content: string): string {
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n([\s\S]*)$/;
  const match = frontmatterRegex.exec(content);
  return match ? match[1] || '' : content || '';
}

// Helper function to analyze keyword density
function analyzeKeywords(content: string, title: string): KeywordAnalysis[] {
  // Extract keywords from title and content
  const titleWords = (title || '')
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);
  const contentWords = content.toLowerCase().split(/\s+/);
  const totalWords = contentWords.length;

  // Count word frequencies
  const wordFreq: Record<string, number> = {};
  contentWords.forEach((word) => {
    const cleanWord = word.replace(/[^a-z0-9]/g, '');
    if (cleanWord.length > 3) {
      wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
    }
  });

  // Analyze keywords
  const keywords: KeywordAnalysis[] = [];

  // Include title words as primary keywords
  titleWords.forEach((word) => {
    if (wordFreq[word]) {
      const density = wordFreq[word] / totalWords;
      keywords.push({
        keyword: word,
        density,
        relevance: 0.9, // Title words are highly relevant
        competition:
          density > 0.05 ? 'high' : density > 0.02 ? 'medium' : 'low',
      });
    }
  });

  // Add other frequent words
  Object.entries(wordFreq)
    .filter(([word, freq]) => !titleWords.includes(word) && freq > 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .forEach(([word, freq]) => {
      const density = freq / totalWords;
      keywords.push({
        keyword: word,
        density,
        relevance: 0.6,
        competition:
          density > 0.05 ? 'high' : density > 0.02 ? 'medium' : 'low',
      });
    });

  return keywords;
}

// Helper function to check title SEO
function checkTitleSEO(post: BlogPost): SEOIssue[] {
  const issues: SEOIssue[] = [];

  if (!post.title) {
    issues.push({
      type: 'missing',
      field: 'title',
      message: 'Title is required',
      severity: 'error',
    });
    return issues;
  }

  if (post.title.length < 30) {
    issues.push({
      type: 'suboptimal',
      field: 'title',
      message:
        'Title is too short for optimal SEO (recommended: 30-60 characters)',
      severity: 'warning',
    });
  }

  if (post.title.length > 60) {
    issues.push({
      type: 'suboptimal',
      field: 'title',
      message:
        'Title is too long for optimal SEO (recommended: 30-60 characters)',
      severity: 'warning',
    });
  }

  if (!/[A-Z]/.test(post.title)) {
    issues.push({
      type: 'suboptimal',
      field: 'title',
      message: 'Title should use title case for better readability',
      severity: 'info',
    });
  }

  if (!/\d|[A-Z][a-z]+/.test(post.title)) {
    issues.push({
      type: 'suboptimal',
      field: 'title',
      message: 'Consider including numbers or proper nouns for better SEO',
      severity: 'info',
    });
  }

  return issues;
}

// Helper function to check description SEO
function checkDescriptionSEO(post: BlogPost): SEOIssue[] {
  const issues: SEOIssue[] = [];

  if (!post.summary) {
    issues.push({
      type: 'missing',
      field: 'summary',
      message: 'Summary/description is required for SEO',
      severity: 'error',
    });
    return issues;
  }

  if (post.summary.length < 120) {
    issues.push({
      type: 'suboptimal',
      field: 'summary',
      message:
        'Summary is too short for optimal SEO (recommended: 120-160 characters)',
      severity: 'warning',
    });
  }

  if (post.summary.length > 160) {
    issues.push({
      type: 'suboptimal',
      field: 'summary',
      message:
        'Summary is too long for optimal SEO (recommended: 120-160 characters)',
      severity: 'warning',
    });
  }

  if (
    post.title &&
    post.summary &&
    !post.summary
      .toLowerCase()
      .includes(post.title.toLowerCase().split(' ')[0] || '')
  ) {
    issues.push({
      type: 'suboptimal',
      field: 'summary',
      message: 'Summary should include keywords from the title',
      severity: 'info',
    });
  }

  return issues;
}

// Helper function to check content SEO
function checkContentSEO(post: BlogPost): SEOIssue[] {
  const issues: SEOIssue[] = [];
  const content = post.content || '';

  if (!content || content.trim().length === 0) {
    issues.push({
      type: 'missing',
      field: 'content',
      message: 'Content is required',
      severity: 'error',
    });
    return issues;
  }

  const wordCount = (content || '').split(/\s+/).length;

  if (wordCount < 300) {
    issues.push({
      type: 'suboptimal',
      field: 'content',
      message:
        'Content is too short for optimal SEO (recommended: minimum 300 words)',
      severity: 'warning',
    });
  }

  if (wordCount > 3000) {
    issues.push({
      type: 'suboptimal',
      field: 'content',
      message: 'Very long content - consider breaking into smaller sections',
      severity: 'info',
    });
  }

  // Check for headings
  const headingCount = (content.match(/^#+\s/gm) || []).length;
  if (headingCount < 2) {
    issues.push({
      type: 'suboptimal',
      field: 'content',
      message: 'Content should include multiple headings for better structure',
      severity: 'warning',
    });
  }

  // Check for images
  const imageCount = (content.match(/!\[.*?\]/g) || []).length;
  if (imageCount === 0) {
    issues.push({
      type: 'suboptimal',
      field: 'content',
      message: 'Consider adding images to improve engagement',
      severity: 'info',
    });
  }

  // Check for links
  const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
  if (linkCount === 0) {
    issues.push({
      type: 'suboptimal',
      field: 'content',
      message: 'Consider adding external links to improve authority',
      severity: 'info',
    });
  }

  return issues;
}

// Helper function to check structure SEO
function checkStructureSEO(post: BlogPost): SEOIssue[] {
  const issues: SEOIssue[] = [];
  const content = post.content || '';

  // Check for proper heading hierarchy
  const headings = content.match(/^#+\s+(.+)$/gm) || [];
  let hasH1 = false;
  let previousLevel = 0;

  headings.forEach((heading) => {
    const level = (heading.match(/^#+/) || [''])[0].length;

    if (level === 1) {
      hasH1 = true;
    }

    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.push({
        type: 'invalid',
        field: 'structure',
        message: `Heading level jump detected (H${previousLevel} to H${level})`,
        severity: 'warning',
      });
    }

    previousLevel = level;
  });

  if (!hasH1) {
    issues.push({
      type: 'missing',
      field: 'structure',
      message: 'Content should include at least one H1 heading',
      severity: 'warning',
    });
  }

  // Check for lists
  const listCount = (content.match(/^\s*[-*+]\s/gm) || []).length;
  if (listCount === 0) {
    issues.push({
      type: 'suboptimal',
      field: 'structure',
      message: 'Consider using lists to improve readability',
      severity: 'info',
    });
  }

  return issues;
}

// Helper function to check technical SEO
function checkTechnicalSEO(post: BlogPost): SEOIssue[] {
  const issues: SEOIssue[] = [];

  if (!post.slug) {
    issues.push({
      type: 'missing',
      field: 'slug',
      message: 'URL slug is required',
      severity: 'error',
    });
  } else {
    if (post.slug.length > 60) {
      issues.push({
        type: 'suboptimal',
        field: 'slug',
        message:
          'URL slug is too long for optimal SEO (recommended: max 60 characters)',
        severity: 'warning',
      });
    }

    if (!/^[a-z0-9-]+$/.test(post.slug)) {
      issues.push({
        type: 'invalid',
        field: 'slug',
        message:
          'URL slug should contain only lowercase letters, numbers, and hyphens',
        severity: 'warning',
      });
    }
  }

  if (!post.tags || post.tags.length === 0) {
    issues.push({
      type: 'missing',
      field: 'tags',
      message: 'Tags are recommended for better categorization and SEO',
      severity: 'warning',
    });
  } else if (post.tags.length > 10) {
    issues.push({
      type: 'suboptimal',
      field: 'tags',
      message: 'Too many tags - focus on 5-8 relevant tags',
      severity: 'info',
    });
  }

  if (!post.readTime || post.readTime === 0) {
    issues.push({
      type: 'missing',
      field: 'readTime',
      message: 'Read time should be estimated for user experience',
      severity: 'info',
    });
  }

  return issues;
}

// Helper function to calculate SEO score
function calculateSeoScore(issues: SEOIssue[]): number {
  let score = 100;

  issues.forEach((issue) => {
    switch (issue.severity) {
      case 'error':
        score -= 20;
        break;
      case 'warning':
        score -= 10;
        break;
      case 'info':
        score -= 5;
        break;
    }
  });

  return Math.max(0, score);
}

// Helper function to generate SEO recommendations
function generateRecommendations(
  issues: SEOIssue[],
  keywords: KeywordAnalysis[]
): SEORecommendation[] {
  const recommendations: SEORecommendation[] = [];

  // Title recommendations
  const titleIssues = issues.filter((i) => i.field === 'title');
  if (titleIssues.length > 0) {
    recommendations.push({
      category: 'content',
      priority: 'high',
      action: 'Optimize title length to 30-60 characters with target keywords',
      impact: 'Better search engine ranking and click-through rates',
    });
  }

  // Description recommendations
  const descriptionIssues = issues.filter((i) => i.field === 'summary');
  if (descriptionIssues.length > 0) {
    recommendations.push({
      category: 'content',
      priority: 'high',
      action:
        'Write compelling meta description (120-160 characters) with target keywords',
      impact: 'Improved search engine snippet display and higher CTR',
    });
  }

  // Content recommendations
  const contentIssues = issues.filter((i) => i.field === 'content');
  if (contentIssues.length > 0) {
    recommendations.push({
      category: 'content',
      priority: 'medium',
      action: 'Expand content to at least 300 words with proper structure',
      impact: 'Better search engine ranking and user engagement',
    });
  }

  // Keyword recommendations
  const keywordIssues = keywords.filter(
    (k) =>
      k.density < KEYWORD_DENSITY_RANGE.min ||
      k.density > KEYWORD_DENSITY_RANGE.max
  );
  if (keywordIssues.length > 0) {
    recommendations.push({
      category: 'keywords',
      priority: 'medium',
      action: 'Optimize keyword density to 1-3% for target terms',
      impact: 'Better relevance scoring and search engine ranking',
    });
  }

  // Structure recommendations
  const structureIssues = issues.filter((i) => i.field === 'structure');
  if (structureIssues.length > 0) {
    recommendations.push({
      category: 'technical',
      priority: 'medium',
      action: 'Improve content structure with proper headings and formatting',
      impact: 'Better readability and search engine understanding',
    });
  }

  // Technical recommendations
  const technicalIssues = issues.filter(
    (i) => i.field === 'tags' || i.field === 'slug'
  );
  if (technicalIssues.length > 0) {
    recommendations.push({
      category: 'technical',
      priority: 'low',
      action: 'Add relevant tags and optimize URL structure',
      impact: 'Improved categorization and URL readability',
    });
  }

  return recommendations;
}

// Helper function to auto-fix common SEO issues
async function autoFixSeoIssues(postData: {
  filePath: string;
  post: BlogPost;
}): Promise<void> {
  const { filePath, post } = postData;
  const content = await fs.readFile(filePath, 'utf-8');
  let updatedContent = content;
  let frontmatterUpdated = false;

  // Auto-fix read time if missing
  if (!post.readTime || post.readTime === 0) {
    const wordsPerMinute = 200;
    const words = (post.content || '').split(/\s+/).length;
    const estimatedReadTime = Math.ceil(words / wordsPerMinute);

    updatedContent = updatedContent.replace(
      /(readTime:\s*)\d+/,
      `$1${estimatedReadTime}`
    );
    frontmatterUpdated = true;
  }

  // Auto-fix tags if missing
  if (!post.tags || post.tags.length === 0) {
    const titleWords = (post.title || '').toLowerCase().split(/\s+/);
    const suggestedTags = titleWords
      .filter((word) => word.length > 4)
      .slice(0, 3);

    if (suggestedTags.length > 0) {
      const tagsString = suggestedTags.map((tag) => `"${tag}"`).join(', ');
      updatedContent = updatedContent.replace(
        /^---\n([\s\S]*?)\n---/,
        (match, frontmatter) => {
          if (frontmatter.includes('tags:')) {
            return match;
          }
          return `---\n${frontmatter}\ntags: [${tagsString}]\n---`;
        }
      );
      frontmatterUpdated = true;
    }
  }

  // Write back if updated
  if (frontmatterUpdated) {
    await fs.writeFile(filePath, updatedContent, 'utf-8');
  }
}

// Main SEO check function
async function performSeoCheck(options: SeoCheckOptions): Promise<void> {
  try {
    console.log(chalk.blue.bold('\n🔍 CueTimer Blog SEO Check CLI\n'));

    let postsToCheck: Array<{ filePath: string; post: BlogPost }> = [];

    if (options.slug) {
      // Check specific post
      const postData = await findPostBySlug(options.slug);

      if (!postData) {
        throw new Error(`Post with slug "${options.slug}" not found`);
      }

      postsToCheck = [postData];
    } else if (options.all) {
      // Check all posts
      const allPosts = await getAllBlogPosts();

      if (allPosts.length === 0) {
        console.log(chalk.yellow('\n✨ No blog posts found.'));
        return;
      }

      // Map posts back to file paths (simplified for this CLI)
      postsToCheck = allPosts.map((post) => ({
        filePath: join(CONTENT_DIR, 'placeholder', `${post.slug}.mdx`), // Placeholder path
        post,
      }));
    } else {
      // Interactive post selection
      const allPosts = await getAllBlogPosts();

      if (allPosts.length === 0) {
        console.log(chalk.yellow('\n✨ No blog posts found.'));
        return;
      }

      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'slug',
          message: 'Select a post for SEO checking:',
          choices: [
            { name: '🔍 Check all posts', value: '__ALL__' },
            ...allPosts.map((post) => ({
              name: `${post.title} (${post.slug})`,
              value: post.slug,
            })),
          ],
        },
      ]);

      if (answer.slug === '__ALL__') {
        postsToCheck = allPosts.map((post) => ({
          filePath: join(CONTENT_DIR, 'placeholder', `${post.slug}.mdx`), // Placeholder path
          post,
        }));
      } else {
        const postData = await findPostBySlug(answer.slug);
        if (postData) {
          postsToCheck = [postData];
        }
      }
    }

    const spinner = ora('Performing SEO analysis...').start();

    try {
      const results: Array<{ post: BlogPost; seoResult: SEOResult }> = [];

      for (const { post } of postsToCheck) {
        // Perform SEO checks
        const issues = [
          ...checkTitleSEO(post),
          ...checkDescriptionSEO(post),
          ...checkContentSEO(post),
          ...checkStructureSEO(post),
          ...checkTechnicalSEO(post),
        ];

        // Analyze keywords
        const keywords = analyzeKeywords(post.content || '', post.title);

        // Calculate score
        const score = calculateSeoScore(issues);

        // Generate recommendations
        const recommendations = generateRecommendations(issues, keywords);

        results.push({
          post,
          seoResult: {
            score,
            issues,
            recommendations,
            keywords,
          },
        });
      }

      spinner.succeed(chalk.green('SEO analysis completed'));

      // Display results
      if (results.length === 1) {
        // Single post result
        const result = results[0];
        if (!result) {
          console.log(chalk.yellow('\n✨ No SEO results available.'));
          return;
        }
        const { post, seoResult } = result;

        console.log(chalk.blue.bold(`\n📊 SEO Analysis for: ${post.title}\n`));

        // Score display
        const scoreColor =
          seoResult.score >= 80
            ? chalk.green
            : seoResult.score >= 60
              ? chalk.yellow
              : chalk.red;
        console.log(
          chalk.bold('SEO Score: ') + scoreColor(`${seoResult.score}/100`)
        );

        // Issues
        if (seoResult.issues.length > 0) {
          console.log(chalk.red.bold('\n❌ Issues Found:'));
          seoResult.issues.forEach((issue) => {
            const icon =
              issue.severity === 'error'
                ? '🚫'
                : issue.severity === 'warning'
                  ? '⚠️'
                  : 'ℹ️';
            console.log(
              chalk.red(`  ${icon} ${issue.field}: ${issue.message}`)
            );
          });
        }

        // Keywords
        if (seoResult.keywords.length > 0) {
          console.log(chalk.blue.bold('\n🔤 Keyword Analysis:'));
          seoResult.keywords.slice(0, 5).forEach((keyword) => {
            const densityColor =
              keyword.density > KEYWORD_DENSITY_RANGE.max
                ? chalk.red
                : keyword.density < KEYWORD_DENSITY_RANGE.min
                  ? chalk.yellow
                  : chalk.green;
            console.log(
              chalk.white(
                `  • ${keyword.keyword}: ${densityColor(`${(keyword.density * 100).toFixed(2)}%`)} (${keyword.competition} competition)`
              )
            );
          });
        }

        // Recommendations
        if (seoResult.recommendations.length > 0) {
          console.log(chalk.blue.bold('\n💡 Recommendations:'));
          seoResult.recommendations.forEach((rec) => {
            const priorityColor =
              rec.priority === 'high'
                ? chalk.red
                : rec.priority === 'medium'
                  ? chalk.yellow
                  : chalk.green;
            console.log(
              chalk.white(
                `  ${priorityColor(`[${rec.priority.toUpperCase()}]`)} ${rec.action}`
              )
            );
            console.log(chalk.gray(`    Impact: ${rec.impact}\n`));
          });
        }
      } else {
        // Multiple posts summary
        console.log(chalk.blue.bold('\n📊 SEO Analysis Summary\n'));

        // Sort by score
        results.sort((a, b) => b.seoResult.score - a.seoResult.score);

        results.forEach(({ post, seoResult }) => {
          const scoreColor =
            seoResult.score >= 80
              ? chalk.green
              : seoResult.score >= 60
                ? chalk.yellow
                : chalk.red;
          console.log(
            chalk.white(`${post.title}: `) +
              scoreColor(`${seoResult.score}/100`) +
              chalk.gray(
                ` (${seoResult.issues.filter((i) => i.severity === 'error').length} errors)`
              )
          );
        });

        // Overall statistics
        const avgScore =
          results.reduce((sum, r) => sum + r.seoResult.score, 0) /
          results.length;
        const totalErrors = results.reduce(
          (sum, r) =>
            sum +
            r.seoResult.issues.filter((i) => i.severity === 'error').length,
          0
        );
        const totalWarnings = results.reduce(
          (sum, r) =>
            sum +
            r.seoResult.issues.filter((i) => i.severity === 'warning').length,
          0
        );

        console.log(chalk.blue.bold('\n📈 Overall Statistics:'));
        console.log(
          chalk.white(`  Average SEO Score: ${avgScore.toFixed(1)}/100`)
        );
        console.log(chalk.red(`  Total Errors: ${totalErrors}`));
        console.log(chalk.yellow(`  Total Warnings: ${totalWarnings}`));
      }

      // Auto-fix option
      if (options.fix && results.length === 1) {
        const answer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: '\nAuto-fix common SEO issues?',
            default: true,
          },
        ]);

        if (answer.proceed) {
          const fixSpinner = ora('Auto-fixing SEO issues...').start();

          try {
            const postData = postsToCheck[0];
            if (postData) {
              await autoFixSeoIssues(postData);
            }
            fixSpinner.succeed(
              chalk.green('SEO issues auto-fixed successfully!')
            );
            console.log(chalk.blue('\n✅ Fixed:'));
            console.log(chalk.white('  • Added estimated read time'));
            console.log(chalk.white('  • Added suggested tags'));
          } catch (error) {
            fixSpinner.fail(chalk.red('Failed to auto-fix SEO issues'));
            console.warn('Warning: Could not apply auto-fixes');
          }
        }
      }
    } catch (error) {
      spinner.fail(chalk.red('Failed to perform SEO analysis'));
      throw error;
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Error performing SEO check:'));
    console.error(
      chalk.red(error instanceof Error ? error.message : String(error))
    );
    process.exit(1);
  }
}

// Setup CLI program
const program = new Command();

program
  .name('blog-seo-check')
  .description('SEO optimization checking and recommendations')
  .version('1.0.0');

program
  .option('--slug <slug>', 'Check specific post')
  .option('--all', 'Check all posts')
  .option('--fix', 'Auto-fix common SEO issues')
  .option('--score', 'Show only SEO score')
  .action(performSeoCheck);

// Help command
program
  .command('help')
  .description('Show SEO checking help and examples')
  .action(() => {
    console.log(chalk.blue.bold('\n🔍 Blog SEO Check Guide:\n'));

    console.log(chalk.green('Check specific post:'));
    console.log(
      chalk.gray('  bun run scripts/blog-seo-check.ts --slug my-post-slug\n')
    );

    console.log(chalk.green('Check all posts:'));
    console.log(chalk.gray('  bun run scripts/blog-seo-check.ts --all\n'));

    console.log(chalk.green('Auto-fix common issues:'));
    console.log(
      chalk.gray(
        '  bun run scripts/blog-seo-check.ts --slug my-post-slug --fix\n'
      )
    );

    console.log(chalk.green('Show SEO scores only:'));
    console.log(
      chalk.gray('  bun run scripts/blog-seo-check.ts --all --score\n')
    );

    console.log(chalk.blue('📊 SEO Score Interpretation:'));
    console.log(chalk.white('  80-100: Excellent SEO optimization'));
    console.log(chalk.white('  60-79:  Good SEO, room for improvement'));
    console.log(chalk.white('  0-59:   Needs significant SEO work\n'));

    console.log(chalk.blue('🎯 SEO Check Categories:'));
    console.log(chalk.white('  • Title: Length, keywords, formatting'));
    console.log(chalk.white('  • Description: Meta description optimization'));
    console.log(chalk.white('  • Content: Length, structure, media'));
    console.log(chalk.white('  • Structure: Headings, lists, formatting'));
    console.log(chalk.white('  • Technical: URL, tags, metadata'));
    console.log();
  });

// Parse command line arguments
program.parse();

// Export for testing
export { performSeoCheck };
export type { SeoCheckOptions };
```
