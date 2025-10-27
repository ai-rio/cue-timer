# Chunk 7: components_components

## Metadata

- **Files**: 3
- **Size**: 31,539 characters (~7,884 tokens)
- **Categories**: components

## Files in this chunk

- `components/blog/BlogContentManager.tsx`
- `components/blog/BlogContentSimple.tsx`
- `components/blog/BlogErrorBoundary.tsx`

---

## File: `components/blog/BlogContentManager.tsx`

```tsx
'use client';

import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Download,
  FileText,
  PlayCircle,
  RefreshCw,
  Search,
  TrendingUp,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BlogAnalytics,
  BlogPostEnhanced,
  ContentMetrics,
  SEOResult,
} from '@/types/blog-enhanced';

interface BlogContentManagerProps {
  posts?: BlogPostEnhanced[];
  analytics?: BlogAnalytics;
  className?: string;
}

// Mock API functions (replace with real API calls)
const mockAPI = {
  // CLI integration endpoints
  async getContentMetrics(slug: string): Promise<ContentMetrics> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      postSlug: slug,
      language: 'en',
      views: Math.floor(Math.random() * 1000) + 100,
      readTime: Math.floor(Math.random() * 10) + 3,
      bounceRate: Math.random() * 0.5,
      featureEngagement: {
        shares: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
        bookmarks: Math.floor(Math.random() * 15),
      },
      seoScore: Math.floor(Math.random() * 20) + 80,
    };
  },

  async getSEOScore(_slug: string): Promise<SEOResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      score: Math.floor(Math.random() * 15) + 85,
      issues: [
        {
          type: 'suboptimal',
          field: 'meta-description',
          message: 'Could be more descriptive',
          severity: 'info',
        },
      ],
      recommendations: [
        {
          category: 'content',
          priority: 'medium',
          action: 'Add more relevant keywords',
          impact: 'Better search visibility',
        },
      ],
      keywords: [
        {
          keyword: 'event timing',
          density: 2.5,
          relevance: 8,
          competition: 'medium',
        },
      ],
    };
  },

  async getBlogAnalytics(): Promise<BlogAnalytics> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      totalPosts: 150,
      publishedPosts: 120,
      draftPosts: 30,
      totalViews: 15420,
      totalReadTime: 280,
      averageReadTime: 6.2,
      topCategories: [
        { category: 'timing-guide', count: 45 },
        { category: 'presentation-tips', count: 38 },
        { category: 'case-study', count: 22 },
        { category: 'feature-announce', count: 15 },
      ],
      topAuthors: [
        { author: 'CueTimer Team', postsCount: 35, totalViews: 5200 },
        { author: 'John Doe', postsCount: 12, totalViews: 1800 },
        { author: 'Jane Smith', postsCount: 8, totalViews: 950 },
      ],
      recentPosts: [],
      popularPosts: [],
    };
  },

  async publishPost(
    slug: string
  ): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      message: `Post ${slug} published successfully`,
    };
  },

  async unpublishPost(
    slug: string
  ): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      message: `Post ${slug} unpublished successfully`,
    };
  },
};

function ContentMetricsCard({ postSlug }: { postSlug: string }) {
  const [metrics, setMetrics] = useState<ContentMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      try {
        const data = await mockAPI.getContentMetrics(postSlug);
        setMetrics(data);
      } catch (error) {
        console.error('Failed to load content metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [postSlug]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className='text-lg font-semibold'>Content Metrics</h3>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse space-y-4'>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            <div className='h-4 bg-gray-200 rounded w-2/3'></div>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const engagementRate = ((1 - metrics.bounceRate) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <BarChart3 className='h-5 w-5' />
          <h3 className='text-lg font-semibold'>Content Metrics</h3>
          <Badge variant='secondary' className='text-xs'>
            Live Data
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Key metrics */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div>
            <div className='text-2xl font-bold text-primary'>
              {metrics.views.toLocaleString()}
            </div>
            <div className='text-sm text-muted-foreground'>Total Views</div>
          </div>
          <div>
            <div className='text-2xl font-bold text-primary'>
              {metrics.readTime}m
            </div>
            <div className='text-sm text-muted-foreground'>Avg Read Time</div>
          </div>
          <div>
            <div className='text-2xl font-bold text-primary'>
              {engagementRate}%
            </div>
            <div className='text-sm text-muted-foreground'>Engagement Rate</div>
          </div>
          <div>
            <div className='text-2xl font-bold text-primary'>
              {metrics.seoScore}
            </div>
            <div className='text-sm text-muted-foreground'>SEO Score</div>
          </div>
        </div>

        {/* Feature engagement */}
        <div>
          <h4 className='font-medium mb-3'>Feature Engagement</h4>
          <div className='space-y-2'>
            {Object.entries(metrics.featureEngagement).map(
              ([feature, count]) => (
                <div
                  key={feature}
                  className='flex items-center justify-between'
                >
                  <span className='text-sm capitalize'>
                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Badge variant='outline'>{count}</Badge>
                </div>
              )
            )}
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-2'>
          <Button variant='outline' size='sm'>
            <Download className='h-4 w-4 mr-2' />
            Export Data
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => window.location.reload()}
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SEOCheckerCard({ postSlug }: { postSlug: string }) {
  const [seoResult, setSeoResult] = useState<SEOResult | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSEO = useCallback(async () => {
    setLoading(true);
    try {
      const result = await mockAPI.getSEOScore(postSlug);
      setSeoResult(result);
    } catch (error) {
      console.error('Failed to load SEO data:', error);
    } finally {
      setLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    loadSEO();
  }, [postSlug, loadSEO]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className='text-lg font-semibold'>SEO Analysis</h3>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse space-y-2'>
            <div className='h-6 bg-gray-200 rounded'></div>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!seoResult) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Search className='h-5 w-5' />
            <h3 className='text-lg font-semibold'>SEO Analysis</h3>
          </div>
          <Badge
            variant={seoResult.score >= 80 ? 'default' : 'destructive'}
            className={getScoreColor(seoResult.score)}
          >
            Score: {seoResult.score}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Issues */}
        {seoResult.issues.length > 0 && (
          <div>
            <h4 className='font-medium mb-2 flex items-center gap-2'>
              <AlertTriangle className='h-4 w-4' />
              Issues ({seoResult.issues.length})
            </h4>
            <div className='space-y-2'>
              {seoResult.issues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border ${
                    issue.severity === 'error'
                      ? 'border-red-200 bg-red-50'
                      : issue.severity === 'warning'
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className='flex items-start gap-2'>
                    <span className='text-lg'>
                      {issue.severity === 'error'
                        ? '❌'
                        : issue.severity === 'warning'
                          ? '⚠️'
                          : 'ℹ️'}
                    </span>
                    <div>
                      <p className='font-medium'>{issue.field}</p>
                      <p className='text-sm text-muted-foreground'>
                        {issue.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {seoResult.recommendations.length > 0 && (
          <div>
            <h4 className='font-medium mb-2 flex items-center gap-2'>
              <CheckCircle className='h-4 w-4' />
              Recommendations ({seoResult.recommendations.length})
            </h4>
            <div className='space-y-2'>
              {seoResult.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className='p-3 rounded border border-green-200 bg-green-50'
                >
                  <div className='flex items-start gap-2'>
                    <span className='text-lg'>💡</span>
                    <div>
                      <p className='font-medium text-sm'>{rec.action}</p>
                      <p className='text-sm text-green-700'>
                        <strong>Impact:</strong> {rec.impact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        {seoResult.keywords.length > 0 && (
          <div>
            <h4 className='font-medium mb-2'>Keywords</h4>
            <div className='flex flex-wrap gap-2'>
              {seoResult.keywords.map((keyword, index) => (
                <Badge key={index} variant='outline' className='text-xs'>
                  {keyword.keyword} ({keyword.density.toFixed(1)}%)
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className='flex gap-2'>
          <Button size='sm' onClick={loadSEO}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Re-run Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions({ posts: _posts = [] }: { posts: BlogPostEnhanced[] }) {
  const [selectedAction, setSelectedAction] = useState<string>('');

  const handleBulkAction = async (action: string) => {
    setSelectedAction(action);
    // Simulate bulk action
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSelectedAction('');
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <PlayCircle className='h-5 w-5' />
          <h3 className='text-lg font-semibold'>Quick Actions</h3>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <Button
            variant='outline'
            className='justify-start h-auto p-4'
            onClick={() => handleBulkAction('validate-all')}
            disabled={selectedAction === 'validate-all'}
          >
            <CheckCircle className='h-5 w-5 mr-2' />
            <div className='text-left'>
              <div className='font-medium'>Validate All Content</div>
              <div className='text-xs text-muted-foreground'>
                Check SEO, links, and formatting for all posts
              </div>
            </div>
          </Button>

          <Button
            variant='outline'
            className='justify-start h-auto p-4'
            onClick={() => handleBulkAction('generate-sitemap')}
            disabled={selectedAction === 'generate-sitemap'}
          >
            <FileText className='h-5 w-5 mr-2' />
            <div className='text-left'>
              <div className='font-medium'>Generate Sitemap</div>
              <div className='text-xs text-muted-foreground'>
                Update XML sitemap with all published posts
              </div>
            </div>
          </Button>

          <Button
            variant='outline'
            className='justify-start h-auto p-4'
            onClick={() => handleBulkAction('optimize-images')}
            disabled={selectedAction === 'optimize-images'}
          >
            <BarChart3 className='h-5 w-5 mr-2' />
            <div className='text-left'>
              <div className='font-medium'>Optimize Images</div>
              <div className='text-xs text-muted-foreground'>
                Compress and resize featured images
              </div>
            </div>
          </Button>

          <Button
            variant='outline'
            className='justify-start h-auto p-4'
            onClick={() => handleBulkAction('sync-analytics')}
            disabled={selectedAction === 'sync-analytics'}
          >
            <TrendingUp className='h-5 w-5 mr-2' />
            <div className='text-left'>
              <div className='font-medium'>Sync Analytics</div>
              <div className='text-xs text-muted-foreground'>
                Pull latest metrics from CLI tools
              </div>
            </div>
          </Button>
        </div>

        {/* Action status */}
        {selectedAction && (
          <div className='mt-4 p-3 bg-blue-50 rounded border border-blue-200'>
            <div className='flex items-center gap-2'>
              <RefreshCw className='h-4 w-4 animate-spin' />
              <span className='text-sm'>
                Executing: {selectedAction.replace(/-/g, ' ')}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BlogAnalyticsDashboard({ analytics }: { analytics?: BlogAnalytics }) {
  if (!analytics) return null;

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <BarChart3 className='h-5 w-5' />
          <h3 className='text-lg font-semibold'>Blog Analytics</h3>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Overview stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary'>
              {analytics.totalPosts}
            </div>
            <div className='text-sm text-muted-foreground'>Total Posts</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary'>
              {analytics.publishedPosts}
            </div>
            <div className='text-sm text-muted-foreground'>Published</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary'>
              {analytics.totalViews.toLocaleString()}
            </div>
            <div className='text-sm text-muted-foreground'>Total Views</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary'>
              {analytics.averageReadTime}m
            </div>
            <div className='text-sm text-muted-foreground'>Avg Read Time</div>
          </div>
        </div>

        {/* Top categories */}
        <div>
          <h4 className='font-medium mb-3'>Top Categories</h4>
          <div className='space-y-2'>
            {analytics.topCategories.map((category, index) => (
              <div key={index} className='flex items-center justify-between'>
                <span className='capitalize'>
                  {category.category.replace('-', ' ')}
                </span>
                <Badge variant='outline'>{category.count} posts</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Top authors */}
        <div>
          <h4 className='font-medium mb-3'>Top Authors</h4>
          <div className='space-y-2'>
            {analytics.topAuthors.map((author, index) => (
              <div key={index} className='flex items-center justify-between'>
                <span>{author.author}</span>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>{author.postsCount} posts</Badge>
                  <Badge variant='secondary'>
                    {author.totalViews.toLocaleString()} views
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlogContentManager({
  posts = [],
  analytics,
  className = '',
}: BlogContentManagerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPost, setSelectedPost] = useState<string>('');

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='metrics'>Content Metrics</TabsTrigger>
          <TabsTrigger value='seo'>SEO Analysis</TabsTrigger>
          <TabsTrigger value='actions'>Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          <BlogAnalyticsDashboard analytics={analytics} />
          <QuickActions posts={posts} />
        </TabsContent>

        <TabsContent value='metrics' className='space-y-6'>
          {selectedPost ? (
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>
                Select Post for Metrics
              </label>
              <Select value={selectedPost} onValueChange={setSelectedPost}>
                <SelectTrigger>
                  <SelectValue placeholder='Choose a post...' />
                </SelectTrigger>
                <SelectContent>
                  {posts.map((post) => (
                    <SelectItem key={post.slug} value={post.slug}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <ContentMetricsCard postSlug={selectedPost} />
        </TabsContent>

        <TabsContent value='seo' className='space-y-6'>
          {selectedPost ? (
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>
                Select Post for SEO Analysis
              </label>
              <Select value={selectedPost} onValueChange={setSelectedPost}>
                <SelectTrigger>
                  <SelectValue placeholder='Choose a post...' />
                </SelectTrigger>
                <SelectContent>
                  {posts.map((post) => (
                    <SelectItem key={post.slug} value={post.slug}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <SEOCheckerCard postSlug={selectedPost} />
        </TabsContent>

        <TabsContent value='actions' className='space-y-6'>
          <QuickActions posts={posts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## File: `components/blog/BlogContentSimple.tsx`

```tsx
'use client';

