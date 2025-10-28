#!/usr/bin/env tsx

/**
 * Comprehensive test for stripFirstH1 function edge cases
 * This script tests specific edge cases and scenarios for the H1 stripping functionality
 */

import { stripFirstH1 } from '../lib/utils';

// TypeScript interface for edge case test scenarios
interface EdgeCase {
  name: string;
  input: string;
  expected: string;
}

// Edge case test scenarios
const edgeCaseTests = [
  {
    name: 'Basic H1 removal',
    input: `# Simple Title

Content after title.`,
    expected: 'Content after title.',
  },
  {
    name: 'H1 with multiple spaces',
    input: `#     Title with extra spaces

Content after title.`,
    expected: 'Content after title.',
  },
  {
    name: 'H1 followed by multiple empty lines',
    input: `# Title


Lots of empty lines.


Content here.`,
    expected: 'Lots of empty lines.\n\n\nContent here.',
  },
  {
    name: 'Multiple H1s - only first removed',
    input: `# First Title

Content after first title.

# Second Title

Content after second title.`,
    expected: 'Content after first title.\n\n# Second Title\n\nContent after second title.',
  },
  {
    name: 'H1 in frontmatter should not be removed',
    input: `---
title: "Frontmatter Title"
---

# Content Title

Content after title.`,
    expected: `---
title: "Frontmatter Title"
---

Content after title.`,
  },
  {
    name: 'H2 headers should not be removed',
    input: `## H2 Title

This is an H2, should remain.

# H1 Title

This H1 should be removed.

### H3 Title

This H3 should remain.`,
    expected:
      '## H2 Title\n\nThis is an H2, should remain.\n\nThis H1 should be removed.\n\n### H3 Title\n\nThis H3 should remain.',
  },
  {
    name: 'Hash in content not as header',
    input: `# Real Title

This is # not a header because it's not at start.

# Another Real Title

More content with # hash symbols.`,
    expected:
      "This is # not a header because it's not at start.\n\n# Another Real Title\n\nMore content with # hash symbols.",
  },
  {
    name: 'No H1 present',
    input: `No H1 here.

## Just H2

And more content.`,
    expected: 'No H1 here.\n\n## Just H2\n\nAnd more content.',
  },
  {
    name: 'Empty content',
    input: '',
    expected: '',
  },
  {
    name: 'Only H1',
    input: '# Only Title',
    expected: '',
  },
  {
    name: 'Complex frontmatter with nested content',
    input: `---
title: "Complex Post"
description: |
  This is a multiline
  description in YAML
tags:
  - test
  - validation
---

# Content Title

Content here.`,
    expected: `---
title: "Complex Post"
description: |
  This is a multiline
  description in YAML
tags:
  - test
  - validation
---

Content here.`,
  },
  {
    name: 'H1 with inline formatting',
    input: `# **Bold** and *italic* title

Content after formatted title.`,
    expected: 'Content after formatted title.',
  },
  {
    name: 'H1 with link',
    input: `# Title with [link](https://example.com)

Content after linked title.`,
    expected: 'Content after linked title.',
  },
  {
    name: 'Frontmatter with dashes in content',
    input: `---
title: "Post with dashes"
---

# Title

Content with --- dashes in it.

## Section

More content.`,
    expected: `---
title: "Post with dashes"
---

Content with --- dashes in it.\n\n## Section\n\nMore content.`,
  },
  {
    name: 'Malformed frontmatter (no closing)',
    input: `---
title: "No closing"
# This should be treated as H1 since frontmatter is incomplete

Content after H1.`,
    expected: `---
title: "No closing"
# This should be treated as H1 since frontmatter is incomplete\n\nContent after H1.`,
  },
];

// Test function
function runEdgeCaseTest(testCase: EdgeCase, index: number): void {
  console.log(`\n🧪 Edge Case Test ${index + 1}: ${testCase.name}`);
  console.log('-'.repeat(60));

  try {
    const result = stripFirstH1(testCase.input);
    const passed = result === testCase.expected;

    console.log(`📝 Input (${testCase.input.length} chars):`);
    console.log(`"${testCase.input}"`);
    console.log(`\n🎯 Expected (${testCase.expected.length} chars):`);
    console.log(`"${testCase.expected}"`);
    console.log(`\n✅ Result (${result.length} chars):`);
    console.log(`"${result}"`);

    console.log(`\n${passed ? '✅' : '❌'} Test ${passed ? 'PASSED' : 'FAILED'}`);

    if (!passed) {
      console.log('\n🔍 Debug Information:');
      console.log('Expected vs Result comparison:');
      const expectedLines = testCase.expected.split('\n');
      const resultLines = result.split('\n');
      const maxLines = Math.max(expectedLines.length, resultLines.length);

      for (let i = 0; i < maxLines; i++) {
        const expectedLine = expectedLines[i] || '(missing)';
        const resultLine = resultLines[i] || '(missing)';
        const match = expectedLine === resultLine;
        console.log(
          `  ${match ? '✅' : '❌'} Line ${i + 1}: "${resultLine}" ${match ? '' : `(expected: "${expectedLine}")`}`
        );
      }
    }
  } catch (error) {
    console.log(
      `❌ Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Performance stress test
function performanceStressTest(): void {
  console.log('\n\n⚡ Performance Stress Test for stripFirstH1');
  console.log('-'.repeat(60));

  const stressContent = Array.from(
    { length: 100 },
    (_, i) =>
      `# Title ${i + 1}\n\nThis is content block ${i + 1}.\n\n## Subsection\n\nMore content here.\n\n`
  ).join('\n');

  console.log(`🏃 Testing large content with ${stressContent.split('\n# ').length - 1} H1 headers`);
  console.log(`📏 Content size: ${stressContent.length} characters`);

  const iterations = 10000;
  const startTime = Date.now();

  for (let i = 0; i < iterations; i++) {
    stripFirstH1(stressContent);
  }

  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;

  console.log('\n📊 Performance Results:');
  console.log(`  ⏱️  Total time: ${totalTime}ms`);
  console.log(`  📈 Average time: ${avgTime.toFixed(4)}ms per operation`);
  console.log(`  🚀 Operations per second: ${(1000 / avgTime).toFixed(0)} ops/sec`);
  console.log(
    `${avgTime < 1 ? '✅' : '❌'} Performance: ${avgTime < 1 ? 'EXCELLENT' : 'NEEDS OPTIMIZATION'} (target: <1ms per operation)`
  );
}

// Main execution
function main(): void {
  console.log('🔍 stripFirstH1 Function Edge Case Testing');
  console.log('='.repeat(70));
  console.log('Testing edge cases and performance for the stripFirstH1 function.\n');

  // Run all edge case tests
  edgeCaseTests.forEach((testCase, index) => runEdgeCaseTest(testCase, index));

  // Performance testing
  performanceStressTest();

  console.log('\n\n🎉 Edge Case Testing Complete!');
  console.log(
    'Review the results to ensure the stripFirstH1 function handles all scenarios correctly.'
  );
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { performanceStressTest, runEdgeCaseTest };
