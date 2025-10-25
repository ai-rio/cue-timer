'use client';

// Accessible tree-shakeable icon imports
import { Award, BookOpen, ChevronDown, Clock, Filter, Search, Users, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BlogPostEnhanced, BlogPostFilters, BlogSearchResult } from '@/types/blog-enhanced';

// Template configurations with accessible descriptions
const TEMPLATE_OPTIONS = [
  {
    value: 'timing-guide',
    label: 'Timing Guide',
    icon: Clock,
    color: 'bg-blue-500',
    description: 'Guides for timing presentations and events',
  },
  {
    value: 'case-study',
    label: 'Case Study',
    icon: Award,
    color: 'bg-green-500',
    description: 'Real-world examples and success stories',
  },
  {
    value: 'feature-announce',
    label: 'Feature Release',
    icon: BookOpen,
    color: 'bg-purple-500',
    description: 'New features and platform updates',
  },
  {
    value: 'presentation-tips',
    label: 'Presentation Tips',
    icon: Users,
    color: 'bg-orange-500',
    description: 'Tips for better presentations',
  },
];

const DIFFICULTY_OPTIONS = [
  {
    value: 'beginner',
    label: 'Beginner',
    color: 'bg-green-100 text-green-800',
    description: 'Suitable for beginners',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Some experience recommended',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    color: 'bg-red-100 text-red-800',
    description: 'Advanced topics and techniques',
  },
  {
    value: 'all-levels',
    label: 'All Levels',
    color: 'bg-gray-100 text-gray-800',
    description: 'Suitable for all skill levels',
  },
];

const SORT_OPTIONS = [
  {
    value: 'date',
    label: 'Publication Date',
    description: 'Sort by when the post was published',
  },
  {
    value: 'title',
    label: 'Title',
    description: 'Sort alphabetically by title',
  },
  {
    value: 'readTime',
    label: 'Reading Time',
    description: 'Sort by estimated reading duration',
  },
  {
    value: 'views',
    label: 'Popularity',
    description: 'Sort by number of views',
  },
  {
    value: 'seoScore',
    label: 'SEO Score',
    description: 'Sort by SEO optimization score',
  },
];

