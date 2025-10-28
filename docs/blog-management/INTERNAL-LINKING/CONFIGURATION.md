# Internal Linking Automation - Configuration

**Complete configuration guide for the CueTimer internal linking system**

---

## 🎯 Overview

The Internal Linking Automation system provides extensive configuration options
to customize link generation, filtering, and behavior according to your specific
needs. This guide covers all available configuration options and best practices.

---

## 🔧 Basic Configuration

### System Configuration File

Edit `config/internal-linking.config.ts` to customize the system:

```typescript
// config/internal-linking.config.ts
export const internalLinkingConfig = {
  // Core settings
  enabled: true,

  // Link density control
  maxLinksPerPost: 5, // Maximum internal links per article
  minRelevanceScore: 0.3, // Minimum relevance threshold (0.0-1.0)

  // Content filtering
  excludeCategories: ['news'], // Categories to exclude from linking
  targetCategories: ['tutorial', 'case-study'], // Categories to prioritize
  excludeTags: ['archived'], // Tags to exclude from linking
  targetTags: ['featured'], // Tags to prioritize

  // Link formatting
  linkFormat: 'inline', // 'inline', 'footnote', 'sidebar'
  showLinkScores: false, // Display relevance scores in development

  // Multi-language support
  locales: ['en', 'es', 'pt-br', 'fr'],
  enableCrossLanguageLinks: false, // Allow links between different languages

  // Performance settings
  cacheResults: true,
  cacheTimeout: 3600000, // 1 hour in milliseconds
  batchSize: 50, // Process in batches for large sites
  parallelProcessing: true,

  // Content processing
  maxContentLength: 15000, // Limit content analysis length
  truncateLongContent: true,
  minWordCount: 100, // Minimum word count for processing

  // Link scoring
  categoryWeight: 0.3, // Weight for category matches
  tagWeight: 0.2, // Weight for tag matches
  semanticWeight: 0.4, // Weight for semantic similarity
  keywordWeight: 0.1, // Weight for keyword matches
};
```

### Environment Variables

Configure via environment variables for deployment-specific settings:

```bash
# .env.local
INTERNAL_LINKING_ENABLED=true
INTERNAL_LINKING_MAX_LINKS=5
INTERNAL_LINKING_MIN_SCORE=0.3
INTERNAL_LINKING_CACHE_TIMEOUT=3600000
INTERNAL_LINKING_DEBUG=false
```

---

## 🎛️ Configuration Presets

### Conservative Configuration

For high-quality, minimal linking:

```typescript
export const conservativeConfig = {
  enabled: true,
  maxLinksPerPost: 3, // Fewer links per article
  minRelevanceScore: 0.5, // Only high-quality links
  excludeCategories: ['news', 'announcement'], // Exclude fleeting content
  targetCategories: ['tutorial', 'guide'], // Focus on evergreen content
  excludeTags: ['temporary', 'outdated'],
  linkFormat: 'inline',
  locales: ['en'],
  enableCrossLanguageLinks: false,
  cacheResults: true,
  categoryWeight: 0.4, // Prioritize category relevance
  tagWeight: 0.3,
  semanticWeight: 0.2,
  keywordWeight: 0.1,
};
```

### Aggressive Configuration

For maximum linking coverage:

```typescript
export const aggressiveConfig = {
  enabled: true,
  maxLinksPerPost: 8, // More links per article
  minRelevanceScore: 0.2, // Lower threshold for more suggestions
  excludeCategories: [], // Include all categories
  targetCategories: [], // No category preference
  excludeTags: [],
  targetTags: [],
  linkFormat: 'inline',
  locales: ['en', 'es', 'pt-br', 'fr'],
  enableCrossLanguageLinks: true, // Enable cross-language linking
  cacheResults: true,
  categoryWeight: 0.2,
  tagWeight: 0.2,
  semanticWeight: 0.4,
  keywordWeight: 0.2,
};
```

### Performance-Optimized Configuration

For large sites with many articles:

