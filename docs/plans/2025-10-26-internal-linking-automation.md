# Internal Linking Automation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Build sophisticated internal linking automation by extending existing
CueTimer blog infrastructure (75-90% already built)

**Architecture:** Extend existing content processing, similarity scoring, and
SEO analysis systems with intelligent linking capabilities

**Tech Stack:** TypeScript, Next.js, Remark/MDX, existing blog infrastructure,
Commander.js

---

## Task 1: Extend Content Analysis in lib/blog.ts

**Files:**

- Modify: `lib/blog.ts` (add LinkSuggestion interface and getLinkSuggestions
  function)
- Test: `tests/lib/blog.test.ts` (add tests for new linking functionality)

**Step 1: Write failing test for LinkSuggestion interface**

```typescript
// tests/lib/blog.test.ts
import { getLinkSuggestions } from '../../lib/blog';

describe('Internal Linking - getLinkSuggestions', () => {
  it('should return link suggestions for a given article', () => {
    const suggestions = getLinkSuggestions('test-article', 3, 'en');

    expect(Array.isArray(suggestions)).toBe(true);
    expect(suggestions.length).toBeLessThanOrEqual(3);

    if (suggestions.length > 0) {
      const suggestion = suggestions[0];
      expect(suggestion).toHaveProperty('slug');
      expect(suggestion).toHaveProperty('title');
      expect(suggestion).toHaveProperty('score');
      expect(suggestion).toHaveProperty('reason');
      expect(suggestion).toHaveProperty('suggestedAnchor');
      expect(suggestion).toHaveProperty('contextExcerpt');
      expect(typeof suggestion.score).toBe('number');
      expect(suggestion.score).toBeGreaterThanOrEqual(0);
      expect(suggestion.score).toBeLessThanOrEqual(1);
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test tests/lib/blog.test.ts` Expected: FAIL with "getLinkSuggestions
is not defined"

**Step 3: Add LinkSuggestion interface to lib/blog.ts**

```typescript
// lib/blog.ts - Add after existing interfaces
interface LinkSuggestion {
  slug: string;
  title: string;
  score: number;
  reason: 'semantic' | 'category' | 'tag' | 'keyword';
  suggestedAnchor: string;
  contextExcerpt: string;
}
```

**Step 4: Write minimal getLinkSuggestions implementation**

```typescript
// lib/blog.ts - Add after existing functions
export function getLinkSuggestions(
  currentSlug: string,
  maxSuggestions: number = 5,
  locale?: string
): LinkSuggestion[] {
  // LEVERAGE existing getAllPosts() for complete content index
  const allPosts = getAllPosts();
  const currentPost = allPosts.find((post) => post.slug === currentSlug);

  if (!currentPost) return [];

  // BUILD ON existing getRelatedPosts() similarity scoring
  const relatedPosts = getRelatedPosts(currentPost, maxSuggestions * 2);

  // ENHANCE with link-specific scoring
  const suggestions: LinkSuggestion[] = relatedPosts
    .filter(
      (post) => post.slug !== currentSlug && post.locale === currentPost.locale
    )
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      score: calculateLinkingScore(currentPost, post),
      reason: determineLinkReason(
        currentPost,
        post
      ) as LinkSuggestion['reason'],
      suggestedAnchor: generateOptimalAnchor(currentPost.content, post),
      contextExcerpt: generateExcerpt(post.content, 100),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions);

  return suggestions;
}
```

**Step 5: Run test to verify it passes**

Run: `bun test tests/lib/blog.test.ts` Expected: FAIL with missing helper
functions

**Step 6: Add minimal helper functions**

````typescript
// lib/blog.ts - Add helper functions
function calculateLinkingScore(source: BlogPost, target: BlogPost): number {
  // BUILD ON existing category/tag matching
  const categoryMatch = source.category === target.category ? 0.3 : 0;
  const tagMatches = source.tags.filter((tag) =>
    target.tags.includes(tag)
  ).length;
  const tagScore = Math.min(tagMatches * 0.1, 0.3);

  // Simple semantic score based on content overlap
  const sourceWords = new Set(source.content.toLowerCase().split(/\W+/));
  const targetWords = new Set(target.content.toLowerCase().split(/\W+/));
  const overlap = [...sourceWords].filter((word) =>
    targetWords.has(word)
  ).length;
  const semanticScore = Math.min(overlap / Math.max(sourceWords.size, 1), 0.4);

  return Math.min(categoryMatch + tagScore + semanticScore, 1.0);
}

function determineLinkReason(source: BlogPost, target: BlogPost): string {
  if (source.category === target.category) return 'category';
  if (source.tags.some((tag) => target.tags.includes(tag))) return 'tag';
  return 'semantic';
}

function generateOptimalAnchor(
  sourceContent: string,
  targetPost: BlogPost
): string {
  // Use title if it's concise
  if (targetPost.title.length < 60) {
    return targetPost.title;
  }

  // Use first significant word from title
  const words = targetPost.title.split(' ').filter((word) => word.length > 3);
  return words[0] || targetPost.title.substring(0, 20);
}

