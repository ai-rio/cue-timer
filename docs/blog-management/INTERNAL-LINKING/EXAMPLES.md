# Internal Linking Automation - Examples

**Practical examples and code samples for the CueTimer internal linking system**

---

## 🎯 Overview

This document provides comprehensive examples of using the Internal Linking
Automation system in various scenarios. From basic usage to advanced
integrations, these examples demonstrate real-world applications.

---

## 🚀 Basic Usage Examples

### 1. Component Integration

**Basic Blog Post with Internal Links**

```tsx
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { getPostBySlug } from '@/lib/blog';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  return (
    <article className='blog-post'>
      <header>
        <h1>{post.title}</h1>
        <p className='meta'>
          {post.author} • {new Date(post.publishedAt).toLocaleDateString()}
        </p>
      </header>

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

**Custom Configuration per Category**

```tsx
import { BlogPostContent } from '@/components/blog/BlogPostContent';

function CategorySpecificContent({ post }: { post: BlogPost }) {
  const getConfigForCategory = (category: string) => {
    switch (category) {
      case 'tutorial':
        return {
          maxInternalLinks: 8,
          minRelevanceScore: 0.2, // More links for tutorials
        };
      case 'news':
        return {
          maxInternalLinks: 2,
          minRelevanceScore: 0.6, // Fewer, higher-quality links for news
        };
      default:
        return {
          maxInternalLinks: 5,
          minRelevanceScore: 0.3,
        };
    }
  };

  const config = getConfigForCategory(post.category);

  return (
    <BlogPostContent
      content={post.content}
      enableInternalLinks={true}
      currentSlug={post.slug}
      locale={post.locale}
      {...config}
    />
  );
}
```

### 2. API Usage

**Getting Link Suggestions**

```typescript
import { getLinkSuggestions } from '@/lib/internal-linking';

async function demonstrateLinkSuggestions() {
  const currentSlug = 'advanced-timing-techniques';

  try {
    const suggestions = await getLinkSuggestions(currentSlug, 5, 'en');

    console.log(`Found ${suggestions.length} link suggestions:`);

    suggestions.forEach((suggestion, index) => {
      console.log(`\n${index + 1}. ${suggestion.title}`);
      console.log(`   Score: ${(suggestion.score * 100).toFixed(1)}%`);
      console.log(`   Reason: ${suggestion.reason}`);
      console.log(`   Suggested anchor: "${suggestion.suggestedAnchor}"`);
      console.log(`   URL: /blog/${suggestion.slug}`);
      console.log(`   Context: ${suggestion.contextExcerpt}`);
    });

    return suggestions;
  } catch (error) {
    console.error('Failed to get link suggestions:', error);
    return [];
  }
}

// Usage
const suggestions = await demonstrateLinkSuggestions();
```

**Processing Content with Links**

```typescript
import { processMdxContentWithLinks } from '@/lib/utils';

async function processContentWithLinks() {
  const content = `
# Advanced Timing Techniques

Learn about CueTimer features and event management capabilities.
Our timer settings provide comprehensive control over your presentations.

Event management is crucial for successful conferences and meetings.
  `;

  try {
    const processedContent = await processMdxContentWithLinks(
      content,
      'current-post-slug',
      'en',
      3 // Maximum 3 internal links
    );

    console.log('Original content:', content);
    console.log('Processed content:', processedContent);

    return processedContent;
  } catch (error) {
    console.error('Failed to process content:', error);
    return content; // Return original content on error
  }
}
```

### 3. Manual Link Processing

**Custom Link Injector Component**

```tsx
import { useState, useEffect } from 'react';
import { InternalLinkInjector } from '@/components/blog/InternalLinkInjector';

function CustomBlogPost({ post }: { post: BlogPost }) {
  const [processedContent, setProcessedContent] = useState(post.content);
  const [isProcessing, setIsProcessing] = useState(false);
  const [linkCount, setLinkCount] = useState(0);

  useEffect(() => {
    async function processContent() {
      setIsProcessing(true);
      try {
        // Process content with custom configuration
        const processed = await processMdxContentWithLinks(
          post.content,
          post.slug,
          post.locale,
          5
        );
        setProcessedContent(processed);

        // Count internal links in processed content
        const linkRegex = /\[([^\]]+)\]\(\/blog\/([^)]+)\)/g;
        const matches = processed.match(linkRegex);
        setLinkCount(matches ? matches.length : 0);
      } catch (error) {
        console.error('Content processing failed:', error);
        setProcessedContent(post.content);
      } finally {
        setIsProcessing(false);
      }
    }

    processContent();
  }, [post]);

  return (
    <div className='custom-blog-post'>
      {isProcessing && (
        <div className='processing-indicator'>Processing internal links...</div>
      )}

      <div className='content'>
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      </div>

      {linkCount > 0 && (
        <div className='link-info'>
          {linkCount} internal links added automatically
        </div>
      )}
    </div>
  );
}
```

---

## 🛠️ CLI Examples

### Analyze Specific Article

```bash
# Basic analysis
bun run scripts/blog-internal-links.ts analyze \
  --slug "introduction-to-cuetimer" \
  --limit 10

