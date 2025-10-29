import { act, renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import { BlogFilterProvider } from '../../components/contexts/blog-filter-context';
import { useBlogFilterWithUrl } from '../../components/contexts/use-blog-filter-with-url';
import { mockBlogPosts } from './test-utils';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock window.location
const mockWindowLocation = {
  pathname: '/blog',
  search: '',
  href: 'http://localhost:3000/blog',
};

Object.defineProperty(window, 'location', {
  value: mockWindowLocation,
  writable: true,
});

// Test wrapper component that provides the blog filter context
const createWrapper = (posts = mockBlogPosts) => {
  return ({ children }: { children: React.ReactNode }) => (
    <BlogFilterProvider posts={posts}>{children}</BlogFilterProvider>
  );
};

describe('useBlogFilterWithUrl', () => {
  let mockRouter: any;
  let mockSearchParams: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock router
    mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    };

    // Setup mock search params
    mockSearchParams = {
      get: jest.fn(),
      has: jest.fn(),
      entries: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      toString: jest.fn(),
    };

    // Setup mocks to return our mock objects
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    // Reset window.location
    mockWindowLocation.pathname = '/blog';
    mockWindowLocation.search = '';
    mockWindowLocation.href = 'http://localhost:3000/blog';
  });

  describe('URL to State Synchronization', () => {
    it('should read search term from URL on mount', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'search') return 'react testing';
        return null;
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      expect(result.current.filters.searchTerm).toBe('react testing');
    });

    it('should read category from URL on mount', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'category') return 'tutorials';
        return null;
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      expect(result.current.filters.selectedCategory).toBe('tutorials');
    });

    it('should read tags from URL on mount', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'tags') return 'react,testing,guides';
        return null;
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      expect(result.current.filters.selectedTags).toEqual(['react', 'testing', 'guides']);
    });

    it('should read featured filter from URL on mount', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'featured') return 'true';
        return null;
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      expect(result.current.filters.featuredOnly).toBe(true);
    });

    it('should read year from URL on mount', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'year') return '2024';
        return null;
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      expect(result.current.filters.selectedYear).toBe(2024);
    });

    it('should read "all" year from URL on mount', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'year') return 'all';
        return null;
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      expect(result.current.filters.selectedYear).toBe('all');
    });

    it('should handle multiple URL parameters', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        const params: Record<string, string> = {
          search: 'react',
          category: 'tutorials',
          tags: 'testing,guides',
          featured: 'true',
          year: '2024',
        };
        return params[key] || null;
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      expect(result.current.filters).toEqual({
        searchTerm: 'react',
        selectedCategory: 'tutorials',
        selectedTags: ['testing', 'guides'],
        featuredOnly: true,
        selectedYear: 2024,
      });
    });

    it('should ignore invalid category in URL', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'category') return 'invalid-category';
        return null;
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      expect(result.current.filters.selectedCategory).toBe('all');
    });

    it('should handle malformed tags in URL', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'tags') return 'react,,testing, ,guides,';
        return null;
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      expect(result.current.filters.selectedTags).toEqual(['react', 'testing', 'guides']);
    });

    it('should handle invalid year in URL', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'year') return 'invalid-year';
        return null;
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      expect(result.current.filters.selectedYear).toBe('all');
    });
  });

  describe('State to URL Synchronization', () => {
    beforeEach(() => {
      // Start with empty URL
      mockSearchParams.get.mockReturnValue(null);
    });

    it('should update URL when search term changes', async () => {
      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('react testing');
      });

      // Wait for debounce (300ms)
      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/blog?search=react%20testing', {
          scroll: false,
        });
      });
    });

    it('should update URL when category changes', async () => {
      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSelectedCategory('tutorials');
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/blog?category=tutorials', { scroll: false });
      });
    });

    it('should update URL when tags change', async () => {
      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSelectedTags(['react', 'testing']);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/blog?tags=react%2Ctesting', {
          scroll: false,
        });
      });
    });

    it('should update URL when featured filter changes', async () => {
      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setFeaturedOnly(true);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/blog?featured=true', { scroll: false });
      });
    });

    it('should update URL when year changes', async () => {
      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSelectedYear(2024);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/blog?year=2024', { scroll: false });
      });
    });

    it('should update URL with multiple parameters', async () => {
      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('react');
        result.current.setSelectedCategory('tutorials');
        result.current.setFeaturedOnly(true);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith(
          '/blog?search=react&category=tutorials&featured=true',
          { scroll: false }
        );
      });
    });

    it('should debounce URL updates', () => {
      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('r');
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current.setSearchTerm('re');
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current.setSearchTerm('react');
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith('/blog?search=react', { scroll: false });
    });

    it('should not update URL if URL has not changed', () => {
      // Set initial URL state
      mockWindowLocation.search = '?search=react';
      mockWindowLocation.href = 'http://localhost:3000/blog?search=react';

      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'search') return 'react';
        return null;
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('react'); // Same as URL
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe('Enhanced clearFilters', () => {
    it('should clear filters and update URL', () => {
      // Set initial URL state
      mockSearchParams.get.mockImplementation((key: string) => {
        const params: Record<string, string> = {
          search: 'react',
          category: 'tutorials',
        };
        return params[key] || null;
      });

      mockWindowLocation.pathname = '/blog';
      mockWindowLocation.search = '?search=react&category=tutorials';

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/blog', { scroll: false });
    });

    it('should reset all filter states', () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        const params: Record<string, string> = {
          search: 'react',
          category: 'tutorials',
          tags: 'testing',
          featured: 'true',
          year: '2024',
        };
        return params[key] || null;
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual({
        searchTerm: '',
        selectedCategory: 'all',
        selectedTags: [],
        featuredOnly: false,
        selectedYear: 'all',
      });
    });
  });

  describe('Integration with BlogFilterContext', () => {
    it('should preserve all BlogFilterContext functionality', () => {
      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      // Should have all the same properties as useBlogFilter
      expect(result.current).toHaveProperty('filters');
      expect(result.current).toHaveProperty('filteredPosts');
      expect(result.current).toHaveProperty('availableYears');
      expect(result.current).toHaveProperty('availableTags');
      expect(result.current).toHaveProperty('totalPosts');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('hasActiveFilters');
      expect(result.current).toHaveProperty('activeFilterCount');

      // Should have all the same methods as useBlogFilter
      expect(result.current).toHaveProperty('setSearchTerm');
      expect(result.current).toHaveProperty('setSelectedCategory');
      expect(result.current).toHaveProperty('setSelectedTags');
      expect(result.current).toHaveProperty('addTag');
      expect(result.current).toHaveProperty('removeTag');
      expect(result.current).toHaveProperty('setFeaturedOnly');
      expect(result.current).toHaveProperty('setSelectedYear');
      expect(result.current).toHaveProperty('clearFilters');
    });

    it('should work with filter operations', async () => {
      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      // Test that filtering still works
      expect(result.current.filteredPosts).toHaveLength(5);

      act(() => {
        result.current.setFeaturedOnly(true);
      });

      await waitFor(() => {
        expect(result.current.filteredPosts).toHaveLength(3); // 3 featured posts
        expect(result.current.hasActiveFilters).toBe(true);
        expect(result.current.activeFilterCount).toBe(1);
      });
    });

    it('should work with tag operations', async () => {
      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addTag('react');
      });

      await waitFor(() => {
        expect(result.current.filters.selectedTags).toContain('react');
      });

      act(() => {
        result.current.removeTag('react');
      });

      await waitFor(() => {
        expect(result.current.filters.selectedTags).not.toContain('react');
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle router errors gracefully', () => {
      mockRouter.push.mockImplementation(() => {
        throw new Error('Router error');
      });

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      // Should not throw error when updating URL
      expect(() => {
        act(() => {
          result.current.setSearchTerm('test');
        });
      }).not.toThrow();
    });

    it('should handle missing window.location', () => {
      const originalLocation = window.location;
      delete (window as any).location;

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      // Should not crash
      expect(() => {
        act(() => {
          result.current.setSearchTerm('test');
        });
      }).not.toThrow();

      // Restore window.location
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
    });

    it('should handle searchParams returning undefined', () => {
      mockSearchParams.get.mockReturnValue(undefined);

      const { result } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      // Should handle undefined values gracefully
      expect(result.current.filters.searchTerm).toBe('');
      expect(result.current.filters.selectedCategory).toBe('all');
    });

    it('should handle URL synchronization on component unmount', () => {
      const { result, unmount } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('test');
      });

      // Should not cause errors when unmounting
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should not cause excessive re-renders', () => {
      const renderSpy = jest.fn();

      const { result } = renderHook(
        () => {
          renderSpy();
          return useBlogFilterWithUrl();
        },
        {
          wrapper: createWrapper(),
        }
      );

      // Initial render
      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Update filter
      act(() => {
        result.current.setSearchTerm('test');
      });

      // Should cause re-render
      expect(renderSpy).toHaveBeenCalledTimes(2);

      // Debounced timer should not cause additional re-renders
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // URL update should not cause additional re-renders
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it('should cleanup timers on unmount', () => {
      const { result, unmount } = renderHook(() => useBlogFilterWithUrl(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('test');
      });

      // Unmount before timer completes
      unmount();

      // Advance timers - should not cause errors
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Router should not be called after unmount
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});
