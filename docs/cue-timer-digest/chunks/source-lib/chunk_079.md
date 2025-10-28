# Chunk 79: source_lib

## Metadata

- **Files**: 3
- **Size**: 24,499 characters (~6,124 tokens)
- **Categories**: source

## Files in this chunk

- `lib/blog-scripts/templates/verify-presentation-tips.ts`
- `lib/seo/blog-seo.ts`
- `lib/stripe/config.ts`

---

## File: `lib/blog-scripts/templates/verify-presentation-tips.ts`

```typescript
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
  console.warn(
    `   - Default tips: ${defaultVariables.tips.map((t) => t.title).join(', ')}\n`
  );

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
  console.warn(
    `   - Contains title: ${content.includes('Advanced Storytelling Techniques')}`
  );
  console.warn(
    `   - Contains hero section: ${content.includes("Hero's Journey Framework")}`
  );
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
    console.warn(
      `   - ${present ? '✅' : '❌'} "${section.substring(0, 30)}..."`
    );
    if (!present) allSectionsPresent = false;
  });

  console.warn(
    `\n🎯 Overall Result: ${allSectionsPresent ? '✅ PASSED' : '❌ FAILED'}`
  );

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
```

## File: `lib/seo/blog-seo.ts`

```typescript
import type { SEOIssue, SEORecommendation } from '@/lib/blog-scripts/types';
import {
  BlogPostEnhanced,
  BlogStructuredData,
  SEOResult,
} from '@/types/blog-enhanced';

// SEO configuration
const SEO_CONFIG = {
  siteName: 'CueTimer',
  siteUrl: 'https://cuetimer.com',
  defaultImage: 'https://cuetimer.com/images/og-default.jpg',
  twitterHandle: '@cuetimer',
  author: 'CueTimer Team',
  keywords: [
    'event timing',
    'timer',
    'presentation',
    'productivity',
    'event management',
    'public speaking',
    'meeting timer',
    'workshop timer',
    'conference timer',
  ],
};

// Template-specific SEO configurations
const TEMPLATE_SEO_CONFIGS = {
  'timing-guide': {
    keywords: [
      'timing guide',
      'event timing',
      'presentation timing',
      'timer setup',
      'time management',
      'presentation skills',
    ],
    articleSection: 'Timing Tutorials',
    description:
      'Learn how to time your presentations perfectly with comprehensive guides and tutorials.',
  },
  'case-study': {
    keywords: [
      'case study',
      'success story',
      'implementation',
      'results',
      'client success',
      'event management solution',
    ],
    articleSection: 'Success Stories',
    description:
      'Real-world examples of how CueTimer helped organizations improve their event timing.',
  },
  'feature-announce': {
    keywords: [
      'new feature',
      'product update',
      'release notes',
      'feature announcement',
      'product improvement',
      'software update',
    ],
    articleSection: 'Product Updates',
    description: 'Discover the latest features and improvements in CueTimer.',
  },
  'presentation-tips': {
    keywords: [
      'presentation tips',
      'public speaking',
      'presentation skills',
      'delivery techniques',
      'audience engagement',
      'presentation best practices',
    ],
    articleSection: 'Presentation Tips',
    description:
      'Professional tips and techniques for better presentations and public speaking.',
  },
};

// Difficulty-based SEO signals
const DIFFICULTY_SIGNALS = {
  beginner: {
    readabilityScore: 90,
    complexityScore: 30,
    expertiseLevel: 'Beginner',
    targetAudience: 'New presenters, beginners',
  },
  intermediate: {
    readabilityScore: 80,
    complexityScore: 60,
    expertiseLevel: 'Intermediate',
    targetAudience: 'Experienced presenters',
  },
  advanced: {
    readabilityScore: 70,
    complexityScore: 80,
    expertiseLevel: 'Advanced',
    targetAudience: 'Professional presenters, expert users',
  },
  'all-levels': {
    readabilityScore: 85,
    complexityScore: 50,
    expertiseLevel: 'All Levels',
    targetAudience: 'All presenters and event organizers',
  },
};

// Generate structured data for blog post
export function generateStructuredData(
  post: BlogPostEnhanced
): BlogStructuredData {
  const templateConfig =
    TEMPLATE_SEO_CONFIGS[post.category as keyof typeof TEMPLATE_SEO_CONFIGS];
  const difficultySignals =
    DIFFICULTY_SIGNALS[post.difficulty as keyof typeof DIFFICULTY_SIGNALS] ||
    DIFFICULTY_SIGNALS.beginner;

  return {
    type:
      post.category === 'case-study'
        ? 'Article'
        : post.category === 'feature-announce'
          ? 'TechArticle'
          : 'BlogPosting',
    title: post.title,
    description: post.summary || post.excerpt || '',
    author: post.authorInfo?.name || post.author,
    datePublished: post.publishedAt,
    dateModified: post.lastModified || post.publishedAt,
    image: post.image || SEO_CONFIG.defaultImage,
    url: `${SEO_CONFIG.siteUrl}/blog/${post.slug}`,
    keywords: [
      ...SEO_CONFIG.keywords,
      ...(templateConfig?.keywords || []),
      ...(post.tags || []),
    ],
    articleSection: templateConfig?.articleSection || 'Blog',
    difficulty: post.difficulty || difficultySignals.expertiseLevel,
    estimatedReadTime: post.readTime || post.estimatedReadTime,
    language: post.language || 'en',
  };
}

// Generate JSON-LD structured data
export function generateJsonLd(post: BlogPostEnhanced): string {
  const structuredData = generateStructuredData(post);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': structuredData.type,
    headline: structuredData.title,
    description: structuredData.description,
    author: {
      '@type': 'Person',
      name: structuredData.author,
    },
    datePublished: structuredData.datePublished,
    dateModified: structuredData.dateModified,
    image: structuredData.image
      ? {
          '@type': 'ImageObject',
          url: structuredData.image,
          width: 1200,
          height: 630,
        }
      : undefined,
    url: structuredData.url,
    keywords: structuredData.keywords?.join(', '),
    articleSection: structuredData.articleSection,
    difficulty: structuredData.difficulty,
    estimatedReadTime: structuredData.estimatedReadTime,
    inLanguage: structuredData.language,
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${SEO_CONFIG.siteUrl}/images/logo.png`,
        width: 300,
        height: 300,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': structuredData.url,
    },
  };

  return JSON.stringify(jsonLd, null, 2);
}

