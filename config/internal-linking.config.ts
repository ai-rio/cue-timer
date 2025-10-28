export interface InternalLinkingConfig {
  enabled: boolean;
  maxLinksPerPost: number;
  minRelevanceScore: number;
  excludeCategories: string[];
  targetCategories: string[];
  linkFormat: 'inline' | 'footnote' | 'sidebar';
  locales: string[];
  enableCLI: boolean;
}

export const defaultInternalLinkingConfig: InternalLinkingConfig = {
  enabled: true,
  maxLinksPerPost: 5,
  minRelevanceScore: 0.3,
  excludeCategories: [], // Add categories to exclude
  targetCategories: [], // Empty means all categories
  linkFormat: 'inline',
  locales: ['en', 'es', 'pt-br', 'fr'], // Existing supported locales
  enableCLI: true,
};

// Environment-specific configuration
export function getInternalLinkingConfig(): InternalLinkingConfig {
  if (process.env.NODE_ENV === 'development') {
    return {
      ...defaultInternalLinkingConfig,
      maxLinksPerPost: 3, // Fewer links in development
    };
  }

  return defaultInternalLinkingConfig;
}