```typescript
export const performanceConfig = {
  enabled: true,
  maxLinksPerPost: 5,
  minRelevanceScore: 0.3,
  excludeCategories: ['news'], // Exclude frequently updated content
  targetCategories: [],
  linkFormat: 'inline',
  locales: ['en'], // Limit languages for performance
  enableCrossLanguageLinks: false,

  // Performance optimizations
  cacheResults: true,
  cacheTimeout: 7200000, // 2 hours
  batchSize: 100, // Larger batches
  parallelProcessing: true,
  maxContentLength: 8000, // Shorter content analysis
  truncateLongContent: true,
  minWordCount: 200, // Higher minimum for processing

  // Simplified scoring
  categoryWeight: 0.5,
  tagWeight: 0.3,
  semanticWeight: 0.2,
  keywordWeight: 0.0, // Skip keyword processing
};
```

### Multi-Language Configuration

For international sites:

```typescript
export const multiLanguageConfig = {
  enabled: true,
  maxLinksPerPost: 5,
  minRelevanceScore: 0.3,
  excludeCategories: [],
  targetCategories: [],
  linkFormat: 'inline',
  locales: ['en', 'es', 'pt-br', 'fr', 'de', 'it'],
  enableCrossLanguageLinks: true,
  crossLanguageWeight: 0.7, // Reduce cross-language relevance
  preferSameLanguage: true, // Prioritize same-language links

  // Language-specific settings
  languageSettings: {
    en: { maxLinksPerPost: 6, minRelevanceScore: 0.25 },
    es: { maxLinksPerPost: 5, minRelevanceScore: 0.3 },
    'pt-br': { maxLinksPerPost: 4, minRelevanceScore: 0.35 },
    fr: { maxLinksPerPost: 5, minRelevanceScore: 0.3 },
    de: { maxLinksPerPost: 4, minRelevanceScore: 0.4 },
    it: { maxLinksPerPost: 4, minRelevanceScore: 0.4 },
  },

  // Performance for multi-language
  cacheResults: true,
  cacheTimeout: 5400000, // 1.5 hours
  batchSize: 30, // Smaller batches for multi-language
};
```

---

## 📊 Link Scoring Configuration

### Scoring Weights

Customize how different factors contribute to link relevance:

```typescript
export const scoringConfig = {
  // Base weights (must sum to 1.0)
  categoryWeight: 0.3, // Same category matching
  tagWeight: 0.2, // Tag overlap
  semanticWeight: 0.4, // Content similarity
  keywordWeight: 0.1, // Keyword matching

  // Advanced scoring options
  boostRecentContent: true, // Boost recent articles
  recentContentBoost: 0.1, // 10% boost for articles < 30 days
  boostPopularContent: true, // Boost high-traffic articles
  popularContentBoost: 0.15, // 15% boost for top 20% articles

  // Penalty system
  penalizeOldContent: true, // Penalize old articles
  oldContentThreshold: 365, // 1 year in days
  oldContentPenalty: 0.2, // 20% penalty for old content
  penalizeShortContent: true, // Penalize very short articles
  shortContentThreshold: 300, // 300 words
  shortContentPenalty: 0.1, // 10% penalty for short content
};
```

### Category-Based Scoring

Different scoring for different content types:

```typescript
export const categoryBasedScoring = {
  tutorial: {
    maxLinksPerPost: 8,
    minRelevanceScore: 0.2,
    weights: {
      categoryWeight: 0.2,
      tagWeight: 0.3,
      semanticWeight: 0.4,
      keywordWeight: 0.1,
    },
    preferSameSeries: true, // Link to same tutorial series
    seriesBoost: 0.25, // 25% boost for same series
  },

  'case-study': {
    maxLinksPerPost: 4,
    minRelevanceScore: 0.4,
    weights: {
      categoryWeight: 0.4,
      tagWeight: 0.3,
      semanticWeight: 0.2,
      keywordWeight: 0.1,
    },
    preferSameIndustry: true, // Link to same industry case studies
    industryBoost: 0.3, // 30% boost for same industry
  },

  'feature-announce': {
    maxLinksPerPost: 3,
    minRelevanceScore: 0.5,
    weights: {
      categoryWeight: 0.5,
      tagWeight: 0.3,
      semanticWeight: 0.2,
      keywordWeight: 0.0,
    },
    preferRecentFeatures: true, // Link to recent features
    featureRecencyDays: 90, // 3 months
  },

  news: {
    maxLinksPerPost: 2,
    minRelevanceScore: 0.6,
    weights: {
      categoryWeight: 0.6,
      tagWeight: 0.2,
      semanticWeight: 0.2,
      keywordWeight: 0.0,
    },
    preferSameTimeframe: true, // Link to news from same period
    timeframeDays: 7, // 1 week
  },
};
```

