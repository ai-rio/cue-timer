# API Reference Guide

**Complete API documentation for the CueTimer Blog Management System**

---

## 🎯 Overview

The CueTimer Blog Management System provides a comprehensive API for content
creation, management, and optimization. This reference covers all available
APIs, including the ContentCreator utility, template interfaces, CLI tool APIs,
and integration endpoints.

## 🏗️ Core API Architecture

### Base Configuration

```typescript
// API Configuration
interface CueTimerAPIConfig {
  baseURL?: string;
  apiKey?: string;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  language?: string;
}

// Default configuration
const defaultConfig: CueTimerAPIConfig = {
  baseURL: 'http://localhost:3000/api',
  timeout: 30000,
  retries: 3,
  cache: true,
  language: 'en',
};
```

### API Client

```typescript
export class CueTimerAPIClient {
  private config: CueTimerAPIConfig;
  private cache: Map<string, any> = new Map();

  constructor(config: CueTimerAPIConfig = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.config.apiKey
        ? `Bearer ${this.config.apiKey}`
        : undefined,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(this.config.timeout!),
      });

      if (!response.ok) {
        throw new APIError(response.status, response.statusText);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(500, error.message);
    }
  }
}

export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}
```

---

## 📝 Content Creator API

### ContentCreator Class

The main API for content creation and management.

#### Constructor

```typescript
import { ContentCreator } from '@/lib/blog-scripts/content-creator';

const creator = new ContentCreator(options?: ContentCreatorOptions);

interface ContentCreatorOptions {
  contentDir?: string;           // Default: 'content/blog'
  templatesDir?: string;         // Default: 'lib/blog-scripts/templates'
  cache?: boolean;               // Default: true
  language?: string;             // Default: 'en'
  validation?: ValidationOptions;
}
```

#### Methods

##### createPost()

Creates a new blog post from template and variables.

```typescript
async createPost(
  template: CueTimerTemplate,
  variables: Record<string, any>,
  language: string = 'en'
): Promise<BlogPost>

// Example usage
const post = await creator.createPost(
  TIMING_GUIDE_TEMPLATE,
  {
    title: "Advanced Timing Techniques",
    targetAudience: "Professional speakers",
    difficultyLevel: "advanced",
    estimatedTime: 45,
    introduction: "Master advanced timing techniques...",
    steps: [
      {
        title: "Preparation Phase",
        description: "Set up your timing environment",
        timeAllocation: 15,
        tips: ["Test equipment beforehand"]
      }
    ]
  },
  'en'
);
```

**Parameters:**

| Parameter   | Type                | Required | Description                      |
| ----------- | ------------------- | -------- | -------------------------------- |
| `template`  | CueTimerTemplate    | ✅       | Template object to use           |
| `variables` | Record<string, any> | ✅       | Template variables               |
| `language`  | string              | ❌       | Content language (default: 'en') |

**Returns:** `Promise<BlogPost>` - Created blog post object

**Throws:** `ValidationError`, `FileSystemError`, `TemplateError`

##### validatePost()

Validates blog post data against schema.

```typescript
validatePost(post: BlogPost): ValidationResult

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// Example usage
const validation = creator.validatePost(post);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

##### updatePost()

Updates an existing blog post.

```typescript
async updatePost(
  slug: string,
  updates: Partial<BlogPost>,
  language?: string
): Promise<BlogPost>

// Example usage
const updatedPost = await creator.updatePost(
  'timing-guide-advanced',
  {
    title: "Updated: Advanced Timing Techniques",
    lastModified: new Date().toISOString()
  },
  'en'
);
```

##### deletePost()

Deletes a blog post and its files.

```typescript
async deletePost(slug: string, language?: string): Promise<boolean>

// Example usage
const deleted = await creator.deletePost('old-post', 'en');
```

##### getPost()

Retrieves a blog post by slug.

```typescript
async getPost(slug: string, language?: string): Promise<BlogPost | null>

// Example usage
const post = await creator.getPost('timing-guide-advanced', 'en');
```

##### listPosts()

Lists blog posts with filtering options.

```typescript
async listPosts(options?: ListPostsOptions): Promise<BlogPost[]>

interface ListPostsOptions {
  category?: BlogCategory;
  language?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'publishedAt' | 'title' | 'readTime';
  sortOrder?: 'asc' | 'desc';
  includeDrafts?: boolean;
}

