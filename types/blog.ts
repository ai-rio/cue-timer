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
