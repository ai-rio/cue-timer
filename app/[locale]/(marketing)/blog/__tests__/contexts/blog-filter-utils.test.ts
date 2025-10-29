import type { BlogPost } from '@/types/blog';

import {
  createFilterQueryString,
  debounce,
  extractSearchKeywords,
  generateFilterSummary,
  getPopularTags,
  postMatchesSearch,
  sortPostsByRelevance,
  validateFilters,
} from '../../components/contexts/blog-filter-utils';
import { createMockBlogPost, mockBlogPosts } from './test-utils';

describe('debounce', () => {
  beforeEach(() => {
    // Use fake timers for debounce tests
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce function calls', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    // Call multiple times quickly
    debouncedFn('arg1');
    debouncedFn('arg2');
    debouncedFn('arg3');

    // Should not be called yet
    expect(mockFn).not.toHaveBeenCalled();

    // Advance timer
    jest.advanceTimersByTime(100);

    // Should be called with last arguments
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('arg3');
  });

  it('should cancel prejestous timer when called again', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    jest.advanceTimersByTime(50);

    debouncedFn('second');
    jest.advanceTimersByTime(50);

    debouncedFn('third');
    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  it('should handle multiple debounced functions independently', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const debouncedFn1 = debounce(mockFn1, 100);
    const debouncedFn2 = debounce(mockFn2, 200);

    debouncedFn1('fn1');
    debouncedFn2('fn2');

    jest.advanceTimersByTime(100);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });
});

describe('extractSearchKeywords', () => {
  it('should extract keywords from search term', () => {
    const result = extractSearchKeywords('react hooks testing');
    expect(result).toEqual(['react', 'hooks', 'testing']);
  });

  it('should convert to lowercase', () => {
    const result = extractSearchKeywords('REACT HOOKS');
    expect(result).toEqual(['react', 'hooks']);
  });

  it('should trim whitespace', () => {
    const result = extractSearchKeywords('  react hooks  ');
    expect(result).toEqual(['react', 'hooks']);
  });

  it('should remove very short words', () => {
    const result = extractSearchKeywords('react a is of hooks');
    expect(result).toEqual(['react', 'hooks']);
  });

  it('should handle empty search term', () => {
    const result = extractSearchKeywords('');
    expect(result).toEqual([]);
  });

  it('should handle search term with only whitespace', () => {
    const result = extractSearchKeywords('   ');
    expect(result).toEqual([]);
  });

  it('should handle multiple spaces', () => {
    const result = extractSearchKeywords('react   hooks    testing');
    expect(result).toEqual(['react', 'hooks', 'testing']);
  });
});

describe('postMatchesSearch', () => {
  const testPost = createMockBlogPost({
    title: 'React Testing Guide',
    summary: 'Learn how to test React applications',
    content: 'This is a comprehensive guide about React testing with Jest and RTL',
    tags: ['react', 'testing', 'guide'],
    category: 'tutorials',
  });

  it('should match when search term is empty', () => {
    const result = postMatchesSearch(testPost, '');
    expect(result.matches).toBe(true);
    expect(result.highlights).toBeUndefined();
  });

  it('should match title', () => {
    const result = postMatchesSearch(testPost, 'react');
    expect(result.matches).toBe(true);
    expect(result.highlights).toContain('title');
  });

  it('should match summary', () => {
    const result = postMatchesSearch(testPost, 'test');
    expect(result.matches).toBe(true);
    expect(result.highlights).toContain('summary');
  });

  it('should match tags', () => {
    const result = postMatchesSearch(testPost, 'guide');
    expect(result.matches).toBe(true);
    expect(result.highlights).toContain('tags');
  });

  it('should match category', () => {
    const result = postMatchesSearch(testPost, 'tutorial');
    expect(result.matches).toBe(true);
    expect(result.highlights).toContain('category');
  });

  it('should match content when enabled', () => {
    const result = postMatchesSearch(testPost, 'comprehensive', { includeContent: true });
    expect(result.matches).toBe(true);
    expect(result.highlights).toContain('content');
  });

  it('should not match content when disabled', () => {
    const result = postMatchesSearch(testPost, 'comprehensive', { includeContent: false });
    expect(result.matches).toBe(false);
  });

  it('should return unique highlights', () => {
    const result = postMatchesSearch(testPost, 'react testing');
    expect(result.matches).toBe(true);
    const uniqueHighlights = [...new Set(result.highlights || [])];
    expect(result.highlights).toEqual(uniqueHighlights);
  });

  it('should be case insensitive', () => {
    const result = postMatchesSearch(testPost, 'REACT');
    expect(result.matches).toBe(true);
    expect(result.highlights).toContain('title');
  });

  it('should not match when no text matches', () => {
    const result = postMatchesSearch(testPost, 'nonexistent');
    expect(result.matches).toBe(false);
    expect(result.highlights).toBeUndefined();
  });

  it('should handle partial word matches', () => {
    const result = postMatchesSearch(testPost, 'testin');
    expect(result.matches).toBe(true);
  });
});