// Example usage
const posts = await creator.listPosts({
  category: 'timing-guide',
  language: 'en',
  limit: 10,
  sortBy: 'publishedAt',
  sortOrder: 'desc'
});
```

### REST API Endpoints

#### POST /api/posts

Create a new blog post.

```typescript
// Request
POST /api/posts
Content-Type: application/json

{
  "template": "timing-guide",
  "variables": {
    "title": "Advanced Timing Techniques",
    "targetAudience": "Professional speakers",
    "difficultyLevel": "advanced",
    "estimatedTime": 45
  },
  "language": "en"
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "slug": "advanced-timing-techniques",
    "title": "Advanced Timing Techniques",
    "category": "timing-guide",
    "language": "en",
    "publishedAt": "2025-01-25T10:00:00Z",
    "readTime": 8,
    "isDraft": true
  }
}
```

#### GET /api/posts

List blog posts.

```typescript
// Request
GET /api/posts?category=timing-guide&language=en&limit=10&offset=0

// Response (200 OK)
{
  "success": true,
  "data": {
    "posts": [
      {
        "slug": "advanced-timing-techniques",
        "title": "Advanced Timing Techniques",
        "category": "timing-guide",
        "summary": "Master advanced timing techniques...",
        "publishedAt": "2025-01-25T10:00:00Z",
        "readTime": 8,
        "language": "en"
      }
    ],
    "total": 25,
    "limit": 10,
    "offset": 0
  }
}
```

#### GET /api/posts/:slug

Get a specific blog post.

```typescript
// Request
GET /api/posts/advanced-timing-techniques?language=en

// Response (200 OK)
{
  "success": true,
  "data": {
    "slug": "advanced-timing-techniques",
    "title": "Advanced Timing Techniques",
    "content": "# Advanced Timing Techniques\n\n...",
    "metadata": {
      "category": "timing-guide",
      "author": "CueTimer Team",
      "publishedAt": "2025-01-25T10:00:00Z",
      "readTime": 8,
      "language": "en",
      "tags": ["timing", "advanced", "techniques"]
    }
  }
}
```

#### PUT /api/posts/:slug

Update a blog post.

```typescript
// Request
PUT /api/posts/advanced-timing-techniques?language=en
Content-Type: application/json

{
  "title": "Updated: Advanced Timing Techniques",
  "summary": "Updated summary with new insights...",
  "tags": ["timing", "advanced", "techniques", "updated"]
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "slug": "advanced-timing-techniques",
    "title": "Updated: Advanced Timing Techniques",
    "lastModified": "2025-01-25T11:00:00Z"
  }
}
```

#### DELETE /api/posts/:slug

Delete a blog post.

```typescript
// Request
DELETE /api/posts/old-post?language=en

// Response (200 OK)
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## 🎨 Template API

### Template Interface

```typescript
interface CueTimerTemplate {
  id: string; // Unique template identifier
  name: string; // Human-readable template name
  category: BlogCategory; // Content category
  languages: string[]; // Supported languages
  variables: TemplateVariable[]; // Template variables
  contentStructure: ContentSection[]; // Content structure
}
```

### Template Variables

```typescript
interface TemplateVariable {
  name: string; // Variable name
  type: 'string' | 'number' | 'boolean' | 'array'; // Data type
  required: boolean; // Whether variable is required
  description: string; // Variable description
  defaultValue?: any; // Default value
  validation?: VariableValidation; // Validation rules
}

interface VariableValidation {
  min?: number; // Minimum value (for numbers)
  max?: number; // Maximum value (for numbers)
  minLength?: number; // Minimum length (for strings)
  maxLength?: number; // Maximum length (for strings)
  pattern?: string; // Regex pattern (for strings)
  options?: any[]; // Allowed values (for enums)
}
```

### Content Structure

```typescript
interface ContentSection {
  id: string; // Section identifier
  title: string; // Section title
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'image'; // Section type
  required: boolean; // Whether section is required
  order: number; // Section order
  template?: string; // Section template
}
```

### Template API Methods

#### getTemplates()

Get all available templates.

```typescript
async getTemplates(): Promise<CueTimerTemplate[]>

// Example usage
const templates = await api.getTemplates();
console.log('Available templates:', templates.map(t => t.name));
```

#### getTemplate()

Get a specific template by ID.

```typescript
async getTemplate(templateId: string): Promise<CueTimerTemplate | null>

// Example usage
const template = await api.getTemplate('timing-guide');
if (template) {
  console.log('Template variables:', template.variables);
}
```

#### validateTemplateVariables()

