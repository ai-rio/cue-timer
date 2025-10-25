import { NextRequest, NextResponse } from 'next/server';

import { getAllPosts } from '@/lib/blog';
import { createBlogError } from '@/lib/blog-utils';
import type { BlogCategory, BlogFilter } from '@/types/blog';
import type { BlogError, BlogListResponse } from '@/types/blog-api';

export async function GET(request: NextRequest): Promise<NextResponse<BlogListResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filter parameters with proper type safety
    const filter: BlogFilter = {};

    const category = searchParams.get('category');
    if (category && category !== 'all') {
      filter.category = category as BlogCategory;
    }

    const featured = searchParams.get('featured');
    if (featured) {
      filter.featured = featured === 'true';
    }

    const search = searchParams.get('search');
    if (search) {
      filter.searchTerm = search;
    }

    const year = searchParams.get('year');
    if (year) {
      const parsedYear = parseInt(year, 10);
      if (!isNaN(parsedYear)) {
        filter.year = parsedYear;
      }
    }

    const tags = searchParams.get('tags');
    if (tags) {
      filter.tags = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    const limit = searchParams.get('limit');
    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        filter.limit = Math.min(parsedLimit, 100); // Cap at 100 for performance
      }
    }

    const offset = searchParams.get('offset');
    if (offset) {
      const parsedOffset = parseInt(offset, 10);
      if (!isNaN(parsedOffset) && parsedOffset >= 0) {
        filter.offset = parsedOffset;
      }
    }

    // Fetch posts with enhanced error handling
    const posts = await getAllPosts(filter);

    // Apply pagination if limit is specified
    let paginatedPosts = posts;
    const totalCount = posts.length;

    if (filter.limit !== undefined) {
      const start = filter.offset || 0;
      const end = start + filter.limit;
      paginatedPosts = posts.slice(start, end);
    }

    // Build response with metadata
    const response: BlogListResponse = {
      success: true,
      data: paginatedPosts,
      count: paginatedPosts.length,
      pagination: {
        page: Math.floor((filter.offset || 0) / (filter.limit || 10)) + 1,
        limit: filter.limit || 10,
        total: totalCount,
        hasMore: (filter.offset || 0) + (filter.limit || 10) < totalCount,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    // Enhanced error logging with structured information
    const errorDetails = {
      timestamp: new Date().toISOString(),
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : 'Unknown error',
    };

    // Silent error handling for API errors

    // Create proper error response
    const blogError: BlogError = createBlogError(
      'BLOG_API_ERROR',
      error instanceof Error ? error.message : 'Failed to fetch blog posts',
      errorDetails
    );

    return NextResponse.json(
      {
        success: false,
        error: blogError.message,
        message: blogError.code,
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