---

## 🔍 Content Filtering Configuration

### Category Filtering

```typescript
export const categoryFiltering = {
  // Exclude categories entirely
  excludeCategories: ['archived', 'draft', 'internal', 'deprecated'],

  // Prioritize these categories
  targetCategories: ['tutorial', 'guide', 'best-practices', 'case-study'],

  // Category-specific rules
  categoryRules: {
    tutorial: {
      maxLinksFrom: 8, // Maximum links from tutorial posts
      maxLinksTo: 6, // Maximum links to tutorial posts
      allowSelfCategoryLinks: true, // Link within same category
    },
    news: {
      maxLinksFrom: 2,
      maxLinksTo: 3,
      allowSelfCategoryLinks: false, // Avoid news-to-news links
      freshnessDays: 30, // Only link to recent news
    },
    'case-study': {
      maxLinksFrom: 4,
      maxLinksTo: 5,
      allowSelfCategoryLinks: true,
      requireIndustryMatch: false,
    },
  },
};
```

### Tag Filtering

```typescript
export const tagFiltering = {
  // Exclude posts with these tags from linking
  excludeTags: ['archived', 'deprecated', 'internal-only', 'temporary'],

  // Prioritize posts with these tags
  targetTags: ['featured', 'recommended', 'popular', 'evergreen'],

  // Tag-specific weights
  tagWeights: {
    featured: 0.2, // 20% boost for featured content
    recommended: 0.15,
    popular: 0.1,
    evergreen: 0.1,
    beginner: 0.05,
    advanced: 0.05,
  },

  // Require minimum tag overlap
  minTagOverlap: 1, // Minimum shared tags required
  tagOverlapBonus: 0.1, // Bonus per shared tag
  maxTagBonus: 0.3, // Maximum tag bonus
};
```

### Content Length Filtering

```typescript
export const contentLengthFiltering = {
  // Minimum requirements
  minWordCount: 100, // Minimum words to process
  minCharacterCount: 500, // Minimum characters

  // Maximum limits (for performance)
  maxWordCount: 5000, // Maximum words to analyze
  maxCharacterCount: 25000, // Maximum characters

  // Length-based scoring adjustments
  lengthAdjustments: {
    veryShort: { max: 200, penalty: 0.2 }, // < 200 words
    short: { max: 500, penalty: 0.1 }, // 200-500 words
    normal: { min: 500, max: 2000, bonus: 0.0 }, // 500-2000 words
    long: { min: 2000, max: 4000, bonus: 0.05 }, // 2000-4000 words
    veryLong: { min: 4000, bonus: 0.1 }, // > 4000 words
  },

  // Truncation settings
  truncateLongContent: true,
  truncationStrategy: 'middle', // 'start', 'middle', 'end'
  preserveHeadings: true, // Keep heading structure
};
```

---

## 🚀 Performance Configuration

### Caching Settings

```typescript
export const cachingConfig = {
  // Enable caching
  enabled: true,

  // Cache durations (in milliseconds)
  cacheTimeouts: {
    linkSuggestions: 3600000, // 1 hour
    contentAnalysis: 7200000, // 2 hours
    similarityCalculations: 5400000, // 1.5 hours
    keywordExtraction: 1800000, // 30 minutes
  },

  // Cache storage
  cacheStorage: 'memory', // 'memory', 'redis', 'file'
  redisConfig: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: 0,
  },

  // Cache optimization
  maxCacheSize: 1000, // Maximum cached items
  cacheCleanupInterval: 300000, // Clean up every 5 minutes
  compressionEnabled: true, // Compress cached data
};
```