Validate variables against template definition.

```typescript
validateTemplateVariables(
  template: CueTimerTemplate,
  variables: Record<string, any>
): ValidationResult

// Example usage
const template = await api.getTemplate('timing-guide');
const variables = { title: "Test", difficultyLevel: "invalid" };
const validation = api.validateTemplateVariables(template!, variables);

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

### Template REST API

#### GET /api/templates

List all available templates.

```typescript
// Response (200 OK)
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "timing-guide",
        "name": "Timing Guide",
        "category": "timing-guide",
        "languages": ["en", "pt-br", "es"],
        "variables": [
          {
            "name": "title",
            "type": "string",
            "required": true,
            "description": "Guide title"
          }
        ]
      }
    ]
  }
}
```

#### GET /api/templates/:templateId

Get a specific template.

```typescript
// Request
GET /api/templates/timing-guide

// Response (200 OK)
{
  "success": true,
  "data": {
    "id": "timing-guide",
    "name": "Timing Guide",
    "category": "timing-guide",
    "languages": ["en", "pt-br", "es"],
    "variables": [...],
    "contentStructure": [...]
  }
}
```

#### POST /api/templates/:templateId/validate

Validate variables against a template.

```typescript
// Request
POST /api/templates/timing-guide/validate
Content-Type: application/json

{
  "variables": {
    "title": "Test Guide",
    "difficultyLevel": "invalid"
  }
}

// Response (400 Bad Request)
{
  "success": false,
  "errors": [
    {
      "field": "difficultyLevel",
      "message": "Invalid value. Must be one of: beginner, intermediate, advanced"
    }
  ]
}
```

---

## 🌍 Multi-Language API

### Multi-Language Post Management

```typescript
interface MultiLanguagePost {
  masterPost: BlogPost; // Master language post
  translations: Map<string, BlogPost>; // Translations
  workflowState: WorkflowState; // Workflow state
  synchronizationStatus: SyncStatus; // Sync status
}

interface SyncStatus {
  isMaster: boolean; // Whether this is master post
  lastSynced: Date; // Last synchronization time
  pendingTranslations: string[]; // Pending translation languages
  inconsistentFields: string[]; // Inconsistent fields
}
```

### Multi-Language API Methods

#### createTranslation()

Create a translation for existing post.

```typescript
async createTranslation(
  masterSlug: string,
  targetLanguage: string,
  variables: Record<string, any>
): Promise<BlogPost>

// Example usage
const translation = await api.createTranslation(
  'advanced-timing-techniques',
  'pt-br',
  {
    title: "Técnicas Avançadas de Timing",
    targetAudience: "Profissionais de apresentação"
  }
);
```

#### getTranslations()

Get all translations for a post.

```typescript
async getTranslations(slug: string): Promise<Map<string, BlogPost>>

// Example usage
const translations = await api.getTranslations('advanced-timing-techniques');
console.log('Available languages:', Array.from(translations.keys()));
```

#### synchronizeTranslations()

Synchronize metadata across translations.

```typescript
async synchronizeTranslations(slug: string): Promise<SyncStatus>

// Example usage
const syncStatus = await api.synchronizeTranslations('advanced-timing-techniques');
console.log('Inconsistent fields:', syncStatus.inconsistentFields);
```

### Multi-Language REST API

#### POST /api/posts/:slug/translations

Create a translation.

```typescript
// Request
POST /api/posts/advanced-timing-techniques/translations
Content-Type: application/json

{
  "language": "pt-br",
  "variables": {
    "title": "Técnicas Avançadas de Timing",
    "targetAudience": "Profissionais de apresentação"
  }
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "slug": "tecnicas-avancadas-de-timing",
    "language": "pt-br",
    "masterSlug": "advanced-timing-techniques"
  }
}
```

#### GET /api/posts/:slug/translations

List translations.

```typescript
// Request
GET /api/posts/advanced-timing-techniques/translations

// Response (200 OK)
{
  "success": true,
  "data": {
    "translations": [
      {
        "slug": "tecnicas-avancadas-de-timing",
        "language": "pt-br",
        "title": "Técnicas Avançadas de Timing",
        "lastModified": "2025-01-25T10:30:00Z"
      },
      {
        "slug": "tecnicas-avanzadas-de-timing",
        "language": "es",
        "title": "Técnicas Avanzadas de Timing",
        "lastModified": "2025-01-25T11:00:00Z"
      }
    ],
    "masterLanguage": "en"
  }
}
```

#### POST /api/posts/:slug/synchronize

Synchronize translations.

```typescript
// Request
POST /api/posts/advanced-timing-techniques/synchronize

