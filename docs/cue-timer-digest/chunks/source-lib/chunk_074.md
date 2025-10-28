# Chunk 74: source_lib

## Metadata

- **Files**: 4
- **Size**: 28,729 characters (~7,182 tokens)
- **Categories**: source

## Files in this chunk

- `lib/blog-utils.ts`
- `lib/blog.ts`
- `lib/utils.ts`
- `lib/auth/middleware.ts`

---

## File: `lib/blog-utils.ts`

```typescript
/**
 * Centralized blog utilities for enhanced functionality and reduced imports
 * Provides hooks, helpers, and utilities for blog operations
 */

'use client';

import { useCallback, useMemo, useState } from 'react';

import type {
  ApiResponse,
  BlogAction,
  BlogError,
  BlogFilter,
  BlogPostEnhanced,
  BlogState,
} from '@/types/blog-api';

/**
 * Custom hook for blog API operations with proper error handling
 */
export function useBlogApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<BlogError | null>(null);

  const fetchPosts = useCallback(
    async (filter: BlogFilter = {}): Promise<BlogPostEnhanced[]> => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (filter.category && filter.category !== 'all') {
          params.append('category', filter.category);
        }

        if (typeof filter.featured === 'boolean') {
          params.append('featured', filter.featured.toString());
        }

        if (filter.searchTerm) {
          params.append('search', filter.searchTerm);
        }

        if (filter.year) {
          params.append('year', filter.year.toString());
        }

        if (filter.tags && filter.tags.length > 0) {
          params.append('tags', filter.tags.join(','));
        }

        if (filter.limit) {
          params.append('limit', filter.limit.toString());
        }

        if (filter.offset) {
          params.append('offset', filter.offset.toString());
        }

        const response = await fetch(`/api/blog?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse<BlogPostEnhanced[]> = await response.json();

        if (result.success && result.data) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to fetch posts');
        }
      } catch (err) {
        const blogError: BlogError = {
          code: 'FETCH_ERROR',
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          timestamp: new Date(),
        };
        setError(blogError);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchPostBySlug = useCallback(
    async (slug: string): Promise<BlogPostEnhanced | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/blog/${slug}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse<BlogPostEnhanced> = await response.json();

        if (result.success && result.data) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to fetch post');
        }
      } catch (err) {
        const blogError: BlogError = {
          code: 'FETCH_POST_ERROR',
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          timestamp: new Date(),
        };
        setError(blogError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    fetchPosts,
    fetchPostBySlug,
    clearError: () => setError(null),
  };
}

/**
 * Custom hook for blog state management
 */
export function useBlogState(initialPosts: BlogPostEnhanced[] = []) {
  const [state, setState] = useState<BlogState>({
    posts: initialPosts,
    loading: false,
    error: null,
    filter: {},
    pagination: {
      page: 1,
      limit: 10,
      total: initialPosts.length,
      hasMore: false,
    },
  });

  const dispatch = useCallback(
    (action: BlogAction) => {
      setState((prevState) => {
        switch (action.type) {
          case 'SET_LOADING':
            return { ...prevState, loading: action.payload };
          case 'SET_POSTS':
            return {
              ...prevState,
              posts: action.payload,
              pagination: {
                ...prevState.pagination,
                total: action.payload.length,
              },
            };
          case 'SET_ERROR':
            return { ...prevState, error: action.payload };
          case 'SET_FILTER':
            return { ...prevState, filter: action.payload };
          case 'UPDATE_PAGINATION':
            return {
              ...prevState,
              pagination: { ...prevState.pagination, ...action.payload },
            };
          case 'RESET_STATE':
            return {
              posts: initialPosts,
              loading: false,
              error: null,
              filter: {},
              pagination: {
                page: 1,
                limit: 10,
                total: initialPosts.length,
                hasMore: false,
              },
            };
          default:
            return prevState;
        }
      });
    },
    [initialPosts]
  );

  const filteredPosts = useMemo(() => {
    let posts = [...state.posts];

    // Apply client-side filtering for immediate responsiveness
    if (state.filter.category && state.filter.category !== 'all') {
      posts = posts.filter((post) => post.category === state.filter.category);
    }

    if (typeof state.filter.featured === 'boolean') {
      posts = posts.filter((post) => post.featured === state.filter.featured);
    }

    if (state.filter.searchTerm) {
      const searchLower = state.filter.searchTerm.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.summary.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (state.filter.year) {
      posts = posts.filter(
        (post) => post.publishedAtDate.getFullYear() === state.filter.year
      );
    }

    if (state.filter.tags && state.filter.tags.length > 0) {
      posts = posts.filter((post) =>
        state.filter.tags!.some((tag) => post.tags.includes(tag))
      );
    }

    return posts;
  }, [state.posts, state.filter]);

  return {
    state,
    dispatch,
    filteredPosts,
    setFilter: (filter: BlogFilter) =>
      dispatch({ type: 'SET_FILTER', payload: filter }),
    setLoading: (loading: boolean) =>
      dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: BlogError | null) =>
      dispatch({ type: 'SET_ERROR', payload: error }),
    resetState: () => dispatch({ type: 'RESET_STATE' }),
  };
}

