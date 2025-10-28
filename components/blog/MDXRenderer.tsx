import { Suspense } from 'react';

import BlogErrorBoundary, { MDXErrorFallback } from './BlogErrorBoundary';
import MDXServerRenderer from './MDXServerRenderer';

interface MDXRendererProps {
  content: string;
}

export default async function MDXRenderer({ content }: MDXRendererProps) {
  return (
    <BlogErrorBoundary fallback={MDXErrorFallback}>
      <div className='prose prose-gray max-w-none'>
        <Suspense fallback={<div className='animate-pulse'>Loading content...</div>}>
          <MDXServerRenderer content={content} />
        </Suspense>
      </div>
    </BlogErrorBoundary>
  );
}
