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
  const t = useTranslations('blog');

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
    <Link href={`/blog/${post.slug}`} className={`block ${cardStyles[variant]}`}>
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
                <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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
