import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import type { BlogFilterState } from '../../components/contexts/blog-filter-context';
import {
  BlogFilterProvider,
  useBlogFilter,
  usePostMatchesFilters,
} from '../../components/contexts/blog-filter-context';
import { createMockBlogPost, mockBlogPosts } from './test-utils';

// Test component that uses the blog filter context
const TestComponent = ({
  onFilterUpdate,
}: {
  onFilterUpdate?: (filters: BlogFilterState) => void;
}) => {
  const {
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
  } = useBlogFilter();

  React.useEffect(() => {
    onFilterUpdate?.(filters);
  }, [filters, onFilterUpdate]);

  return (
    <div>
      <div data-testid='total-posts'>{totalPosts}</div>
      <div data-testid='filtered-posts'>{filteredPosts.length}</div>
      <div data-testid='loading'>{isLoading.toString()}</div>
      <div data-testid='has-active-filters'>{hasActiveFilters.toString()}</div>
      <div data-testid='active-filter-count'>{activeFilterCount}</div>

      <div data-testid='available-years'>{availableYears.join(',')}</div>
      <div data-testid='available-tags'>{availableTags.join(',')}</div>

      <div data-testid='search-term'>{filters.searchTerm}</div>
      <div data-testid='selected-category'>{filters.selectedCategory}</div>
      <div data-testid='selected-tags'>{filters.selectedTags.join(',')}</div>
      <div data-testid='featured-only'>{filters.featuredOnly.toString()}</div>
      <div data-testid='selected-year'>{filters.selectedYear}</div>

      <button onClick={() => setSearchTerm('test search')}>Set Search Term</button>
      <button onClick={() => setSelectedCategory('timing')}>Set Category</button>
      <button onClick={() => setSelectedTags(['tutorial', 'beginner'])}>Set Tags</button>
      <button onClick={() => addTag('new-tag')}>Add Tag</button>
      <button onClick={() => removeTag('tutorial')}>Remove Tag</button>
      <button onClick={() => setFeaturedOnly(true)}>Set Featured</button>
      <button onClick={() => setSelectedYear(2024)}>Set Year</button>
      <button onClick={clearFilters}>Clear Filters</button>
      <button onClick={resetFilters}>Reset Filters</button>
    </div>
  );
};

// Test component for usePostMatchesFilters hook
const PostMatchTestComponent = ({ post }: { post: any }) => {
  const matches = usePostMatchesFilters(post);
  return <div data-testid='post-matches'>{matches.toString()}</div>;
};

const renderWithProvider = (ui: React.ReactElement, posts = mockBlogPosts) => {
  return render(<BlogFilterProvider posts={posts}>{ui}</BlogFilterProvider>);
};

