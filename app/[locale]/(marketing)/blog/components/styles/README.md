# CueTimer Blog Design System

This comprehensive design system provides brand-consistent styling, typography,
colors, and component patterns for the CueTimer blog.

## Quick Start

```typescript
import {
  BLOG_DESIGN_SYSTEM,
  BLOG_COLORS,
  BLOG_COMPONENTS,
  type BlogCategory,
} from './blog-styles';

// Use brand colors
const primaryColor = BLOG_COLORS.spotlightOrange;

// Use component styles
const buttonClasses = `${BLOG_COMPONENTS.button.base} ${BLOG_COMPONENTS.button.primary}`;
```

## Brand Colors

### Primary Brand Colors

- **Spotlight Orange** (`#FF6B35`) - Primary brand color
- **Timing Yellow** (`#FFD23F`) - Secondary/accent color
- **Success Green** (`#48BB78`) - Positive actions
- **Info Blue** (`#4299E1`) - Informational elements
- **Professional Gray** (`#2D3748`) - Text and borders

### Extended Color Palettes

Each brand color includes a full palette from 50 to 900:

```typescript
BLOG_COLORS.spotlight[500]; // #ff6b35 (primary)
BLOG_COLORS.spotlight[100]; // #ffe8db (light variant)
BLOG_COLORS.spotlight[700]; // #cc4e24 (dark variant)
```

## Typography

### Responsive Font Sizes

All typography uses CSS `clamp()` for responsive sizing:

```typescript
BLOG_TYPOGRAPHY.fontSize.h1; // clamp(2rem, 5vw, 3rem)
BLOG_TYPOGRAPHY.fontSize.body; // clamp(0.875rem, 1.5vw, 1rem)
```

### Font Weights and Line Heights

```typescript
BLOG_TYPOGRAPHY.fontWeight.semibold; // 600
BLOG_TYPOGRAPHY.lineHeight.relaxed; // 1.625
```

## Component Styles

### Cards

```typescript
// Default card
const defaultCard = `${BLOG_COMPONENTS.card.base} ${BLOG_COMPONENTS.card.hover}`;

// Featured card
const featuredCard = `${BLOG_COMPONENTS.card.base} ${BLOG_COMPONENTS.card.featured}`;

// Compact card
const compactCard = `${BLOG_COMPONENTS.card.base} ${BLOG_COMPONENTS.card.compact}`;
```

### Buttons

```typescript
// Primary button
const primaryButton = `${BLOG_COMPONENTS.button.base} ${BLOG_COMPONENTS.button.primary} ${BLOG_COMPONENTS.button.sizes.md}`;

// Secondary button
const secondaryButton = `${BLOG_COMPONENTS.button.base} ${BLOG_COMPONENTS.button.secondary} ${BLOG_COMPONENTS.button.sizes.sm}`;
```

### Category Badges

```typescript
const getCategoryStyles = (category: BlogCategory) => {
  return `${BLOG_COMPONENTS.category.base} ${BLOG_COMPONENTS.category[category]}`;
};

// Usage
const timingCategory = getCategoryStyles('timing'); // bg-blue-100 text-blue-800 border-blue-200
```

## Animations

### Transitions

```typescript
// Hover transition
const hoverTransition = `transition-all duration-${BLOG_ANIMATIONS.duration.normal} ${BLOG_ANIMATIONS.easing.easeOut}`;

// Focus states
const focusStyles = `${BLOG_ACCESSIBILITY.focus.ring} ${BLOG_ACCESSIBILITY.focus.ringColors.primary}`;
```

### Custom Animations

```typescript
// Fade in animation
const fadeIn = `animate-fade-in`;

// Slide up animation
const slideUp = `animate-slide-up`;
```

## Responsive Design

### Breakpoints

```typescript
BLOG_BREAKPOINTS.screens.sm; // 640px
BLOG_BREAKPOINTS.screens.lg; // 1024px
BLOG_BREAKPOINTS.screens.xl; // 1280px
```

### Responsive Utilities