describe('sortPostsByRelevance', () => {
  const posts = [
    createMockBlogPost({
      title: 'React Testing Guide',
      summary: 'Learn React testing',
      content: 'Content about React',
      tags: ['react', 'testing'],
      category: 'tutorials',
    }),
    createMockBlogPost({
      title: 'Vue Testing Guide',
      summary: 'Learn Vue testing',
      content: 'Content about Vue',
      tags: ['vue', 'testing'],
      category: 'tutorials',
    }),
    createMockBlogPost({
      title: 'General Testing Guide',
      summary: 'Learn testing',
      content: 'Content about testing frameworks',
      tags: ['testing', 'guide'],
      category: 'tutorials',
    }),
  ];

  it('should return posts in original order when search term is empty', () => {
    const result = sortPostsByRelevance(posts, '');
    expect(result).toEqual(posts);
  });

  it('should sort by relevance score', () => {
    const result = sortPostsByRelevance(posts, 'react testing');

    // First post should have highest score (matches in title)
    expect(result[0].title).toBe('React Testing Guide');

    // Third post should come before second (matches 'testing' in title/summary/tags)
    expect(result[1].title).toBe('General Testing Guide');
    expect(result[2].title).toBe('Vue Testing Guide');
  });

  it('should handle posts with same relevance score', () => {
    const identicalPosts = [
      createMockBlogPost({
        title: 'React Guide',
        content: 'About React',
        tags: [],
        category: 'tutorials',
      }),
      createMockBlogPost({
        title: 'React Tutorial',
        content: 'About React',
        tags: [],
        category: 'tutorials',
      }),
    ];

    const result = sortPostsByRelevance(identicalPosts, 'react');
    expect(result).toHaveLength(2);
  });

  it('should return empty array for empty posts', () => {
    const result = sortPostsByRelevance([], 'react');
    expect(result).toEqual([]);
  });
});

describe('generateFilterSummary', () => {
  it('should return "All posts" when no filters are active', () => {
    const filters = {
      searchTerm: '',
      selectedCategory: 'all' as const,
      selectedTags: [],
      featuredOnly: false,
      selectedYear: 'all' as const,
    };

    const result = generateFilterSummary(filters);
    expect(result).toBe('All posts');
  });

  it('should include search term in summary', () => {
    const filters = {
      searchTerm: 'react testing',
      selectedCategory: 'all' as const,
      selectedTags: [],
      featuredOnly: false,
      selectedYear: 'all' as const,
    };

    const result = generateFilterSummary(filters);
    expect(result).toBe('Posts searching for "react testing"');
  });

  it('should include category in summary', () => {
    const filters = {
      searchTerm: '',
      selectedCategory: 'tutorials' as const,
      selectedTags: [],
      featuredOnly: false,
      selectedYear: 'all' as const,
    };

    const result = generateFilterSummary(filters);
    expect(result).toBe('Posts in tutorials');
  });

  it('should include single tag in summary', () => {
    const filters = {
      searchTerm: '',
      selectedCategory: 'all' as const,
      selectedTags: ['react'],
      featuredOnly: false,
      selectedYear: 'all' as const,
    };

    const result = generateFilterSummary(filters);
    expect(result).toBe('Posts tagged "react"');
  });

  it('should include multiple tags in summary', () => {
    const filters = {
      searchTerm: '',
      selectedCategory: 'all' as const,
      selectedTags: ['react', 'testing', 'guide'],
      featuredOnly: false,
      selectedYear: 'all' as const,
    };

    const result = generateFilterSummary(filters);
    expect(result).toBe('Posts tagged with react, testing, guide');
  });

  it('should include featured filter in summary', () => {
    const filters = {
      searchTerm: '',
      selectedCategory: 'all' as const,
      selectedTags: [],
      featuredOnly: true,
      selectedYear: 'all' as const,
    };

    const result = generateFilterSummary(filters);
    expect(result).toBe('Posts featured posts');
  });

  it('should include year in summary', () => {
    const filters = {
      searchTerm: '',
      selectedCategory: 'all' as const,
      selectedTags: [],
      featuredOnly: false,
      selectedYear: 2024,
    };

    const result = generateFilterSummary(filters);
    expect(result).toBe('Posts from 2024');
  });

  it('should combine multiple filters in summary', () => {
    const filters = {
      searchTerm: 'react',
      selectedCategory: 'tutorials' as const,
      selectedTags: ['guide'],
      featuredOnly: true,
      selectedYear: 2024,
    };

    const result = generateFilterSummary(filters);
    expect(result).toBe(
      'Posts searching for "react" in tutorials tagged "guide" featured posts from 2024'
    );
  });

  it('should trim whitespace from search term', () => {
    const filters = {
      searchTerm: '  react testing  ',
      selectedCategory: 'all' as const,
      selectedTags: [],
      featuredOnly: false,
      selectedYear: 'all' as const,
    };

    const result = generateFilterSummary(filters);
    expect(result).toBe('Posts searching for "react testing"');
  });
});