### Processing Configuration

```typescript
export const processingConfig = {
  // Batch processing
  batchSize: 50, // Items per batch
  maxConcurrentBatches: 3, // Parallel batch processing
  batchTimeout: 30000, // 30 seconds per batch

  // Parallel processing
  parallelProcessing: true,
  maxWorkers: 4, // Maximum parallel workers
  workerTimeout: 15000, // 15 seconds per worker

  // Memory management
  maxMemoryUsage: 512, // MB
  gcInterval: 60000, // Garbage collect every minute
  memoryThreshold: 0.8, // Alert at 80% memory usage

  // Content processing
  chunkSize: 1000, // Process content in chunks
  maxProcessingTime: 10000, // 10 seconds per article
  fallbackOnTimeout: true, // Use fallback on timeout
};
```

### Database Optimization

```typescript
export const databaseConfig = {
  // Database queries
  queryTimeout: 5000, // 5 seconds
  connectionPoolSize: 10, // Database connections
  queryCacheEnabled: true, // Cache database queries

  // Indexing recommendations
  recommendedIndexes: [
    'posts_category_locale',
    'posts_tags_locale',
    'posts_publishedAt',
    'posts_slug_locale',
    'posts_category_publishedAt',
  ],

  // Query optimization
  usePreparedStatements: true,
  batchQuerySize: 100, // Items per query
  lazyLoading: true, // Load content on demand
};
```

---

## 🌍 Multi-Language Configuration

### Language Settings

```typescript
export const languageConfig = {
  // Supported languages
  supportedLanguages: [
    { code: 'en', name: 'English', weight: 1.0 },
    { code: 'es', name: 'Spanish', weight: 0.9 },
    { code: 'pt-br', name: 'Portuguese Brazil', weight: 0.9 },
    { code: 'fr', name: 'French', weight: 0.8 },
    { code: 'de', name: 'German', weight: 0.8 },
    { code: 'it', name: 'Italian', weight: 0.8 },
  ],

  // Cross-language linking
  enableCrossLanguageLinks: false,
  crossLanguageWeight: 0.7, // Reduce relevance for cross-language
  preferSameLanguage: true, // Prioritize same-language links
  fallbackLanguages: ['en'], // Fallback if no same-language links

  // Language-specific processing
  languageProcessing: {
    en: {
      stemmer: 'porter',
      stopWords: 'english',
      minWordLength: 3,
    },
    es: {
      stemmer: 'spanish',
      stopWords: 'spanish',
      minWordLength: 3,
    },
    'pt-br': {
      stemmer: 'portuguese',
      stopWords: 'portuguese',
      minWordLength: 3,
    },
    fr: {
      stemmer: 'french',
      stopWords: 'french',
      minWordLength: 3,
    },
  },
};
```

### Content Adaptation

```typescript
export const contentAdaptationConfig = {
  // Cultural adaptation
  adaptForCulturalContext: true,
  culturalRules: {
    'pt-br': {
      formalityLevel: 'formal',
      dateFormats: ['DD/MM/YYYY'],
      avoidPhrases: ['color', 'organization'], // American vs British
    },
    es: {
      formalityLevel: 'formal',
      dateFormats: ['DD/MM/YYYY'],
      genderSpecific: true,
    },
    fr: {
      formalityLevel: 'formal',
      dateFormats: ['DD/MM/YYYY'],
      accentedCharacters: true,
    },
  },

  // Regional preferences
  regionalPreferences: {
    'pt-br': {
      preferredLinkText: ['guia', 'tutorial', 'aprenda'],
      avoidLinkText: ['color', 'organization'],
    },
    es: {
      preferredLinkText: ['guía', 'tutorial', 'aprende'],
      avoidLinkText: ['color', 'organization'],
    },
    fr: {
      preferredLinkText: ['guide', 'tutoriel', 'apprendre'],
      avoidLinkText: ['couleur', 'organisation'],
    },
  },
};
```

---

## 🔧 Development Configuration

### Debug Settings

