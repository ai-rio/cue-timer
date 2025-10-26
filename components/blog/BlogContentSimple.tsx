'use client';

import { useEffect } from 'react';

import { blogStorage, createBlogError, useBlogApi, useBlogState } from '@/lib/blog-utils';
import type { BlogFilter, BlogPostEnhanced } from '@/types/blog-api';

import BlogGridSimple from './BlogGridSimple';
import BlogSearchAndFilterSimple from './BlogSearchAndFilterSimple';

interface BlogContentSimpleProps {
  initialPosts: BlogPostEnhanced[];
}

export default function BlogContentSimple({ initialPosts }: BlogContentSimpleProps) {
  const { fetchPosts, loading: apiLoading, error: apiError, clearError } = useBlogApi();
  const { state, dispatch, setFilter, filteredPosts } = useBlogState(initialPosts);

  // Load saved filter from localStorage on mount
  useEffect(() => {
    const savedFilter = blogStorage.getFilter();
    if (Object.keys(savedFilter).length > 0) {
      setFilter(savedFilter);
    }
  }, [setFilter]);

  const handleFilterChange = async (filter: BlogFilter) => {
    // Clear any previous errors
    clearError();

    // Update state filter for immediate responsiveness
    setFilter(filter);

    // Save filter to localStorage
    blogStorage.setFilter(filter);

    // Fetch filtered posts from API
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const posts = await fetchPosts(filter);
      dispatch({ type: 'SET_POSTS', payload: posts });

      // Update pagination info
      dispatch({
        type: 'UPDATE_PAGINATION',
        payload: {
          total: posts.length,
          hasMore: false, // For simplicity, implement infinite scroll later
        },
      });
    } catch {
      const blogError = createBlogError('FILTER_ERROR', 'Failed to filter posts', {
        filter: JSON.stringify(filter),
      });
      dispatch({ type: 'SET_ERROR', payload: blogError });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const isLoading = state.loading || apiLoading;
  const error = state.error || apiError;

  return (
    <div className='space-y-8'>
      {/* Search and Filter */}
      <BlogSearchAndFilterSimple onFilterChange={handleFilterChange} />

      {/* Error Display */}
      {error && (
        <div
          className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md'
          role='alert'
        >
          <div className='flex'>
            <div className='py-1'>
              <svg
                className='fill-current h-4 w-4 text-red-500 mr-2'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M10 2a8 8 0 100 16 8 8 0 000-16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 4a1 1 0 110 2v3a1 1 0 11-2 0v-4a1 1 0 011-1z' />
              </svg>
            </div>
            <div>
              <p className='font-bold'>Error loading blog posts</p>
              <p className='text-sm'>{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <BlogGridSimple
        posts={filteredPosts}
        loading={isLoading}
        error={error?.message}
        emptyMessage={
          filteredPosts.length === 0 && !isLoading
            ? 'No posts found matching your criteria. Try adjusting your filters.'
            : undefined
        }
      />
    </div>
  );
}