describe('getPopularTags', () => {
  const posts = [
    createMockBlogPost({ tags: ['react', 'testing', 'guide'] }),
    createMockBlogPost({ tags: ['react', 'hooks'] }),
    createMockBlogPost({ tags: ['testing', 'jest'] }),
    createMockBlogPost({ tags: ['react', 'redux'] }),
    createMockBlogPost({ tags: ['testing', 'rtl'] }),
  ];

  it('should return tags sorted by popularity', () => {
    const result = getPopularTags(posts);

    expect(result[0]).toEqual({ tag: 'react', count: 3 });
    expect(result[1]).toEqual({ tag: 'testing', count: 3 });
    expect(result[2]).toEqual({ tag: 'guide', count: 1 });
  });

  it('should limit results to specified limit', () => {
    const result = getPopularTags(posts, 2);
    expect(result).toHaveLength(2);
    expect(result[0].tag).toBe('react');
    expect(result[1].tag).toBe('testing');
  });

  it('should handle default limit', () => {
    const result = getPopularTags(posts);
    expect(result).toHaveLength(5); // Default limit is 10, but we only have 5 unique tags
  });

  it('should handle empty posts array', () => {
    const result = getPopularTags([]);
    expect(result).toEqual([]);
  });

  it('should handle posts with no tags', () => {
    const postsWithoutTags = [createMockBlogPost({ tags: [] }), createMockBlogPost({ tags: [] })];

    const result = getPopularTags(postsWithoutTags);
    expect(result).toEqual([]);
  });

  it('should handle posts with duplicate tags', () => {
    const postsWithDuplicates = [
      createMockBlogPost({ tags: ['react', 'react', 'testing'] }),
      createMockBlogPost({ tags: ['react', 'testing'] }),
    ];

    const result = getPopularTags(postsWithDuplicates);
    expect(result).toEqual([
      { tag: 'react', count: 2 },
      { tag: 'testing', count: 2 },
    ]);
  });
});

describe('validateFilters', () => {
  const validFilters = {
    searchTerm: 'react testing',
    selectedCategory: 'tutorials' as const,
    selectedTags: ['react', 'testing'],
    featuredOnly: false,
    selectedYear: 2024,
  };

  it('should validate correct filters', () => {
    const result = validateFilters(validFilters);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should reject search term that is too long', () => {
    const longSearchTerm = 'a'.repeat(101);
    const filters = { ...validFilters, searchTerm: longSearchTerm };

    const result = validateFilters(filters);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Search term is too long (max 100 characters)');
  });

  it('should reject invalid category', () => {
    const filters = { ...validFilters, selectedCategory: 'invalid' as any };

    const result = validateFilters(filters);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid category selected');
  });

  it('should reject too many tags', () => {
    const manyTags = Array.from({ length: 11 }, (_, i) => `tag${i}`);
    const filters = { ...validFilters, selectedTags: manyTags };

    const result = validateFilters(filters);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Too many tags selected (max 10)');
  });

  it('should reject tags that are too long', () => {
    const longTag = 'a'.repeat(51);
    const filters = { ...validFilters, selectedTags: [longTag] };

    const result = validateFilters(filters);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(`Tag "${longTag}" is too long (max 50 characters)`);
  });

  it('should reject multiple validation errors', () => {
    const longSearchTerm = 'a'.repeat(101);
    const longTag = 'a'.repeat(51);
    const manyTags = Array.from({ length: 11 }, (_, i) => `tag${i}`);

    const filters = {
      searchTerm: longSearchTerm,
      selectedCategory: 'invalid' as any,
      selectedTags: manyTags,
      featuredOnly: false,
      selectedYear: 2024,
    };

    const result = validateFilters(filters);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(3);
    expect(result.errors).toContain('Search term is too long (max 100 characters)');
    expect(result.errors).toContain('Invalid category selected');
    expect(result.errors).toContain('Too many tags selected (max 10)');
  });

  it('should accept valid years', () => {
    const currentYear = new Date().getFullYear();

    const testCases = [
      { year: 2024, expected: true },
      { year: 2000, expected: true },
      { year: currentYear, expected: true },
      { year: currentYear + 5, expected: true },
    ];

    testCases.forEach(({ year, expected }) => {
      const filters = { ...validFilters, selectedYear: year };
      const result = validateFilters(filters);
      expect(result.isValid).toBe(expected);
    });
  });

  it('should reject invalid years', () => {
    const currentYear = new Date().getFullYear();

    const testCases = [
      { year: 1999, expected: false },
      { year: currentYear + 6, expected: false },
      { year: -1, expected: false },
    ];

    testCases.forEach(({ year, expected }) => {
      const filters = { ...validFilters, selectedYear: year };
      const result = validateFilters(filters);
      expect(result.isValid).toBe(expected);
      if (!expected) {
        expect(result.errors).toContain('Invalid year selected');
      }
    });
  });

  it('should handle "all" year', () => {
    const filters = { ...validFilters, selectedYear: 'all' as const };
    const result = validateFilters(filters);
    expect(result.isValid).toBe(true);
  });
});

