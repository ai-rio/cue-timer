import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogPostNavigation as BlogPostNavigationType } from '@/types/blog';

interface BlogPostNavigationProps {
  navigation: BlogPostNavigationType;
}

export default function BlogPostNavigation({ navigation }: BlogPostNavigationProps) {
  const { previous, next } = navigation;

  return (
    <nav className='mt-16 border-t pt-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Previous Post */}
        {previous ? (
          <Card className='relative overflow-hidden group cursor-pointer transition-all duration-200 hover:shadow-md'>
            <Link href={`/blog/${previous.slug}`} className='block h-full'>
              <CardHeader className='pb-3'>
                <div className='flex items-center text-sm text-muted-foreground mb-2'>
                  <span className='mr-2'>←</span>
                  Previous Article
                </div>
                <CardTitle className='text-lg leading-tight group-hover:text-primary transition-colors'>
                  {previous.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-0'>
                <CardDescription className='text-sm line-clamp-2 mb-3'>
                  {previous.summary}
                </CardDescription>
                <div className='flex items-center justify-between'>
                  <Badge variant='secondary' className='text-xs'>
                    {previous.category}
                  </Badge>
                  <span className='text-xs text-muted-foreground'>
                    {previous.readTime} min read
                  </span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ) : (
          <div className='md:col-start-1'></div>
        )}

        {/* Next Post */}
        {next ? (
          <Card className='relative overflow-hidden group cursor-pointer transition-all duration-200 hover:shadow-md md:col-start-2'>
            <Link href={`/blog/${next.slug}`} className='block h-full'>
              <CardHeader className='pb-3 text-right'>
                <div className='flex items-center justify-end text-sm text-muted-foreground mb-2'>
                  Next Article
                  <span className='ml-2'>→</span>
                </div>
                <CardTitle className='text-lg leading-tight group-hover:text-primary transition-colors'>
                  {next.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-0 text-right'>
                <CardDescription className='text-sm line-clamp-2 mb-3 ml-auto'>
                  {next.summary}
                </CardDescription>
                <div className='flex items-center justify-end gap-2'>
                  <span className='text-xs text-muted-foreground'>{next.readTime} min read</span>
                  <Badge variant='secondary' className='text-xs'>
                    {next.category}
                  </Badge>
                </div>
              </CardContent>
            </Link>
          </Card>
        ) : (
          <div className='md:col-start-2'></div>
        )}
      </div>

      {/* Back to Blog Button */}
      <div className='text-center mt-8'>
        <Button asChild variant='outline'>
          <Link href='/blog'>← Back to All Articles</Link>
        </Button>
      </div>
    </nav>
  );
}
