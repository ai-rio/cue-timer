import { isValid } from 'date-fns';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import readingTime from 'reading-time';

import BlogPostSchema, {
  BlogAnalytics,
  blogCategories,
  BlogCategory,
  BlogFilter,
  BlogPost,
  BlogPostMetadata,
  BlogPostNavigation,
  RelatedPostScore,
} from '@/types/blog';
import type { BlogPostEnhanced } from '@/types/blog-api';

// Type conversion function to ensure compatibility
function convertToBlogPostEnhanced(post: BlogPost): BlogPostEnhanced {
  return {
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    category: post.category as BlogPostEnhanced['category'],
    author: post.author,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    image: post.image,
    imageAlt: post.imageAlt,
    featured: post.featured || false,
    draft: post.draft || false,
    tags: post.tags,
    lastModified: post.lastModified,
    seo: post.seo,
    content: post.content,
    excerpt: post.excerpt,
    wordCount: post.wordCount,
    publishedAtDate: post.publishedAtDate,
    lastModifiedDate: post.lastModifiedDate,
    locale: post.locale,
  };
}

// Re-export types for easier imports
export type {
  BlogAnalytics,
  BlogCategory,
  BlogFilter,
  BlogPost,
  BlogPostMetadata,
  BlogPostNavigation,
  RelatedPostScore,
};

export { blogCategories };