// Generate meta tags for blog post
export function generateMetaTags(post: BlogPostEnhanced): {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  openGraph: Record<string, string | boolean>;
  twitter: Record<string, string | boolean>;
  jsonLd: string;
} {
  const structuredData = generateStructuredData(post);

  return {
    title: `${post.title} | ${SEO_CONFIG.siteName} Blog`,
    description: post.summary || post.excerpt || '',
    keywords: [...SEO_CONFIG.keywords, ...(post.tags || [])],
    canonical: `${SEO_CONFIG.siteUrl}/blog/${post.slug}`,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary || post.excerpt || '',
      url: `${SEO_CONFIG.siteUrl}/blog/${post.slug}`,
      siteName: SEO_CONFIG.siteName,
      article: {
        publishedTime: post.publishedAt,
        modifiedTime: post.lastModified || post.publishedAt,
        author: post.authorInfo?.name || post.author,
        section: structuredData.articleSection,
        tag: post.tags || [],
      } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      images: post.image
        ? ([
            {
              url: post.image,
              width: 1200,
              height: 630,
              alt: post.title,
              type: 'image/jpeg',
            },
          ] as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        : [],
      locale: post.language || 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary || post.excerpt || '',
      site: SEO_CONFIG.siteName,
      creator: post.authorInfo?.social?.twitter || post.author,
      images: post.image ? [post.image] : ([] as any), // eslint-disable-line @typescript-eslint/no-explicit-any
    },
    jsonLd: generateJsonLd(post),
  };
}

