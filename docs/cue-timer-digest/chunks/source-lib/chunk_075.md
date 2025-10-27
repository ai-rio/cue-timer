# Chunk 75: source_lib

## Metadata

- **Files**: 4
- **Size**: 21,616 characters (~5,404 tokens)
- **Categories**: source

## Files in this chunk

- `lib/auth/supabase.ts`
- `lib/blog-scripts/content-creator.ts`
- `lib/blog-scripts/types.ts`
- `lib/blog-scripts/examples/feature-announce-example.ts`

---

## File: `lib/auth/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

import { User } from '@/types/auth';

// Helper function to safely extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unknown error occurred';
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user
      ? {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name,
          avatar_url: user.user_metadata?.avatar_url,
          created_at: user.created_at,
          updated_at: user.updated_at || '',
        }
      : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function sendMagicLink(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateProfile(
  userId: string,
  updates: {
    name?: string;
    avatar_url?: string;
    timezone?: string;
    language?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.updateUser({
      data: updates,
    });
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function resetPassword(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteAccount(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc('delete_user_account', {
      user_id: userId,
    });
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export { supabase as default };
```

## File: `lib/blog-scripts/content-creator.ts`

```typescript
import { promises as fs } from 'fs';
import { join } from 'path';
import { z } from 'zod';

import { CueTimerTemplate } from './types';

const BlogPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.enum([
    'timing-guide',
    'case-study',
    'feature-announce',
    'presentation-tips',
  ]),
  summary: z.string(),
  author: z.string(),
  publishedAt: z.string(),
  readTime: z.number(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isDraft: z.boolean().default(true),
  difficulty: z.string().optional(),
  language: z.string().default('en'),
  lastModified: z.string().default(new Date().toISOString()),
  content: z.string(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

export class ContentCreator {
  private contentDir: string;
  private templatesDir: string;

  constructor() {
    this.contentDir = join(process.cwd(), 'content', 'blog');
    this.templatesDir = join(__dirname, 'templates');
  }

  async createPost(
    template: CueTimerTemplate,
    variables: Record<string, string | number | boolean | string[]>,
    language: string = 'en'
  ): Promise<BlogPost> {
    // Validate required variables
    this.validateTemplateVariables(template, variables);

    // Generate post data
    const postData = this.generatePostData(template, variables, language);

    // Create file path
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const fileName = `${postData.slug}.mdx`;
    const filePath = join(this.contentDir, year.toString(), month, fileName);

    // Ensure directory exists
    await fs.mkdir(join(this.contentDir, year.toString(), month), {
      recursive: true,
    });

    // Write file
    const content = this.serializePost(postData);
    await fs.writeFile(filePath, content, 'utf-8');

    return postData;
  }

  private validateTemplateVariables(
    template: CueTimerTemplate,
    variables: Record<string, string | number | boolean | string[]>
  ): void {
    for (const variable of template.variables) {
      if (variable.required && !variables[variable.name]) {
        throw new Error(`Required variable "${variable.name}" is missing`);
      }
    }
  }

  private generatePostData(
    template: CueTimerTemplate,
    variables: Record<string, string | number | boolean | string[]>,
    language: string
  ): BlogPost {
    const title = variables.title || 'Untitled Post';
    const slug = this.generateSlug(title as string, language);

    const postData: Partial<BlogPost> &
      Record<string, string | number | boolean | string[]> = {
      title: title as string,
      slug,
      category: template.category,
      summary:
        (variables.summary as string) ||
        `A ${(template.category as string).replace('-', ' ')} about ${(title as string).toLowerCase()}`,
      author: (variables.author as string) || 'CueTimer Team',
      publishedAt:
        (variables.publishedAt as string) || new Date().toISOString(),
      readTime: this.estimateReadingTime((variables.content as string) || ''),
      isDraft: variables.isDraft !== false,
      language,
      lastModified: new Date().toISOString(),
      content:
        (variables.content as string) ||
        `# ${title}\n\nThis is a blog post about ${title}.`,
      ...variables,
    };

    return BlogPostSchema.parse(postData);
  }

  private generateSlug(title: string, language: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    return language !== 'en' ? `${slug}-${language}` : slug;
  }

  private estimateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  private serializePost(post: BlogPost): string {
    const { content: postContent, ...frontmatter } = post;

    const frontmatterYaml = Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map((v) => `"${v}"`).join(', ')}]`;
        }
        return `${key}: ${typeof value === 'string' ? `"${value}"` : value}`;
      })
      .join('\n');

    const content =
      postContent ||
      `# ${post.title}\n\nThis is a blog post about ${post.title}.`;

    return `---\n${frontmatterYaml}\n---\n\n${content}`;
  }

  async validateContent(
    post: BlogPost
  ): Promise<{ valid: boolean; errors: string[] }> {
    try {
      BlogPostSchema.parse(post);
      return { valid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          errors: (error as any).errors.map(
            (e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`
          ),
        };
      }
      return { valid: false, errors: ['Unknown validation error'] };
    }
  }
}
```

## File: `lib/blog-scripts/types.ts`

```typescript
export interface BlogPost {
  title: string;
  slug: string;
  category:
    | 'timing-guide'
    | 'case-study'
    | 'feature-announce'
    | 'presentation-tips';
  summary: string;
  author: string;
  publishedAt: string;
  readTime: number;
  image?: string;
  tags?: string[];
  isDraft: boolean;
  difficulty?: string;
  language: string;
  lastModified: string;
  content?: string;
}

export interface CueTimerTemplate {
  id: string;
  name: string;
  category:
    | 'timing-guide'
    | 'case-study'
    | 'feature-announce'
    | 'presentation-tips';
  languages: string[];
  variables: TemplateVariable[];
  contentStructure: ContentSection[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
  description: string;
  defaultValue?: string | number | boolean | string[];
}

export interface ContentSection {
  id: string;
  title: string;
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'image';
  required: boolean;
  order: number;
}

export interface MultiLanguagePost {
  masterPost: BlogPost;
  translations: Map<string, BlogPost>;
  workflowState:
    | 'draft'
    | 'in-translation'
    | 'in-review'
    | 'scheduled'
    | 'published';
  synchronizationStatus: SyncStatus;
}

export interface SyncStatus {
  isMaster: boolean;
  lastSynced: Date;
  pendingTranslations: string[];
  inconsistentFields: string[];
}

export interface ContentMetrics {
  postSlug: string;
  language: string;
  views: number;
  readTime: number;
  bounceRate: number;
  featureEngagement: Record<string, number>;
  seoScore: number;
}

export interface SEOResult {
  score: number;
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  keywords: KeywordAnalysis[];
}

export interface SEOIssue {
  type: 'missing' | 'invalid' | 'suboptimal';
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface SEORecommendation {
  category: 'content' | 'technical' | 'keywords';
  priority: 'high' | 'medium' | 'low';
  action: string;
  impact: string;
}

export interface KeywordAnalysis {
  keyword: string;
  density: number;
  relevance: number;
  competition: 'low' | 'medium' | 'high';
}
```

## File: `lib/blog-scripts/examples/feature-announce-example.ts`

```typescript
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
        caption:
          'See all presenters and their timing status in one unified view',
      },
      {
        url: '/images/features/realtime-collab-mobile.png',
        alt: 'Mobile view of Real-Time Collaboration',
        caption: 'Stay connected with your team from anywhere with mobile sync',
      },
      {
        url: '/images/features/realtime-collab-cues.png',
        alt: 'Shared cues and notifications interface',
        caption:
          'Send and receive real-time cues without disrupting the presentation',
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
        details:
          'Sub-50ms latency synchronization across all team members with automatic failover',
      },
      {
        category: 'Security',
        details:
          'End-to-end encryption with role-based access control and audit trails',
      },
      {
        category: 'Scalability',
        details:
          'Supports up to 50 concurrent presenters with automatic load balancing',
      },
    ],
    pricing: {
      tier: 'Professional',
      includedInPlans: ['Professional', 'Enterprise', 'Education'],
      additionalCost:
        'Available at no additional cost for Professional and Enterprise plans',
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
        details:
          'RESTful design with OpenAPI 3.0 specification and interactive documentation',
      },
      {
        category: 'Authentication',
        details: 'OAuth 2.0 with JWT tokens and role-based access control',
      },
      {
        category: 'Rate Limiting',
        details:
          'Configurable rate limits with burst capacity and fair usage policies',
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
        caption:
          'Clean, intuitive interface designed for quick access during presentations',
      },
      {
        url: '/images/features/mobile-controls.png',
        alt: 'Mobile gesture controls',
        caption:
          'Swipe gestures and large buttons for easy control without looking',
      },
      {
        url: '/images/features/mobile-watch-app.png',
        alt: 'Apple Watch integration',
        caption:
          'Essential timing information on your wrist with the Apple Watch app',
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
  console.warn('Generating Feature Announcement Examples...\n');

  console.warn('1. Complete Feature Announcement:');
  console.warn('=================================');
  const completeExample = createCompleteFeatureAnnounceExample();
  console.warn(`Generated ${completeExample.length} characters of content`);
  console.warn(`Preview: ${completeExample.substring(0, 200)}...\n`);

  console.warn('2. Simple Feature Announcement:');
  console.warn('===============================');
  const simpleExample = createSimpleFeatureAnnounceExample();
  console.warn(`Generated ${simpleExample.length} characters of content`);
  console.warn(`Preview: ${simpleExample.substring(0, 200)}...\n`);

  console.warn('3. Technical Feature Announcement:');
  console.warn('===================================');
  const technicalExample = createTechnicalFeatureAnnounceExample();
  console.warn(`Generated ${technicalExample.length} characters of content`);
  console.warn(`Preview: ${technicalExample.substring(0, 200)}...\n`);

  console.warn('4. Mobile Feature Announcement:');
  console.warn('===============================');
  const mobileExample = createMobileFeatureAnnounceExample();
  console.warn(`Generated ${mobileExample.length} characters of content`);
  console.warn(`Preview: ${mobileExample.substring(0, 200)}...\n`);

  console.warn('✅ All examples generated successfully!');
  console.warn('\nTo use these examples:');
  console.warn('1. Import the desired function from this file');
  console.warn('2. Call the function to generate MDX content');
  console.warn(
    '3. Save the output to a .mdx file in your blog content directory'
  );
  console.warn('4. Customize as needed for your specific feature');
}

export default {
  createCompleteFeatureAnnounceExample,
  createSimpleFeatureAnnounceExample,
  createTechnicalFeatureAnnounceExample,
  createMobileFeatureAnnounceExample,
};
```