function generateExcerpt(content: string, length: number = 100): string {
  // Remove markdown and create excerpt
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_~]/g, '');

  return cleanContent.substring(0, length).trim() + '...';
}
````

**Step 7: Run test to verify it passes**

Run: `bun test tests/lib/blog.test.ts` Expected: PASS

**Step 8: Commit**

```bash
git add lib/blog.ts tests/lib/blog.test.ts
git commit -m "feat: add getLinkSuggestions function with LinkSuggestion interface"
```

---

## Task 2: Enhance Content Discovery in lib/blog-utils.ts

**Files:**

- Modify: `lib/blog-utils.ts` (add findLinkingOpportunities function)
- Test: `tests/lib/blog-utils.test.ts` (add tests for new functionality)

**Step 1: Write failing test for findLinkingOpportunities**

```typescript
// tests/lib/blog-utils.test.ts
import { findLinkingOpportunities } from '../../lib/blog-utils';
import { getAllPosts } from '../../lib/blog';

describe('Internal Linking - findLinkingOpportunities', () => {
  it('should find linking opportunities in content', () => {
    const sourceContent =
      'This is about conference timers and event management';
    const targetPosts = getAllPosts().slice(0, 5);
    const opportunities = findLinkingOpportunities(
      sourceContent,
      targetPosts,
      3
    );

    expect(Array.isArray(opportunities)).toBe(true);
    expect(opportunities.length).toBeLessThanOrEqual(3);

    if (opportunities.length > 0) {
      const opportunity = opportunities[0];
      expect(opportunity).toHaveProperty('post');
      expect(opportunity).toHaveProperty('opportunities');
      expect(Array.isArray(opportunity.opportunities)).toBe(true);
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test tests/lib/blog-utils.test.ts` Expected: FAIL with
"findLinkingOpportunities is not defined"

**Step 3: Add findLinkingOpportunities function to lib/blog-utils.ts**

```typescript
// lib/blog-utils.ts - Add after existing functions
export function findLinkingOpportunities(
  sourceContent: string,
  targetPosts: BlogPost[],
  maxResults: number = 10
): Array<{ post: BlogPost; opportunities: string[] }> {
  const opportunities: Array<{ post: BlogPost; opportunities: string[] }> = [];

  // Extract important keywords from source content
  const sourceKeywords = extractImportantKeywords(sourceContent);

  targetPosts.forEach((post) => {
    const linkingContexts = findLinkingContexts(
      sourceContent,
      post,
      sourceKeywords
    );

    if (linkingContexts.length > 0) {
      opportunities.push({
        post,
        opportunities: linkingContexts,
      });
    }
  });

  return opportunities
    .sort((a, b) => b.opportunities.length - a.opportunities.length)
    .slice(0, maxResults);
}
```

**Step 4: Add helper functions**

```typescript
// lib/blog-utils.ts - Add helper functions
function extractImportantKeywords(content: string): string[] {
  // Simple keyword extraction - filter out common words
  const commonWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'as',
    'is',
    'was',
    'are',
    'were',
    'been',
    'be',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'must',
    'can',
    'this',
    'that',
    'these',
    'those',
    'i',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
  ]);

  return content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.has(word))
    .slice(0, 20);
}

function findLinkingContexts(
  sourceContent: string,
  targetPost: BlogPost,
  sourceKeywords: string[]
): string[] {
  const contexts: string[] = [];
  const sentences = sourceContent.split(/[.!?]+/);

  // Extract keywords from target post
  const targetKeywords = extractImportantKeywords(targetPost.content);
  const sharedKeywords = sourceKeywords.filter((kw) =>
    targetKeywords.includes(kw)
  );

  sentences.forEach((sentence) => {
    const hasRelevantKeywords = sharedKeywords.some((kw) =>
      sentence.toLowerCase().includes(kw.toLowerCase())
    );

    if (
      hasRelevantKeywords &&
      !alreadyContainsLink(sentence, targetPost.slug)
    ) {
      contexts.push(sentence.trim());
    }
  });

  return contexts.slice(0, 3); // Max 3 contexts per target
}

function alreadyContainsLink(sentence: string, slug: string): boolean {
  // Check if sentence already contains a link to this slug
  return sentence.includes(`/${slug}`) || sentence.includes(`"${slug}"`);
}
```

**Step 5: Run test to verify it passes**

Run: `bun test tests/lib/blog-utils.test.ts` Expected: PASS

**Step 6: Commit**

```bash
git add lib/blog-utils.ts tests/lib/blog-utils.test.ts
git commit -m "feat: add findLinkingOpportunities function for content discovery"
```

---

## Task 3: Enhance SEO Analysis in scripts/blog-seo-check.ts

**Files:**

- Modify: `scripts/blog-seo-check.ts` (add internal linking analysis)
- Test: `tests/scripts/blog-seo-check.test.ts` (add tests for new functionality)

