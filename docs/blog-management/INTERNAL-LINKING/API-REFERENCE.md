# Internal Linking Automation - API Reference

**Complete API documentation for the CueTimer internal linking system**

---

## 🎯 Overview

This document provides comprehensive API reference for all functions,
interfaces, and components in the Internal Linking Automation system. All APIs
are fully typed with TypeScript for optimal developer experience.

---

## 🔌 Core APIs

### getLinkSuggestions()

Get intelligent internal link suggestions for a specific article.

```typescript
import { getLinkSuggestions } from '@/lib/internal-linking';

const suggestions = await getLinkSuggestions(
  currentSlug: string,
  maxSuggestions?: number = 5,
  locale?: string = 'en'
): Promise<LinkSuggestion[]>
```

**Parameters:**

- `currentSlug` (string, required): The slug of the current article
- `maxSuggestions` (number, optional): Maximum number of suggestions to return
  (default: 5)
- `locale` (string, optional): Language locale (default: 'en')

**Returns:** `Promise<LinkSuggestion[]>` - Array of link suggestions

**Example:**

```typescript
const suggestions = await getLinkSuggestions(
  'advanced-timing-techniques',
  8,
  'en'
);
console.log(`Found ${suggestions.length} suggestions`);
```

### processMdxContentWithLinks()

Process MDX content and automatically insert internal links.

```typescript
import { processMdxContentWithLinks } from '@/lib/utils';

const processedContent = await processMdxContentWithLinks(
  content: string,
  currentSlug: string,
  locale: string,
  maxLinks?: number = 5
): Promise<string>
```

**Parameters:**

- `content` (string, required): Raw MDX content to process
- `currentSlug` (string, required): Slug of the current article
- `locale` (string, required): Language locale
- `maxLinks` (number, optional): Maximum links to insert (default: 5)

**Returns:** `Promise<string>` - Processed content with internal links

**Example:**

```typescript
const processed = await processMdxContentWithLinks(
  rawContent,
  'my-article-slug',
  'en',
  5
);
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

**Parameters:**

- `content` (string, required): Content to analyze
- `allPosts` (BlogPost[], required): All available blog posts
- `currentSlug` (string, required): Slug of the current article

**Returns:** `Promise<InternalLinkingRecommendation[]>` - Array of
recommendations

---

## 📋 Type Definitions

### LinkSuggestion

```typescript
interface LinkSuggestion {
  slug: string; // Target article slug
  title: string; // Target article title
  score: number; // Relevance score (0.0 - 1.0)
  reason: LinkReason; // Why this link was suggested
  suggestedAnchor: string; // Recommended anchor text
  contextExcerpt: string; // Context excerpt from target
  targetCategory?: string; // Target article category
  targetTags?: string[]; // Target article tags
  publishedAt?: string; // Target article publication date
  estimatedReadTime?: number; // Target article read time
}
```

### LinkReason

```typescript
type LinkReason =
  | 'semantic' // Content similarity
  | 'category' // Same category
  | 'tag' // Shared tags
  | 'keyword' // Keyword overlap
  | 'series' // Same series
  | 'author' // Same author
  | 'related' // Related content
  | 'popular'; // Popular content
```

### InternalLinkingRecommendation

```typescript
interface InternalLinkingRecommendation {
  targetSlug: string; // Target article slug
  targetTitle: string; // Target article title
  relevanceScore: number; // Relevance score (0.0 - 1.0)
  suggestedAnchors: string[]; // Recommended anchor texts
  reasoning: string; // Explanation of recommendation
  confidence: number; // Confidence level (0.0 - 1.0)
  potentialImpact: number; // SEO impact estimate (0.0 - 1.0)
}
```

### InternalLinkingConfig

```typescript
interface InternalLinkingConfig {
  // Core settings
  enabled: boolean;
  maxLinksPerPost: number;
  minRelevanceScore: number;

  // Content filtering
  excludeCategories: string[];
  targetCategories: string[];
  excludeTags: string[];
  targetTags: string[];

  // Link formatting
  linkFormat: LinkFormat;
  showLinkScores: boolean;

  // Multi-language
  locales: string[];
  enableCrossLanguageLinks: boolean;
  crossLanguageWeight: number;

  // Performance
  cacheResults: boolean;
  cacheTimeout: number;
  batchSize: number;
  parallelProcessing: boolean;

  // Content processing
  maxContentLength: number;
  truncateLongContent: boolean;
  minWordCount: number;

