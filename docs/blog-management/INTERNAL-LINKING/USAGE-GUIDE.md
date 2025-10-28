# Internal Linking Automation - Usage Guide

**Complete usage guide for the CueTimer internal linking system**

---

## 🎯 Overview

The Internal Linking Automation system provides intelligent content discovery
and automatic internal link suggestions for the CueTimer Blog Management
Platform. This guide covers all aspects of using and configuring the system.

---

## 🚀 Getting Started

### Prerequisites

- CueTimer Blog Management System v1.0+
- TypeScript 5.0+
- Node.js 18+ or Bun 1.0+

### Basic Setup

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

### Quick Configuration

```typescript
// config/internal-linking.config.ts
export const defaultConfig = {
  enabled: true,
  maxLinksPerPost: 5,
  minRelevanceScore: 0.3,
  excludeCategories: ['news'],
  linkFormat: 'inline',
  locales: ['en', 'es', 'pt-br', 'fr'],
};
```

---

## 🔧 Configuration

### System Configuration

Edit `config/internal-linking.config.ts` to customize the system:

```typescript
export const internalLinkingConfig = {
  // Global settings
  enabled: true,

  // Link density control
  maxLinksPerPost: 5, // Maximum internal links per article
  minRelevanceScore: 0.3, // Minimum relevance threshold (0.0-1.0)

  // Content filtering
  excludeCategories: ['news'], // Categories to exclude from linking
  targetCategories: ['tutorial', 'case-study'], // Categories to prioritize

  // Link formatting
  linkFormat: 'inline', // 'inline', 'footnote', 'sidebar'

  // Multi-language support
  locales: ['en', 'es', 'pt-br', 'fr'],

  // Performance settings
  cacheResults: true,
  cacheTimeout: 3600000, // 1 hour in milliseconds
};
```

### Component-Level Configuration

Configure individual components with specific settings:

```tsx
<BlogPostContent
  content={content}
  enableInternalLinks={true}
  currentSlug='current-post'
  locale='en'
  maxInternalLinks={3} // Override global setting
  minRelevanceScore={0.5} // Higher threshold for quality
  excludeCategories={['news']} // Category-specific exclusion
/>
```

---

## 🛠️ Usage Patterns

### 1. Automatic Link Injection

The most common usage pattern - automatic link insertion during content
rendering:

```tsx
import { BlogPostContent } from '@/components/blog/BlogPostContent';

function BlogPostPage({ post }: { post: BlogPost }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <BlogPostContent
        content={post.content}
        enableInternalLinks={true}
        currentSlug={post.slug}
        locale={post.locale}
        maxInternalLinks={5}
        minRelevanceScore={0.3}
      />
    </article>
  );
}
```

### 2. Manual Link Processing

For more control over the linking process:

```tsx
import { InternalLinkInjector } from '@/components/blog/InternalLinkInjector';

function CustomBlogPost({
  content,
  post,
}: {
  content: string;
  post: BlogPost;
}) {
  return (
    <div className='custom-content-wrapper'>
      <InternalLinkInjector
        content={content}
        currentSlug={post.slug}
        locale={post.locale}
        maxLinks={5}
        linkFormat='inline'
        onLinksInjected={(links) => {
          console.log(`Injected ${links.length} internal links`);
        }}
      />
    </div>
  );
}
```

### 3. Smart Link Component

For individual link creation with enhanced features:

```tsx
import { SmartLink } from '@/components/blog/SmartLink';

function RelatedArticleLink({ suggestion }: { suggestion: LinkSuggestion }) {
  return (
    <SmartLink
      href={`/blog/${suggestion.slug}`}
      title={suggestion.title}
      isInternal={true}
      className='related-article-link'
      showTooltip={true}
      trackClicks={true}
    >
      {suggestion.suggestedAnchor}
    </SmartLink>
  );
}
```

### 4. API Integration

Direct API usage for custom implementations:

```typescript
import { getLinkSuggestions } from '@/lib/internal-linking';

async function generateCustomLinks(currentSlug: string) {
  try {
    const suggestions = await getLinkSuggestions(currentSlug, 5, 'en');

    return suggestions.map((suggestion) => ({
      url: `/blog/${suggestion.slug}`,
      text: suggestion.suggestedAnchor,
      title: suggestion.title,
      score: suggestion.score,
      reason: suggestion.reason,
    }));
  } catch (error) {
    console.error('Failed to generate link suggestions:', error);
    return [];
  }
}
```

---

## 📊 CLI Tools

### Analyze Single Article

```bash
bun run scripts/blog-internal-links.ts analyze \
  --slug "introduction-to-cuetimer" \
  --limit 10 \
  --locale en
```

**Output:**

```
🔗 Link Suggestions:

Article: introduction-to-cuetimer

  1. Event Management Guide
     Score: 85.2%
     Reason: category
     Anchor: "event management"

  2. Timer Settings Tutorial
     Score: 72.8%
     Reason: tag
     Anchor: "timer settings"
```

### Analyze All Articles

```bash
bun run scripts/blog-internal-links.ts analyze \
  --locale en \
  --export ./link-analysis.json
```

### View Statistics

```bash
bun run scripts/blog-internal-links.ts stats --locale en
```

**Output:**

```
📈 Internal Linking Statistics:

  Total Articles: 45
  Articles with Internal Links: 38
  Average Links per Article: 3.24
  Link Coverage: 84.44%
```

### Multi-Language Analysis

```bash
bun run scripts/blog-internal-links.ts analyze --locale all --limit 5
```

---

## 🔌 API Reference

### getLinkSuggestions()

Get link suggestions for a specific article.

