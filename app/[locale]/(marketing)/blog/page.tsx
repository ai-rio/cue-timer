import { Filter, Search, X } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import BlogPostCard from '@/components/blog/BlogPostCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllPosts } from '@/lib/blog';
import { blogCategories, BlogPost } from '@/types/blog';
import { BlogPostEnhanced } from '@/types/blog-api';

// Convert BlogPostEnhanced to BlogPost for compatibility with BlogPostCard
function convertToBlogPost(enhanced: BlogPostEnhanced): BlogPost {
  return {
    slug: enhanced.slug,
    title: enhanced.title,
    summary: enhanced.summary,
    category: enhanced.category,
    author: enhanced.author,
    publishedAt: enhanced.publishedAt,
    readTime: enhanced.readTime,
    image: enhanced.image,
    imageAlt: enhanced.imageAlt,
    featured: enhanced.featured,
    draft: enhanced.draft,
    tags: enhanced.tags,
    lastModified: enhanced.lastModified,
    seo: enhanced.seo,
    content: enhanced.content,
    excerpt: enhanced.excerpt,
    wordCount: enhanced.wordCount,
    publishedAtDate: enhanced.publishedAtDate,
  };
}

interface BlogPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    category?: string;
    featured?: string;
    search?: string;
  }>;
}

// Generate metadata for the blog page with SEO best practices
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      locale,
      siteName: 'CueTimer',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        en: '/en/blog',
        es: '/es/blog',
        'pt-br': '/pt-br/blog',
        fr: '/fr/blog',
        de: '/de/blog',
      },
    },
  };
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params;
  const { category, featured, search } = await searchParams;

  // Set locale for static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'blog' });

  // Get all posts for server-side rendering
  const allPosts = await getAllPosts({ includeDrafts: false });
  const featuredPosts = allPosts.filter((post) => post.featured);

  // Filter posts based on search params
  const filteredPosts = allPosts.filter((post) => {
    if (category && category !== 'all' && post.category !== category) return false;
    if (featured === 'true' && !post.featured) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.summary.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      {/* Header Section */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4 dark:text-gray-100'>
          {t('title')}
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-400'>
          {t('description')}
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className='mb-8 space-y-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search Input */}
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <Input
              type='text'
              placeholder={t('filter.searchPlaceholder')}
              defaultValue={search}
              className='pl-10'
              name='search'
            />
          </div>

          {/* Category Filter */}
          <div className='w-full lg:w-48'>
            <Select name='category' defaultValue={category}>
              <SelectTrigger>
                <Filter className='h-4 w-4 mr-2' />
                <SelectValue placeholder={t('filter.categoryLabel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('filter.allCategories')}</SelectItem>
                {Object.entries(blogCategories).map(([key, _label]) => (
                  <SelectItem key={key} value={key}>
                    {t(`categories.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Featured Filter */}
          <div className='w-full lg:w-48'>
            <Select name='featured' defaultValue={featured}>
              <SelectTrigger>
                <SelectValue placeholder='Featured' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('filter.allPosts')}</SelectItem>
                <SelectItem value='true'>{t('filter.featuredOnly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {((category && category !== 'all') || featured || search) && (
            <Button variant='outline' asChild>
              <a href='/blog' className='flex items-center gap-2'>
                <X className='h-4 w-4' />
                {t('filter.clearFilters')}
              </a>
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {((category && category !== 'all') || featured || search) && (
          <div className='flex flex-wrap gap-2 items-center'>
            <span className='text-sm font-medium text-gray-600'>{t('filter.activeFilters')}:</span>
            {category && category !== 'all' && (
              <Badge variant='secondary'>{t(`categories.${category}`)}</Badge>
            )}
            {featured === 'true' && <Badge variant='secondary'>{t('filter.featuredOnly')}</Badge>}
            {search && <Badge variant='secondary'>"{search}"</Badge>}
          </div>
        )}
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue='all' className='mb-8'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='all'>
            {t('tabs.allPosts')} ({filteredPosts.length})
          </TabsTrigger>
          <TabsTrigger value='featured'>
            {t('tabs.featured')} ({featuredPosts.length})
          </TabsTrigger>
          <TabsTrigger value='categories'>{t('tabs.categories')}</TabsTrigger>
        </TabsList>

        <TabsContent value='all' className='space-y-6'>
          <Suspense
            fallback={
              <div className='animate-pulse'>
                <div className='h-8 bg-gray-200 rounded mb-8 w-1/3'></div>
                <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className='bg-gray-200 rounded-lg border border-gray-300 h-80' />
                  ))}
                </div>
              </div>
            }
          >
            {filteredPosts.length > 0 ? (
              <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                {filteredPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={convertToBlogPost(post)} />
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>{t('noResults.title')}</h3>
                <p className='text-gray-600 mb-4'>{t('noResults.description')}</p>
                <Button asChild>
                  <a href='/blog'>{t('noResults.clearFilters')}</a>
                </Button>
              </div>
            )}
          </Suspense>
        </TabsContent>

        <TabsContent value='featured' className='space-y-6'>
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {featuredPosts.map((post) => (
              <BlogPostCard key={post.slug} post={convertToBlogPost(post)} variant='featured' />
            ))}
          </div>
        </TabsContent>

        <TabsContent value='categories' className='space-y-6'>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {Object.entries(blogCategories).map(([key, _label]) => {
              const categoryPosts = allPosts.filter((post) => post.category === key);
              return (
                <Card key={key} className='hover:shadow-lg transition-shadow'>
                  <CardHeader>
                    <CardTitle className='text-lg'>{t(`categories.${key}`)}</CardTitle>
                    <CardDescription>
                      {categoryPosts.length} {t('stats.posts')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-gray-600 mb-4'>
                      Browse all {t(`categories.${key}`)} articles
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className='w-full'>
                      <a href={`/blog?category=${key}`}>
                        {t('categories.browse')} {t(`categories.${key}`)}
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Newsletter Section */}
      <Card className='mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>{t('newsletter.title')}</CardTitle>
          <CardDescription>{t('newsletter.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'>
            <Input
              type='email'
              placeholder={t('newsletter.placeholder')}
              className='flex-1'
              required
              suppressHydrationWarning
            />
            <Button type='submit' className='w-full sm:w-auto'>
              {t('newsletter.subscribe')}
            </Button>
          </form>
          <p className='text-xs text-gray-500 text-center mt-4'>{t('newsletter.privacy')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