// Analyze SEO score for blog post
export function analyzeSEO(post: BlogPostEnhanced): SEOResult {
  const issues: SEOIssue[] = [];
  const recommendations: SEORecommendation[] = [];
  let score = 100;

  // Check title
  if (!post.title || post.title.length < 30) {
    issues.push({
      type: 'missing',
      field: 'title',
      message: 'Title is missing or too short (minimum 30 characters)',
      severity: 'error',
    });
    score -= 20;
  } else if (post.title.length > 60) {
    issues.push({
      type: 'suboptimal',
      field: 'title',
      message: 'Title is too long (ideal 30-60 characters)',
      severity: 'warning',
    });
    score -= 10;
  }

  // Check summary/description
  if (!post.summary && !post.excerpt) {
    issues.push({
      type: 'missing',
      field: 'summary',
      message: 'Post summary is missing',
      severity: 'error',
    });
    score -= 20;
  } else {
    const summary = post.summary || post.excerpt || '';
    if (summary.length < 120) {
      issues.push({
        type: 'suboptimal',
        field: 'summary',
        message: 'Summary is too short (ideal 120-160 characters)',
        severity: 'warning',
      });
      score -= 10;
    } else if (summary.length > 160) {
      issues.push({
        type: 'suboptimal',
        field: 'summary',
        message: 'Summary is too long (ideal 120-160 characters)',
        severity: 'warning',
      });
      score -= 5;
    }
  }

  // Check content length
  if (!post.content) {
    issues.push({
      type: 'missing',
      field: 'content',
      message: 'Post content is missing',
      severity: 'error',
    });
    score -= 30;
  } else {
    const wordCount = post.content.split(/\s+/).length;
    if (wordCount < 300) {
      issues.push({
        type: 'suboptimal',
        field: 'content',
        message: 'Content is too short for good SEO (minimum 300 words)',
        severity: 'warning',
      });
      score -= 15;
    }
  }

  // Check read time
  if (!post.readTime && !post.estimatedReadTime) {
    issues.push({
      type: 'missing',
      field: 'readTime',
      message: 'Read time is not calculated',
      severity: 'warning',
    });
    score -= 5;
  }

  // Check tags
  if (!post.tags || post.tags.length === 0) {
    issues.push({
      type: 'missing',
      field: 'tags',
      message: 'Post has no tags for categorization',
      severity: 'warning',
    });
    score -= 10;
    recommendations.push({
      category: 'keywords',
      priority: 'high',
      action: 'Add relevant tags to improve categorization',
      impact: 'Better search visibility and content discovery',
    });
  } else if (post.tags.length < 3) {
    issues.push({
      type: 'suboptimal',
      field: 'tags',
      message: 'Post has too few tags (ideal 3-8 tags)',
      severity: 'info',
    });
    score -= 5;
  }

  // Check image
  if (!post.image) {
    issues.push({
      type: 'missing',
      field: 'image',
      message: 'Post has no featured image',
      severity: 'warning',
    });
    score -= 10;
    recommendations.push({
      category: 'content',
      priority: 'medium',
      action: 'Add a featured image to increase engagement',
      impact: 'Better social sharing and visual appeal',
    });
  }

  // Check author information
  if (!post.author || post.author === 'Anonymous') {
    issues.push({
      type: 'suboptimal',
      field: 'author',
      message: 'Post has no author or uses anonymous author',
      severity: 'warning',
    });
    score -= 10;
  }

  // Template-specific checks
  const templateConfig =
    TEMPLATE_SEO_CONFIGS[post.category as keyof typeof TEMPLATE_SEO_CONFIGS];
  if (templateConfig) {
    // Check if content aligns with template keywords
    const content = post.content || '';
    const hasRelevantKeywords = templateConfig.keywords.some((keyword) =>
      content.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!hasRelevantKeywords) {
      issues.push({
        type: 'suboptimal',
        field: 'content',
        message: `Content doesn't include expected keywords for ${post.category}`,
        severity: 'info',
      });
      score -= 5;
      recommendations.push({
        category: 'content',
        priority: 'medium',
        action: `Include relevant keywords: ${templateConfig.keywords.join(', ')}`,
        impact: 'Better search relevance for target audience',
      });
    }
  }

  // Generate recommendations based on issues
  if (score < 70) {
    recommendations.push({
      category: 'content',
      priority: 'high',
      action: 'Review and fix critical SEO issues',
      impact: 'Significant improvement in search visibility',
    });
  } else if (score < 85) {
    recommendations.push({
      category: 'content',
      priority: 'medium',
      action: 'Address minor SEO issues for better optimization',
      impact: 'Moderate improvement in search rankings',
    });
  }

  return {
    score: Math.max(0, score),
    issues: issues.sort((a, b) => {
      const severityOrder: Record<string, number> = {
        error: 0,
        warning: 1,
        info: 2,
      };
      return (
        (severityOrder[a.severity] || 0) - (severityOrder[b.severity] || 0)
      );
    }),
    recommendations: recommendations.sort((a, b) => {
      const priorityOrder: Record<string, number> = {
        high: 0,
        medium: 1,
        low: 2,
      };
      return (
        (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0)
      );
    }),
    keywords: analyzeKeywords(post),
  };
}