```typescript
import { getLinkSuggestions } from '@/lib/internal-linking';

const suggestions = await getLinkSuggestions(
  currentSlug: string,
  maxSuggestions: number = 5,
  locale?: string
): Promise<LinkSuggestion[]>
```

**Parameters:**

- `currentSlug`: The slug of the current article
- `maxSuggestions`: Maximum number of suggestions to return
- `locale`: Language locale (optional, defaults to 'en')

**Returns:** Array of `LinkSuggestion` objects

### processMdxContentWithLinks()

Process MDX content and insert internal links automatically.

```typescript
import { processMdxContentWithLinks } from '@/lib/utils';

const processedContent = await processMdxContentWithLinks(
  content: string,
  currentSlug: string,
  locale: string,
  maxLinks?: number
): Promise<string>
```

### analyzeInternalLinkingOpportunities()

Analyze content for internal linking opportunities.

```typescript
import { analyzeInternalLinkingOpportunities } from '@/lib/internal-linking';

const opportunities = await analyzeInternalLinkingOpportunities(
  content: string,
  allPosts: BlogPost[],
  currentSlug: string
): Promise<InternalLinkingRecommendation[]>
```

---

## 🎛️ Advanced Configuration

### Conservative Configuration

For high-quality, minimal linking:

```typescript
export const conservativeConfig = {
  enabled: true,
  maxLinksPerPost: 3, // Fewer links per article
  minRelevanceScore: 0.5, // Only high-quality links
  excludeCategories: ['news'], // Don't link from news posts
  targetCategories: ['tutorial'], // Focus on tutorials
  linkFormat: 'inline',
  locales: ['en'],
};
```

### Aggressive Configuration

For maximum linking coverage:

```typescript
export const aggressiveConfig = {
  enabled: true,
  maxLinksPerPost: 8, // More links per article
  minRelevanceScore: 0.2, // Lower threshold for more suggestions
  excludeCategories: [],
  targetCategories: [],
  linkFormat: 'inline',
  locales: ['en', 'es', 'pt-br', 'fr'],
};
```

### Performance Optimization

For large sites with many articles:

```typescript
export const performanceConfig = {
  enabled: true,
  maxLinksPerPost: 5,
  minRelevanceScore: 0.3,

  // Performance settings
  cacheResults: true,
  cacheTimeout: 7200000, // 2 hours
  batchSize: 50, // Process in batches
  parallelProcessing: true,

  // Memory optimization
  maxContentLength: 10000, // Limit content analysis length
  truncateLongContent: true,
};
```

---

## 🔄 Integration with Existing Infrastructure

### Content Processing Pipeline

The internal linking system integrates seamlessly with existing content
processing:

```typescript
// Existing pipeline (enhanced)
const processedContent = await processMdxContentWithLinks(
  rawContent,
  post.slug,
  post.locale,
  config.maxLinksPerPost
);

// Continues with existing rendering
const renderedContent = await renderMDX(processedContent);
```

### Blog Management System

Leverages existing blog management functionality:

```typescript
// Uses existing getAllPosts() for content discovery
const allPosts = await getAllPosts();

// Extends existing getRelatedPosts() for link suggestions
const relatedPosts = await getRelatedPosts(currentPost, 10);

// Builds on existing searchPosts() for keyword matching
const searchResults = await searchPosts(keywords, locale);
```

### SEO Analysis Integration

Enhances existing SEO analysis capabilities:

```typescript
// Extends existing analyzeKeywords() function
const keywords = await analyzeKeywords(content);

// Adds internal linking recommendations to existing reports
const recommendations = await analyzeInternalLinkingOpportunities(
  content,
  allPosts,
  currentSlug
);
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run all internal linking tests
bun test __tests__/lib/internal-linking.test.ts
bun test __tests__/lib/mdx-plugins/internal-link-inserter.test.ts
bun test __tests__/components/blog/InternalLinkInjector.test.tsx
```

### Integration Tests

```bash
# Test integration with existing systems
bun test __tests__/lib/integration.test.ts
bun test __tests__/components/blog/BlogPostContent.test.tsx
```

### CLI Tests

```bash
# Test CLI functionality
bun test __tests__/scripts/blog-internal-links.test.ts
```

---

## 📈 Performance Monitoring

### Metrics to Track

- **Link Generation Speed**: Time to generate suggestions
- **Cache Hit Rate**: Effectiveness of caching
- **Link Accuracy**: Acceptance rate of suggestions
- **User Engagement**: Click-through rates on internal links

### Monitoring Code

```typescript
// Track link generation performance
const startTime = performance.now();
const suggestions = await getLinkSuggestions(slug, 5, locale);
const duration = performance.now() - startTime;

analytics.track('link_suggestions_generated', {
  slug,
  suggestionCount: suggestions.length,
  generationTime: duration,
  locale,
});
```

---

## 🚨 Error Handling

### Graceful Degradation

The system includes comprehensive error handling:

```tsx
function SafeInternalLinkInjector({ content, ...props }: any) {
  try {
    return <InternalLinkInjector content={content} {...props} />;
  } catch (error) {
    console.error('Internal linking failed:', error);
    return <div>{content}</div>; // Fallback to original content
  }
}
```

### Error Boundaries

React error boundaries for component-level error handling:

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

---

## 🔗 Related Documentation

- [Examples](./EXAMPLES.md) - Practical code examples
- [Configuration](./CONFIGURATION.md) - Detailed configuration options
- [API Reference](./API-REFERENCE.md) - Complete API documentation
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions
- [Design Document](../internal-linking-automation-design.md) - System
  architecture

---

**Need help?** Check our [Troubleshooting Guide](./TROUBLESHOOTING.md) or
[contact support](mailto:support@cuetimer.com).
