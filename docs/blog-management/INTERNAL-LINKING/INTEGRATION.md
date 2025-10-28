# Internal Linking Automation - Integration Guide

**Complete integration guide for the CueTimer internal linking system**

---

## 🎯 Overview

This guide covers how to integrate the Internal Linking Automation system with
existing CueTimer infrastructure, third-party services, and custom workflows.
The system is designed to work seamlessly with the existing blog management
platform while providing extensibility for custom integrations.

---

## 🔗 Integration with Existing Infrastructure

### Blog Management System Integration

The internal linking system is built to leverage existing CueTimer blog
infrastructure:

#### Content Processing Pipeline

```typescript
// Existing pipeline enhancement
import { processMdxContent } from '@/lib/utils';
import { processMdxContentWithLinks } from '@/lib/internal-linking';

// Original pipeline
async function originalPipeline(content: string) {
  return await processMdxContent(content);
}

// Enhanced pipeline with internal linking
async function enhancedPipeline(content: string, slug: string, locale: string) {
  return await processMdxContentWithLinks(content, slug, locale);
}
```

#### Blog API Integration

```typescript
// Extend existing blog API
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { getLinkSuggestions } from '@/lib/internal-linking';

// Enhanced blog post API
export async function getPostWithLinks(slug: string, locale: string = 'en') {
  const post = await getPostBySlug(slug, locale);
  if (!post) return null;

  // Add internal linking suggestions
  const linkSuggestions = await getLinkSuggestions(slug, 5, locale);

  return {
    ...post,
    internalLinks: linkSuggestions,
    hasInternalLinks: linkSuggestions.length > 0,
  };
}
```

#### CLI Integration

```typescript
// Extend existing CLI tools
import { blogCli } from './blog-cli';
import { internalLinksCli } from './internal-links-cli';

// Combined CLI program
const combinedCli = blogCli
  .addCommand(internalLinksCli)
  .hook('postCreate', async (options) => {
    // Auto-suggest internal links for new content
    if (options.enableInternalLinks) {
      await suggestLinksForNewPost(options.slug);
    }
  });
```

### Content Management System Integration

#### Headless CMS Integration

```typescript
// Integration with headless CMS (e.g., Strapi, Contentful)
class CMSIntegration {
  async syncContentWithLinks() {
    // Fetch content from CMS
    const cmsContent = await this.fetchFromCMS();

    // Process with internal linking
    for (const content of cmsContent) {
      const processed = await processMdxContentWithLinks(
        content.body,
        content.slug,
        content.locale
      );

      // Update CMS with processed content
      await this.updateCMS(content.id, { body: processed });
    }
  }

  async setupWebhooks() {
    // Setup webhooks for real-time processing
    this.cms.webhook('content.created', async (content) => {
      const processed = await processMdxContentWithLinks(
        content.body,
        content.slug,
        content.locale
      );

      return { processed };
    });
  }
}
```

#### Git-Based Workflow Integration

```typescript
// Integration with Git-based content workflow
class GitWorkflowIntegration {
  async preCommitHook(contentPath: string) {
    const content = await fs.readFile(contentPath, 'utf8');
    const slug = this.extractSlugFromPath(contentPath);
    const locale = this.extractLocaleFromPath(contentPath);

    // Process content with internal links
    const processed = await processMdxContentWithLinks(content, slug, locale);

    // Show diff and ask for confirmation
    if (content !== processed) {
      console.log('Internal links will be added:');
      console.log(this.showDiff(content, processed));

      const confirmed = await this.promptUser('Apply changes?');
      if (confirmed) {
        await fs.writeFile(contentPath, processed);
      }
    }
  }

  async generateLinkReport() {
    const allPosts = await getAllPosts();
    const report = {
      totalPosts: allPosts.length,
      postsWithInternalLinks: 0,
      totalInternalLinks: 0,
      linkCoverage: 0,
    };

    for (const post of allPosts) {
      const links = await getLinkSuggestions(post.slug, 10, post.locale);
      if (links.length > 0) {
        report.postsWithInternalLinks++;
        report.totalInternalLinks += links.length;
      }
    }

    report.linkCoverage =
      (report.postsWithInternalLinks / report.totalPosts) * 100;

    return report;
  }
}
```