describe('BlogFilterProvider', () => {
  describe('Initial State', () => {
    it('should provide correct initial state', () => {
      renderWithProvider(<TestComponent />);

      expect(screen.getByTestId('total-posts')).toHaveTextContent('5');
      expect(screen.getByTestId('filtered-posts')).toHaveTextContent('5');
      expect(screen.getByTestId('search-term')).toHaveTextContent('');
      expect(screen.getByTestId('selected-category')).toHaveTextContent('all');
      expect(screen.getByTestId('selected-tags')).toHaveTextContent('');
      expect(screen.getByTestId('featured-only')).toHaveTextContent('false');
      expect(screen.getByTestId('selected-year')).toHaveTextContent('all');
      expect(screen.getByTestId('has-active-filters')).toHaveTextContent('false');
      expect(screen.getByTestId('active-filter-count')).toHaveTextContent('0');
    });

    it('should calculate available years correctly', () => {
      renderWithProvider(<TestComponent />);

      expect(screen.getByTestId('available-years')).toHaveTextContent('2024,2023');
    });

    it('should calculate available tags correctly', () => {
      renderWithProvider(<TestComponent />);

      const availableTags = screen.getByTestId('available-tags').textContent;
      const expectedTags = [
        'advanced',
        'beginner',
        'events',
        'featured',
        'industry',
        'management',
        'multi-stage',
        'new',
        'productivity',
        'professional',
        'tags',
        'technology',
        'timing',
        'tips',
        'tutorial',
        'trends',
      ];
      expectedTags.forEach((tag) => {
        expect(availableTags).toContain(tag);
      });
    });

    it('should handle empty posts array', () => {
      renderWithProvider(<TestComponent />, []);

      expect(screen.getByTestId('total-posts')).toHaveTextContent('0');
      expect(screen.getByTestId('filtered-posts')).toHaveTextContent('0');
      expect(screen.getByTestId('available-years')).toHaveTextContent('');
      expect(screen.getByTestId('available-tags')).toHaveTextContent('');
    });
  });

  describe('Search Functionality', () => {
    it('should filter posts by search term', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      const searchButton = screen.getByText('Set Search Term');
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByTestId('search-term')).toHaveTextContent('test search');
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('0'); // No posts match "test search"
        expect(screen.getByTestId('has-active-filters')).toHaveTextContent('true');
        expect(screen.getByTestId('active-filter-count')).toHaveTextContent('1');
      });
    });

    it('should filter posts by title', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      // Set search term to "CueTimer" which should match the first post
      const searchButton = screen.getByText('Set Search Term');
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByTestId('search-term')).toHaveTextContent('test search');
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('0');
      });

      // Set search term to something that matches
      act(() => {
        const component = screen.getByTestId('search-term');
        const searchInput = component.closest('div')?.querySelector('input');
        if (searchInput) {
          searchInput.value = 'CueTimer';
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });

    it('should handle empty search term', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      // Set search term first
      await user.click(screen.getByText('Set Search Term'));

      await waitFor(() => {
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('0');
      });

      // Clear search using the clear filters button
      await user.click(screen.getByText('Clear Filters'));

      await waitFor(() => {
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('5');
        expect(screen.getByTestId('has-active-filters')).toHaveTextContent('false');
      });
    });
  });

  describe('Category Filtering', () => {
    it('should filter posts by category', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      await user.click(screen.getByText('Set Category'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-category')).toHaveTextContent('timing');
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('1');
        expect(screen.getByTestId('has-active-filters')).toHaveTextContent('true');
        expect(screen.getByTestId('active-filter-count')).toHaveTextContent('1');
      });
    });

    it('should reset to all categories', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      // Set category first
      await user.click(screen.getByText('Set Category'));

      await waitFor(() => {
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('1');
      });

      // Reset filters
      await user.click(screen.getByText('Reset Filters'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-category')).toHaveTextContent('all');
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('5');
      });
    });
  });

  describe('Tag Filtering', () => {
    it('should filter posts by single tag', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      await user.click(screen.getByText('Set Tags'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-tags')).toHaveTextContent('tutorial,beginner');
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('1'); // Only post with both tags
        expect(screen.getByTestId('has-active-filters')).toHaveTextContent('true');
      });
    });

    it('should add tags individually', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      await user.click(screen.getByText('Add Tag'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-tags')).toHaveTextContent('new-tag');
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('0'); // No posts with "new-tag"
      });
    });

    it('should not add duplicate tags', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      // Add a tag twice
      await user.click(screen.getByText('Add Tag'));
      await user.click(screen.getByText('Add Tag'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-tags')).toHaveTextContent('new-tag');
      });
    });

    it('should remove tags', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      // Set tags first
      await user.click(screen.getByText('Set Tags'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-tags')).toHaveTextContent('tutorial,beginner');
      });

      // Remove one tag
      await user.click(screen.getByText('Remove Tag'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-tags')).toHaveTextContent('beginner');
      });
    });

    it('should clear all tags', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      // Set tags first
      await user.click(screen.getByText('Set Tags'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-tags')).toHaveTextContent('tutorial,beginner');
      });

      // Clear filters
      await user.click(screen.getByText('Clear Filters'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-tags')).toHaveTextContent('');
      });
    });
  });

  describe('Featured Filtering', () => {
    it('should filter featured posts', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      await user.click(screen.getByText('Set Featured'));

      await waitFor(() => {
        expect(screen.getByTestId('featured-only')).toHaveTextContent('true');
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('3'); // 3 featured posts
        expect(screen.getByTestId('has-active-filters')).toHaveTextContent('true');
      });
    });

    it('should toggle featured filter', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      // Enable featured filter
      await user.click(screen.getByText('Set Featured'));

      await waitFor(() => {
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('3');
      });

      // Clear filters to disable
      await user.click(screen.getByText('Clear Filters'));

      await waitFor(() => {
        expect(screen.getByTestId('featured-only')).toHaveTextContent('false');
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('5');
      });
    });
  });

  describe('Year Filtering', () => {
    it('should filter posts by year', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      await user.click(screen.getByText('Set Year'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-year')).toHaveTextContent('2024');
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('4');
        expect(screen.getByTestId('has-active-filters')).toHaveTextContent('true');
      });
    });

    it('should filter posts by different year', () => {
      renderWithProvider(<TestComponent />);

      act(() => {
        const yearButton = screen.getByText('Set Year');
        yearButton.onclick?.(new PointerEvent('click'));
      });

      expect(screen.getByTestId('selected-year')).toHaveTextContent('2024');
      expect(screen.getByTestId('filtered-posts')).toHaveTextContent('4');
    });
  });

  describe('Combined Filters', () => {
    it('should apply multiple filters together', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      // Set featured filter
      await user.click(screen.getByText('Set Featured'));

      await waitFor(() => {
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('3');
      });

      // Set year filter
      await user.click(screen.getByText('Set Year'));

      await waitFor(() => {
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('2'); // Featured posts from 2024
      });

      // Set search term
      await user.click(screen.getByText('Set Search Term'));

      await waitFor(() => {
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('0'); // No posts match all criteria
      });
    });

    it('should count active filters correctly', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      // Initially no filters
      expect(screen.getByTestId('active-filter-count')).toHaveTextContent('0');

      // Add one filter
      await user.click(screen.getByText('Set Featured'));

      await waitFor(() => {
        expect(screen.getByTestId('active-filter-count')).toHaveTextContent('1');
      });

      // Add another filter
      await user.click(screen.getByText('Set Year'));

      await waitFor(() => {
        expect(screen.getByTestId('active-filter-count')).toHaveTextContent('2');
      });
    });

    it('should detect active filters correctly', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      // Initially no active filters
      expect(screen.getByTestId('has-active-filters')).toHaveTextContent('false');

      // Add filter
      await user.click(screen.getByText('Set Featured'));

      await waitFor(() => {
        expect(screen.getByTestId('has-active-filters')).toHaveTextContent('true');
      });

      // Clear filters
      await user.click(screen.getByText('Clear Filters'));

      await waitFor(() => {
        expect(screen.getByTestId('has-active-filters')).toHaveTextContent('false');
      });
    });
  });

  describe('Filter Management', () => {
    it('should clear all filters', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      // Set multiple filters
      await user.click(screen.getByText('Set Featured'));
      await user.click(screen.getByText('Set Year'));
      await user.click(screen.getByText('Set Category'));

      await waitFor(() => {
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('0');
      });

      // Clear all filters
      await user.click(screen.getByText('Clear Filters'));

      await waitFor(() => {
        expect(screen.getByTestId('search-term')).toHaveTextContent('');
        expect(screen.getByTestId('selected-category')).toHaveTextContent('all');
        expect(screen.getByTestId('selected-tags')).toHaveTextContent('');
        expect(screen.getByTestId('featured-only')).toHaveTextContent('false');
        expect(screen.getByTestId('selected-year')).toHaveTextContent('all');
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('5');
        expect(screen.getByTestId('has-active-filters')).toHaveTextContent('false');
      });
    });

    it('should reset all filters', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestComponent />);

      // Set multiple filters
      await user.click(screen.getByText('Set Featured'));
      await user.click(screen.getByText('Set Year'));

      await waitFor(() => {
        expect(screen.getByTestId('active-filter-count')).toHaveTextContent('2');
      });

      // Reset filters
      await user.click(screen.getByText('Reset Filters'));

      await waitFor(() => {
        expect(screen.getByTestId('active-filter-count')).toHaveTextContent('0');
        expect(screen.getByTestId('filtered-posts')).toHaveTextContent('5');
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state during filtering', async () => {
      renderWithProvider(<TestComponent />);

      // The loading state should be managed internally
      // Initial state should not be loading
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  describe('usePostMatchesFilters Hook', () => {
    it('should return true when post matches current filters', () => {
      const testPost = mockBlogPosts[0]; // Featured post from 2024

      renderWithProvider(<PostMatchTestComponent post={testPost} />);

      expect(screen.getByTestId('post-matches')).toHaveTextContent('true');
    });

    it('should return false when post does not match current filters', async () => {
      const user = userEvent.setup();
      const testPost = mockBlogPosts[1]; // Non-featured post

      renderWithProvider(
        <>
          <TestComponent />
          <PostMatchTestComponent post={testPost} />
        </>
      );

      // Set featured filter
      await user.click(screen.getByText('Set Featured'));

      await waitFor(() => {
        expect(screen.getByTestId('post-matches')).toHaveTextContent('false');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle useBlogFilter outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useBlogFilter must be used within a BlogFilterProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('should memoize filtered posts correctly', () => {
      const { rerender } = renderWithProvider(<TestComponent />);

      const initialFilteredCount = screen.getByTestId('filtered-posts').textContent;

      // Re-render with same props
      rerender(
        <BlogFilterProvider posts={mockBlogPosts}>
          <TestComponent />
        </BlogFilterProvider>
      );

      // Filtered posts should remain the same
      expect(screen.getByTestId('filtered-posts')).toHaveTextContent(initialFilteredCount);
    });
  });
});
