'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

// import { getAllPosts } from '@/lib/blog';
// import type { BlogFilter } from '@/types/blog';
import type { BlogPostEnhanced } from '@/types/blog-api';

// Temporarily disable these imports to isolate the issue
// import BlogGrid from './BlogGrid';
// import BlogSearchAndFilter from './BlogSearchAndFilter';

interface BlogContentProps {
  initialPosts: BlogPostEnhanced[];
}

export default function BlogContent({ initialPosts }: BlogContentProps) {
  const t = useTranslations('blog');
  const [filteredPosts] = useState<BlogPostEnhanced[]>(initialPosts);

  // Temporary simple display to test if this component works
  return (
    <div className='space-y-8'>
      <div className='text-center py-8'>
        <h2 className='text-2xl font-bold mb-4'>Blog Posts</h2>
        <p>Found {filteredPosts.length} posts</p>
        <p>Translations working: {t('loading')}</p>

        {/* Simple list of posts */}
        <div className='mt-8 space-y-4 max-w-2xl mx-auto'>
          {filteredPosts.map((post) => (
            <div key={post.slug} className='border p-4 rounded-lg text-left'>
              <h3 className='font-bold'>{post.title}</h3>
              <p className='text-sm text-gray-600'>{post.summary}</p>
              <p className='text-xs text-gray-500'>Category: {post.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
