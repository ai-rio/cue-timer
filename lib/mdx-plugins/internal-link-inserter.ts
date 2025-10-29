import type { Root } from 'mdast';

// import { visit } from 'unist-util-visit';

// import { getLinkSuggestions } from '../internal-linking';

interface InternalLinkInserterOptions {
  currentSlug: string;
  maxLinks?: number;
  locale?: string;
}

export function remarkInternalLinkInserter(_options: InternalLinkInserterOptions) {
  return (tree: Root) => {
    try {
      // Skip internal link insertion during SSR to prevent hydration mismatches
      if (typeof window === 'undefined') {
        return tree;
      }

      // For client-side processing, we'll handle this asynchronously in a useEffect
      // rather than during the remark processing phase
      return tree;
    } catch (error) {
      console.error('Error in remarkInternalLinkInserter:', error);
      // Return tree unmodified if there's an error
      return tree;
    }
  };
}

// Type declarations for the plugin
declare module 'unified' {
  interface PluginTupleSettings {
    remarkInternalLinkInserter: [settings?: InternalLinkInserterOptions];
  }
}
