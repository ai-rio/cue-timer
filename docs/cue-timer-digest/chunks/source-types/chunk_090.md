# Chunk 90: source_types

## Metadata

- **Files**: 8
- **Size**: 19,130 characters (~4,782 tokens)
- **Categories**: source

## Files in this chunk

- `types/auth.ts`
- `types/blog-api.ts`
- `types/blog-enhanced.ts`
- `types/blog.ts`
- `types/jest.d.ts`
- `types/orders.ts`
- `types/stripe.ts`
- `types/supabase.ts`

---

## File: `types/auth.ts`

```typescript
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  user: User | null;
  expires: string | null;
}

export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkResponse {
  success: boolean;
  message: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  timezone?: string;
  language?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  name?: string;
  timezone?: string;
  language?: string;
}

export interface DeleteAccountRequest {
  confirmation: string;
  reason?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  stripe_price_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  plan_type?: string;
  billing_cycle?: string;
  created_at: string;
  updated_at?: string;
}
```

## File: `types/blog-api.ts`

```typescript
/**
 * Type definitions for blog API responses and enhanced type safety
 */

import type { BlogCategory as BaseBlogCategory } from '@/types/blog';

// Re-export BlogCategory with proper naming
export type BlogCategory = BaseBlogCategory;

// Generic API response wrapper for consistent error handling
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

// Enhanced blog post types with better type safety
export interface BlogFilter {
  category?: BlogCategory | 'all';
  featured?: boolean;
  searchTerm?: string;
  year?: number;
  tags?: string[];
  includeDrafts?: boolean;
  limit?: number;
  offset?: number;
}

// Enhanced MDX frontmatter types
export interface BlogFrontmatter {
  title: string;
  slug: string;
  summary: string;
  category: BlogCategory;
  author: string;
  publishedAt: string;
  readTime?: number;
  image?: string;
  imageAlt?: string;
  featured: boolean;
  draft: boolean;
  tags: string[];
  lastModified?: string;
  seo?: {
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

// Blog post with enhanced metadata
export interface BlogPostEnhanced extends BlogFrontmatter {
  content: string;
  excerpt: string;
  wordCount: number;
  publishedAtDate: Date;
  lastModifiedDate?: Date;
  readTime: number;
  locale?: string;
}

// Error types for better debugging
export interface BlogError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// Search and filter types
export interface SearchParams {
  q?: string;
  category?: string;
  tags?: string[];
  year?: number;
  featured?: boolean;
  sort?: 'date' | 'title' | 'readTime';
  order?: 'asc' | 'desc';
}

// Blog analytics types
export interface BlogAnalytics {
  totalPosts: number;
  postsByCategory: Record<string, number>;
  postsByYear: Record<number, number>;
  averageReadTime: number;
  featuredPosts: number;
  tagFrequency: Record<string, number>;
}

// Blog post navigation
export interface BlogPostNavigation {
  previous: BlogPostEnhanced | null;
  next: BlogPostEnhanced | null;
}

// Related posts with scoring
export interface RelatedPostScore {
  post: BlogPostEnhanced;
  score: number;
  reasons: string[];
}

// Blog category information interface (uses BlogCategory from types/blog)

// Blog state management types
export interface BlogState {
  posts: BlogPostEnhanced[];
  loading: boolean;
  error: BlogError | null;
  filter: BlogFilter;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Blog action types for state management
export type BlogAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_POSTS'; payload: BlogPostEnhanced[] }
  | { type: 'SET_ERROR'; payload: BlogError | null }
  | { type: 'SET_FILTER'; payload: BlogFilter }
  | { type: 'UPDATE_PAGINATION'; payload: Partial<BlogState['pagination']> }
  | { type: 'RESET_STATE' };

// API endpoint response types
export interface BlogListResponse extends ApiResponse<BlogPostEnhanced[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export type BlogPostResponse = ApiResponse<BlogPostEnhanced>;

export type BlogAnalyticsResponse = ApiResponse<BlogAnalytics>;

// Form validation types
export interface BlogFormData {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  publishedAt: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

// Comment system types (future enhancement)
export interface BlogComment {
  id: string;
  postId: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  replies?: BlogComment[];
  approved: boolean;
}

// Blog subscription types
export interface BlogSubscription {
  id: string;
  email: string;
  categories: string[];
  active: boolean;
  createdAt: Date;
}

// Export all types for backward compatibility
export type { BlogPost, BlogPostMetadata } from '@/types/blog';

// Re-export commonly used types with aliases for convenience
export type BlogPostBase = BlogPostEnhanced;
export type BlogFilterType = BlogFilter;
export type BlogAnalyticsType = BlogAnalytics;
```

## File: `types/blog-enhanced.ts`

