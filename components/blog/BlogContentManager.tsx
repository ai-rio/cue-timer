'use client';

import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Heart,
  MessageSquare,
  PauseCircle,
  PlayCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogAnalytics, BlogPostEnhanced, ContentMetrics, SEOResult } from '@/types/blog-enhanced';

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

  async getSEOScore(slug: string): Promise<SEOResult> {
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

  async publishPost(slug: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      message: `Post ${slug} published successfully`,
    };
  },

  async unpublishPost(slug: string): Promise<{ success: boolean; message: string }> {
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
  const viewTimeRatio = (metrics.readTime / metrics.views).toFixed(2);

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
            <div className='text-2xl font-bold text-primary'>{metrics.views.toLocaleString()}</div>
            <div className='text-sm text-muted-foreground'>Total Views</div>
          </div>
          <div>
            <div className='text-2xl font-bold text-primary'>{metrics.readTime}m</div>
            <div className='text-sm text-muted-foreground'>Avg Read Time</div>
          </div>
          <div>
            <div className='text-2xl font-bold text-primary'>{engagementRate}%</div>
            <div className='text-sm text-muted-foreground'>Engagement Rate</div>
          </div>
          <div>
            <div className='text-2xl font-bold text-primary'>{metrics.seoScore}</div>
            <div className='text-sm text-muted-foreground'>SEO Score</div>
          </div>
        </div>

        {/* Feature engagement */}
        <div>
          <h4 className='font-medium mb-3'>Feature Engagement</h4>
          <div className='space-y-2'>
            {Object.entries(metrics.featureEngagement).map(([feature, count]) => (
              <div key={feature} className='flex items-center justify-between'>
                <span className='text-sm capitalize'>
                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <Badge variant='outline'>{count}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-2'>
          <Button variant='outline' size='sm'>
            <Download className='h-4 w-4 mr-2' />
            Export Data
          </Button>
          <Button variant='outline' size='sm' onClick={() => window.location.reload()}>
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
                      <p className='text-sm text-muted-foreground'>{issue.message}</p>
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
                <div key={index} className='p-3 rounded border border-green-200 bg-green-50'>
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

function QuickActions({ posts = [] }: { posts: BlogPostEnhanced[] }) {
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
              <span className='text-sm'>Executing: {selectedAction.replace(/-/g, ' ')}</span>
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
            <div className='text-2xl font-bold text-primary'>{analytics.totalPosts}</div>
            <div className='text-sm text-muted-foreground'>Total Posts</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary'>{analytics.publishedPosts}</div>
            <div className='text-sm text-muted-foreground'>Published</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary'>
              {analytics.totalViews.toLocaleString()}
            </div>
            <div className='text-sm text-muted-foreground'>Total Views</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary'>{analytics.averageReadTime}m</div>
            <div className='text-sm text-muted-foreground'>Avg Read Time</div>
          </div>
        </div>

        {/* Top categories */}
        <div>
          <h4 className='font-medium mb-3'>Top Categories</h4>
          <div className='space-y-2'>
            {analytics.topCategories.map((category, index) => (
              <div key={index} className='flex items-center justify-between'>
                <span className='capitalize'>{category.category.replace('-', ' ')}</span>
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
                  <Badge variant='secondary'>{author.totalViews.toLocaleString()} views</Badge>
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
              <label className='block text-sm font-medium mb-2'>Select Post for Metrics</label>
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
              <label className='block text-sm font-medium mb-2'>Select Post for SEO Analysis</label>
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
