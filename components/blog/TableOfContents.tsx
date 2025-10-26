'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { extractHeadingsFromMdx } from '@/lib/utils';
import type { TableOfContentsItem } from '@/types/blog';

interface TableOfContentsProps {
  content?: string;
  headings?: TableOfContentsItem[];
  activeId?: string;
}

export default function TableOfContents({ content, headings }: TableOfContentsProps) {
  // Extract headings from content if not provided (fallback for backward compatibility)
  const computedHeadings = useMemo(() => {
    if (headings && headings.length > 0) {
      return headings;
    }
    if (content) {
      return extractHeadingsFromMdx(content);
    }
    return [];
  }, [headings, content]);

  const [currentActiveId, setCurrentActiveId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update active section based on scroll position
  useEffect(() => {
    if (!isClient || computedHeadings.length === 0) return undefined;

    const handleScroll = () => {
      try {
        const headingElements = computedHeadings
          .map((heading) => ({
            id: heading.id,
            element: document.getElementById(heading.id),
          }))
          .filter(({ element }) => element !== null);

        if (headingElements.length === 0) return;

        // Find the heading that's currently in view
        const currentHeading = headingElements.find(({ element }) => {
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom > 100;
        });

        // If no heading is in view, find the last one that passed
        const activeHeading =
          currentHeading ||
          headingElements.reverse().find(({ element }) => {
            if (!element) return false;
            const rect = element.getBoundingClientRect();
            return rect.top <= 100;
          });

        if (activeHeading) {
          setCurrentActiveId(activeHeading.id);
        }
      } catch (error) {
        console.warn('Error handling scroll for Table of Contents:', error);
      }
    };

    // Throttle scroll events for better performance
    let timeoutId: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(handleScroll, 50);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [computedHeadings, isClient]);

  if (computedHeadings.length === 0) {
    return null;
  }

  const handleHeadingClick = useCallback(
    (headingId: string) => (e: React.MouseEvent) => {
      e.preventDefault();

      try {
        const element = document.getElementById(headingId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
          setCurrentActiveId(headingId);

          // Update URL hash without causing a jump
          window.history.pushState(null, '', `#${headingId}`);
        }
      } catch (error) {
        console.warn('Error scrolling to heading:', error);
        // Fallback: update the hash directly
        window.location.hash = headingId;
      }
    },
    []
  );

  const renderTableOfContentsItem = useCallback(
    (item: TableOfContentsItem, level: number = 0) => {
      const isActive = currentActiveId === item.id;
      const marginLeft = `${level * 16}px`;

      return (
        <li key={item.id} className='my-1'>
          <a
            href={`#${item.id}`}
            className={`block py-1 px-2 text-sm rounded transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isActive
                ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            style={{ marginLeft }}
            onClick={handleHeadingClick(item.id)}
            aria-label={`Navigate to section: ${item.text}`}
            aria-current={isActive ? 'location' : undefined}
          >
            <span className='truncate'>{item.text}</span>
          </a>
          {item.children && item.children.length > 0 && (
            <ul className='mt-1' role='list'>
              {item.children.map((child) => renderTableOfContentsItem(child, level + 1))}
            </ul>
          )}
        </li>
      );
    },
    [currentActiveId, handleHeadingClick]
  );

  // Show loading state on server-side
  if (!isClient) {
    return (
      <Card className='sticky top-24 w-full max-w-xs opacity-50'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-lg flex items-center justify-between'>
            Table of Contents
            <Badge variant='secondary' className='text-xs animate-pulse'>
              Loading...
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='space-y-2'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-4 bg-muted rounded animate-pulse' />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (computedHeadings.length === 0) {
    return null;
  }

  return (
    <Card className='sticky top-24 w-full max-w-xs shadow-sm border'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg flex items-center justify-between'>
          <span>Table of Contents</span>
          <Badge variant='secondary' className='text-xs font-normal'>
            {computedHeadings.length} {computedHeadings.length === 1 ? 'section' : 'sections'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0 max-h-[60vh] overflow-y-auto'>
        <nav aria-label='Table of Contents' role='navigation' className='space-y-1'>
          <ul className='space-y-1' role='list'>
            {computedHeadings.map((heading) => renderTableOfContentsItem(heading))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}
