#!/usr/bin/env tsx

/**
 * Example usage of the Feature Announcement Template
 * This file demonstrates how to create compelling feature announcements
 */

import {
  createFeatureAnnounceVariables,
  FeatureAnnounceVariables,
  generateFeatureAnnounceContent,
} from '../templates/feature-announce';

// Example 1: Complete feature announcement with all optional fields
export function createCompleteFeatureAnnounceExample() {
  const variables: FeatureAnnounceVariables = {
    title: 'Introducing Real-Time Collaboration: Present Together, Perfectly',
    featureName: 'Real-Time Collaboration',
    version: '3.2.0',
    description:
      'Real-Time Collaboration allows multiple presenters to coordinate seamlessly during live presentations. With synchronized timers, shared notes, and instant communication, your team can deliver cohesive presentations that captivate audiences.',
    benefits: [
      'Synchronize timing across multiple speakers automatically',
      'Share real-time notes and cues with your presentation team',
      'Reduce handoff delays by 75% between speakers',
      'Improve audience engagement with coordinated transitions',
      'Eliminate timing conflicts and overlapping content',
    ],
    useCases: [
      'Corporate all-hands meetings with multiple presenters',
      'Conference panels with scheduled speaking segments',
      'Team presentations with coordinated demonstrations',
      'Training sessions with instructor and assistant presenters',
      'Virtual events with host and guest speakers',
    ],
    releaseDate: '2025-11-15',
    videoUrl: 'https://www.youtube.com/watch?v=cuetimer-realtime-collab',
    screenshots: [
      {
        url: '/images/features/realtime-collab-dashboard.png',
        alt: 'Real-Time Collaboration dashboard showing multiple presenters',
        caption: 'See all presenters and their timing status in one unified view',
      },
      {
        url: '/images/features/realtime-collab-mobile.png',
        alt: 'Mobile view of Real-Time Collaboration',
        caption: 'Stay connected with your team from anywhere with mobile sync',
      },
      {
        url: '/images/features/realtime-collab-cues.png',
        alt: 'Shared cues and notifications interface',
        caption: 'Send and receive real-time cues without disrupting the presentation',
      },
    ],
    breakingChanges: [
      'Updated API for timer synchronization (backward compatible)',
      'Enhanced security model requires team member authentication',
    ],
    upgradeInstructions:
      'Update to version 3.2.0 and invite team members to your workspace. No migration required for existing presentations.',
    technicalDetails: [
      {
        category: 'Performance',
        details: 'Sub-50ms latency synchronization across all team members with automatic failover',
      },
      {
        category: 'Security',
        details: 'End-to-end encryption with role-based access control and audit trails',
      },
      {
        category: 'Scalability',
        details: 'Supports up to 50 concurrent presenters with automatic load balancing',
      },
    ],
    pricing: {
      tier: 'Professional',
      includedInPlans: ['Professional', 'Enterprise', 'Education'],
      additionalCost: 'Available at no additional cost for Professional and Enterprise plans',
    },
    testimonials: [
      {
        text: 'Real-Time Collaboration has transformed our quarterly all-hands meetings. What used to be chaotic transitions between speakers is now seamless and professional.',
        author: 'Sarah Chen',
        role: 'Head of Communications',
        company: 'TechCorp Solutions',
      },
      {
        text: "The ability to see my co-presenter's timing in real-time has eliminated all the awkward handoffs we used to experience. It's like having a director for our presentations!",
        author: 'Michael Rodriguez',
        role: 'Product Marketing Manager',
        company: 'Innovation Labs',
      },
      {
        text: 'Our conference panels have never been smoother. The shared cues and synchronized timing keep everyone on track without disrupting the flow.',
        author: 'Emily Watson',
        role: 'Event Coordinator',
        company: 'Global Summit Series',
      },
    ],
  };

  return generateFeatureAnnounceContent(variables);
}

// Example 2: Simple feature announcement with minimal configuration
export function createSimpleFeatureAnnounceExample() {
  const variables = createFeatureAnnounceVariables({
    title: 'Dark Mode: Present Comfortably Anytime',
    featureName: 'Dark Mode',
    version: '3.1.5',
    benefits: [
      'Reduced eye strain during long presentations',
      'Better visibility in dark presentation rooms',
      'Professional appearance on stage',
      'Battery savings on mobile devices',
    ],
    useCases: [
      'Evening presentations and conferences',
      'Dark auditorium environments',
      'Extended training sessions',
      'Mobile presentations on the go',
    ],
  });

  return generateFeatureAnnounceContent(variables);
}