// Response (200 OK)
{
  "success": true,
  "data": {
    "synchronizedAt": "2025-01-25T12:00:00Z",
    "updatedTranslations": ["pt-br", "es"],
    "inconsistentFields": []
  }
}
```

---

## 🔍 SEO API

### SEO Analysis

```typescript
interface SEOResult {
  score: number; // Overall SEO score (0-100)
  issues: SEOIssue[]; // SEO issues found
  recommendations: SEORecommendation[]; // Recommendations
  keywords: KeywordAnalysis[]; // Keyword analysis
}

interface SEOIssue {
  type: 'missing' | 'invalid' | 'suboptimal'; // Issue type
  field: string; // Field with issue
  message: string; // Issue description
  severity: 'error' | 'warning' | 'info'; // Severity level
}

interface SEORecommendation {
  category: 'content' | 'technical' | 'keywords'; // Recommendation category
  priority: 'high' | 'medium' | 'low'; // Priority level
  action: string; // Recommended action
  impact: string; // Expected impact
}
```

### SEO API Methods

#### analyzeSEO()

Analyze SEO for a blog post.

```typescript
async analyzeSEO(slug: string, language?: string): Promise<SEOResult>

// Example usage
const seoResult = await api.analyzeSEO('advanced-timing-techniques', 'en');
console.log('SEO Score:', seoResult.score);
console.log('Issues:', seoResult.issues);
```

#### optimizeSEO()

Apply SEO optimizations.

```typescript
async optimizeSEO(
  slug: string,
  options: SEOOptimizationOptions,
  language?: string
): Promise<SEOResult>

interface SEOOptimizationOptions {
  autoFix?: boolean;            // Auto-fix issues
  targetScore?: number;         // Target SEO score
  categories?: ('content' | 'technical' | 'keywords')[]; // Categories to optimize
}

// Example usage
const optimizedResult = await api.optimizeSEO(
  'advanced-timing-techniques',
  {
    autoFix: true,
    targetScore: 85,
    categories: ['content', 'technical']
  },
  'en'
);
```

#### generateKeywords()

Generate keyword suggestions.

```typescript
async generateKeywords(
  content: string,
  targetLanguage: string = 'en'
): Promise<KeywordSuggestion[]>

interface KeywordSuggestion {
  keyword: string;              // Suggested keyword
  relevance: number;            // Relevance score (0-1)
  competition: 'low' | 'medium' | 'high'; // Competition level
  volume: number;               // Search volume estimate
}

// Example usage
const suggestions = await api.generateKeywords(
  "Advanced timing techniques for professional presentations",
  'en'
);
```

### SEO REST API

#### POST /api/seo/analyze

Analyze SEO for content.

```typescript
// Request
POST /api/seo/analyze
Content-Type: application/json

{
  "slug": "advanced-timing-techniques",
  "language": "en"
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "score": 87,
    "issues": [
      {
        "type": "suboptimal",
        "field": "metaDescription",
        "message": "Meta description could be more compelling",
        "severity": "warning"
      }
    ],
    "recommendations": [
      {
        "category": "content",
        "priority": "medium",
        "action": "Add more internal links",
        "impact": "Improved navigation and SEO"
      }
    ],
    "keywords": [
      {
        "keyword": "timing techniques",
        "relevance": 0.95,
        "competition": "medium",
        "volume": 1200
      }
    ]
  }
}
```

#### POST /api/seo/optimize

Apply SEO optimizations.

```typescript
// Request
POST /api/seo/optimize
Content-Type: application/json

{
  "slug": "advanced-timing-techniques",
  "options": {
    "autoFix": true,
    "targetScore": 90
  },
  "language": "en"
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "originalScore": 87,
    "optimizedScore": 92,
    "fixesApplied": [
      "Improved meta description",
      "Added internal links",
      "Optimized heading structure"
    ],
    "result": {
      "score": 92,
      "issues": [],
      "recommendations": []
    }
  }
}
```

---

## 📊 Analytics API

### Analytics Data

```typescript
interface AnalyticsData {
  postSlug: string; // Post identifier
  language: string; // Content language
  period: string; // Analysis period
  metrics: {
    views: number; // Page views
    readTime: number; // Average read time (seconds)
    bounceRate: number; // Bounce rate (0-1)
    engagement: number; // Engagement score (0-100)
    conversions: number; // Conversions
    shares: number; // Social shares
  };
  trends: {
    views: TrendData[]; // Views over time
    engagement: TrendData[]; // Engagement over time
  };
  demographics: {
    countries: CountryData[]; // Geographic data
    devices: DeviceData[]; // Device data
    sources: SourceData[]; // Traffic sources
  };
}

