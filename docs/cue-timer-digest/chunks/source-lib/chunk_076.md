# Chunk 76: source_lib

## Metadata

- **Files**: 1
- **Size**: 16,471 characters (~4,117 tokens)
- **Categories**: source

## Files in this chunk

- `lib/blog-scripts/templates/case-study.ts`

---

## File: `lib/blog-scripts/templates/case-study.ts`

```typescript
import { CueTimerTemplate } from '../types';

export interface CaseStudyVariables {
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: Array<{
    metric: string;
    value: string;
    description?: string;
  }>;
  quotes?: Array<{
    text: string;
    author: string;
    role: string;
    company?: string;
  }>;
  projectOverview?: string;
  implementation?: Array<{
    step: string;
    description: string;
    timeline?: string;
  }>;
  conclusion?: string;
}

const CASE_STUDY_TEMPLATE: CueTimerTemplate = {
  id: 'case-study',
  name: 'Case Study Template',
  category: 'case-study',
  languages: ['en', 'pt-br', 'es'],
  variables: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'The title of the case study',
    },
    {
      name: 'client',
      type: 'string',
      required: true,
      description: 'Client or organization name',
    },
    {
      name: 'industry',
      type: 'string',
      required: true,
      description: 'Industry sector of the client',
    },
    {
      name: 'challenge',
      type: 'string',
      required: true,
      description: 'Main challenge faced by the client',
    },
    {
      name: 'solution',
      type: 'string',
      required: true,
      description: "How CueTimer solved the client's challenge",
    },
    {
      name: 'results',
      type: 'array',
      required: true,
      description: 'Quantifiable achievements and metrics',
    },
    {
      name: 'quotes',
      type: 'array',
      required: false,
      description: 'Client testimonials and quotes',
    },
    {
      name: 'projectOverview',
      type: 'string',
      required: false,
      description: 'Overview of the project and context',
    },
    {
      name: 'implementation',
      type: 'array',
      required: false,
      description: 'Implementation steps and process',
    },
    {
      name: 'conclusion',
      type: 'string',
      required: false,
      description: 'Conclusion and key takeaways',
    },
  ],
  contentStructure: [
    {
      id: 'projectOverview',
      title: 'Project Overview',
      type: 'paragraph',
      required: true,
      order: 1,
    },
    {
      id: 'challenge',
      title: 'The Challenge',
      type: 'paragraph',
      required: true,
      order: 2,
    },
    {
      id: 'solution',
      title: 'Our Solution',
      type: 'paragraph',
      required: true,
      order: 3,
    },
    {
      id: 'implementation',
      title: 'Implementation',
      type: 'list',
      required: true,
      order: 4,
    },
    {
      id: 'results',
      title: 'Results',
      type: 'list',
      required: true,
      order: 5,
    },
    {
      id: 'quotes',
      title: 'Client Testimonials',
      type: 'list',
      required: false,
      order: 6,
    },
    {
      id: 'conclusion',
      title: 'Conclusion',
      type: 'paragraph',
      required: true,
      order: 7,
    },
  ],
};

export function generateCaseStudyContent(
  variables: CaseStudyVariables
): string {
  const {
    title,
    client,
    industry,
    challenge,
    solution,
    results,
    quotes = [],
    projectOverview,
    implementation = [],
    conclusion,
  } = variables;

  // Generate default project overview if not provided
  const defaultProjectOverview = `${client}, a leading company in the ${industry} sector, partnered with CueTimer to optimize their presentation timing and delivery processes. This collaboration aimed to enhance audience engagement, improve speaker confidence, and ensure consistent message delivery across their organization.`;

  // Generate default implementation steps if not provided
  const defaultImplementation = [
    {
      step: 'Assessment & Planning',
      description:
        'Comprehensive analysis of current presentation challenges and timing requirements',
      timeline: 'Week 1-2',
    },
    {
      step: 'CueTimer Setup & Configuration',
      description:
        'Customized timer configurations for different presentation types and speaker needs',
      timeline: 'Week 3',
    },
    {
      step: 'Team Training & Onboarding',
      description:
        'Hands-on training sessions for speakers, moderators, and event coordinators',
      timeline: 'Week 4',
    },
    {
      step: 'Pilot Implementation',
      description:
        'Gradual rollout with initial presentations and feedback collection',
      timeline: 'Week 5-6',
    },
    {
      step: 'Optimization & Scale',
      description:
        'Fine-tuning based on feedback and expanding to all presentation events',
      timeline: 'Week 7-8',
    },
  ];

  // Generate default conclusion if not provided
  const defaultConclusion = `The partnership between ${client} and CueTimer demonstrates how professional timing tools can transform presentation delivery and audience engagement. By addressing their specific challenges with a tailored solution, ${client} achieved measurable improvements in speaker performance and audience satisfaction. This case study illustrates the ROI of investing in professional timing solutions for organizations committed to presentation excellence.`;

  // Calculate ROI based on results
  const roiMetrics = results.filter(
    (r) =>
      r.metric.toLowerCase().includes('time') ||
      r.metric.toLowerCase().includes('efficiency') ||
      r.metric.toLowerCase().includes('productivity')
  );

  // Generate MDX content
  const mdxContent = `---
