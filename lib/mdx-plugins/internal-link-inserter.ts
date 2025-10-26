import type { Link, Root, Text } from 'mdast';
import { visit } from 'unist-util-visit';

import { getLinkSuggestions } from '../internal-linking';

interface InternalLinkInserterOptions {
  currentSlug: string;
  maxLinks?: number;
  locale?: string;
}

export function remarkInternalLinkInserter(options: InternalLinkInserterOptions) {
  const { currentSlug, maxLinks = 5, locale = 'en' } = options;

  return async (tree: Root) => {
    try {
      const suggestions = await getLinkSuggestions(currentSlug, maxLinks, locale);
      const insertedLinks = new Set<string>();

      visit(tree, 'text', (node: Text, index, parent) => {
        if (insertedLinks.size >= maxLinks) return;

        for (const suggestion of suggestions) {
          if (insertedLinks.has(suggestion.slug)) continue;

          const text = node.value;
          const anchorIndex = text.toLowerCase().indexOf(suggestion.suggestedAnchor.toLowerCase());

          if (anchorIndex !== -1) {
            // Insert link using existing component infrastructure
            const beforeText = text.substring(0, anchorIndex);
            const linkText = text.substring(
              anchorIndex,
              anchorIndex + suggestion.suggestedAnchor.length
            );
            const afterText = text.substring(anchorIndex + suggestion.suggestedAnchor.length);

            // Create link node that works with existing rendering system
            const linkNode: Link = {
              type: 'link',
              url: `/${locale}/blog/${suggestion.slug}`,
              title: suggestion.title,
              children: [{ type: 'text', value: linkText }],
            };

            // Replace text node with link + surrounding text
            if (parent && typeof index === 'number') {
              const newChildren = [];
              if (beforeText) {
                newChildren.push({ type: 'text', value: beforeText });
              }
              newChildren.push(linkNode);
              if (afterText) {
                newChildren.push({ type: 'text', value: afterText });
              }
              parent.children.splice(index, 1, ...newChildren);
            }

            insertedLinks.add(suggestion.slug);
            break;
          }
        }
      });

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