interface TrendData {
  date: string; // Date (YYYY-MM-DD)
  value: number; // Metric value
}

interface CountryData {
  country: string; // Country code
  views: number; // Views from country
  percentage: number; // Percentage of total
}
```

### Analytics API Methods

#### getAnalytics()

Get analytics data for a post.

```typescript
async getAnalytics(
  slug: string,
  options: AnalyticsOptions
): Promise<AnalyticsData>

interface AnalyticsOptions {
  period: '7d' | '30d' | '90d' | '1y'; // Analysis period
  language?: string;            // Content language
  metrics?: string[];           // Specific metrics to include
  compare?: boolean;            // Include comparison data
}

// Example usage
const analytics = await api.getAnalytics('advanced-timing-techniques', {
  period: '30d',
  language: 'en',
  compare: true
});
```

#### getTopPosts()

Get top performing posts.

```typescript
async getTopPosts(options: TopPostsOptions): Promise<AnalyticsPost[]>

interface TopPostsOptions {
  period: '7d' | '30d' | '90d' | '1y'; // Analysis period
  limit?: number;               // Number of posts to return
  category?: BlogCategory;      // Filter by category
  language?: string;            // Filter by language
  sortBy: 'views' | 'engagement' | 'readTime'; // Sort metric
}

// Example usage
const topPosts = await api.getTopPosts({
  period: '30d',
  limit: 10,
  category: 'timing-guide',
  sortBy: 'engagement'
});
```

#### getInsights()

Get analytics insights and recommendations.

```typescript
async getInsights(options: InsightsOptions): Promise<AnalyticsInsight[]>

interface InsightsOptions {
  period: '7d' | '30d' | '90d' | '1y'; // Analysis period
  category?: BlogCategory;      // Filter by category
  language?: string;            // Filter by language
  types?: ('trend' | 'opportunity' | 'warning')[]; // Insight types
}

// Example usage
const insights = await api.getInsights({
  period: '30d',
  types: ['opportunity', 'warning']
});
```

### Analytics REST API

#### GET /api/analytics/posts/:slug

Get analytics for a specific post.

```typescript
// Request
GET /api/analytics/posts/advanced-timing-techniques?period=30d&language=en&compare=true

// Response (200 OK)
{
  "success": true,
  "data": {
    "postSlug": "advanced-timing-techniques",
    "language": "en",
    "period": "30d",
    "metrics": {
      "views": 2341,
      "readTime": 272,
      "bounceRate": 0.34,
      "engagement": 78,
      "conversions": 45,
      "shares": 23
    },
    "trends": {
      "views": [
        {"date": "2025-01-01", "value": 120},
        {"date": "2025-01-02", "value": 145}
      ]
    },
    "demographics": {
      "countries": [
        {"country": "US", "views": 1200, "percentage": 51.2},
        {"country": "GB", "views": 450, "percentage": 19.2}
      ]
    }
  }
}
```

#### GET /api/analytics/top

Get top performing posts.

```typescript
// Request
GET /api/analytics/top?period=30d&limit=10&category=timing-guide&sortBy=engagement

// Response (200 OK)
{
  "success": true,
  "data": {
    "posts": [
      {
        "slug": "advanced-timing-techniques",
        "title": "Advanced Timing Techniques",
        "category": "timing-guide",
        "metrics": {
          "views": 2341,
          "engagement": 78,
          "readTime": 272
        }
      }
    ],
    "period": "30d",
    "totalPosts": 25
  }
}
```

#### GET /api/analytics/insights

Get analytics insights.

```typescript
// Request
GET /api/analytics/insights?period=30d&types=opportunity,warning

// Response (200 OK)
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "opportunity",
        "title": "Timing Guides Outperforming",
        "description": "Timing guide posts have 45% higher engagement than other categories",
        "impact": "high",
        "recommendation": "Create more timing guide content"
      },
      {
        "type": "warning",
        "title": "Mobile Engagement Declining",
        "description": "Mobile user engagement has decreased by 15% this month",
        "impact": "medium",
        "recommendation": "Optimize content for mobile users"
      }
    ]
  }
}
```

---

## 🔧 Workflow API

### Workflow Management

```typescript
interface WorkflowState {
  status: 'draft' | 'in-review' | 'approved' | 'scheduled' | 'published';
  assignedTo?: string; // Assigned user/team
  dueDate?: string; // Due date for current state
  history: WorkflowTransition[]; // State transition history
}