```typescript
export const debugConfig = {
  // Enable debug mode
  debug: process.env.NODE_ENV === 'development',

  // Logging levels
  logLevel: 'info', // 'error', 'warn', 'info', 'debug'
  logToFile: true,
  logFileName: 'internal-linking.log',

  // Debug output
  showLinkScores: true, // Display relevance scores
  showProcessingTime: true, // Show processing duration
  showCacheHits: true, // Show cache statistics
  showDetailedReasons: true, // Show why links were suggested

  // Development helpers
  enableTestEndpoints: true, // Enable testing endpoints
  mockDataForTesting: false, // Use mock data in development
  validateConfig: true, // Validate configuration on startup
};
```

### Testing Configuration

```typescript
export const testingConfig = {
  // Test data
  useTestData: true,
  testDataPath: './test-data/blog-posts.json',

  // Mock services
  mockDatabase: true,
  mockCache: true,
  mockAnalytics: true,

  // Test scenarios
  testScenarios: [
    'single-article-analysis',
    'batch-processing',
    'multi-language-support',
    'error-handling',
    'performance-tests',
  ],

  // Benchmarking
  enableBenchmarking: true,
  benchmarkResultsPath: './benchmarks/',
  compareWithBaseline: true,
};
```

---

## 📈 Monitoring Configuration

### Analytics Integration

```typescript
export const analyticsConfig = {
  // Analytics providers
  providers: ['google-analytics', 'custom'],

  // Events to track
  trackEvents: [
    'link_suggestions_generated',
    'internal_links_clicked',
    'processing_errors',
    'performance_metrics',
  ],

  // Custom dimensions
  customDimensions: {
    articleCategory: 'dimension1',
    linkScore: 'dimension2',
    processingTime: 'dimension3',
    language: 'dimension4',
  },

  // Sampling
  sampleRate: 0.1, // 10% sampling for performance
  trackInternalLinks: true,
  trackUserEngagement: true,
};
```

### Performance Monitoring

```typescript
export const performanceMonitoring = {
  // Metrics to collect
  collectMetrics: [
    'processing_time',
    'cache_hit_rate',
    'memory_usage',
    'error_rate',
    'link_accuracy',
  ],

  // Alerting
  alertThresholds: {
    processingTime: 5000, // 5 seconds
    errorRate: 0.05, // 5%
    memoryUsage: 0.8, // 80%
    cacheHitRate: 0.5, // Below 50% is concerning
  },

  // Reporting
  reportInterval: 300000, // 5 minutes
  reportFormat: 'json', // 'json', 'csv', 'prometheus'
  exportPath: './reports/performance/',
};
```

---

## 🔧 Runtime Configuration

### Dynamic Configuration

```typescript
// Runtime configuration updates
export const dynamicConfig = {
  // Allow runtime updates
  allowRuntimeUpdates: true,

  // Configuration sources
  sources: [
    'file', // config file
    'environment', // environment variables
    'database', // database settings
    'api', // remote configuration API
  ],

  // Update settings
  updateInterval: 60000, // Check for updates every minute
  validationEnabled: true, // Validate new configurations
  rollbackOnError: true, // Rollback on invalid config

  // API endpoint
  configApiEndpoint: '/api/internal-linking/config',
  authenticationRequired: true,
};
```

### Feature Flags

```typescript
export const featureFlags = {
  // Experimental features
  enableMLSuggestions: false, // Machine learning suggestions
  enableAIBasedRanking: false, // AI-powered link ranking
  enablePredictiveAnalytics: false, // Predict user behavior

  // Beta features
  enableAdvancedFiltering: false,
  enableCustomScoring: false,
  enableRealTimeUpdates: false,

  // Rollout control
  rolloutPercentage: 0.1, // 10% of users
  whitelistUsers: [], // Specific users
  blacklistCategories: [], // Exclude categories
};
```

---

## 🚨 Error Handling Configuration

### Error Thresholds

