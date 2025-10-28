# Internal Linking Automation - Usage Guide

## Overview

The internal linking system automatically suggests and inserts relevant internal
links within blog content, leveraging existing CueTimer blog infrastructure.

## Configuration

Edit `config/internal-linking.config.ts` to customize:

- `maxLinksPerPost`: Maximum internal links per article
- `minRelevanceScore`: Minimum relevance threshold (0.0-1.0)
- `excludeCategories`: Categories to exclude from linking
- `linkFormat`: How links are displayed (inline, footnote, sidebar)

## Usage in Components

### Automatic Link Injection

```tsx
import { BlogPostContent } from '@/components/blog/BlogPostContent';

<BlogPostContent
  content={content}
  enableInternalLinks={true}
  currentSlug='current-post'
  locale='en'
  maxInternalLinks={5}
/>;
```

### Manual Link Processing

```tsx
import { InternalLinkInjector } from '@/components/blog/InternalLinkInjector';

<InternalLinkInjector
  content={content}
  currentSlug='current-post'
  locale='en'
  maxLinks={5}
/>;
```

### Smart Link Component

```tsx
import { SmartLink } from '@/components/blog/SmartLink';

<SmartLink href='/blog/another-post' title='Related Article' isInternal={true}>
  Related Article
</SmartLink>;
```

## CLI Commands

### Analyze Single Article

```bash
bun run scripts/blog-internal-links.ts analyze --slug "article-slug" --limit 5
```

### Analyze All Articles

```bash
bun run scripts/blog-internal-links.ts analyze --locale en --export ./links.json
```

### View Statistics

```bash
bun run scripts/blog-internal-links.ts stats --locale en
```

## API Usage

```typescript
import { getLinkSuggestions } from '@/lib/internal-linking';

const suggestions = await getLinkSuggestions('current-slug', 5, 'en');
```

```typescript
import { processMdxContentWithLinks } from '@/lib/utils';

const processedContent = await processMdxContentWithLinks(
  content,
  'current-slug',
  'en',
  5
);
```

## Testing

```bash
# Run all internal linking tests
bun test __tests__/lib/internal-linking.test.ts
bun test __tests__/lib/mdx-plugins/internal-link-inserter.test.ts
bun test __tests__/components/blog/InternalLinkInjector.test.tsx
bun test __tests__/scripts/blog-internal-links.test.ts
bun test __tests__/lib/integration.test.ts
bun test __tests__/components/blog/BlogPostContent.test.tsx
```

## Configuration Examples

### Conservative Configuration

```typescript
export const conservativeConfig = {
  enabled: true,
  maxLinksPerPost: 3, // Fewer links per article
  minRelevanceScore: 0.5, // Only high-quality links
  excludeCategories: ['news'], // Don't link from news posts
  linkFormat: 'inline',
  locales: ['en'],
};
```

### Aggressive Configuration

```typescript
export const aggressiveConfig = {
  enabled: true,
  maxLinksPerPost: 8, // More links per article
  minRelevanceScore: 0.2, // Lower threshold for more suggestions
  excludeCategories: [],
  linkFormat: 'inline',
  locales: ['en', 'es', 'pt-br', 'fr'],
};
```

## Integration with Existing Infrastructure

The internal linking system leverages:

- **Content Processing**: Uses existing `processMdxContent()`,
  `extractHeadingsFromMdx()`, `generateSlug()`
- **Content Discovery**: Builds on `getAllPosts()`, `searchPosts()`, filtering
  systems
- **Similarity Algorithms**: Enhances existing `getRelatedPosts()` scoring
- **SEO Analysis**: Extends `analyzeKeywords()` for link opportunity detection
- **Component Architecture**: Adapts `RelatedPosts`, `TableOfContents` patterns
- **CLI Patterns**: Follows established blog-cli.ts structure
- **Type System**: Uses existing comprehensive blog types

## Error Handling

The system includes comprehensive error handling:

- Graceful fallback to original content if processing fails
- CLI commands with helpful error messages
- Component-level error boundaries
- Type-safe error handling throughout

## Performance Considerations

- Server-side processing for better performance
- Caching of link suggestions
- Efficient content processing pipelines
- Minimal impact on existing blog functionality