title: "${title}"
category: "case-study"
summary: "How ${client} transformed their presentations with CueTimer, achieving remarkable results in the ${industry} sector."
author: "CueTimer Team"
client: "${client}"
industry: "${industry}"
readTime: ${Math.ceil(8 + results.length * 0.5 + quotes.length * 0.3)}
tags: ["case-study", "success-story", "${industry.toLowerCase().replace(/\s+/g, '-')}", "cuetimer"]
isDraft: false
language: "en"
lastModified: "${new Date().toISOString()}"
---

import { BuildingOfficeIcon, ChartBarIcon, ClockIcon, CheckCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';

# ${title}

<div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg mb-8">
  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <h2 className="text-2xl font-bold mb-2">${client}</h2>
      <p className="text-blue-100 flex items-center gap-2">
        <BuildingOfficeIcon className="w-5 h-5" />
        ${industry} Industry
      </p>
    </div>
    <div className="flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-bold mb-2">${results.length}+</div>
        <div className="text-blue-100">Key Improvements</div>
      </div>
    </div>
  </div>
</div>

${projectOverview || defaultProjectOverview}

## The Challenge

<div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
  <div className="flex items-start gap-3">
    <div className="bg-red-100 rounded-full p-2">
      <ClockIcon className="w-6 h-6 text-red-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">Key Challenges Identified</h3>
      <p className="text-red-800">${challenge}</p>
    </div>
  </div>
</div>

## Our Solution

<div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg mb-8">
  <h3 className="text-xl font-semibold text-indigo-900 mb-4">🎯 CueTimer Implementation Strategy</h3>
  <p className="text-indigo-800 mb-4">${solution}</p>

  <div className="grid md:grid-cols-3 gap-4 mt-6">
    <div className="bg-white p-4 rounded-lg border border-indigo-200">
      <h4 className="font-medium text-indigo-900 mb-2">⚡ Real-time Timing</h4>
      <p className="text-sm text-gray-600">Visual and audio cues help speakers maintain perfect pace</p>
    </div>
    <div className="bg-white p-4 rounded-lg border border-indigo-200">
      <h4 className="font-medium text-indigo-900 mb-2">📊 Analytics Dashboard</h4>
      <p className="text-sm text-gray-600">Track performance metrics and identify improvement areas</p>
    </div>
    <div className="bg-white p-4 rounded-lg border border-indigo-200">
      <h4 className="font-medium text-indigo-900 mb-2">🔄 Custom Workflows</h4>
      <p className="text-sm text-gray-600">Tailored solutions for different presentation formats</p>
    </div>
  </div>
</div>

## Implementation Process

<div className="space-y-4 mb-8">
  ${(implementation.length > 0 ? implementation : defaultImplementation)
    .map(
      (step, index) => `
  <div class="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
    <div class="flex items-center justify-between mb-2">
      <h4 class="font-semibold text-green-900">Step ${index + 1}: ${step.step}</h4>
      ${step.timeline ? `<span class="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">${step.timeline}</span>` : ''}
    </div>
    <p class="text-green-800">${step.description}</p>
  </div>
  `
    )
    .join('')}
</div>

## Results & Impact

<div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg mb-8">
  <h3 class="text-xl font-semibold text-green-900 mb-6">📈 Measurable Improvements</h3>

  <div class="grid md:grid-cols-2 gap-6 mb-6">
    ${results
      .map(
        (result) => `
    <div class="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <h4 class="font-medium text-green-900">${result.metric}</h4>
        <CheckCircleIcon class="w-5 h-5 text-green-600" />
      </div>
      <div class="text-2xl font-bold text-green-600 mb-1">${result.value}</div>
      ${result.description ? `<p class="text-sm text-gray-600">${result.description}</p>` : ''}
    </div>
    `
      )
      .join('')}
  </div>

  ${
    roiMetrics.length > 0
      ? `
  <div class="bg-white p-4 rounded-lg border border-green-200">
    <h4 class="font-medium text-green-900 mb-3">💰 ROI Highlights</h4>
    <div class="grid md:grid-cols-3 gap-4">
      ${roiMetrics
        .slice(0, 3)
        .map(
          (metric) => `
      <div class="text-center">
        <div class="text-lg font-bold text-green-600">${metric.value}</div>
        <div class="text-sm text-gray-600">${metric.metric}</div>
      </div>
      `
        )
        .join('')}
    </div>
  </div>
  `
      : ''
  }
</div>

${
  quotes.length > 0
    ? `
## Client Testimonials

<div class="space-y-6 mb-8">
  ${quotes
    .map(
      (quote, _index) => `
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-indigo-200">
    <div class="flex items-start gap-4">
      <div class="bg-indigo-100 rounded-full p-3">
        <UserGroupIcon class="w-6 h-6 text-indigo-600" />
      </div>
      <div class="flex-1">
        <blockquote class="text-lg text-gray-800 italic mb-4">
          "${quote.text}"
        </blockquote>
        <div class="text-right">
          <div class="font-semibold text-gray-900">${quote.author}</div>
          <div class="text-sm text-gray-600">${quote.role}${quote.company ? `, ${quote.company}` : ''}</div>
        </div>
      </div>
    </div>
  </div>
  `
    )
    .join('')}
</div>
`
    : ''
}

${conclusion || defaultConclusion}

---

## Key Success Factors

<div class="bg-gray-50 p-6 rounded-lg mb-8">
  <h3 class="text-lg font-semibold text-gray-900 mb-4">🎯 What Made This Implementation Successful</h3>
  <div class="grid md:grid-cols-2 gap-4">
    <div class="flex items-start gap-2">
      <span class="text-green-600 mt-1">✓</span>
      <span class="text-gray-700">Customized timer configurations for specific needs</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-green-600 mt-1">✓</span>
      <span class="text-gray-700">Comprehensive team training and onboarding</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-green-600 mt-1">✓</span>
      <span class="text-gray-700">Gradual implementation with feedback loops</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-green-600 mt-1">✓</span>
      <span class="text-gray-700">Ongoing support and optimization</span>
    </div>
  </div>
</div>

<div class="bg-blue-50 p-6 rounded-lg mb-8">
  <h3 class="text-lg font-semibold text-blue-900 mb-4">🚀 Ready to Transform Your Presentations?</h3>
  <p class="text-blue-800 mb-4">
    Join industry leaders like ${client} who have revolutionized their presentation delivery with CueTimer.
  </p>
  <div class="flex gap-3">
    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
      Start Your Journey
    </button>
    <button class="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
      Schedule Demo
    </button>
  </div>
</div>

## Related Case Studies

- [Tech Startup: Scaling Investor Presentations](/blog/case-study/tech-startup-scaling)
- [Enterprise: Global Conference Management](/blog/case-study/enterprise-conference)
- [Education: Student Presentation Excellence](/blog/case-study/education-timing)

---

<div class="text-center text-sm text-gray-500 mt-8">
  <p>This case study was published on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  <p>Results are based on ${Math.floor(3 + Math.random() * 6)} months of implementation data from ${client}.</p>
</div>
`;

  return mdxContent;
}

// Helper function to create case study variables with realistic defaults
export function createCaseStudyVariables(
  customVariables: Partial<CaseStudyVariables>
): CaseStudyVariables {
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Media & Entertainment',
    'Non-Profit',
    'Government',
  ];

  const defaultIndustry =
    customVariables.industry ||
    industries[Math.floor(Math.random() * industries.length)];
  const defaultClient = customVariables.client || 'Global Solutions Inc.';

  return {
    title:
      customVariables.title ||
      `How ${defaultClient} Transformed Presentations with CueTimer`,
    client: defaultClient,
    industry: defaultIndustry || 'Technology',
    challenge:
      customVariables.challenge ||
      `${defaultClient} struggled with inconsistent presentation timing, speaker anxiety, and audience engagement issues during their quarterly meetings and client presentations, leading to missed opportunities and reduced message impact.`,
    solution:
      customVariables.solution ||
      'CueTimer provided a comprehensive timing solution with visual cues, real-time feedback, and analytics dashboards. The implementation included customized timer settings, team training, and integration with existing presentation workflows.',
    results: customVariables.results || [
      {
        metric: 'Speaker Confidence',
        value: '+85%',
        description:
          'Speakers reported significantly higher confidence levels during presentations',
      },
      {
        metric: 'Audience Engagement',
        value: '+67%',
        description:
          'Measurable increase in audience participation and attention',
      },
      {
        metric: 'On-Time Completion',
        value: '95%',
        description:
          'Presentations now consistently finish within scheduled time slots',
      },
      {
        metric: 'Team Productivity',
        value: '+40%',
        description: 'Reduced preparation time and more efficient rehearsals',
      },
      {
        metric: 'Client Satisfaction',
        value: '4.8/5',
        description: 'Average satisfaction score from presentation attendees',
      },
    ],
    quotes: customVariables.quotes || [
      {
        text: 'CueTimer has completely transformed how we approach presentations. Our speakers are more confident, and our audience engagement has never been better.',
        author: 'Sarah Johnson',
        role: 'Head of Communications',
        company: defaultClient,
      },
      {
        text: "The real-time timing features and analytics have given us insights we never had before. It's been a game-changer for our quarterly reviews.",
        author: 'Michael Chen',
        role: 'Operations Director',
        company: defaultClient,
      },
    ],
    projectOverview: customVariables.projectOverview,
    implementation: customVariables.implementation,
    conclusion: customVariables.conclusion,
  };
}

export default CASE_STUDY_TEMPLATE;
```