---

## 🔌 Third-Party Service Integration

### Analytics Integration

#### Google Analytics Integration

```typescript
// Google Analytics 4 integration
import { gtag } from '@/lib/analytics';

class GoogleAnalyticsIntegration {
  trackLinkGeneration(data: {
    sourceSlug: string;
    suggestionCount: number;
    generationTime: number;
    locale: string;
  }) {
    gtag('event', 'internal_links_generated', {
      custom_parameters: {
        source_slug: data.sourceSlug,
        suggestion_count: data.suggestionCount,
        generation_time: data.generationTime,
        locale: data.locale,
      },
    });
  }

  trackLinkClick(data: {
    sourceSlug: string;
    targetSlug: string;
    suggestionScore: number;
  }) {
    gtag('event', 'internal_link_clicked', {
      custom_parameters: {
        source_slug: data.sourceSlug,
        target_slug: data.targetSlug,
        suggestion_score: data.suggestionScore,
        link_type: 'internal',
      },
    });
  }

  setupCustomDimensions() {
    // Configure custom dimensions in GA4
    gtag('config', 'GA_MEASUREMENT_ID', {
      custom_map: {
        custom_parameter_1: 'article_category',
        custom_parameter_2: 'link_score',
        custom_parameter_3: 'processing_time',
      },
    });
  }
}
```

#### Custom Analytics Integration