const LANGUAGE_OPTIONS = [
  {
    value: 'en',
    label: 'English',
    flag: '🇺🇸',
    description: 'Content in English',
  },
  {
    value: 'pt-br',
    label: 'Português',
    flag: '🇧🇷',
    description: 'Conteúdo em português',
  },
  {
    value: 'es',
    label: 'Español',
    flag: '🇪🇸',
    description: 'Contenido en español',
  },
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

interface AccessibleBlogSearchProps {
  posts: BlogPostEnhanced[];
  initialFilters?: Partial<BlogPostFilters>;
  onFiltersChange: (filters: BlogPostFilters) => void;
  onSearchResults?: (results: BlogSearchResult[]) => void;
  className?: string;
  showAdvanced?: boolean;
}

export default function AccessibleBlogSearch({
  posts,
  initialFilters = {},
  onFiltersChange,
  onSearchResults,
  className = '',
  showAdvanced = true,
}: AccessibleBlogSearchProps) {
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
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters.tags || []);
  const [searchInput, setSearchInput] = useState(initialFilters.search || '');

  // Announce search results to screen readers
  const [searchAnnouncement, setSearchAnnouncement] = useState('');

  // Basic search functionality (client-side)
  const performSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        return posts;
      }

      const lowercaseQuery = query.toLowerCase();
      return posts.filter(
        (post) =>
          post.title.toLowerCase().includes(lowercaseQuery) ||
          post.summary.toLowerCase().includes(lowercaseQuery) ||
          post.content.toLowerCase().includes(lowercaseQuery) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
      );
    },
    [posts]
  );

  // Handle search input with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const searchResults = performSearch(searchInput);
      onSearchResults?.(
        searchResults.map((result) => ({
          post: result as BlogPostEnhanced,
          score: 1, // Basic scoring
          matches: [], // No detailed matching in basic search
        }))
      );

      // Announce results to screen readers
      const resultCount = searchResults.length;
      const announcement = searchInput.trim()
        ? `Found ${resultCount} ${resultCount === 1 ? 'post' : 'posts'} matching "${searchInput}"`
        : `Showing all ${posts.length} posts`;
      setSearchAnnouncement(announcement);

      // Update filters with search
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, performSearch, onSearchResults, posts.length]);

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
      filtered = filtered.filter((post) => post.templateId === filters.template);
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter((post) => post.difficulty === filters.difficulty);
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
      filtered = filtered.filter((post) => selectedTags.some((tag) => post.tags?.includes(tag)));
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
        let aValue: string | number, bValue: string | number;

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
      const newTags = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];

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
    setSearchAnnouncement('All filters have been cleared');
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
    <div className={`space-y-4 ${className}`}>
      {/* Hidden screen reader announcements */}
      <div className='sr-only' role='status' aria-live='polite' aria-atomic='true'>
        {searchAnnouncement}
      </div>

      {/* Search bar */}
      <div className='relative'>
        <label htmlFor='blog-search' className='sr-only'>
          Search blog posts
        </label>
        <Search
          className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'
          aria-hidden='true'
        />
        <Input
          id='blog-search'
          type='text'
          placeholder='Search blog posts by title, content, or author...'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='pl-10 pr-10'
          aria-label={`Search ${posts.length} blog posts`}
          aria-describedby='search-instructions'
        />
        <div id='search-instructions' className='sr-only'>
          Type to search blog posts by title, content, author, or tags. Results will update
          automatically.
        </div>
        {searchInput && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setSearchInput('')}
            className='absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0'
            aria-label='Clear search'
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>

      {/* Quick filters row */}
      <div className='flex flex-wrap gap-2' role='group' aria-label='Quick filters'>
        {/* Template filter */}
        <Select
          value={filters.template || ''}
          onValueChange={(value) => {
            updateFilter('template', value || undefined);
            // Clear tags when template is selected
            if (value) setSelectedTags([]);
          }}
        >
          <SelectTrigger className='w-[180px]' aria-label='Filter by template'>
            <SelectValue placeholder='All Templates' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>All Templates</SelectItem>
            {TEMPLATE_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                aria-describedby={`template-desc-${option.value}`}
              >
                <div className='flex items-center gap-2'>
                  <option.icon className='h-4 w-4' aria-hidden='true' />
                  <div>
                    <span>{option.label}</span>
                    <div id={`template-desc-${option.value}`} className='sr-only'>
                      {option.description}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty filter */}
        <Select
          value={filters.difficulty || ''}
          onValueChange={(value) => updateFilter('difficulty', value || undefined)}
        >
          <SelectTrigger className='w-[150px]' aria-label='Filter by difficulty level'>
            <SelectValue placeholder='All Levels' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>All Levels</SelectItem>
            {DIFFICULTY_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                aria-describedby={`difficulty-desc-${option.value}`}
              >
                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className={`text-xs ${option.color}`}>
                    {option.label}
                  </Badge>
                  <div id={`difficulty-desc-${option.value}`} className='sr-only'>
                    {option.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Language filter */}
        <Select
          value={filters.language || ''}
          onValueChange={(value) => updateFilter('language', value || undefined)}
        >
          <SelectTrigger className='w-[140px]' aria-label='Filter by language'>
            <SelectValue placeholder='All Languages' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>All Languages</SelectItem>
            {LANGUAGE_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                aria-describedby={`lang-desc-${option.value}`}
              >
                <div className='flex items-center gap-2'>
                  <span aria-hidden='true'>{option.flag}</span>
                  <div>
                    <span>{option.label}</span>
                    <div id={`lang-desc-${option.value}`} className='sr-only'>
                      {option.description}
                    </div>
                  </div>
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
            updateFilter('sortBy', sortBy as 'date' | 'title' | 'readTime' | 'views' | 'seoScore');
            updateFilter('sortOrder', sortOrder as 'asc' | 'desc');
          }}
        >
          <SelectTrigger className='w-[160px]' aria-label='Sort posts'>
            <SelectValue placeholder='Sort by...' />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem
                key={`${option.value}-desc`}
                value={`${option.value}-desc`}
                aria-describedby={`sort-desc-${option.value}-desc`}
              >
                <div>
                  <span>{option.label} (Newest)</span>
                  <div id={`sort-desc-${option.value}-desc`} className='sr-only'>
                    {option.description}
                  </div>
                </div>
              </SelectItem>
            ))}
            {SORT_OPTIONS.map((option) => (
              <SelectItem
                key={`${option.value}-asc`}
                value={`${option.value}-asc`}
                aria-describedby={`sort-desc-${option.value}-asc`}
              >
                <div>
                  <span>{option.label} (Oldest)</span>
                  <div id={`sort-desc-${option.value}-asc`} className='sr-only'>
                    {option.description}
                  </div>
                </div>
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
            aria-describedby='featured-desc'
          />
          <label
            htmlFor='featured'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
          >
            Featured only
          </label>
        </div>
        <div id='featured-desc' className='sr-only'>
          Show only featured blog posts
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
              aria-expanded={isAdvancedOpen}
              aria-controls='advanced-filters-content'
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

          <CollapsibleContent id='advanced-filters-content' className='space-y-4 pt-4'>
            {/* Common tags */}
            <div>
              <h4 className='text-sm font-medium mb-3'>Common Topics</h4>
              <div
                className='flex flex-wrap gap-2'
                role='group'
                aria-label='Filter by common topics'
              >
                {COMMON_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className='cursor-pointer text-xs'
                    onClick={() => toggleTag(tag)}
                    role='button'
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleTag(tag);
                      }
                    }}
                    aria-pressed={selectedTags.includes(tag)}
                    aria-label={`Filter by ${tag}${selectedTags.includes(tag) ? ' (selected)' : ''}`}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            <div className='flex justify-between items-center pt-2 border-t'>
              <span className='text-sm text-muted-foreground' aria-live='polite'>
                {filteredPosts.length} of {posts.length} posts
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={clearAllFilters}
                className='text-xs'
                aria-label='Clear all filters'
              >
                Clear All Filters
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Results summary */}
      <div className='flex items-center justify-between text-sm text-muted-foreground'>
        <span aria-live='polite'>
          Showing {filteredPosts.length} of {posts.length} posts
          {filters.search && ` matching "${filters.search}"`}
        </span>
        {getActiveFiltersCount() > 0 && (
          <Button
            variant='ghost'
            size='sm'
            onClick={clearAllFilters}
            className='text-xs'
            aria-label={`Clear ${getActiveFiltersCount()} active filter${getActiveFiltersCount() === 1 ? '' : 's'}`}
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
