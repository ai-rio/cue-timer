# Chunk 10: components_components

## Metadata

- **Files**: 4
- **Size**: 28,203 characters (~7,050 tokens)
- **Categories**: components

## Files in this chunk

- `components/blog/LanguageSelector.tsx`
- `components/blog/MDXRenderer.tsx`
- `components/blog/OptimizedMDXRenderer.tsx`
- `components/blog/RelatedPosts.tsx`

---

## File: `components/blog/LanguageSelector.tsx`

```tsx
'use client';

import { Check, ChevronDown, Globe } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  isRTL?: boolean;
}

interface LanguageSelectorProps {
  currentLanguage: string;
  availableLanguages: string[];
  onLanguageChange: (language: string) => void;
  showFlag?: boolean;
  compact?: boolean;
  variant?: 'dropdown' | 'popover';
  className?: string;
}

// Language configurations
const LANGUAGE_CONFIGS: Record<string, LanguageOption> = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
  'pt-br': {
    code: 'pt-br',
    name: 'Português',
    flag: '🇧🇷',
  },
  es: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
  },
  de: {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
  },
  ja: {
    code: 'ja',
    name: '日本語',
    flag: '🇯🇵',
  },
  'zh-cn': {
    code: 'zh-cn',
    name: '简体中文',
    flag: '🇨🇳',
  },
};

interface TranslationStatus {
  language: string;
  status: 'complete' | 'in-progress' | 'missing' | 'outdated';
  wordCount?: number;
  lastUpdated?: string;
  translator?: string;
}

interface LanguageStatusProps {
  currentSlug: string;
  availableTranslations: TranslationStatus[];
  onLanguageSelect: (language: string) => void;
  className?: string;
}

function LanguageStatus({
  currentSlug: _currentSlug,
  availableTranslations,
  onLanguageSelect,
  className = '',
}: LanguageStatusProps) {
  const currentLanguage =
    availableTranslations.find((t) => t.language === 'en')?.language || 'en';

  const getStatusColor = (status: TranslationStatus['status']) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'outdated':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'missing':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: TranslationStatus['status']) => {
    switch (status) {
      case 'complete':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'outdated':
        return '⚠️';
      case 'missing':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='flex items-center gap-2 mb-3'>
        <Globe className='h-5 w-5' />
        <h3 className='font-semibold'>Available Languages</h3>
        <Badge variant='secondary' className='ml-2'>
          {availableTranslations.length} languages
        </Badge>
      </div>

      <div className='grid gap-3'>
        {availableTranslations.map((translation) => {
          const config =
            LANGUAGE_CONFIGS[translation.language] || LANGUAGE_CONFIGS['en']!;
          const isActive = translation.language === currentLanguage;

          return (
            <div
              key={translation.language}
              className={`border rounded-lg p-4 cursor-pointer transition-colors hover:border-primary ${
                isActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => onLanguageSelect(translation.language)}
            >
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>{config?.flag || ''}</span>
                  <span className='font-medium'>{config?.name || ''}</span>
                  {isActive && <Check className='h-4 w-4 text-primary ml-2' />}
                </div>

                <Badge
                  variant='outline'
                  className={`text-xs ${getStatusColor(translation.status)}`}
                >
                  <span className='mr-1'>
                    {getStatusIcon(translation.status)}
                  </span>
                  {translation.status.replace('-', ' ')}
                </Badge>
              </div>

              {/* Translation details */}
              <div className='text-sm text-muted-foreground space-y-1'>
                {translation.wordCount && (
                  <p>{translation.wordCount.toLocaleString()} words</p>
                )}
                {translation.lastUpdated && (
                  <p>
                    Updated{' '}
                    {new Date(translation.lastUpdated).toLocaleDateString()}
                  </p>
                )}
                {translation.translator && (
                  <p>Translated by {translation.translator}</p>
                )}
              </div>

              {/* Translation action button */}
              {isActive && (
                <div className='mt-3'>
                  <Button size='sm' variant='outline' className='w-full'>
                    View {config.name} Version
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LanguageSelector({
  currentLanguage,
  availableLanguages,
  onLanguageChange,
  showFlag = true,
  compact = false,
  variant = 'dropdown',
  className = '',
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentConfig = useMemo(
    () => LANGUAGE_CONFIGS[currentLanguage] || LANGUAGE_CONFIGS['en']!,
    [currentLanguage]
  );

  const availableConfigs = useMemo(
    () =>
      availableLanguages
        .map((lang) => LANGUAGE_CONFIGS[lang])
        .filter((config): config is NonNullable<typeof config> =>
          Boolean(config)
        ),
    [availableLanguages]
  );

  if (compact) {
    return (
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 ${className}`}
      >
        {showFlag && <span>{currentConfig?.flag || ''}</span>}
        <span>{currentConfig?.name || ''}</span>
        <ChevronDown className='h-4 w-4' />
      </Button>
    );
  }

  if (variant === 'popover') {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={`flex items-center gap-2 ${className}`}
          >
            {showFlag && <span>{currentConfig?.flag || ''}</span>}
            <span>{currentConfig?.name || ''}</span>
            <ChevronDown className='h-4 w-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-56 p-0'>
          <div className='max-h-96 overflow-y-auto'>
            {availableConfigs.map((config) => (
              <button
                key={config.code}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent transition-colors ${
                  config.code === currentLanguage ? 'bg-accent' : ''
                }`}
                onClick={() => {
                  onLanguageChange(config.code);
                  setIsOpen(false);
                }}
              >
                <span className='text-lg'>{config?.flag || ''}</span>
                <span>{config?.name || ''}</span>
                {config.code === currentLanguage && (
                  <Check className='h-4 w-4 ml-auto text-primary' />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Dropdown variant (default)
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className={`flex items-center gap-2 ${className}`}
        >
          {showFlag && <span>{currentConfig?.flag || ''}</span>}
          <span>{currentConfig?.name || ''}</span>
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        {availableConfigs.map((config) => (
          <DropdownMenuItem
            key={config.code}
            onClick={() => {
              onLanguageChange(config.code);
              setIsOpen(false);
            }}
            className='flex items-center gap-3 cursor-pointer'
          >
            <span className='text-lg'>{config?.flag || ''}</span>
            <span>{config?.name || ''}</span>
            {config.code === currentLanguage && (
              <Check className='h-4 w-4 ml-auto text-primary' />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export language status component for detailed language views
export { LanguageStatus };

// Export language configurations for use in other components
export { LANGUAGE_CONFIGS };
export type { LanguageOption, TranslationStatus };
```

## File: `components/blog/MDXRenderer.tsx`

```tsx
'use client';

import { compileMDX } from 'next-mdx-remote/rsc';
import { Suspense } from 'react';
import rehypeHighlight from 'rehype-highlight';
import rehypePrismPlus from 'rehype-prism-plus';

import BlogErrorBoundary, { MDXErrorFallback } from './BlogErrorBoundary';

interface MDXRendererProps {
  content: string;
}

interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

// Custom components for MDX rendering
const components = {
  h1: ({ children, ...props }: ComponentProps) => (
    <h1
      className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'
      {...props}
    >
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
    <h3
      className='scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6'
      {...props}
    >
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
      <div className='mb-4 mt-6 overflow-x-auto rounded-lg border bg-black'>
        <div className='flex items-center justify-between px-4 py-2 text-sm text-gray-400 border-b border-gray-700'>
          <span className='font-mono'>{language || 'text'}</span>
          <button
            className='px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors'
            onClick={() => {
              const codeText =
                typeof children === 'object' && children && 'props' in children
                  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (children as any).props?.children || ''
                  : String(children);
              navigator.clipboard.writeText(codeText);
            }}
          >
            Copy
          </button>
        </div>
        <pre className='py-4 px-4 text-white overflow-x-auto' {...props}>
          {children}
        </pre>
      </div>
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
    <blockquote
      className='mt-6 border-l-2 pl-6 italic text-muted-foreground'
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: ({ ...props }: ComponentProps) => (
    <hr className='my-4 border-0 border-t' {...props} />
  ),
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
  InfoCard: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
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
  CalloutCard: ({
    type,
    children,
  }: {
    type: string;
    children: React.ReactNode;
  }) => {
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

    const style =
      typeStyles[type as keyof typeof typeStyles] || typeStyles.info;
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

// Process content to handle custom syntax
function processCustomSyntax(content: string): string {
  let processedContent = content;

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

async function MDXContent({ content }: { content: string }) {
  const processedContent = processCustomSyntax(content);

  try {
    const { content: mdxContent } = await compileMDX({
      source: processedContent,
      components: { ...components, ...customComponents },
      options: {
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [rehypeHighlight, rehypePrismPlus],
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
      hasCustomSyntax: /{{(info|tip|warning|callout|tag)}}/.test(content),
      timestamp: new Date().toISOString(),
    };

    console.error('MDX compilation error:', errorDetails);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // reportError(errorDetails);
    }

    // Throw the error to be caught by the error boundary
    throw error instanceof Error ? error : new Error('MDX compilation failed');
  }
}

export default function MDXRenderer({ content }: MDXRendererProps) {
  return (
    <BlogErrorBoundary fallback={MDXErrorFallback}>
      <div className='prose prose-gray max-w-none'>
        <Suspense
          fallback={<div className='animate-pulse'>Loading content...</div>}
        >
          <MDXContent content={content} />
        </Suspense>
      </div>
    </BlogErrorBoundary>
  );
}
```

## File: `components/blog/OptimizedMDXRenderer.tsx`

````tsx
'use client';

// import { ExternalLink } from 'lucide-react';
// import Image from 'next/image';
import { lazy, Suspense, useMemo, useState } from 'react';

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
      /{{(timer|metric|feature|tip|mistake|callout|step|progress)}}/.test(
        content
      ) ||
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
              This content contains enhanced features like interactive
              components, syntax highlighting, or custom elements. Click the
              button above to load the full experience.
            </p>
          </div>
        </div>
      </div>
    </BlogErrorBoundary>
  );
}
````

## File: `components/blog/RelatedPosts.tsx`

```tsx
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { BlogPost } from '@/types/blog';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className='mt-16 border-t pt-8'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl font-bold mb-2'>Related Articles</h2>
        <p className='text-muted-foreground'>
          Discover more content similar to what you just read
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.map((post) => (
          <Card
            key={post.slug}
            className='group hover:shadow-md transition-all duration-200'
          >
            <Link href={`/blog/${post.slug}`} className='block h-full'>
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-2 mb-2'>
                  <Badge variant='secondary' className='text-xs'>
                    {post.category}
                  </Badge>
                  {post.featured && (
                    <Badge variant='default' className='text-xs'>
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className='text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2'>
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-0'>
                <CardDescription className='text-sm line-clamp-3 mb-4'>
                  {post.summary}
                </CardDescription>

                <div className='flex items-center justify-between text-xs text-muted-foreground mb-3'>
                  <span>{post.readTime} min read</span>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className='flex flex-wrap gap-1'>
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant='outline' className='text-xs'>
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant='outline' className='text-xs'>
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* View all posts button */}
      <div className='text-center mt-8'>
        <Button asChild variant='outline'>
          <Link href='/blog'>View All Articles</Link>
        </Button>
      </div>
    </section>
  );
}
```