```typescript
// Custom analytics service integration
class CustomAnalyticsIntegration {
  constructor(private analyticsEndpoint: string) {}

  async trackEvent(event: string, data: any) {
    await fetch(`${this.analyticsEndpoint}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
        userAgent: navigator.userAgent,
      }),
    });
  }

  async trackLinkPerformance(slug: string) {
    const suggestions = await getLinkSuggestions(slug, 5, 'en');

    for (const suggestion of suggestions) {
      await this.trackEvent('link_suggestion_created', {
        sourceSlug: slug,
        targetSlug: suggestion.slug,
        score: suggestion.score,
        reason: suggestion.reason,
        locale: 'en',
      });
    }
  }

  async generateLinkingReport() {
    const response = await fetch(`${this.analyticsEndpoint}/reports/linking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          end: new Date(),
        },
      }),
    });

    return await response.json();
  }
}
```

### Search Engine Integration

#### Elasticsearch Integration

```typescript
// Elasticsearch integration for enhanced search
import { Client } from '@elastic/elasticsearch';

class ElasticsearchIntegration {
  private client: Client;

  constructor(private elasticsearchUrl: string) {
    this.client = new Client({ node: elasticsearchUrl });
  }

  async indexPostWithLinks(post: BlogPost) {
    const linkSuggestions = await getLinkSuggestions(post.slug, 5, post.locale);

    await this.client.index({
      index: 'blog-posts',
      id: post.slug,
      body: {
        ...post,
        internalLinks: linkSuggestions,
        linkingMetrics: {
          linkCount: linkSuggestions.length,
          averageScore:
            linkSuggestions.reduce((sum, link) => sum + link.score, 0) /
            linkSuggestions.length,
          categories: linkSuggestions.map((link) => link.reason),
        },
      },
    });
  }

  async searchRelatedContent(query: string, slug: string) {
    const result = await this.client.search({
      index: 'blog-posts',
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: { query, fields: ['title', 'content', 'summary'] },
              },
            ],
            must_not: [{ term: { slug } }],
            should: [
              { term: { 'internalLinks.reason': 'category' } },
              { term: { 'internalLinks.reason': 'tag' } },
              { term: { 'internalLinks.reason': 'semantic' } },
            ],
          },
        },
        boost: 2.0,
      },
    });

    return result.body.hits.hits.map((hit: any) => hit._source);
  }
}
```

#### Algolia Integration

```typescript
// Algolia integration for instant search
import algoliasearch from 'algoliasearch';

class AlgoliaIntegration {
  private client: any;
  private index: any;

  constructor(
    private appId: string,
    private apiKey: string,
    private indexName: string
  ) {
    this.client = algoliasearch(appId, apiKey);
    this.index = this.client.initIndex(indexName);
  }

  async indexPostWithInternalLinks(post: BlogPost) {
    const linkSuggestions = await getLinkSuggestions(post.slug, 5, post.locale);

    const algoliaObject = {
      objectID: post.slug,
      ...post,
      _internalLinks: linkSuggestions.map((link) => ({
        slug: link.slug,
        title: link.title,
        score: link.score,
        reason: link.reason,
      })),
      _linkingScore:
        linkSuggestions.length > 0
          ? linkSuggestions.reduce((sum, link) => sum + link.score, 0) /
            linkSuggestions.length
          : 0,
      _linkingCategories: [
        ...new Set(linkSuggestions.map((link) => link.reason)),
      ],
    };

    await this.index.saveObject(algoliaObject);
  }

  async searchWithLinkingContext(query: string, currentSlug: string) {
    return await this.index.search(query, {
      filters: `NOT objectID:${currentSlug}`,
      optionalFilters: [
        '_linkingCategories:category > 1',
        '_linkingCategories:tag > 0.5',
        '_linkingScore > 0.3',
      ],
      analytics: true,
      clickAnalytics: true,
    });
  }
}
```

### Content Delivery Network Integration

#### Vercel Edge Functions

```typescript
// Vercel Edge Function for real-time link processing
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  if (req.method === 'POST') {
    const { content, slug, locale } = await req.json();

    // Process content with internal links at edge
    const processedContent = await processMdxContentWithLinks(
      content,
      slug,
      locale
    );

    return NextResponse.json({
      processedContent,
      processingTime: Date.now(),
    });
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
```

#### Cloudflare Workers Integration

```typescript
// Cloudflare Worker for internal linking API
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request) {
  const url = new URL(request.url);

  if (url.pathname === '/api/internal-links' && request.method === 'POST') {
    const { slug, maxSuggestions, locale } = await request.json();

    // Use KV store for caching
    const cacheKey = `links:${slug}:${locale}:${maxSuggestions}`;
    const cached = await INTERNAL_LINKS_KV.get(cacheKey);

    if (cached) {
      return new Response(cached, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate suggestions (this would call your main API)
    const suggestions = await fetchSuggestions(slug, maxSuggestions, locale);

    // Cache for 1 hour
    await INTERNAL_LINKS_KV.put(cacheKey, JSON.stringify(suggestions), {
      expirationTtl: 3600,
    });

    return new Response(JSON.stringify(suggestions), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Not found', { status: 404 });
}
```

---

## 🔄 Custom Workflow Integration

### Editorial Workflow Integration

```typescript
// Editorial workflow integration
class EditorialWorkflowIntegration {
  async integrateWithEditorialProcess() {
    // Pre-publication hook
    this.editorialSystem.on('before-publish', async (article) => {
      const linkSuggestions = await getLinkSuggestions(
        article.slug,
        8,
        article.locale
      );

      // Add internal links as editorial suggestions
      article.editorialSuggestions = {
        ...article.editorialSuggestions,
        internalLinks: linkSuggestions.map((link) => ({
          type: 'internal-link',
          target: link.slug,
          suggestedAnchor: link.suggestedAnchor,
          reason: `${link.reason} match (${Math.round(link.score * 100)}% relevance)`,
          autoApply: link.score > 0.8, // Auto-apply high-confidence links
        })),
      };

      return article;
    });

    // Post-publication analytics
    this.editorialSystem.on('after-publish', async (article) => {
      // Track linking metrics
      await this.trackLinkingMetrics(article);

      // Schedule link quality review
      await this.scheduleLinkQualityReview(article);
    });
  }

  async generateEditorialReport() {
    const articles = await this.editorialSystem.getArticles();
    const report = {
      totalArticles: articles.length,
      articlesWithInternalLinks: 0,
      averageLinksPerArticle: 0,
      topPerformingLinks: [],
      linkingOpportunities: [],
    };

    for (const article of articles) {
      const links = await getLinkSuggestions(article.slug, 10, article.locale);
      if (links.length > 0) {
        report.articlesWithInternalLinks++;
        report.averageLinksPerArticle += links.length;
      }
    }

    report.averageLinksPerArticle /= articles.length;

    return report;
  }
}
```

### A/B Testing Integration

```typescript
// A/B testing integration for internal linking
class ABTestingIntegration {
  async setupLinkingABTest() {
    // Test different link densities
    const variants = [
      { name: 'control', maxLinks: 0 },
      { name: 'conservative', maxLinks: 3, minScore: 0.5 },
      { name: 'aggressive', maxLinks: 8, minScore: 0.2 },
    ];

    for (const variant of variants) {
      this.abTestProvider.createTest(`internal-links-${variant.name}`, {
        variants: [
          { name: 'enabled', weight: 50, config: variant },
          { name: 'disabled', weight: 50, config: { maxLinks: 0 } },
        ],
        targetMetric: 'pages_per_session',
        duration: '14d',
      });
    }
  }

  async getVariantForUser(userId: string, articleSlug: string) {
    const testKey = `internal-links-${articleSlug}`;
    const variant = await this.abTestProvider.getVariant(testKey, userId);

    return variant.config;
  }

  async trackTestResult(userId: string, articleSlug: string, action: string) {
    await this.abTestProvider.track(testKey, userId, {
      action,
      timestamp: new Date().toISOString(),
      articleSlug,
    });
  }
}
```

### Content Recommendation Integration

```typescript
// Content recommendation system integration
class RecommendationIntegration {
  async integrateWithRecommendationEngine() {
    // Enhance recommendations with internal linking data
    this.recommendationEngine.on(
      'generate-recommendations',
      async (user, context) => {
        const currentArticle = context.currentArticle;
        if (!currentArticle) return;

        // Get internal linking suggestions
        const linkSuggestions = await getLinkSuggestions(
          currentArticle.slug,
          10,
          user.locale
        );

        // Combine with existing recommendations
        const enhancedRecommendations = [
          ...context.existingRecommendations,
          ...linkSuggestions.map((link) => ({
            type: 'internal-link',
            article: await this.getArticleBySlug(link.slug),
            score: link.score * 1.2, // Boost internal links
            reason: `Related content: ${link.reason} match`,
            source: 'internal-linking',
          })),
        ];

        // Sort and return top recommendations
        return enhancedRecommendations
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
      }
    );
  }

  async personalizeLinkSuggestions(
    userProfile: UserProfile,
    articleSlug: string
  ) {
    const suggestions = await getLinkSuggestions(
      articleSlug,
      10,
      userProfile.locale
    );

    // Personalize based on user behavior
    const personalizedSuggestions = suggestions.map((suggestion) => ({
      ...suggestion,
      personalizedScore: this.calculatePersonalizedScore(
        suggestion,
        userProfile
      ),
      userContext: this.getUserContext(suggestion, userProfile),
    }));

    return personalizedSuggestions
      .sort((a, b) => b.personalizedScore - a.personalizedScore)
      .slice(0, 5);
  }

  private calculatePersonalizedScore(
    suggestion: LinkSuggestion,
    user: UserProfile
  ): number {
    let score = suggestion.score;

    // Boost based on user's category preferences
    if (user.preferences?.categories?.includes(suggestion.targetCategory)) {
      score *= 1.3;
    }

    // Boost based on user's reading history
    if (user.readingHistory?.includes(suggestion.slug)) {
      score *= 0.8; // Reduce if already read
    }

    // Boost based on user's skill level
    if (
      user.skillLevel === 'beginner' &&
      suggestion.targetTags?.includes('beginner')
    ) {
      score *= 1.2;
    }

    return Math.min(score, 1.0);
  }
}
```

---

## 🔧 Development Environment Integration

### IDE Integration

#### VS Code Extension

```typescript
// VS Code extension for internal linking
import * as vscode from 'vscode';

class InternalLinkingExtension {
  activate(context: vscode.ExtensionContext) {
    // Register command to suggest internal links
    const suggestLinksCommand = vscode.commands.registerCommand(
      'cuetimer.suggestInternalLinks',
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const slug = this.extractSlugFromPath(document.uri.fsPath);
        const locale = this.extractLocaleFromPath(document.uri.fsPath);

        const suggestions = await this.getLinkSuggestions(slug, 5, locale);

        // Show suggestions in quick pick
        const selected = await vscode.window.showQuickPick(
          suggestions.map((s) => ({
            label: s.title,
            description: `${Math.round(s.score * 100)}% - ${s.reason}`,
            detail: s.contextExcerpt,
            data: s,
          }))
        );

        if (selected) {
          this.insertLink(editor, selected.data);
        }
      }
    );

    // Register hover provider for link suggestions
    const hoverProvider = vscode.languages.registerHoverProvider(
      { scheme: 'file', language: 'markdown' },
      async (document, position) => {
        const word = document.getText(
          document.getWordRangeAtPosition(position)
        );
        const slug = this.extractSlugFromPath(document.uri.fsPath);

        const suggestions = await getLinkSuggestions(slug, 10, 'en');
        const match = suggestions.find((s) => s.suggestedAnchor.includes(word));

        if (match) {
          return new vscode.Hover([
            `**Internal Link Opportunity**\n\n`,
            `Target: ${match.title}\n`,
            `Score: ${Math.round(match.score * 100)}%\n`,
            `Reason: ${match.reason}\n\n`,
            `Suggested anchor: "${match.suggestedAnchor}"`,
          ]);
        }
      }
    );

    context.subscriptions.push(suggestLinksCommand, hoverProvider);
  }

  private insertLink(editor: vscode.TextEditor, suggestion: LinkSuggestion) {
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    const linkText = selectedText || suggestion.suggestedAnchor;
    const linkMarkdown = `[${linkText}](/blog/${suggestion.slug})`;

    editor.edit((editBuilder) => {
      if (selection.isEmpty) {
        editBuilder.insert(selection.start, linkMarkdown);
      } else {
        editBuilder.replace(selection, linkMarkdown);
      }
    });
  }
}
```

### Build Process Integration

#### Webpack Integration

```javascript
// Webpack plugin for internal linking
class InternalLinkingPlugin {
  constructor(options = {}) {
    this.options = {
      locales: ['en', 'es', 'pt-br'],
      maxLinks: 5,
      minScore: 0.3,
      ...options,
    };
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync(
      'InternalLinkingPlugin',
      async (params, callback) => {
        // Process MDX files before compilation
        const fs = require('fs');
        const path = require('path');

        const contentDir = path.join(compiler.context, 'content/blog');

        for (const file of this.walkDirectory(contentDir)) {
          if (file.endsWith('.mdx')) {
            const content = fs.readFileSync(file, 'utf8');
            const slug = this.extractSlugFromPath(file);
            const locale = this.extractLocaleFromPath(file);

            const processedContent = await this.processWithInternalLinks(
              content,
              slug,
              locale
            );

            fs.writeFileSync(file, processedContent);
          }
        }

        callback();
      }
    );
  }

  async processWithInternalLinks(content, slug, locale) {
    // This would call your internal linking processing
    return await processMdxContentWithLinks(
      content,
      slug,
      locale,
      this.options.maxLinks
    );
  }
}

module.exports = InternalLinkingPlugin;
```

#### Vite Integration

```typescript
// Vite plugin for internal linking
import { Plugin } from 'vite';

export function internalLinkingPlugin(
  options: {
    locales?: string[];
    maxLinks?: number;
    minScore?: number;
  } = {}
): Plugin {
  return {
    name: 'internal-linking',
    configureServer(server) {
      server.ws.on('internal-links:process', async (data, client) => {
        try {
          const processed = await processMdxContentWithLinks(
            data.content,
            data.slug,
            data.locale,
            options.maxLinks
          );

          client.send('internal-links:processed', {
            processed,
            original: data.content,
          });
        } catch (error) {
          client.send('internal-links:error', { error: error.message });
        }
      });
    },

    async load(id) {
      if (id.endsWith('.mdx')) {
        const content = await fs.readFile(id, 'utf-8');
        const slug = extractSlugFromPath(id);
        const locale = extractLocaleFromPath(id);

        // Process with internal links during development
        if (process.env.NODE_ENV === 'development') {
          return await processMdxContentWithLinks(
            content,
            slug,
            locale,
            options.maxLinks
          );
        }
      }
    },
  };
}
```

---

## 📊 Monitoring and Observability Integration

### Logging Integration

```typescript
// Structured logging integration
class LoggingIntegration {
  constructor(private logger: any) {}

  async trackLinkGeneration(
    slug: string,
    suggestions: LinkSuggestion[],
    metrics: any
  ) {
    this.logger.info('Internal links generated', {
      event: 'internal_links_generated',
      articleSlug: slug,
      suggestionCount: suggestions.length,
      processingTime: metrics.processingTime,
      averageScore:
        suggestions.reduce((sum, s) => sum + s.score, 0) / suggestions.length,
      cacheHit: metrics.cacheHit,
      categories: [...new Set(suggestions.map((s) => s.reason))],
      timestamp: new Date().toISOString(),
    });
  }

  async trackLinkingErrors(slug: string, error: Error, context: any) {
    this.logger.error('Internal linking error', {
      event: 'internal_links_error',
      articleSlug: slug,
      errorMessage: error.message,
      errorStack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  async trackPerformanceMetrics(metrics: {
    processingTime: number;
    memoryUsage: number;
    cacheHitRate: number;
    errorRate: number;
  }) {
    this.logger.info('Internal linking performance', {
      event: 'performance_metrics',
      ...metrics,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Metrics Collection Integration

```typescript
// Prometheus metrics integration
import { register, Counter, Histogram, Gauge } from 'prom-client';

class MetricsIntegration {
  private linkGenerationCounter = new Counter({
    name: 'internal_links_generated_total',
    help: 'Total number of internal link generations',
    labelNames: ['locale', 'category'],
  });

  private processingTimeHistogram = new Histogram({
    name: 'internal_links_processing_seconds',
    help: 'Time spent generating internal links',
    labelNames: ['locale', 'cache_hit'],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
  });

  private linkQualityGauge = new Gauge({
    name: 'internal_links_average_score',
    help: 'Average relevance score of generated links',
    labelNames: ['locale'],
  });

  recordLinkGeneration(
    locale: string,
    category: string,
    processingTime: number,
    cacheHit: boolean,
    averageScore: number
  ) {
    this.linkGenerationCounter.inc({ locale, category });
    this.processingTimeHistogram.observe(
      { locale, cache_hit: cacheHit.toString() },
      processingTime
    );
    this.linkQualityGauge.set({ locale }, averageScore);
  }

  getMetrics() {
    return register.metrics();
  }
}
```

---

## 🔗 Related Documentation

- [Usage Guide](./USAGE-GUIDE.md) - How to use the system
- [API Reference](./API-REFERENCE.md) - Complete API documentation
- [Configuration](./CONFIGURATION.md) - Configuration options
- [Examples](./EXAMPLES.md) - Practical integration examples

---

**Need integration help?** Check our [Examples](./EXAMPLES.md) for practical
implementations or [contact support](mailto:dev-support@cuetimer.com) for custom
integration assistance.
