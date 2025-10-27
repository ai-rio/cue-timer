# Chunk 8: components_components

## Metadata

- **Files**: 7
- **Size**: 29,878 characters (~7,469 tokens)
- **Categories**: components

## Files in this chunk

- `components/blog/BlogGrid.tsx`
- `components/blog/BlogGridSimple.tsx`
- `components/blog/BlogPostCard.tsx`
- `components/blog/BlogPostCardSimple.tsx`
- `components/blog/BlogPostNavigation.tsx`
- `components/blog/BlogPostWrapper.tsx`
- `components/blog/BlogSearchAndFilter.tsx`

---

## File: `components/blog/BlogGrid.tsx`

```tsx
'use client';

import { useTranslations } from 'next-intl';

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
  emptyMessage,
}: BlogGridProps) {
  const t = useTranslations('Blog');
  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='text-center text-gray-600'>{t('loading')}</div>
        <div className='animate-pulse'>
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='bg-gray-200 rounded-lg border border-gray-300 h-80'
              />
            ))}
          </div>
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
          <h3 className='text-lg font-semibold'>{t('error.loadFailed')}</h3>
        </div>
        <p className='text-gray-600'>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className='mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200'
        >
          {t('filter.clearFilters')}
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
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          {t('emptyStates.noPosts')}
        </h3>
        <p className='text-gray-600 max-w-md mx-auto'>
          {emptyMessage || t('emptyStates.noPostsDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-12'>
      {/* Featured Posts */}
      {featured.length > 0 && (
        <div>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            {t('featuredPosts')}
          </h2>
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
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              {t('totalPosts')}
            </h2>
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
```

## File: `components/blog/BlogGridSimple.tsx`

```tsx
'use client';

import { BlogPost } from '@/types/blog';

import BlogPostCardSimple from './BlogPostCardSimple';

interface BlogGridSimpleProps {
  posts: BlogPost[];
  featured?: BlogPost[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
}

export default function BlogGridSimple({
  posts,
  featured = [],
  loading = false,
  error,
  emptyMessage,
}: BlogGridSimpleProps) {
  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='text-center text-gray-600'>Loading posts...</div>
        <div className='animate-pulse'>
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='bg-gray-200 rounded-lg border border-gray-300 h-80'
              />
            ))}
          </div>
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
          <h3 className='text-lg font-semibold'>Failed to load posts</h3>
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
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          No posts found
        </h3>
        <p className='text-gray-600 max-w-md mx-auto'>
          {emptyMessage || 'No posts found matching your criteria.'}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-12'>
      {/* Featured Posts */}
      {featured.length > 0 && (
        <div>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Featured Posts
          </h2>
          <div className='grid gap-8 lg:grid-cols-2 xl:grid-cols-3'>
            {featured.map((post) => (
              <BlogPostCardSimple
                key={post.slug}
                post={post}
                variant='featured'
              />
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
              <BlogPostCardSimple
                key={post.slug}
                post={post}
                variant='default'
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## File: `components/blog/BlogPostCard.tsx`

```tsx
'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { BlogPost } from '@/types/blog';

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact' | 'featured';
  showCategory?: boolean;
  showAuthor?: boolean;
  showReadTime?: boolean;
}

