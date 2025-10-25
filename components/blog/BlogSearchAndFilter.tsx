'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { BlogCategory, BlogFilter } from '@/types/blog';
import { blogCategories } from '@/types/blog';

interface BlogSearchAndFilterProps {
  onFilterChange: (filter: BlogFilter) => void;
  className?: string;
}

export default function BlogSearchAndFilter({
  onFilterChange,
  className = '',
}: BlogSearchAndFilterProps) {
  const t = useTranslations('Blog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        searchTerm,
        category: selectedCategory,
        featured: showOnlyFeatured,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, showOnlyFeatured, onFilterChange]);

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: t('filter.allCategories') },
      ...blogCategories.map((category) => ({
        value: category,
        label: t(`categories.${category}`),
      })),
    ],
    [t]
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setShowOnlyFeatured(false);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || showOnlyFeatured;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <svg
            className='h-5 w-5 text-gray-400'
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
        </div>
        <input
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('filter.searchPlaceholder')}
          className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200'
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
          >
            <svg
              className='h-4 w-4 text-gray-400 hover:text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
        {/* Category Filter */}
        <div className='flex-1 max-w-xs'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('filter.categoryLabel')}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as BlogCategory | 'all')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200'
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Toggle */}
        <div className='flex items-center'>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={showOnlyFeatured}
              onChange={(e) => setShowOnlyFeatured(e.target.checked)}
              className='sr-only peer'
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            <span className='ml-3 text-sm font-medium text-gray-700'>
              {t('filter.featuredOnly')}
            </span>
          </label>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200'
          >
            {t('filter.clearFilters')}
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg'>
          <span className='text-sm text-gray-600'>{t('filter.activeFilters')}:</span>
          {searchTerm && (
            <span className='inline-flex items-center px-2 py-1 rounded text-xs bg-primary-100 text-primary-700'>
              "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className='ml-1 hover:text-primary-900'>
                ×
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className='inline-flex items-center px-2 py-1 rounded text-xs bg-primary-100 text-primary-700'>
              {t(`categories.${selectedCategory}`)}
              <button
                onClick={() => setSelectedCategory('all')}
                className='ml-1 hover:text-primary-900'
              >
                ×
              </button>
            </span>
          )}
          {showOnlyFeatured && (
            <span className='inline-flex items-center px-2 py-1 rounded text-xs bg-primary-100 text-primary-700'>
              {t('featured')}
              <button
                onClick={() => setShowOnlyFeatured(false)}
                className='ml-1 hover:text-primary-900'
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