/**
 * Enhanced filter builder utility
 */
export function buildFilterQuery(filter: BlogFilter): string {
  const params = new URLSearchParams();

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        params.append(key, value.join(','));
      } else if (typeof value === 'boolean') {
        params.append(key, value.toString());
      } else {
        params.append(key, value.toString());
      }
    }
  });

  return params.toString();
}

/**
 * Blog search utilities
 */
export function searchPosts(
  posts: BlogPostEnhanced[],
  searchTerm: string
): BlogPostEnhanced[] {
  if (!searchTerm.trim()) return posts;

  const searchLower = searchTerm.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchLower) ||
      post.summary.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
  );
}

/**
 * Blog filtering utilities
 */
export function filterPostsByCategory(
  posts: BlogPostEnhanced[],
  category: string
): BlogPostEnhanced[] {
  if (!category || category === 'all') return posts;
  return posts.filter((post) => post.category === category);
}

export function filterPostsByYear(
  posts: BlogPostEnhanced[],
  year: number
): BlogPostEnhanced[] {
  return posts.filter((post) => post.publishedAtDate.getFullYear() === year);
}

export function filterPostsByTags(
  posts: BlogPostEnhanced[],
  tags: string[]
): BlogPostEnhanced[] {
  if (!tags.length) return posts;
  return posts.filter((post) => tags.some((tag) => post.tags.includes(tag)));
}

export function filterFeaturedPosts(
  posts: BlogPostEnhanced[],
  featured: boolean
): BlogPostEnhanced[] {
  return posts.filter((post) => post.featured === featured);
}

/**
 * Blog sorting utilities
 */
export function sortPostsByDate(
  posts: BlogPostEnhanced[],
  order: 'asc' | 'desc' = 'desc'
): BlogPostEnhanced[] {
  return [...posts].sort((a, b) => {
    const diff = a.publishedAtDate.getTime() - b.publishedAtDate.getTime();
    return order === 'desc' ? -diff : diff;
  });
}

export function sortPostsByTitle(
  posts: BlogPostEnhanced[],
  order: 'asc' | 'desc' = 'asc'
): BlogPostEnhanced[] {
  return [...posts].sort((a, b) => {
    const diff = a.title.localeCompare(b.title);
    return order === 'desc' ? -diff : diff;
  });
}

export function sortPostsByReadTime(
  posts: BlogPostEnhanced[],
  order: 'asc' | 'desc' = 'asc'
): BlogPostEnhanced[] {
  return [...posts].sort((a, b) => {
    const diff = (a.readTime || 0) - (b.readTime || 0);
    return order === 'desc' ? -diff : diff;
  });
}

/**
 * Blog analytics utilities
 */
export function getPostYears(posts: BlogPostEnhanced[]): number[] {
  const years = new Set(
    posts.map((post) => post.publishedAtDate.getFullYear())
  );
  return Array.from(years).sort((a, b) => b - a);
}

export function getPostCategories(posts: BlogPostEnhanced[]): string[] {
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
}