```typescript
// Enhanced blog types integrating with new blog management system
import { LucideIcon } from 'lucide-react';

import {
  BlogPost as BaseBlogPost,
  CueTimerTemplate,
} from '../lib/blog-scripts/types';

// Import other types when needed
// import { ContentMetrics, MultiLanguagePost, SEOResult } from '../lib/blog-scripts/types';

// Enhanced blog post type that extends the base type with additional frontend properties
export interface BlogPostEnhanced
  extends Omit<BaseBlogPost, 'content' | 'language'> {
  // Enhanced content
  content: string;
  excerpt?: string;

  // Override language to be required
  language: string;

  // Additional metadata
  featured?: boolean;
  draft?: boolean;
  publishedAtDate?: Date;
  imageAlt?: string;
  wordCount?: number;
  publishedAtFormatted?: string;
  lastModifiedFormatted?: string;

  // Template-specific properties
  templateId?: string;
  templateData?: Record<string, unknown>;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';

  // Multi-language support
  translations?: Array<{
    language: string;
    slug: string;
    title: string;
  }>;
  isTranslation?: boolean;
  masterSlug?: string;

  // Enhanced SEO
  seoScore?: number;
  keywords?: string[];
  estimatedReadTime?: number;

  // Engagement metrics
  views?: number;
  likes?: number;
  shares?: number;

  // Content structure
  readingProgress?: {
    sections: number;
    currentSection: number;
  };

  // Author information
  authorInfo?: {
    name: string;
    avatar?: string;
    bio?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
  };
}

// Template configuration for UI
export interface TemplateConfig {
  id: CueTimerTemplate['id'];
  name: string;
  category: CueTimerTemplate['category'];
  displayName: string;
  description: string;
  icon: LucideIcon;
  color: string;
  difficulties: Array<'beginner' | 'intermediate' | 'advanced' | 'all-levels'>;
  features: string[];
  defaultImage?: string;
}

// Blog post filtering options
export interface BlogPostFilters {
  search?: string;
  category?: CueTimerTemplate['category'];
  template?: CueTimerTemplate['id'];
  difficulty?: string;
  language?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'date' | 'title' | 'readTime' | 'views' | 'seoScore';
  sortOrder?: 'asc' | 'desc';
}

// Blog search result
export interface BlogSearchResult {
  post: BlogPostEnhanced;
  score: number;
  matches: Array<{
    field: string;
    value: string;
    indices: number[];
  }>;
}

// Template-specific metadata
export interface TemplateMetadata {
  timingGuide?: {
    estimatedTime: string;
    targetAudience: string;
    tools: string[];
    prerequisites: string[];
  };
  caseStudy?: {
    client: string;
    industry: string;
    challenge: string;
    results: string[];
  };
  featureAnnounce?: {
    version: string;
    benefits: string[];
    useCases: string[];
  };
  presentationTips?: {
    topic: string;
    tips: string[];
    commonMistakes: string[];
  };
}

// Author information for enhanced author pages
export interface AuthorInfo {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  bio: string;
  role: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  stats: {
    postsCount: number;
    totalViews: number;
    totalReadTime: number;
    averageRating: number;
  };
  specialties: string[];
  joinedAt: string;
}

// Blog navigation item
export interface BlogNavigationItem {
  title: string;
  slug: string;
  excerpt?: string;
  featured?: boolean;
  template?: CueTimerTemplate['category'];
}

// Blog pagination info
export interface BlogPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Blog analytics data
export interface BlogAnalytics {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalReadTime: number;
  averageReadTime: number;
  topCategories: Array<{
    category: CueTimerTemplate['category'];
    count: number;
  }>;
  topAuthors: Array<{
    author: string;
    postsCount: number;
    totalViews: number;
  }>;
  recentPosts: BlogPostEnhanced[];
  popularPosts: BlogPostEnhanced[];
}

// Multi-language blog configuration
export interface MultiLanguageConfig {
  defaultLanguage: string;
  supportedLanguages: Array<{
    code: string;
    name: string;
    flag: string;
  }>;
  translationStatus: 'complete' | 'in-progress' | 'missing';
}

// SEO data for structured markup
export interface BlogStructuredData {
  type: 'BlogPosting' | 'Article' | 'TechArticle';
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  keywords?: string[];
  articleSection?: string;
  difficulty?: string;
  estimatedReadTime?: number;
  language: string;
}

// Blog content validation result
export interface BlogContentValidation {
  isValid: boolean;
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    category: 'seo' | 'content' | 'technical' | 'accessibility';
    message: string;
    field?: string;
    suggestion?: string;
  }>;
  recommendations: string[];
}

// Template-aware content components
export interface TemplateComponentProps {
  template: CueTimerTemplate;
  post: BlogPostEnhanced;
  metadata?: TemplateMetadata;
}

// Export base types for convenience
export type {
  BlogPost as BaseBlogPost,
  ContentMetrics,
  CueTimerTemplate,
  MultiLanguagePost,
  SEOResult,
} from '../lib/blog-scripts/types';

// Re-export navigation type with enhanced support
export type BlogPostNavigationEnhanced = {
  previous: BlogPostEnhanced | null;
  next: BlogPostEnhanced | null;
};
```

## File: `types/blog.ts`

