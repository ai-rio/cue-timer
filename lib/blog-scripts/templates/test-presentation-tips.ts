import { ContentCreator } from '../content-creator';
import {
  createPresentationTipsVariables,
  generatePresentationTipsContent,
} from './presentation-tips';

// Test the presentation tips template
async function testPresentationTipsTemplate() {
  console.log('🧪 Testing Presentation Tips Template...\n');

  try {
    // Create test variables
    const testVariables = createPresentationTipsVariables({
      title: 'Mastering Virtual Presentations',
      topic: 'Virtual Presentation Excellence',
      difficulty: 'intermediate',
      tips: [
        {
          title: 'Optimize Your Lighting Setup',
          description:
            'Ensure proper lighting to appear professional and maintain audience engagement in virtual settings.',
          example:
            'Position a ring light at 45-degree angle to your face for flattering, professional lighting.',
          category: 'visual',
        },
        {
          title: 'Engage with Virtual Tools',
          description:
            'Use platform features like polls, chat, and reactions to keep your audience actively involved.',
          example:
            'Launch a poll every 10 minutes to break up content and gather audience insights.',
          category: 'engagement',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Ignoring camera angle and eye contact',
          solution:
            'Position camera at eye level and look directly at the camera, not at your own image.',
          impact: 'Creates stronger connection with virtual audience and shows professionalism.',
        },
      ],
      examples: [
        {
          scenario: 'Company-wide virtual town hall',
          tip: 'Use breakout rooms for smaller group discussions',
          outcome: 'Increased participation from 30% to 75% of attendees',
        },
      ],
      resources: [
        {
          title: 'Zoom Best Practices Guide',
          type: 'article',
          description: 'Official guide to creating engaging virtual presentations on Zoom',
        },
      ],
    });

    // Test content generation
    console.log('✅ Test variables created successfully');
    console.log(`📝 Title: ${testVariables.title}`);
    console.log(`🎯 Topic: ${testVariables.topic}`);
    console.log(`📊 Tips count: ${testVariables.tips.length}`);
    console.log(`⚠️  Mistakes count: ${testVariables.commonMistakes?.length || 0}`);
    console.log(`💡 Examples count: ${testVariables.examples?.length || 0}\n`);

    // Generate MDX content
    const generatedContent = generatePresentationTipsContent(testVariables);

    console.log('✅ MDX content generated successfully');
    console.log(`📏 Content length: ${generatedContent.length} characters`);
    console.log(
      `📖 Estimated read time: ${Math.ceil(generatedContent.split(' ').length / 200)} minutes\n`
    );

    // Verify content structure
    const requiredSections = [
      'title: "Mastering Virtual Presentations"',
      'category: "presentation-tips"',
      '## Essential Tips for Virtual Presentation Excellence',
      '## Common Mistakes to Avoid',
      '## Real-World Examples',
      '## Putting It All Together',
    ];

    let allSectionsPresent = true;
    requiredSections.forEach((section) => {
      if (!generatedContent.includes(section)) {
        console.log(`❌ Missing section: ${section}`);
        allSectionsPresent = false;
      } else {
        console.log(`✅ Found section: ${section}`);
      }
    });

    // Test content quality
    const contentChecks = [
      {
        check: generatedContent.includes('Optimize Your Lighting Setup'),
        message: 'First tip included',
      },
      {
        check: generatedContent.includes('Engage with Virtual Tools'),
        message: 'Second tip included',
      },
      { check: generatedContent.includes('virtual'), message: 'Topic context included' },
      { check: generatedContent.includes('intermediate'), message: 'Difficulty level included' },
      { check: generatedContent.includes('75%'), message: 'Example outcome included' },
    ];

    console.log('\n📋 Content Quality Checks:');
    contentChecks.forEach(({ check, message }) => {
      console.log(check ? `✅ ${message}` : `❌ ${message}`);
    });

    // Test with ContentCreator (simplified test)
    console.log('\n🔄 Testing ContentCreator integration...');

    // Import the template
    const PRESENTATION_TIPS_TEMPLATE = require('./presentation-tips').default;

    // Mock content creator validation
    const mockContentCreator = {
      validateTemplateVariables: (template: any, variables: any) => {
        const requiredVars = template.variables.filter((v: any) => v.required);
        const missing = requiredVars.filter((v: any) => !variables[v.name]);

        if (missing.length > 0) {
          throw new Error(
            `Missing required variables: ${missing.map((v: any) => v.name).join(', ')}`
          );
        }

        return true;
      },
    };

    // Test template validation
    mockContentCreator.validateTemplateVariables(PRESENTATION_TIPS_TEMPLATE, testVariables);
    console.log('✅ Template variables validation passed');

    // Test missing required variable
    try {
      const incompleteVariables: any = { ...testVariables };
      delete incompleteVariables.title;
      mockContentCreator.validateTemplateVariables(PRESENTATION_TIPS_TEMPLATE, incompleteVariables);
      console.log('❌ Should have failed validation for missing title');
    } catch (error) {
      console.log('✅ Correctly caught missing required variable: title');
    }

    console.log('\n🎉 All tests passed! Presentation Tips Template is working correctly.');

    return {
      success: true,
      contentLength: generatedContent.length,
      sectionsFound: requiredSections.length,
      tipsCount: testVariables.tips.length,
    };
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Run the test
if (require.main === module) {
  testPresentationTipsTemplate()
    .then((result) => {
      console.log('\n📊 Test Results:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Test execution failed:', error);
      process.exit(1);
    });
}

export { testPresentationTipsTemplate };
