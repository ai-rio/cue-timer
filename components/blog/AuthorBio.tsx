'use client';

import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Twitter,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AuthorInfo, BlogPostEnhanced } from '@/types/blog-enhanced';

interface AuthorBioProps {
  author: AuthorInfo;
  posts?: BlogPostEnhanced[];
  compact?: boolean;
  showContact?: boolean;
  showSocial?: boolean;
  showStats?: boolean;
  className?: string;
}

interface SocialLinkProps {
  platform: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

function SocialLink({ platform, url, icon: Icon, label }: SocialLinkProps) {
  if (!url) return null;

  return (
    <Button variant='outline' size='sm' asChild>
      <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center gap-2'
        aria-label={`Follow ${label} on ${platform}`}
      >
        <Icon className='h-4 w-4' />
        <span className='hidden sm:inline'>{label}</span>
      </a>
    </Button>
  );
}

function AuthorStats({ author, posts }: { author: AuthorInfo; posts?: BlogPostEnhanced[] }) {
  const stats = useMemo((): AuthorInfo['stats'] => {
    // Calculate stats from posts if not provided
    if (!posts) {
      return (
        author.stats || {
          postsCount: 0,
          totalViews: 0,
          totalReadTime: 0,
          averageRating: 0,
        }
      );
    }

    const authorPosts = posts.filter((post) => post.author === author.name);
    const totalViews = authorPosts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalReadTime = authorPosts.reduce((sum, post) => sum + (post.readTime || 0), 0);

    return {
      postsCount: authorPosts.length,
      totalViews,
      totalReadTime,
      averageRating: author.stats.averageRating || 0,
    };
  }, [author, posts]);

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <BarChart3 className='h-5 w-5' />
          <h4 className='font-semibold'>Author Stats</h4>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary'>{stats.postsCount}</div>
            <div className='text-sm text-muted-foreground'>Posts</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary'>
              {stats.totalViews.toLocaleString()}
            </div>
            <div className='text-sm text-muted-foreground'>Views</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary'>
              {Math.round(stats.totalReadTime / stats.postsCount)}m
            </div>
            <div className='text-sm text-muted-foreground'>Avg Read Time</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary'>{stats.averageRating.toFixed(1)}</div>
            <div className='text-sm text-muted-foreground'>Rating</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentPosts({ posts, authorName }: { posts: BlogPostEnhanced[]; authorName: string }) {
  const authorPosts = useMemo(
    () =>
      posts
        .filter((post) => post.author === authorName)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 3),
    [posts, authorName]
  );

  if (authorPosts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <BookOpen className='h-5 w-5' />
          <h4 className='font-semibold'>Recent Posts</h4>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {authorPosts.map((post) => (
            <div key={post.slug} className='border rounded-lg p-4'>
              <div className='space-y-2'>
                <h5 className='font-semibold hover:text-primary cursor-pointer'>
                  <a href={`/blog/${post.slug}`}>{post.title}</a>
                </h5>
                <p className='text-sm text-muted-foreground line-clamp-2'>
                  {post.excerpt || post.summary}
                </p>
                <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-3 w-3' />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Users className='h-3 w-3' />
                    <span>{post.views?.toLocaleString() || '0'} views</span>
                  </div>
                  {post.readTime && (
                    <div className='flex items-center gap-1'>
                      <BookOpen className='h-3 w-3' />
                      <span>{post.readTime} min</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuthorBio({
  author,
  posts = [],
  compact = false,
  showContact = true,
  showSocial = true,
  showStats = true,
  className = '',
}: AuthorBioProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // In a real implementation, this would call an API
    console.log(`${isFollowing ? 'Unfollowing' : 'Following'} ${author.name}`);
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Avatar className='h-10 w-10'>
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <h4 className='font-semibold'>{author.name}</h4>
            {author.specialties && author.specialties.length > 0 && (
              <Badge variant='secondary' className='text-xs'>
                {author.specialties[0]}
              </Badge>
            )}
          </div>
          <p className='text-sm text-muted-foreground line-clamp-1'>{author.role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main author information */}
      <Card>
        <CardHeader>
          <div className='flex items-start gap-4'>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className='text-lg'>
                {author.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-3 mb-2'>
                <h3 className='text-2xl font-bold'>{author.name}</h3>
                <Button
                  variant={isFollowing ? 'default' : 'outline'}
                  size='sm'
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>

              <p className='text-lg text-muted-foreground mb-1'>{author.role}</p>

              <div className='flex flex-wrap gap-2 mb-3'>
                {author.specialties?.map((specialty, index) => (
                  <Badge key={index} variant='secondary' className='text-xs'>
                    {specialty}
                  </Badge>
                ))}
              </div>

              <p className='text-muted-foreground leading-relaxed'>{author.bio}</p>

              <div className='flex items-center gap-1 text-sm text-muted-foreground mt-2'>
                <Calendar className='h-4 w-4' />
                <span>Joined {new Date(author.joinedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Social links */}
      {showSocial && author.social && (
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Globe className='h-5 w-5' />
              <h4 className='font-semibold'>Connect</h4>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-3'>
              <SocialLink
                platform='Twitter'
                url={author.social?.twitter || ''}
                icon={Twitter}
                label='Twitter'
              />
              <SocialLink
                platform='LinkedIn'
                url={author.social?.linkedin || ''}
                icon={Linkedin}
                label='LinkedIn'
              />
              <SocialLink
                platform='GitHub'
                url={author.social?.github || ''}
                icon={Github}
                label='GitHub'
              />
              <SocialLink
                platform='Website'
                url={author.social?.website || ''}
                icon={Globe}
                label='Website'
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Author stats */}
      {showStats && <AuthorStats author={author} posts={posts} />}

      {/* Recent posts */}
      <RecentPosts posts={posts} authorName={author.name} />

      {/* Contact information */}
      {showContact && (
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Mail className='h-5 w-5' />
              <h4 className='font-semibold'>Get in Touch</h4>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <p className='text-sm text-muted-foreground'>
                Have a question or want to collaborate? Feel free to reach out!
              </p>
              <div className='flex flex-col gap-3'>
                <Button variant='outline' className='w-full justify-start' asChild>
                  <a href={`mailto:${author.name.toLowerCase().replace(' ', '.')}@cuetimer.com`}>
                    <Mail className='h-4 w-4 mr-2' />
                    Send Email
                  </a>
                </Button>
                <Button variant='outline' className='w-full justify-start' asChild>
                  <a href='/blog/contact'>
                    <MessageSquare className='h-4 w-4 mr-2' />
                    Contact Form
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
