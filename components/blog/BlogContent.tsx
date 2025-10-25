'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getAllPosts } from '@/lib/blog';
import type { BlogFilter } from '@/types/blog';
import type { BlogPostEnhanced } from '@/types/blog-api';

import BlogGrid from './BlogGrid';
import BlogSearchAndFilter from './BlogSearchAndFilter';

interface BlogContentProps {
  initialPosts: BlogPostEnhanced[];
}

export default function BlogContent({ initialPosts }: BlogContentProps) {
  const t = useTranslations('Blog');
  const [filteredPosts, setFilteredPosts] = useState<BlogPostEnhanced[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = async (filter: BlogFilter) => {
    setLoading(true);
    setError(null);
    try {
      const filtered = await getAllPosts(filter);
      setFilteredPosts(filtered);
    } catch (error) {
      setError(t('error.filterFailed'));
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-8'>
      {/* Search and Filter */}
      <BlogSearchAndFilter onFilterChange={handleFilterChange} />

      {/* Blog Posts Grid */}
      <BlogGrid
        posts={filteredPosts}
        loading={loading}
        error={error || undefined}
        emptyMessage={
          filteredPosts.length === 0 ? t('emptyStates.noSearchResultsDescription') : undefined
        }
      />
    </div>
  );
}
