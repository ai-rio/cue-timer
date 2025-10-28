import React, { useMemo } from 'react';
import { remark } from 'remark';

import { remarkInternalLinkInserter } from '@/lib/mdx-plugins/internal-link-inserter';

interface InternalLinkInjectorProps {
  content: string;
  currentSlug: string;
  locale: string;
  maxLinks?: number;
  className?: string;
}

export function InternalLinkInjector({
  content,
  currentSlug,
  locale,
  maxLinks = 5,
  className = '',
}: InternalLinkInjectorProps) {
  const processedContent = useMemo(() => {
    try {
      const result = remark()
        .use(remarkInternalLinkInserter, {
          currentSlug,
          maxLinks,
          locale,
        })
        .processSync(content);

      return String(result);
    } catch (error) {
      console.error('Error processing internal links:', error);
      return content; // Fallback to original content
    }
  }, [content, currentSlug, locale, maxLinks]);

  // Render the processed content as HTML
  return (
    <div
      className={`internal-link-content ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}

export default InternalLinkInjector;
