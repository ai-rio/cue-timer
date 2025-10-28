import { Metadata } from 'next';

import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Test Blog - CueTimer',
  description: 'Test blog page to debug blog system',
};

export default async function TestBlogPage() {
  try {
    const posts = await getAllPosts();

    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold mb-8'>Test Blog Page</h1>

          <div className='mb-8 p-4 bg-green-100 rounded-lg'>
            <h2 className='text-xl font-semibold mb-2'>✅ Blog API Status</h2>
            <p>Found {posts.length} blog posts successfully!</p>
          </div>

          <div className='space-y-8'>
            <h2 className='text-2xl font-bold mb-4'>Blog Posts</h2>
            {posts.map((post) => (
              <div key={post.slug} className='border rounded-lg p-6 mb-6 bg-white shadow-sm'>
                <h3 className='text-xl font-bold mb-2'>{post.title}</h3>
                <p className='text-gray-600 mb-2'>{post.summary}</p>
                <div className='text-sm text-gray-500 space-x-4'>
                  <span>Category: {post.category}</span>
                  <span>Author: {post.author}</span>
                  <span>Read Time: {post.readTime} min</span>
                  <span>Draft: {post.draft ? 'Yes' : 'No'}</span>
                </div>
                <div className='mt-4'>
                  <h4 className='font-semibold mb-2'>Content Preview:</h4>
                  <p className='text-sm text-gray-700 line-clamp-3'>{post.excerpt}</p>
                </div>
                <div className='mt-4'>
                  <h4 className='font-semibold mb-2'>Tags:</h4>
                  <div className='flex flex-wrap gap-2'>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold mb-8'>Test Blog Page - Error</h1>
          <div className='p-4 bg-red-100 rounded-lg'>
            <h2 className='text-xl font-semibold mb-2'>❌ Error Loading Blog Posts</h2>
            <p className='text-red-700'>
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