# With export
bun run scripts/blog-internal-links.ts analyze \
  --slug "advanced-timing-techniques" \
  --limit 15 \
  --export ./analysis-advanced-timing.json

# Multi-language analysis
bun run scripts/blog-internal-links.ts analyze \
  --slug "tecnicas-avanzadas-de-timing" \
  --locale pt-br \
  --limit 8
```

**Expected Output:**

```
🔗 Link Suggestions:

Article: introduction-to-cuetimer

  1. Event Management Guide
     Score: 85.2%
     Reason: category
     Anchor: "event management"
     Context: "Learn how to manage events efficiently..."

  2. Timer Settings Tutorial
     Score: 72.8%
     Reason: tag
     Anchor: "timer settings"
     Context: "Comprehensive guide to timer configuration..."

  3. Advanced Timing Techniques
     Score: 68.4%
     Reason: semantic
     Anchor: "timing techniques"
     Context: "Master professional timing strategies..."
```

### Site-Wide Analysis

```bash
# Analyze all English articles
bun run scripts/blog-internal-links.ts analyze \
  --locale en \
  --limit 5 \
  --export ./site-wide-analysis.json

# Analyze all languages
bun run scripts/blog-internal-links.ts analyze \
  --locale all \
  --limit 3 \
  --export ./multi-language-analysis.json

# Focus on specific category
bun run scripts/blog-internal-links.ts analyze \
  --locale en \
  --category tutorial \
  --limit 8
```

### Statistics and Reporting

```bash
# General statistics
bun run scripts/blog-internal-links.ts stats --locale en

# Detailed report
bun run scripts/blog-internal-links.ts stats \
  --locale all \
  --detailed \
  --export ./linking-stats.json

# Category-specific statistics
bun run scripts/blog-internal-links.ts stats \
  --category tutorial \
  --locale en
```

**Expected Output:**

```
📈 Internal Linking Statistics:

  Total Articles: 45
  Articles with Internal Links: 38
  Average Links per Article: 3.24
  Link Coverage: 84.44%

  By Category:
    Tutorial: 12 articles, 4.1 avg links
    Case Study: 8 articles, 2.8 avg links
    Feature Announcement: 15 articles, 3.2 avg links
    News: 10 articles, 1.9 avg links
```

---

## 🔧 Advanced Examples

### Custom Link Component

```tsx
import { SmartLink } from '@/components/blog/SmartLink';
import { LinkSuggestion } from '@/types/blog';

function EnhancedInternalLink({
  suggestion,
  onLinkClick,
}: {
  suggestion: LinkSuggestion;
  onLinkClick?: (slug: string) => void;
}) {
  return (
    <SmartLink
      href={`/blog/${suggestion.slug}`}
      title={suggestion.title}
      isInternal={true}
      className='enhanced-internal-link'
      showTooltip={true}
      trackClicks={true}
      onClick={() => onLinkClick?.(suggestion.slug)}
    >
      <span className='link-text'>{suggestion.suggestedAnchor}</span>
      <span className='link-score'>{Math.round(suggestion.score * 100)}%</span>
    </SmartLink>
  );
}

