'use client';

import { Check, Copy, Download, ExternalLink, Play, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { lazy, Suspense, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import BlogErrorBoundary, { MDXErrorFallback } from './BlogErrorBoundary';

// TypeScript interfaces for MDX components
interface MDXComponentProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  href?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  filename?: string;
  language?: string;
  target?: string;
  rel?: string;
  role?: string;
  'aria-level'?: number;
  'aria-label'?: string;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  'aria-hidden'?: boolean;
  suppressHydrationWarning?: boolean;
}

interface HeadingProps extends MDXComponentProps {
  role?: 'heading';
  'aria-level': 1 | 2 | 3 | 4 | 5 | 6;
}

interface TextProps extends Omit<MDXComponentProps, 'role'> {
  children: React.ReactNode;
}

interface LinkProps extends Omit<MDXComponentProps, 'role'> {
  href: string;
  target?: string;
  rel?: string;
  'aria-label'?: string;
}

interface ImageProps extends Omit<MDXComponentProps, 'role'> {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  'aria-describedby'?: string;
}

interface CodeProps extends Omit<MDXComponentProps, 'role'> {
  className?: string;
  filename?: string;
  'aria-label'?: string;
}

interface PreProps extends Omit<MDXComponentProps, 'role'> {
  'aria-label'?: string;
}

interface ListProps extends Omit<MDXComponentProps, 'role'> {
  role?: 'list';
}

interface ListItemProps extends Omit<MDXComponentProps, 'role'> {
  role?: 'listitem';
}

interface BlockquoteProps extends Omit<MDXComponentProps, 'role'> {
  role?: 'blockquote';
  'aria-label'?: string;
}

interface SeparatorProps extends Omit<MDXComponentProps, 'role'> {
  role?: 'separator';
  'aria-orientation'?: 'horizontal' | 'vertical';
}

// Lazy load heavy dependencies - only load when needed
const FullMDXRenderer = lazy(() => import('./EnhancedMDXRenderer'));

interface AccessibleMDXRendererProps {
  content: string;
  template?: string;
  enableAdvancedFeatures?: boolean;
  onReadingTimeUpdate?: (time: number) => void;
  onCodeBlockCount?: (count: number) => void;
  fallback?: React.ReactNode;
}

// Accessible components with proper ARIA labels and semantic HTML
const AccessibleComponents = {
  h1: ({ children, id, ...props }: HeadingProps) => (
    <h1
      id={id}
      className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'
      {...props}
      role='heading'
      aria-level={1}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }: HeadingProps) => (
    <h2
      id={id}
      className='scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-4 mt-8 border-b pb-2'
      {...props}
      role='heading'
      aria-level={2}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }: HeadingProps) => (
    <h3
      id={id}
      className='scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6'
      {...props}
      role='heading'
      aria-level={3}
    >
      {children}
    </h3>
  ),
  h4: ({ children, id, ...props }: HeadingProps) => (
    <h4
      id={id}
      className='scroll-m-20 text-xl font-semibold tracking-tight mb-2 mt-6'
      {...props}
      role='heading'
      aria-level={4}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }: TextProps) => (
    <p className='leading-7 [&:not(:first-child)]:mt-6 text-base' {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: TextProps) => (
    <strong className='font-semibold' {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: TextProps) => (
    <em className='italic' {...props}>
      {children}
    </em>
  ),
  code: ({ children, className, filename, id, ...props }: CodeProps) => {
    const isInline = !className;
    const language = className?.replace('language-', '') || 'text';

    return isInline ? (
      <code
        id={id}
        className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-mono'
        {...props}
        role='code'
        aria-label={`Code: ${children}`}
      >
        {children}
      </code>
    ) : (
      <AccessibleCodeBlock id={id} className={className} filename={filename} language={language}>
        {children}
      </AccessibleCodeBlock>
    );
  },
  pre: ({ children, ...props }: PreProps) => (
    <pre role='presentation' aria-label='Code block' {...props}>
      {children}
    </pre>
  ),
  ul: ({ children, ...props }: ListProps) => (
    <ul className='my-6 ml-6 list-disc [&>li]:mt-2' role='list' {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ListProps) => (
    <ol className='my-6 ml-6 list-decimal [&>li]:mt-2' role='list' {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ListItemProps) => (
    <li className='leading-7' role='listitem' {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: BlockquoteProps) => (
    <blockquote
      className='mt-6 border-l-4 pl-6 italic text-muted-foreground'
      role='blockquote'
      aria-label='Quote'
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: ({ ...props }: SeparatorProps) => (
    <hr
      className='my-4 border-0 border-t'
      role='separator'
      aria-orientation='horizontal'
      {...props}
    />
  ),
  a: ({ children, href, ...props }: LinkProps) => (
    <a
      href={href}
      className='text-primary underline-offset-4 hover:underline inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={href?.startsWith('http') ? `${children} (opens in new tab)` : children}
      {...props}
    >
      {children}
      {href?.startsWith('http') && <ExternalLink className='h-3 w-3' aria-hidden='true' />}
    </a>
  ),
  img: ({ src, alt, width = 800, height = 400, ...props }: ImageProps) => (
    <figure className='my-6'>
      <Image
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        className='rounded-lg border shadow-md w-full max-w-2xl mx-auto'
        loading='lazy'
        {...props}
        role='img'
        aria-describedby={alt ? undefined : `img-desc-${Math.random().toString(36).substr(2, 9)}`}
      />
      {alt && (
        <figcaption className='mt-2 text-sm text-muted-foreground text-center'>{alt}</figcaption>
      )}
    </figure>
  ),
};

// Accessible code block component
function AccessibleCodeBlock({
  children,
  className,
  filename = '',
  language = 'text',
  showCopy = true,
  showDownload = false,
  allowRun = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  filename?: string;
  language?: string;
  showCopy?: boolean;
  showDownload?: boolean;
  allowRun?: boolean;
  id?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');

  const codeText =
    children && typeof children === 'object' && 'props' in children
      ? (children as { props?: { children?: React.ReactNode } }).props?.children || ''
      : children?.toString() || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([codeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      // In a real implementation, this would send code to a sandboxed execution environment
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOutput('Code executed successfully!');
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const blockId = id || `code-block-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className='my-6' role='region' aria-label={`${language} code block`}>
      <div className='relative rounded-lg border bg-gray-900 overflow-hidden'>
        {/* Header */}
        <div
          className='flex items-center justify-between px-4 py-2 text-sm text-gray-400 border-b border-gray-700 bg-gray-800'
          role='toolbar'
          aria-label='Code block tools'
        >
          <div className='flex items-center gap-2'>
            <span className='font-mono' aria-label={`File: ${filename || language}`}>
              {filename || language}
            </span>
            {allowRun && (
              <Badge variant='secondary' className='text-xs' aria-label='Runnable code'>
                Runnable
              </Badge>
            )}
          </div>
          <div className='flex items-center gap-2' role='group' aria-label='Code actions'>
            {allowRun && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleRunCode}
                disabled={isRunning}
                className='h-8 px-2 text-xs'
                aria-label={isRunning ? 'Code is running...' : 'Run code'}
                aria-describedby={isRunning ? undefined : `${blockId}-run-status`}
              >
                {isRunning ? (
                  <>
                    <RotateCcw className='h-3 w-3 mr-1 animate-spin' aria-hidden='true' />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className='h-3 w-3 mr-1' aria-hidden='true' />
                    Run
                  </>
                )}
              </Button>
            )}
            {showDownload && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleDownload}
                className='h-8 px-2 text-xs'
                aria-label={`Download ${filename || `code.${language}`}`}
              >
                <Download className='h-3 w-3 mr-1' aria-hidden='true' />
                Download
              </Button>
            )}
            {showCopy && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleCopy}
                className='h-8 px-2 text-xs'
                aria-label={copied ? 'Code copied!' : 'Copy code'}
                aria-describedby={`${blockId}-copy-status`}
              >
                {copied ? (
                  <>
                    <Check className='h-3 w-3 mr-1' aria-hidden='true' />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className='h-3 w-3 mr-1' aria-hidden='true' />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Code content */}
        <div className='py-4 px-4 overflow-x-auto' role='tabpanel' aria-label='Code content'>
          <pre className='text-gray-100 font-mono text-sm' role='text'>
            <code id={blockId} className={className}>
              {children}
            </code>
          </pre>
        </div>

        {/* Status announcements */}
        <div className='sr-only' aria-live='polite'>
          <div id={`${blockId}-copy-status`}>{copied && 'Code has been copied to clipboard'}</div>
          <div id={`${blockId}-run-status`}>
            {isRunning ? 'Code is currently running...' : null}
            {output && !isRunning ? `Code execution completed: ${output}` : null}
          </div>
        </div>

        {/* Output for runnable code */}
        {allowRun && output && (
          <div
            className='border-t border-gray-700 bg-black p-4'
            role='region'
            aria-label='Code execution output'
          >
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-sm font-medium text-green-400'>Output:</span>
            </div>
            <pre className='text-green-400 font-mono text-sm' role='status'>
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Accessible callout component
function AccessibleCallout({
  type,
  title,
  children,
  icon,
  link,
  id,
}: {
  type: string;
  title?: string;
  children: React.ReactNode;
  icon?: string;
  link?: { url: string; text: string };
  id?: string;
}) {
  const typeStyles = {
    info: 'border-blue-200 bg-blue-50/30 text-blue-900',
    warning: 'border-yellow-200 bg-yellow-50/30 text-yellow-900',
    error: 'border-red-200 bg-red-50/30 text-red-900',
    success: 'border-green-200 bg-green-50/30 text-green-900',
    tip: 'border-purple-200 bg-purple-50/30 text-purple-900',
    note: 'border-gray-200 bg-gray-50/30 text-gray-900',
  };

  const typeIcons = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅',
    tip: '💡',
    note: '📝',
  };

  const style = typeStyles[type as keyof typeof typeStyles] || typeStyles.info;
  const defaultIcon = typeIcons[type as keyof typeof typeIcons] || typeIcons.info;
  const calloutId = id || `callout-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Card
      className={`my-6 ${style}`}
      role='note'
      aria-label={`${type} callout${title ? `: ${title}` : ''}`}
      id={calloutId}
    >
      <CardContent className='p-4'>
        <div className='flex items-start space-x-3'>
          <span className='text-xl flex-shrink-0' aria-hidden='true'>
            {icon || defaultIcon}
          </span>
          <div className='flex-1 min-w-0'>
            {title && <h4 className='font-semibold mb-2'>{title}</h4>}
            <div className='text-sm'>{children}</div>
            {link && (
              <div className='mt-3'>
                <Button variant='outline' size='sm' asChild>
                  <a
                    href={link.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`${link.text} (opens in new tab)`}
                  >
                    <ExternalLink className='h-3 w-3 mr-1' aria-hidden='true' />
                    {link.text}
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Simple content parser for basic markdown without MDX compilation
function parseAccessibleMarkdown(content: string) {
  let processedContent = content;

  // Basic markdown parsing with semantic HTML
  processedContent = processedContent
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>');

  return processedContent;
}

export default function AccessibleMDXRenderer({
  content,
  template,
  enableAdvancedFeatures = true,
  onReadingTimeUpdate,
  onCodeBlockCount,
  fallback,
}: AccessibleMDXRendererProps) {
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
    const processedHTML = parseAccessibleMarkdown(content);

    return (
      <BlogErrorBoundary fallback={MDXErrorFallback}>
        <main className='prose prose-gray max-w-none' role='main'>
          <div dangerouslySetInnerHTML={{ __html: processedHTML }} aria-label='Blog content' />
        </main>
      </BlogErrorBoundary>
    );
  }

  // Load full renderer only when needed
  if (useAdvancedRenderer) {
    return (
      <BlogErrorBoundary fallback={MDXErrorFallback}>
        <main className='prose prose-gray max-w-none' role='main'>
          <Suspense
            fallback={
              fallback || (
                <div className='space-y-4' role='status' aria-label='Loading enhanced content'>
                  <div className='animate-pulse'>
                    <div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
                    <div className='space-y-2'>
                      <div className='h-4 bg-gray-200 rounded'></div>
                      <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                      <div className='h-4 bg-gray-200 rounded w-4/6'></div>
                    </div>
                  </div>
                  <p className='text-sm text-muted-foreground'>Loading enhanced features...</p>
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
        </main>
      </BlogErrorBoundary>
    );
  }

  // Show initial preview with option to load full renderer
  return (
    <BlogErrorBoundary fallback={MDXErrorFallback}>
      <main className='prose prose-gray max-w-none' role='main'>
        <div className='space-y-4'>
          <div role='status' aria-live='polite' className='text-sm text-muted-foreground mb-4'>
            This content uses enhanced features.
            <Button
              variant='outline'
              size='sm'
              onClick={() => setUseAdvancedRenderer(true)}
              className='ml-2'
              aria-label='Load enhanced features for this content'
            >
              Load Enhanced Features
            </Button>
          </div>

          {/* Show basic preview */}
          <div
            className='border-l-4 border-blue-200 pl-4 bg-blue-50/30 p-4 rounded'
            role='note'
            aria-label='Content information'
          >
            <p className='text-sm text-blue-800'>
              This content contains enhanced features like interactive components, syntax
              highlighting, or custom elements. Click to button above to load the full accessible
              experience.
            </p>
          </div>
        </div>
      </main>
    </BlogErrorBoundary>
  );
}