**Step 1: Write failing test for internal linking analysis**

```typescript
// tests/scripts/blog-seo-check.test.ts
import { analyzeInternalLinkingOpportunities } from '../../scripts/blog-seo-check';
import { getAllPosts } from '../../lib/blog';

describe('SEO Analysis - Internal Linking', () => {
  it('should analyze internal linking opportunities', () => {
    const content =
      'This content is about conference timers and event management';
    const allPosts = getAllPosts();
    const currentSlug = 'test-article';

    const opportunities = analyzeInternalLinkingOpportunities(
      content,
      allPosts,
      currentSlug
    );

    expect(Array.isArray(opportunities)).toBe(true);

    if (opportunities.length > 0) {
      const opportunity = opportunities[0];
      expect(opportunity).toHaveProperty('targetSlug');
      expect(opportunity).toHaveProperty('targetTitle');
      expect(opportunity).toHaveProperty('relevanceScore');
      expect(opportunity).toHaveProperty('suggestedAnchors');
      expect(opportunity).toHaveProperty('reasoning');
      expect(Array.isArray(opportunity.suggestedAnchors)).toBe(true);
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test tests/scripts/blog-seo-check.test.ts` Expected: FAIL with
"analyzeInternalLinkingOpportunities is not defined"

**Step 3: Add interface and function to scripts/blog-seo-check.ts**

```typescript
// scripts/blog-seo-check.ts - Add after existing interfaces
interface InternalLinkingRecommendation {
  targetSlug: string;
  targetTitle: string;
  relevanceScore: number;
  suggestedAnchors: string[];
  reasoning: string;
}

/**
 * ENHANCED: Add internal linking recommendations to existing SEO analysis
 */
export function analyzeInternalLinkingOpportunities(
  content: string,
  allPosts: BlogPost[],
  currentSlug: string
): InternalLinkingRecommendation[] {
  // LEVERAGE existing analyzeKeywords() function
  const keywords = analyzeKeywords(content);

  // BUILD ON existing keyword frequency analysis
  const opportunities: InternalLinkingRecommendation[] = [];

  allPosts.forEach((post) => {
    if (post.slug === currentSlug) return;

    // USE existing search logic for finding relevant content
    const relevanceScore = calculateKeywordRelevance(keywords, post);

    if (relevanceScore > 0.3) {
      opportunities.push({
        targetSlug: post.slug,
        targetTitle: post.title,
        relevanceScore,
        suggestedAnchors: findBestAnchors(content, post, keywords),
        reasoning: generateReasoning(keywords, post, relevanceScore),
      });
    }
  });

  return opportunities
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5);
}
```

**Step 4: Add helper functions**

```typescript
// scripts/blog-seo-check.ts - Add helper functions
function calculateKeywordRelevance(keywords: any, post: BlogPost): number {
  // Simple relevance calculation based on keyword overlap
  const postKeywords = analyzeKeywords(post.content);
  const overlap = Object.keys(keywords).filter((key) => postKeywords[key]);

  if (overlap.length === 0) return 0;

  // Calculate weighted relevance
  const relevance = overlap.reduce((score, key) => {
    return score + keywords[key].frequency * postKeywords[key].frequency;
  }, 0);

  return Math.min(relevance / 10, 1.0); // Normalize to 0-1
}

function findBestAnchors(
  content: string,
  post: BlogPost,
  keywords: any
): string[] {
  const anchors: string[] = [];

  // Use title if it appears in content
  if (content.toLowerCase().includes(post.title.toLowerCase())) {
    anchors.push(post.title);
  }

  // Use top keywords that match
  Object.keys(keywords).forEach((keyword) => {
    if (
      post.title.toLowerCase().includes(keyword.toLowerCase()) ||
      post.content.toLowerCase().includes(keyword.toLowerCase())
    ) {
      anchors.push(keyword);
    }
  });

  return anchors.slice(0, 3);
}

function generateReasoning(
  keywords: any,
  post: BlogPost,
  relevanceScore: number
): string {
  const sharedKeywords = Object.keys(keywords).filter(
    (key) =>
      post.title.toLowerCase().includes(key.toLowerCase()) ||
      post.content.toLowerCase().includes(key.toLowerCase())
  );

  if (sharedKeywords.length > 0) {
    return `High relevance (${(relevanceScore * 100).toFixed(1)}%) based on shared keywords: ${sharedKeywords.join(', ')}`;
  }

  return `Moderate relevance (${(relevanceScore * 100).toFixed(1)}%) based on content similarity`;
}
```

**Step 5: Run test to verify it passes**

Run: `bun test tests/scripts/blog-seo-check.test.ts` Expected: PASS

**Step 6: Commit**

```bash
git add scripts/blog-seo-check.ts tests/scripts/blog-seo-check.test.ts
git commit -m "feat: add analyzeInternalLinkingOpportunities to SEO analysis"
```

---

## Task 4: Create MDX Link Inserter Plugin

**Files:**

