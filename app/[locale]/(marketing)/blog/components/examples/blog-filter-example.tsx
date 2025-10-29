'use client';

import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { blogCategories, type BlogPost } from '@/types/blog';

import {
  BlogFilterErrorBoundary,
  BlogFilterProvider,
  generateFilterSummary,
  useBlogFilter,
} from '../contexts';

// Example Blog Filter Controls Component
function BlogFilterControls() {
  const {
    filters,
    availableYears,
    availableTags,
    setSearchTerm,
    setSelectedCategory,
    addTag,
    removeTag,
    setFeaturedOnly,
    setSelectedYear,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
    totalPosts,
    filteredPosts,
  } = useBlogFilter();

  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && availableTags.includes(newTag.trim())) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className='space-y-6 p-6 bg-white rounded-lg border border-gray-200'>
      {/* Search Input */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Search Posts</label>
        <Input
          type='text'
          placeholder='Search by title, content, tags...'
          value={filters.searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full'
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
        <Select
          value={filters.selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as typeof filters.selectedCategory)}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Categories</SelectItem>
            {blogCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Filter */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Year</label>
        <Select
          value={filters.selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(value === 'all' ? 'all' : parseInt(value))}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select year' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Years</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags Filter */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Tags</label>
        <div className='flex gap-2 mb-2'>
          <Input
            type='text'
            placeholder='Add tag...'
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            className='flex-1'
          />
          <Button onClick={handleAddTag} disabled={!newTag.trim()}>
            Add
          </Button>
        </div>
        <div className='flex flex-wrap gap-2'>
          {filters.selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant='secondary'
              className='cursor-pointer'
              onClick={() => removeTag(tag)}
            >
              {tag} ×
            </Badge>
          ))}
        </div>
        {filters.selectedTags.length === 0 && (
          <p className='text-sm text-gray-500'>No tags selected</p>
        )}
      </div>

      {/* Featured Filter */}
      <div className='flex items-center space-x-2'>
        <input
          type='checkbox'
          id='featured'
          checked={filters.featuredOnly}
          onChange={(e) => setFeaturedOnly(e.target.checked)}
          className='rounded border-gray-300'
        />
        <label htmlFor='featured' className='text-sm font-medium text-gray-700'>
          Show only featured posts
        </label>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button onClick={clearFilters} variant='outline' className='w-full'>
          Clear Filters ({activeFilterCount})
        </Button>
      )}

      {/* Results Summary */}
      <div className='pt-4 border-t border-gray-200'>
        <p className='text-sm text-gray-600 mb-2'>{generateFilterSummary(filters)}</p>
        <p className='text-sm font-medium text-gray-900'>
          {filteredPosts.length} of {totalPosts} posts shown
        </p>
      </div>
    </div>
  );
}

// Example Component to Display Filtered Posts
function FilteredPostsList() {
  const { filteredPosts, isLoading } = useBlogFilter();

  if (isLoading) {
    return (
      <div className='animate-pulse space-y-4'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='h-32 bg-gray-200 rounded-lg' />
        ))}
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-600'>No posts found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {filteredPosts.map((post) => (
        <div
          key={post.slug}
          className='p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow'
        >
          <div className='flex items-start justify-between mb-3'>
            <h3 className='text-xl font-bold text-gray-900'>{post.title}</h3>
            {post.featured && (
              <Badge variant='default' className='ml-2'>
                Featured
              </Badge>
            )}
          </div>
          <p className='text-gray-600 mb-4'>{post.summary}</p>
          <div className='flex items-center justify-between text-sm text-gray-500'>
            <div className='flex items-center gap-4'>
              <Badge variant='outline'>{post.category}</Badge>
              <span>{post.readTime} min read</span>
              <span>{post.publishedAtDate.toLocaleDateString()}</span>
            </div>
            <div className='flex gap-2'>
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant='secondary' className='text-xs'>
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant='secondary' className='text-xs'>
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main Example Component
interface BlogFilterExampleProps {
  posts: BlogPost[];
}

export function BlogFilterExample({ posts }: BlogFilterExampleProps) {
  return (
    <BlogFilterErrorBoundary>
      <BlogFilterProvider posts={posts}>
        <div className='max-w-6xl mx-auto p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Blog Filter System Example</h1>
            <p className='text-gray-600'>
              Demonstration of the BlogFilterContext with filtering capabilities
            </p>
          </div>

          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Filters Sidebar */}
            <div className='lg:col-span-1'>
              <BlogFilterControls />
            </div>

            {/* Posts List */}
            <div className='lg:col-span-2'>
              <FilteredPostsList />
            </div>
          </div>
        </div>
      </BlogFilterProvider>
    </BlogFilterErrorBoundary>
  );
}
