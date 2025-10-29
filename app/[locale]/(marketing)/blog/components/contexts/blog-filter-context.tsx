'use client';

import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import type { BlogCategory, BlogPost } from '@/types/blog';

// Blog filter context interfaces
export interface BlogFilterState {
  searchTerm: string;
  selectedCategory: BlogCategory | 'all';
  selectedTags: string[];
  featuredOnly: boolean;
  selectedYear: number | 'all';
}

export interface BlogFilterContextType {
  // State
  filters: BlogFilterState;
  filteredPosts: BlogPost[];
  availableYears: number[];
  availableTags: string[];
  totalPosts: number;
  isLoading: boolean;

  // Actions
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: BlogCategory | 'all') => void;
  setSelectedTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setFeaturedOnly: (featured: boolean) => void;
  setSelectedYear: (year: number | 'all') => void;
  clearFilters: () => void;
  resetFilters: () => void;

  // Utility methods
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

// Default filter state
const defaultFilterState: BlogFilterState = {
  searchTerm: '',
  selectedCategory: 'all',
  selectedTags: [],
  featuredOnly: false,
  selectedYear: 'all',
};

// Create context
const BlogFilterContext = createContext<BlogFilterContextType | undefined>(undefined);

// Provider props
interface BlogFilterProviderProps {
  children: ReactNode;
  posts: BlogPost[];
}

// Blog Filter Provider Component
export function BlogFilterProvider({ children, posts }: BlogFilterProviderProps) {
  const [filters, setFilters] = useState<BlogFilterState>(defaultFilterState);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize available years from posts
  const availableYears = useMemo(() => {
    const years = [...new Set(posts.map((post) => post.publishedAtDate.getFullYear()))];
    return years.sort((a, b) => b - a); // Most recent first
  }, [posts]);

  // Memoize available tags from posts
  const availableTags = useMemo(() => {
    const tags = [...new Set(posts.flatMap((post) => post.tags))];
    return tags.sort((a, b) => a.localeCompare(b));
  }, [posts]);

  // Filter posts based on current filter state
  const filteredPosts = useMemo(() => {
    setIsLoading(true);

    try {
      let result = posts;

      // Search term filter
      if (filters.searchTerm.trim()) {
        const searchTerm = filters.searchTerm.toLowerCase().trim();
        result = result.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.summary.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
            post.category.toLowerCase().includes(searchTerm)
        );
      }

      // Category filter
      if (filters.selectedCategory !== 'all') {
        result = result.filter((post) => post.category === filters.selectedCategory);
      }

      // Tags filter - posts must have ALL selected tags
      if (filters.selectedTags.length > 0) {
        result = result.filter((post) =>
          filters.selectedTags.every((tag) => post.tags.includes(tag))
        );
      }

      // Featured filter
      if (filters.featuredOnly) {
        result = result.filter((post) => post.featured);
      }

      // Year filter
      if (filters.selectedYear !== 'all') {
        result = result.filter(
          (post) => post.publishedAtDate.getFullYear() === filters.selectedYear
        );
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [posts, filters]);

  // Calculate filter stats
  const totalPosts = posts.length;
  const hasActiveFilters = useMemo(
    () =>
      filters.searchTerm.trim() !== '' ||
      filters.selectedCategory !== 'all' ||
      filters.selectedTags.length > 0 ||
      filters.featuredOnly ||
      filters.selectedYear !== 'all',
    [filters]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm.trim()) count++;
    if (filters.selectedCategory !== 'all') count++;
    if (filters.selectedTags.length > 0) count++;
    if (filters.featuredOnly) count++;
    if (filters.selectedYear !== 'all') count++;
    return count;
  }, [filters]);

  // Action handlers
  const setSearchTerm = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: term }));
  }, []);

  const setSelectedCategory = useCallback((category: BlogCategory | 'all') => {
    setFilters((prev) => ({ ...prev, selectedCategory: category }));
  }, []);

  const setSelectedTags = useCallback((tags: string[]) => {
    setFilters((prev) => ({ ...prev, selectedTags: tags }));
  }, []);

  const addTag = useCallback((tag: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags
        : [...prev.selectedTags, tag],
    }));
  }, []);

  const removeTag = useCallback((tag: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.filter((t) => t !== tag),
    }));
  }, []);

  const setFeaturedOnly = useCallback((featured: boolean) => {
    setFilters((prev) => ({ ...prev, featuredOnly: featured }));
  }, []);

  const setSelectedYear = useCallback((year: number | 'all') => {
    setFilters((prev) => ({ ...prev, selectedYear: year }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilterState);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilterState);
  }, []);

  // Context value
  const contextValue: BlogFilterContextType = useMemo(
    () => ({
      // State
      filters,
      filteredPosts,
      availableYears,
      availableTags,
      totalPosts,
      isLoading,

      // Actions
      setSearchTerm,
      setSelectedCategory,
      setSelectedTags,
      addTag,
      removeTag,
      setFeaturedOnly,
      setSelectedYear,
      clearFilters,
      resetFilters,

      // Utility
      hasActiveFilters,
      activeFilterCount,
    }),
    [
      filters,
      filteredPosts,
      availableYears,
      availableTags,
      totalPosts,
      isLoading,
      setSearchTerm,
      setSelectedCategory,
      setSelectedTags,
      addTag,
      removeTag,
      setFeaturedOnly,
      setSelectedYear,
      clearFilters,
      resetFilters,
      hasActiveFilters,
      activeFilterCount,
    ]
  );

  return <BlogFilterContext.Provider value={contextValue}>{children}</BlogFilterContext.Provider>;
}

// Hook to use the blog filter context
export function useBlogFilter() {
  const context = useContext(BlogFilterContext);

  if (context === undefined) {
    throw new Error('useBlogFilter must be used within a BlogFilterProvider');
  }

  return context;
}

// Hook to check if a post matches current filters
export function usePostMatchesFilters(post: BlogPost) {
  const { filters } = useBlogFilter();

  return useMemo(() => {
    // Search term check
    if (filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase().trim();
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm) ||
        post.summary.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        post.category.toLowerCase().includes(searchTerm);

      if (!matchesSearch) return false;
    }

    // Category check
    if (filters.selectedCategory !== 'all' && post.category !== filters.selectedCategory) {
      return false;
    }

    // Tags check
    if (filters.selectedTags.length > 0) {
      const hasAllTags = filters.selectedTags.every((tag) => post.tags.includes(tag));
      if (!hasAllTags) return false;
    }

    // Featured check
    if (filters.featuredOnly && !post.featured) {
      return false;
    }

    // Year check
    if (
      filters.selectedYear !== 'all' &&
      post.publishedAtDate.getFullYear() !== filters.selectedYear
    ) {
      return false;
    }

    return true;
  }, [post, filters]);
}

// Export default for convenience
export default BlogFilterContext;