```typescript
export const errorHandling = {
  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  exponentialBackoff: true,

  // Error thresholds
  errorThresholds: {
    processingErrors: 0.05, // 5% error rate
    timeoutErrors: 0.02, // 2% timeout rate
    memoryErrors: 0.01, // 1% memory error rate
  },

  // Fallback behavior
  enableFallbacks: true,
  fallbackStrategies: [
    'cache',
    'simplified-scoring',
    'category-only',
    'no-links',
  ],

  // Error reporting
  reportErrors: true,
  errorReportingService: 'sentry',
  includeStackTrace: true,
  includeContext: true,
};
```

---

## 🔗 Configuration Examples

### Complete Production Configuration

```typescript
export const productionConfig = {
  // Core settings
  enabled: true,
  maxLinksPerPost: 5,
  minRelevanceScore: 0.3,

  // Performance optimized
  cacheResults: true,
  cacheTimeout: 3600000,
  batchSize: 50,
  parallelProcessing: true,

  // Content filtering
  excludeCategories: ['news', 'archived'],
  targetCategories: ['tutorial', 'guide'],

  // Multi-language
  locales: ['en', 'es', 'pt-br'],
  enableCrossLanguageLinks: false,

  // Production ready
  debug: false,
  logLevel: 'warn',
  enableMonitoring: true,
  errorReporting: true,

  // Security
  validateInputs: true,
  sanitizeContent: true,
  rateLimiting: true,
};
```

### Complete Development Configuration

```typescript
export const developmentConfig = {
  // Core settings
  enabled: true,
  maxLinksPerPost: 8,
  minRelevanceScore: 0.1, // Lower threshold for testing

  // Development helpers
  debug: true,
  logLevel: 'debug',
  showLinkScores: true,
  showProcessingTime: true,

  // Testing data
  useTestData: true,
  mockServices: true,
  enableTestEndpoints: true,

  // Relaxed performance
  cacheResults: false, // Disable cache for testing
  batchSize: 10, // Smaller batches
  parallelProcessing: false, // Sequential processing for easier debugging

  // Feature flags
  enableExperimentalFeatures: true,
  rolloutPercentage: 1.0, // 100% for developers
};
```

---

## 🔄 Configuration Validation

### Validation Schema

```typescript
export const configValidation = {
  // Required fields
  required: ['enabled', 'maxLinksPerPost', 'minRelevanceScore', 'locales'],

  // Value constraints
  constraints: {
    maxLinksPerPost: { min: 1, max: 20 },
    minRelevanceScore: { min: 0.0, max: 1.0 },
    cacheTimeout: { min: 60000, max: 86400000 }, // 1 min to 24 hours
    batchSize: { min: 1, max: 1000 },
  },

  // Type validation
  types: {
    enabled: 'boolean',
    maxLinksPerPost: 'number',
    minRelevanceScore: 'number',
    locales: 'array',
    excludeCategories: 'array',
    targetCategories: 'array',
  },

  // Custom validators
  customValidators: [
    'validateWeights', // Ensure weights sum to 1.0
    'validateLocales', // Check locale codes
    'validatePaths', // Check file paths
    'validateConnection', // Test database connection
  ],
};
```

### Health Checks

```typescript
export const healthChecks = {
  // Configuration health
  checkConfigValidity: true,
  checkConnections: true,
  checkPermissions: true,

  // Performance health
  checkCacheHealth: true,
  checkMemoryUsage: true,
  checkProcessingSpeed: true,

  // Content health
  checkContentIndex: true,
  checkLinkQuality: true,
  checkCoverage: true,

  // Reporting
  healthCheckInterval: 300000, // 5 minutes
  alertOnFailure: true,
  includeMetrics: true,
};
```

---

## 🔗 Related Documentation

- [Usage Guide](./USAGE-GUIDE.md) - How to use the configured system
- [Examples](./EXAMPLES.md) - Configuration examples in practice
- [API Reference](./API-REFERENCE.md) - Configuration API documentation
- [Troubleshooting](./TROUBLESHOOTING.md) - Configuration issues and solutions

---

**Need help with configuration?** Check our [Examples](./EXAMPLES.md) for
practical implementations or [contact support](mailto:support@cuetimer.com) for
specific configuration needs.