  // Scoring weights
  categoryWeight: number;
  tagWeight: number;
  semanticWeight: number;
  keywordWeight: number;
}
```

### LinkFormat

```typescript
type LinkFormat =
  | 'inline' // Standard inline links
  | 'footnote' // Footnote-style links
  | 'sidebar' // Sidebar links
  | 'tooltip'; // Links with tooltips
```

---

## 🧩 Component APIs

### BlogPostContent

Enhanced blog post content component with internal linking support.

```tsx
import { BlogPostContent } from '@/components/blog/BlogPostContent';

interface BlogPostContentProps {
  content: string; // MDX content
  enableInternalLinks?: boolean; // Enable internal linking
  currentSlug: string; // Current article slug
  locale: string; // Language locale
  maxInternalLinks?: number; // Maximum internal links
  minRelevanceScore?: number; // Minimum relevance score
  excludeCategories?: string[]; // Categories to exclude
  linkFormat?: LinkFormat; // Link formatting
  className?: string; // CSS classes
  onLinksInserted?: (links: LinkSuggestion[]) => void; // Callback
}
```

**Example:**

```tsx
<BlogPostContent
  content={post.content}
  enableInternalLinks={true}
  currentSlug={post.slug}
  locale={post.locale}
  maxInternalLinks={5}
  minRelevanceScore={0.3}
  onLinksInserted={(links) => console.log(`Inserted ${links.length} links`)}
/>
```

### InternalLinkInjector

Lower-level component for custom link injection.

```tsx
import { InternalLinkInjector } from '@/components/blog/InternalLinkInjector';

interface InternalLinkInjectorProps {
  content: string; // Content to process
  currentSlug: string; // Current article slug
  locale: string; // Language locale
  maxLinks?: number; // Maximum links to insert
  minRelevanceScore?: number; // Minimum relevance score
  linkFormat?: LinkFormat; // Link formatting
  fallback?: React.ReactNode; // Fallback content on error
  onLinksInserted?: (links: LinkSuggestion[]) => void; // Callback
  onError?: (error: Error) => void; // Error callback
}
```

### SmartLink

Enhanced link component with tracking and analytics.

```tsx
import { SmartLink } from '@/components/blog/SmartLink';

interface SmartLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string; // Link URL
  title?: string; // Link title
  isInternal?: boolean; // Internal link flag
  showTooltip?: boolean; // Show tooltip on hover
  trackClicks?: boolean; // Track click events
  analyticsData?: Record<string, any>; // Custom analytics data
  className?: string; // CSS classes
  children: React.ReactNode; // Link content
}
```

---

## 🔧 Utility APIs

### calculateLinkingScore()

Calculate relevance score between two articles.

```typescript
import { calculateLinkingScore } from '@/lib/internal-linking/scoring';

const score = calculateLinkingScore(
  sourcePost: BlogPost,
  targetPost: BlogPost,
  config?: Partial<InternalLinkingConfig>
): number
```

**Returns:** `number` - Relevance score (0.0 - 1.0)

### findLinkingContexts()

Find optimal contexts for link insertion.

```typescript
import { findLinkingContexts } from '@/lib/internal-linking/context';

const contexts = findLinkingContexts(
  sourceContent: string,
  targetPost: BlogPost,
  maxContexts?: number = 3
): string[]
```

**Returns:** `string[]` - Array of context excerpts

### extractImportantKeywords()

Extract important keywords from content.

```typescript
import { extractImportantKeywords } from '@/lib/internal-linking/keywords';

const keywords = extractImportantKeywords(
  content: string,
  locale?: string = 'en',
  maxKeywords?: number = 20
): string[]
```

**Returns:** `string[]` - Array of important keywords

### generateOptimalAnchor()

Generate optimal anchor text for a link.

```typescript
import { generateOptimalAnchor } from '@/lib/internal-linking/anchor';

const anchor = generateOptimalAnchor(
  sourceContent: string,
  targetPost: BlogPost,
  locale?: string = 'en'
): string
```

**Returns:** `string` - Optimal anchor text

---

## 🗂️ Cache APIs

### getCachedSuggestions()

Get cached link suggestions.

```typescript
import { getCachedSuggestions } from '@/lib/internal-linking/cache';

const suggestions = await getCachedSuggestions(
  slug: string,
  locale: string
): Promise<LinkSuggestion[] | null>
```

**Returns:** `Promise<LinkSuggestion[] | null>` - Cached suggestions or null

### cacheSuggestions()

Cache link suggestions.

```typescript
import { cacheSuggestions } from '@/lib/internal-linking/cache';

