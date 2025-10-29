# Blog Filter Context

A comprehensive React context system for managing blog post search and filtering
functionality in the CueTimer blog system.

## Features

- **Search**: Full-text search across title, summary, content, tags, and
  categories
- **Category Filtering**: Filter by blog categories (timing, productivity,
  events, etc.)
- **Tag Filtering**: Multi-select tag filtering with add/remove functionality
- **Year Filtering**: Filter posts by publication year
- **Featured Filtering**: Show only featured posts
- **URL Synchronization**: Optional URL parameter synchronization for shareable
  filtered views
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Error Handling**: Built-in error boundaries for robust error handling
- **Performance**: Memoized filtering logic and optimized re-renders

## Quick Start

### Basic Usage

```tsx
import { BlogFilterProvider, useBlogFilter } from './contexts';

function BlogPage() {
  const posts = await getAllPosts(); // Your blog posts data

  return (
    <BlogFilterProvider posts={posts}>
      <BlogContent />
    </BlogFilterProvider>
  );
}

function BlogContent() {
  const { filteredPosts, setSearchTerm, setSelectedCategory } = useBlogFilter();

  return (
    <div>
      <SearchInput onChange={setSearchTerm} />
      <CategorySelect onChange={setSelectedCategory} />
      <PostList posts={filteredPosts} />
    </div>
  );
}
```

### With URL Synchronization

```tsx
import { BlogFilterProvider, useBlogFilterWithUrl } from './contexts';

function BlogPage() {
  const posts = await getAllPosts();

  return (
    <BlogFilterProvider posts={posts}>
      <BlogContentWithUrl />
    </BlogFilterProvider>
  );
}

function BlogContentWithUrl() {
  const { filteredPosts, setSearchTerm, filters } = useBlogFilterWithUrl();
  // URL will automatically update when filters change
}
```

## API Reference

### BlogFilterProvider

Wraps your blog components with filtering context.

```tsx
<BlogFilterProvider posts={BlogPost[]}>
  {children}
</BlogFilterProvider>
```

**Props:**

- `posts`: Array of `BlogPost` objects to filter

### useBlogFilter Hook

Returns the filter context state and actions.

```tsx
const {
  // State
  filters,
  filteredPosts,
  availableYears,
  availableTags,
  totalPosts,
  isLoading,

  // Actions
  setSearchTerm,
  setSelectedCategory,
  setSelectedTags,
  addTag,
  removeTag,
  setFeaturedOnly,
  setSelectedYear,
  clearFilters,
  resetFilters,

  // Utility
  hasActiveFilters,
  activeFilterCount,
} = useBlogFilter();
```

### Filter State

```tsx
interface BlogFilterState {
  searchTerm: string;
  selectedCategory: BlogCategory | 'all';
  selectedTags: string[];
  featuredOnly: boolean;
  selectedYear: number | 'all';
}
```

## Utility Functions

### generateFilterSummary

Creates human-readable filter descriptions.

```tsx
import { generateFilterSummary } from './contexts';

const summary = generateFilterSummary(filters);
// Result: "Posts searching for 'productivity' in timing, tagged 'tutorial', from 2024"
```

### getPopularTags

Extracts most used tags from posts.

```tsx
import { getPopularTags } from './contexts';

const popularTags = getPopularTags(posts, 10);
// Result: [{ tag: 'productivity', count: 15 }, { tag: 'events', count: 12 }, ...]
```

### validateFilters

Validates filter parameters.

```tsx
import { validateFilters } from './contexts';

const { isValid, errors } = validateFilters(filters);
```

### createFilterQueryString

Creates URL-safe query strings from filters.

```tsx
import { createFilterQueryString } from './contexts';

const queryString = createFilterQueryString(filters);
// Result: "?search=productivity&category=timing&featured=true"
```

## Error Handling

Use the `BlogFilterErrorBoundary` to catch and handle filtering errors:

```tsx
<BlogFilterErrorBoundary
  onError={(error, errorInfo) => {
    // Log to error tracking service
    console.error('Blog filter error:', error, errorInfo);
  }}
>
  <BlogFilterProvider posts={posts}>
    <BlogContent />
  </BlogFilterProvider>
</BlogFilterErrorBoundary>
```

## Performance Considerations

- The filtering logic is memoized to avoid unnecessary re-calculations
- Search debouncing can be implemented using the provided `debounce` utility
- Large post lists should consider pagination or virtualization
- Content searching (searching within post content) is optional and can be
  disabled for performance

## Integration with shadcn/ui

The context is designed to work seamlessly with shadcn/ui components:

```tsx
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function FilterControls() {
  const { filters, setSearchTerm, setSelectedCategory } = useBlogFilter();

  return (
    <div className='space-y-4'>
      <Input
        placeholder='Search posts...'
        value={filters.searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Select
        value={filters.selectedCategory}
        onValueChange={setSelectedCategory}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Categories</SelectItem>
          {/* Category items */}
        </SelectContent>
      </Select>
    </div>
  );
}
```

## Best Practices

1. **Provider Placement**: Place the `BlogFilterProvider` as high as possible in
   your component tree but only wrap the components that need filtering.

2. **URL Synchronization**: Use `useBlogFilterWithUrl` for public pages where
   filtered views should be shareable via URL.

3. **Performance**: For large post collections, consider implementing pagination
   or virtual scrolling alongside filtering.

4. **Error Handling**: Always wrap the provider with `BlogFilterErrorBoundary`
   in production.

5. **Debouncing**: Implement search debouncing to avoid excessive filtering
   during typing.

## File Structure

```
contexts/
├── blog-filter-context.tsx      # Main context and provider
├── blog-filter-error-boundary.tsx # Error boundary component
├── blog-filter-utils.ts         # Utility functions
├── use-blog-filter-with-url.ts  # URL synchronization hook
├── index.ts                     # Exports
└── README.md                    # This documentation
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

- `BlogFilterState` - Filter state interface
- `BlogFilterContextType` - Complete context interface
- All utility functions are properly typed
- Generic support for custom blog post types
