import { CueTimerTemplate } from '../types';

export interface TimingGuideVariables {
  title: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  targetAudience?: string;
  tools?: string[];
  prerequisites?: string[];
  steps: Array<{
    title: string;
    description: string;
    time?: string;
    tips?: string[];
  }>;
  introduction?: string;
  conclusion?: string;
  tips?: string[];
}

const TIMING_GUIDE_TEMPLATE: CueTimerTemplate = {
  id: 'timing-guide',
  name: 'Timing Guide Template',
  category: 'timing-guide',
  languages: ['en', 'pt-br', 'es'],
  variables: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'The title of the timing guide',
    },
    {
      name: 'difficulty',
      type: 'string',
      required: false,
      description: 'Difficulty level for the timing guide',
      defaultValue: 'beginner',
    },
    {
      name: 'estimatedTime',
      type: 'string',
      required: false,
      description: 'Estimated time to complete the guide (e.g., "15 minutes")',
      defaultValue: '10 minutes',
    },
    {
      name: 'targetAudience',
      type: 'string',
      required: false,
      description: 'Target audience for this timing guide',
      defaultValue: 'Presenters and public speakers',
    },
    {
      name: 'tools',
      type: 'array',
      required: false,
      description: 'Tools needed for this timing guide',
      defaultValue: ['CueTimer app', 'Timer', 'Presentation slides'],
    },
    {
      name: 'prerequisites',
      type: 'array',
      required: false,
      description: 'Prerequisites for this timing guide',
      defaultValue: ['Basic understanding of presentations'],
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      description: 'Step-by-step instructions for the timing guide',
    },
    {
      name: 'introduction',
      type: 'string',
      required: false,
      description: 'Introduction paragraph for the guide',
    },
    {
      name: 'conclusion',
      type: 'string',
      required: false,
      description: 'Conclusion paragraph for the guide',
    },
    {
      name: 'tips',
      type: 'array',
      required: false,
      description: 'Additional tips and best practices',
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
      id: 'prerequisites',
      title: 'Prerequisites',
      type: 'list',
      required: false,
      order: 2,
    },
    {
      id: 'steps',
      title: 'Step-by-Step Instructions',
      type: 'list',
      required: true,
      order: 3,
    },
    {
      id: 'tips',
      title: 'Tips and Best Practices',
      type: 'list',
      required: false,
      order: 4,
    },
    {
      id: 'conclusion',
      title: 'Conclusion',
      type: 'paragraph',
      required: true,
      order: 5,
    },
  ],
};

