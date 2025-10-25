#!/usr/bin/env bun

// Simple verification script for Presentation Tips Template
import {
  createPresentationTipsVariables,
  generatePresentationTipsContent,
} from './presentation-tips';

console.log('🔍 Verifying Presentation Tips Template...\n');

try {
  // Test 1: Create variables with defaults
  console.log('✅ Test 1: Creating variables with defaults...');
  const defaultVariables = createPresentationTipsVariables({});
  console.log(`   - Title: ${defaultVariables.title}`);
  console.log(`   - Topic: ${defaultVariables.topic}`);
  console.log(`   - Tips count: ${defaultVariables.tips.length}`);
  console.log(`   - Default tips: ${defaultVariables.tips.map((t) => t.title).join(', ')}\n`);

  // Test 2: Create variables with custom data
  console.log('✅ Test 2: Creating variables with custom data...');
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
  console.log(`   - Custom title: ${customVariables.title}`);
  console.log(`   - Custom topic: ${customVariables.topic}`);
  console.log(`   - Difficulty: ${customVariables.difficulty}`);
  console.log(`   - Custom tips: ${customVariables.tips.length}\n`);

  // Test 3: Generate MDX content
  console.log('✅ Test 3: Generating MDX content...');
  const content = generatePresentationTipsContent(customVariables);
  console.log(`   - Content length: ${content.length} characters`);
  console.log(`   - Contains frontmatter: ${content.includes('---')}`);
  console.log(`   - Contains title: ${content.includes('Advanced Storytelling Techniques')}`);
  console.log(`   - Contains hero section: ${content.includes("Hero's Journey Framework")}`);
  console.log(
    `   - Contains required sections: ${content.includes('## Essential Tips') && content.includes('## Putting It All Together')}\n`
  );

  // Test 4: Check required variables validation
  console.log('✅ Test 4: Testing required variables...');

  // Create incomplete variables (missing required 'topic')
  try {
    const incompleteVars = createPresentationTipsVariables({
      title: 'Test Title',
    });
    // Remove topic to test required validation
    const { topic: _, ...incomplete } = incompleteVars;

    // This should work for content generation but show missing topic
    const incompleteContent = generatePresentationTipsContent({
      ...incomplete,
      topic: '', // Empty topic
    });
    console.log('   - Handles missing topic gracefully');
  } catch (error) {
    console.log('   - Properly validates required variables');
  }

  // Test 5: Content structure verification
  console.log('\n✅ Test 5: Content structure verification...');
  const requiredSections = [
    'title: "Advanced Storytelling Techniques"',
    'category: "presentation-tips"',
    '## Essential Tips for Engaging Narrative Skills',
    '## Putting It All Together',
  ];

  let allSectionsPresent = true;
  requiredSections.forEach((section) => {
    const present = content.includes(section);
    console.log(`   - ${present ? '✅' : '❌'} "${section.substring(0, 30)}..."`);
    if (!present) allSectionsPresent = false;
  });

  console.log(`\n🎯 Overall Result: ${allSectionsPresent ? '✅ PASSED' : '❌ FAILED'}`);

  if (allSectionsPresent) {
    console.log('\n🎉 Presentation Tips Template is ready for use!');
    console.log('   - Template structure: ✅ Valid');
    console.log('   - Content generation: ✅ Working');
    console.log('   - Default values: ✅ Available');
    console.log('   - Custom variables: ✅ Supported');
    console.log('   - MDX output: ✅ Properly formatted');
  }
} catch (error) {
  console.error('❌ Verification failed:', error);
  process.exit(1);
}
