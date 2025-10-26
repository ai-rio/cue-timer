'use client';

import { BookOpen, Calendar, Clock, Eye, Filter, Heart, Share2, Star, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type {
  BlogPagination,
  BlogPostEnhanced,
  BlogPostFilters,
  CueTimerTemplate,
} from '@/types/blog-enhanced';

import AdvancedBlogSearchAndFilter from './AdvancedBlogSearchAndFilter';

// Template configurations
const TEMPLATE_CONFIGS = {
  'timing-guide': {
    icon: Clock,
    color: 'bg-blue-500',
    label: 'Timing Guide',
  },
  'case-study': {
    icon: Star,
    color: 'bg-green-500',
    label: 'Case Study',
  },
  'feature-announce': {
    icon: BookOpen,
    color: 'bg-purple-500',
    label: 'Feature Release',
  },
  'presentation-tips': {
    icon: Users,
    color: 'bg-orange-500',
    label: 'Presentation Tips',
  },
};

interface BlogContentEnhancedProps {
  initialPosts: BlogPostEnhanced[];
  templates?: CueTimerTemplate[];
  showFilters?: boolean;
  showSearch?: boolean;
  enableAdvancedFeatures?: boolean;
  itemsPerPage?: number;
  className?: string;
}

interface BlogPostCardProps {
  post: BlogPostEnhanced;
  template?: CueTimerTemplate;
  showMetrics?: boolean;
  compact?: boolean;
}

function BlogPostCard({ post, template, showMetrics = true, compact = false }: BlogPostCardProps) {
  const templateConfig = template
    ? TEMPLATE_CONFIGS[template.category as keyof typeof TEMPLATE_CONFIGS]
    : null;
  const TemplateIcon = templateConfig?.icon;

  // Format date
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: compact ? 'short' : 'long',
      day: 'numeric',
    });

  if (compact) {
    return (
      <Card className='hover:shadow-lg transition-shadow duration-200 cursor-pointer group'>
        <CardContent className='p-4'>
          <div className='space-y-3'>
            {/* Header with template indicator */}
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-2'>
                {templateConfig && TemplateIcon && (
                  <div className={`p-1 rounded ${templateConfig.color} bg-opacity-10`}>
                    <TemplateIcon className='h-4 w-4' />
                  </div>
                )}
                <h3 className='font-semibold line-clamp-2 group-hover:text-primary transition-colors'>
                  {post.title}
                </h3>
              </div>
              {post.featured && (
                <Badge variant='secondary' className='text-xs'>
                  Featured
                </Badge>
              )}
            </div>

            {/* Metadata */}
            <div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
              <div className='flex items-center gap-1'>
                <Calendar className='h-3 w-3' />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Clock className='h-3 w-3' />
                <span>{post.readTime} min</span>
              </div>
              {post.difficulty && (
                <Badge variant='outline' className='text-xs'>
                  {post.difficulty}
                </Badge>
              )}
              {post.language && post.language !== 'en' && (
                <Badge variant='outline' className='text-xs'>
                  {post.language.toUpperCase()}
                </Badge>
              )}
            </div>

            {/* Excerpt */}
            <p className='text-sm text-muted-foreground line-clamp-3 leading-relaxed'>
              {post.excerpt || post.summary}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className='flex flex-wrap gap-1'>
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant='secondary' className='text-xs'>
                    #{tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant='secondary' className='text-xs'>
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Metrics */}
            {showMetrics && (
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <div className='flex items-center gap-3'>
                  {post.views && (
                    <div className='flex items-center gap-1'>
                      <Eye className='h-3 w-3' />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                  )}
                  {post.likes && (
                    <div className='flex items-center gap-1'>
                      <Heart className='h-3 w-3' />
                      <span>{post.likes.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className='flex items-center gap-1'>
                  <span>By {post.author}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='hover:shadow-lg transition-shadow duration-200 cursor-pointer group'>
      <CardHeader className='pb-3'>
        {/* Header with template and status */}
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            {templateConfig && TemplateIcon && (
              <div className={`p-2 rounded-lg ${templateConfig.color} bg-opacity-10`}>
                <TemplateIcon className='h-5 w-5' />
              </div>
            )}
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <h3 className='font-semibold text-lg group-hover:text-primary transition-colors'>
                  {post.title}
                </h3>
                {post.featured && (
                  <Badge variant='default' className='ml-2'>
                    Featured
                  </Badge>
                )}
                {post.draft && (
                  <Badge variant='outline' className='ml-2 border-yellow-500 text-yellow-700'>
                    Draft
                  </Badge>
                )}
              </div>
              <p className='text-muted-foreground'>
                {templateConfig ? templateConfig.label : post.category}
              </p>
            </div>
          </div>

          {showMetrics && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              {post.views && (
                <div className='flex items-center gap-1'>
                  <Eye className='h-4 w-4' />
                  <span>{post.views.toLocaleString()}</span>
                </div>
              )}
              {post.likes && (
                <div className='flex items-center gap-1'>
                  <Heart className='h-4 w-4' />
                  <span>{post.likes.toLocaleString()}</span>
                </div>
              )}
              {post.seoScore && (
                <Badge variant={post.seoScore >= 80 ? 'default' : 'secondary'} className='text-xs'>
                  SEO: {post.seoScore}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        {/* Summary */}
        <p className='text-muted-foreground mb-4 leading-relaxed line-clamp-3'>
          {post.excerpt || post.summary}
        </p>

        {/* Metadata row */}
        <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4'>
          <div className='flex items-center gap-1'>
            <Calendar className='h-4 w-4' />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <Separator orientation='vertical' className='h-4' />
          <div className='flex items-center gap-1'>
            <BookOpen className='h-4 w-4' />
            <span>{post.readTime} min read</span>
          </div>
          {post.difficulty && (
            <>
              <Separator orientation='vertical' className='h-4' />
              <Badge variant='outline'>{post.difficulty}</Badge>
            </>
          )}
          {post.language && post.language !== 'en' && (
            <>
              <Separator orientation='vertical' className='h-4' />
              <Badge variant='outline'>{post.language.toUpperCase()}</Badge>
            </>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {post.tags.map((tag) => (
              <Badge key={tag} variant='secondary' className='text-xs'>
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Author and quick actions */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span>By {post.author}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='sm' className='text-xs'>
              <Share2 className='h-3 w-3 mr-1' />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BlogPostGrid({
  posts,
  templates,
  showMetrics = true,
  compact = false,
}: {
  posts: BlogPostEnhanced[];
  templates?: CueTimerTemplate[];
  showMetrics?: boolean;
  compact?: boolean;
}) {
  // Create template lookup map
  const templateMap = useMemo(() => {
    if (!templates) return {};
    return templates.reduce(
      (acc, template) => {
        acc[template.category] = template;
        return acc;
      },
      {} as Record<string, CueTimerTemplate>
    );
  }, [templates]);

  return (
    <div
      className={`grid gap-6 ${
        compact
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {posts.map((post) => (
        <BlogPostCard
          key={post.slug}
          post={post}
          template={templateMap[post.category]}
          showMetrics={showMetrics}
          compact={compact}
        />
      ))}
    </div>
  );
}

// Pagination component
function BlogPagination({
  pagination,
  onPageChange,
  className = '',
}: {
  pagination: BlogPagination;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const { currentPage, totalPages, hasNext, hasPrevious } = pagination;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className='text-sm text-muted-foreground'>
        Page {currentPage} of {totalPages} ({pagination.totalPosts} posts)
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
        >
          Previous
        </Button>

        {/* Page number buttons */}
        <div className='flex items-center gap-1'>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            const isEllipsis = pageNum > totalPages;

            if (isEllipsis) {
              return (
                <span key={i} className='px-2 text-muted-foreground'>
                  ...
                </span>
              );
            }

            return (
              <Button
                key={pageNum}
                variant={isActive ? 'default' : 'outline'}
                size='sm'
                onClick={() => onPageChange(pageNum)}
                className='w-8 h-8 p-0'
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default function BlogContentEnhanced({
  initialPosts,
  templates,
  showFilters = true,
  showSearch = true,
  enableAdvancedFeatures = true,
  itemsPerPage = 12,
  className = '',
}: BlogContentEnhancedProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPostEnhanced[]>(initialPosts);
  const [filters, setFilters] = useState<BlogPostFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Calculate pagination
  const pagination = useMemo((): BlogPagination => {
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / itemsPerPage);

    return {
      currentPage,
      totalPages,
      totalPosts,
      postsPerPage: itemsPerPage,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    };
  }, [filteredPosts, currentPage, itemsPerPage]);

  // Get posts for current page
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPosts, currentPage, itemsPerPage]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: BlogPostFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and filters */}
      {(showSearch || showFilters) && (
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Filter className='h-5 w-5' />
              <h2 className='text-lg font-semibold'>Search & Filter</h2>
            </div>
          </CardHeader>
          <CardContent>
            <AdvancedBlogSearchAndFilter
              posts={initialPosts}
              onFiltersChange={handleFiltersChange}
              onSearchResults={(results) => {
                const posts = results.map((result) => result.post);
                setFilteredPosts(posts);
              }}
              showAdvanced={enableAdvancedFeatures}
            />
          </CardContent>
        </Card>
      )}

      {/* View controls */}
      <div className='flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>
          Showing {paginatedPosts.length} of {filteredPosts.length} posts
          {Object.keys(filters).length > 0 && ' (filtered)'}
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Blog posts grid */}
      <BlogPostGrid
        posts={paginatedPosts}
        templates={templates}
        compact={viewMode === 'grid'}
        showMetrics={enableAdvancedFeatures}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className='mt-8'>
          <BlogPagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}
