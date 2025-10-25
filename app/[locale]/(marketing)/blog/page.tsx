import { Metadata } from 'next';
import { Suspense } from 'react';

import BlogContent from '@/components/blog/BlogContent';
import { BlogPost, getAllPosts } from '@/lib/blog';

interface BlogPageProps {
  params: {
    locale: string;
  };
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

export default function BlogPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold text-gray-900 mb-4 text-center'>CueTimer Blog</h1>
      <p className='text-xl text-gray-600 max-w-3xl mx-auto text-center mb-8'>
        Simple blog page test.
      </p>
      <div className='text-center'>
        <p>If you can see this page, the basic routing and layout are working.</p>
      </div>
    </div>
  );
}