- Create: `lib/mdx-plugins/internal-link-inserter.ts`
- Test: `tests/lib/mdx-plugins/internal-link-inserter.test.ts`

**Step 1: Write failing test for remark plugin**

```typescript
// tests/lib/mdx-plugins/internal-link-inserter.test.ts
import { remarkInternalLinkInserter } from '../../lib/mdx-plugins/internal-link-inserter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';

describe('Internal Link Inserter Plugin', () => {
  it('should insert internal links into markdown content', async () => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkInternalLinkInserter, {
        currentSlug: 'test-article',
        maxLinks: 2,
        locale: 'en',
      })
      .use(remarkStringify);

    const markdown = 'This is about conference timers and event management.';
    const result = await processor.process(markdown);

    expect(String(result)).toContain('[');
    expect(String(result)).toContain('](');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test tests/lib/mdx-plugins/internal-link-inserter.test.ts` Expected:
FAIL with "Cannot find module"

**Step 3: Create the plugin file structure**

```bash
mkdir -p lib/mdx-plugins
```

**Step 4: Write minimal remark plugin implementation**

```typescript
// lib/mdx-plugins/internal-link-inserter.ts
import { visit } from 'unist-util-visit';
import type { Root, Text, Link } from 'mdast';
import { getLinkSuggestions } from '../blog';

export interface InternalLinkInserterOptions {
  currentSlug: string;
  maxLinks?: number;
  locale?: string;
}

/**
 * NEW: Custom remark plugin that integrates with existing MDX processing
 */
export function remarkInternalLinkInserter(
  options: InternalLinkInserterOptions
) {
  const { currentSlug, maxLinks = 5, locale = 'en' } = options;

  return (tree: Root) => {
    // LEVERAGE existing getLinkSuggestions() function
    const suggestions = getLinkSuggestions(currentSlug, maxLinks, locale);
    const insertedLinks = new Set<string>();

    // BUILD ON existing MDX processing infrastructure
    visit(tree, 'text', (node: Text, index, parent) => {
      if (insertedLinks.size >= maxLinks) return;

      for (const suggestion of suggestions) {
        if (insertedLinks.has(suggestion.slug)) continue;

        const text = node.value;
        const anchorIndex = text
          .toLowerCase()
          .indexOf(suggestion.suggestedAnchor.toLowerCase());

        if (anchorIndex !== -1) {
          // Insert link using existing component infrastructure
          const beforeText = text.substring(0, anchorIndex);
          const linkText = text.substring(
            anchorIndex,
            anchorIndex + suggestion.suggestedAnchor.length
          );
          const afterText = text.substring(
            anchorIndex + suggestion.suggestedAnchor.length
          );

          // Create link node that works with existing rendering system
          const linkNode: Link = {
            type: 'link',
            url: `/${locale}/blog/${suggestion.slug}`,
            title: suggestion.title,
            children: [{ type: 'text', value: linkText }],
          };

          // Replace text node with link + surrounding text
          if (parent && typeof index === 'number') {
            const newChildren = [];
            if (beforeText) {
              newChildren.push({ type: 'text', value: beforeText });
            }
            newChildren.push(linkNode);
            if (afterText) {
              newChildren.push({ type: 'text', value: afterText });
            }
            parent.children.splice(index, 1, ...newChildren);
          }

          insertedLinks.add(suggestion.slug);
          break;
        }
      }
    });

    return tree;
  };
}
```

**Step 5: Install required dependencies**

```bash
bun add unist-util-visit remark-parse remark-stringify unified
bun add -d @types/mdast
```

**Step 6: Run test to verify it passes**

Run: `bun test tests/lib/mdx-plugins/internal-link-inserter.test.ts` Expected:
PASS

**Step 7: Commit**

```bash
git add lib/mdx-plugins/internal-link-inserter.ts tests/lib/mdx-plugins/internal-link-inserter.test.ts package.json bun.lockb
git commit -m "feat: add remarkInternalLinkInserter plugin for automated link insertion"
```

---

## Task 5: Create CLI Tool for Internal Linking

**Files:**

- Create: `lib/blog-scripts/cli/internal-linking.ts`
- Test: `tests/lib/blog-scripts/cli/internal-linking.test.ts`

**Step 1: Write failing test for CLI functionality**

```typescript
// tests/lib/blog-scripts/cli/internal-linking.test.ts
import { Command } from 'commander';
import { runInternalLinkingCLI } from '../../lib/blog-scripts/cli/internal-linking';

describe('Internal Linking CLI', () => {
  it('should handle analyze command', async () => {
    const mockProcess = {
      argv: ['node', 'cli', 'analyze', '--slug', 'test-article'],
    };

    // Test that CLI doesn't crash
    expect(async () => {
      await runInternalLinkingCLI(mockProcess.argv);
    }).not.toThrow();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test tests/lib/blog-scripts/cli/internal-linking.test.ts` Expected:
FAIL with "Cannot find module"

**Step 3: Create CLI directory structure**

