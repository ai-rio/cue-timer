import { BlogPost } from '@/types/blog';

import BlogPostCard from './BlogPostCard';

interface BlogGridProps {
  posts: BlogPost[];
  featured?: BlogPost[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
}

export default function BlogGrid({
  posts,
  featured = [],
  loading = false,
  error,
  emptyMessage = 'No blog posts found.',
}: BlogGridProps) {
  if (loading) {
    return (
      <div className='animate-pulse'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='bg-gray-200 rounded-lg border border-gray-300 h-80' />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='text-red-600 mb-4'>
          <svg
            className='w-12 h-12 mx-auto mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h3 className='text-lg font-semibold'>Error Loading Blog Posts</h3>
        </div>
        <p className='text-gray-600'>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className='mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200'
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0 && featured.length === 0) {
    return (
      <div className='text-center py-12'>
        <svg
          className='w-16 h-16 mx-auto mb-4 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
          />
        </svg>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>No Blog Posts Found</h3>
        <p className='text-gray-600 max-w-md mx-auto'>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className='space-y-12'>
      {/* Featured Posts */}
      {featured.length > 0 && (
        <div>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Featured Posts</h2>
          <div className='grid gap-8 lg:grid-cols-2 xl:grid-cols-3'>
            {featured.map((post) => (
              <BlogPostCard key={post.slug} post={post} variant='featured' />
            ))}
          </div>
        </div>
      )}

      {/* Regular Posts */}
      {posts.length > 0 && (
        <div>
          {featured.length > 0 && (
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>All Posts</h2>
          )}
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} variant='default' />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
