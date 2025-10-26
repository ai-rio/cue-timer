// Enhanced blog types integrating with new blog management system
import { LucideIcon } from 'lucide-react';

import { BlogPost as BaseBlogPost, CueTimerTemplate } from '../lib/blog-scripts/types';

// Import other types when needed
// import { ContentMetrics, MultiLanguagePost, SEOResult } from '../lib/blog-scripts/types';

// Enhanced blog post type that extends the base type with additional frontend properties
export interface BlogPostEnhanced extends Omit<BaseBlogPost, 'content' | 'language'> {
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
