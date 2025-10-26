import { CueTimerTemplate } from '../types';

export interface PresentationTipsVariables {
  title: string;
  topic: string;
  tips: Array<{
    title: string;
    description: string;
    example?: string;
    category?: 'delivery' | 'content' | 'visual' | 'timing' | 'engagement';
  }>;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  commonMistakes?: Array<{
    mistake: string;
    solution: string;
    impact: string;
  }>;
  examples?: Array<{
    scenario: string;
    tip: string;
    outcome: string;
  }>;
  resources?: Array<{
    title: string;
    type: 'article' | 'video' | 'tool' | 'book';
    url?: string;
    description: string;
  }>;
  conclusion?: string;
}

const PRESENTATION_TIPS_TEMPLATE: CueTimerTemplate = {
  id: 'presentation-tips',
  name: 'Presentation Tips Template',
  category: 'presentation-tips',
  languages: ['en', 'pt-br', 'es'],
  variables: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'The title of the presentation tips article',
    },
    {
      name: 'topic',
      type: 'string',
      required: true,
      description: 'Main topic or focus area of the presentation tips',
    },
    {
      name: 'tips',
      type: 'array',
      required: true,
      description: 'Array of presentation tips with descriptions and examples',
    },
    {
      name: 'difficulty',
      type: 'string',
      required: false,
      description: 'Target skill level for the tips',
      defaultValue: 'beginner',
    },
    {
      name: 'commonMistakes',
      type: 'array',
      required: false,
      description: 'Common mistakes presenters make and how to avoid them',
    },
    {
      name: 'examples',
      type: 'array',
      required: false,
      description: 'Real-world examples of the tips in action',
    },
    {
      name: 'resources',
      type: 'array',
      required: false,
      description: 'Additional resources for learning more',
    },
    {
      name: 'conclusion',
      type: 'string',
      required: false,
      description: 'Custom conclusion paragraph for the tips article',
    },
  ],
  contentStructure: [
    {
      id: 'intro',
      title: 'Introduction',
      type: 'paragraph',
      required: true,
      order: 1,
    },
    {
      id: 'tips',
      title: 'Essential Tips',
      type: 'list',
      required: true,
      order: 2,
    },
    {
      id: 'examples',
      title: 'Real-World Examples',
      type: 'list',
      required: false,
      order: 3,
    },
    {
      id: 'mistakes',
      title: 'Common Mistakes to Avoid',
      type: 'list',
      required: false,
      order: 4,
    },
    {
      id: 'conclusion',
      title: 'Putting It All Together',
      type: 'paragraph',
      required: true,
      order: 5,
    },
  ],
};

