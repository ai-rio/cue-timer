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
