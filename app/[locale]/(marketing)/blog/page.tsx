import { Metadata } from 'next';
import Link from 'next/link';

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

export default async function BlogPage({ params, searchParams: _searchParams }: BlogPageProps) {
  // Get initial posts for server-side rendering
  const initialPosts = await getAllPosts({ includeDrafts: false });
  const { locale } = await params;

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

      {/* Temporary simple blog post display */}
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold mb-4'>Latest Blog Posts ({initialPosts.length})</h2>
          <p>Locale: {locale}</p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {initialPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className='border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-blue-300 group cursor-pointer block'
            >
              <h3 className='font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors'>
                {post.title}
              </h3>
              <p className='text-gray-600 text-sm mb-3'>{post.summary}</p>
              <div className='flex items-center justify-between text-xs text-gray-500'>
                <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded'>{post.category}</span>
                <span>{post.readTime} min read</span>
              </div>
              <div className='mt-4 text-sm text-blue-600 font-medium group-hover:text-blue-700'>
                Read more →
              </div>
            </Link>
          ))}
        </div>

        {initialPosts.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-600'>No blog posts found. Check back later for new content!</p>
          </div>
        )}
      </div>

      {/* Blog Content - DISABLED TEMPORARILY DUE TO LAZY COMPONENT ERRORS */}
      {/* <Suspense
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
      </Suspense> */}
    </div>
  );
}
