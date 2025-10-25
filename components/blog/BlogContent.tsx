'use client';

import { useState } from 'react';

import { BlogFilter, BlogPost, getAllPosts } from '@/lib/blog';

import BlogGrid from './BlogGrid';
import BlogSearchAndFilter from './BlogSearchAndFilter';

interface BlogContentProps {
  initialPosts: BlogPost[];
}

export default function BlogContent({ initialPosts }: BlogContentProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = async (filter: BlogFilter) => {
    setLoading(true);
    try {
      const filtered = await getAllPosts(filter);
      setFilteredPosts(filtered);
    } catch (error) {
      console.error('Error filtering posts:', error);
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
      <BlogGrid posts={filteredPosts} loading={loading} />
    </div>
  );
}
