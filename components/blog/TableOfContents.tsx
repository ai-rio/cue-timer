'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TableOfContentsItem } from '@/types/blog';

interface TableOfContentsProps {
  headings: TableOfContentsItem[];
  activeId?: string;
}

export default function TableOfContents({ headings, activeId }: TableOfContentsProps) {
  const [currentActiveId, setCurrentActiveId] = useState<string>(activeId || '');

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((heading) => ({
        id: heading.id,
        element: document.getElementById(heading.id),
      }));

      // Find the heading that's currently in view
      const currentHeading = headingElements.find(({ element }) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });

      if (currentHeading) {
        setCurrentActiveId(currentHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const renderTableOfContentsItem = (item: TableOfContentsItem, level: number = 0) => {
    const isActive = currentActiveId === item.id;
    const marginLeft = `${level * 16}px`;

    return (
      <li key={item.id} className='my-1'>
        <a
          href={`#${item.id}`}
          className={`block py-1 px-2 text-sm rounded transition-colors hover:bg-muted ${
            isActive
              ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
              : 'text-muted-foreground'
          }`}
          style={{ marginLeft }}
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById(item.id);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setCurrentActiveId(item.id);
            }
          }}
        >
          {item.text}
        </a>
        {item.children && item.children.length > 0 && (
          <ul className='mt-1'>
            {item.children.map((child) => renderTableOfContentsItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <Card className='sticky top-24 w-full max-w-xs'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg flex items-center justify-between'>
          Table of Contents
          <Badge variant='secondary' className='text-xs'>
            {headings.length} sections
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        <nav aria-label='Table of Contents'>
          <ul className='space-y-1'>
            {headings.map((heading) => renderTableOfContentsItem(heading))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}

// Utility function to extract headings from MDX content
export function extractHeadings(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TableOfContentsItem[] = [];
  const stack: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1]?.length || 0;
    const text = match[2]?.trim() || '';
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const heading: TableOfContentsItem = {
      id,
      text,
      level,
      children: [],
    };

    // Pop items from stack that are at the same level or deeper
    while (stack.length > 0) {
      const lastItem = stack[stack.length - 1];
      if (lastItem && lastItem.level >= level) {
        stack.pop();
      } else {
        break;
      }
    }

    // Add to parent or root
    if (stack.length === 0) {
      headings.push(heading);
    } else {
      const lastItem = stack[stack.length - 1];
      if (lastItem) {
        lastItem.children.push(heading);
      }
    }

    stack.push(heading);
  }

  return headings;
}