interface WorkflowTransition {
  from: string; // Previous state
  to: string; // New state
  timestamp: string; // Transition timestamp
  user: string; // User who made transition
  comment?: string; // Transition comment
}
```

### Workflow API Methods

#### getWorkflowStatus()

Get workflow status for a post.

```typescript
async getWorkflowStatus(slug: string): Promise<WorkflowState>

// Example usage
const status = await api.getWorkflowStatus('advanced-timing-techniques');
console.log('Current status:', status.status);
```

#### updateWorkflowStatus()

Update workflow status.

```typescript
async updateWorkflowStatus(
  slug: string,
  newStatus: WorkflowState['status'],
  options?: WorkflowUpdateOptions
): Promise<WorkflowState>

interface WorkflowUpdateOptions {
  assignedTo?: string;          // Assign to user/team
  dueDate?: string;            // Set due date
  comment?: string;            // Transition comment
}

// Example usage
const updatedStatus = await api.updateWorkflowStatus(
  'advanced-timing-techniques',
  'in-review',
  {
    assignedTo: 'editor@cuetimer.com',
    dueDate: '2025-01-30T17:00:00Z',
    comment: 'Ready for editorial review'
  }
);
```

#### getWorkflowQueue()

Get posts in workflow queues.

```typescript
async getWorkflowQueue(
  status?: WorkflowState['status'],
  assignedTo?: string
): Promise<WorkflowQueueItem[]>

interface WorkflowQueueItem {
  post: BlogPost;              // Post data
  workflow: WorkflowState;     // Workflow state
  priority: 'low' | 'medium' | 'high'; // Priority level
}

// Example usage
const reviewQueue = await api.getWorkflowQueue('in-review', 'editor@cuetimer.com');
```

### Workflow REST API

#### GET /api/workflow/posts/:slug/status

Get workflow status.

```typescript
// Request
GET /api/workflow/posts/advanced-timing-techniques/status

// Response (200 OK)
{
  "success": true,
  "data": {
    "status": "in-review",
    "assignedTo": "editor@cuetimer.com",
    "dueDate": "2025-01-30T17:00:00Z",
    "history": [
      {
        "from": "draft",
        "to": "in-review",
        "timestamp": "2025-01-25T10:00:00Z",
        "user": "content@cuetimer.com",
        "comment": "Content ready for review"
      }
    ]
  }
}
```

#### PUT /api/workflow/posts/:slug/status

Update workflow status.

```typescript
// Request
PUT /api/workflow/posts/advanced-timing-techniques/status
Content-Type: application/json

{
  "status": "approved",
  "assignedTo": "publisher@cuetimer.com",
  "comment": "Content approved for publication"
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "status": "approved",
    "assignedTo": "publisher@cuetimer.com",
    "transitionedAt": "2025-01-26T09:00:00Z"
  }
}
```

#### GET /api/workflow/queue

Get workflow queue.

```typescript
// Request
GET /api/workflow/queue?status=in-review&assignedTo=editor@cuetimer.com

// Response (200 OK)
{
  "success": true,
  "data": {
    "queue": [
      {
        "post": {
          "slug": "advanced-timing-techniques",
          "title": "Advanced Timing Techniques"
        },
        "workflow": {
          "status": "in-review",
          "assignedTo": "editor@cuetimer.com",
          "dueDate": "2025-01-30T17:00:00Z"
        },
        "priority": "high"
      }
    ],
    "total": 5
  }
}
```

---

## 🔄 Publishing API

### Publishing Management

```typescript
interface PublishOptions {
  scheduleDate?: string; // Scheduled publication date
  channels?: string[]; // Publishing channels
  notifications?: boolean; // Send notifications
  socialMedia?: SocialMediaOptions; // Social media options
}

interface SocialMediaOptions {
  platforms: string[]; // Social media platforms
  message?: string; // Custom message
  image?: string; // Custom image
}
```

### Publishing API Methods

#### publishPost()

Publish a blog post.

```typescript
async publishPost(
  slug: string,
  options?: PublishOptions
): Promise<PublishResult>

interface PublishResult {
  success: boolean;            // Publish success
  publishedAt: string;         // Publication timestamp
  url: string;                // Published URL
  channels: string[];         // Published channels
}