```typescript
// Responsive grid
const responsiveGrid = `${BLOG_UTILITIES.grid.cols.responsive}`;

// Responsive flex
const responsiveFlex = `flex-col md:flex-row`;
```

## Accessibility

### Focus Management

```typescript
// Accessible focus styles
const accessibleButton = `${BLOG_COMPONENTS.button.base} ${BLOG_ACCESSIBILITY.focus.ring} ${BLOG_ACCESSIBILITY.focus.ringColors.primary}`;

// Screen reader only text
const srOnly = BLOG_ACCESSIBILITY.srOnly;
```

### Reduced Motion

```typescript
// Respect user motion preferences
const respectfulAnimation = `transition-transform ${BLOG_ACCESSIBILITY.reducedMotion}`;
```

## Integration Examples

### Blog Card Component

```typescript
import React from 'react';
import { BlogPost } from '@/types/blog';
import {
  BLOG_COMPONENTS,
  BLOG_COLORS,
  BLOG_UTILITIES,
  type BlogCategory,
} from './blog-styles';

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
}

export function BlogPostCard({ post, variant = 'default' }: BlogPostCardProps) {
  const categoryStyles = `${BLOG_COMPONENTS.category.base} ${BLOG_COMPONENTS.category[post.category as BlogCategory]}`;
  const cardStyles = `${BLOG_COMPONENTS.card.base} ${BLOG_COMPONENTS.card[variant]}`;

  return (
    <article className={cardStyles}>
      <div className="p-6">
        <div className="mb-3">
          <span className={categoryStyles}>
            {post.category}
          </span>
        </div>

        <h3 className={`${BLOG_COMPONENTS.heading.h3} mb-3 ${BLOG_UTILITIES.truncate.lineClamp[2]}`}>
          {post.title}
        </h3>

        <p className={`${BLOG_COMPONENTS.body.base} mb-4 ${BLOG_UTILITIES.truncate.lineClamp[3]}`}>
          {post.summary}
        </p>

        <div className={BLOG_COMPONENTS.article.metadata}>
          <span>{post.author}</span>
          <span>•</span>
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </article>
  );
}
```

### Table of Contents Component

```typescript
import React from 'react';
import { BLOG_COMPONENTS, BLOG_UTILITIES, BLOG_ACCESSIBILITY } from './blog-styles';

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ items, activeId }: {
  items: TableOfContentsItem[];
  activeId?: string;
}) {
  return (
    <nav className={BLOG_COMPONENTS.toc.container}>
      <div className={BLOG_COMPONENTS.toc.header}>
        <h3 className={BLOG_COMPONENTS.heading.h5}>Table of Contents</h3>
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

## Best Practices

### 1. Consistent Color Usage

- Use `BLOG_COLORS` constants instead of hardcoding values
- Prefer semantic color names over specific hex values
- Ensure proper contrast ratios for accessibility

### 2. Responsive Typography

- Let the design system handle responsive font sizes
- Use semantic typography classes (`h1`, `h2`, etc.)
- Maintain consistent line heights for readability

### 3. Animation Guidelines

- Keep animations under 500ms for better UX
- Use `ease-out` for most micro-interactions
- Respect reduced motion preferences

### 4. Component Consistency

- Use predefined component styles when available
- Extend base styles with Tailwind utilities as needed
- Maintain consistent spacing and sizing

### 5. Accessibility First

- Always include focus states for interactive elements
- Use semantic HTML elements
- Ensure keyboard navigation works properly

## Migration Guide

When updating existing components to use the design system:

1. Replace hardcoded colors with `BLOG_COLORS` constants
2. Use `BLOG_COMPONENTS` styles for common patterns
3. Add proper focus states and accessibility features
4. Ensure responsive behavior using the breakpoint system
5. Test with reduced motion and high contrast modes

## Contributing

When adding new styles to the design system:

1. Follow the existing naming conventions
2. Add TypeScript types for new constants
3. Include responsive variants where appropriate
4. Document accessibility considerations
5. Test across all supported breakpoints
