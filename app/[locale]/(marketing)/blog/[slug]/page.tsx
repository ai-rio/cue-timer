import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import BlogPostContent from '@/components/blog/BlogPostContent';
import BlogPostNavigation from '@/components/blog/BlogPostNavigation';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getAllPosts, getPostBySlug, getPostNavigation, getRelatedPosts } from '@/lib/blog';

interface BlogPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for the blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | CueTimer Blog',
    };
  }

  const isDraft = post.draft;
  const baseTitle = isDraft
    ? `[DRAFT] ${post.title} | CueTimer Blog`
    : `${post.title} | CueTimer Blog`;

  return {
    title: baseTitle,
    description: post.summary,
    keywords: [...post.tags, post.category, 'CueTimer', 'event timing', 'productivity'],
    authors: [{ name: post.author }],
    // Add noindex for draft posts
    robots: isDraft ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.lastModified || post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: post.image
        ? [
            {
              url: post.image,
              alt: post.imageAlt || post.title,
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const isDraft = post.draft;

  // Get navigation and related posts (exclude drafts from related posts)
  const [navigation, relatedPosts] = await Promise.all([
    getPostNavigation(slug),
    getRelatedPosts(post, 3),
  ]);

  // Format dates
  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const modifiedDate = post.lastModified
    ? new Date(post.lastModified).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Draft warning banner */}
        {isDraft && (
          <div className='mb-6 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950'>
            <div className='flex items-start space-x-3'>
              <span className='text-xl'>🚧</span>
              <div>
                <h3 className='font-semibold text-yellow-800 dark:text-yellow-200'>
                  Draft Post - Work in Progress
                </h3>
                <p className='text-sm text-yellow-700 dark:text-yellow-300 mt-1'>
                  This is a draft post and is not yet ready for publication. Content may change, and
                  this post is not indexed by search engines.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Article Header */}
        <article className='mb-8'>
          <header className='mb-8'>
            {/* Breadcrumb and category */}
            <div className='flex items-center gap-2 mb-4 text-sm text-muted-foreground'>
              <a href='/blog' className='hover:text-primary transition-colors'>
                Blog
              </a>
              <span>/</span>
              <Badge variant='secondary' className='text-xs'>
                {post.category}
              </Badge>
              {post.featured && (
                <Badge variant='default' className='text-xs'>
                  Featured
                </Badge>
              )}
              {isDraft && (
                <Badge
                  variant='outline'
                  className='text-xs border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300'
                >
                  Draft
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className='text-4xl font-bold tracking-tight mb-4 leading-tight'>{post.title}</h1>

            {/* Summary */}
            <p className='text-xl text-muted-foreground mb-6 leading-relaxed'>{post.summary}</p>

            {/* Meta information */}
            <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6'>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>By {post.author}</span>
              </div>
              <Separator orientation='vertical' className='h-4' />
              <div className='flex items-center gap-2'>
                <time dateTime={post.publishedAt}>Published on {publishedDate}</time>
              </div>
              <Separator orientation='vertical' className='h-4' />
              <div className='flex items-center gap-2'>
                <span>{post.readTime} min read</span>
              </div>
              <Separator orientation='vertical' className='h-4' />
              <div className='flex items-center gap-2'>
                <span>{post.wordCount} words</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-6'>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant='outline' className='text-xs'>
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Featured image */}
            {post.image && (
              <div className='mb-8'>
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  width={800}
                  height={400}
                  className='w-full h-auto rounded-lg border shadow-lg'
                  priority
                />
              </div>
            )}
          </header>

          <BlogPostContent content={post.content} />
        </article>

        {/* Share section */}
        <div className='mb-8'>
          <Card>
            <CardHeader>
              <h3 className='text-lg font-semibold'>Share this article</h3>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-3'>
                <Button variant='outline' size='sm' asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://cuetimer.com/blog/${post.slug}`)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Share on Twitter
                  </a>
                </Button>
                <Button variant='outline' size='sm' asChild>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://cuetimer.com/blog/${post.slug}`)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Share on LinkedIn
                  </a>
                </Button>
                <Button variant='outline' size='sm' asChild>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://cuetimer.com/blog/${post.slug}`)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Share on Facebook
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <BlogPostNavigation navigation={navigation} />

        {/* Related posts */}
        <RelatedPosts posts={relatedPosts} />

        {/* Modified date */}
        {modifiedDate && (
          <div className='text-center text-sm text-muted-foreground mt-8'>
            <p>Last updated: {modifiedDate}</p>
          </div>
        )}
      </div>
    </div>
  );
}
