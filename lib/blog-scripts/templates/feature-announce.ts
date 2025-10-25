import { ContentSection, CueTimerTemplate, TemplateVariable } from '../types';

export interface FeatureAnnounceVariables {
  title: string;
  featureName: string;
  version: string;
  description: string;
  benefits: string[];
  useCases: string[];
  releaseDate?: string;
  videoUrl?: string;
  screenshots?: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  breakingChanges?: string[];
  upgradeInstructions?: string;
  technicalDetails?: Array<{
    category: string;
    details: string;
  }>;
  pricing?: {
    tier?: string;
    includedInPlans?: string[];
    additionalCost?: string;
  };
  testimonials?: Array<{
    text: string;
    author: string;
    role: string;
    company?: string;
  }>;
}

const FEATURE_ANNOUNCE_TEMPLATE: CueTimerTemplate = {
  id: 'feature-announce',
  name: 'Feature Announcement Template',
  category: 'feature-announce',
  languages: ['en', 'pt-br', 'es'],
  variables: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'The title of the feature announcement',
    },
    {
      name: 'featureName',
      type: 'string',
      required: true,
      description: 'Name of the feature being announced',
    },
    {
      name: 'version',
      type: 'string',
      required: true,
      description: 'Version number of the release',
    },
    {
      name: 'description',
      type: 'string',
      required: true,
      description: 'Detailed description of the feature',
    },
    {
      name: 'benefits',
      type: 'array',
      required: true,
      description: 'Key benefits of the feature',
    },
    {
      name: 'useCases',
      type: 'array',
      required: true,
      description: 'Example use cases and scenarios',
    },
    {
      name: 'releaseDate',
      type: 'string',
      required: false,
      description: 'Release date of the feature',
      defaultValue: new Date().toISOString().split('T')[0],
    },
    {
      name: 'videoUrl',
      type: 'string',
      required: false,
      description: 'URL to demo video',
    },
    {
      name: 'screenshots',
      type: 'array',
      required: false,
      description: 'Feature screenshots with captions',
    },
    {
      name: 'breakingChanges',
      type: 'array',
      required: false,
      description: 'List of breaking changes if any',
    },
    {
      name: 'upgradeInstructions',
      type: 'string',
      required: false,
      description: 'Instructions for upgrading to use the feature',
    },
    {
      name: 'technicalDetails',
      type: 'array',
      required: false,
      description: 'Technical details about the implementation',
    },
    {
      name: 'pricing',
      type: 'string',
      required: false,
      description: 'Pricing information for the feature',
    },
    {
      name: 'testimonials',
      type: 'array',
      required: false,
      description: 'Early user testimonials and feedback',
    },
  ],
  contentStructure: [
    {
      id: 'announcement',
      title: 'Announcement',
      type: 'paragraph',
      required: true,
      order: 1,
    },
    {
      id: 'whatItDoes',
      title: 'What It Does',
      type: 'paragraph',
      required: true,
      order: 2,
    },
    {
      id: 'keyBenefits',
      title: 'Key Benefits',
      type: 'list',
      required: true,
      order: 3,
    },
    {
      id: 'perfectFor',
      title: 'Perfect For',
      type: 'list',
      required: true,
      order: 4,
    },
    {
      id: 'gettingStarted',
      title: 'Getting Started',
      type: 'list',
      required: true,
      order: 5,
    },
    {
      id: 'tryItToday',
      title: 'Try It Today',
      type: 'paragraph',
      required: true,
      order: 6,
    },
  ],
};