// Example 3: Technical feature announcement
export function createTechnicalFeatureAnnounceExample() {
  const variables: FeatureAnnounceVariables = {
    title: 'Advanced Analytics API: Unlock Presentation Insights',
    featureName: 'Advanced Analytics API',
    version: '3.3.0',
    description:
      'The Advanced Analytics API provides programmatic access to comprehensive presentation metrics, allowing developers to build custom dashboards, integrate with existing BI tools, and create automated reporting workflows.',
    benefits: [
      'RESTful API with comprehensive endpoint coverage',
      'Real-time data streaming with WebSocket support',
      'Customizable metrics and dimensions',
      'Enterprise-grade security with OAuth 2.0',
      'Flexible data export in multiple formats',
    ],
    useCases: [
      'Custom executive dashboards for C-suite reporting',
      'Integration with existing BI and analytics platforms',
      'Automated monthly performance reports',
      'Real-time monitoring of presentation effectiveness',
      'Research and data analysis for presentation optimization',
    ],
    technicalDetails: [
      {
        category: 'API Architecture',
        details: 'RESTful design with OpenAPI 3.0 specification and interactive documentation',
      },
      {
        category: 'Authentication',
        details: 'OAuth 2.0 with JWT tokens and role-based access control',
      },
      {
        category: 'Rate Limiting',
        details: 'Configurable rate limits with burst capacity and fair usage policies',
      },
      {
        category: 'Data Formats',
        details: 'JSON, CSV, XML export options with customizable schemas',
      },
    ],
    pricing: {
      tier: 'Enterprise',
      includedInPlans: ['Enterprise'],
      additionalCost: 'Available as add-on for Professional plans at $99/month',
    },
  };

  return generateFeatureAnnounceContent(variables);
}

// Example 4: Mobile feature announcement
export function createMobileFeatureAnnounceExample() {
  const variables = createFeatureAnnounceVariables({
    title: 'CueTimer Mobile: Your Presentation Timer in Your Pocket',
    featureName: 'Mobile App',
    version: '2.0.0',
    description:
      "The CueTimer Mobile app brings the power of professional presentation timing to your smartphone. With intuitive controls, haptic feedback, and seamless sync across all your devices, you'll never miss a timing cue again.",
    benefits: [
      'Control presentations from anywhere in the room',
      'Haptic feedback for discreet timing alerts',
      'Offline mode for venues without internet',
      'Instant sync with desktop and web versions',
      'Apple Watch integration for at-a-glance timing',
    ],
    useCases: [
      'Conference speakers presenting from stage',
      'Teachers managing classroom presentations',
      'Sales professionals in client meetings',
      'Event coordinators monitoring multiple sessions',
      'Public speakers needing mobility',
    ],
    screenshots: [
      {
        url: '/images/features/mobile-main-screen.png',
        alt: 'CueTimer mobile app main screen',
        caption: 'Clean, intuitive interface designed for quick access during presentations',
      },
      {
        url: '/images/features/mobile-controls.png',
        alt: 'Mobile gesture controls',
        caption: 'Swipe gestures and large buttons for easy control without looking',
      },
      {
        url: '/images/features/mobile-watch-app.png',
        alt: 'Apple Watch integration',
        caption: 'Essential timing information on your wrist with the Apple Watch app',
      },
    ],
    testimonials: [
      {
        text: 'The mobile app has been a game-changer for my conference presentations. I can move around the stage while keeping perfect control of my timing.',
        author: 'David Thompson',
        role: 'Keynote Speaker',
        company: 'Leadership Institute',
      },
    ],
  });

  return generateFeatureAnnounceContent(variables);
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Generating Feature Announcement Examples...\n');

  console.log('1. Complete Feature Announcement:');
  console.log('=================================');
  const completeExample = createCompleteFeatureAnnounceExample();
  console.log(`Generated ${completeExample.length} characters of content`);
  console.log(`Preview: ${completeExample.substring(0, 200)}...\n`);

  console.log('2. Simple Feature Announcement:');
  console.log('===============================');
  const simpleExample = createSimpleFeatureAnnounceExample();
  console.log(`Generated ${simpleExample.length} characters of content`);
  console.log(`Preview: ${simpleExample.substring(0, 200)}...\n`);

  console.log('3. Technical Feature Announcement:');
  console.log('===================================');
  const technicalExample = createTechnicalFeatureAnnounceExample();
  console.log(`Generated ${technicalExample.length} characters of content`);
  console.log(`Preview: ${technicalExample.substring(0, 200)}...\n`);

  console.log('4. Mobile Feature Announcement:');
  console.log('===============================');
  const mobileExample = createMobileFeatureAnnounceExample();
  console.log(`Generated ${mobileExample.length} characters of content`);
  console.log(`Preview: ${mobileExample.substring(0, 200)}...\n`);

  console.log('✅ All examples generated successfully!');
  console.log('\nTo use these examples:');
  console.log('1. Import the desired function from this file');
  console.log('2. Call the function to generate MDX content');
  console.log('3. Save the output to a .mdx file in your blog content directory');
  console.log('4. Customize as needed for your specific feature');
}

export default {
  createCompleteFeatureAnnounceExample,
  createSimpleFeatureAnnounceExample,
  createTechnicalFeatureAnnounceExample,
  createMobileFeatureAnnounceExample,
};
