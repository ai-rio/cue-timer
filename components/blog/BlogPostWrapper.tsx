'use client';

import { useMemo } from 'react';

import MDXRenderer from './MDXRenderer';
import TableOfContents, { extractHeadings } from './TableOfContents';

interface BlogPostWrapperProps {
  content: string;
}

export default function BlogPostWrapper({ content }: BlogPostWrapperProps) {
  const headings = useMemo(() => extractHeadings(content), [content]);

  return (
    <>
      {/* Main content */}
      <div className='lg:col-span-3'>
        <MDXRenderer content={content} />
      </div>

      {/* Table of Contents */}
      <aside className='lg:col-span-1'>
        <div className='hidden lg:block'>
          <TableOfContents headings={headings} />
        </div>
      </aside>
    </>
  );
}