export function generateTimingGuideContent(variables: TimingGuideVariables): string {
  const {
    title,
    difficulty = 'beginner',
    estimatedTime = '10 minutes',
    targetAudience = 'Presenters and public speakers',
    tools = ['CueTimer app', 'Timer', 'Presentation slides'],
    prerequisites = ['Basic understanding of presentations'],
    steps,
    introduction,
    conclusion,
    tips = [],
  } = variables;

  // Generate default introduction if not provided
  const defaultIntroduction =
    "Master the art of presentation timing with this comprehensive guide. Whether you're preparing for a conference, business meeting, or educational session, proper timing can make the difference between an engaging presentation and one that loses your audience's attention.";

  // Generate default conclusion if not provided
  const defaultConclusion =
    "By following these steps and using CueTimer effectively, you'll be able to deliver well-timed presentations that keep your audience engaged and convey your message with maximum impact. Remember that good timing is a skill that improves with practice, so don't be afraid to rehearse and refine your approach.";

  // Generate MDX content
  const mdxContent = `---
title: "${title}"
category: "timing-guide"
summary: "Learn how to effectively manage presentation timing using CueTimer with this step-by-step guide."
author: "CueTimer Team"
difficulty: "${difficulty}"
estimatedTime: "${estimatedTime}"
targetAudience: "${targetAudience}"
readTime: ${Math.ceil(steps.length * 1.5)}
tags: ["timing", "presentation", "cuetimer", "guide"]
isDraft: false
language: "en"
lastModified: "${new Date().toISOString()}"
---

import { TimerIcon, UsersIcon, ClockIcon, TargetIcon } from '@heroicons/react/24/outline';

# ${title}

<div className="flex flex-wrap gap-4 mb-6">
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <ClockIcon className="w-4 h-4" />
    <span>${estimatedTime}</span>
  </div>
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <UsersIcon className="w-4 h-4" />
    <span>${targetAudience}</span>
  </div>
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <TargetIcon className="w-4 h-4" />
    <span>Difficulty: ${difficulty}</span>
  </div>
</div>

${introduction || defaultIntroduction}

## What You'll Need

<div className="grid md:grid-cols-2 gap-4 my-6">
  <div className="bg-blue-50 p-4 rounded-lg">
    <h3 className="font-semibold text-blue-900 mb-2">🛠️ Tools Required</h3>
    <ul className="space-y-1 text-blue-800">
      ${tools.map((tool) => `<li>• ${tool}</li>`).join('\n      ')}
    </ul>
  </div>
  <div className="bg-green-50 p-4 rounded-lg">
    <h3 className="font-semibold text-green-900 mb-2">📋 Prerequisites</h3>
    <ul className="space-y-1 text-green-800">
      ${prerequisites.map((prereq) => `<li>• ${prereq}</li>`).join('\n      ')}
    </ul>
  </div>
</div>

## Step-by-Step Instructions

${steps
  .map(
    (step, index) => `
<div className="border-l-4 border-blue-500 pl-4 mb-6">
  <div className="flex items-center justify-between mb-2">
    <h3 className="text-lg font-semibold">Step ${index + 1}: ${step.title}</h3>
    ${step.time ? `<span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">${step.time}</span>` : ''}
  </div>
  <p className="text-gray-700 mb-3">${step.description}</p>
  ${
    step.tips && step.tips.length > 0
      ? `
    <div className="bg-yellow-50 p-3 rounded-md">
      <h4 className="font-medium text-yellow-900 mb-1">💡 Pro Tips:</h4>
      <ul className="text-sm text-yellow-800 space-y-1">
        ${step.tips.map((tip) => `<li>• ${tip}</li>`).join('\n        ')}
      </ul>
    </div>
  `
      : ''
  }
</div>
`
  )
  .join('')}

${
  tips.length > 0
    ? `
## Tips and Best Practices

<div className="bg-purple-50 p-6 rounded-lg mb-6">
  <h3 className="font-semibold text-purple-900 mb-4">🎯 Expert Tips for Perfect Timing</h3>
  <div className="grid md:grid-cols-2 gap-4">
    ${tips
      .map(
        (tip) => `
      <div className="flex items-start gap-2">
        <span className="text-purple-600 mt-1">•</span>
        <span className="text-purple-800">${tip}</span>
      </div>
    `
      )
      .join('\n    ')}
  </div>
</div>
`
    : ''
}

## CueTimer Integration

<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
  <h3 className="font-semibold text-indigo-900 mb-3">⚡ Maximizing CueTimer Features</h3>
  <p className="text-indigo-800 mb-4">
    This guide works best when used with CueTimer's comprehensive timing features:
  </p>
  <div className="grid md:grid-cols-3 gap-4">
    <div className="bg-white p-4 rounded-lg border border-indigo-200">
      <h4 className="font-medium text-indigo-900 mb-2">Visual Timers</h4>
      <p className="text-sm text-gray-600">Use visual cues to stay on track without checking your watch.</p>
    </div>
    <div className="bg-white p-4 rounded-lg border border-indigo-200">
      <h4 className="font-medium text-indigo-900 mb-2">Progress Tracking</h4>
      <p className="text-sm text-gray-600">Monitor your pacing in real-time with progress indicators.</p>
    </div>
    <div className="bg-white p-4 rounded-lg border border-indigo-200">
      <h4 className="font-medium text-indigo-900 mb-2">Session Analytics</h4>
      <p className="text-sm text-gray-600">Review your timing patterns to improve future presentations.</p>
    </div>
  </div>
</div>

${conclusion || defaultConclusion}

---

<div className="bg-gray-50 p-4 rounded-lg mt-8">
  <h3 className="font-semibold text-gray-900 mb-2">🎉 Ready to Practice?</h3>
  <p className="text-gray-700 mb-3">
    Now that you understand the timing principles, practice with CueTimer to perfect your presentation pacing.
  </p>
  <div className="flex gap-3">
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
      Open CueTimer
    </button>
    <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
      View More Guides
    </button>
  </div>
</div>

## Related Resources

- [Presentation Timing Best Practices](/blog/presentation-timing-best-practices)
- [CueTimer Advanced Features](/blog/cuetimer-advanced-features)
- [Common Timing Mistakes to Avoid](/blog/common-timing-mistakes)
`;

  return mdxContent;
}

// Helper function to generate timing guide variables with defaults
export function createTimingGuideVariables(
  customVariables: Partial<TimingGuideVariables>
): TimingGuideVariables {
  return {
    title: customVariables.title || 'New Timing Guide',
    difficulty: customVariables.difficulty || 'beginner',
    estimatedTime: customVariables.estimatedTime || '10 minutes',
    targetAudience: customVariables.targetAudience || 'Presenters and public speakers',
    tools: customVariables.tools || ['CueTimer app', 'Timer', 'Presentation slides'],
    prerequisites: customVariables.prerequisites || ['Basic understanding of presentations'],
    steps: customVariables.steps || [
      {
        title: 'Set Up Your Timer',
        description: 'Open CueTimer and configure your presentation timing parameters.',
        time: '2 minutes',
        tips: [
          'Set buffer time for unexpected interruptions',
          'Use visual timers for better awareness',
          'Test the timer before your presentation',
        ],
      },
      {
        title: 'Practice Your Pacing',
        description:
          'Run through your presentation while monitoring the timer to establish natural pacing.',
        time: '5 minutes',
        tips: [
          'Speak clearly and at a moderate pace',
          'Pause for emphasis at key points',
          'Adjust your speed based on content complexity',
        ],
      },
      {
        title: 'Refine Your Delivery',
        description: 'Make adjustments based on timing feedback and practice sessions.',
        time: '3 minutes',
        tips: [
          'Record practice sessions to identify timing issues',
          'Get feedback from test audiences',
          'Create backup plans for time adjustments',
        ],
      },
    ],
    introduction: customVariables.introduction,
    conclusion: customVariables.conclusion,
    tips: customVariables.tips || [
      'Always rehearse with the same timing conditions as your actual presentation',
      'Build in 10-15% buffer time for unexpected questions or interruptions',
      "Use CueTimer's progress indicators to stay aware without disrupting flow",
      'Practice adjusting your pace naturally based on timer feedback',
      'Consider audience engagement when planning your timing strategy',
    ],
  };
}

export default TIMING_GUIDE_TEMPLATE;
