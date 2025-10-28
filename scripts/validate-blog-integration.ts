#!/usr/bin/env tsx

/**
 * Blog Integration Validation Script
 *
 * This script validates the complete blog system integration with the MDX deduplication:
 * 1. Tests actual blog post processing
 * 2. Validates excerpt generation
 * 3. Checks blog listing functionality
 * 4. Verifies frontmatter processing
 * 5. Tests the getAllPosts and getPostBySlug functions
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { getAllPosts, getPostBySlug } from '../lib/blog';
import { processBlogContent } from '../lib/utils';

// TypeScript interface for blog integration test cases
interface BlogIntegrationTestCase {
  name: string;
  file?: string;
  content?: string;
  expectedTitle: string;
  expectedCategory: string;
  checks: ReadonlyArray<
    'frontmatterPreserved' | 'h1Removed' | 'noH1Found' | 'excerptGenerated' | 'contentProcessed'
  >;
}

// Test content scenarios for blog integration
const integrationTests = [
  {
    name: 'Real blog post processing',
    file: 'content/blog/2025/10/test-timing-guide.mdx',
    expectedTitle: 'Test Timing Guide',
    expectedCategory: 'timing-guide',
    checks: ['frontmatterPreserved', 'h1Removed', 'excerptGenerated', 'contentProcessed'] as const,
  },
  {
    name: 'Complex frontmatter with H1',
    content: `---
title: "Advanced MDX Post"
slug: "advanced-mdx"
category: "development"
summary: "A comprehensive guide to advanced MDX features"
author: "Technical Writer"
publishedAt: "2025-01-15T10:00:00.000Z"
readTime: 5
tags: ["mdx", "react", "markdown"]
seo:
  description: "Learn advanced MDX techniques"
  keywords: ["mdx", "react", "markdown"]
---

# Advanced MDX Features

This comprehensive guide covers the most advanced MDX features available for modern React applications.

## Dynamic Imports

MDX supports dynamic imports for better performance.

\`\`\`jsx
import { Chart } from './chart.mdx'
\`\`\`

## Component Integration

You can seamlessly integrate React components:

<Button>Click me</Button>

## Frontmatter Processing

The frontmatter above contains complex nested objects and arrays.

## Content Processing

This H1 should be removed while preserving all other content and frontmatter.`,
    expectedTitle: 'Advanced MDX Post',
    expectedCategory: 'development',
    checks: ['frontmatterPreserved', 'h1Removed', 'excerptGenerated', 'contentProcessed'] as const,
  },
  {
    name: 'Post without H1 title',
    content: `---
title: "No H1 Post"
slug: "no-h1-post"
category: "example"
summary: "This post has no H1 in the content"
---

This post starts directly with content without an H1 title.

## First Section

Content should be preserved as-is since there's no H1 to remove.

## Conclusion

All content should remain intact.`,
    expectedTitle: 'No H1 Post',
    expectedCategory: 'example',
    checks: ['frontmatterPreserved', 'noH1Found', 'excerptGenerated', 'contentProcessed'] as const,
  },
];

// Validation utility functions
function hasFrontmatter(content: string): boolean {
  return /^---\n[\s\S]*?\n---/.test(content);
}

function hasH1(content: string): boolean {
  const lines = content.split('\n');
  let inFrontmatter = false;

  for (const line of lines) {
    if (line.trim() === '---') {
      inFrontmatter = !inFrontmatter;
      continue;
    }

    if (!inFrontmatter && /^#\s+/.test(line)) {
      return true;
    }
  }

  return false;
}

function extractTitle(content: string): string | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch && frontmatterMatch[1]) {
    const titleMatch = frontmatterMatch[1].match(/title:\s*["']([^"']+)["']/);
    return titleMatch && titleMatch[1] ? titleMatch[1] : null;
  }
  return null;
}

function extractCategory(content: string): string | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch && frontmatterMatch[1]) {
    const categoryMatch = frontmatterMatch[1].match(/category:\s*["']([^"']+)["']/);
    return categoryMatch && categoryMatch[1] ? categoryMatch[1] : null;
  }
  return null;
}

function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.substring(0, maxLength).replace(/\s+\S*$/, '')}...`;
}

// Test runner for integration tests
function runIntegrationTest(testCase: BlogIntegrationTestCase, index: number): void {
  console.log(`\n🔗 Integration Test ${index + 1}: ${testCase.name}`);
  console.log('='.repeat(70));

  try {
    let content: string;

    // Load content from file or use provided content
    if (testCase.file) {
      const filePath = join(process.cwd(), testCase.file);
      if (!existsSync(filePath)) {
        console.log(`⚠️  File not found: ${testCase.file}, skipping test`);
        return;
      }
      content = readFileSync(filePath, 'utf-8');
      console.log(`📄 Loaded content from: ${testCase.file}`);
    } else {
      content = testCase.content || '';
      console.log('📝 Using provided test content');
    }

    console.log(`📏 Content length: ${content.length} characters`);

    // Process the content
    const processedContent = processBlogContent(content);
    console.log(`🎯 Processed content length: ${processedContent.length} characters`);

    // Run validations based on expected checks
    const results: Record<string, boolean> = {};

    // Check frontmatter preservation
    if (testCase.checks.includes('frontmatterPreserved')) {
      const frontmatterPreserved = hasFrontmatter(processedContent);
      results.frontmatterPreserved = frontmatterPreserved;
      console.log(
        `${frontmatterPreserved ? '✅' : '❌'} Frontmatter preserved: ${frontmatterPreserved}`
      );
    }

    // Check H1 removal
    if (testCase.checks.includes('h1Removed')) {
      const originalHadH1 = hasH1(content);
      const processedHasH1 = hasH1(processedContent);
      const h1Removed = originalHadH1 && !processedHasH1;
      results.h1Removed = h1Removed;
      console.log(
        `${h1Removed ? '✅' : '❌'} H1 removed: ${h1Removed} (original: ${originalHadH1}, processed: ${processedHasH1})`
      );
    }

    // Check no H1 found (when expected)
    if (testCase.checks.includes('noH1Found')) {
      const originalHadH1 = hasH1(content);
      const processedHasH1 = hasH1(processedContent);
      const noH1Found = !originalHadH1 && !processedHasH1;
      results.noH1Found = noH1Found;
      console.log(`${noH1Found ? '✅' : '❌'} No H1 found (as expected): ${noH1Found}`);
    }

    // Check content processing
    if (testCase.checks.includes('contentProcessed')) {
      const contentProcessed = processedContent !== content || !hasH1(content);
      results.contentProcessed = contentProcessed;
      console.log(`${contentProcessed ? '✅' : '❌'} Content processed: ${contentProcessed}`);
    }

    // Check excerpt generation
    if (testCase.checks.includes('excerptGenerated')) {
      const excerpt = generateExcerpt(processedContent);
      const excerptGenerated = excerpt.length > 0 && excerpt.length <= 163; // Allow for "..."
      results.excerptGenerated = excerptGenerated;
      console.log(
        `${excerptGenerated ? '✅' : '❌'} Excerpt generated: ${excerptGenerated} (${excerpt.length} chars)`
      );
      console.log(`📋 Excerpt: "${excerpt}"`);
    }

    // Check title extraction
    const extractedTitle = extractTitle(processedContent);
    const titleMatch = extractedTitle === testCase.expectedTitle;
    results.titleMatch = titleMatch;
    console.log(`${titleMatch ? '✅' : '❌'} Title match: ${titleMatch}`);
    console.log(`   Expected: "${testCase.expectedTitle}"`);
    console.log(`   Got: "${extractedTitle}"`);

    // Check category extraction
    const extractedCategory = extractCategory(processedContent);
    const categoryMatch = extractedCategory === testCase.expectedCategory;
    results.categoryMatch = categoryMatch;
    console.log(`${categoryMatch ? '✅' : '❌'} Category match: ${categoryMatch}`);
    console.log(`   Expected: "${testCase.expectedCategory}"`);
    console.log(`   Got: "${extractedCategory}"`);

    // Overall result
    const allPassed = Object.values(results).every(Boolean);
    console.log(`\n${allPassed ? '✅' : '❌'} Overall: ${allPassed ? 'PASSED' : 'FAILED'}`);

    // Show processed content excerpt
    console.log('\n📝 Processed content excerpt (first 400 chars):');
    console.log(processedContent.substring(0, 400) + (processedContent.length > 400 ? '...' : ''));
  } catch (error) {
    console.log(
      `❌ Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Test blog API functions
async function testBlogApiFunctions(): Promise<void> {
  console.log('\n\n🔧 Testing Blog API Functions');
  console.log('='.repeat(70));

  try {
    // Test getAllPosts
    console.log('📋 Testing getAllPosts()...');
    const allPosts = await getAllPosts();
    console.log(`✅ Found ${allPosts.length} posts`);

    if (allPosts.length > 0) {
      const firstPost = allPosts[0];
      if (firstPost) {
        console.log(`📄 First post: "${firstPost.title}"`);
        console.log(`   Slug: ${firstPost.slug}`);
        console.log(`   Category: ${firstPost.category}`);
        console.log(`   Word count: ${firstPost.wordCount}`);
        console.log(`   Read time: ${firstPost.readTime} min`);
        console.log(`   Excerpt length: ${firstPost.excerpt?.length || 0} chars`);
        console.log(`   Content length: ${firstPost.content?.length || 0} chars`);

        // Check if H1 was removed from content
        const contentHasH1 = hasH1(firstPost.content || '');
        console.log(`   Content has H1: ${contentHasH1} (should be false)`);
        console.log(`${!contentHasH1 ? '✅' : '❌'} H1 properly removed from blog post content`);
      }
    }

    // Test getPostBySlug with actual post
    if (allPosts.length > 0) {
      console.log('\n🎯 Testing getPostBySlug()...');
      const firstSlug = allPosts[0]?.slug;
      if (firstSlug) {
        const testPost = await getPostBySlug(firstSlug);

        if (testPost) {
          console.log(`✅ Successfully retrieved post: "${testPost.title}"`);
          const contentHasH1 = hasH1(testPost.content || '');
          console.log(
            `${!contentHasH1 ? '✅' : '❌'} H1 properly removed from retrieved post content`
          );
        } else {
          console.log('❌ Failed to retrieve post by slug');
        }
      }
    }
  } catch (error) {
    console.log(
      `❌ Blog API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Performance test for blog processing
async function performanceTest(): Promise<void> {
  console.log('\n\n⚡ Performance Testing for Blog Processing');
  console.log('='.repeat(70));

  try {
    const allPosts = await getAllPosts();

    if (allPosts.length === 0) {
      console.log('⚠️  No posts found for performance testing');
      return;
    }

    console.log(`🏃 Testing performance with ${allPosts.length} blog posts`);

    // Test processing all posts multiple times
    const iterations = 100;
    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
      await getAllPosts();
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;

    console.log('\n📊 Performance Results:');
    console.log(`  ⏱️  Total time: ${totalTime}ms`);
    console.log(`  📈 Average time per iteration: ${avgTime.toFixed(2)}ms`);
    console.log(`  🚀 Iterations per second: ${(1000 / avgTime).toFixed(0)}`);
    console.log(
      `${avgTime < 100 ? '✅' : '❌'} Performance: ${avgTime < 100 ? 'GOOD' : 'NEEDS OPTIMIZATION'} (target: <100ms per iteration)`
    );
  } catch (error) {
    console.log(
      `❌ Performance test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Main execution
async function main(): Promise<void> {
  console.log('🔗 Blog Integration Validation');
  console.log('='.repeat(70));
  console.log('Testing complete blog system integration with MDX deduplication.\n');

  // Run integration tests
  integrationTests.forEach((testCase, index) => runIntegrationTest(testCase, index));

  // Test blog API functions
  await testBlogApiFunctions();

  // Performance testing
  await performanceTest();

  console.log('\n\n🎉 Blog Integration Validation Complete!');
  console.log(
    'Review the results to ensure the blog system works correctly with MDX deduplication.'
  );
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { performanceTest, runIntegrationTest, testBlogApiFunctions };
