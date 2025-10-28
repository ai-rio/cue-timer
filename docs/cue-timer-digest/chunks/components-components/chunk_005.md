# Chunk 5: components_components

## Metadata

- **Files**: 3
- **Size**: 31,652 characters (~7,913 tokens)
- **Categories**: components

## Files in this chunk

- `components/blog/AdvancedBlogSearchAndFilter.tsx`
- `components/blog/AuthorBio.tsx`
- `components/blog/BlogContent.tsx`

---

## File: `components/blog/AdvancedBlogSearchAndFilter.tsx`

```tsx
'use client';

import type { FuseResult } from 'fuse.js';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BlogPostEnhanced,
  BlogPostFilters,
  BlogSearchResult,
} from '@/types/blog-enhanced';

// Dynamic import for Fuse.js - not a React component
let FuseClass: (typeof import('fuse.js'))['default'] | null = null;
const loadFuse = async () => {
  if (!FuseClass) {
    const module = await import('fuse.js');
    FuseClass = module.default;
  }
  return FuseClass;
};

// Tree-shakeable icon imports
import {
  Award,
  BookOpen,
  ChevronDown,
  Clock,
  Filter,
  Search,
  Users,
  X,
} from 'lucide-react';

// Template configurations
const TEMPLATE_OPTIONS = [
  {
    value: 'timing-guide',
    label: 'Timing Guide',
    icon: Clock,
    color: 'bg-blue-500',
  },
  {
    value: 'case-study',
    label: 'Case Study',
    icon: Award,
    color: 'bg-green-500',
  },
  {
    value: 'feature-announce',
    label: 'Feature Release',
    icon: BookOpen,
    color: 'bg-purple-500',
  },
  {
    value: 'presentation-tips',
    label: 'Presentation Tips',
    icon: Users,
    color: 'bg-orange-500',
  },
];

const DIFFICULTY_OPTIONS = [
  {
    value: 'beginner',
    label: 'Beginner',
    color: 'bg-green-100 text-green-800',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    color: 'bg-yellow-100 text-yellow-800',
  },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' },
  {
    value: 'all-levels',
    label: 'All Levels',
    color: 'bg-gray-100 text-gray-800',
  },
];

const SORT_OPTIONS = [
  { value: 'date', label: 'Publication Date' },
  { value: 'title', label: 'Title' },
  { value: 'readTime', label: 'Reading Time' },
  { value: 'views', label: 'Popularity' },
  { value: 'seoScore', label: 'SEO Score' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'pt-br', label: 'Português', flag: '🇧🇷' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
];

// Common tags for quick selection
const COMMON_TAGS = [
  'timer',
  'presentation',
  'event-management',
  'productivity',
  'tips',
  'tutorial',
  'best-practices',
  'automation',
  'efficiency',
  'public-speaking',
  'meeting',
  'workshop',
  'conference',
  'keynote',
  'facilitation',
  'time-management',
];

interface AdvancedBlogSearchAndFilterProps {
  posts: BlogPostEnhanced[];
  initialFilters?: Partial<BlogPostFilters>;
  onFiltersChange: (filters: BlogPostFilters) => void;
  onSearchResults?: (results: BlogSearchResult[]) => void;
  className?: string;
  showAdvanced?: boolean;
}

// Custom Fuse.js options for blog search
const FUSE_OPTIONS: import('fuse.js').IFuseOptions<BlogPostEnhanced> = {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'summary', weight: 2 },
    { name: 'content', weight: 1 },
    { name: 'tags', weight: 2 },
    { name: 'category', weight: 1.5 },
    { name: 'author', weight: 1.5 },
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
  shouldSort: true,
  findAllMatches: true,
};

export default function AdvancedBlogSearchAndFilter({
  posts,
  initialFilters = {},
  onFiltersChange,
  onSearchResults,
  className = '',
  showAdvanced = true,
}: AdvancedBlogSearchAndFilterProps) {
  // State for filters
  const [filters, setFilters] = useState<BlogPostFilters>({
    search: '',
    category: undefined,
    template: undefined,
    difficulty: undefined,
    language: undefined,
    author: undefined,
    tags: [],
    featured: undefined,
    sortBy: 'date',
    sortOrder: 'desc',
    ...initialFilters,
  });

  // State for UI
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialFilters.tags || []
  );
  const [searchInput, setSearchInput] = useState(initialFilters.search || '');

  // Initialize Fuse instance with dynamic loading
  const [fuse, setFuse] = useState<
    import('fuse.js').default<BlogPostEnhanced> | null
  >(null);

  useEffect(() => {
    const initializeFuse = async () => {
      if (typeof window === 'undefined' || posts.length === 0) return;
      try {
        const FuseConstructor = await loadFuse();
        const fuseInstance = new FuseConstructor(posts, FUSE_OPTIONS);
        setFuse(fuseInstance);
      } catch {
        console.warn(
          'Fuse.js not loaded yet, search will be available shortly'
        );
      }
    };

    initializeFuse();
  }, [posts]);

  // Search functionality
  const performSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        return posts;
      }

      if (!fuse) {
        // Fallback to basic string matching if Fuse is not loaded
        return posts.filter(
          (post) =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.summary.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase())
        );
      }

      const results = fuse?.search(query) || [];
      return results.map((result: FuseResult<BlogPostEnhanced>) => ({
        ...result.item,
        _searchScore: result.score || 0,
        _searchMatches: result.matches || [],
      }));
    },
    [fuse, posts]
  );

  // Handle search input with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const searchResults = performSearch(searchInput);
      onSearchResults?.(
        searchResults.map(
          (
            result: BlogPostEnhanced & {
              _searchScore?: number;
              _searchMatches?: Array<{ key?: string; value?: string }>;
            }
          ) => ({
            post: result as BlogPostEnhanced,
            score: result._searchScore || 0,
            matches:
              result._searchMatches?.map((match) => ({
                field: match.key || '',
                value: match.value || '',
                indices: (match as { indices?: number[] }).indices || [],
              })) || [],
          })
        )
      );

      // Update filters with search
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, performSearch, onSearchResults]);

  // Apply filters to posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Apply search filter
    if (filters.search) {
      filtered = performSearch(filters.search);
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((post) => post.category === filters.category);
    }

    // Apply template filter
    if (filters.template) {
      filtered = filtered.filter(
        (post) => post.templateId === filters.template
      );
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(
        (post) => post.difficulty === filters.difficulty
      );
    }

    // Apply language filter
    if (filters.language) {
      filtered = filtered.filter((post) => post.language === filters.language);
    }

    // Apply author filter
    if (filters.author) {
      filtered = filtered.filter((post) =>
        post.author.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    // Apply tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.some((tag) => post.tags?.includes(tag))
      );
    }

    // Apply featured filter
    if (filters.featured !== undefined) {
      filtered = filtered.filter((post) => post.featured === filters.featured);
    }

    // Apply date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter((post) => {
        const postDate = new Date(post.publishedAt);
        return postDate >= start && postDate <= end;
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: number | string, bValue: number | string;

        switch (filters.sortBy) {
          case 'date':
            aValue = new Date(a.publishedAt).getTime();
            bValue = new Date(b.publishedAt).getTime();
            break;
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'readTime':
            aValue = a.readTime || 0;
            bValue = b.readTime || 0;
            break;
          case 'views':
            aValue = a.views || 0;
            bValue = b.views || 0;
            break;
          case 'seoScore':
            aValue = a.seoScore || 0;
            bValue = b.seoScore || 0;
            break;
          default:
            aValue = a.title;
            bValue = b.title;
        }

        if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [posts, filters, selectedTags, performSearch]);

  // Update parent component when filters change
  useEffect(() => {
    onFiltersChange({ ...filters, tags: selectedTags });
  }, [filters, selectedTags, onFiltersChange]);

  // Handle filter changes
  const updateFilter = (
    key: keyof BlogPostFilters,
    value: BlogPostFilters[keyof BlogPostFilters]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];

      // Clear template filter when specific tags are selected
      if (newTags.length > 0 && filters.template) {
        updateFilter('template', undefined);
      }

      return newTags;
    });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSelectedTags([]);
    setFilters({
      search: '',
      category: undefined,
      template: undefined,
      difficulty: undefined,
      language: undefined,
      author: undefined,
      tags: [],
      featured: undefined,
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.template) count++;
    if (filters.difficulty) count++;
    if (filters.language) count++;
    if (filters.author) count++;
    if (selectedTags.length > 0) count++;
    if (filters.featured !== undefined) count++;
    return count;
  };

  return (
    <Suspense
      fallback={
        <div className={`space-y-4 ${className}`}>
          <div className='animate-pulse'>
            <div className='h-10 bg-gray-200 rounded mb-4'></div>
            <div className='flex gap-2 mb-4'>
              <div className='h-10 w-40 bg-gray-200 rounded'></div>
              <div className='h-10 w-32 bg-gray-200 rounded'></div>
              <div className='h-10 w-36 bg-gray-200 rounded'></div>
            </div>
          </div>
        </div>
      }
    >
      <div className={`space-y-4 ${className}`}>
        {/* Search bar */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            type='text'
            placeholder='Search blog posts by title, content, or author...'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className='pl-10 pr-10'
          />
          {searchInput && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setSearchInput('')}
              className='absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0'
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>

        {/* Quick filters row */}
        <div className='flex flex-wrap gap-2'>
          {/* Template filter */}
          <Select
            value={filters.template || ''}
            onValueChange={(value) => {
              updateFilter('template', value || undefined);
              // Clear tags when template is selected
              if (value) setSelectedTags([]);
            }}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='All Templates' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>All Templates</SelectItem>
              {TEMPLATE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className='flex items-center gap-2'>
                    <option.icon className='h-4 w-4' />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Difficulty filter */}
          <Select
            value={filters.difficulty || ''}
            onValueChange={(value) =>
              updateFilter('difficulty', value || undefined)
            }
          >
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='All Levels' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>All Levels</SelectItem>
              {DIFFICULTY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <Badge
                    variant='outline'
                    className={`text-xs ${option.color}`}
                  >
                    {option.label}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Language filter */}
          <Select
            value={filters.language || ''}
            onValueChange={(value) =>
              updateFilter('language', value || undefined)
            }
          >
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='All Languages' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>All Languages</SelectItem>
              {LANGUAGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className='flex items-center gap-2'>
                    <span>{option.flag}</span>
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort options */}
          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              updateFilter(
                'sortBy',
                sortBy as 'date' | 'title' | 'readTime' | 'views' | 'seoScore'
              );
              updateFilter('sortOrder', sortOrder as 'asc' | 'desc');
            }}
          >
            <SelectTrigger className='w-[160px]'>
              <SelectValue placeholder='Sort by...' />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={`${option.value}-desc`}
                  value={`${option.value}-desc`}
                >
                  {option.label} (Newest)
                </SelectItem>
              ))}
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={`${option.value}-asc`}
                  value={`${option.value}-asc`}
                >
                  {option.label} (Oldest)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Featured toggle */}
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='featured'
              checked={filters.featured}
              onCheckedChange={(checked) => updateFilter('featured', checked)}
            />
            <label
              htmlFor='featured'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
            >
              Featured only
            </label>
          </div>
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='w-full justify-between'
              >
                <div className='flex items-center gap-2'>
                  <Filter className='h-4 w-4' />
                  <span>Advanced Filters</span>
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant='secondary' className='ml-2'>
                      {getActiveFiltersCount()} active
                    </Badge>
                  )}
                </div>
                <ChevronDown className='h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180' />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className='space-y-4 pt-4'>
              {/* Common tags */}
              <div>
                <h4 className='text-sm font-medium mb-3'>Common Topics</h4>
                <div className='flex flex-wrap gap-2'>
                  {COMMON_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        selectedTags.includes(tag) ? 'default' : 'outline'
                      }
                      className='cursor-pointer text-xs'
                      onClick={() => toggleTag(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              <div className='flex justify-between items-center pt-2 border-t'>
                <span className='text-sm text-muted-foreground'>
                  {filteredPosts.length} of {posts.length} posts
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={clearAllFilters}
                  className='text-xs'
                >
                  Clear All Filters
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Results summary */}
        <div className='flex items-center justify-between text-sm text-muted-foreground'>
          <span>
            Showing {filteredPosts.length} of {posts.length} posts
            {filters.search && ` matching "${filters.search}"`}
          </span>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearAllFilters}
              className='text-xs'
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </Suspense>
  );
}
```

