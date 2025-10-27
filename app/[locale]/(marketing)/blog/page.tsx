import { Metadata } from 'next';
import { Suspense } from 'react';

import BlogContent from '@/components/blog/BlogContent';
import { getAllPosts } from '@/lib/blog';

interface BlogPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    category?: string;
    featured?: string;
    search?: string;
  }>;
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

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  // Get initial posts for server-side rendering
  const initialPosts = await getAllPosts({ includeDrafts: false });

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>CueTimer Blog</h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
          Expert insights on event timing, productivity, and professional presentation management.
          Learn from industry leaders and transform your events with proven strategies.
        </p>
      </div>

      {/* Blog Content with filtering and posts */}
      <Suspense
        fallback={
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded mb-8 w-1/3'></div>
            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='bg-gray-200 rounded-lg border border-gray-300 h-80' />
              ))}
            </div>
          </div>
        }
      >
        <BlogContent initialPosts={initialPosts} />
      </Suspense>
    </div>
  );
}