// Example usage
const result = await api.publishPost('advanced-timing-techniques', {
  scheduleDate: '2025-02-01T10:00:00Z',
  channels: ['web', 'email'],
  notifications: true,
  socialMedia: {
    platforms: ['twitter', 'linkedin'],
    message: 'Check out our new guide on advanced timing techniques!'
  }
});
```

#### schedulePost()

Schedule a post for publication.

```typescript
async schedulePost(
  slug: string,
  scheduleDate: string,
  options?: Omit<PublishOptions, 'scheduleDate'>
): Promise<ScheduleResult>

interface ScheduleResult {
  success: boolean;            // Schedule success
  scheduledAt: string;         // Scheduled timestamp
  scheduledFor: string;        // Target publication date
}

// Example usage
const scheduleResult = await api.schedulePost(
  'advanced-timing-techniques',
  '2025-02-01T10:00:00Z',
  {
    notifications: true,
    socialMedia: {
      platforms: ['twitter']
    }
  }
);
```

#### unpublishPost()

Unpublish a blog post.

```typescript
async unpublishPost(slug: string): Promise<UnpublishResult>

interface UnpublishResult {
  success: boolean;            // Unpublish success
  unpublishedAt: string;       // Unpublish timestamp
  reason?: string;             // Unpublish reason
}

// Example usage
const result = await api.unpublishPost('advanced-timing-techniques');
```

### Publishing REST API

#### POST /api/publish/posts/:slug

Publish a post.

```typescript
// Request
POST /api/publish/posts/advanced-timing-techniques
Content-Type: application/json

{
  "scheduleDate": "2025-02-01T10:00:00Z",
  "channels": ["web", "email"],
  "notifications": true,
  "socialMedia": {
    "platforms": ["twitter", "linkedin"],
    "message": "New guide on advanced timing techniques!"
  }
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "publishedAt": "2025-02-01T10:00:00Z",
    "url": "https://cuetimer.com/blog/advanced-timing-techniques",
    "channels": ["web", "email"],
    "socialMedia": {
      "twitter": {
        "posted": true,
        "url": "https://twitter.com/...",
        "engagement": 0
      },
      "linkedin": {
        "posted": true,
        "url": "https://linkedin.com/...",
        "engagement": 0
      }
    }
  }
}
```

#### POST /api/publish/posts/:slug/schedule

Schedule a post.

```typescript
// Request
POST /api/publish/posts/advanced-timing-techniques/schedule
Content-Type: application/json

{
  "scheduleDate": "2025-02-01T10:00:00Z",
  "notifications": true
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "scheduledAt": "2025-01-25T15:30:00Z",
    "scheduledFor": "2025-02-01T10:00:00Z",
    "status": "scheduled"
  }
}
```

#### POST /api/publish/posts/:slug/unpublish

Unpublish a post.

```typescript
// Request
POST /api/publish/posts/advanced-timing-techniques/unpublish
Content-Type: application/json

{
  "reason": "Content needs revision"
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "unpublishedAt": "2025-01-25T16:00:00Z",
    "reason": "Content needs revision",
    "status": "draft"
  }
}
```

---

## 🔌 Integration Examples

### Node.js Integration

```typescript
import { CueTimerAPIClient } from '@cuetimer/api-client';

// Initialize client
const client = new CueTimerAPIClient({
  baseURL: 'https://api.cuetimer.com',
  apiKey: process.env.CUETIMER_API_KEY,
});