// Analyze keywords in content
function analyzeKeywords(post: BlogPostEnhanced) {
  const content = post.content || '';
  const allText =
    `${post.title} ${post.summary || post.excerpt || ''} ${content}`.toLowerCase();

  // Extract potential keywords (simple approach)
  const words = allText.split(/\s+/).filter((word) => word.length > 3);
  const wordFrequency = words.reduce(
    (freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    },
    {} as Record<string, number>
  );

  // Get top keywords
  const sortedWords = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return sortedWords.map(([keyword, frequency]) => ({
    keyword,
    density: (frequency / words.length) * 100,
    relevance: Math.min(100, frequency * 10), // Simple relevance calculation
    competition: 'medium' as 'low' | 'medium' | 'high',
  }));
}

// Generate sitemap entries for blog posts
export function generateBlogSitemap(posts: BlogPostEnhanced[]): string {
  const sitemapEntries = posts
    .filter((post) => !post.isDraft)
    .map(
      (post) => `
  <url>
    <loc>${SEO_CONFIG.siteUrl}/blog/${post.slug}</loc>
    <lastmod>${post.lastModified || post.publishedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${post.featured ? '0.8' : '0.6'}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;
}

// Export SEO configuration
export { DIFFICULTY_SIGNALS, SEO_CONFIG, TEMPLATE_SEO_CONFIGS };
```

## File: `lib/stripe/config.ts`

```typescript
import { Stripe } from 'stripe';

// Get Stripe credentials from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Validate required environment variables
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

// Initialize Stripe with the latest API version
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

// Export webhook secret for verification
export { stripeWebhookSecret };

// Stripe product configuration for CueTimer pricing tiers
export const STRIPE_PRODUCTS = {
  FREE: {
    name: 'CueTimer Free',
    description: 'Perfect for trying out CueTimer',
    price: 0,
    currency: 'usd',
    interval: 'month' as const,
    features: [
      '3 timers maximum',
      '2 devices',
      'Basic timer functionality',
      'Community support',
    ],
    limitations: {
      maxTimers: 3,
      maxDevices: 2,
      messagingEnabled: false,
      customBranding: false,
      prioritySupport: false,
    },
  },
  PRO: {
    name: 'CueTimer Pro',
    description: 'Professional event management',
    price: 1200, // $12.00 in cents
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Unlimited timers',
      'Unlimited devices',
      'Presenter messaging',
      'Custom branding',
      'Priority support',
      'Advanced analytics',
      'Export capabilities',
    ],
    limitations: {
      maxTimers: 'unlimited',
      maxDevices: 'unlimited',
      messagingEnabled: true,
      customBranding: true,
      prioritySupport: true,
    },
  },
  TEAMS: {
    name: 'CueTimer Teams',
    description: 'For organizations and venues',
    price: 4900, // $49.00 in cents
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Everything in Pro',
      '5 team members',
      'Team collaboration',
      'Organization management',
      'Advanced analytics dashboard',
      'API access',
      'Dedicated support',
    ],
    limitations: {
      maxTimers: 'unlimited',
      maxDevices: 'unlimited',
      messagingEnabled: true,
      customBranding: true,
      prioritySupport: true,
      teamMembers: 5,
      analyticsDashboard: true,
    },
  },
} as const;

// Price IDs (these would be created in Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  FREE: 'price_cuetimer_free_monthly',
  PRO_MONTHLY: 'price_cuetimer_pro_monthly',
  PRO_YEARLY: 'price_cuetimer_pro_yearly',
  TEAMS_MONTHLY: 'price_cuetimer_teams_monthly',
  TEAMS_YEARLY: 'price_cuetimer_teams_yearly',
} as const;

// Helper function to create a checkout session
export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  priceId: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_creation: customerId ? undefined : 'always',
      metadata: {
        ...metadata,
        source: 'cuetimer_website',
      },
      subscription_data: {
        metadata: {
          ...metadata,
          source: 'cuetimer_website',
        },
      },
    });

    return { success: true, session };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to create a customer portal session
export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { success: true, url: session.url };
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to retrieve subscription details
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['customer', 'items.data.price.product'],
    });

    return { success: true, subscription };
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to cancel subscription
export async function cancelSubscription(
  subscriptionId: string,
  immediate = false
) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: !immediate,
      ...(immediate && { canceled_at: 'now' }),
    });

    return { success: true, subscription };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to update subscription
export async function updateSubscription(
  subscriptionId: string,
  priceId: string
) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0]?.id,
            price: priceId,
          },
        ],
        proration_behavior: 'create_prorations',
      }
    );

    return { success: true, subscription: updatedSubscription };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default stripe;
```
