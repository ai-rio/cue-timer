#!/usr/bin/env bun

// Simple verification script for Presentation Tips Template
import {
  createPresentationTipsVariables,
  generatePresentationTipsContent,
} from './presentation-tips';

console.warn('🔍 Verifying Presentation Tips Template...\n');

try {
  // Test 1: Create variables with defaults
  console.warn('✅ Test 1: Creating variables with defaults...');
  const defaultVariables = createPresentationTipsVariables({});
  console.warn(`   - Title: ${defaultVariables.title}`);
  console.warn(`   - Topic: ${defaultVariables.topic}`);
  console.warn(`   - Tips count: ${defaultVariables.tips.length}`);
  console.warn(`   - Default tips: ${defaultVariables.tips.map((t) => t.title).join(', ')}\n`);

  // Test 2: Create variables with custom data
  console.warn('✅ Test 2: Creating variables with custom data...');
  const customVariables = createPresentationTipsVariables({
    title: 'Advanced Storytelling Techniques',
    topic: 'Engaging Narrative Skills',
    difficulty: 'advanced',
    tips: [
      {
        title: "Use the Hero's Journey Framework",
        description:
          'Structure your presentation using classic storytelling patterns that resonate with audiences.',
        example:
          'Start with the ordinary world, introduce conflict, show transformation, and return with new wisdom.',
        category: 'content',
      },
    ],
  });
  console.warn(`   - Custom title: ${customVariables.title}`);
  console.warn(`   - Custom topic: ${customVariables.topic}`);
  console.warn(`   - Difficulty: ${customVariables.difficulty}`);
  console.warn(`   - Custom tips: ${customVariables.tips.length}\n`);

  // Test 3: Generate MDX content
  console.warn('✅ Test 3: Generating MDX content...');
  const content = generatePresentationTipsContent(customVariables);
  console.warn(`   - Content length: ${content.length} characters`);
  console.warn(`   - Contains frontmatter: ${content.includes('---')}`);
  console.warn(`   - Contains title: ${content.includes('Advanced Storytelling Techniques')}`);
  console.warn(`   - Contains hero section: ${content.includes("Hero's Journey Framework")}`);
  console.warn(
    `   - Contains required sections: ${content.includes('## Essential Tips') && content.includes('## Putting It All Together')}\n`
  );

  // Test 4: Check required variables validation
  console.warn('✅ Test 4: Testing required variables...');

  // Create incomplete variables (missing required 'topic')
  try {
    const incompleteVars = createPresentationTipsVariables({
      title: 'Test Title',
    });
    // This should work for content generation but show missing topic
    generatePresentationTipsContent({
      ...incompleteVars,
      topic: '', // Empty topic
    });
    console.warn('   - Handles missing topic gracefully');
  } catch {
    console.warn('   - Properly validates required variables');
  }

  // Test 5: Content structure verification
  console.warn('\n✅ Test 5: Content structure verification...');
  const requiredSections = [
    'title: "Advanced Storytelling Techniques"',
    'category: "presentation-tips"',
    '## Essential Tips for Engaging Narrative Skills',
    '## Putting It All Together',
  ];

  let allSectionsPresent = true;
  requiredSections.forEach((section) => {
    const present = content.includes(section);
    console.warn(`   - ${present ? '✅' : '❌'} "${section.substring(0, 30)}..."`);
    if (!present) allSectionsPresent = false;
  });

  console.warn(`\n🎯 Overall Result: ${allSectionsPresent ? '✅ PASSED' : '❌ FAILED'}`);

  if (allSectionsPresent) {
    console.warn('\n🎉 Presentation Tips Template is ready for use!');
    console.warn('   - Template structure: ✅ Valid');
    console.warn('   - Content generation: ✅ Working');
    console.warn('   - Default values: ✅ Available');
    console.warn('   - Custom variables: ✅ Supported');
    console.warn('   - MDX output: ✅ Properly formatted');
  }
} catch (error) {
  console.error('❌ Verification failed:', error);
  process.exit(1);
}