export function generatePresentationTipsContent(variables: PresentationTipsVariables): string {
  const {
    title,
    topic,
    tips,
    difficulty = 'beginner',
    commonMistakes = [],
    examples = [],
    resources = [],
    conclusion,
  } = variables;

  // Generate default introduction
  const defaultIntroduction = `Effective presentations are a blend of art and science. Whether you're a seasoned speaker or just starting your journey, mastering ${topic.toLowerCase()} can transform your presentations from ordinary to extraordinary. In this guide, we'll explore practical, actionable tips that you can immediately apply to enhance your presentation skills.`;

  // Generate default conclusion
  const defaultConclusion = `Becoming an exceptional presenter is a journey that requires practice, patience, and continuous improvement. By implementing these ${topic.toLowerCase()} tips consistently, you'll notice significant improvements in audience engagement, message retention, and overall presentation effectiveness. Remember that every great presenter was once a beginner, and with dedication to these principles, you too can achieve presentation excellence.`;

  // Calculate read time based on content
  const totalWords =
    tips.reduce((acc, tip) => acc + tip.title.length + tip.description.length, 0) +
    commonMistakes.reduce(
      (acc, mistake) => acc + mistake.mistake.length + mistake.solution.length,
      0
    ) +
    examples.reduce((acc, example) => acc + example.scenario.length + example.tip.length, 0);
  const readTime = Math.ceil(totalWords / 200) || 5;

  // Generate category-specific icons
  const categoryIcons = {
    delivery: '🎤',
    content: '📝',
    visual: '🎨',
    timing: '⏰',
    engagement: '🎯',
  };

  // Generate MDX content
  const mdxContent = `---
title: "${title}"
category: "presentation-tips"
summary: "Master ${topic.toLowerCase()} with these practical presentation tips and best practices for better audience engagement."
author: "CueTimer Team"
difficulty: "${difficulty}"
readTime: ${readTime}
tags: ["presentation-tips", "${topic.toLowerCase().replace(/\s+/g, '-')}", "public-speaking", "cuetimer"]
isDraft: false
language: "en"
lastModified: "${new Date().toISOString()}"
---

import { LightBulbIcon, ExclamationTriangleIcon, CheckCircleIcon, BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';

# ${title}

<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
  <div className="flex items-center gap-3 mb-3">
    <LightBulbIcon className="w-6 h-6 text-blue-600" />
    <h2 className="text-xl font-semibold text-blue-900">Focus: ${topic}</h2>
  </div>
  <p className="text-blue-800">
    ${defaultIntroduction}
  </p>
  <div className="flex items-center gap-4 mt-4 text-sm text-blue-700">
    <div className="flex items-center gap-1">
      <ClockIcon className="w-4 h-4" />
      <span>${readTime} min read</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="font-medium">Difficulty:</span>
      <span className="capitalize">${difficulty}</span>
    </div>
  </div>
</div>

## Essential Tips for ${topic}

<div className="space-y-6">
  ${tips
    .map(
      (tip, _index) => `
    <div className="border-l-4 border-blue-500 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
          ${_index + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">${tip.title}</h3>
            ${tip.category ? `<span class="text-2xl">${categoryIcons[tip.category] || '💡'}</span>` : ''}
            ${tip.category ? `<span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">${tip.category}</span>` : ''}
          </div>
          <p class="text-gray-700 mb-3">${tip.description}</p>
          ${
            tip.example
              ? `
            <div class="bg-blue-50 p-3 rounded-md">
              <h4 class="font-medium text-blue-900 mb-1 text-sm">💡 Example:</h4>
              <p class="text-blue-800 text-sm">${tip.example}</p>
            </div>
          `
              : ''
          }
        </div>
      </div>
    </div>
  `
    )
    .join('')}
</div>

${
  examples.length > 0
    ? `
## Real-World Examples

<div class="bg-green-50 p-6 rounded-lg mb-6">
  <h3 class="font-semibold text-green-900 mb-4 flex items-center gap-2">
    <CheckCircleIcon className="w-5 h-5" />
    Success Stories and Examples
  </h3>
  <div class="space-y-4">
    ${examples
      .map(
        (example, _index) => `
      <div class="bg-white p-4 rounded-lg border border-green-200">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold">
            ${_index + 1}
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-green-900 mb-1">📋 Scenario: ${example.scenario}</h4>
            <p class="text-green-800 text-sm mb-2"><strong>Applied Tip:</strong> ${example.tip}</p>
            <p class="text-green-700 text-sm"><strong>Result:</strong> ${example.outcome}</p>
          </div>
        </div>
      </div>
    `
      )
      .join('')}
  </div>
</div>
`
    : ''
}

${
  commonMistakes.length > 0
    ? `
## Common Mistakes to Avoid

<div class="bg-red-50 p-6 rounded-lg mb-6">
  <h3 class="font-semibold text-red-900 mb-4 flex items-center gap-2">
    <ExclamationTriangleIcon className="w-5 h-5" />
    Pitfalls and How to Overcome Them
  </h3>
  <div class="space-y-4">
    ${commonMistakes
      .map(
        (mistake, _index) => `
      <div class="bg-white p-4 rounded-lg border border-red-200">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 text-red-500 text-xl">⚠️</div>
          <div class="flex-1">
            <h4 class="font-medium text-red-900 mb-1">❌ ${mistake.mistake}</h4>
            <p class="text-red-800 text-sm mb-2"><strong>✅ Solution:</strong> ${mistake.solution}</p>
            <p class="text-red-700 text-sm"><strong>💥 Impact:</strong> ${mistake.impact}</p>
          </div>
        </div>
      </div>
    `
      )
      .join('')}
  </div>
</div>
`
    : ''
}

${
  resources.length > 0
    ? `
## Additional Resources

<div class="bg-purple-50 p-6 rounded-lg mb-6">
  <h3 class="font-semibold text-purple-900 mb-4 flex items-center gap-2">
    <BookOpenIcon className="w-5 h-5" />
    Continue Your Learning Journey
  </h3>
  <div class="grid md:grid-cols-2 gap-4">
    ${resources
      .map(
        (resource) => `
      <div class="bg-white p-4 rounded-lg border border-purple-200">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 text-2xl">
            ${
              resource.type === 'article'
                ? '📄'
                : resource.type === 'video'
                  ? '🎥'
                  : resource.type === 'tool'
                    ? '🛠️'
                    : resource.type === 'book'
                      ? '📚'
                      : '🔗'
            }
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-purple-900 mb-1">${resource.title}</h4>
            <p class="text-purple-700 text-sm mb-2">${resource.description}</p>
            ${resource.url ? `<a href="${resource.url}" class="text-purple-600 hover:text-purple-800 text-sm underline">Learn more →</a>` : ''}
          </div>
        </div>
      </div>
    `
      )
      .join('')}
  </div>
</div>
`
    : ''
}

## Putting It All Together

<div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-6">
  <h3 class="font-semibold text-indigo-900 mb-3">🎯 Your Action Plan</h3>
  <p class="text-indigo-800 mb-4">
    ${conclusion || defaultConclusion}
  </p>
  <div class="bg-white p-4 rounded-lg border border-indigo-200">
    <h4 class="font-medium text-indigo-900 mb-2">📝 Next Steps:</h4>
    <ol class="text-indigo-800 text-sm space-y-1 list-decimal list-inside">
      <li>Choose 2-3 tips from this guide to implement in your next presentation</li>
      <li>Practice these tips in a low-stakes environment first</li>
      <li>Record yourself to identify areas for improvement</li>
      <li>Seek feedback from trusted colleagues or mentors</li>
      <li>Gradually incorporate more advanced techniques as you gain confidence</li>
    </ol>
  </div>
</div>

---

<div class="bg-gray-50 p-6 rounded-lg mt-8">
  <h3 class="font-semibold text-gray-900 mb-3">🎉 Ready to Transform Your Presentations?</h3>
  <p class="text-gray-700 mb-4">
    Now that you have these powerful ${topic.toLowerCase()} tips, it's time to put them into practice. Remember that presentation skills improve with consistent application and feedback.
  </p>
  <div class="flex flex-wrap gap-3">
    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
      Start Practicing with CueTimer
    </button>
    <button class="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
      Explore More Tips
    </button>
    <button class="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
      Join Our Community
    </button>
  </div>
</div>

## Related Resources

- [Mastering Presentation Timing](/blog/mastering-presentation-timing)
- [Engaging Your Audience Effectively](/blog/audience-engagement-techniques)
- [Visual Design for Presentations](/blog/visual-design-presentations)
- [Handling Q&A Sessions Like a Pro](/blog/handling-qa-sessions)
- [Building Confidence in Public Speaking](/blog/public-speaking-confidence)

---

<div class="text-center text-gray-500 text-sm mt-8">
  <p>Have questions about these presentation tips? <a href="/contact" class="text-blue-600 hover:underline">Contact our team</a> for personalized guidance.</p>
</div>
`;

  return mdxContent;
}

// Helper function to create presentation tips variables with sensible defaults
export function createPresentationTipsVariables(
  customVariables: Partial<PresentationTipsVariables>
): PresentationTipsVariables {
  return {
    title: customVariables.title || 'New Presentation Tips Guide',
    topic: customVariables.topic || 'Effective Presentation Skills',
    tips: customVariables.tips || [
      {
        title: 'Start with a Strong Opening',
        description:
          "Capture your audience's attention immediately with a compelling hook, surprising statistic, or thought-provoking question.",
        example:
          'Instead of "Today I\'m here to talk about marketing," try "What if I told you that 80% of businesses fail due to poor marketing strategies?"',
        category: 'delivery',
      },
      {
        title: 'Maintain Eye Contact',
        description:
          'Connect with your audience by making regular eye contact with different people throughout the room.',
        example:
          'Scan the room in a Z-pattern, making brief 3-5 second connections with individuals before moving to the next person.',
        category: 'engagement',
      },
      {
        title: 'Use Visual Aids Effectively',
        description:
          'Support your message with clear, simple visuals that enhance rather than distract from your content.',
        example:
          'Use one main idea per slide with minimal text and high-quality images that illustrate your point.',
        category: 'visual',
      },
    ],
    difficulty: customVariables.difficulty || 'beginner',
    commonMistakes: customVariables.commonMistakes || [
      {
        mistake: 'Reading directly from slides or notes',
        solution:
          'Use keywords and talking points instead of full sentences. Practice until you can speak naturally about your content.',
        impact: 'Maintains audience engagement and shows confidence in your material.',
      },
      {
        mistake: 'Speaking too quickly or slowly',
        solution:
          'Record practice sessions to identify your natural pace. Aim for 120-150 words per minute and use pauses for emphasis.',
        impact: 'Ensures your audience can follow along and absorb key information.',
      },
    ],
    examples: customVariables.examples || [
      {
        scenario: 'Technical presentation to non-technical audience',
        tip: 'Use analogies and simple language to explain complex concepts',
        outcome:
          'Increased understanding and engagement, with 40% more questions from the audience',
      },
      {
        scenario: 'Sales pitch to potential clients',
        tip: 'Focus on benefits rather than features, using customer success stories',
        outcome: 'Higher conversion rates and better retention of key selling points',
      },
    ],
    resources: customVariables.resources || [
      {
        title: 'TED Talks: The Official TED Guide to Public Speaking',
        type: 'book',
        description:
          'Comprehensive guide from the TED organization on crafting and delivering powerful talks',
      },
      {
        title: 'CueTimer Blog: Advanced Timing Techniques',
        type: 'article',
        description: 'Learn how to perfect your presentation timing with professional techniques',
      },
    ],
    conclusion: customVariables.conclusion,
  };
}

export default PRESENTATION_TIPS_TEMPLATE;
