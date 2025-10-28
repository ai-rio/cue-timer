#!/usr/bin/env tsx

/**
 * MDX Deduplication System Validation Script
 *
 * This script validates the MDX deduplication system by testing:
 * 1. Individual utility functions (dedent, dedentFrontmatter, stripFirstH1, processBlogContent)
 * 2. Blog post processing with real content
 * 3. Edge cases and error conditions
 * 4. Integration with the blog system
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { dedent, dedentFrontmatter, processBlogContent, stripFirstH1 } from '../lib/utils';

// TypeScript interface for MDX deduplication test cases
interface MDXDeduplicationTestCase {
  name: string;
  input: string;
  expected: {
    frontmatterDedented: boolean;
    h1Removed: boolean;
    containsTitle: boolean;
    preserveContent: boolean;
  };
}

// Test data for various scenarios
const testCases = [
  {
    name: 'Standard MDX with frontmatter and H1',
    input: `---
title: "Test Post"
slug: "test-post"
category: "tech"
---

# Test Post Title

This is the content of the test post.

## Section 1

Some content here.

## Section 2

More content here.`,
    expected: {
      frontmatterDedented: true,
      h1Removed: true,
      containsTitle: false,
      preserveContent: true,
    },
  },
  {
    name: 'Indented frontmatter',
    input: `---
    title: "Indented Title"
    slug: "indented-post"
    author: "Test Author"
    publishedAt: "2025-01-01"
---

# Indented Title

This content has indented frontmatter.`,
    expected: {
      frontmatterDedented: true,
      h1Removed: true,
      containsTitle: false,
      preserveContent: true,
    },
  },
  {
    name: 'No H1 in content',
    input: `---
title: "No H1 Post"
slug: "no-h1-post"
---

This post has no H1 in the content.

## First Section

Content starts with H2 directly.`,
    expected: {
      frontmatterDedented: true,
      h1Removed: false, // No H1 to remove
      containsTitle: false,
      preserveContent: true,
    },
  },
  {
    name: 'Multiple H1s',
    input: `---
title: "Multiple H1s"
slug: "multiple-h1s"
---

# First Title

This is the first content.

# Second Title

This should remain as it's the second H1.

## Regular H2

This H2 should remain.`,
    expected: {
      frontmatterDedented: true,
      h1Removed: true,
      containsTitle: false, // First H1 removed, second should remain
      preserveContent: true,
    },
  },
  {
    name: 'H1 with complex formatting',
    input: `---
title: "Complex H1"
slug: "complex-h1"
---

# **Bold Title** with *italic* and [link](https://example.com)

This H1 has complex markdown formatting.

## Content continues

Regular content after the complex H1.`,
    expected: {
      frontmatterDedented: true,
      h1Removed: true,
      containsTitle: false,
      preserveContent: true,
    },
  },
  {
    name: 'No frontmatter',
    input: `# No Frontmatter Title

This content has no frontmatter, just an H1.

## Section 1

Content here.`,
    expected: {
      frontmatterDedented: false, // No frontmatter to dedent
      h1Removed: true,
      containsTitle: false,
      preserveContent: true,
    },
  },
  {
    name: 'Empty content',
    input: '',
    expected: {
      frontmatterDedented: false,
      h1Removed: false,
      containsTitle: false,
      preserveContent: true,
    },
  },
  {
    name: 'Only frontmatter',
    input: `---
title: "Only Frontmatter"
slug: "only-frontmatter"
---`,
    expected: {
      frontmatterDedented: true,
      h1Removed: false, // No H1 to remove
      containsTitle: false,
      preserveContent: true,
    },
  },
];

// Validation utility functions
function hasFrontmatter(content: string): boolean {
  return /^---\n[\s\S]*?\n---/.test(content);
}

function hasH1(content: string): boolean {
  // Look for H1 outside of frontmatter
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

// Test runner
function runTest(testCase: MDXDeduplicationTestCase, index: number): void {
  console.log(`\n🧪 Test ${index + 1}: ${testCase.name}`);
  console.log('='.repeat(60));

  try {
    // Test individual functions
    const originalContent = testCase.input;

    // Test dedentFrontmatter
    const afterDedent = dedentFrontmatter(originalContent);
    const frontmatterWasDedented =
      hasFrontmatter(originalContent) && afterDedent !== originalContent;

    // Test stripFirstH1
    const afterH1Strip = stripFirstH1(afterDedent);
    const h1WasRemoved =
      hasH1(afterDedent) && !hasH1(afterH1Strip.split('\n').slice(0, 10).join('\n'));

    // Test processBlogContent (main function)
    const finalProcessed = processBlogContent(originalContent);
    const finalHasH1 = hasH1(finalProcessed);
    const finalTitle = extractTitle(finalProcessed);

    // Validate expectations
    const results = {
      frontmatterDedented: frontmatterWasDedented === testCase.expected.frontmatterDedented,
      h1Removed: h1WasRemoved === testCase.expected.h1Removed,
      containsTitle: finalHasH1 === testCase.expected.containsTitle,
      preserveContent: finalProcessed.length > 0 || originalContent.length === 0,
    };

    // Display results
    console.log(`📝 Original content length: ${originalContent.length} chars`);
    console.log(`🔧 After dedent: ${afterDedent.length} chars`);
    console.log(`✂️  After H1 strip: ${afterH1Strip.length} chars`);
    console.log(`🎯 Final processed: ${finalProcessed.length} chars`);

    if (finalTitle) {
      console.log(`📋 Extracted title: "${finalTitle}"`);
    }

    console.log('\n📊 Test Results:');
    Object.entries(results).forEach(([key, passed]) => {
      const icon = passed ? '✅' : '❌';
      const expected = testCase.expected[key as keyof typeof testCase.expected];
      const actual =
        key === 'preserveContent'
          ? passed
          : key === 'containsTitle'
            ? finalHasH1
            : key === 'h1Removed'
              ? h1WasRemoved
              : frontmatterWasDedented;
      console.log(`  ${icon} ${key}: Expected ${expected}, Got ${actual}`);
    });

    const allPassed = Object.values(results).every(Boolean);
    console.log(`\n${allPassed ? '✅' : '❌'} Overall: ${allPassed ? 'PASSED' : 'FAILED'}`);

    // Show before/after for debugging
    if (!allPassed) {
      console.log('\n🔍 Debug Information:');
      console.log('--- BEFORE ---');
      console.log(originalContent);
      console.log('--- AFTER ---');
      console.log(finalProcessed);
      console.log('--- END ---');
    }
  } catch (error) {
    console.log(
      `❌ Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Test with real blog content
function testWithRealBlogContent(): void {
  console.log('\n\n🗂️  Testing with Real Blog Content');
  console.log('='.repeat(60));

  const blogPath = join(process.cwd(), 'content', 'blog', '2025', '10', 'test-timing-guide.mdx');

  if (!existsSync(blogPath)) {
    console.log('⚠️  Real blog content not found, skipping real content test');
    return;
  }

  try {
    const realContent = readFileSync(blogPath, 'utf-8');
    console.log(`📄 Found real blog post: ${blogPath}`);
    console.log(`📏 Content length: ${realContent.length} chars`);

    // Extract original title from frontmatter
    const originalTitle = extractTitle(realContent);
    console.log(`📋 Original title: "${originalTitle}"`);

    // Process the content
    const processedContent = processBlogContent(realContent);

    // Check results
    const hasDuplicateTitle = hasH1(processedContent) && originalTitle;
    const contentPreserved = processedContent.includes(
      'Welcome to this comprehensive timing guide'
    );
    const frontmatterPreserved =
      processedContent.includes('---') && processedContent.includes('Test Timing Guide');

    console.log('\n📊 Real Content Test Results:');
    console.log(`  ${!hasDuplicateTitle ? '✅' : '❌'} No duplicate H1 title`);
    console.log(`  ${contentPreserved ? '✅' : '❌'} Content preserved`);
    console.log(`  ${frontmatterPreserved ? '✅' : '❌'} Frontmatter preserved`);

    // Show excerpt of processed content
    console.log('\n📝 Processed content excerpt (first 300 chars):');
    console.log(processedContent.substring(0, 300) + (processedContent.length > 300 ? '...' : ''));
  } catch (error) {
    console.log(
      `❌ Real content test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Performance test
function performanceTest(): void {
  console.log('\n\n⚡ Performance Testing');
  console.log('='.repeat(60));

  const largeContent = `---
title: "Large Content Test"
slug: "large-content"
category: "test"
---

# Large Content Title

${Array.from({ length: 1000 }, (_, i) => `This is line ${i + 1} of the content. It contains some text to simulate a large blog post.`).join('\n')}

## Conclusion

This is the end of the large content test.`;

  const iterations = 1000;
  console.log(
    `🏃 Running ${iterations} iterations on large content (${largeContent.length} chars)`
  );

  const startTime = Date.now();

  for (let i = 0; i < iterations; i++) {
    processBlogContent(largeContent);
  }

  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;

  console.log(`⏱️  Total time: ${totalTime}ms`);
  console.log(`📊 Average time per iteration: ${avgTime.toFixed(2)}ms`);
  console.log(
    `${avgTime < 10 ? '✅' : '❌'} Performance: ${avgTime < 10 ? 'GOOD' : 'NEEDS OPTIMIZATION'} (target: <10ms per iteration)`
  );
}

// Main execution
function main(): void {
  console.log('🚀 MDX Deduplication System Validation');
  console.log('='.repeat(60));
  console.log('This script validates the MDX deduplication system functionality.\n');

  // Run all test cases
  testCases.forEach((testCase, index) => runTest(testCase, index));

  // Test with real content
  testWithRealBlogContent();

  // Performance testing
  performanceTest();

  console.log('\n\n🎉 Validation Complete!');
  console.log('Review the results above to ensure all tests pass and performance is acceptable.');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { performanceTest, runTest, testWithRealBlogContent };