export default function BlogPostCard({
  post,
  variant = 'default',
  showCategory = true,
  showAuthor = true,
  showReadTime = true,
}: BlogPostCardProps) {
  const t = useTranslations('Blog');

  const categoryColors = {
    timing: 'bg-blue-100 text-blue-800 border-blue-200',
    productivity: 'bg-green-100 text-green-800 border-green-200',
    events: 'bg-purple-100 text-purple-800 border-purple-200',
    features: 'bg-orange-100 text-orange-800 border-orange-200',
    tutorials: 'bg-pink-100 text-pink-800 border-pink-200',
    industry: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };

  const categoryLabels = {
    timing: t('categories.timing'),
    productivity: t('categories.productivity'),
    events: t('categories.events'),
    features: t('categories.features'),
    tutorials: t('categories.tutorials'),
    industry: t('categories.industry'),
  };

  const cardStyles = {
    default:
      'group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary-300',
    compact:
      'group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:border-primary-300 p-4',
    featured:
      'group relative bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary-400',
  };

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`block ${cardStyles[variant]}`}
    >
      {post.featured && (
        <div className='absolute top-4 right-4 z-10'>
          <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-600 text-white'>
            {t('featured')}
          </span>
        </div>
      )}

      <div className={`${variant === 'compact' ? 'flex gap-4' : ''}`}>
        {/* Image */}
        {post.image && (
          <div
            className={`${variant === 'compact' ? 'flex-shrink-0' : ''} ${variant === 'default' ? 'aspect-[16/9] overflow-hidden' : 'w-24 h-24 flex-shrink-0'}`}
          >
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              width={variant === 'compact' ? 96 : 400}
              height={variant === 'compact' ? 96 : 225}
              className={`object-cover ${variant === 'default' ? 'w-full h-full group-hover:scale-105 transition-transform duration-300' : 'rounded-lg'}`}
            />
          </div>
        )}

        {/* Content */}
        <div
          className={`p-6 ${variant === 'compact' ? 'flex-1 flex flex-col justify-between min-w-0' : ''} ${variant === 'featured' ? 'p-8' : ''}`}
        >
          {/* Category */}
          {showCategory && (
            <div className='mb-3'>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[post.category]}`}
              >
                {categoryLabels[post.category]}
              </span>
            </div>
          )}

          {/* Title */}
          <h3
            className={`font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 ${
              variant === 'compact'
                ? 'text-lg mb-2 line-clamp-2'
                : variant === 'featured'
                  ? 'text-2xl mb-4'
                  : 'text-xl mb-3 line-clamp-2'
            }`}
          >
            {post.title}
          </h3>

          {/* Summary */}
          {variant !== 'compact' && (
            <p
              className={`text-gray-600 mb-4 line-clamp-3 ${
                variant === 'featured' ? 'text-base' : 'text-sm'
              }`}
            >
              {post.summary}
            </p>
          )}

          {/* Metadata */}
          <div
            className={`flex items-center justify-between text-sm text-gray-500 ${
              variant === 'compact' ? 'text-xs' : ''
            }`}
          >
            <div className='flex items-center gap-3'>
              {showAuthor && <span className='font-medium'>{post.author}</span>}
              <span>{format(post.publishedAtDate, 'MMM d, yyyy')}</span>
            </div>

            {showReadTime && (
              <div className='flex items-center'>
                <svg
                  className='w-4 h-4 mr-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span>
                  {post.readTime} {t('minRead')}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && variant !== 'compact' && (
            <div className='mt-4 flex flex-wrap gap-2'>
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className='inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200'
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className='inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600'>
                  +{post.tags.length - 3} {t('more')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
```

## File: `components/blog/BlogPostCardSimple.tsx`

```tsx
'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import type { BlogPost } from '@/types/blog';

interface BlogPostCardSimpleProps {
  post: BlogPost;
  variant?: 'default' | 'compact' | 'featured';
  showCategory?: boolean;
  showAuthor?: boolean;
  showReadTime?: boolean;
}

export default function BlogPostCardSimple({
  post,
  variant = 'default',
  showCategory = true,
  showAuthor = true,
  showReadTime = true,
}: BlogPostCardSimpleProps) {
  const categoryColors = {
    timing: 'bg-blue-100 text-blue-800 border-blue-200',
    productivity: 'bg-green-100 text-green-800 border-green-200',
    events: 'bg-purple-100 text-purple-800 border-purple-200',
    features: 'bg-orange-100 text-orange-800 border-orange-200',
    tutorials: 'bg-pink-100 text-pink-800 border-pink-200',
    industry: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };

  const cardStyles = {
    default:
      'group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary-300',
    compact:
      'group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:border-primary-300 p-4',
    featured:
      'group relative bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary-400',
  };

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`block ${cardStyles[variant]}`}
    >
      {post.featured && (
        <div className='absolute top-4 right-4 z-10'>
          <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-600 text-white'>
            Featured
          </span>
        </div>
      )}

      <div className={`${variant === 'compact' ? 'flex gap-4' : ''}`}>
        {/* Image */}
        {post.image && (
          <div
            className={`${variant === 'compact' ? 'flex-shrink-0' : ''} ${variant === 'default' ? 'aspect-[16/9] overflow-hidden' : 'w-24 h-24 flex-shrink-0'}`}
          >
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              width={variant === 'compact' ? 96 : 400}
              height={variant === 'compact' ? 96 : 225}
              className={`object-cover ${variant === 'default' ? 'w-full h-full group-hover:scale-105 transition-transform duration-300' : 'rounded-lg'}`}
            />
          </div>
        )}

        {/* Content */}
        <div
          className={`p-6 ${variant === 'compact' ? 'flex-1 flex flex-col justify-between min-w-0' : ''} ${variant === 'featured' ? 'p-8' : ''}`}
        >
          {/* Category */}
          {showCategory && (
            <div className='mb-3'>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[post.category]}`}
              >
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h3
            className={`font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 ${
              variant === 'compact'
                ? 'text-lg mb-2 line-clamp-2'
                : variant === 'featured'
                  ? 'text-2xl mb-4'
                  : 'text-xl mb-3 line-clamp-2'
            }`}
          >
            {post.title}
          </h3>

          {/* Summary */}
          {variant !== 'compact' && (
            <p
              className={`text-gray-600 mb-4 line-clamp-3 ${
                variant === 'featured' ? 'text-base' : 'text-sm'
              }`}
            >
              {post.summary}
            </p>
          )}

          {/* Metadata */}
          <div
            className={`flex items-center justify-between text-sm text-gray-500 ${
              variant === 'compact' ? 'text-xs' : ''
            }`}
          >
            <div className='flex items-center gap-3'>
              {showAuthor && <span className='font-medium'>{post.author}</span>}
              <span>{format(post.publishedAtDate, 'MMM d, yyyy')}</span>
            </div>

            {showReadTime && (
              <div className='flex items-center'>
                <svg
                  className='w-4 h-4 mr-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span>{post.readTime} min read</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && variant !== 'compact' && (
            <div className='mt-4 flex flex-wrap gap-2'>
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className='inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200'
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className='inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600'>
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
```

## File: `components/blog/BlogPostNavigation.tsx`

```tsx
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { BlogPostNavigation as BlogPostNavigationType } from '@/types/blog';

interface BlogPostNavigationProps {
  navigation: BlogPostNavigationType;
}

export default function BlogPostNavigation({
  navigation,
}: BlogPostNavigationProps) {
  const { previous, next } = navigation;

  return (
    <nav className='mt-16 border-t pt-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Previous Post */}
        {previous ? (
          <Card className='relative overflow-hidden group cursor-pointer transition-all duration-200 hover:shadow-md'>
            <Link href={`/blog/${previous.slug}`} className='block h-full'>
              <CardHeader className='pb-3'>
                <div className='flex items-center text-sm text-muted-foreground mb-2'>
                  <span className='mr-2'>←</span>
                  Previous Article
                </div>
                <CardTitle className='text-lg leading-tight group-hover:text-primary transition-colors'>
                  {previous.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-0'>
                <CardDescription className='text-sm line-clamp-2 mb-3'>
                  {previous.summary}
                </CardDescription>
                <div className='flex items-center justify-between'>
                  <Badge variant='secondary' className='text-xs'>
                    {previous.category}
                  </Badge>
                  <span className='text-xs text-muted-foreground'>
                    {previous.readTime} min read
                  </span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ) : (
          <div className='md:col-start-1'></div>
        )}

        {/* Next Post */}
        {next ? (
          <Card className='relative overflow-hidden group cursor-pointer transition-all duration-200 hover:shadow-md md:col-start-2'>
            <Link href={`/blog/${next.slug}`} className='block h-full'>
              <CardHeader className='pb-3 text-right'>
                <div className='flex items-center justify-end text-sm text-muted-foreground mb-2'>
                  Next Article
                  <span className='ml-2'>→</span>
                </div>
                <CardTitle className='text-lg leading-tight group-hover:text-primary transition-colors'>
                  {next.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-0 text-right'>
                <CardDescription className='text-sm line-clamp-2 mb-3 ml-auto'>
                  {next.summary}
                </CardDescription>
                <div className='flex items-center justify-end gap-2'>
                  <span className='text-xs text-muted-foreground'>
                    {next.readTime} min read
                  </span>
                  <Badge variant='secondary' className='text-xs'>
                    {next.category}
                  </Badge>
                </div>
              </CardContent>
            </Link>
          </Card>
        ) : (
          <div className='md:col-start-2'></div>
        )}
      </div>

      {/* Back to Blog Button */}
      <div className='text-center mt-8'>
        <Button asChild variant='outline'>
          <Link href='/blog'>← Back to All Articles</Link>
        </Button>
      </div>
    </nav>
  );
}
```

## File: `components/blog/BlogPostWrapper.tsx`

```tsx
'use client';

import { useMemo } from 'react';

import BlogErrorBoundary from './BlogErrorBoundary';
import MDXRenderer from './MDXRenderer';
import TableOfContents, { extractHeadings } from './TableOfContents';

interface BlogPostWrapperProps {
  content: string;
}

export default function BlogPostWrapper({ content }: BlogPostWrapperProps) {
  const headings = useMemo(() => extractHeadings(content), [content]);

  return (
    <BlogErrorBoundary>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        {/* Main content */}
        <div className='lg:col-span-3'>
          <MDXRenderer content={content} />
        </div>

        {/* Table of Contents */}
        <aside className='lg:col-span-1'>
          <BlogErrorBoundary>
            <div className='hidden lg:block'>
              <TableOfContents headings={headings} />
            </div>
          </BlogErrorBoundary>
        </aside>
      </div>
    </BlogErrorBoundary>
  );
}
```

## File: `components/blog/BlogSearchAndFilter.tsx`

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { blogCategories, BlogCategory, BlogFilter } from '@/types/blog';

interface BlogSearchAndFilterProps {
  onFilterChange: (filter: BlogFilter) => void;
  className?: string;
}

export default function BlogSearchAndFilter({
  onFilterChange,
  className = '',
}: BlogSearchAndFilterProps) {
  const t = useTranslations('Blog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    BlogCategory | 'all'
  >('all');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        searchTerm,
        category: selectedCategory,
        featured: showOnlyFeatured,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, showOnlyFeatured, onFilterChange]);

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: t('filter.allCategories') },
      ...blogCategories.map((category) => ({
        value: category,
        label: t(`categories.${category}`),
      })),
    ],
    [t]
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setShowOnlyFeatured(false);
  };

  const hasActiveFilters =
    searchTerm || selectedCategory !== 'all' || showOnlyFeatured;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <svg
            className='h-5 w-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
        <input
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('filter.searchPlaceholder')}
          className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200'
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
          >
            <svg
              className='h-4 w-4 text-gray-400 hover:text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
        {/* Category Filter */}
        <div className='flex-1 max-w-xs'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('filter.categoryLabel')}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as BlogCategory | 'all')
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200'
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Toggle */}
        <div className='flex items-center'>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={showOnlyFeatured}
              onChange={(e) => setShowOnlyFeatured(e.target.checked)}
              className='sr-only peer'
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            <span className='ml-3 text-sm font-medium text-gray-700'>
              {t('filter.featuredOnly')}
            </span>
          </label>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200'
          >
            {t('filter.clearFilters')}
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg'>
          <span className='text-sm text-gray-600'>
            {t('filter.activeFilters')}:
          </span>
          {searchTerm && (
            <span className='inline-flex items-center px-2 py-1 rounded text-xs bg-primary-100 text-primary-700'>
              "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className='ml-1 hover:text-primary-900'
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className='inline-flex items-center px-2 py-1 rounded text-xs bg-primary-100 text-primary-700'>
              {t(`categories.${selectedCategory}`)}
              <button
                onClick={() => setSelectedCategory('all')}
                className='ml-1 hover:text-primary-900'
              >
                ×
              </button>
            </span>
          )}
          {showOnlyFeatured && (
            <span className='inline-flex items-center px-2 py-1 rounded text-xs bg-primary-100 text-primary-700'>
              {t('featured')}
              <button
                onClick={() => setShowOnlyFeatured(false)}
                className='ml-1 hover:text-primary-900'
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
```