```bash
mkdir -p lib/blog-scripts/cli
```

**Step 4: Write CLI implementation**

```typescript
// lib/blog-scripts/cli/internal-linking.ts
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getLinkSuggestions } from '../../blog';
import { analyzeInternalLinkingOpportunities } from '../../../scripts/blog-seo-check';
import { getAllPosts } from '../../blog';

export function runInternalLinkingCLI(argv: string[]) {
  const program = new Command();

  program
    .name('blog:internal-links')
    .description(
      'Internal linking automation leveraging existing infrastructure'
    )
    .version('1.0.0');

  /**
   * ENHANCED: Analyze command - uses existing content analysis functions
   */
  program
    .command('analyze')
    .description(
      'Analyze and suggest internal links using existing infrastructure'
    )
    .option('-s, --slug <slug>', 'Analyze specific article')
    .option('-l, --locale <locale>', 'Filter by locale', 'en')
    .option('--limit <number>', 'Max suggestions per article', '5')
    .option('--export <path>', 'Export results to JSON file')
    .action(async (options) => {
      const spinner = ora(
        'Analyzing content using existing infrastructure...'
      ).start();

      try {
        // LEVERAGE existing getAllPosts() function
        const allPosts = getAllPosts();
        const filteredPosts =
          options.locale !== 'all'
            ? allPosts.filter((post) => post.locale === options.locale)
            : allPosts;

        if (options.slug) {
          // Analyze single article using enhanced getLinkSuggestions()
          const suggestions = getLinkSuggestions(
            options.slug,
            parseInt(options.limit),
            options.locale
          );

          spinner.succeed('Analysis complete!');

          // Display results
          console.log(chalk.bold('\n🔗 Link Suggestions:\n'));
          console.log(chalk.cyan(`Article: ${options.slug}\n`));

          suggestions.forEach((suggestion, i) => {
            console.log(chalk.white(`  ${i + 1}. ${suggestion.title}`));
            console.log(
              chalk.gray(`     Score: ${(suggestion.score * 100).toFixed(1)}%`)
            );
            console.log(chalk.gray(`     Reason: ${suggestion.reason}`));
            console.log(
              chalk.gray(`     Anchor: "${suggestion.suggestedAnchor}"\n`)
            );
          });

          // Export if requested
          if (options.export) {
            const fs = require('fs');
            fs.writeFileSync(
              options.export,
              JSON.stringify({ [options.slug]: suggestions }, null, 2)
            );
            console.log(chalk.green(`✓ Results exported to ${options.export}`));
          }
        } else {
          spinner.succeed('Analysis complete!');
          console.log(chalk.bold('\n📊 Internal Linking Analysis:\n'));
          console.log(
            chalk.white(`  Articles analyzed: ${filteredPosts.length}\n`)
          );
        }
      } catch (error) {
        spinner.fail('Analysis failed');
        console.error(chalk.red(error));
        process.exit(1);
      }
    });

  /**
   * NEW: Stats command - leveraging existing content analysis
   */
  program
    .command('stats')
    .description('Show internal linking statistics using existing data')
    .option('-l, --locale <locale>', 'Filter by locale', 'all')
    .action(async (options) => {
      const spinner = ora('Calculating linking statistics...').start();

      try {
        // USE existing getAllPosts() for data
        const allPosts = getAllPosts();
        const filteredPosts =
          options.locale !== 'all'
            ? allPosts.filter((post) => post.locale === options.locale)
            : allPosts;

        // LEVERAGE existing content processing
        const stats = calculateLinkingStatistics(filteredPosts);

        spinner.succeed('Statistics calculated!');

        console.log(chalk.bold('\n📈 Internal Linking Statistics:\n'));
        console.log(chalk.white(`  Total Articles: ${stats.totalArticles}`));
        console.log(
          chalk.white(
            `  Articles with Internal Links: ${stats.withInternalLinks}`
          )
        );
        console.log(
          chalk.white(
            `  Average Links per Article: ${stats.avgLinksPerArticle.toFixed(2)}`
          )
        );
        console.log(
          chalk.white(`  Link Coverage: ${stats.linkCoverage.toFixed(2)}%\n`)
        );
      } catch (error) {
        spinner.fail('Failed to calculate statistics');
        console.error(chalk.red(error));
        process.exit(1);
      }
    });

  program.parse(argv);
}

/**
 * NEW: Calculate linking statistics using existing content data
 */
function calculateLinkingStatistics(posts: BlogPost[]) {
  const totalArticles = posts.length;
  const articlesWithLinks = posts.filter((post) =>
    hasInternalLinks(post.content)
  ).length;

  const totalLinks = posts.reduce(
    (sum, post) => sum + countInternalLinks(post.content),
    0
  );

  return {
    totalArticles,
    withInternalLinks: articlesWithLinks,
    avgLinksPerArticle: totalLinks / totalArticles,
    linkCoverage: (articlesWithLinks / totalArticles) * 100,
  };
}

function hasInternalLinks(content: string): boolean {
  // Simple check for internal links
  return /\[([^\]]+)\]\(\/blog\/([^)]+)\)/.test(content);
}

function countInternalLinks(content: string): number {
  const matches = content.match(/\[([^\]]+)\]\(\/blog\/([^)]+)\)/g);
  return matches ? matches.length : 0;
}
```