export function generateFeatureAnnounceContent(variables: FeatureAnnounceVariables): string {
  const {
    title,
    featureName,
    version,
    description,
    benefits,
    useCases,
    releaseDate = new Date().toISOString().split('T')[0],
    videoUrl,
    screenshots = [],
    breakingChanges = [],
    upgradeInstructions,
    technicalDetails = [],
    pricing,
    testimonials = [],
  } = variables;

  // Generate engaging announcement content
  const announcementContent = `We're thrilled to announce the launch of ${featureName}, a groundbreaking addition to CueTimer that will revolutionize how you manage presentation timing. This powerful new feature, available in version ${version}, represents our commitment to continuous innovation and user-centric design.`;

  // Generate what it does content
  const whatItDoesContent = `${description} This feature seamlessly integrates into your existing CueTimer workflow, providing enhanced capabilities that save time, improve accuracy, and deliver better presentation outcomes.`;

  // Generate getting started steps
  const gettingStartedSteps = [
    'Update to the latest version of CueTimer',
    'Navigate to the feature settings in your dashboard',
    'Configure your preferences and customize the feature',
    'Test with a practice presentation',
    'Deploy in your next live presentation',
  ];

  // Generate call to action content
  const tryItTodayContent = `Ready to experience the power of ${featureName}? Update your CueTimer today and discover how this new feature can transform your presentation delivery. Whether you're a seasoned speaker or just starting out, ${featureName} provides the tools you need to succeed.`;

  // Calculate read time based on content length
  const baseReadTime = 5;
  const additionalReadTime =
    benefits.length * 0.3 + useCases.length * 0.2 + screenshots.length * 0.5;
  const readTime = Math.ceil(baseReadTime + additionalReadTime);

  // Generate MDX content
  const mdxContent = `---
title: "${title}"
category: "feature-announce"
summary: "Introducing ${featureName} - the latest CueTimer feature that enhances your presentation timing experience."
author: "CueTimer Team"
version: "${version}"
releaseDate: "${releaseDate}"
readTime: ${readTime}
tags: ["feature", "announcement", "cuetimer", "${featureName.toLowerCase().replace(/\s+/g, '-')}"]
isDraft: false
language: "en"
lastModified: "${new Date().toISOString()}"
---

import {
  SparklesIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  PlayIcon,
  ArrowRightIcon,
  StarIcon,
  BoltIcon,
  ShieldCheckIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

# ${title}

<div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg mb-8">
  <div className="flex items-center gap-3 mb-4">
    <SparklesIcon className="w-8 h-8" />
    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
      New Feature
    </span>
    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
      v${version}
    </span>
  </div>
  <h2 className="text-3xl font-bold mb-4">Introducing ${featureName}</h2>
  <p className="text-xl text-purple-100 mb-6">
    ${announcementContent}
  </p>
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2">
      <CalendarIcon className="w-5 h-5" />
      <span>Released ${new Date(releaseDate || new Date().toISOString()).toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      )}</span>
    </div>
    ${
      benefits.length > 0
        ? `
    <div className="flex items-center gap-2">
      <CheckCircleIcon className="w-5 h-5" />
      <span>${benefits.length} Key Benefits</span>
    </div>
    `
        : ''
    }
  </div>
</div>

## What It Does

${whatItDoesContent}

${
  videoUrl
    ? `
## See It In Action

<div className="bg-gray-100 rounded-lg p-8 mb-8 text-center">
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="aspect-video bg-gray-200 flex items-center justify-center">
      <button className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition-colors">
        <PlayIcon className="w-8 h-8" />
      </button>
    </div>
  </div>
  <p className="mt-4 text-gray-600">
    Watch our 2-minute demo to see ${featureName} in action
  </p>
</div>
`
    : ''
}

${
  screenshots.length > 0
    ? `
## Feature Showcase

<div className="grid md:grid-cols-2 gap-6 mb-8">
  ${screenshots
    .map(
      (screenshot, index) => `
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="aspect-video bg-gray-200 flex items-center justify-center">
      <img src="${screenshot.url}" alt="${screenshot.alt}" className="w-full h-full object-cover" />
    </div>
    ${
      screenshot.caption
        ? `
    <div className="p-4">
      <p class="text-sm text-gray-600">${screenshot.caption}</p>
    </div>
    `
        : ''
    }
  </div>
  `
    )
    .join('')}
</div>
`
    : ''
}

## Key Benefits

<div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg mb-8">
  <h3 className="text-xl font-semibold text-green-900 mb-4">🎯 Why You'll Love ${featureName}</h3>
  <div className="grid md:grid-cols-2 gap-4">
    ${benefits
      .map(
        (benefit, index) => `
    <div className="flex items-start gap-3">
      <CheckCircleIcon className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
      <div>
        <h4 class="font-medium text-green-900 mb-1">Benefit ${index + 1}</h4>
        <p class="text-green-800">${benefit}</p>
      </div>
    </div>
    `
      )
      .join('')}
  </div>
</div>

## Perfect For

<div className="bg-blue-50 p-6 rounded-lg mb-8">
  <h3 className="text-xl font-semibold text-blue-900 mb-4">🎭 Ideal Use Cases</h3>
  <div className="space-y-4">
    ${useCases
      .map(
        (useCase, index) => `
    <div className="flex items-start gap-3">
      <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
        <BoltIcon className="w-4 h-4 text-blue-600" />
      </div>
      <div>
        <h4 class="font-medium text-blue-900 mb-1">Use Case ${index + 1}</h4>
        <p class="text-blue-800">${useCase}</p>
      </div>
    </div>
    `
      )
      .join('')}
  </div>
</div>

## Getting Started

<div className="bg-gray-50 p-6 rounded-lg mb-8">
  <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 Quick Start Guide</h3>
  <div className="space-y-4">
    ${gettingStartedSteps
      .map(
        (step, index) => `
    <div className="flex items-start gap-3">
      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
        ${index + 1}
      </div>
      <p class="text-gray-700 pt-1">${step}</p>
    </div>
    `
      )
      .join('')}
  </div>

  ${
    upgradeInstructions
      ? `
  <div class="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
    <h4 class="font-semibold text-yellow-900 mb-2">💡 Upgrade Instructions</h4>
    <p class="text-yellow-800">${upgradeInstructions}</p>
  </div>
  `
      : ''
  }
</div>

${
  breakingChanges.length > 0
    ? `
## Important Notes

<div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
  <h3 className="text-lg font-semibold text-red-900 mb-4">⚠️ Breaking Changes</h3>
  <div className="space-y-2">
    ${breakingChanges
      .map(
        (change) => `
    <div class="flex items-start gap-2">
      <span class="text-red-600 mt-1">•</span>
      <p class="text-red-800">${change}</p>
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
  technicalDetails.length > 0
    ? `
## Technical Details

<div className="bg-gray-100 p-6 rounded-lg mb-8">
  <h3 className="text-xl font-semibold text-gray-900 mb-4">🔧 Under the Hood</h3>
  <div className="space-y-4">
    ${technicalDetails
      .map(
        (detail) => `
    <div class="bg-white p-4 rounded-lg">
      <h4 class="font-medium text-gray-900 mb-2">${detail.category}</h4>
      <p class="text-gray-700">${detail.details}</p>
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
  pricing
    ? `
## Pricing & Availability

<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-8">
  <h3 className="text-xl font-semibold text-purple-900 mb-4">💰 Access & Pricing</h3>
  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <h4 className="font-medium text-purple-900 mb-2">Included Plans</h4>
      <div className="space-y-2">
        ${
          pricing.includedInPlans
            ? pricing.includedInPlans
                .map(
                  (plan) => `
        <div class="flex items-center gap-2">
          <CheckCircleIcon class="w-4 h-4 text-green-600" />
          <span class="text-purple-800">${plan}</span>
        </div>
        `
                )
                .join('')
            : '<p class="text-purple-800">Available for all plans</p>'
        }
      </div>
    </div>
    <div>
      <h4 className="font-medium text-purple-900 mb-2">Additional Features</h4>
      ${
        pricing.additionalCost
          ? `
      <p class="text-purple-800">${pricing.additionalCost}</p>
      `
          : '<p class="text-purple-800">No additional cost</p>'
      }
    </div>
  </div>
</div>
`
    : ''
}

${
  testimonials.length > 0
    ? `
## Early User Feedback

<div className="space-y-6 mb-8">
  ${testimonials
    .map(
      (testimonial, index) => `
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-indigo-200">
    <div className="flex items-start gap-4">
      <div className="bg-indigo-100 rounded-full p-3 flex-shrink-0">
        <StarIcon className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="flex-1">
        <blockquote className="text-lg text-gray-800 italic mb-4">
          "${testimonial.text}"
        </blockquote>
        <div className="text-right">
          <div className="font-semibold text-gray-900">${testimonial.author}</div>
          <div className="text-sm text-gray-600">${testimonial.role}${testimonial.company ? `, ${testimonial.company}` : ''}</div>
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

## Try It Today

${tryItTodayContent}

<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
  <div className="text-center">
    <h3 className="text-2xl font-bold mb-4">🎉 Ready to Get Started?</h3>
    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
      Join thousands of presenters who are already using CueTimer to deliver exceptional presentations.
    </p>
    <div className="flex gap-4 justify-center">
      <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
        Try ${featureName} Now
        <ArrowRightIcon className="w-5 h-5" />
      </button>
      <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
        View Documentation
      </button>
    </div>
  </div>
</div>

---

## Related Updates

- [CueTimer Roadmap 2024](/blog/cuetimer-roadmap-2024)
- [Best Practices for ${featureName}](/blog/${featureName.toLowerCase().replace(/\s+/g, '-')}-best-practices)
- [Customer Success Stories](/blog/customer-success-stories)

<div className="bg-gray-50 p-4 rounded-lg mt-8">
  <h3 className="font-semibold text-gray-900 mb-2">📈 What's Next?</h3>
  <p className="text-gray-700">
    ${featureName} is just the beginning. We're constantly working on new features and improvements based on your feedback.
    Have suggestions or questions? <a href="/contact" className="text-blue-600 hover:underline">Get in touch with our team</a>.
  </p>
</div>

---

<div className="text-center text-sm text-gray-500 mt-8">
  <p>This feature announcement was published on ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}</p>
  <p>Version ${version} is now available for all CueTimer users.</p>
</div>
`;

  return mdxContent;
}

// Helper function to create feature announcement variables with realistic defaults
export function createFeatureAnnounceVariables(
  customVariables: Partial<FeatureAnnounceVariables>
): FeatureAnnounceVariables {
  const featureTypes = [
    'Analytics Dashboard',
    'Real-time Collaboration',
    'Advanced Scheduling',
    'Mobile App Integration',
    'Custom Templates',
    'AI-powered Insights',
    'Team Management',
    'Presentation Recording',
    'Live Polling',
    'Multi-language Support',
  ];

  const defaultFeatureName =
    customVariables.featureName || featureTypes[Math.floor(Math.random() * featureTypes.length)];
  const defaultVersion = customVariables.version || '2.5.0';

  return {
    title:
      customVariables.title || `Introducing ${defaultFeatureName}: Transform Your Presentations`,
    featureName: defaultFeatureName || 'Advanced Analytics',
    version: defaultVersion,
    description:
      customVariables.description ||
      `${defaultFeatureName} is a powerful new addition to CueTimer that helps presenters deliver more engaging and effective presentations. With intuitive controls and seamless integration, this feature addresses the most common challenges faced by speakers and event organizers.`,
    benefits: customVariables.benefits || [
      'Save up to 30% on presentation preparation time',
      'Increase audience engagement by 45%',
      'Reduce presentation anxiety with real-time feedback',
      'Improve timing accuracy across all presentation segments',
      'Enhance team collaboration and coordination',
    ],
    useCases: customVariables.useCases || [
      'Corporate training sessions and workshops',
      'Academic lectures and educational presentations',
      'Conference keynote speeches and panel discussions',
      'Sales presentations and client meetings',
      'Virtual events and webinars',
      'Team meetings and project updates',
    ],
    releaseDate: customVariables.releaseDate || new Date().toISOString().split('T')[0],
    videoUrl:
      customVariables.videoUrl ||
      `https://www.youtube.com/watch?v=demo-${(defaultFeatureName || 'advanced-analytics').toLowerCase().replace(/\s+/g, '-')}`,
    screenshots: customVariables.screenshots || [
      {
        url: `/images/features/${(defaultFeatureName || 'advanced-analytics').toLowerCase().replace(/\s+/g, '-')}-dashboard.png`,
        alt: `${defaultFeatureName || 'Advanced Analytics'} dashboard interface`,
        caption: 'Clean and intuitive interface makes it easy to get started',
      },
      {
        url: `/images/features/${(defaultFeatureName || 'advanced-analytics').toLowerCase().replace(/\s+/g, '-')}-mobile.png`,
        alt: `${defaultFeatureName || 'Advanced Analytics'} mobile app view`,
        caption: 'Access your presentations anywhere with our mobile app',
      },
    ],
    breakingChanges: customVariables.breakingChanges || [],
    upgradeInstructions:
      customVariables.upgradeInstructions ||
      `Simply update your CueTimer app to version ${defaultVersion} and the ${defaultFeatureName} feature will be automatically available in your dashboard. No additional setup required!`,
    technicalDetails: customVariables.technicalDetails || [
      {
        category: 'Performance',
        details: 'Optimized for real-time processing with sub-100ms response times',
      },
      {
        category: 'Security',
        details: 'End-to-end encryption and SOC 2 compliant data handling',
      },
      {
        category: 'Integration',
        details: 'Seamless integration with popular presentation tools and platforms',
      },
    ],
    pricing: customVariables.pricing || {
      includedInPlans: ['Professional', 'Enterprise'],
      additionalCost: 'Available at no extra cost for existing Professional and Enterprise users',
    },
    testimonials: customVariables.testimonials || [
      {
        text: `${defaultFeatureName} has completely changed how we approach presentations. Our team is more confident and our audience engagement has never been better.`,
        author: 'Alex Thompson',
        role: 'Head of Training',
        company: 'TechCorp Inc.',
      },
      {
        text: "The real-time feedback and analytics features have given us insights we never had before. It's been a game-changer for our quarterly reviews.",
        author: 'Maria Garcia',
        role: 'Operations Director',
        company: 'Global Solutions',
      },
    ],
  };
}

export default FEATURE_ANNOUNCE_TEMPLATE;
