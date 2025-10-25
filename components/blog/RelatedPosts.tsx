import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        <p className='text-muted-foreground'>Discover more content similar to what you just read</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.map((post) => (
          <Card key={post.slug} className='group hover:shadow-md transition-all duration-200'>
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
