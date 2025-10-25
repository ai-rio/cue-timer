export interface BlogPost {
  title: string;
  slug: string;
  category: 'timing-guide' | 'case-study' | 'feature-announce' | 'presentation-tips';
  summary: string;
  author: string;
  publishedAt: string;
  readTime: number;
  image?: string;
  tags?: string[];
  isDraft: boolean;
  difficulty?: string;
  language: string;
  lastModified: string;
  content?: string;
}

export interface CueTimerTemplate {
  id: string;
  name: string;
  category: 'timing-guide' | 'case-study' | 'feature-announce' | 'presentation-tips';
  languages: string[];
  variables: TemplateVariable[];
  contentStructure: ContentSection[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
  description: string;
  defaultValue?: any;
}

export interface ContentSection {
  id: string;
  title: string;
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'image';
  required: boolean;
  order: number;
}

export interface MultiLanguagePost {
  masterPost: BlogPost;
  translations: Map<string, BlogPost>;
  workflowState: 'draft' | 'in-translation' | 'in-review' | 'scheduled' | 'published';
  synchronizationStatus: SyncStatus;
}

export interface SyncStatus {
  isMaster: boolean;
  lastSynced: Date;
  pendingTranslations: string[];
  inconsistentFields: string[];
}

export interface ContentMetrics {
  postSlug: string;
  language: string;
  views: number;
  readTime: number;
  bounceRate: number;
  featureEngagement: Record<string, number>;
  seoScore: number;
}

export interface SEOResult {
  score: number;
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  keywords: KeywordAnalysis[];
}

export interface SEOIssue {
  type: 'missing' | 'invalid' | 'suboptimal';
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface SEORecommendation {
  category: 'content' | 'technical' | 'keywords';
  priority: 'high' | 'medium' | 'low';
  action: string;
  impact: string;
}

export interface KeywordAnalysis {
  keyword: string;
  density: number;
  relevance: number;
  competition: 'low' | 'medium' | 'high';
}
