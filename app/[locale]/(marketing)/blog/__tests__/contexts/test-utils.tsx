import { blogCategories, type BlogPost } from '@/types/blog';

// Mock blog posts for testing
export const mockBlogPosts: BlogPost[] = [
  {
    title: 'Getting Started with CueTimer',
    slug: 'getting-started-cuetimer',
    category: 'tutorials',
    author: 'John Doe',
    publishedAt: '2024-01-15T10:00:00Z',
    publishedAtDate: new Date('2024-01-15T10:00:00Z'),
    summary: 'Learn how to use CueTimer for your events',
    content:
      'This is a comprehensive guide to getting started with CueTimer. It covers all the basic features and functionality.',
    excerpt: 'A comprehensive guide to getting started with CueTimer',
    wordCount: 500,
    readTime: 3,
    featured: true,
    draft: false,
    tags: ['beginner', 'tutorial', 'events'],
  },
  {
    title: 'Advanced Timing Techniques',
    slug: 'advanced-timing-techniques',
    category: 'timing',
    author: 'Jane Smith',
    publishedAt: '2024-02-20T14:30:00Z',
    publishedAtDate: new Date('2024-02-20T14:30:00Z'),
    summary: 'Master advanced timing techniques for professional events',
    content:
      'In this article, we explore advanced timing techniques that can help you manage professional events more effectively.',
    excerpt: 'Master advanced timing techniques for professional events',
    wordCount: 1200,
    readTime: 6,
    featured: false,
    draft: false,
    tags: ['advanced', 'timing', 'professional'],
  },
  {
    title: 'Productivity Tips for Event Managers',
    slug: 'productivity-tips-event-managers',
    category: 'productivity',
    author: 'Bob Johnson',
    publishedAt: '2023-12-10T09:15:00Z',
    publishedAtDate: new Date('2023-12-10T09:15:00Z'),
    summary: 'Boost your productivity with these event management tips',
    content:
      'Event managers need to be highly productive. Here are some tips to help you manage your time and resources better.',
    excerpt: 'Boost your productivity with these event management tips',
    wordCount: 800,
    readTime: 4,
    featured: true,
    draft: false,
    tags: ['productivity', 'management', 'tips'],
  },
  {
    title: 'New Feature Release: Multi-Stage Events',
    slug: 'new-feature-multi-stage-events',
    category: 'features',
    author: 'Alice Brown',
    publishedAt: '2024-03-01T16:00:00Z',
    publishedAtDate: new Date('2024-03-01T16:00:00Z'),
    summary: 'Announcing our new multi-stage event support',
    content:
      'We are excited to announce support for multi-stage events in CueTimer. This feature allows you to manage multiple stages simultaneously.',
    excerpt: 'Announcing our new multi-stage event support',
    wordCount: 600,
    readTime: 3,
    featured: false,
    draft: false,
    tags: ['features', 'new', 'multi-stage'],
  },
  {
    title: 'Industry Trends: Event Technology 2024',
    slug: 'industry-trends-event-technology-2024',
    category: 'industry',
    author: 'Charlie Wilson',
    publishedAt: '2024-01-25T11:45:00Z',
    publishedAtDate: new Date('2024-01-25T11:45:00Z'),
    summary: 'Explore the latest trends in event technology for 2024',
    content:
      'The event technology landscape is evolving rapidly. Here are the key trends to watch in 2024.',
    excerpt: 'Explore the latest trends in event technology for 2024',
    wordCount: 1500,
    readTime: 8,
    featured: true,
    draft: false,
    tags: ['industry', 'trends', 'technology', '2024'],
  },
];

// Test helper functions
export const createMockBlogPost = (overrides: Partial<BlogPost> = {}): BlogPost => {
  const defaultPost: BlogPost = {
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    category: 'tutorials',
    author: 'Test Author',
    publishedAt: '2024-01-01T00:00:00Z',
    publishedAtDate: new Date('2024-01-01T00:00:00Z'),
    summary: 'A test blog post summary',
    content: 'This is test content for the blog post.',
    excerpt: 'A test blog post excerpt',
    wordCount: 100,
    readTime: 1,
    featured: false,
    draft: false,
    tags: ['test'],
    ...overrides,
  };

  return defaultPost;
};

export const createMockBlogPosts = (count: number, overrides: Partial<BlogPost> = {}): BlogPost[] =>
  Array.from({ length: count }, (_, index) =>
    createMockBlogPost({
      title: `Test Post ${index + 1}`,
      slug: `test-post-${index + 1}`,
      ...overrides,
    })
  );

// Categories for testing
export const allCategories = [...blogCategories, 'all'] as const;

// Common test scenarios
export const testScenarios = {
  searchByTitle: {
    searchTerm: 'CueTimer',
    expectedPosts: ['Getting Started with CueTimer'],
  },
  searchByTag: {
    searchTerm: 'tutorial',
    expectedPosts: ['Getting Started with CueTimer'],
  },
  filterByCategory: {
    category: 'timing' as const,
    expectedPosts: ['Advanced Timing Techniques'],
  },
  filterByFeatured: {
    featured: true,
    expectedPosts: [
      'Getting Started with CueTimer',
      'Productivity Tips for Event Managers',
      'Industry Trends: Event Technology 2024',
    ],
  },
  filterByYear: {
    year: 2024,
    expectedPosts: [
      'Getting Started with CueTimer',
      'Advanced Timing Techniques',
      'New Feature Release: Multi-Stage Events',
      'Industry Trends: Event Technology 2024',
    ],
  },
  filterByTags: {
    tags: ['productivity', 'management'],
    expectedPosts: ['Productivity Tips for Event Managers'],
  },
  combinedFilters: {
    searchTerm: 'event',
    category: 'productivity' as const,
    featured: true,
    expectedPosts: ['Productivity Tips for Event Managers'],
  },
};