## File: `components/blog/AuthorBio.tsx`

```tsx
'use client';

import {
  BarChart3,
  BookOpen,
  Calendar,
  Github,
  Globe,
  Linkedin,
  Mail,
  MessageSquare,
  Twitter,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

function AuthorStats({
  author,
  posts,
}: {
  author: AuthorInfo;
  posts?: BlogPostEnhanced[];
}) {
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
    const totalViews = authorPosts.reduce(
      (sum, post) => sum + (post.views || 0),
      0
    );
    const totalReadTime = authorPosts.reduce(
      (sum, post) => sum + (post.readTime || 0),
      0
    );

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
            <div className='text-2xl font-bold text-primary'>
              {stats.postsCount}
            </div>
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
            <div className='text-2xl font-bold text-primary'>
              {stats.averageRating.toFixed(1)}
            </div>
            <div className='text-sm text-muted-foreground'>Rating</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentPosts({
  posts,
  authorName,
}: {
  posts: BlogPostEnhanced[];
  authorName: string;
}) {
  const authorPosts = useMemo(
    () =>
      posts
        .filter((post) => post.author === authorName)
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        )
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
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
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
    console.warn(`${isFollowing ? 'Unfollowing' : 'Following'} ${author.name}`);
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Avatar className='h-10 w-10'>
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>
            {author.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
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
          <p className='text-sm text-muted-foreground line-clamp-1'>
            {author.role}
          </p>
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

              <p className='text-lg text-muted-foreground mb-1'>
                {author.role}
              </p>

              <div className='flex flex-wrap gap-2 mb-3'>
                {author.specialties?.map((specialty, index) => (
                  <Badge key={index} variant='secondary' className='text-xs'>
                    {specialty}
                  </Badge>
                ))}
              </div>

              <p className='text-muted-foreground leading-relaxed'>
                {author.bio}
              </p>

              <div className='flex items-center gap-1 text-sm text-muted-foreground mt-2'>
                <Calendar className='h-4 w-4' />
                <span>
                  Joined {new Date(author.joinedAt).toLocaleDateString()}
                </span>
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
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  asChild
                >
                  <a
                    href={`mailto:${author.name.toLowerCase().replace(' ', '.')}@cuetimer.com`}
                  >
                    <Mail className='h-4 w-4 mr-2' />
                    Send Email
                  </a>
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  asChild
                >
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
```

## File: `components/blog/BlogContent.tsx`

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getAllPosts } from '@/lib/blog';
import type { BlogFilter } from '@/types/blog';
import type { BlogPostEnhanced } from '@/types/blog-api';

import BlogGrid from './BlogGrid';
import BlogSearchAndFilter from './BlogSearchAndFilter';

interface BlogContentProps {
  initialPosts: BlogPostEnhanced[];
}

export default function BlogContent({ initialPosts }: BlogContentProps) {
  const t = useTranslations('Blog');
  const [filteredPosts, setFilteredPosts] =
    useState<BlogPostEnhanced[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = async (filter: BlogFilter) => {
    setLoading(true);
    setError(null);
    try {
      const filtered = await getAllPosts(filter);
      setFilteredPosts(filtered);
    } catch {
      setError(t('error.filterFailed'));
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-8'>
      {/* Search and Filter */}
      <BlogSearchAndFilter onFilterChange={handleFilterChange} />

      {/* Blog Posts Grid */}
      <BlogGrid
        posts={filteredPosts}
        loading={loading}
        error={error || undefined}
        emptyMessage={
          filteredPosts.length === 0
            ? t('emptyStates.noSearchResultsDescription')
            : undefined
        }
      />
    </div>
  );
}
```
