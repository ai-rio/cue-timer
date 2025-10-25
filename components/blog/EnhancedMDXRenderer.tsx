'use client';

import { Check, ChevronRight, Copy, Download, ExternalLink, Play, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { Suspense, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import BlogErrorBoundary, { MDXErrorFallback } from './BlogErrorBoundary';

// Lazy load heavy dependencies (commented out - not currently used)
// const SyntaxHighlighter = lazy(() =>
//   import('react-syntax-highlighter').then((module) => ({
//     default: module.Prism,
//   }))
// );
// const darkTheme = lazy(() =>
//   import('react-syntax-highlighter/dist/esm/styles/prism').then((module) => ({
//     default: module.vscDarkPlus as Record<string, unknown>,
//   }))
// );
const loadCompileMDX = () => import('next-mdx-remote/rsc').then((module) => module.compileMDX);
const loadRehypePlugins = async () => {
  const [rehypeHighlight, rehypePrismPlus] = await Promise.all([
    import('rehype-highlight'),
    import('rehype-prism-plus'),
  ]);
  return [rehypeHighlight.default, rehypePrismPlus.default];
};

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
  'aria-label'?: string;
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
}

interface CodeProps extends Omit<MDXComponentProps, 'role'> {
  className?: string;
  filename?: string;
}

type PreProps = Omit<MDXComponentProps, 'role'>;

type ListProps = Omit<MDXComponentProps, 'role'>;

type ListItemProps = Omit<MDXComponentProps, 'role'>;

type BlockquoteProps = Omit<MDXComponentProps, 'role'>;

type SeparatorProps = Omit<MDXComponentProps, 'role'>;

interface EnhancedMDXRendererProps {
  content: string;
  template?: string;
  enableAdvancedFeatures?: boolean;
  onReadingTimeUpdate?: (time: number) => void;
  onCodeBlockCount?: (count: number) => void;
}

// Enhanced components for template-specific features
const templateComponents = {
  // Timing guide specific components
  TimerSetup: ({ duration, title }: { duration: string; title: string }) => (
    <Card className='my-6 border-blue-200 bg-blue-50/30'>
      <CardContent className='p-4'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-blue-100 rounded-lg'>
            <Play className='h-5 w-5 text-blue-600' />
          </div>
          <div>
            <h4 className='font-semibold text-blue-900'>{title}</h4>
            <p className='text-sm text-blue-700'>Recommended duration: {duration}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),

  // Case study specific components
  MetricCard: ({
    label,
    value,
    trend,
  }: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card className='my-6'>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-muted-foreground'>{label}</p>
            <p className='text-2xl font-bold'>{value}</p>
          </div>
          {trend && (
            <Badge
              variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}
              className='ml-2'
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trend}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  ),

  // Feature announcement specific components
  FeatureHighlight: ({ feature, description }: { feature: string; description: string }) => (
    <Card className='my-6 border-purple-200 bg-purple-50/30'>
      <CardContent className='p-4'>
        <div className='flex items-start gap-3'>
          <div className='p-2 bg-purple-100 rounded-lg'>
            <ChevronRight className='h-5 w-5 text-purple-600' />
          </div>
          <div>
            <h4 className='font-semibold text-purple-900'>{feature}</h4>
            <p className='text-sm text-purple-700'>{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),

  // Tips specific components
  ProTip: ({
    children,
    level,
  }: {
    children: React.ReactNode;
    level?: 'beginner' | 'intermediate' | 'advanced';
  }) => {
    const levelColors = {
      beginner: 'border-green-200 bg-green-50/30',
      intermediate: 'border-yellow-200 bg-yellow-50/30',
      advanced: 'border-red-200 bg-red-50/30',
    };

    const levelIcons = {
      beginner: '💡',
      intermediate: '⚡',
      advanced: '🚀',
    };

    return (
      <Card className={`my-6 ${levelColors[level || 'beginner']}`}>
        <CardContent className='p-4'>
          <div className='flex items-start gap-3'>
            <span className='text-xl'>{levelIcons[level || 'beginner']}</span>
            <div>
              <h4 className='font-semibold'>
                Pro Tip{' '}
                {level && (
                  <Badge variant='outline' className='ml-2 text-xs'>
                    {level}
                  </Badge>
                )}
              </h4>
              <div className='text-sm mt-1'>{children}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },

  // Common mistakes component
  CommonMistake: ({ mistake, solution }: { mistake: string; solution: string }) => (
    <Card className='my-6 border-red-200 bg-red-50/30'>
      <CardContent className='p-4'>
        <div className='space-y-3'>
          <div className='flex items-start gap-2'>
            <span className='text-red-500 text-xl'>❌</span>
            <div>
              <h4 className='font-semibold text-red-900'>Common Mistake</h4>
              <p className='text-sm text-red-700'>{mistake}</p>
            </div>
          </div>
          <Separator />
          <div className='flex items-start gap-2'>
            <span className='text-green-500 text-xl'>✅</span>
            <div>
              <h4 className='font-semibold text-green-900'>Solution</h4>
              <p className='text-sm text-green-700'>{solution}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Enhanced code block component with copy/download functionality
function EnhancedCodeBlock({
  children,
  className,
  filename = '',
  showCopy = true,
  showDownload = false,
  allowRun = false,
}: {
  children: React.ReactNode;
  className?: string;
  filename?: string;
  showCopy?: boolean;
  showDownload?: boolean;
  allowRun?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');

  const language = className?.replace('language-', '') || 'text';
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

  return (
    <div className='my-6'>
      <div className='relative rounded-lg border bg-gray-900 overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-2 text-sm text-gray-400 border-b border-gray-700 bg-gray-800'>
          <div className='flex items-center gap-2'>
            <span className='font-mono'>{filename || language}</span>
            {allowRun && (
              <Badge variant='secondary' className='text-xs'>
                Runnable
              </Badge>
            )}
          </div>
          <div className='flex items-center gap-2'>
            {allowRun && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleRunCode}
                disabled={isRunning}
                className='h-8 px-2 text-xs'
              >
                {isRunning ? (
                  <>
                    <RotateCcw className='h-3 w-3 mr-1 animate-spin' />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className='h-3 w-3 mr-1' />
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
              >
                <Download className='h-3 w-3 mr-1' />
                Download
              </Button>
            )}
            {showCopy && (
              <Button variant='ghost' size='sm' onClick={handleCopy} className='h-8 px-2 text-xs'>
                {copied ? (
                  <>
                    <Check className='h-3 w-3 mr-1' />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className='h-3 w-3 mr-1' />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Code content */}
        <pre className='py-4 px-4 overflow-x-auto'>
          <code className={className}>{children}</code>
        </pre>

        {/* Output for runnable code */}
        {allowRun && output && (
          <div className='border-t border-gray-700 bg-black p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-sm font-medium text-green-400'>Output:</span>
            </div>
            <pre className='text-green-400 font-mono text-sm'>{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced custom components with new features
const enhancedCustomComponents = {
  ...templateComponents,

  // Enhanced callout with more types
  CalloutCard: ({
    type,
    title,
    children,
    icon,
    link,
  }: {
    type: string;
    title?: string;
    children: React.ReactNode;
    icon?: string;
    link?: { url: string; text: string };
  }) => {
    const typeStyles = {
      info: 'border-blue-200 bg-blue-50/30',
      warning: 'border-yellow-200 bg-yellow-50/30',
      error: 'border-red-200 bg-red-50/30',
      success: 'border-green-200 bg-green-50/30',
      tip: 'border-purple-200 bg-purple-50/30',
      note: 'border-gray-200 bg-gray-50/30',
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

    return (
      <Card className={`my-6 ${style}`}>
        <CardContent className='p-4'>
          <div className='flex items-start space-x-3'>
            <span className='text-xl flex-shrink-0'>{icon || defaultIcon}</span>
            <div className='flex-1 min-w-0'>
              {title && <h4 className='font-semibold mb-2'>{title}</h4>}
              <div className='text-sm'>{children}</div>
              {link && (
                <div className='mt-3'>
                  <Button variant='outline' size='sm' asChild>
                    <a href={link.url} target='_blank' rel='noopener noreferrer'>
                      <ExternalLink className='h-3 w-3 mr-1' />
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
  },

  // Interactive component for steps
  StepIndicator: ({
    number,
    title,
    status = 'pending',
  }: {
    number: number;
    title: string;
    status?: 'pending' | 'current' | 'completed';
  }) => {
    const statusStyles = {
      pending: 'border-gray-300 bg-gray-50',
      current: 'border-blue-500 bg-blue-50',
      completed: 'border-green-500 bg-green-50',
    };

    const statusIcons = {
      pending: '⭕',
      current: '🔵',
      completed: '✅',
    };

    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg border ${statusStyles[status]}`}>
        <div className='flex items-center justify-center w-8 h-8 rounded-full border-2 border-current'>
          <span className='text-sm font-bold'>{number}</span>
        </div>
        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <h4 className='font-medium'>{title}</h4>
            <span className='text-sm'>{statusIcons[status]}</span>
          </div>
        </div>
      </div>
    );
  },

  // Progress tracker for tutorials
  ProgressTracker: ({
    current,
    total,
    steps,
  }: {
    current: number;
    total: number;
    steps: Array<{ title: string; completed: boolean }>;
  }) => {
    const percentage = (current / total) * 100;

    return (
      <Card className='my-6'>
        <CardContent className='p-4'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h4 className='font-medium'>Your Progress</h4>
              <span className='text-sm text-muted-foreground'>
                {current} of {total} completed ({Math.round(percentage)}%)
              </span>
            </div>

            {/* Progress bar */}
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-primary h-2 rounded-full transition-all duration-300'
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Step list */}
            <div className='space-y-2'>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded ${
                    step.completed
                      ? 'bg-green-50 border border-green-200'
                      : index === current - 1
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      step.completed
                        ? 'bg-green-500 text-white'
                        : index === current - 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <span className='text-sm'>{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
};

// Process enhanced custom syntax
function processEnhancedCustomSyntax(content: string): string {
  let processedContent = content;

  // Process timer setup: {{timer:Duration|Title}}Content{{/timer}}
  processedContent = processedContent.replace(
    /\{\{timer:([^|]+)\|([^}]+)\}\}([\s\S]*?)\{\{\/timer\}\}/g,
    (_, duration, title, content) =>
      `<TimerSetup duration="${duration.trim()}" title="${title.trim()}">${content}</TimerSetup>`
  );

  // Process metric cards: {{metric:Label|Value|trend}}Content{{/metric}}
  processedContent = processedContent.replace(
    /\{\{metric:([^|]+)\|([^|]+)(?:\|([^}]*))?\}\}([\s\S]*?)\{\{\/metric\}\}/g,
    (_, label, value, trend, content) =>
      `<MetricCard label="${label.trim()}" value="${value.trim()}" trend="${(trend || 'neutral').trim()}">${content}</MetricCard>`
  );

  // Process feature highlights: {{feature:Title|Description}}Content{{/feature}}
  processedContent = processedContent.replace(
    /\{\{feature:([^|]+)\|([^}]+)\}\}([\s\S]*?)\{\{\/feature\}\}/g,
    (_, feature, description, content) =>
      `<FeatureHighlight feature="${feature.trim()}" description="${description.trim()}">${content}</FeatureHighlight>`
  );

  // Process pro tips: {{tip:level}}Content{{/tip}}
  processedContent = processedContent.replace(
    /\{\{tip:([^}]*)\}\}([\s\S]*?)\{\{\/tip\}\}/g,
    (_, level, content) => `<ProTip level="${level || 'beginner'}">${content}</ProTip>`
  );

  // Process common mistakes: {{mistake|Mistake description}}Solution{{/mistake}}
  processedContent = processedContent.replace(
    /\{\{mistake:([^}]+)\}\}([^]*?)\{\{\/mistake\}\}/g,
    (_: string, mistake: string, content: string) =>
      `<CommonMistake mistake="${mistake.trim()}" solution="${content.trim()}"></CommonMistake>`
  );

  // Process enhanced callouts: {{callout:type|title|icon|link:text|link:url}}Content{{/callout}}
  processedContent = processedContent.replace(
    /\{\{callout:([^|]+)(?:\|([^|]*))?(?:\|([^|]*))?(?:\|link:([^|]+)\|([^}]*))?\}\}([\s\S]*?)\{\{\/callout\}\}/g,
    (_, type, title, icon, linkText, linkUrl, content) => {
      let attrs = `type="${type.trim()}"`;
      if (title) attrs += ` title="${title.trim()}"`;
      if (icon) attrs += ` icon="${icon.trim()}"`;
      if (linkText && linkUrl) {
        attrs += ` link="{\\"text\\": \\"${linkText.trim()}\\", \\"url\\": \\"${linkUrl.trim()}\\"}"`;
      }
      return `<CalloutCard ${attrs}>${content}</CalloutCard>`;
    }
  );

  // Process step indicators: {{step:number|title|status}}Content{{/step}}
  processedContent = processedContent.replace(
    /\{\{step:([^|]+)\|([^|]+)(?:\|([^}]*))?\}\}([\s\S]*?)\{\{\/step\}\}/g,
    (_, number, title, status, content) =>
      `<StepIndicator number="${parseInt(number.trim())}" title="${title.trim()}" status="${(status || 'pending').trim()}">${content}</StepIndicator>`
  );

  // Process progress trackers: {{progress:current|total|step1;step2;step3}}Content{{/progress}}
  processedContent = processedContent.replace(
    /\{\{progress:([^|]+)\|([^|]+)\|([^}]+)\}\}([\s\S]*?)\{\{\/progress\}\}/g,
    (_, current, total, stepsStr, content) => {
      const steps = stepsStr.split(';').map((step: string) => {
        const [title, status = 'pending'] = step.split(':');
        return {
          title: title?.trim() || '',
          completed: status.trim() === 'completed',
        };
      });

      return `<ProgressTracker current="${parseInt(current.trim())}" total="${parseInt(total.trim())}" steps='${JSON.stringify(steps)}'>${content}</ProgressTracker>`;
    }
  );

  return processedContent;
}

// Base components with enhanced features
const baseComponents = {
  h1: ({ children, ...props }: TextProps) => (
    <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6' {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: TextProps) => (
    <h2
      className='scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-4 mt-8 border-b pb-2'
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: TextProps) => (
    <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6' {...props}>
      {children}
    </h3>
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
  code: ({ children, className, filename, ...props }: CodeProps) => {
    const isInline = !className;
    return isInline ? (
      <code
        className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-mono'
        {...props}
      >
        {children}
      </code>
    ) : (
      <EnhancedCodeBlock
        className={className}
        filename={filename}
        showCopy={true}
        showDownload={true}
      >
        {children}
      </EnhancedCodeBlock>
    );
  },
  pre: ({ children }: PreProps) => children,
  ul: ({ children, ...props }: ListProps) => (
    <ul className='my-6 ml-6 list-disc [&>li]:mt-2' {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ListProps) => (
    <ol className='my-6 ml-6 list-decimal [&>li]:mt-2' {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ListItemProps) => (
    <li className='leading-7' {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: BlockquoteProps) => (
    <blockquote className='mt-6 border-l-2 pl-6 italic text-muted-foreground' {...props}>
      {children}
    </blockquote>
  ),
  hr: ({ ...props }: SeparatorProps) => <hr className='my-4 border-0 border-t' {...props} />,
  a: ({ children, href, ...props }: LinkProps) => (
    <a
      href={href}
      className='text-primary underline-offset-4 hover:underline inline-flex items-center gap-1'
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
      {href?.startsWith('http') && <ExternalLink className='h-3 w-3' />}
    </a>
  ),
  img: ({ src, alt, width = 800, height = 400, ...props }: ImageProps) => (
    <Image
      src={src}
      alt={alt || ''}
      width={width}
      height={height}
      className='rounded-lg border shadow-md w-full max-w-2xl mx-auto my-6'
      loading='lazy'
      {...props}
    />
  ),
};

async function EnhancedMDXContent({
  content,
  template,
  onReadingTimeUpdate,
  onCodeBlockCount,
}: {
  content: string;
  template?: string;
  onReadingTimeUpdate?: (time: number) => void;
  onCodeBlockCount?: (count: number) => void;
}) {
  const processedContent = processEnhancedCustomSyntax(content);

  // Calculate reading time
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

  try {
    const compileMDX = await loadCompileMDX();
    const [rehypeHighlight, rehypePrismPlus] = await loadRehypePlugins();
    const { content: mdxContent } = await compileMDX({
      source: processedContent,
      components: {
        ...baseComponents,
        ...enhancedCustomComponents,
      },
      options: {
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [rehypeHighlight as unknown, rehypePrismPlus as unknown],
        },
      },
    });

    return mdxContent;
  } catch (error) {
    // Enhanced error logging
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      contentLength: content.length,
      hasCustomSyntax: /{{(timer|metric|feature|tip|mistake|callout|step|progress)}}/.test(content),
      template: template || 'unknown',
      timestamp: new Date().toISOString(),
    };

    console.error('Enhanced MDX compilation error:', errorDetails);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // reportError(errorDetails);
    }

    // Throw error to be caught by error boundary
    throw error instanceof Error ? error : new Error('Enhanced MDX compilation failed');
  }
}

export default function EnhancedMDXRenderer({
  content,
  template,
  enableAdvancedFeatures: _enableAdvancedFeatures = true,
  onReadingTimeUpdate,
  onCodeBlockCount,
}: EnhancedMDXRendererProps) {
  // const components = useMemo(
  //   () =>
  //     enableAdvancedFeatures ? { ...baseComponents, ...enhancedCustomComponents } : baseComponents,
  //   [enableAdvancedFeatures]
  // );

  return (
    <BlogErrorBoundary fallback={MDXErrorFallback}>
      <div className='prose prose-gray max-w-none'>
        <Suspense fallback={<div className='animate-pulse'>Loading enhanced content...</div>}>
          <EnhancedMDXContent
            content={content}
            template={template}
            onReadingTimeUpdate={onReadingTimeUpdate}
            onCodeBlockCount={onCodeBlockCount}
          />
        </Suspense>
      </div>
    </BlogErrorBoundary>
  );
}