describe('createFilterQueryString', () => {
  it('should return empty string for no filters', () => {
    const filters = {};
    const result = createFilterQueryString(filters);
    expect(result).toBe('');
  });

  it('should create query string with search term', () => {
    const filters = { searchTerm: 'react testing' };
    const result = createFilterQueryString(filters);
    expect(result).toBe('?search=react%20testing');
  });

  it('should create query string with category', () => {
    const filters = { selectedCategory: 'tutorials' as const };
    const result = createFilterQueryString(filters);
    expect(result).toBe('?category=tutorials');
  });

  it('should create query string with single tag', () => {
    const filters = { selectedTags: ['react'] };
    const result = createFilterQueryString(filters);
    expect(result).toBe('?tags=react');
  });

  it('should create query string with multiple tags', () => {
    const filters = { selectedTags: ['react', 'testing', 'guide'] };
    const result = createFilterQueryString(filters);
    expect(result).toBe('?tags=react%2Ctesting%2Cguide');
  });

  it('should create query string with featured filter', () => {
    const filters = { featuredOnly: true };
    const result = createFilterQueryString(filters);
    expect(result).toBe('?featured=true');
  });

  it('should create query string with year', () => {
    const filters = { selectedYear: 2024 };
    const result = createFilterQueryString(filters);
    expect(result).toBe('?year=2024');
  });

  it('should create query string with multiple filters', () => {
    const filters = {
      searchTerm: 'react testing',
      selectedCategory: 'tutorials' as const,
      selectedTags: ['guide'],
      featuredOnly: true,
      selectedYear: 2024,
    };

    const result = createFilterQueryString(filters);
    expect(result).toBe(
      '?search=react%20testing&category=tutorials&tags=guide&featured=true&year=2024'
    );
  });

  it('should trim whitespace from search term', () => {
    const filters = { searchTerm: '  react testing  ' };
    const result = createFilterQueryString(filters);
    expect(result).toBe('?search=react%20testing');
  });

  it('should ignore empty search term', () => {
    const filters = { searchTerm: '   ' };
    const result = createFilterQueryString(filters);
    expect(result).toBe('');
  });

  it('should ignore "all" category', () => {
    const filters = { selectedCategory: 'all' as const };
    const result = createFilterQueryString(filters);
    expect(result).toBe('');
  });

  it('should ignore empty tags array', () => {
    const filters = { selectedTags: [] };
    const result = createFilterQueryString(filters);
    expect(result).toBe('');
  });

  it('should ignore false featured filter', () => {
    const filters = { featuredOnly: false };
    const result = createFilterQueryString(filters);
    expect(result).toBe('');
  });

  it('should ignore "all" year', () => {
    const filters = { selectedYear: 'all' as const };
    const result = createFilterQueryString(filters);
    expect(result).toBe('');
  });

  it('should handle URL encoding', () => {
    const filters = {
      searchTerm: 'react & testing',
      selectedTags: ['react/hooks', 'testing?guide'],
    };

    const result = createFilterQueryString(filters);
    expect(result).toBe('?search=react%20%26%20testing&tags=react%2Fhooks%2Ctesting%3Fguide');
  });
});