await cacheSuggestions(
  slug: string,
  locale: string,
  suggestions: LinkSuggestion[],
  ttl?: number = 3600000 // 1 hour
): Promise<void>
```

### clearCache()

Clear internal linking cache.

```typescript
import { clearCache } from '@/lib/internal-linking/cache';

await clearCache(pattern?: string): Promise<void>
```

**Parameters:**

- `pattern` (string, optional): Cache key pattern to clear (default: all)

---

## 📊 Analytics APIs

### trackLinkGeneration()

Track link generation events.

```typescript
import { trackLinkGeneration } from '@/lib/internal-linking/analytics';

trackLinkGeneration(data: {
  sourceSlug: string;
  suggestionCount: number;
  generationTime: number;
  locale: string;
  averageScore: number;
}): void
```

### trackLinkClick()

Track internal link click events.

```typescript
import { trackLinkClick } from '@/lib/internal-linking/analytics';

trackLinkClick(data: {
  sourceSlug: string;
  targetSlug: string;
  suggestionScore: number;
  timestamp: string;
  userAgent?: string;
}): void
```

### generateLinkingReport()

Generate comprehensive linking report.

```typescript
import { generateLinkingReport } from '@/lib/internal-linking/analytics';

const report = await generateLinkingReport(options?: {
  locale?: string;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}): Promise<LinkingReport>
```

**Returns:** `Promise<LinkingReport>` - Comprehensive analytics report

---

## 🔍 Search & Discovery APIs

### searchRelatedContent()

Search for related content.

```typescript
import { searchRelatedContent } from '@/lib/internal-linking/search';

const results = await searchRelatedContent(
  query: string,
  options?: {
    locale?: string;
    category?: string;
    tags?: string[];
    limit?: number;
    minRelevanceScore?: number;
  }
): Promise<BlogPost[]>
```

### findContentByCategory()

Find content by category.

```typescript
import { findContentByCategory } from '@/lib/internal-linking/discovery';

const posts = await findContentByCategory(
  category: string,
  locale?: string,
  excludeSlug?: string
): Promise<BlogPost[]>
```

### findContentByTags()

Find content by tags.

```typescript
import { findContentByTags } from '@/lib/internal-linking/discovery';

const posts = await findContentByTags(
  tags: string[],
  locale?: string,
  matchType?: 'any' | 'all' = 'any',
  excludeSlug?: string
): Promise<BlogPost[]>
```

---

## 🛠️ Configuration APIs

### loadConfig()

Load internal linking configuration.

```typescript
import { loadConfig } from '@/lib/internal-linking/config';

const config = await loadConfig(
  source?: 'file' | 'environment' | 'database' = 'file'
): Promise<InternalLinkingConfig>
```

### validateConfig()

Validate configuration object.

```typescript
import { validateConfig } from '@/lib/internal-linking/config';

const validation = validateConfig(
  config: Partial<InternalLinkingConfig>
): ConfigValidation
```

**Returns:** `ConfigValidation` - Validation result

```typescript
interface ConfigValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  normalized?: InternalLinkingConfig;
}
```

### updateConfig()

Update configuration at runtime.

```typescript
import { updateConfig } from '@/lib/internal-linking/config';

await updateConfig(
  updates: Partial<InternalLinkingConfig>
): Promise<InternalLinkingConfig>
```

---

## 🧪 Testing APIs

### generateTestSuggestions()

Generate link suggestions for testing.

```typescript
import { generateTestSuggestions } from '@/lib/internal-linking/test';

const suggestions = await generateTestSuggestions(
  slug: string,
  locale?: string = 'en',
  count?: number = 5
): Promise<LinkSuggestion[]>
```

### mockLinkGeneration()

Mock link generation for testing.

```typescript
import { mockLinkGeneration } from '@/lib/internal-linking/test';

const mockFn = mockLinkGeneration(
  suggestions: LinkSuggestion[],
  delay?: number = 0
): MockFunction
```

### validateLinks()

Validate generated links.

```typescript
import { validateLinks } from '@/lib/internal-linking/validation';