**Step 5: Update test to use actual CLI functions**

```typescript
// tests/lib/blog-scripts/cli/internal-linking.test.ts
import { calculateLinkingStatistics } from '../../lib/blog-scripts/cli/internal-linking';
import { getAllPosts } from '../../lib/blog';

describe('Internal Linking CLI', () => {
  describe('calculateLinkingStatistics', () => {
    it('should calculate linking statistics correctly', () => {
      const posts = getAllPosts().slice(0, 3);
      const stats = calculateLinkingStatistics(posts);

      expect(stats).toHaveProperty('totalArticles');
      expect(stats).toHaveProperty('withInternalLinks');
      expect(stats).toHaveProperty('avgLinksPerArticle');
      expect(stats).toHaveProperty('linkCoverage');

      expect(typeof stats.totalArticles).toBe('number');
      expect(typeof stats.avgLinksPerArticle).toBe('number');
      expect(typeof stats.linkCoverage).toBe('number');
    });
  });
});
```

**Step 6: Install required dependencies**

```bash
bun add commander chalk ora
```

**Step 7: Run test to verify it passes**

Run: `bun test tests/lib/blog-scripts/cli/internal-linking.test.ts` Expected:
PASS

**Step 8: Commit**

```bash
git add lib/blog-scripts/cli/internal-linking.ts tests/lib/blog-scripts/cli/internal-linking.test.ts package.json bun.lockb
git commit -m "feat: add internal linking CLI with analyze and stats commands"
```

---

## Task 6: Integration with Package.json Scripts

**Files:**

- Modify: `package.json` (add CLI script)
- Test: Integration test

**Step 1: Add script to package.json**

```json
// package.json - Add to scripts section
{
  "scripts": {
    "blog:internal-links": "bun run lib/blog-scripts/cli/internal-linking.ts"
  }
}
```

**Step 2: Test CLI integration**

```bash
bun run blog:internal-links --help
```

Expected: Show help for internal linking CLI

**Step 3: Test analyze command**

```bash
bun run blog:internal-links analyze --help
```

Expected: Show help for analyze command

**Step 4: Test stats command**

```bash
bun run blog:internal-links stats --help
```

Expected: Show help for stats command

**Step 5: Commit**

```bash
git add package.json
git commit -m "feat: add blog:internal-links script to package.json"
```

---

## Task 7: End-to-End Integration Testing

**Files:**

- Test: `tests/integration/internal-linking.test.ts`

**Step 1: Write comprehensive integration test**

```typescript
// tests/integration/internal-linking.test.ts
import { getLinkSuggestions } from '../../lib/blog';
import { findLinkingOpportunities } from '../../lib/blog-utils';
import { analyzeInternalLinkingOpportunities } from '../../scripts/blog-seo-check';
import { remarkInternalLinkInserter } from '../../lib/mdx-plugins/internal-link-inserter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { getAllPosts } from '../../lib/blog';

describe('Internal Linking - Integration Tests', () => {
  let testPosts: any[];

  beforeAll(() => {
    testPosts = getAllPosts().slice(0, 5);
  });

  describe('Content Analysis Integration', () => {
    it('should generate consistent suggestions across all functions', () => {
      if (testPosts.length < 2) return;

      const sourcePost = testPosts[0];
      const targetPosts = testPosts.slice(1);

      // Test getLinkSuggestions
      const suggestions = getLinkSuggestions(
        sourcePost.slug,
        3,
        sourcePost.locale
      );
      expect(Array.isArray(suggestions)).toBe(true);

      // Test findLinkingOpportunities
      const opportunities = findLinkingOpportunities(
        sourcePost.content,
        targetPosts,
        3
      );
      expect(Array.isArray(opportunities)).toBe(true);

      // Test analyzeInternalLinkingOpportunities
      const seoOpportunities = analyzeInternalLinkingOpportunities(
        sourcePost.content,
        targetPosts,
        sourcePost.slug
      );
      expect(Array.isArray(seoOpportunities)).toBe(true);
    });

    it('should integrate with remark plugin for link insertion', async () => {
      if (testPosts.length < 2) return;

      const sourcePost = testPosts[0];

      const processor = unified()
        .use(remarkParse)
        .use(remarkInternalLinkInserter, {
          currentSlug: sourcePost.slug,
          maxLinks: 2,
          locale: sourcePost.locale,
        })
        .use(remarkStringify);

      const markdown = sourcePost.content.substring(0, 200) + '...';
      const result = await processor.process(markdown);

      // Should process without errors
      expect(String(result)).toBeDefined();
    });
  });

  describe('Multi-language Support', () => {
    it('should work across different locales', () => {
      const postsByLocale = testPosts.reduce(
        (acc, post) => {
          acc[post.locale] = acc[post.locale] || [];
          acc[post.locale].push(post);
          return acc;
        },
        {} as Record<string, any[]>
      );

      Object.entries(postsByLocale).forEach(([locale, posts]) => {
        if (posts.length > 0) {
          const suggestions = getLinkSuggestions(posts[0].slug, 3, locale);
          expect(Array.isArray(suggestions)).toBe(true);
        }
      });
    });
  });
});
```

