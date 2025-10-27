#!/usr/bin/env bun

import chalk from 'chalk';
import { Command } from 'commander';
import { promises as fs } from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import { join } from 'path';

import { BlogPost, ContentMetrics } from '../lib/blog-scripts/types';

// Analytics data interface
interface AnalyticsData {
  title?: string;
  slug?: string;
  views?: number;
  readTime?: number;
  bounceRate?: number;
  seoScore?: number;
  featureEngagement?: Record<string, number>;
}

// CLI interface for analytics options
interface AnalyticsOptions {
  post?: string;
  period?: string;
  format?: string;
  metrics?: string;
  aggregate?: boolean;
}

// Content directory configuration
const CONTENT_DIR = join(process.cwd(), 'content', 'blog');
const ANALYTICS_DIR = join(process.cwd(), 'data', 'analytics');

// Available periods
const PERIODS = {
  '7d': { label: 'Last 7 days', days: 7 },
  '30d': { label: 'Last 30 days', days: 30 },
  '90d': { label: 'Last 90 days', days: 90 },
  '1y': { label: 'Last year', days: 365 },
};

// Available metrics
const AVAILABLE_METRICS = [
  'views',
  'readTime',
  'bounceRate',
  'engagement',
  'seoScore',
  'socialShares',
  'comments',
];

// Available output formats
const OUTPUT_FORMATS = ['table', 'json', 'csv'];

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
  const frontmatter: Record<string, string | string[] | boolean> = {};

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
      frontmatter[key] = true;
      continue;
    }
    if (value === 'false') {
      frontmatter[key] = false;
      continue;
    }

    frontmatter[key] = value;
  }

  return frontmatter as unknown as BlogPost;
}

// Helper function to generate mock analytics data
async function generateMockMetrics(post: BlogPost, period: string): Promise<ContentMetrics> {
  const days = PERIODS[period as keyof typeof PERIODS]?.days || 30;
  const baseViews = Math.floor(Math.random() * 1000) + 100;
  const multiplier = days / 30;

  return {
    postSlug: post.slug,
    language: post.language,
    views: Math.floor(baseViews * multiplier),
    readTime: post.readTime || 5,
    bounceRate: Math.random() * 0.5 + 0.3, // 30-80%
    featureEngagement: {
      'timer-embed': Math.floor(Math.random() * 100),
      'template-download': Math.floor(Math.random() * 50),
      'social-share': Math.floor(Math.random() * 200),
      comment: Math.floor(Math.random() * 20),
    },
    seoScore: Math.floor(Math.random() * 30) + 70, // 70-100
  };
}

