'use client';

import { Award, BarChart3, BookOpen, Clock, Lightbulb, Target, Timer, Users } from 'lucide-react';
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
    const { estimatedTime, targetAudience, tools, prerequisites } = metadata.timingGuide;

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
            <p className='text-sm'>{targetAudience || 'Presenters and event organizers'}</p>
          </div>

          {tools && tools.length > 0 && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>Required Tools</h4>
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
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>Prerequisites</h4>
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
            <h4 className='font-medium text-sm text-muted-foreground mb-1'>Client</h4>
            <p className='text-sm'>{client}</p>
          </div>

          <div>
            <h4 className='font-medium text-sm text-muted-foreground mb-1'>Industry</h4>
            <p className='text-sm'>{industry}</p>
          </div>

          {results && results.length > 0 && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>Key Results</h4>
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
              <h4 className='font-medium text-sm text-muted-foreground mb-1'>Version</h4>
              <Badge variant='secondary'>{version}</Badge>
            </div>
          )}

          {benefits && benefits.length > 0 && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>Key Benefits</h4>
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
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>Perfect For</h4>
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
              <h4 className='font-medium text-sm text-muted-foreground mb-1'>Topic</h4>
              <p className='text-sm'>{topic}</p>
            </div>
          )}

          {tips && tips.length > 0 && (
            <div>
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>Essential Tips</h4>
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
              <h4 className='font-medium text-sm text-muted-foreground mb-2'>Common Mistakes</h4>
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
          <h4 className='font-medium text-sm text-muted-foreground mb-1'>Category</h4>
          <Badge variant='outline'>{config?.displayName || ''}</Badge>
        </div>

        <div>
          <h4 className='font-medium text-sm text-muted-foreground mb-1'>Features</h4>
          <div className='flex flex-wrap gap-1'>
            {config?.features?.map((feature, index) => (
              <Badge key={index} variant='secondary' className='text-xs'>
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className='font-medium text-sm text-muted-foreground mb-1'>Description</h4>
          <p className='text-sm text-muted-foreground'>{config?.description || ''}</p>
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
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
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
            Discover more {config.displayName.toLowerCase()} to enhance your skills:
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

  const config = useMemo(() => (template ? TEMPLATE_CONFIGS[template.category] : null), [template]);

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
                <p className='text-sm text-muted-foreground'>{config.description}</p>
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
                <TemplateSidebar post={post} template={template} metadata={metadata} />
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
