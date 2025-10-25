'use client';

// import { ExternalLink } from 'lucide-react';
// import Image from 'next/image';
import { Suspense, useState } from 'react';

import { Button } from '@/components/ui/button';

import BlogErrorBoundary, { MDXErrorFallback } from './BlogErrorBoundary';

// TypeScript interfaces for MDX components (commented - currently unused)
// interface MDXComponentProps {
//   children?: React.ReactNode;
//   className?: string;
//   id?: string;
//   href?: string;
//   src?: string;
//   alt?: string;
//   width?: number;
//   height?: number;
//   filename?: string;
//   language?: string;
//   target?: string;
//   rel?: string;
//   role?: string;
//   'aria-label'?: string;
// }

// interface TextProps extends Omit<MDXComponentProps, 'role'> {
//   children: React.ReactNode;
// }

// interface LinkProps extends Omit<MDXComponentProps, 'role'> {
//   href: string;
//   target?: string;
//   rel?: string;
//   'aria-label'?: string;
// }

// interface ImageProps extends Omit<MDXComponentProps, 'role'> {
//   src: string;
//   alt?: string;
//   width?: number;
//   height?: number;
// }

// interface CodeProps extends Omit<MDXComponentProps, 'role'> {
//   className?: string;
//   filename?: string;
// }

// interface PreProps extends Omit<MDXComponentProps, 'role'> {}

// interface ListProps extends Omit<MDXComponentProps, 'role'> {}

// interface ListItemProps extends Omit<MDXComponentProps, 'role'> {}

// interface BlockquoteProps extends Omit<MDXComponentProps, 'role'> {}

// interface SeparatorProps extends Omit<MDXComponentProps, 'role'> {}

// Lazy load heavy dependencies - only load when needed
const FullMDXRenderer = lazy(() => import('./EnhancedMDXRenderer'));

interface OptimizedMDXRendererProps {
  content: string;
  template?: string;
  enableAdvancedFeatures?: boolean;
  onReadingTimeUpdate?: (time: number) => void;
  onCodeBlockCount?: (count: number) => void;
  fallback?: React.ReactNode;
}

// Lightweight components that don't require heavy dependencies
// Note: This section is commented out as the components are defined elsewhere
// const LightComponents = { ... };

// Simple content parser for basic markdown without MDX compilation
function parseBasicMarkdown(content: string) {
  let processedContent = content;

  // Basic markdown parsing
  processedContent = processedContent
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>');

  return processedContent;
}

export default function OptimizedMDXRenderer({
  content,
  template,
  enableAdvancedFeatures = true,
  onReadingTimeUpdate,
  onCodeBlockCount,
  fallback,
}: OptimizedMDXRendererProps) {
  const [useAdvancedRenderer, setUseAdvancedRenderer] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Calculate reading time on client side
  useMemo(() => {
    if (!isClient) {
      setIsClient(true);
      if (onReadingTimeUpdate) {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const readingTime = Math.ceil(words / wordsPerMinute);
        onReadingTimeUpdate(readingTime);
      }

      // Count code blocks
      if (onCodeBlockCount) {
        const codeBlockRegex = /```[\s\S]*?```/g;
        const matches = content.match(codeBlockRegex);
        onCodeBlockCount(matches ? matches.length : 0);
      }
    }
  }, [content, isClient, onReadingTimeUpdate, onCodeBlockCount]);

  // Check if content has complex features that need full MDX
  const hasComplexFeatures = useMemo(
    () =>
      /{{(timer|metric|feature|tip|mistake|callout|step|progress)}}/.test(content) ||
      content.includes('```') ||
      content.includes('<') ||
      content.length > 10000,
    [content]
  );

  // If no complex features, use basic HTML rendering
  if (!hasComplexFeatures || !enableAdvancedFeatures) {
    const processedHTML = parseBasicMarkdown(content);

    return (
      <BlogErrorBoundary fallback={MDXErrorFallback}>
        <div
          className='prose prose-gray max-w-none'
          dangerouslySetInnerHTML={{ __html: processedHTML }}
        />
      </BlogErrorBoundary>
    );
  }

  // Load full renderer only when needed
  if (useAdvancedRenderer) {
    return (
      <BlogErrorBoundary fallback={MDXErrorFallback}>
        <Suspense
          fallback={
            fallback || (
              <div className='animate-pulse space-y-4'>
                <div className='h-8 bg-gray-200 rounded w-3/4'></div>
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded'></div>
                  <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                  <div className='h-4 bg-gray-200 rounded w-4/6'></div>
                </div>
              </div>
            )
          }
        >
          <FullMDXRenderer
            content={content}
            template={template}
            enableAdvancedFeatures={true}
            onReadingTimeUpdate={onReadingTimeUpdate}
            onCodeBlockCount={onCodeBlockCount}
          />
        </Suspense>
      </BlogErrorBoundary>
    );
  }

  // Show initial preview with option to load full renderer
  return (
    <BlogErrorBoundary fallback={MDXErrorFallback}>
      <div className='space-y-4'>
        <div className='prose prose-gray max-w-none'>
          <div className='text-sm text-muted-foreground mb-4'>
            This content uses advanced features.
            <Button
              variant='outline'
              size='sm'
              onClick={() => setUseAdvancedRenderer(true)}
              className='ml-2'
            >
              Load Enhanced Features
            </Button>
          </div>

          {/* Show basic preview */}
          <div className='border-l-4 border-blue-200 pl-4 bg-blue-50/30 p-4 rounded'>
            <p className='text-sm text-blue-800'>
              This content contains enhanced features like interactive components, syntax
              highlighting, or custom elements. Click the button above to load the full experience.
            </p>
          </div>
        </div>
      </div>
    </BlogErrorBoundary>
  );
}