**Step 2: Run integration tests**

```bash
bun test tests/integration/internal-linking.test.ts
```

Expected: All integration tests pass

**Step 3: Commit**

```bash
git add tests/integration/internal-linking.test.ts
git commit -m "test: add comprehensive integration tests for internal linking system"
```

---

## Task 8: Documentation and Usage Examples

**Files:**

- Create: `docs/internal-linking-usage.md`
- Modify: `README.md` (add internal linking section)

**Step 1: Create usage documentation**

````markdown
<!-- docs/internal-linking-usage.md -->

# Internal Linking Automation - Usage Guide

## Overview

The internal linking system automatically suggests and inserts relevant internal
links across your blog content, leveraging existing CueTimer infrastructure.

## CLI Commands

### Analyze Single Article

```bash
bun run blog:internal-links analyze --slug "your-article-slug" --limit 5
```
````

### Analyze All Articles

```bash
bun run blog:internal-links analyze --locale en --export ./link-suggestions.json
```

### View Linking Statistics

```bash
bun run blog:internal-links stats --locale en
```

## Programmatic Usage

### Get Link Suggestions

```typescript
import { getLinkSuggestions } from './lib/blog';

const suggestions = getLinkSuggestions('article-slug', 5, 'en');
console.log(suggestions);
// Output: [{ slug: 'related-article', title: 'Related Article', score: 0.85, ... }]
```

### Find Linking Opportunities

```typescript
import { findLinkingOpportunities } from './lib/blog-utils';

const opportunities = findLinkingOpportunities(content, targetPosts, 10);
console.log(opportunities);
// Output: [{ post: BlogPost, opportunities: ['context 1', 'context 2'] }]
```

### SEO Analysis

```typescript
import { analyzeInternalLinkingOpportunities } from './scripts/blog-seo-check';

const analysis = analyzeInternalLinkingOpportunities(
  content,
  allPosts,
  currentSlug
);
console.log(analysis);
// Output: [{ targetSlug: 'target', relevanceScore: 0.9, suggestedAnchors: ['anchor'], ... }]
```

## MDX Plugin Integration

```typescript
import { remarkInternalLinkInserter } from './lib/mdx-plugins/internal-link-inserter';

const processor = unified()
  .use(remarkParse)
  .use(remarkInternalLinkInserter, {
    currentSlug: 'current-article',
    maxLinks: 5,
    locale: 'en',
  })
  .use(remarkStringify);
```

## Configuration

### Link Scoring

The system uses multiple factors for link scoring:

- **Category Match**: 30% weight
- **Tag Overlap**: Up to 30% weight
- **Content Similarity**: Up to 40% weight

### Filtering

- **Minimum Score**: Only suggestions with >30% relevance
- **Maximum Links**: Configurable (default: 5 per article)
- **Locale Matching**: Only suggests links in same language

## Best Practices

1. **Review Suggestions**: Always review automated suggestions before applying
2. **Context Matters**: Ensure suggested links fit naturally in content
3. **Anchor Text**: Use descriptive anchor text that benefits users
4. **Link Diversity**: Don't overlink to the same content
5. **Relevance First**: Prioritize user value over SEO metrics

## Troubleshooting

### No Suggestions Generated

- Check if content has sufficient keyword overlap with other posts
- Verify target posts exist in the same locale
- Ensure content processing is working correctly

### Poor Quality Suggestions

- Review content categories and tags for better grouping
- Check if content analysis is extracting relevant keywords
- Consider adjusting relevance thresholds

### Performance Issues

- Limit analysis to specific locales or content subsets
- Use caching for frequently accessed content
- Consider incremental updates for large content sets

````

**Step 2: Update README.md**

```markdown
<!-- README.md - Add to features section -->
## Internal Linking Automation

Automatically generate and insert intelligent internal links across your blog content:

- **Smart Suggestions**: Uses semantic analysis and content similarity
- **Multi-language Support**: Works across all supported locales
- **CLI Tools**: Analyze and manage internal links from command line
- **SEO Optimized**: Improves site structure and content discoverability

```bash
# Analyze internal linking opportunities
bun run blog:internal-links analyze --slug "your-article"

# View linking statistics
bun run blog:internal-links stats --locale en

# Export suggestions for review
bun run blog:internal-links analyze --export ./suggestions.json
````

See [Internal Linking Usage Guide](./docs/internal-linking-usage.md) for
detailed documentation.

````

**Step 3: Commit**

