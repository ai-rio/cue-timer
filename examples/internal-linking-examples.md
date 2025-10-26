# Internal Linking Automation - Examples

## Basic Usage

### 1. Component Integration

```tsx
import { BlogPostContent } from '@/components/blog/BlogPostContent';

// Enable internal linking for a blog post
<BlogPostContent
  content={blogPost.content}
  enableInternalLinks={true}
  currentSlug={blogPost.slug}
  locale={blogPost.locale}
  maxInternalLinks={5}
/>;
```

### 2. API Usage

```typescript
import { getLinkSuggestions } from '@/lib/internal-linking';

// Get link suggestions for a post
const suggestions = await getLinkSuggestions('my-blog-post', 5, 'en');

suggestions.forEach((suggestion) => {
  console.log(`${suggestion.title} (Score: ${suggestion.score})`);
  console.log(`Reason: ${suggestion.reason}`);
  console.log(`Suggested anchor: "${suggestion.suggestedAnchor}"`);
});
```

### 3. Content Processing

```typescript
import { processMdxContentWithLinks } from '@/lib/utils';

const content = `Learn about CueTimer features and event management capabilities.`;
const processed = await processMdxContentWithLinks(
  content,
  'current-post',
  'en'
);

// Result: Content with internal links automatically inserted
```

## CLI Examples

### Analyze specific article

```bash
bun run scripts/blog-internal-links.ts analyze \
  --slug "introduction-to-cuetimer" \
  --limit 10 \
  --export ./analysis.json
```

### Get site-wide statistics

```bash
bun run scripts/blog-internal-links.ts stats --locale en
```

### Multi-language analysis

```bash
bun run scripts/blog-internal-links.ts analyze --locale all --limit 5
```

## Configuration Examples

### Conservative Configuration

```typescript
// config/internal-linking.config.ts
export const conservativeConfig = {
  enabled: true,
  maxLinksPerPost: 3, // Conservative approach
  minRelevanceScore: 0.5, // Only high-quality links
  excludeCategories: ['news'], // Don't link from news posts
  targetCategories: ['tutorial'], // Focus on tutorials
  linkFormat: 'inline',
  locales: ['en', 'es'],
};
```

### Aggressive Configuration

```typescript
// config/internal-linking.config.ts
export const aggressiveConfig = {
  enabled: true,
  maxLinksPerPost: 8, // More links per article
  minRelevanceScore: 0.2, // Lower threshold for more suggestions
  excludeCategories: [],
  linkFormat: 'inline',
  locales: ['en', 'es', 'pt-br', 'fr'],
};
```

## Output Examples

### Link Suggestions Output

```
🔗 Link Suggestions:

Article: cuetimer-features

  1. Event Management Guide
     Score: 85.2%
     Reason: category
     Anchor: "event management"

  2. Timer Settings Tutorial
     Score: 72.8%
     Reason: tag
     Anchor: "timer settings"
```

### Statistics Output

```
📈 Internal Linking Statistics:

  Total Articles: 45
  Articles with Internal Links: 38
  Average Links per Article: 3.24
  Link Coverage: 84.44%
```

### JSON Export Output

```json
{
  "cuetimer-features": [
    {
      "slug": "event-management-guide",
      "title": "Event Management Guide",
      "score": 0.852,
      "reason": "category",
      "suggestedAnchor": "event management",
      "contextExcerpt": "Learn how to manage events efficiently..."
    }
  ]
}
```

## Advanced Examples

### Custom Link Component

```tsx
import { SmartLink } from '@/components/blog/SmartLink';

function CustomInternalLink({ suggestion }: { suggestion: LinkSuggestion }) {
  return (
    <SmartLink
      href={`/blog/${suggestion.slug}`}
      title={suggestion.title}
      isInternal={true}
      className='custom-link-style'
    >
      {suggestion.suggestedAnchor}
    </SmartLink>
  );
}
```

### Batch Processing

```typescript
import { getAllPosts, getLinkSuggestions } from '@/lib/internal-linking';

async function generateAllSuggestions() {
  const allPosts = await getAllPosts();
  const allSuggestions = new Map();

  for (const post of allPosts) {
    const suggestions = await getLinkSuggestions(post.slug, 5, post.locale);
    if (suggestions.length > 0) {
      allSuggestions.set(post.slug, suggestions);
    }
  }

  return allSuggestions;
}
```

### Custom Filtering

```typescript
import { getLinkSuggestions } from '@/lib/internal-linking';

async function getFilteredSuggestions(slug: string) {
  const suggestions = await getLinkSuggestions(slug, 10, 'en');

  return suggestions
    .filter((s) => s.score > 0.7) // Only high-quality links
    .filter((s) => s.reason === 'category') // Only category matches
    .slice(0, 3); // Limit to top 3
}
```

## Integration Examples

### With Existing Blog Pipeline

```tsx
// pages/blog/[slug].tsx
import { getPostBySlug } from '@/lib/blog';
import BlogPostContent from '@/components/blog/BlogPostContent';

export default function BlogPost({ post }: { post: BlogPost }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <BlogPostContent
        content={post.content}
        enableInternalLinks={true}
        currentSlug={post.slug}
        locale={post.locale}
        maxInternalLinks={5}
      />
    </article>
  );
}
```

### With Analytics

```typescript
import { getLinkSuggestions } from '@/lib/internal-linking';

async function trackLinkPerformance(slug: string) {
  const suggestions = await getLinkSuggestions(slug, 5, 'en');

  // Track which suggestions are most effective
  suggestions.forEach((suggestion) => {
    analytics.track('link_suggested', {
      source: slug,
      target: suggestion.slug,
      score: suggestion.score,
      reason: suggestion.reason,
    });
  });
}
```

## Error Handling Examples

### Graceful Fallback

```tsx
import { InternalLinkInjector } from '@/components/blog/InternalLinkInjector';

function SafeInternalLink({ content, ...props }: any) {
  try {
    return <InternalLinkInjector content={content} {...props} />;
  } catch (error) {
    console.error('Internal linking failed:', error);
    return <div>{content}</div>; // Fallback to original content
  }
}
```

### Error Boundary

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function InternalLinkingWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<div>Internal linking temporarily unavailable</div>}
      onError={(error) => console.error('Internal linking error:', error)}
    >
      {children}
    </ErrorBoundary>
  );
}
```

## Performance Examples

### Caching Suggestions

```typescript
const suggestionCache = new Map<string, LinkSuggestion[]>();

async function getCachedSuggestions(
  slug: string,
  maxSuggestions: number,
  locale: string
) {
  const cacheKey = `${slug}-${maxSuggestions}-${locale}`;

  if (suggestionCache.has(cacheKey)) {
    return suggestionCache.get(cacheKey)!;
  }

  const suggestions = await getLinkSuggestions(slug, maxSuggestions, locale);
  suggestionCache.set(cacheKey, suggestions);

  return suggestions;
}
```

### Lazy Loading

```tsx
import { useState, useEffect } from 'react';

function LazyInternalLinks({ slug, locale }: { slug: string; locale: string }) {
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([]);

  useEffect(() => {
    getLinkSuggestions(slug, 5, locale).then(setSuggestions);
  }, [slug, locale]);

  if (suggestions.length === 0) {
    return <div>Loading suggestions...</div>;
  }

  return (
    <div>
      {suggestions.map((suggestion) => (
        <div key={suggestion.slug}>
          <a href={`/blog/${suggestion.slug}`}>{suggestion.title}</a>
        </div>
      ))}
    </div>
  );
}
```
