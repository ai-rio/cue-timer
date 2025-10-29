'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { blogCategories, type BlogCategory } from '@/types/blog';

import { useBlogFilter } from './blog-filter-context';
import { createFilterQueryString } from './blog-filter-utils';

/**
 * Hook to synchronize blog filters with URL query parameters
 */
export function useBlogFilterWithUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogFilter = useBlogFilter();

  // Read filters from URL on mount
  useEffect(() => {
    const currentFilters = blogFilter.filters;
    let hasChanges = false;

    // Read search term
    const search = searchParams.get('search');
    if (search !== null && search !== currentFilters.searchTerm) {
      blogFilter.setSearchTerm(search);
      hasChanges = true;
    }

    // Read category
    const category = searchParams.get('category') as BlogCategory | 'all' | null;
    if (
      category &&
      blogCategories.includes(category as BlogCategory) &&
      category !== currentFilters.selectedCategory
    ) {
      blogFilter.setSelectedCategory(category as BlogCategory | 'all');
      hasChanges = true;
    }

    // Read tags
    const tags = searchParams.get('tags');
    if (tags !== null) {
      const tagArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      if (JSON.stringify(tagArray) !== JSON.stringify(currentFilters.selectedTags)) {
        blogFilter.setSelectedTags(tagArray);
        hasChanges = true;
      }
    }

    // Read featured
    const featured = searchParams.get('featured');
    const featuredValue = featured === 'true';
    if (featured !== null && featuredValue !== currentFilters.featuredOnly) {
      blogFilter.setFeaturedOnly(featuredValue);
      hasChanges = true;
    }

    // Read year
    const year = searchParams.get('year');
    if (year !== null) {
      const yearValue = year === 'all' ? 'all' : parseInt(year);
      if (yearValue !== currentFilters.selectedYear && !isNaN(yearValue as number)) {
        blogFilter.setSelectedYear(yearValue as number | 'all');
        hasChanges = true;
      }
    }

    // If any changes were made, update the URL to reflect the current state
    if (hasChanges) {
      updateUrl();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update URL when filters change
  const updateUrl = useCallback(() => {
    const queryString = createFilterQueryString(blogFilter.filters);
    const newPath = `${window.location.pathname}${queryString}`;

    // Only push to history if the URL has actually changed
    if (newPath !== window.location.pathname + window.location.search) {
      router.push(newPath, { scroll: false });
    }
  }, [blogFilter.filters, router]);

  // Debounced URL update to avoid too many history entries
  useEffect(() => {
    const timer = setTimeout(updateUrl, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [updateUrl]);

  // Enhanced clear filters that also clears URL
  const clearFiltersWithUrl = useCallback(() => {
    blogFilter.clearFilters();
    router.push(window.location.pathname, { scroll: false });
  }, [blogFilter, router]);

  return {
    ...blogFilter,
    clearFilters: clearFiltersWithUrl,
  };
}
