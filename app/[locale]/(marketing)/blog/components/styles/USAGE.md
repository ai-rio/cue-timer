# CueTimer Blog Design System - Usage Guide

This guide shows how to integrate the new blog design system into existing
CueTimer blog components.

## Migration Steps

### 1. Update Existing Components

#### Before (Existing BlogPostCard.tsx):

```typescript
const categoryColors = {
  timing: 'bg-blue-100 text-blue-800 border-blue-200',
  productivity: 'bg-green-100 text-green-800 border-green-200',
  // ... more categories
};

const cardStyles = {
  default:
    'group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary-300',
};
```

#### After (Using Design System):

```typescript
import {
  BLOG_COMPONENTS,
  buildCategoryStyles,
  buildCardStyles,
  type BlogCategory,
} from './styles';

const getCategoryStyles = (category: BlogCategory) =>
  buildCategoryStyles(category);
const getCardStyles = (variant: 'default' | 'featured' | 'compact') =>
  buildCardStyles(variant);
```

### 2. Replace Hardcoded Colors

#### Before:

```typescript
className="text-primary-600 hover:text-primary-700"
style={{ backgroundColor: '#FF6B35' }}
```

#### After:

```typescript
import { BLOG_COLORS } from './styles';

className="text-spotlight-600 hover:text-spotlight-700"
style={{ backgroundColor: BLOG_COLORS.spotlightOrange }}
```

### 3. Use Responsive Typography

#### Before:

```typescript
<h2 className="text-2xl md:text-3xl font-bold">Title</h2>
```

#### After:

```typescript
import { BLOG_COMPONENTS } from './styles';

<h2 className={BLOG_COMPONENTS.heading.h2}>Title</h2>
```

## Integration Examples

### Blog Grid Component

```typescript
import React from 'react';
import { BLOG_UTILITIES, BLOG_COMPONENTS } from './styles';

export function BlogGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${BLOG_UTILITIES.grid.cols.responsive} gap-6`}>
      {children}
    </div>
  );
}
```

### Table of Contents Integration

```typescript
import React from 'react';
import { BLOG_COMPONENTS, BLOG_ACCESSIBILITY } from './styles';

export function UpdatedTableOfContents({ items, activeId }: Props) {
  return (
    <nav className={BLOG_COMPONENTS.toc.container}>
      <div className={BLOG_COMPONENTS.toc.header}>
        <h3 className={BLOG_COMPONENTS.heading.h5}>Contents</h3>
      </div>

      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const linkStyles = `${BLOG_COMPONENTS.toc.link.base} ${
            isActive ? BLOG_COMPONENTS.toc.link.active : BLOG_COMPONENTS.toc.link.inactive
          } ${BLOG_ACCESSIBILITY.focus.ring}`;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={linkStyles}
                style={{ marginLeft: `${item.level * 16}px` }}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

### Search Component Integration

```typescript
import React from 'react';
import { BLOG_COMPONENTS, BLOG_UTILITIES } from './styles';

export function BlogSearch({ value, onChange }: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={`${BLOG_UTILITIES.flex.center} gap-2`}>
      <div className={BLOG_COMPONENTS.search.container}>
        <input
          type="text"
          placeholder="Search articles..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={BLOG_COMPONENTS.search.input}
        />
      </div>

      <button className={`${BLOG_COMPONENTS.button.base} ${BLOG_COMPONENTS.button.primary} ${BLOG_COMPONENTS.button.sizes.md}`}>
        Search
      </button>
    </div>
  );
}
```

## Quick Reference

### Import Statements

```typescript
// For all design system exports
import BLOG_DESIGN_SYSTEM from './styles';

// For specific constants
import { BLOG_COLORS, BLOG_COMPONENTS, BLOG_UTILITIES } from './styles';

// For utilities
import { buildCardStyles, buildButtonStyles, createGrid } from './styles';

// For types
import type { BlogCategory, BlogButtonVariant } from './styles';
```

### Common Patterns

#### Category Badge

```typescript
const categoryBadge = `${BLOG_COMPONENTS.category.base} ${BLOG_COMPONENTS.category[postCategory]}`;
```

#### Button Styles

```typescript
const button = `${BLOG_COMPONENTS.button.base} ${BLOG_COMPONENTS.button.primary} ${BLOG_COMPONENTS.button.sizes.md}`;
```

#### Responsive Grid

```typescript
const grid = `${BLOG_UTILITIES.grid.cols.responsive} gap-6`;
```

#### Typography

```typescript
const heading = BLOG_COMPONENTS.heading.h2;
const body = BLOG_COMPONENTS.body.base;
const muted = BLOG_COMPONENTS.body.muted;
```

#### Focus States

```typescript
const focusable = `${BLOG_ACCESSIBILITY.focus.ring} ${BLOG_ACCESSIBILITY.focus.ringColors.primary}`;
```

## Testing Integration

### 1. Visual Testing

Use the `BlogDesignExample` component to verify styles:

```typescript
import { BlogDesignExample } from './styles';

// In your test page or storybook
<BlogDesignExample posts={samplePosts} />
```

### 2. Type Safety

Ensure all TypeScript types are properly imported:

```typescript
import type { BlogCategory } from './styles';

const category: BlogCategory = 'timing'; // Type-checked
```

### 3. Accessibility Testing

Verify focus states and reduced motion:

```typescript
// Test focus styles
const button = document.querySelector('button');
button?.focus();

// Test reduced motion
// @media (prefers-reduced-motion: reduce)
```

## Benefits of Migration

1. **Consistency**: All components use the same brand colors and typography
2. **Maintainability**: Centralized design tokens make updates easier
3. **Accessibility**: Built-in focus states and reduced motion support
4. **Type Safety**: Full TypeScript support for all design tokens
5. **Responsiveness**: Optimized responsive breakpoints and typography
6. **Performance**: Optimized CSS and reduced bundle size

## Next Steps

1. **Update Components**: Gradually migrate existing blog components
2. **Test Thoroughly**: Ensure visual consistency and accessibility
3. **Customize**: Add any additional brand-specific styles needed
4. **Document**: Document any custom patterns for team reference

## Support

For questions about the design system:

1. Check the README.md for detailed documentation
2. Review the BlogDesignExample.tsx for usage patterns
3. Run type checks to ensure proper integration
4. Test accessibility features across different browsers
