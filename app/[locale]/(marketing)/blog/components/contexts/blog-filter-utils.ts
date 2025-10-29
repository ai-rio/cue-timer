import type { BlogCategory, BlogPost } from '@/types/blog';

// Utility functions for blog filtering

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Extract search keywords from a search string
 */
export function extractSearchKeywords(searchTerm: string): string[] {
  return searchTerm
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 1); // Remove very short words
}

/**
 * Check if a post matches a search term with highlighting support
 */
export function postMatchesSearch(
  post: BlogPost,
  searchTerm: string,
  options: {
    includeContent?: boolean;
    fuzzyMatch?: boolean;
  } = {}
): { matches: boolean; highlights?: string[] } {
  if (!searchTerm.trim()) {
    return { matches: true };
  }

  const keywords = extractSearchKeywords(searchTerm);
  const highlights: string[] = [];
  let matches = false;

  // Search in title (highest priority)
  for (const keyword of keywords) {
    if (post.title.toLowerCase().includes(keyword)) {
      matches = true;
      highlights.push('title');
    }
  }

  // Search in summary
  for (const keyword of keywords) {
    if (post.summary.toLowerCase().includes(keyword)) {
      matches = true;
      highlights.push('summary');
    }
  }

  // Search in tags
  for (const keyword of keywords) {
    if (post.tags.some((tag) => tag.toLowerCase().includes(keyword))) {
      matches = true;
      highlights.push('tags');
    }
  }

  // Search in category
  for (const keyword of keywords) {
    if (post.category.toLowerCase().includes(keyword)) {
      matches = true;
      highlights.push('category');
    }
  }

  // Search in content (if enabled - more expensive)
  if (options.includeContent) {
    for (const keyword of keywords) {
      if (post.content.toLowerCase().includes(keyword)) {
        matches = true;
        highlights.push('content');
      }
    }
  }

  return { matches, highlights: [...new Set(highlights)] };
}

/**
 * Sort posts by relevance to search term
 */
export function sortPostsByRelevance(posts: BlogPost[], searchTerm: string): BlogPost[] {
  if (!searchTerm.trim()) {
    return posts;
  }

  const keywords = extractSearchKeywords(searchTerm);

  return posts
    .map((post) => {
      let score = 0;

      // Title matches get highest score
      for (const keyword of keywords) {
        if (post.title.toLowerCase().includes(keyword)) {
          score += 10;
        }
      }

      // Summary matches get medium score
      for (const keyword of keywords) {
        if (post.summary.toLowerCase().includes(keyword)) {
          score += 5;
        }
      }

      // Tag matches get good score
      for (const keyword of keywords) {
        if (post.tags.some((tag) => tag.toLowerCase().includes(keyword))) {
          score += 3;
        }
      }

      // Category matches get lower score
      for (const keyword of keywords) {
        if (post.category.toLowerCase().includes(keyword)) {
          score += 2;
        }
      }

      // Content matches get lowest score
      for (const keyword of keywords) {
        if (post.content.toLowerCase().includes(keyword)) {
          score += 1;
        }
      }

      return { post, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.post);
}

/**
 * Generate filter summary text
 */
export function generateFilterSummary(filters: {
  searchTerm: string;
  selectedCategory: BlogCategory | 'all';
  selectedTags: string[];
  featuredOnly: boolean;
  selectedYear: number | 'all';
}): string {
  const parts: string[] = [];

  if (filters.searchTerm.trim()) {
    parts.push(`searching for "${filters.searchTerm.trim()}"`);
  }

  if (filters.selectedCategory !== 'all') {
    parts.push(`in ${filters.selectedCategory}`);
  }

  if (filters.selectedTags.length > 0) {
    const tagText =
      filters.selectedTags.length === 1
        ? `tagged "${filters.selectedTags[0]}"`
        : `tagged with ${filters.selectedTags.join(', ')}`;
    parts.push(tagText);
  }

  if (filters.featuredOnly) {
    parts.push('featured posts');
  }

  if (filters.selectedYear !== 'all') {
    parts.push(`from ${filters.selectedYear}`);
  }

  if (parts.length === 0) {
    return 'All posts';
  }

  return `Posts ${parts.join(' ')}`;
}

/**
 * Get popular tags from posts
 */
export function getPopularTags(
  posts: BlogPost[],
  limit: number = 10
): { tag: string; count: number }[] {
  const tagCounts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Validate filter parameters
 */
export function validateFilters(filters: {
  searchTerm: string;
  selectedCategory: BlogCategory | 'all';
  selectedTags: string[];
  featuredOnly: boolean;
  selectedYear: number | 'all';
}): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate search term length
  if (filters.searchTerm.length > 100) {
    errors.push('Search term is too long (max 100 characters)');
  }

  // Validate category
  const validCategories = [
    'timing',
    'productivity',
    'events',
    'features',
    'tutorials',
    'industry',
    'all',
  ];
  if (!validCategories.includes(filters.selectedCategory)) {
    errors.push('Invalid category selected');
  }

  // Validate tags
  if (filters.selectedTags.length > 10) {
    errors.push('Too many tags selected (max 10)');
  }

  filters.selectedTags.forEach((tag) => {
    if (tag.length > 50) {
      errors.push(`Tag "${tag}" is too long (max 50 characters)`);
    }
  });

  // Validate year
  if (filters.selectedYear !== 'all') {
    const currentYear = new Date().getFullYear();
    const year = Number(filters.selectedYear);
    if (isNaN(year) || year < 2000 || year > currentYear + 5) {
      errors.push('Invalid year selected');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Create URL-safe query string from filters
 */
export function createFilterQueryString(filters: {
  searchTerm?: string;
  selectedCategory?: BlogCategory | 'all';
  selectedTags?: string[];
  featuredOnly?: boolean;
  selectedYear?: number | 'all';
}): string {
  const params = new URLSearchParams();

  if (filters.searchTerm?.trim()) {
    params.set('search', filters.searchTerm.trim());
  }

  if (filters.selectedCategory && filters.selectedCategory !== 'all') {
    params.set('category', filters.selectedCategory);
  }

  if (filters.selectedTags?.length) {
    params.set('tags', filters.selectedTags.join(','));
  }

  if (filters.featuredOnly) {
    params.set('featured', 'true');
  }

  if (filters.selectedYear && filters.selectedYear !== 'all') {
    params.set('year', filters.selectedYear.toString());
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}