const validation = await validateLinks(
  links: LinkSuggestion[],
  allPosts: BlogPost[]
): Promise<LinkValidation>
```

**Returns:** `Promise<LinkValidation>` - Validation result

```typescript
interface LinkValidation {
  isValid: boolean;
  validLinks: LinkSuggestion[];
  invalidLinks: Array<{
    link: LinkSuggestion;
    errors: string[];
  }>;
  score: number; // 0.0 - 1.0
}
```

---

## 🔌 Plugin APIs

### registerScoringPlugin()

Register custom scoring plugin.

```typescript
import { registerScoringPlugin } from '@/lib/internal-linking/plugins';

registerScoringPlugin(name: string, plugin: ScoringPlugin): void
```

```typescript
interface ScoringPlugin {
  name: string;
  version: string;
  calculate: (source: BlogPost, target: BlogPost) => number;
  weight: number;
  condition?: (source: BlogPost, target: BlogPost) => boolean;
}
```

### registerFilterPlugin()

Register custom filter plugin.

```typescript
import { registerFilterPlugin } from '@/lib/internal-linking/plugins';

registerFilterPlugin(name: string, plugin: FilterPlugin): void
```

```typescript
interface FilterPlugin {
  name: string;
  version: string;
  filter: (
    suggestions: LinkSuggestion[],
    context: FilterContext
  ) => LinkSuggestion[];
  priority?: number;
}
```

### registerAnalyticsPlugin()

Register custom analytics plugin.

```typescript
import { registerAnalyticsPlugin } from '@/lib/internal-linking/plugins';

registerAnalyticsPlugin(name: string, plugin: AnalyticsPlugin): void
```

```typescript
interface AnalyticsPlugin {
  name: string;
  version: string;
  track: (event: string, data: any) => void;
  events: string[];
}
```

---

## 🚨 Error Handling

### LinkingError

Base error class for internal linking errors.

```typescript
class LinkingError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'LinkingError';
  }
}
```

### Common Error Codes

- `CONTENT_NOT_FOUND`: Source content not found
- `INVALID_CONFIG`: Invalid configuration
- `PROCESSING_ERROR`: Content processing failed
- `CACHE_ERROR`: Cache operation failed
- `TIMEOUT_ERROR`: Operation timed out
- `RATE_LIMITED`: Too many requests

### Error Handling Example

```typescript
import { getLinkSuggestions, LinkingError } from '@/lib/internal-linking';

try {
  const suggestions = await getLinkSuggestions('article-slug', 5, 'en');
  return suggestions;
} catch (error) {
  if (error instanceof LinkingError) {
    switch (error.code) {
      case 'CONTENT_NOT_FOUND':
        console.error('Article not found:', error.details);
        return [];
      case 'INVALID_CONFIG':
        console.error('Configuration error:', error.message);
        throw error;
      default:
        console.error('Unexpected error:', error);
        return [];
    }
  }
  throw error;
}
```

---

## 🔗 Response Formats

### Success Response

```typescript
interface APIResponse<T> {
  success: true;
  data: T;
  metadata?: {
    processingTime: number;
    cacheHit: boolean;
    version: string;
  };
}
```

### Error Response

```typescript
interface APIErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}
```

### Paginated Response

```typescript
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

---

## 🔄 Migration APIs

### migrateFromVersion()

Migrate configuration from older versions.

```typescript
import { migrateFromVersion } from '@/lib/internal-linking/migration';

const migratedConfig = await migrateFromVersion(
  oldConfig: any,
  fromVersion: string,
  toVersion?: string = 'latest'
): Promise<InternalLinkingConfig>
```

### validateMigration()

Validate migration results.

```typescript
import { validateMigration } from '@/lib/internal-linking/migration';

const validation = await validateMigration(
  oldConfig: any,
  newConfig: InternalLinkingConfig
): Promise<MigrationValidation>
```

```typescript
interface MigrationValidation {
  isValid: boolean;
  changes: Array<{
    path: string;
    oldValue: any;
    newValue: any;
    type: 'added' | 'removed' | 'modified';
  }>;
  warnings: string[];
  errors: string[];
}
```

---

## 🔗 Related Documentation

- [Usage Guide](./USAGE-GUIDE.md) - How to use these APIs
- [Examples](./EXAMPLES.md) - API usage examples
- [Configuration](./CONFIGURATION.md) - Configuration options
- [Integration Guide](./INTEGRATION.md) - System integration

---

**API version:** 1.0.0 **Last updated:** October 26, 2025 **Compatibility:**
CueTimer Blog Management System v1.0+

**Need API support?** Check our [Examples](./EXAMPLES.md) for practical
implementations or [contact support](mailto:dev-support@cuetimer.com) for
technical assistance.
