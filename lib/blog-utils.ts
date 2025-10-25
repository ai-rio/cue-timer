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

  const fetchPosts = useCallback(async (filter: BlogFilter = {}): Promise<BlogPostEnhanced[]> => {
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
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        timestamp: new Date(),
      };
      setError(blogError);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostBySlug = useCallback(async (slug: string): Promise<BlogPostEnhanced | null> => {
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
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        timestamp: new Date(),
      };
      setError(blogError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

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
      posts = posts.filter((post) => post.publishedAtDate.getFullYear() === state.filter.year);
    }

    if (state.filter.tags && state.filter.tags.length > 0) {
      posts = posts.filter((post) => state.filter.tags!.some((tag) => post.tags.includes(tag)));
    }

    return posts;
  }, [state.posts, state.filter]);

  return {
    state,
    dispatch,
    filteredPosts,
    setFilter: (filter: BlogFilter) => dispatch({ type: 'SET_FILTER', payload: filter }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: BlogError | null) => dispatch({ type: 'SET_ERROR', payload: error }),
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
export function searchPosts(posts: BlogPostEnhanced[], searchTerm: string): BlogPostEnhanced[] {
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

export function filterPostsByYear(posts: BlogPostEnhanced[], year: number): BlogPostEnhanced[] {
  return posts.filter((post) => post.publishedAtDate.getFullYear() === year);
}

export function filterPostsByTags(posts: BlogPostEnhanced[], tags: string[]): BlogPostEnhanced[] {
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
  const years = new Set(posts.map((post) => post.publishedAtDate.getFullYear()));
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
export function generateExcerpt(content: string, maxLength: number = 160): string {
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
export function debounce<T extends (...args: any[]) => any>(
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
  loadMDXRenderer: () => import('@/components/blog/MDXRenderer').then((mod) => mod.default),
  // Note: BlogEditor and BlogAnalytics components are not yet implemented
  // loadBlogEditor: () => import('@/components/blog/BlogEditor').then(mod => mod.default),
  // loadBlogAnalytics: () => import('@/components/blog/BlogAnalytics').then(mod => mod.default),
};