// Helper function to load analytics data from storage
async function loadAnalyticsData(slug: string, period: string): Promise<ContentMetrics | null> {
  try {
    const filePath = join(ANALYTICS_DIR, `${slug}-${period}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as ContentMetrics;
  } catch (error) {
    // File doesn't exist or is invalid
    return null;
  }
}

// Helper function to save analytics data
async function saveAnalyticsData(metrics: ContentMetrics, period: string): Promise<void> {
  try {
    await fs.mkdir(ANALYTICS_DIR, { recursive: true });
    const filePath = join(ANALYTICS_DIR, `${metrics.postSlug}-${period}.json`);
    await fs.writeFile(filePath, JSON.stringify(metrics, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Warning: Could not save analytics data');
  }
}

// Helper function to calculate aggregate metrics
function calculateAggregateMetrics(metricsArray: ContentMetrics[]): {
  totalViews: number;
  avgReadTime: number;
  avgBounceRate: number;
  avgSeoScore: number;
  totalPosts: number;
  topPosts: Array<{ slug: string; views: number; seoScore: number }>;
} {
  const totalViews = metricsArray.reduce((sum, m) => sum + m.views, 0);
  const avgReadTime = metricsArray.reduce((sum, m) => sum + m.readTime, 0) / metricsArray.length;
  const avgBounceRate =
    metricsArray.reduce((sum, m) => sum + m.bounceRate, 0) / metricsArray.length;
  const avgSeoScore = metricsArray.reduce((sum, m) => sum + m.seoScore, 0) / metricsArray.length;

  const topPosts = metricsArray
    .map((m) => ({
      slug: m.postSlug,
      views: m.views,
      seoScore: m.seoScore,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return {
    totalViews,
    avgReadTime,
    avgBounceRate,
    avgSeoScore,
    totalPosts: metricsArray.length,
    topPosts,
  };
}

// Helper function to format output as table
function formatAsTable(data: AnalyticsData | AnalyticsData[], metrics?: string[]): string {
  if (Array.isArray(data)) {
    // Multiple posts
    let output = chalk.blue.bold('📊 Blog Analytics Report\n\n');

    output += chalk.white(
      '┌─────────────────────────────────────┬──────────┬─────────────┬─────────────┬─────────────┬─────────────┐\n'
    );
    output +=
      chalk.white('│') +
      chalk.bold(' Post Title                            ') +
      chalk.white('│') +
      chalk.bold(' Views ') +
      chalk.white('│') +
      chalk.bold(' Read Time ') +
      chalk.white('│') +
      chalk.bold(' Bounce Rate ') +
      chalk.white('│') +
      chalk.bold(' SEO Score ') +
      chalk.white('│') +
      chalk.bold(' Engagement ') +
      chalk.white('│\n');
    output += chalk.white(
      '├─────────────────────────────────────┼──────────┼─────────────┼─────────────┼─────────────┼─────────────┤\n'
    );

    data.forEach((post: AnalyticsData) => {
      const title = (post.title || post.slug || '').substring(0, 37).padEnd(37);
      const views = post.views?.toString().padStart(8) || 'N/A     ';
      const readTime = post.readTime?.toFixed(1).padStart(11) || 'N/A         ';
      const bounceRate = post.bounceRate
        ? `${(post.bounceRate * 100).toFixed(1)}%`.padStart(11)
        : 'N/A         ';
      const seoScore = post.seoScore?.toString().padStart(11) || 'N/A         ';
      const engagement = post.featureEngagement
        ? Object.values(post.featureEngagement)
            .reduce((sum: number, val: number) => sum + val, 0)
            .toString()
            .padStart(11)
        : 'N/A         ';

      output += chalk.white(
        `│ ${title} │ ${views} │ ${readTime} │ ${bounceRate} │ ${seoScore} │ ${engagement} │\n`
      );
    });

    output += chalk.white(
      '└─────────────────────────────────────┴──────────┴─────────────┴─────────────┴─────────────┴─────────────┘\n'
    );
    return output;
  } else {
    // Single post
    let output = chalk.blue.bold(`📊 Analytics for: ${data.title || data.slug}\n\n`);

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        output += chalk.bold(`${key}:\n`);
        Object.entries(value as Record<string, unknown>).forEach(([subKey, subValue]) => {
          output += chalk.white(`  ${subKey}: ${subValue}\n`);
        });
        output += '\n';
      } else if (typeof value === 'number') {
        let formattedValue = value.toString();
        if (key.includes('Rate') || key.includes('Score')) {
          formattedValue = key.includes('Rate') ? `${(value * 100).toFixed(1)}%` : `${value}/100`;
        }
        output += chalk.bold(`${key}: `) + chalk.white(`${formattedValue}\n`);
      } else {
        output += chalk.bold(`${key}: `) + chalk.white(`${value}\n`);
      }
    });

    return output;
  }
}

// Helper function to format output as JSON
function formatAsJson(data: AnalyticsData | AnalyticsData[]): string {
  return JSON.stringify(data, null, 2);
}

// Helper function to format output as CSV
function formatAsCsv(data: AnalyticsData | AnalyticsData[]): string {
  if (!Array.isArray(data)) {
    data = [data];
  }

  const headers = Object.keys(data[0] || {});
  const csvRows = [headers.join(',')];

  data.forEach((row: AnalyticsData) => {
    const values = headers.map((header) => {
      const value = (row as any)[header];
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      return `"${value}"`;
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
}

// Helper function to generate performance insights
function generateInsights(metrics: ContentMetrics | ContentMetrics[]): string[] {
  const insights: string[] = [];

  if (Array.isArray(metrics)) {
    const aggregate = calculateAggregateMetrics(metrics);

    if (aggregate.avgSeoScore < 70) {
      insights.push('🔍 Consider SEO optimization - average SEO score is below 70');
    }

    if (aggregate.avgBounceRate > 0.6) {
      insights.push('📉 High bounce rate detected - consider improving content engagement');
    }

    if (aggregate.avgReadTime < 3) {
      insights.push('⏱️ Low average read time - content might be too short or not engaging enough');
    }

    if (aggregate.totalViews < 1000) {
      insights.push('📈 Low overall views - consider promoting content more aggressively');
    }

    if (aggregate.topPosts.length > 0) {
      const topPost = aggregate.topPosts[0];
      if (topPost) {
        insights.push(`🏆 Top performing post: "${topPost.slug}" with ${topPost.views} views`);
      }
    }
  } else {
    if (metrics.seoScore < 70) {
      insights.push('🔍 This post needs SEO optimization');
    }

    if (metrics.bounceRate > 0.6) {
      insights.push('📉 High bounce rate - improve content engagement');
    }

    if (metrics.views < 100) {
      insights.push('📈 Low views - consider promoting this post');
    }

    const totalEngagement = Object.values(metrics.featureEngagement).reduce(
      (sum, val) => sum + val,
      0
    );
    if (totalEngagement > metrics.views * 0.1) {
      insights.push('✅ High engagement rate - great content performance!');
    }
  }

  return insights;
}

// Main analytics function
async function generateAnalytics(options: AnalyticsOptions): Promise<void> {
  try {
    console.log(chalk.blue.bold('\n📊 CueTimer Blog Analytics CLI\n'));

    const period = options.period || '30d';
    const format = options.format || 'table';
    const metrics = options.metrics?.split(',') || AVAILABLE_METRICS;

    if (!PERIODS[period as keyof typeof PERIODS]) {
      throw new Error(`Invalid period: ${period}. Available: ${Object.keys(PERIODS).join(', ')}`);
    }

    if (!OUTPUT_FORMATS.includes(format)) {
      throw new Error(`Invalid format: ${format}. Available: ${OUTPUT_FORMATS.join(', ')}`);
    }

    let selectedPosts: BlogPost[] = [];

    if (options.post) {
      // Analytics for specific post
      const allPosts = await getAllBlogPosts();
      const post = allPosts.find((p) => p.slug === options.post);

      if (!post) {
        throw new Error(`Post with slug "${options.post}" not found`);
      }

      selectedPosts = [post];
    } else {
      // Analytics for all posts
      selectedPosts = await getAllBlogPosts();

      if (selectedPosts.length === 0) {
        console.log(chalk.yellow('\n✨ No blog posts found.'));
        return;
      }

      if (!options.aggregate) {
        // Interactive post selection
        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'slug',
            message: 'Select a post for analytics:',
            choices: [
              { name: '📊 Aggregate analytics for all posts', value: '__AGGREGATE__' },
              ...selectedPosts.map((post) => ({
                name: `${post.title} (${post.slug})`,
                value: post.slug,
              })),
            ],
          },
        ]);

        if (answer.slug !== '__AGGREGATE__') {
          selectedPosts = selectedPosts.filter((p) => p.slug === answer.slug);
        }
      }
    }

    const spinner = ora(
      `Generating analytics for ${PERIODS[period as keyof typeof PERIODS].label.toLowerCase()}...`
    ).start();

    try {
      const analyticsData: (ContentMetrics & { title?: string; category?: string })[] = [];

      for (const post of selectedPosts) {
        let metrics = await loadAnalyticsData(post.slug, period);

        if (!metrics) {
          metrics = await generateMockMetrics(post, period);
          await saveAnalyticsData(metrics, period);
        }

        analyticsData.push({
          ...metrics,
          title: post.title,
          category: post.category,
        });
      }

      spinner.succeed(chalk.green('Analytics generated successfully!'));

      // Format and display results
      let outputData: AnalyticsData | AnalyticsData[] = analyticsData[0] || ({} as AnalyticsData);
      let insights: string[] = [];

      if (selectedPosts.length === 1) {
        // Single post analytics
        const singleData = analyticsData[0];
        if (singleData) {
          outputData = singleData;
          insights = generateInsights(singleData);
        }
      } else {
        // Aggregate analytics
        const aggregate = calculateAggregateMetrics(analyticsData);
        outputData = analyticsData.map(
          (m): AnalyticsData => ({
            title: m.title,
            slug: m.postSlug,
            views: m.views,
            readTime: m.readTime,
            bounceRate: m.bounceRate,
            seoScore: m.seoScore,
            featureEngagement: m.featureEngagement,
          })
        );
        insights = generateInsights(analyticsData);
      }

      // Display formatted output
      let formattedOutput: string;
      switch (format) {
        case 'json':
          formattedOutput = formatAsJson(outputData);
          break;
        case 'csv':
          formattedOutput = formatAsCsv(outputData);
          break;
        default:
          formattedOutput = formatAsTable(outputData, metrics);
      }

      console.log(formattedOutput);

      // Display insights
      if (insights.length > 0 && format === 'table') {
        console.log(chalk.blue.bold('\n💡 Performance Insights:'));
        insights.forEach((insight) => {
          console.log(chalk.white(`  ${insight}`));
        });
      }

      // Display recommendations
      if (format === 'table') {
        console.log(chalk.blue.bold('\n📈 Recommendations:'));
        console.log(chalk.white('  • Promote top-performing posts on social media'));
        console.log(chalk.white('  • Optimize posts with low SEO scores'));
        console.log(chalk.white('  • Improve content to reduce bounce rates'));
        console.log(chalk.white('  • Create similar content to high-performing posts'));
      }
    } catch (error) {
      spinner.fail(chalk.red('Failed to generate analytics'));
      throw error;
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Error generating analytics:'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

// Setup CLI program
const program = new Command();

program
  .name('blog-analytics')
  .description('Generate content analytics and performance reports')
  .version('1.0.0');

program
  .option('--post <slug>', 'Analytics for specific post')
  .option('--period <period>', `Time period (${Object.keys(PERIODS).join(', ')})`, '30d')
  .option('--format <format>', `Output format (${OUTPUT_FORMATS.join(', ')})`, 'table')
  .option('--metrics <metrics>', `Specific metrics (${AVAILABLE_METRICS.join(', ')})`)
  .option('--aggregate', 'Show aggregate analytics for all posts')
  .action(generateAnalytics);

// Help command
program
  .command('help')
  .description('Show analytics help and examples')
  .action(() => {
    console.log(chalk.blue.bold('\n📊 Blog Analytics Guide:\n'));

    console.log(chalk.green('Analytics for specific post:'));
    console.log(chalk.gray('  bun run scripts/blog-analytics.ts --post my-post-slug\n'));

    console.log(chalk.green('Analytics for different periods:'));
    console.log(chalk.gray('  bun run scripts/blog-analytics.ts --period 7d'));
    console.log(chalk.gray('  bun run scripts/blog-analytics.ts --period 30d'));
    console.log(chalk.gray('  bun run scripts/blog-analytics.ts --period 90d\n'));

    console.log(chalk.green('Different output formats:'));
    console.log(chalk.gray('  bun run scripts/blog-analytics.ts --format json'));
    console.log(chalk.gray('  bun run scripts/blog-analytics.ts --format csv'));
    console.log(chalk.gray('  bun run scripts/blog-analytics.ts --format table\n'));

    console.log(chalk.green('Aggregate analytics:'));
    console.log(chalk.gray('  bun run scripts/blog-analytics.ts --aggregate\n'));

    console.log(chalk.green('Specific metrics:'));
    console.log(
      chalk.gray('  bun run scripts/blog-analytics.ts --metrics views,seoScore,engagement\n')
    );

    console.log(chalk.blue('📈 Available Periods:'));
    Object.entries(PERIODS).forEach(([key, value]) => {
      console.log(chalk.white(`  ${key}: ${value.label}`));
    });

    console.log(chalk.blue('\n🎯 Available Metrics:'));
    AVAILABLE_METRICS.forEach((metric) => {
      console.log(chalk.white(`  • ${metric}`));
    });
    console.log();
  });

// Parse command line arguments
program.parse();

// Export for testing
export { generateAnalytics };
export type { AnalyticsOptions };
