# Chunk 11: components_components

## Metadata

- **Files**: 7
- **Size**: 30,674 characters (~7,668 tokens)
- **Categories**: components

## Files in this chunk

- `components/blog/TableOfContents.tsx`
- `components/blog/TemplateAwareBlogPostWrapper.tsx`
- `components/checkout/CheckoutForm.tsx`
- `components/ui/avatar.tsx`
- `components/ui/badge.tsx`
- `components/ui/breadcrumb.tsx`
- `components/ui/button.tsx`

---

## File: `components/blog/TableOfContents.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TableOfContentsItem } from '@/types/blog';

interface TableOfContentsProps {
  headings: TableOfContentsItem[];
  activeId?: string;
}

export default function TableOfContents({
  headings,
  activeId,
}: TableOfContentsProps) {
  const [currentActiveId, setCurrentActiveId] = useState<string>(
    activeId || ''
  );

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((heading) => ({
        id: heading.id,
        element: document.getElementById(heading.id),
      }));

      // Find the heading that's currently in view
      const currentHeading = headingElements.find(({ element }) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });

      if (currentHeading) {
        setCurrentActiveId(currentHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const renderTableOfContentsItem = (
    item: TableOfContentsItem,
    level: number = 0
  ) => {
    const isActive = currentActiveId === item.id;
    const marginLeft = `${level * 16}px`;

    return (
      <li key={item.id} className='my-1'>
        <a
          href={`#${item.id}`}
          className={`block py-1 px-2 text-sm rounded transition-colors hover:bg-muted ${
            isActive
              ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
              : 'text-muted-foreground'
          }`}
          style={{ marginLeft }}
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById(item.id);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setCurrentActiveId(item.id);
            }
          }}
        >
          {item.text}
        </a>
        {item.children && item.children.length > 0 && (
          <ul className='mt-1'>
            {item.children.map((child) =>
              renderTableOfContentsItem(child, level + 1)
            )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <Card className='sticky top-24 w-full max-w-xs'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg flex items-center justify-between'>
          Table of Contents
          <Badge variant='secondary' className='text-xs'>
            {headings.length} sections
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        <nav aria-label='Table of Contents'>
          <ul className='space-y-1'>
            {headings.map((heading) => renderTableOfContentsItem(heading))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}

// Utility function to extract headings from MDX content
export function extractHeadings(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TableOfContentsItem[] = [];
  const stack: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1]?.length || 0;
    const text = match[2]?.trim() || '';
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const heading: TableOfContentsItem = {
      id,
      text,
      level,
      children: [],
    };

    // Pop items from stack that are at the same level or deeper
    while (stack.length > 0) {
      const lastItem = stack[stack.length - 1];
      if (lastItem && lastItem.level >= level) {
        stack.pop();
      } else {
        break;
      }
    }

    // Add to parent or root
    if (stack.length === 0) {
      headings.push(heading);
    } else {
      const lastItem = stack[stack.length - 1];
      if (lastItem) {
        lastItem.children.push(heading);
      }
    }

    stack.push(heading);
  }

  return headings;
}
```

## File: `components/blog/TemplateAwareBlogPostWrapper.tsx`

```tsx
'use client';

import {
  Award,
  BarChart3,
  BookOpen,
  Clock,
  Lightbulb,
  Target,
  Timer,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  BlogPostEnhanced,
  CueTimerTemplate,
  TemplateConfig,
  TemplateMetadata,
} from '@/types/blog-enhanced';

import BlogErrorBoundary from './BlogErrorBoundary';
import MDXRenderer from './MDXRenderer';
import TableOfContents, { extractHeadings } from './TableOfContents';

// Template configurations for UI
const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  'timing-guide': {
    id: 'timing-guide',
    name: 'Timing Guide',
    category: 'timing-guide',
    displayName: 'Timing Guide',
    description: 'Step-by-step timing tutorials and best practices',
    icon: Clock,
    color: 'bg-blue-500',
    difficulties: ['beginner', 'intermediate', 'advanced'],
    features: ['step-by-step', 'practical-examples', 'time-estimation'],
  },
  'case-study': {
    id: 'case-study',
    name: 'Case Study',
    category: 'case-study',
    displayName: 'Case Study',
    description: 'Real-world success stories and implementations',
    icon: Award,
    color: 'bg-green-500',
    difficulties: ['beginner', 'intermediate', 'advanced'],
    features: ['real-world-examples', 'metrics', 'testimonials'],
  },
  'feature-announce': {
    id: 'feature-announce',
    name: 'Feature Announcement',
    category: 'feature-announce',
    displayName: 'Feature Release',
    description: 'New features and product updates',
    icon: Lightbulb,
    color: 'bg-purple-500',
    difficulties: ['all-levels'],
    features: ['new-features', 'getting-started', 'use-cases'],
  },
  'presentation-tips': {
    id: 'presentation-tips',
    name: 'Presentation Tips',
    category: 'presentation-tips',
    displayName: 'Presentation Tips',
    description: 'Best practices and professional advice',
    icon: Target,
    color: 'bg-orange-500',
    difficulties: ['beginner', 'intermediate', 'advanced', 'all-levels'],
    features: ['best-practices', 'common-mistakes', 'pro-tips'],
  },
};

interface TemplateAwareBlogPostWrapperProps {
  post: BlogPostEnhanced;
  template?: CueTimerTemplate;
  metadata?: TemplateMetadata;
  className?: string;
}

// Template-specific sidebar components
function TemplateSidebar({
  post: _post,
  template,
  metadata,
}: {
  post: BlogPostEnhanced;
  template: CueTimerTemplate;
  metadata?: TemplateMetadata;
}) {
  const config = TEMPLATE_CONFIGS[template.category];
  const Icon = config?.icon;

  // Render timing guide specific sidebar
  if (template.category === 'timing-guide' && metadata?.timingGuide) {
    const { estimatedTime, targetAudience, tools, prerequisites } =
      metadata.timingGuide;

    return (
      <Card className='mb-6'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            {Icon && <Icon className='h-5 w-5 text-blue-500' />}
            <h3 className='font-semibold'>Guide Information</h3>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <h4 className='font-medium text-sm text-muted-foreground mb-1'>
              <Timer className='inline h-4 w-4 mr-1' />
              Estimated Time
            </h4>
            <p className='text-sm'>{estimatedTime || '10-15 minutes'}</p>
          </div>

          <div>
            <h4 className='font-medium text-sm text-muted-foreground mb-1'>
              <Users className='inline h-4 w-4 mr-1' />
              Target Audience
            </h4>
            <p className='text-sm'>
              {targetAudience || 'Presenters and event organizers'}
            </p>
          </div>

          {tools && tools.length > 0 && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>
                Required Tools
              </h4>
              <div className='flex flex-wrap gap-1'>
                {tools.map((tool, index) => (
                  <Badge key={index} variant='outline' className='text-xs'>
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {prerequisites && prerequisites.length > 0 && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>
                Prerequisites
              </h4>
              <ul className='text-sm space-y-1'>
                {prerequisites.map((prereq, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <span className='text-blue-500 mt-1'>•</span>
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Render case study specific sidebar
  if (template.category === 'case-study' && metadata?.caseStudy) {
    const { client, industry, results } = metadata.caseStudy;

    return (
      <Card className='mb-6'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            {Icon && <Icon className='h-5 w-5 text-green-500' />}
            <h3 className='font-semibold'>Case Study Details</h3>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <h4 className='font-medium text-sm text-muted-foreground mb-1'>
              Client
            </h4>
            <p className='text-sm'>{client}</p>
          </div>

          <div>
            <h4 className='font-medium text-sm text-muted-foreground mb-1'>
              Industry
            </h4>
            <p className='text-sm'>{industry}</p>
          </div>

          {results && results.length > 0 && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>
                Key Results
              </h4>
              <ul className='text-sm space-y-1'>
                {results.map((result, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <span className='text-green-500 mt-1'>✓</span>
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Render feature announcement specific sidebar
  if (template.category === 'feature-announce' && metadata?.featureAnnounce) {
    const { version, benefits, useCases } = metadata.featureAnnounce;

    return (
      <Card className='mb-6'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            {Icon && <Icon className='h-5 w-5 text-purple-500' />}
            <h3 className='font-semibold'>Feature Details</h3>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {version && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-1'>
                Version
              </h4>
              <Badge variant='secondary'>{version}</Badge>
            </div>
          )}

          {benefits && benefits.length > 0 && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>
                Key Benefits
              </h4>
              <ul className='text-sm space-y-1'>
                {benefits.map((benefit, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <span className='text-purple-500 mt-1'>★</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {useCases && useCases.length > 0 && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>
                Perfect For
              </h4>
              <ul className='text-sm space-y-1'>
                {useCases.map((useCase, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <span className='text-purple-500 mt-1'>→</span>
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Render presentation tips specific sidebar
  if (template.category === 'presentation-tips' && metadata?.presentationTips) {
    const { topic, tips, commonMistakes } = metadata.presentationTips;

    return (
      <Card className='mb-6'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            {Icon && <Icon className='h-5 w-5 text-orange-500' />}
            <h3 className='font-semibold'>Tips Overview</h3>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {topic && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-1'>
                Topic
              </h4>
              <p className='text-sm'>{topic}</p>
            </div>
          )}

          {tips && tips.length > 0 && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>
                Essential Tips
              </h4>
              <div className='space-y-2'>
                {tips.slice(0, 3).map((tip, index) => (
                  <div
                    key={index}
                    className='text-sm p-2 bg-orange-50 rounded border-l-2 border-orange-300'
                  >
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}

          {commonMistakes && commonMistakes.length > 0 && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>
                Common Mistakes
              </h4>
              <ul className='text-sm space-y-1'>
                {commonMistakes.slice(0, 3).map((mistake, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <span className='text-red-500 mt-1'>!</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default template info sidebar
  return (
    <Card className='mb-6'>
      <CardHeader>
        <div className='flex items-center gap-2'>
          {Icon && <Icon className='h-5 w-5 text-gray-500' />}
          <h3 className='font-semibold'>Template Info</h3>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div>
          <h4 className='font-medium text-sm text-muted-foreground mb-1'>
            Category
          </h4>
          <Badge variant='outline'>{config?.displayName || ''}</Badge>
        </div>

        <div>
          <h4 className='font-medium text-sm text-muted-foreground mb-1'>
            Features
          </h4>
          <div className='flex flex-wrap gap-1'>
            {config?.features?.map((feature, index) => (
              <Badge key={index} variant='secondary' className='text-xs'>
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className='font-medium text-sm text-muted-foreground mb-1'>
            Description
          </h4>
          <p className='text-sm text-muted-foreground'>
            {config?.description || ''}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Reading progress indicator
function ReadingProgress({ content: _content }: { content: string }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50'>
      <div
        className='h-full bg-primary transition-all duration-150'
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

// Related content based on template
function RelatedTemplateContent({
  post: _post,
  template,
}: {
  post: BlogPostEnhanced;
  template: CueTimerTemplate;
}) {
  const config = TEMPLATE_CONFIGS[template.category];

  if (!config) {
    return null;
  }

  return (
    <Card className='mt-6'>
      <CardHeader>
        <h3 className='font-semibold'>Related {config.displayName}s</h3>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          <p className='text-sm text-muted-foreground'>
            Discover more {config.displayName.toLowerCase()} to enhance your
            skills:
          </p>
          <div className='flex flex-wrap gap-2'>
            <Badge
              variant='outline'
              className='cursor-pointer hover:bg-primary hover:text-primary-foreground'
            >
              View All {config.displayName}s
            </Badge>
            <Badge
              variant='outline'
              className='cursor-pointer hover:bg-primary hover:text-primary-foreground'
            >
              Beginner Level
            </Badge>
            <Badge
              variant='outline'
              className='cursor-pointer hover:bg-primary hover:text-primary-foreground'
            >
              Advanced Techniques
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TemplateAwareBlogPostWrapper({
  post,
  template,
  metadata,
  className = '',
}: TemplateAwareBlogPostWrapperProps) {
  const headings = useMemo(() => {
    if (post.content) {
      return extractHeadings(post.content);
    }
    return [];
  }, [post.content]);

  const config = useMemo(
    () => (template ? TEMPLATE_CONFIGS[template.category] : null),
    [template]
  );

  if (!template || !config) {
    // Fallback to original wrapper if no template
    return (
      <BlogErrorBoundary>
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${className}`}>
          <div className='lg:col-span-3'>
            <MDXRenderer content={post.content || ''} />
          </div>
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

  return (
    <BlogErrorBoundary>
      <ReadingProgress content={post.content || ''} />

      <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${className}`}>
        {/* Main content */}
        <div className='lg:col-span-3'>
          <div className='mb-6'>
            {/* Template header */}
            <div className='flex items-center gap-3 mb-4'>
              <div className={`p-2 rounded-lg ${config.color} bg-opacity-10`}>
                <config.icon className='h-5 w-5' />
              </div>
              <div>
                <h2 className='text-lg font-semibold'>{config.displayName}</h2>
                <p className='text-sm text-muted-foreground'>
                  {config.description}
                </p>
              </div>
            </div>

            {post.difficulty && (
              <div className='flex items-center gap-2 mb-4'>
                <span className='text-sm font-medium'>Difficulty:</span>
                <Badge
                  variant={
                    post.difficulty === 'advanced'
                      ? 'destructive'
                      : post.difficulty === 'intermediate'
                        ? 'default'
                        : 'secondary'
                  }
                >
                  {post.difficulty}
                </Badge>
              </div>
            )}

            {post.estimatedReadTime && (
              <div className='flex items-center gap-2 mb-4'>
                <BookOpen className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>
                  {post.estimatedReadTime} min read
                </span>
              </div>
            )}
          </div>

          <Separator className='mb-6' />

          <MDXRenderer content={post.content || ''} />

          <RelatedTemplateContent post={post} template={template} />
        </div>

        {/* Sidebar with template-specific content */}
        <aside className='lg:col-span-1'>
          <BlogErrorBoundary>
            <div className='space-y-6'>
              {/* Table of contents */}
              <div className='hidden lg:block'>
                <TableOfContents headings={headings} />
              </div>

              {/* Template-specific sidebar */}
              <div className='hidden lg:block'>
                <TemplateSidebar
                  post={post}
                  template={template}
                  metadata={metadata}
                />
              </div>

              {/* Engagement metrics */}
              {post.views && (
                <Card>
                  <CardHeader>
                    <div className='flex items-center gap-2'>
                      <BarChart3 className='h-4 w-4' />
                      <h4 className='text-sm font-semibold'>Engagement</h4>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='text-sm space-y-1'>
                      <p>{post.views.toLocaleString()} views</p>
                      {post.readTime && <p>{post.readTime} min read time</p>}
                      {post.likes && <p>{post.likes.toLocaleString()} likes</p>}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </BlogErrorBoundary>
        </aside>
      </div>
    </BlogErrorBoundary>
  );
}
```

## File: `components/checkout/CheckoutForm.tsx`

```tsx
'use client';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || 'An unexpected error occurred.');
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs' as const,
  };

  return (
    <form id='payment-form' onSubmit={handleSubmit}>
      <div className='space-y-6'>
        <PaymentElement id='payment-element' options={paymentElementOptions} />

        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg ${
              message.includes('success')
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.includes('success') ? (
              <CheckCircle className='h-4 w-4 text-green-500' />
            ) : (
              <AlertCircle className='h-4 w-4 text-red-500' />
            )}
            <span
              className={`text-sm ${
                message.includes('success') ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {message}
            </span>
          </div>
        )}

        <Button
          disabled={isLoading || !stripe || !elements}
          id='submit'
          className='w-full bg-brand-orange hover:bg-brand-600 text-white'
          size='lg'
        >
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </Button>

        <div className='text-center text-sm text-gray-500'>
          By completing this purchase, you agree to our{' '}
          <a href='/terms' className='text-brand-orange hover:underline'>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href='/privacy' className='text-brand-orange hover:underline'>
            Privacy Policy
          </a>
        </div>
      </div>
    </form>
  );
}
```

## File: `components/ui/avatar.tsx`

```tsx
'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
```

## File: `components/ui/badge.tsx`

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
```

## File: `components/ui/breadcrumb.tsx`

```tsx
// import { useTranslations } from 'next-intl';

interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
  className?: string;
}

interface BreadcrumbPageProps {
  children: React.ReactNode;
  className?: string;
}

export function Breadcrumb({ children, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label='Breadcrumb'
      className={`flex items-center space-x-2 text-sm text-gray-500 ${className}`}
    >
      {children}
    </nav>
  );
}

export function BreadcrumbItem({
  children,
  className = '',
}: BreadcrumbItemProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {children}
      <svg
        className='w-4 h-4 text-gray-400 mx-2'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 5l7 7-7 7'
        />
      </svg>
    </div>
  );
}

export function BreadcrumbPage({
  children,
  className = '',
}: BreadcrumbPageProps) {
  // const t = useTranslations('Common');

  return (
    <span
      className={`font-medium text-gray-900 ${className}`}
      aria-current='page'
    >
      {children}
    </span>
  );
}
```

## File: `components/ui/button.tsx`

```tsx
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```
