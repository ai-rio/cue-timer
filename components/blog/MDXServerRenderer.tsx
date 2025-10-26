import { compileMDX } from 'next-mdx-remote/rsc';

import { dedentFrontmatter, processBlogContent } from '@/lib/utils';

import CodeBlock from './CodeBlock';
import FallbackMDXRenderer from './FallbackMDXRenderer';

interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

// Custom components for MDX rendering
const components = {
  h1: ({ children, ...props }: ComponentProps) => (
    <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6' {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentProps) => (
    <h2
      className='scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-4 mt-8 border-b pb-2'
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentProps) => (
    <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6' {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: ComponentProps) => (
    <p className='leading-7 [&:not(:first-child)]:mt-6 text-base' {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: ComponentProps) => (
    <strong className='font-semibold' {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: ComponentProps) => (
    <em className='italic' {...props}>
      {children}
    </em>
  ),
  code: ({ children, className, ...props }: ComponentProps) => {
    const isInline = !className;
    return isInline ? (
      <code
        className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-mono'
        {...props}
      >
        {children}
      </code>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, className, ...props }: ComponentProps) => {
    const language = className?.replace('language-', '') || '';
    return (
      <CodeBlock language={language} className={className} {...props}>
        {children}
      </CodeBlock>
    );
  },
  ul: ({ children, ...props }: ComponentProps) => (
    <ul className='my-6 ml-6 list-disc [&>li]:mt-2' {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentProps) => (
    <ol className='my-6 ml-6 list-decimal [&>li]:mt-2' {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentProps) => (
    <li className='leading-7' {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: ComponentProps) => (
    <blockquote className='mt-6 border-l-2 pl-6 italic text-muted-foreground' {...props}>
      {children}
    </blockquote>
  ),
  hr: ({ ...props }: ComponentProps) => <hr className='my-4 border-0 border-t' {...props} />,
  a: ({ children, href, ...props }: ComponentProps) => (
    <a
      href={href as string}
      className='text-primary underline-offset-4 hover:underline'
      target='_blank'
      rel='noopener noreferrer'
      {...props}
    >
      {children}
    </a>
  ),
  img: ({ src, alt, ...props }: ComponentProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src as string}
      alt={(alt as string) || ''}
      className='rounded-lg border shadow-md w-full max-w-2xl mx-auto my-6'
      loading='lazy'
      {...props}
    />
  ),
};

// Custom components for special syntax
const customComponents = {
  InfoCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className='my-6'>
      <div className='border border-blue-200 bg-blue-50/50 rounded-lg p-4'>
        <h4 className='text-blue-800 font-semibold mb-2'>{title}</h4>
        <div className='text-blue-700'>{children}</div>
      </div>
    </div>
  ),
  TipCard: ({ children }: { children: React.ReactNode }) => (
    <div className='my-6'>
      <div className='border border-green-200 bg-green-50/50 rounded-lg p-4'>
        <h4 className='text-green-800 font-semibold mb-2'>💡 Pro Tip</h4>
        <div className='text-green-700'>{children}</div>
      </div>
    </div>
  ),
  WarningCard: ({ children }: { children: React.ReactNode }) => (
    <div className='my-6'>
      <div className='border border-yellow-200 bg-yellow-50/50 rounded-lg p-4'>
        <h4 className='text-yellow-800 font-semibold mb-2'>⚠️ Important</h4>
        <div className='text-yellow-700'>{children}</div>
      </div>
    </div>
  ),
  CalloutCard: ({ type, children }: { type: string; children: React.ReactNode }) => {
    const typeStyles = {
      info: 'border-blue-200 bg-blue-50/50 text-blue-800',
      warning: 'border-yellow-200 bg-yellow-50/50 text-yellow-800',
      error: 'border-red-200 bg-red-50/50 text-red-800',
      success: 'border-green-200 bg-green-50/50 text-green-800',
    };

    const typeIcons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
    };

    const style = typeStyles[type as keyof typeof typeStyles] || typeStyles.info;
    const icon = typeIcons[type as keyof typeof typeIcons] || typeIcons.info;

    return (
      <div className='my-6'>
        <div className={`border ${style} rounded-lg p-4`}>
          <div className='flex items-start space-x-3'>
            <span className='text-xl'>{icon}</span>
            <div className='flex-1'>{children}</div>
          </div>
        </div>
      </div>
    );
  },
  Tag: ({ label }: { label: string }) => (
    <span className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground mr-2 mb-2'>
      #{label}
    </span>
  ),
};

// Process content to handle custom syntax and frontmatter issues
function processCustomSyntax(content: string): string {
  let processedContent = content;

  // Fix frontmatter indentation using the dedent utility
  processedContent = dedentFrontmatter(processedContent);

  // Process info cards: {{info:Title}}Content{{/info}}
  processedContent = processedContent.replace(
    /\{\{info:([^}]+)\}\}([\s\S]*?)\{\{\/info\}\}/g,
    (_, title, content) => `<InfoCard title="${title}">${content}</InfoCard>`
  );

  // Process tip cards: {{tip}}Content{{/tip}}
  processedContent = processedContent.replace(
    /\{\{tip\}\}([\s\S]*?)\{\{\/tip\}\}/g,
    (_, content) => `<TipCard>${content}</TipCard>`
  );

  // Process warning cards: {{warning}}Content{{/warning}}
  processedContent = processedContent.replace(
    /\{\{warning\}\}([\s\S]*?)\{\{\/warning\}\}/g,
    (_, content) => `<WarningCard>${content}</WarningCard>`
  );

  // Process callouts: {{callout:type}}Content{{/callout}}
  processedContent = processedContent.replace(
    /\{\{callout:([^}]+)\}\}([\s\S]*?)\{\{\/callout\}\}/g,
    (_, type, content) => `<CalloutCard type="${type}">${content}</CalloutCard>`
  );

  // Process tags: {{tag:label}}
  processedContent = processedContent.replace(
    /\{\{tag:([^}]+)\}\}/g,
    (_, label) => `<Tag label="${label}" />`
  );

  return processedContent;
}

