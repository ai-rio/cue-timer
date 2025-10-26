'use client';

import { useState } from 'react';

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
import { Switch } from '@/components/ui/switch';
import { blogCategories, BlogCategory, BlogFilter } from '@/lib/blog';

interface BlogSearchAndFilterSimpleProps {
  onFilterChange: (filter: BlogFilter) => void;
  className?: string;
}

export default function BlogSearchAndFilterSimple({
  onFilterChange,
  className = '',
}: BlogSearchAndFilterSimpleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilters({ searchTerm: value, category: selectedCategory, featured: showOnlyFeatured });
  };

  const handleCategoryChange = (value: BlogCategory | 'all') => {
    setSelectedCategory(value);
    updateFilters({ searchTerm, category: value, featured: showOnlyFeatured });
  };

  const handleFeaturedToggle = (checked: boolean) => {
    setShowOnlyFeatured(checked);
    updateFilters({ searchTerm, category: selectedCategory, featured: checked });
  };

  const updateFilters = (filters: Partial<BlogFilter>) => {
    const newFilter: BlogFilter = {
      searchTerm: filters.searchTerm || searchTerm,
      category: filters.category === 'all' ? undefined : filters.category,
      featured: filters.featured,
    };
    onFilterChange(newFilter);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setShowOnlyFeatured(false);
    onFilterChange({});
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || showOnlyFeatured;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Category Row */}
      <div className='flex flex-col md:flex-row gap-4'>
        {/* Search Input */}
        <div className='flex-1'>
          <div className='relative'>
            <svg
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
            <Input
              type='text'
              placeholder='Search posts...'
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className='w-full md:w-48'>
            <SelectValue placeholder='All Categories' />
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

      {/* Additional Filters and Controls */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        {/* Featured Toggle */}
        <div className='flex items-center space-x-2'>
          <Switch
            id='featured-only'
            checked={showOnlyFeatured}
            onCheckedChange={handleFeaturedToggle}
          />
          <label htmlFor='featured-only' className='text-sm font-medium text-gray-700'>
            Show only featured posts
          </label>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className='flex items-center gap-2 flex-wrap'>
            <span className='text-sm text-gray-500'>Active filters:</span>
            {searchTerm && (
              <Badge variant='secondary' className='text-xs'>
                Search: "{searchTerm}"
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant='secondary' className='text-xs'>
                Category: {selectedCategory}
              </Badge>
            )}
            {showOnlyFeatured && (
              <Badge variant='secondary' className='text-xs'>
                Featured only
              </Badge>
            )}
            <Button variant='outline' size='sm' onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