import { useState } from 'react';

import {
  blogStorage,
  createBlogError,
  useBlogApi,
  useBlogState,
} from '@/lib/blog-utils';
import type { BlogFilter, BlogPostEnhanced } from '@/types/blog-api';

import BlogGridSimple from './BlogGridSimple';
import BlogSearchAndFilterSimple from './BlogSearchAndFilterSimple';

interface BlogContentSimpleProps {
  initialPosts: BlogPostEnhanced[];
}

export default function BlogContentSimple({
  initialPosts,
}: BlogContentSimpleProps) {
  const {
    fetchPosts,
    loading: apiLoading,
    error: apiError,
    clearError,
  } = useBlogApi();
  const { state, dispatch, setFilter, filteredPosts } =
    useBlogState(initialPosts);

  // Load saved filter from localStorage on mount
  useState(() => {
    const savedFilter = blogStorage.getFilter();
    if (Object.keys(savedFilter).length > 0) {
      setFilter(savedFilter);
    }
  });

  const handleFilterChange = async (filter: BlogFilter) => {
    // Clear any previous errors
    clearError();

    // Update state filter for immediate responsiveness
    setFilter(filter);

    // Save filter to localStorage
    blogStorage.setFilter(filter);

    // Fetch filtered posts from API
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const posts = await fetchPosts(filter);
      dispatch({ type: 'SET_POSTS', payload: posts });

      // Update pagination info
      dispatch({
        type: 'UPDATE_PAGINATION',
        payload: {
          total: posts.length,
          hasMore: false, // For simplicity, implement infinite scroll later
        },
      });
    } catch {
      const blogError = createBlogError(
        'FILTER_ERROR',
        'Failed to filter posts',
        {
          filter: JSON.stringify(filter),
        }
      );
      dispatch({ type: 'SET_ERROR', payload: blogError });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const isLoading = state.loading || apiLoading;
  const error = state.error || apiError;

  return (
    <div className='space-y-8'>
      {/* Search and Filter */}
      <BlogSearchAndFilterSimple onFilterChange={handleFilterChange} />

      {/* Error Display */}
      {error && (
        <div
          className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md'
          role='alert'
        >
          <div className='flex'>
            <div className='py-1'>
              <svg
                className='fill-current h-4 w-4 text-red-500 mr-2'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M10 2a8 8 0 100 16 8 8 0 000-16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 4a1 1 0 110 2v3a1 1 0 11-2 0v-4a1 1 0 011-1z' />
              </svg>
            </div>
            <div>
              <p className='font-bold'>Error loading blog posts</p>
              <p className='text-sm'>{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <BlogGridSimple
        posts={filteredPosts}
        loading={isLoading}
        error={error?.message}
        emptyMessage={
          filteredPosts.length === 0 && !isLoading
            ? 'No posts found matching your criteria. Try adjusting your filters.'
            : undefined
        }
      />
    </div>
  );
}
```

## File: `components/blog/BlogErrorBoundary.tsx`

```tsx
'use client';

import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface BlogErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error;
    resetErrorBoundary: () => void;
  }>;
}

interface BlogErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class BlogErrorBoundaryClass extends React.Component<
  BlogErrorBoundaryProps,
  BlogErrorBoundaryState
> {
  constructor(props: BlogErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): BlogErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Blog Error Boundary caught an error:', error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // reportError(error, errorInfo);
      console.error('Blog rendering error:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetErrorBoundary={this.resetErrorBoundary}
          />
        );
      }

      // Default fallback UI
      return (
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-4xl mx-auto'>
            <Card className='border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'>
              <CardHeader className='pb-4'>
                <div className='flex items-center space-x-3'>
                  <ExclamationTriangleIcon className='h-6 w-6 text-red-600 dark:text-red-400' />
                  <h2 className='text-xl font-semibold text-red-800 dark:text-red-200'>
                    Content Loading Error
                  </h2>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-red-700 dark:text-red-300'>
                  We encountered an error while loading this blog content. This
                  might be due to:
                </p>
                <ul className='list-disc list-inside text-red-600 dark:text-red-400 space-y-1 text-sm'>
                  <li>Invalid content format</li>
                  <li>Missing or corrupted data</li>
                  <li>Temporary server issues</li>
                </ul>

                {process.env.NODE_ENV === 'development' && (
                  <details className='mt-4'>
                    <summary className='cursor-pointer text-sm font-medium text-red-800 dark:text-red-200'>
                      Error Details (Development Only)
                    </summary>
                    <div className='mt-2 p-3 bg-red-100 dark:bg-red-900 rounded border border-red-200 dark:border-red-700'>
                      <p className='text-xs font-mono text-red-800 dark:text-red-200 mb-2'>
                        {this.state.error.name}: {this.state.error.message}
                      </p>
                      <pre className='text-xs text-red-700 dark:text-red-300 overflow-x-auto'>
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </details>
                )}

                <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                  <Button
                    onClick={this.resetErrorBoundary}
                    className='flex items-center space-x-2'
                  >
                    <ArrowPathIcon className='h-4 w-4' />
                    <span>Try Again</span>
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => (window.location.href = '/blog')}
                    className='flex items-center space-x-2'
                  >
                    <span>Back to Blog</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for consistency with other components
export default function BlogErrorBoundary({
  children,
  fallback,
}: BlogErrorBoundaryProps) {
  return (
    <BlogErrorBoundaryClass fallback={fallback}>
      {children}
    </BlogErrorBoundaryClass>
  );
}

// Export a specialized fallback for MDX errors
export function MDXErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const isMDXError =
    error.message.toLowerCase().includes('mdx') ||
    error.message.toLowerCase().includes('compile');

  return (
    <div className='prose prose-gray max-w-none'>
      <div className='border border-orange-200 bg-orange-50 rounded-lg p-6 dark:border-orange-800 dark:bg-orange-950'>
        <div className='flex items-start space-x-3'>
          <ExclamationTriangleIcon className='h-6 w-6 text-orange-600 dark:text-orange-400 mt-1' />
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2'>
              {isMDXError ? 'MDX Compilation Error' : 'Content Rendering Error'}
            </h3>
            <p className='text-orange-700 dark:text-orange-300 mb-4'>
              {isMDXError
                ? 'There was an error processing the MDX content. This might be due to invalid syntax or unsupported components.'
                : 'There was an error rendering this content. Please try refreshing the page.'}
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className='mb-4'>
                <summary className='cursor-pointer text-sm font-medium text-orange-800 dark:text-orange-200'>
                  Technical Details
                </summary>
                <div className='mt-2 p-3 bg-orange-100 dark:bg-orange-900 rounded border border-orange-200 dark:border-orange-700'>
                  <p className='text-xs font-mono text-orange-800 dark:text-orange-200'>
                    {error.message}
                  </p>
                </div>
              </details>
            )}

            <div className='flex space-x-3'>
              <button
                onClick={resetErrorBoundary}
                className='px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors flex items-center space-x-2'
              >
                <ArrowPathIcon className='h-4 w-4' />
                <span>Retry</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className='px-4 py-2 border border-orange-300 text-orange-700 rounded hover:bg-orange-100 transition-colors'
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```
