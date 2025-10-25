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