// Create content
async function createContent() {
  try {
    const post = await client.posts.create({
      template: 'timing-guide',
      variables: {
        title: 'Advanced Timing Techniques',
        targetAudience: 'Professional speakers',
        difficultyLevel: 'advanced',
      },
      language: 'en',
    });

    console.log('Created post:', post.slug);

    // Analyze SEO
    const seoResult = await client.seo.analyze(post.slug);
    console.log('SEO Score:', seoResult.score);

    // Publish post
    const publishResult = await client.publish.publish(post.slug);
    console.log('Published at:', publishResult.publishedAt);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### React Integration

```typescript
import { useState, useEffect } from 'react';
import { CueTimerAPIClient } from '@cuetimer/api-client';

export function BlogPostCreator() {
  const [client] = useState(() => new CueTimerAPIClient());
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await client.templates.getAll();
      setTemplates(data.templates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const createPost = async (templateId, variables) => {
    setLoading(true);
    try {
      const post = await client.posts.create({
        template: templateId,
        variables,
        language: 'en'
      });
      setResult(post);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Python Integration (via REST API)

```python
import requests
import json

class CueTimerAPI:
    def __init__(self, base_url, api_key=None):
        self.base_url = base_url
        self.headers = {
            'Content-Type': 'application/json',
            **({'Authorization': f'Bearer {api_key}'} if api_key else {})
        }

    def create_post(self, template, variables, language='en'):
        url = f'{self.base_url}/api/posts'
        data = {
            'template': template,
            'variables': variables,
            'language': language
        }

        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def analyze_seo(self, slug, language='en'):
        url = f'{self.base_url}/api/seo/analyze'
        data = {'slug': slug, 'language': language}

        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        return response.json()

# Usage
api = CueTimerAPI('https://api.cuetimer.com', 'your-api-key')

post = api.create_post(
    'timing-guide',
    {
        'title': 'Advanced Timing Techniques',
        'targetAudience': 'Professional speakers'
    }
)

seo_result = api.analyze_seo(post['data']['slug'])
print(f"SEO Score: {seo_result['data']['score']}")
```

---

## 📚 API Types and Schemas

### Complete Type Definitions

```typescript
// Blog Categories
export type BlogCategory =
  | 'timing-guide'
  | 'case-study'
  | 'feature-announce'
  | 'presentation-tips';

// Blog Post Interface
export interface BlogPost {
  title: string;
  slug: string;
  category: BlogCategory;
  summary: string;
  author: string;
  publishedAt: string;
  readTime: number;
  language: string;
  tags?: string[];
  isDraft: boolean;
  content?: string;
  lastModified?: string;
  image?: string;
  difficulty?: string;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  total: number;
  limit: number;
  offset: number;
}

// Error Types
export interface APIError {
  status: number;
  message: string;
  details?: any;
  code?: string;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}
```

---

## 🛠️ API Best Practices

### Error Handling

```typescript
// Robust error handling
async function createContentWithRetry(template, variables, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await api.posts.create({ template, variables });
      return result;
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries) {
        // Rate limited, wait and retry
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      if (error.status >= 500 && attempt < maxRetries) {
        // Server error, retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      // Client error or max retries exceeded
      throw error;
    }
  }
}
```

### Caching Strategy

```typescript
// API response caching
class CachedAPIClient extends CueTimerAPIClient {
  private cache = new Map<string, { data: any; expiry: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  async getCached(endpoint: string, ttl = this.defaultTTL) {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    const data = await this.request(endpoint);
    this.cache.set(cacheKey, {
      data,
      expiry: Date.now() + ttl,
    });

    return data;
  }

  invalidateCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}
```

### Rate Limiting

```typescript
// Rate limiting implementation
class RateLimitedAPIClient extends CueTimerAPIClient {
  private requests: number[] = [];
  private readonly maxRequests = 100;
  private readonly windowMs = 60 * 1000; // 1 minute

  private async checkRateLimit() {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.requests.push(now);
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    await this.checkRateLimit();
    return super.request(endpoint, options);
  }
}
```

---

## 🔒 Security and Authentication

### API Key Authentication

```typescript
// Secure API key handling
class SecureAPIClient extends CueTimerAPIClient {
  private apiKey: string;

  constructor(config: CueTimerAPIConfig & { apiKey: string }) {
    super(config);
    this.apiKey = config.apiKey;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    // Implement secure token refresh if needed
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'X-Request-ID': this.generateRequestId(),
    };
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers = {
      ...(options?.headers || {}),
      ...(await this.getAuthHeaders()),
    };

    return super.request(endpoint, { ...options, headers });
  }
}
```

---

## 📞 Support and Resources

### API Support

- **Documentation**: This comprehensive API reference
- **Examples**: [Integration Examples](#integration-examples)
- **Testing**: [API Testing Guide](./API-TESTING.md)
- **Support**: api-support@cuetimer.com

### Rate Limits

- **Standard Tier**: 100 requests per minute
- **Professional Tier**: 500 requests per minute
- **Enterprise Tier**: Custom limits

### SDKs and Libraries

- **JavaScript/TypeScript**: `@cuetimer/api-client`
- **Python**: `cuetimer-api` (Coming soon)
- **Ruby**: `cuetimer-ruby` (Coming soon)

---

_For questions about API usage or integration, please refer to our
[developer documentation](./DEVELOPER-GUIDE.md) or contact our API support
team._