```bash
git add docs/internal-linking-usage.md README.md
git commit -m "docs: add comprehensive usage guide and README section for internal linking"
````

---

## Task 9: Performance Optimization and Caching

**Files:**

- Modify: `lib/blog.ts` (add caching to getLinkSuggestions)
- Test: `tests/lib/blog-performance.test.ts`

**Step 1: Write failing test for caching**

```typescript
// tests/lib/blog-performance.test.ts
import { getLinkSuggestions } from '../../lib/blog';

describe('Internal Linking - Performance', () => {
  it('should cache suggestions for same input', () => {
    const start1 = performance.now();
    const suggestions1 = getLinkSuggestions('test-article', 5, 'en');
    const time1 = performance.now() - start1;

    const start2 = performance.now();
    const suggestions2 = getLinkSuggestions('test-article', 5, 'en');
    const time2 = performance.now() - start2;

    expect(suggestions1).toEqual(suggestions2);
    expect(time2).toBeLessThan(time1); // Second call should be faster due to caching
  });
});
```

**Step 2: Add caching to getLinkSuggestions**

```typescript
// lib/blog.ts - Add caching functionality
const linkSuggestionsCache = new Map<string, LinkSuggestion[]>();

export function getLinkSuggestions(
  currentSlug: string,
  maxSuggestions: number = 5,
  locale?: string
): LinkSuggestion[] {
  // Create cache key
  const cacheKey = `${currentSlug}-${maxSuggestions}-${locale || 'default'}`;

  // Check cache first
  if (linkSuggestionsCache.has(cacheKey)) {
    return linkSuggestionsCache.get(cacheKey)!;
  }

  // Original implementation...
  const allPosts = getAllPosts();
  const currentPost = allPosts.find((post) => post.slug === currentSlug);

  if (!currentPost) return [];

  const relatedPosts = getRelatedPosts(currentPost, maxSuggestions * 2);
  const suggestions: LinkSuggestion[] = relatedPosts
    .filter(
      (post) => post.slug !== currentSlug && post.locale === currentPost.locale
    )
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      score: calculateLinkingScore(currentPost, post),
      reason: determineLinkReason(
        currentPost,
        post
      ) as LinkSuggestion['reason'],
      suggestedAnchor: generateOptimalAnchor(currentPost.content, post),
      contextExcerpt: generateExcerpt(post.content, 100),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions);

  // Cache the result
  linkSuggestionsCache.set(cacheKey, suggestions);

  return suggestions;
}

/**
 * Clear the link suggestions cache
 */
export function clearLinkSuggestionsCache(): void {
  linkSuggestionsCache.clear();
}
```

**Step 3: Run performance tests**

```bash
bun test tests/lib/blog-performance.test.ts
```

Expected: Tests pass, showing caching works

**Step 4: Commit**

```bash
git add lib/blog.ts tests/lib/blog-performance.test.ts
git commit -m "perf: add caching to getLinkSuggestions for improved performance"
```

---

## Task 10: Final Integration and Type Safety

**Files:**

- Modify: `types/blog.d.ts` (add internal linking types)
- Test: Type checking

**Step 1: Add TypeScript types**

```typescript
// types/blog.d.ts
export interface LinkSuggestion {
  slug: string;
  title: string;
  score: number;
  reason: 'semantic' | 'category' | 'tag' | 'keyword';
  suggestedAnchor: string;
  contextExcerpt: string;
}

export interface InternalLinkingRecommendation {
  targetSlug: string;
  targetTitle: string;
  relevanceScore: number;
  suggestedAnchors: string[];
  reasoning: string;
}

export interface LinkingOpportunity {
  post: BlogPost;
  opportunities: string[];
}

export interface InternalLinkInserterOptions {
  currentSlug: string;
  maxLinks?: number;
  locale?: string;
}

export interface LinkingStatistics {
  totalArticles: number;
  withInternalLinks: number;
  avgLinksPerArticle: number;
  linkCoverage: number;
}
```

**Step 2: Run type checking**

```bash
bun run type-check
```

Expected: No TypeScript errors

**Step 3: Run all tests**

```bash
bun test
```

Expected: All tests pass

**Step 4: Final commit**

```bash
git add types/blog.d.ts
git commit -m "types: add comprehensive TypeScript types for internal linking system"
```

---

## Implementation Complete!

**Summary:**

- ✅ Extended existing blog infrastructure with internal linking capabilities
- ✅ Added semantic analysis and content similarity scoring
- ✅ Created MDX plugin for automated link insertion
- ✅ Built CLI tools for analysis and management
- ✅ Implemented caching and performance optimizations
- ✅ Added comprehensive tests and documentation
- ✅ Ensured type safety and multi-language support

**Next Steps:**

1. Test with real content in your CueTimer blog
2. Review and tune relevance scoring based on results
3. Consider adding web interface for managing suggestions
4. Monitor performance and user feedback

**Total Estimated Time:** 1 week (as designed) **Infrastructure Leveraged:**
75-90% existing codebase **New Code Added:** ~25% of total system