export function getPostTags(posts: BlogPostEnhanced[]): string[] {
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

/**
 * Blog post utilities
 */
export function generateExcerpt(
  content: string,
  maxLength: number = 160
): string {
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.substring(0, maxLength).replace(/\s+\S*$/, '')}...`;
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Error handling utilities
 */
export function createBlogError(
  code: string,
  message: string,
  details?: Record<string, unknown>
): BlogError {
  return {
    code,
    message,
    details,
    timestamp: new Date(),
  };
}

export function isBlogError(error: unknown): error is BlogError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'timestamp' in error
  );
}

/**
 * Debounce utility for search
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Local storage utilities for blog preferences
 */
export const blogStorage = {
  getFilter: (): BlogFilter => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem('blog-filter');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  setFilter: (filter: BlogFilter): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('blog-filter', JSON.stringify(filter));
    } catch {
      // Silently fail for localStorage issues
    }
  },

  getReadingProgress: (slug: string): number => {
    if (typeof window === 'undefined') return 0;
    try {
      const stored = localStorage.getItem(`blog-progress-${slug}`);
      return stored ? parseFloat(stored) : 0;
    } catch {
      return 0;
    }
  },

  setReadingProgress: (slug: string, progress: number): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`blog-progress-${slug}`, progress.toString());
    } catch {
      // Silently fail for localStorage issues
    }
  },
};

/**
 * Conditional import utilities to reduce bundle size
 */
export const conditionalImports = {
  // Lazy load heavy components only when needed
  loadMDXRenderer: () =>
    import('@/components/blog/MDXRenderer').then((mod) => mod.default),
  // Note: BlogEditor and BlogAnalytics components are not yet implemented
  // loadBlogEditor: () => import('@/components/blog/BlogEditor').then(mod => mod.default),
  // loadBlogAnalytics: () => import('@/components/blog/BlogAnalytics').then(mod => mod.default),
};
```

## File: `lib/blog.ts`

```typescript
import { isValid } from 'date-fns';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import readingTime from 'reading-time';

import BlogPostSchema, {
  BlogAnalytics,
  blogCategories,
  BlogCategory,
  BlogFilter,
  BlogPost,
  BlogPostMetadata,
  BlogPostNavigation,
  RelatedPostScore,
} from '@/types/blog';
import type { BlogPostEnhanced } from '@/types/blog-api';

// Type conversion function to ensure compatibility
function convertToBlogPostEnhanced(post: BlogPost): BlogPostEnhanced {
  return {
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    category: post.category as BlogPostEnhanced['category'],
    author: post.author,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    image: post.image,
    imageAlt: post.imageAlt,
    featured: post.featured || false,
    draft: post.draft || false,
    tags: post.tags,
    lastModified: post.lastModified,
    seo: post.seo,
    content: post.content,
    excerpt: post.excerpt,
    wordCount: post.wordCount,
    publishedAtDate: post.publishedAtDate,
    lastModifiedDate: post.lastModifiedDate,
    locale: post.locale,
  };
}

// Re-export types for easier imports
export type {
  BlogAnalytics,
  BlogCategory,
  BlogFilter,
  BlogPost,
  BlogPostMetadata,
  BlogPostNavigation,
  RelatedPostScore,
};

export { blogCategories };

// Cache configuration
const CACHE_TTL = {
  development: 5000, // 5 seconds
  production: 300000, // 5 minutes
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class BlogCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const ttl =
      process.env.NODE_ENV === 'development'
        ? CACHE_TTL.development
        : CACHE_TTL.production;

    if (now - entry.timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

const blogCache = new BlogCache();

// Blog content directory
const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

// Validate and sanitize blog post metadata
function validateBlogPostData(
  fileContent: string,
  filePath: string
): BlogPostMetadata {
  const { data, content } = matter(fileContent);

  try {
    // Parse date fields
    if (typeof data.publishedAt === 'string') {
      const parsedDate = new Date(data.publishedAt);
      if (!isValid(parsedDate)) {
        throw new Error(`Invalid publishedAt date: ${data.publishedAt}`);
      }
      data.publishedAt = parsedDate.toISOString();
    }

    if (typeof data.lastModified === 'string') {
      const parsedDate = new Date(data.lastModified);
      if (!isValid(parsedDate)) {
        throw new Error(`Invalid lastModified date: ${data.lastModified}`);
      }
      data.lastModified = parsedDate.toISOString();
    }

    // Auto-generate readTime if not provided
    if (!data.readTime && content) {
      data.readTime = Math.ceil(readingTime(content).minutes);
    }

    // Validate with Zod schema
    const validatedData = BlogPostSchema.parse(data);
    return validatedData;
  } catch (error) {
    // Log error for debugging without console statement
    throw new Error(
      `Validation failed for ${path.basename(filePath)}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Generate excerpt from content
function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.substring(0, maxLength).replace(/\s+\S*$/, '')}...`;
}

// Generate slug from filename
function generateSlugFromFilename(filename: string): string {
  const nameWithoutExt = path.basename(filename, path.extname(filename));

  // Remove date prefix if present (MM-DD-title format)
  const datePrefixRegex = /^\d{2}-\d{2}-/;
  if (datePrefixRegex.test(nameWithoutExt)) {
    return nameWithoutExt.substring(6).replace(/-/g, '-');
  }

  return nameWithoutExt.replace(/-/g, '-');
}

// Read and parse all blog posts
export async function getAllPosts(
  filter: BlogFilter = {}
): Promise<BlogPostEnhanced[]> {
  const cacheKey = `allPosts:${JSON.stringify(filter)}`;
  const cached = blogCache.get<BlogPostEnhanced[]>(cacheKey);
  if (cached) return cached;

  try {
    if (!fs.existsSync(BLOG_CONTENT_DIR)) {
      // Silent handling of missing blog directory
      return [];
    }

    const years = fs
      .readdirSync(BLOG_CONTENT_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((year) => /^\d{4}$/.test(year))
      .sort((a, b) => b.localeCompare(a)); // Most recent year first

    const allPosts: BlogPostEnhanced[] = [];

    for (const year of years) {
      const yearDir = path.join(BLOG_CONTENT_DIR, year);
      const files = fs
        .readdirSync(yearDir)
        .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
        .sort((a, b) => b.localeCompare(a)); // Most recent first

      for (const file of files) {
        const filePath = path.join(yearDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const metadata = validateBlogPostData(fileContent, filePath);

        // Skip drafts unless specifically requested
        if (metadata.draft && !filter.includeDrafts) {
          continue;
        }

        const { content } = matter(fileContent);
        const wordCount = content.split(/\s+/).length;
        const excerpt = generateExcerpt(content);

        const post: BlogPost = {
          ...metadata,
          content,
          excerpt,
          wordCount,
          readTime:
            metadata.readTime || Math.ceil(readingTime(content).minutes),
          publishedAtDate: new Date(metadata.publishedAt),
          lastModifiedDate: metadata.lastModified
            ? new Date(metadata.lastModified)
            : undefined,
        };

        const enhancedPost = convertToBlogPostEnhanced(post);
        allPosts.push(enhancedPost);
      }
    }

    // Apply filters
    let filteredPosts = allPosts;

    // Year filter
    if (filter.year) {
      filteredPosts = filteredPosts.filter(
        (post) => post.publishedAtDate.getFullYear() === filter.year
      );
    }

    // Category filter
    if (filter.category && filter.category !== 'all') {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === filter.category
      );
    }

    // Featured filter
    if (typeof filter.featured === 'boolean') {
      filteredPosts = filteredPosts.filter(
        (post) => post.featured === filter.featured
      );
    }

    // Search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.summary.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      filteredPosts = filteredPosts.filter((post) =>
        filter.tags!.some((tag) => post.tags.includes(tag))
      );
    }

    // Sort by publication date (most recent first)
    filteredPosts.sort(
      (a, b) => b.publishedAtDate.getTime() - a.publishedAtDate.getTime()
    );

    blogCache.set(cacheKey, filteredPosts);
    return filteredPosts;
  } catch {
    // Silent error handling for blog post reading
    return [];
  }
}

// Get a single blog post by slug
export async function getPostBySlug(
  slug: string
): Promise<BlogPostEnhanced | null> {
  const cacheKey = `post:${slug}`;
  const cached = blogCache.get<BlogPostEnhanced>(cacheKey);
  if (cached) return cached;

  try {
    const years = fs
      .readdirSync(BLOG_CONTENT_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((year) => /^\d{4}$/.test(year));

    for (const year of years) {
      const yearDir = path.join(BLOG_CONTENT_DIR, year);
      const files = fs
        .readdirSync(yearDir)
        .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'));

      for (const file of files) {
        const filePath = path.join(yearDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const metadata = validateBlogPostData(fileContent, filePath);

        const postSlug = metadata.slug || generateSlugFromFilename(file);

        if (postSlug === slug) {
          const { content } = matter(fileContent);
          const wordCount = content.split(/\s+/).length;
          const excerpt = generateExcerpt(content);

          const post: BlogPost = {
            ...metadata,
            content,
            excerpt,
            wordCount,
            readTime:
              metadata.readTime || Math.ceil(readingTime(content).minutes),
            publishedAtDate: new Date(metadata.publishedAt),
            lastModifiedDate: metadata.lastModified
              ? new Date(metadata.lastModified)
              : undefined,
          };

          const enhancedPost = convertToBlogPostEnhanced(post);
          blogCache.set(cacheKey, enhancedPost);
          return enhancedPost;
        }
      }
    }

    return null;
  } catch {
    // Silent error handling for individual blog post reading
    return null;
  }
}

// Get navigation links for a blog post
export async function getPostNavigation(
  slug: string
): Promise<BlogPostNavigation> {
  const posts = await getAllPosts();
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? (posts[currentIndex - 1] ?? null) : null,
    next:
      currentIndex < posts.length - 1
        ? (posts[currentIndex + 1] ?? null)
        : null,
  };
}

// Get related posts based on category and tags
export async function getRelatedPosts(
  currentPost: BlogPost,
  limit: number = 3
): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();

  // Exclude current post and drafts
  const candidates = allPosts.filter(
    (post) => post.slug !== currentPost.slug && !post.draft
  );

  // Score posts based on similarity
  const scoredPosts: RelatedPostScore[] = candidates.map((post) => {
    let score = 0;
    const reasons: string[] = [];

    // Same category (most important)
    if (post.category === currentPost.category) {
      score += 10;
      reasons.push('Same category');
    }

    // Shared tags
    const sharedTags = post.tags.filter((tag) =>
      currentPost.tags.includes(tag)
    );
    if (sharedTags.length > 0) {
      score += sharedTags.length * 5;
      reasons.push(`${sharedTags.length} shared tags`);
    }

    // Featured posts get bonus
    if (post.featured) {
      score += 2;
      reasons.push('Featured post');
    }

    return { post, score, reasons };
  });

  // Sort by score and take top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

// Get blog analytics
export async function getBlogAnalytics(): Promise<BlogAnalytics> {
  const posts = await getAllPosts();
  const postsByCategory = {} as Record<string, number>;
  const postsByYear = {} as Record<number, number>;
  const tagFrequency: Record<string, number> = {};

  let totalReadTime = 0;
  let featuredCount = 0;

  // Initialize category counts
  blogCategories.forEach((category) => {
    postsByCategory[category] = 0;
  });

  posts.forEach((post) => {
    // Count by category
    postsByCategory[post.category] = (postsByCategory[post.category] || 0) + 1;

    // Count by year
    const year = post.publishedAtDate.getFullYear();
    postsByYear[year] = (postsByYear[year] || 0) + 1;

    // Tag frequency
    post.tags.forEach((tag) => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });

    // Read time aggregation
    totalReadTime += post.readTime;

    // Featured posts
    if (post.featured) {
      featuredCount++;
    }
  });

  const averageReadTime =
    posts.length > 0 ? Math.round(totalReadTime / posts.length) : 0;

  return {
    totalPosts: posts.length,
    postsByCategory: postsByCategory as Record<string, number>,
    postsByYear,
    averageReadTime,
    featuredPosts: featuredCount,
    tagFrequency,
  };
}

// Get unique categories from posts
export async function getCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
}

// Get unique tags from posts
export async function getTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

// Clear blog cache (useful for development)
export function clearBlogCache(): void {
  blogCache.clear();
}

// Generate static params for Next.js
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

## File: `lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## File: `lib/auth/middleware.ts`

```typescript
import { type NextRequest, NextResponse } from 'next/server';

import { supabase } from './supabase';

interface User {
  id: string;
  email?: string;
  // Add other user properties as needed
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Auth middleware error:', error);
      return response;
    }

    if (session) {
      response.headers.set('x-user-id', session.user.id);
      response.headers.set('x-user-email', session.user.email || '');
    }
  } catch (error) {
    console.error('Unexpected auth middleware error:', error);
  }

  return response;
}

export function withAuth<
  T extends Record<string, unknown> = Record<string, unknown>,
>(handler: (req: NextRequest & { user?: User }) => Promise<NextResponse<T>>) {
  return async (req: NextRequest) => {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      return handler({ ...req, user } as unknown as NextRequest & {
        user: User;
      });
    } catch (error) {
      console.error('Auth check error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
```