// Server Component that compiles MDX
export default async function MDXServerRenderer({ content }: { content: string }) {
  const processedContent = processBlogContent(processCustomSyntax(content));

  try {
    const { content: mdxContent } = await compileMDX({
      source: processedContent,
      components: { ...components, ...customComponents },
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [],
        },
      },
    });

    return mdxContent;
  } catch (error) {
    // Enhanced error logging with proper serialization for Server Components
    let errorMessage = 'Unknown error';
    let errorStack = undefined;
    let errorType = 'Unknown';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack;
      errorType = error.constructor.name;
    } else if (typeof error === 'string') {
      errorMessage = error;
      errorType = 'String';
    } else if (error && typeof error === 'object') {
      // Handle cases where error is an object but not an Error instance
      errorMessage = (error as { message?: string }).message || JSON.stringify(error);
      errorType = (error as { constructor?: { name?: string } }).constructor?.name || 'Object';
    }

    const errorDetails = {
      type: errorType,
      message: errorMessage,
      stack: errorStack,
      contentLength: content.length,
      hasCustomSyntax: /{{(info|tip|warning|callout|tag)}}/.test(content),
      hasFrontmatter: content.trimStart().startsWith('---'),
      frontmatterIndented: !content.startsWith('---') && content.includes('---'),
      timestamp: new Date().toISOString(),
    };

    // Log error details as JSON for proper serialization
    console.error('MDX compilation error:', JSON.stringify(errorDetails, null, 2));

    // Also log the raw error for debugging
    console.error('Raw error object:', error);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // reportError(errorDetails);
    }

    // Check for specific error patterns and handle accordingly
    const isFrontmatterError =
      errorMessage.includes('frontmatter') ||
      errorMessage.includes('yaml') ||
      errorDetails.frontmatterIndented;

    const isMDXCompilationError =
      errorMessage.includes('start') ||
      errorMessage.includes('next-mdx-remote') ||
      errorMessage.includes('MDX') ||
      errorMessage.includes('compile');

    if (isFrontmatterError) {
      console.warn('Falling back due to frontmatter parsing error - attempting to fix indentation');
      // Try to fix frontmatter indentation automatically (additional fallback)
      const fixedContent = dedentFrontmatter(content);
      if (fixedContent !== content) {
        console.warn(
          'Automatically fixed frontmatter indentation with dedent utility, retrying compilation'
        );
        try {
          const { content: fixedMdxContent } = await compileMDX({
            source: processCustomSyntax(fixedContent),
            components: { ...components, ...customComponents },
            options: {
              parseFrontmatter: true,
              mdxOptions: {
                remarkPlugins: [],
                rehypePlugins: [],
              },
            },
          });
          return fixedMdxContent;
        } catch {
          console.warn('Auto-fix with dedent utility failed, falling back to basic renderer');
        }
      }
      return <FallbackMDXRenderer content={content} />;
    }

    if (isMDXCompilationError) {
      console.warn('Falling back to basic MDX renderer due to MDX compilation error');
      return <FallbackMDXRenderer content={content} />;
    }

    // Throw the error to be caught by the error boundary
    throw error instanceof Error ? error : new Error('MDX compilation failed');
  }
}
