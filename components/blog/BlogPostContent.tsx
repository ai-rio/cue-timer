import { Suspense } from 'react';

import { extractHeadingsFromMdx } from '@/lib/utils';

import BlogErrorBoundary, { MDXErrorFallback } from './BlogErrorBoundary';
import { InternalLinkInjector } from './InternalLinkInjector';
import MDXServerRenderer from './MDXServerRenderer';
import TableOfContents from './TableOfContents';

interface BlogPostContentProps {
  content: string;
  enableInternalLinks?: boolean;
  currentSlug?: string;
  locale?: string;
  maxInternalLinks?: number;
}

// Server Component that handles the MDX rendering
export default async function BlogPostContent({
  content,
  enableInternalLinks = false,
  currentSlug = '',
  locale = 'en',
  maxInternalLinks = 5,
}: BlogPostContentProps) {
  // Extract headings on the server side for better performance
  const headings = extractHeadingsFromMdx(content);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
      {/* Main content */}
      <div className='lg:col-span-3'>
        <BlogErrorBoundary fallback={MDXErrorFallback}>
          <div className='prose prose-gray max-w-none'>
            <Suspense fallback={<div className='animate-pulse'>Loading content...</div>}>
              {enableInternalLinks && currentSlug ? (
                <InternalLinkInjector
                  content={content}
                  currentSlug={currentSlug}
                  locale={locale}
                  maxLinks={maxInternalLinks}
                  className='prose prose-gray max-w-none'
                />
              ) : (
                <MDXServerRenderer content={content} />
              )}
            </Suspense>
          </div>
        </BlogErrorBoundary>
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
  );
}