// Cache configuration
const CACHE_TTL = {
  development: 5000, // 5 seconds
  production: 300000, // 5 minutes
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class BlogCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const ttl =
      process.env.NODE_ENV === 'development' ? CACHE_TTL.development : CACHE_TTL.production;

    if (now - entry.timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

const blogCache = new BlogCache();

// Blog content directory
const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

// Validate and sanitize blog post metadata
function validateBlogPostData(fileContent: string, filePath: string): BlogPostMetadata {
  const { data, content } = matter(fileContent);

  try {
    // Parse date fields
    if (typeof data.publishedAt === 'string') {
      const parsedDate = new Date(data.publishedAt);
      if (!isValid(parsedDate)) {
        throw new Error(`Invalid publishedAt date: ${data.publishedAt}`);
      }
      data.publishedAt = parsedDate.toISOString();
    }

    if (typeof data.lastModified === 'string') {
      const parsedDate = new Date(data.lastModified);
      if (!isValid(parsedDate)) {
        throw new Error(`Invalid lastModified date: ${data.lastModified}`);
      }
      data.lastModified = parsedDate.toISOString();
    }

    // Auto-generate readTime if not provided
    if (!data.readTime && content) {
      data.readTime = Math.ceil(readingTime(content).minutes);
    }

    // Validate with Zod schema
    const validatedData = BlogPostSchema.parse(data);
    return validatedData;
  } catch (error) {
    // Log error for debugging without console statement
    throw new Error(
      `Validation failed for ${path.basename(filePath)}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Generate excerpt from content
function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.substring(0, maxLength).replace(/\s+\S*$/, '')}...`;
}

// Generate slug from filename
function generateSlugFromFilename(filename: string): string {
  const nameWithoutExt = path.basename(filename, path.extname(filename));

  // Remove date prefix if present (MM-DD-title format)
  const datePrefixRegex = /^\d{2}-\d{2}-/;
  if (datePrefixRegex.test(nameWithoutExt)) {
    return nameWithoutExt.substring(6).replace(/-/g, '-');
  }

  return nameWithoutExt.replace(/-/g, '-');
}

// Read and parse all blog posts
export async function getAllPosts(filter: BlogFilter = {}): Promise<BlogPostEnhanced[]> {
  const cacheKey = `allPosts:${JSON.stringify(filter)}`;
  const cached = blogCache.get<BlogPostEnhanced[]>(cacheKey);
  if (cached) return cached;

  try {
    if (!fs.existsSync(BLOG_CONTENT_DIR)) {
      // Silent handling of missing blog directory
      return [];
    }

    const years = fs
      .readdirSync(BLOG_CONTENT_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((year) => /^\d{4}$/.test(year))
      .sort((a, b) => b.localeCompare(a)); // Most recent year first

    const allPosts: BlogPostEnhanced[] = [];

    for (const year of years) {
      const yearDir = path.join(BLOG_CONTENT_DIR, year);
      const files = fs
        .readdirSync(yearDir)
        .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
        .sort((a, b) => b.localeCompare(a)); // Most recent first

      for (const file of files) {
        const filePath = path.join(yearDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const metadata = validateBlogPostData(fileContent, filePath);

        // Skip drafts unless specifically requested
        if (metadata.draft && !filter.includeDrafts) {
          continue;
        }

        const { content } = matter(fileContent);
        // Use basic MDX processing to avoid internal linking issues
        const processedContent = content
          .replace(/^[\r\n]+/, '') // Remove leading newlines
          .replace(/\t+$/gm, ''); // Remove trailing tabs
        const wordCount = processedContent.split(/\s+/).length;
        const excerpt = generateExcerpt(processedContent);

        const post: BlogPost = {
          ...metadata,
          content: processedContent,
          excerpt,
          wordCount,
          readTime: metadata.readTime || Math.ceil(readingTime(processedContent).minutes),
          publishedAtDate: new Date(metadata.publishedAt),
          lastModifiedDate: metadata.lastModified ? new Date(metadata.lastModified) : undefined,
        };

        const enhancedPost = convertToBlogPostEnhanced(post);
        allPosts.push(enhancedPost);
      }
    }

    // Apply filters
    let filteredPosts = allPosts;

    // Year filter
    if (filter.year) {
      filteredPosts = filteredPosts.filter(
        (post) => post.publishedAtDate.getFullYear() === filter.year
      );
    }

    // Category filter
    if (filter.category && filter.category !== 'all') {
      filteredPosts = filteredPosts.filter((post) => post.category === filter.category);
    }

    // Featured filter
    if (typeof filter.featured === 'boolean') {
      filteredPosts = filteredPosts.filter((post) => post.featured === filter.featured);
    }

    // Search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.summary.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      filteredPosts = filteredPosts.filter((post) =>
        filter.tags!.some((tag) => post.tags.includes(tag))
      );
    }

    // Sort by publication date (most recent first)
    filteredPosts.sort((a, b) => b.publishedAtDate.getTime() - a.publishedAtDate.getTime());

    blogCache.set(cacheKey, filteredPosts);
    return filteredPosts;
  } catch {
    // Silent error handling for blog post reading
    return [];
  }
}

// Get a single blog post by slug
export async function getPostBySlug(slug: string): Promise<BlogPostEnhanced | null> {
  const cacheKey = `post:${slug}`;
  const cached = blogCache.get<BlogPostEnhanced>(cacheKey);
  if (cached) return cached;

  try {
    const years = fs
      .readdirSync(BLOG_CONTENT_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((year) => /^\d{4}$/.test(year));

    for (const year of years) {
      const yearDir = path.join(BLOG_CONTENT_DIR, year);
      const files = fs
        .readdirSync(yearDir)
        .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'));

      for (const file of files) {
        const filePath = path.join(yearDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const metadata = validateBlogPostData(fileContent, filePath);

        const postSlug = metadata.slug || generateSlugFromFilename(file);

        if (postSlug === slug) {
          const { content } = matter(fileContent);
          // Use basic MDX processing to avoid internal linking issues
          const processedContent = content
            .replace(/^[\r\n]+/, '') // Remove leading newlines
            .replace(/\t+$/gm, ''); // Remove trailing tabs
          const wordCount = processedContent.split(/\s+/).length;
          const excerpt = generateExcerpt(processedContent);

          const post: BlogPost = {
            ...metadata,
            content: processedContent,
            excerpt,
            wordCount,
            readTime: metadata.readTime || Math.ceil(readingTime(processedContent).minutes),
            publishedAtDate: new Date(metadata.publishedAt),
            lastModifiedDate: metadata.lastModified ? new Date(metadata.lastModified) : undefined,
          };

          const enhancedPost = convertToBlogPostEnhanced(post);
          blogCache.set(cacheKey, enhancedPost);
          return enhancedPost;
        }
      }
    }

    return null;
  } catch {
    // Silent error handling for individual blog post reading
    return null;
  }
}

// Get navigation links for a blog post
export async function getPostNavigation(slug: string): Promise<BlogPostNavigation> {
  const posts = await getAllPosts();
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? (posts[currentIndex - 1] ?? null) : null,
    next: currentIndex < posts.length - 1 ? (posts[currentIndex + 1] ?? null) : null,
  };
}

// Get related posts based on category and tags
export async function getRelatedPosts(
  currentPost: BlogPost,
  limit: number = 3
): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();

  // Exclude current post and drafts
  const candidates = allPosts.filter((post) => post.slug !== currentPost.slug && !post.draft);

  // Score posts based on similarity
  const scoredPosts: RelatedPostScore[] = candidates.map((post) => {
    let score = 0;
    const reasons: string[] = [];

    // Same category (most important)
    if (post.category === currentPost.category) {
      score += 10;
      reasons.push('Same category');
    }

    // Shared tags
    const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag));
    if (sharedTags.length > 0) {
      score += sharedTags.length * 5;
      reasons.push(`${sharedTags.length} shared tags`);
    }

    // Featured posts get bonus
    if (post.featured) {
      score += 2;
      reasons.push('Featured post');
    }

    return { post, score, reasons };
  });

  // Sort by score and take top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

// Get blog analytics
export async function getBlogAnalytics(): Promise<BlogAnalytics> {
  const posts = await getAllPosts();
  const postsByCategory = {} as Record<string, number>;
  const postsByYear = {} as Record<number, number>;
  const tagFrequency: Record<string, number> = {};

  let totalReadTime = 0;
  let featuredCount = 0;

  // Initialize category counts
  blogCategories.forEach((category) => {
    postsByCategory[category] = 0;
  });

  posts.forEach((post) => {
    // Count by category
    postsByCategory[post.category] = (postsByCategory[post.category] || 0) + 1;

    // Count by year
    const year = post.publishedAtDate.getFullYear();
    postsByYear[year] = (postsByYear[year] || 0) + 1;

    // Tag frequency
    post.tags.forEach((tag) => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });

    // Read time aggregation
    totalReadTime += post.readTime;

    // Featured posts
    if (post.featured) {
      featuredCount++;
    }
  });

  const averageReadTime = posts.length > 0 ? Math.round(totalReadTime / posts.length) : 0;

  return {
    totalPosts: posts.length,
    postsByCategory: postsByCategory as Record<string, number>,
    postsByYear,
    averageReadTime,
    featuredPosts: featuredCount,
    tagFrequency,
  };
}

// Get unique categories from posts
export async function getCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
}

// Get unique tags from posts
export async function getTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

// Clear blog cache (useful for development)
export function clearBlogCache(): void {
  blogCache.clear();
}

// Generate static params for Next.js
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