// Usage in a custom link suggestion display
function LinkSuggestionsPanel({
  suggestions,
  currentSlug,
}: {
  suggestions: LinkSuggestion[];
  currentSlug: string;
}) {
  const handleLinkClick = (targetSlug: string) => {
    // Track internal link clicks
    analytics.track('internal_link_clicked', {
      source: currentSlug,
      target: targetSlug,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className='link-suggestions-panel'>
      <h3>Related Articles</h3>
      <div className='suggestions-list'>
        {suggestions.map((suggestion) => (
          <div key={suggestion.slug} className='suggestion-item'>
            <EnhancedInternalLink
              suggestion={suggestion}
              onLinkClick={handleLinkClick}
            />
            <p className='suggestion-context'>{suggestion.contextExcerpt}</p>
            <span className='suggestion-reason'>{suggestion.reason} match</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Batch Processing

```typescript
import { getAllPosts, getLinkSuggestions } from '@/lib/internal-linking';
import { writeFileSync } from 'fs';

async function generateAllSuggestions() {
  console.log('Generating link suggestions for all posts...');

  try {
    const allPosts = await getAllPosts();
    const allSuggestions = new Map<string, LinkSuggestion[]>();
    let processedCount = 0;

    for (const post of allPosts) {
      console.log(`Processing: ${post.title} (${post.locale})`);

      const suggestions = await getLinkSuggestions(post.slug, 5, post.locale);

      if (suggestions.length > 0) {
        allSuggestions.set(post.slug, suggestions);
        console.log(`  → Found ${suggestions.length} suggestions`);
      }

      processedCount++;

      // Progress indicator
      if (processedCount % 10 === 0) {
        console.log(
          `Progress: ${processedCount}/${allPosts.length} posts processed`
        );
      }
    }

    // Export results
    const exportData = {
      generatedAt: new Date().toISOString(),
      totalPosts: allPosts.length,
      postsWithSuggestions: allSuggestions.size,
      totalSuggestions: Array.from(allSuggestions.values()).reduce(
        (sum, suggestions) => sum + suggestions.length,
        0
      ),
      suggestions: Object.fromEntries(allSuggestions),
    };

    writeFileSync(
      './all-link-suggestions.json',
      JSON.stringify(exportData, null, 2)
    );

    console.log(
      `\n✅ Complete! Generated suggestions for ${allSuggestions.size} posts`
    );
    console.log(`📊 Total suggestions: ${exportData.totalSuggestions}`);
    console.log(`💾 Exported to: all-link-suggestions.json`);

    return exportData;
  } catch (error) {
    console.error('Batch processing failed:', error);
    throw error;
  }
}

// Usage
const results = await generateAllSuggestions();
```

### Custom Filtering Logic

```typescript
import { getLinkSuggestions } from '@/lib/internal-linking';

class CustomLinkFilter {
  // Filter by minimum score
  static async getHighQualityLinks(slug: string, minScore: number = 0.7) {
    const suggestions = await getLinkSuggestions(slug, 10, 'en');
    return suggestions.filter((s) => s.score >= minScore);
  }

  // Filter by specific reasons
  static async getCategoryBasedLinks(slug: string) {
    const suggestions = await getLinkSuggestions(slug, 10, 'en');
    return suggestions.filter((s) => s.reason === 'category');
  }

  // Filter by publication date
  static async getRecentLinks(slug: string, daysOld: number = 30) {
    const suggestions = await getLinkSuggestions(slug, 10, 'en');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return suggestions.filter((s) => {
      const post = getPostBySlug(s.slug);
      return post && new Date(post.publishedAt) > cutoffDate;
    });
  }

  // Filter by author
  static async getSameAuthorLinks(slug: string) {
    const currentPost = getPostBySlug(slug);
    if (!currentPost) return [];

    const suggestions = await getLinkSuggestions(slug, 10, 'en');
    return suggestions.filter((s) => {
      const targetPost = getPostBySlug(s.slug);
      return targetPost && targetPost.author === currentPost.author;
    });
  }

  // Combine multiple filters
  static async getCustomFilteredLinks(slug: string) {
    const allSuggestions = await getLinkSuggestions(slug, 15, 'en');

    return allSuggestions
      .filter((s) => s.score >= 0.5) // Minimum quality
      .filter((s) => s.reason !== 'keyword') // Exclude keyword matches
      .filter((s) => !s.slug.includes('news')) // Exclude news posts
      .slice(0, 5); // Limit to top 5
  }
}

// Usage examples
const highQualityLinks = await CustomLinkFilter.getHighQualityLinks(
  'my-post',
  0.8
);
const categoryLinks = await CustomLinkFilter.getCategoryBasedLinks('my-post');
const recentLinks = await CustomLinkFilter.getRecentLinks('my-post', 60);
const customLinks = await CustomLinkFilter.getCustomFilteredLinks('my-post');
```

### Performance Monitoring

```typescript
import { getLinkSuggestions } from '@/lib/internal-linking';

class PerformanceMonitor {
  private static metrics = new Map<string, number[]>();

  static async timedLinkSuggestions(
    slug: string,
    maxSuggestions: number = 5,
    locale: string = 'en'
  ) {
    const startTime = performance.now();

    try {
      const suggestions = await getLinkSuggestions(
        slug,
        maxSuggestions,
        locale
      );
      const duration = performance.now() - startTime;

      // Record metrics
      this.recordMetric('link_suggestions_time', duration);
      this.recordMetric('link_suggestions_count', suggestions.length);

      console.log(
        `Generated ${suggestions.length} suggestions in ${duration.toFixed(2)}ms`
      );

      return suggestions;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordMetric('link_suggestions_errors', 1);

      console.error(`Failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  private static recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  static getMetricStats(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count: values.length,
      average: avg,
      min,
      max,
      sum,
    };
  }

  static printAllStats() {
    console.log('📊 Performance Statistics:');

    for (const [metricName] of this.metrics) {
      const stats = this.getMetricStats(metricName);
      if (stats) {
        console.log(`\n${metricName}:`);
        console.log(`  Count: ${stats.count}`);
        console.log(`  Average: ${stats.average.toFixed(2)}ms`);
        console.log(`  Min: ${stats.min.toFixed(2)}ms`);
        console.log(`  Max: ${stats.max.toFixed(2)}ms`);
      }
    }
  }
}

// Usage
const suggestions = await PerformanceMonitor.timedLinkSuggestions(
  'my-post',
  5,
  'en'
);
PerformanceMonitor.printAllStats();
```

---

## 🔄 Integration Examples

### With Existing Blog Pipeline

```tsx
// pages/blog/[slug].tsx
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import BlogPostContent from '@/components/blog/BlogPostContent';
import { LinkSuggestionsPanel } from '@/components/blog/LinkSuggestionsPanel';

export default function BlogPost({ post }: { post: BlogPost }) {
  return (
    <div className='blog-post-container'>
      <article className='main-content'>
        <h1>{post.title}</h1>
        <BlogPostContent
          content={post.content}
          enableInternalLinks={true}
          currentSlug={post.slug}
          locale={post.locale}
          maxInternalLinks={5}
        />
      </article>

      <aside className='related-content'>
        <LinkSuggestionsPanel
          currentSlug={post.slug}
          locale={post.locale}
          maxSuggestions={3}
        />
      </aside>
    </div>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();

  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  };
}
```

### With Analytics Integration

```typescript
import { getLinkSuggestions } from '@/lib/internal-linking';
import { analytics } from '@/lib/analytics';

class AnalyticsEnhancedLinking {
  static async getTrackedLinkSuggestions(
    slug: string,
    maxSuggestions: number = 5,
    locale: string = 'en'
  ) {
    const startTime = performance.now();

    try {
      const suggestions = await getLinkSuggestions(
        slug,
        maxSuggestions,
        locale
      );
      const duration = performance.now() - startTime;

      // Track suggestion generation
      analytics.track('internal_links_generated', {
        sourceSlug: slug,
        suggestionCount: suggestions.length,
        generationTime: duration,
        locale,
        averageScore:
          suggestions.reduce((sum, s) => sum + s.score, 0) / suggestions.length,
      });

      // Track quality distribution
      const qualityBuckets = {
        high: suggestions.filter((s) => s.score >= 0.7).length,
        medium: suggestions.filter((s) => s.score >= 0.4 && s.score < 0.7)
          .length,
        low: suggestions.filter((s) => s.score < 0.4).length,
      };

      analytics.track('link_quality_distribution', qualityBuckets);

      return suggestions.map((suggestion) => ({
        ...suggestion,
        // Add tracking wrapper to each suggestion
        onClick: () =>
          this.trackLinkClick(slug, suggestion.slug, suggestion.score),
      }));
    } catch (error) {
      analytics.track('internal_links_error', {
        sourceSlug: slug,
        error: error.message,
        duration: performance.now() - startTime,
      });
      throw error;
    }
  }

  static trackLinkClick(sourceSlug: string, targetSlug: string, score: number) {
    analytics.track('internal_link_clicked', {
      sourceSlug,
      targetSlug,
      suggestionScore: score,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
  }

  static async generateLinkingReport() {
    const allPosts = await getAllPosts();
    let totalSuggestions = 0;
    let highQualitySuggestions = 0;
    let processingTime = 0;

    for (const post of allPosts) {
      const startTime = performance.now();
      const suggestions = await getLinkSuggestions(post.slug, 5, post.locale);
      processingTime += performance.now() - startTime;

      totalSuggestions += suggestions.length;
      highQualitySuggestions += suggestions.filter(
        (s) => s.score >= 0.7
      ).length;
    }

    const report = {
      totalPosts: allPosts.length,
      totalSuggestions,
      highQualitySuggestions,
      averageSuggestionsPerPost: totalSuggestions / allPosts.length,
      averageProcessingTime: processingTime / allPosts.length,
      highQualityPercentage: (highQualitySuggestions / totalSuggestions) * 100,
    };

    analytics.track('internal_linking_report', report);

    return report;
  }
}

// Usage
const suggestions =
  await AnalyticsEnhancedLinking.getTrackedLinkSuggestions('my-post');
const report = await AnalyticsEnhancedLinking.generateLinkingReport();
```

---

## 🚨 Error Handling Examples

### Robust Error Handling

```tsx
import { ErrorBoundary } from 'react-error-boundary';
import { InternalLinkInjector } from '@/components/blog/InternalLinkInjector';

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className='internal-linking-error'>
      <h3>Internal Linking Temporarily Unavailable</h3>
      <p>We encountered an issue while processing internal links.</p>
      <details>
        <summary>Error details</summary>
        <pre>{error.message}</pre>
      </details>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

function SafeInternalLinking({
  content,
  post,
}: {
  content: string;
  post: BlogPost;
}) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Internal linking error:', error, errorInfo);
        // Send error to monitoring service
        errorReporting.captureException(error, {
          extra: errorInfo,
          tags: { component: 'InternalLinking' },
        });
      }}
    >
      <InternalLinkInjector
        content={content}
        currentSlug={post.slug}
        locale={post.locale}
        maxLinks={5}
        fallback={<div>{content}</div>} // Graceful fallback
      />
    </ErrorBoundary>
  );
}
```

### Retry Logic

```typescript
class ResilientLinkSuggestions {
  static async getLinkSuggestionsWithRetry(
    slug: string,
    maxSuggestions: number = 5,
    locale: string = 'en',
    maxRetries: number = 3
  ): Promise<LinkSuggestion[]> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const suggestions = await getLinkSuggestions(
          slug,
          maxSuggestions,
          locale
        );

        if (attempt > 1) {
          console.log(`✅ Success on attempt ${attempt}`);
        }

        return suggestions;
      } catch (error) {
        lastError = error as Error;
        console.warn(`❌ Attempt ${attempt} failed:`, error.message);

        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    console.error(`💥 All ${maxRetries} attempts failed`);
    throw lastError || new Error('Unknown error occurred');
  }

  static async getLinkSuggestionsWithFallback(
    slug: string,
    maxSuggestions: number = 5,
    locale: string = 'en'
  ): Promise<LinkSuggestion[]> {
    try {
      return await this.getLinkSuggestionsWithRetry(
        slug,
        maxSuggestions,
        locale
      );
    } catch (error) {
      console.warn('🔄 Falling back to basic suggestions due to error:', error);

      // Fallback to basic category-based suggestions
      return this.getBasicFallbackSuggestions(slug, maxSuggestions, locale);
    }
  }

  private static async getBasicFallbackSuggestions(
    slug: string,
    maxSuggestions: number,
    locale: string
  ): Promise<LinkSuggestion[]> {
    const currentPost = getPostBySlug(slug);
    if (!currentPost) return [];

    const allPosts = await getAllPosts();

    return allPosts
      .filter(
        (post) =>
          post.slug !== slug &&
          post.locale === locale &&
          post.category === currentPost.category
      )
      .slice(0, maxSuggestions)
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        score: 0.5, // Default fallback score
        reason: 'category' as const,
        suggestedAnchor: post.title,
        contextExcerpt: generateExcerpt(post.content, 100),
      }));
  }
}

// Usage
const suggestions =
  await ResilientLinkSuggestions.getLinkSuggestionsWithFallback(
    'my-post',
    5,
    'en'
  );
```

---

## 🔗 Related Documentation

- [Usage Guide](./USAGE-GUIDE.md) - Complete usage guide
- [Configuration](./CONFIGURATION.md) - Configuration options
- [API Reference](./API-REFERENCE.md) - Complete API documentation
- [Integration Guide](./INTEGRATION.md) - System integration

---

**Need more examples?** Check our [Usage Guide](./USAGE-GUIDE.md) for
comprehensive documentation or [contact support](mailto:support@cuetimer.com)
for specific use cases.
