'use client';

import { compileMDX } from 'next-mdx-remote/rsc';
import { Suspense } from 'react';

import BlogErrorBoundary, { MDXErrorFallback } from './BlogErrorBoundary';

interface FallbackMDXRendererProps {
  content: string;
}

// Basic components without syntax highlighting
const fallbackComponents = {
  h1: ({ children, ...props }: { children?: React.ReactNode; className?: string }) => (
    <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6' {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: { children?: React.ReactNode; className?: string }) => (
    <h2
      className='scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-4 mt-8 border-b pb-2'
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: { children?: React.ReactNode; className?: string }) => (
    <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6' {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: { children?: React.ReactNode; className?: string }) => (
    <p className='leading-7 [&:not(:first-child)]:mt-6 text-base' {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: { children?: React.ReactNode; className?: string }) => (
    <strong className='font-semibold' {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: { children?: React.ReactNode; className?: string }) => (
    <em className='italic' {...props}>
      {children}
    </em>
  ),
  code: ({ children, className, ...props }: { children?: React.ReactNode; className?: string }) => {
    const isInline = !className;
    return isInline ? (
      <code
        className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-mono'
        {...props}
      >
        {children}
      </code>
    ) : (
      <code
        className='block bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono'
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: { children?: React.ReactNode; className?: string }) => (
    <pre className='mb-4 mt-6 overflow-x-auto rounded-lg border bg-black p-4 text-white' {...props}>
      {children}
    </pre>
  ),
  ul: ({ children, ...props }: { children?: React.ReactNode; className?: string }) => (
    <ul className='my-6 ml-6 list-disc [&>li]:mt-2' {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: { children?: React.ReactNode; className?: string }) => (
    <ol className='my-6 ml-6 list-decimal [&>li]:mt-2' {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: { children?: React.ReactNode; className?: string }) => (
    <li className='leading-7' {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: { children?: React.ReactNode; className?: string }) => (
    <blockquote className='mt-6 border-l-2 pl-6 italic text-muted-foreground' {...props}>
      {children}
    </blockquote>
  ),
  hr: ({ ...props }: { className?: string }) => (
    <hr className='my-4 border-0 border-t' {...props} />
  ),
  a: ({
    children,
    href,
    ...props
  }: {
    children?: React.ReactNode;
    href?: string;
    className?: string;
  }) => (
    <a
      href={href}
      className='text-primary underline-offset-4 hover:underline'
      target='_blank'
      rel='noopener noreferrer'
      {...props}
    >
      {children}
    </a>
  ),
  img: ({ src, alt, ...props }: { src?: string; alt?: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ''}
      className='rounded-lg border shadow-md w-full max-w-2xl mx-auto my-6'
      loading='lazy'
      {...props}
    />
  ),
};

async function FallbackMDXContent({ content }: { content: string }) {
  try {
    const { content: mdxContent } = await compileMDX({
      source: content,
      components: fallbackComponents,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [], // No syntax highlighting plugins
        },
      },
    });

    return mdxContent;
  } catch (error) {
    console.error('Fallback MDX compilation error:', error);

    // If even the fallback fails, try to process basic markdown manually
    try {
      // Simple markdown processing for basic formatting
      let processedContent = content;

      // Remove frontmatter if it exists
      processedContent = processedContent.replace(/^---[\s\S]*?---\n/, '');

      // Basic markdown to HTML conversion
      processedContent = processedContent
        .replace(
          /^# (.*$)/gim,
          '<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">$1</h1>'
        )
        .replace(
          /^## (.*$)/gim,
          '<h2 class="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-4 mt-8 border-b pb-2">$1</h2>'
        )
        .replace(
          /^### (.*$)/gim,
          '<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6">$1</h3>'
        )
        .replace(/\*\*(.*?)\*\*/g, '<strong className="font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em className="italic">$1</em>')
        .replace(/\n\n/g, '</p><p className="leading-7 [&:not(:first-child)]:mt-6 text-base">')
        .replace(/^/, '<p className="leading-7 [&:not(:first-child)]:mt-6 text-base">')
        .replace(/$/, '</p>');

      return (
        <div className='prose prose-gray max-w-none'>
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        </div>
      );
    } catch (processingError) {
      console.error('Markdown processing error:', processingError);

      // Final fallback: plain text
      return (
        <div className='prose prose-gray max-w-none'>
          <div className='whitespace-pre-wrap text-sm text-gray-600'>{content}</div>
        </div>
      );
    }
  }
}

export default function FallbackMDXRenderer({ content }: FallbackMDXRendererProps) {
  return (
    <BlogErrorBoundary fallback={MDXErrorFallback}>
      <div className='prose prose-gray max-w-none'>
        <Suspense fallback={<div className='animate-pulse'>Loading content...</div>}>
          <FallbackMDXContent content={content} />
        </Suspense>
      </div>
    </BlogErrorBoundary>
  );
}