```typescript
import { z } from 'zod';

// Blog post categories for CueTimer
export const blogCategories = [
  'timing', // Timer features and timing techniques
  'productivity', // Time management and productivity
  'events', // Event management and planning
  'features', // CueTimer feature releases
  'tutorials', // How-to guides and tutorials
  'industry', // Event industry insights
] as const;

export type BlogCategory = (typeof blogCategories)[number];

// SEO metadata schema
const SeoSchema = z.object({
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().url().optional(),
});

// Blog post frontmatter schema
export const BlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.enum(blogCategories),
  author: z.string().min(1, 'Author is required'),
  publishedAt: z.string().datetime(),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  readTime: z.number().int().positive().optional(),
  image: z.string().url().optional(),
  imageAlt: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  lastModified: z.string().datetime().optional(),
  seo: SeoSchema.optional(),
});

// Blog post metadata type
export type BlogPostMetadata = z.infer<typeof BlogPostSchema>;

// Complete blog post type with content
export interface BlogPost extends BlogPostMetadata {
  content: string;
  excerpt: string;
  wordCount: number;
  readTime: number;
  publishedAtDate: Date;
  lastModifiedDate?: Date;
  locale?: string;
}

// Blog listing filter type
export interface BlogFilter {
  searchTerm?: string;
  category?: BlogCategory | 'all';
  tags?: string[];
  featured?: boolean;
  year?: number;
  includeDrafts?: boolean;
  limit?: number;
  offset?: number;
}

// Blog post navigation type
export interface BlogPostNavigation {
  previous: BlogPost | null;
  next: BlogPost | null;
}

// Table of contents item type
export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
  children: TableOfContentsItem[];
}

// Related post scoring
export interface RelatedPostScore {
  post: BlogPost;
  score: number;
  reasons: string[];
}

// Blog analytics type
export interface BlogAnalytics {
  totalPosts: number;
  postsByCategory: Record<BlogCategory, number>;
  postsByYear: Record<number, number>;
  averageReadTime: number;
  featuredPosts: number;
  tagFrequency: Record<string, number>;
}

export default BlogPostSchema;
```

## File: `types/jest.d.ts`

```typescript
// Jest DOM type declarations
declare global {
  namespace jest {
    interface Matchers<R = void> {
      toBeInTheDocument(): R;
      toHaveFocus(): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: Record<string, string>): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | number): R;
      toBeChecked(): R;
      toHaveDescription(text: string | RegExp): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toHaveErrorMessage(text: string | RegExp): R;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toHaveFormValues(values: Record<string, any>): R;
      toHaveHTMLContent(html: string | RegExp): R;
      toHaveRole(role: string): R;
      toHaveAccessibleDescription(text: string | RegExp): R;
      toHaveAccessibleName(text: string | RegExp): R;
      toBeEmptyDOMElement(): R;
      toBePartiallyChecked(checkedState: 'true' | 'false' | 'mixed'): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
    }
  }
}

export {};
```

## File: `types/orders.ts`

```typescript
import { StripePrice, Subscription } from './stripe';

export interface Order {
  id: string;
  user_id: string;
  stripe_checkout_session_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  metadata?: Record<string, string>;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'canceled'
  | 'refunded'
  | 'partially_refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price_id: string;
  price: StripePrice;
  quantity: number;
  created_at: string;
}

export interface CreateOrderRequest {
  price_id: string;
  quantity?: number;
  metadata?: Record<string, string>;
  success_url?: string;
  cancel_url?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order?: Order;
  checkout_url?: string;
  error?: string;
}

export interface OrderWithSubscription extends Order {
  subscription?: Subscription;
}

export interface RefundRequest {
  order_id: string;
  reason?: string;
  amount?: number;
}

export interface RefundResponse {
  success: boolean;
  refund_id?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface OrderStats {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  conversion_rate: number;
  orders_by_status: Record<OrderStatus, number>;
  monthly_revenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}
```

## File: `types/stripe.ts`

```typescript
export interface StripePrice {
  id: string;
  nickname: string | null;
  currency: string;
  unit_amount: number | null;
  recurring: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
  } | null;
  product: {
    id: string;
    name: string;
    description: string | null;
    images: string[];
  };
}

export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  default_price: StripePrice | null;
  prices: StripePrice[];
  metadata: Record<string, string>;
}

export interface CheckoutSession {
  id: string;
  customer_email?: string;
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
  amount_total: number;
  currency: string;
  customer: string;
  subscription?: string;
  metadata: Record<string, string>;
  success_url: string;
  cancel_url: string;
}

export interface Subscription {
  id: string;
  customer: string;
  status:
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'trialing'
    | 'unpaid';
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: {
    data: Array<{
      id: string;
      price: StripePrice;
      quantity: number | null;
    }>;
  };
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

export interface Invoice {
  id: string;
  customer: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  amount_due: number;
  amount_paid: number;
  currency: string;
  created: number;
  due_date?: number;
  hosted_invoice_url?: string;
  invoice_pdf?: string;
  metadata?: Record<string, string>;
}
```

## File: `types/supabase.ts`

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
```
