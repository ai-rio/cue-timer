import { Metadata } from 'next';
import { Suspense } from 'react';

import BlogContentSimple from '@/components/blog/BlogContentSimple';
import { getAllPosts } from '@/lib/blog';
import type { BlogPostEnhanced } from '@/types/blog-api';

interface BlogPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: {
    category?: string;
    featured?: string;
    search?: string;
  };
}

// Generate metadata for the blog page
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'CueTimer Blog - Expert Event Timing & Productivity Tips',
    description:
      'Read the latest articles on event management, timer optimization, and professional presentation tips from CueTimer experts.',
    keywords: [
      'event timing',
      'timer tips',
      'productivity',
      'event management',
      'presentation skills',
    ],
    openGraph: {
      title: 'CueTimer Blog - Expert Event Timing & Productivity Tips',
      description:
        'Read the latest articles on event management, timer optimization, and professional presentation tips from CueTimer experts.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CueTimer Blog - Expert Event Timing & Productivity Tips',
      description:
        'Read the latest articles on event management, timer optimization, and professional presentation tips from CueTimer experts.',
    },
  };
}

// Blog page component
export default async function BlogPage() {
  // Get initial posts (exclude drafts by default)
  const initialPosts: BlogPostEnhanced[] = await getAllPosts();

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold tracking-tight mb-4'>CueTimer Blog</h1>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Expert insights on event timing, productivity, and professional presentation skills.
            Learn from industry experts and take your events to the next level.
          </p>
        </div>

        {/* Blog Content with search and filtering */}
        <Suspense fallback={<div>Loading blog posts...</div>}>
          <BlogContentSimple initialPosts={initialPosts} />
        </Suspense>
      </div>
    </div>
  );
}
