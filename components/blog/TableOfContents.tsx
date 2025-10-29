'use client';

import { ChevronUp, Menu, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { extractHeadingsFromMdx } from '@/lib/utils';
import type { TableOfContentsItem } from '@/types/blog';

interface TableOfContentsProps {
  content?: string;
  headings?: TableOfContentsItem[];
  activeId?: string;
}

// Constants for scroll behavior
const SCROLL_OFFSET = 100; // Offset in pixels to account for fixed headers
const SCROLL_TIMEOUT = 50; // Throttle timeout for scroll events
// const NAVIGATION_TIMEOUT = 1000; // Timeout for navigation attempts

// Debug flag - set to true to enable console logging
const DEBUG_TOC = process.env.NODE_ENV === 'development';

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
  const [navigationError, setNavigationError] = useState<string | null>(null);

  // Mobile and enhancement states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
    if (DEBUG_TOC) {
      console.warn('TableOfContents: Client-side hydration complete');
    }
  }, []);

  // Reading progress tracking
  useEffect(() => {
    if (!isClient) return undefined;

    const updateReadingProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, progress)));

      // Show/hide scroll to top button
      setShowScrollTop(scrollTop > 500);
    };

    const throttledUpdate = () => {
      requestAnimationFrame(updateReadingProgress);
    };

    window.addEventListener('scroll', throttledUpdate, { passive: true });
    updateReadingProgress(); // Initial call

    return () => window.removeEventListener('scroll', throttledUpdate);
  }, [isClient]);

  // Filter headings based on search query
  const filteredHeadings = useMemo(() => {
    if (!searchQuery.trim()) return computedHeadings;

    const filterHeadings = (headings: TableOfContentsItem[]): TableOfContentsItem[] =>
      headings.reduce((acc: TableOfContentsItem[], heading) => {
        const matchesSearch = heading.text.toLowerCase().includes(searchQuery.toLowerCase());
        const filteredChildren = heading.children ? filterHeadings(heading.children) : [];

        if (matchesSearch || filteredChildren.length > 0) {
          acc.push({
            ...heading,
            children: filteredChildren,
          });
        }
        return acc;
      }, []);

    return filterHeadings(computedHeadings);
  }, [computedHeadings, searchQuery]);

  // Scroll to top functionality
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Mobile toggle functionality
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Update active section using IntersectionObserver API
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (!isClient || computedHeadings.length === 0) {
      if (DEBUG_TOC && computedHeadings.length === 0) {
        console.warn('TableOfContents: No headings to track');
      }
      return cleanup;
    }

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      console.warn(
        'TableOfContents: IntersectionObserver not supported, falling back to scroll events'
      );
      // Fallback to manual scroll tracking if IntersectionObserver is not available
      const handleScroll = () => {
        try {
          const headingElements = computedHeadings
            .map((heading) => ({
              id: heading.id,
              element: document.getElementById(heading.id),
            }))
            .filter(({ element }) => element !== null);

          if (headingElements.length === 0) return;

          const currentHeading = headingElements.find(({ element }) => {
            if (!element) return false;
            const rect = element.getBoundingClientRect();
            return rect.top <= SCROLL_OFFSET && rect.bottom > SCROLL_OFFSET;
          });

          const activeHeading =
            currentHeading ||
            headingElements.reverse().find(({ element }) => {
              if (!element) return false;
              const rect = element.getBoundingClientRect();
              return rect.top <= SCROLL_OFFSET;
            });

          if (activeHeading && activeHeading.id !== currentActiveId) {
            setCurrentActiveId(activeHeading.id);
          }
        } catch (error) {
          console.warn('TableOfContents: Error in fallback scroll handling:', error);
        }
      };

      let timeoutId: NodeJS.Timeout;
      const throttledHandleScroll = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(handleScroll, SCROLL_TIMEOUT);
      };

      window.addEventListener('scroll', throttledHandleScroll, { passive: true });
      const initialCheck = setTimeout(handleScroll, 100);

      cleanup = () => {
        window.removeEventListener('scroll', throttledHandleScroll);
        if (timeoutId) clearTimeout(timeoutId);
        if (initialCheck) clearTimeout(initialCheck);
      };
    }

    try {
      // Get all heading elements that exist in the DOM
      const headingElements = computedHeadings
        .map((heading) => ({
          id: heading.id,
          element: document.getElementById(heading.id),
        }))
        .filter(({ element }) => element !== null);

      if (headingElements.length === 0) {
        if (DEBUG_TOC) {
          console.warn('TableOfContents: No heading elements found in DOM');
        }
        return cleanup;
      }

      if (DEBUG_TOC) {
        console.warn(
          `TableOfContents: Setting up IntersectionObserver for ${headingElements.length} headings`
        );
      }

      // Create IntersectionObserver with optimized settings
      const observer = new IntersectionObserver(
        (entries) => {
          // Find the most intersecting heading
          const visibleEntries = entries.filter((entry) => entry.isIntersecting);

          if (visibleEntries.length > 0) {
            // Sort by intersection ratio (most visible first)
            visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            const mostVisible = visibleEntries[0];
            const headingId = mostVisible.target.id;

            if (headingId !== currentActiveId) {
              setCurrentActiveId(headingId);
              if (DEBUG_TOC) {
                console.warn(
                  `TableOfContents: Active heading changed to "${headingId}" (IntersectionObserver - ${Math.round(mostVisible.intersectionRatio * 100)}% visible)`
                );
              }
            }
          }
        },
        {
          // Threshold values for detecting when headings are visible
          threshold: [0, 0.1, 0.3, 0.5, 0.7, 1],
          // Root margin to account for fixed headers and better UX
          rootMargin: '-80px 0px -60% 0px',
        }
      );

      // Observe all heading elements
      headingElements.forEach(({ element }) => {
        observer.observe(element);
      });

      // Set initial active heading based on current scroll position
      const setActiveFromScrollPosition = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;

        // Find the heading that's currently most visible
        const mostVisibleHeading = headingElements.find(({ element }) => {
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollTop;
          const elementBottom = rect.bottom + scrollTop;

          // Check if the element is in the viewport
          return (
            elementBottom > scrollTop + SCROLL_OFFSET &&
            elementTop < scrollTop + viewportHeight - SCROLL_OFFSET
          );
        });

        if (mostVisibleHeading && mostVisibleHeading.id !== currentActiveId) {
          setCurrentActiveId(mostVisibleHeading.id);
        }
      };

      // Check initial position after a short delay
      const initialCheckTimeout = setTimeout(setActiveFromScrollPosition, 100);

      if (DEBUG_TOC) {
        console.warn('TableOfContents: IntersectionObserver setup complete');
      }

      cleanup = () => {
        // Cleanup: disconnect observer and clear timeout
        observer.disconnect();
        if (initialCheckTimeout) {
          clearTimeout(initialCheckTimeout);
        }
        if (DEBUG_TOC) {
          console.warn('TableOfContents: IntersectionObserver cleaned up');
        }
      };
    } catch (error) {
      console.warn('TableOfContents: Error setting up IntersectionObserver:', error);
      setNavigationError('Advanced scroll tracking failed');
      setTimeout(() => setNavigationError(null), 3000);
      return cleanup;
    }

    return cleanup;
  }, [computedHeadings, isClient, currentActiveId]);

  // Validate that heading elements exist in the DOM (after hydration)
  useEffect(() => {
    if (!isClient || computedHeadings.length === 0) return undefined;

    const validateHeadings = () => {
      const missingHeadings = computedHeadings.filter((heading) => {
        const element = document.getElementById(heading.id);
        const exists = element !== null;

        if (!exists && DEBUG_TOC) {
          console.warn(`TableOfContents: Heading element not found:`, {
            id: heading.id,
            text: heading.text,
            level: heading.level,
          });
        }

        return !exists;
      });

      if (missingHeadings.length > 0) {
        console.error(
          `TableOfContents: ${missingHeadings.length} heading(s) missing from DOM:`,
          missingHeadings
        );
        setNavigationError(`Some sections unavailable`);
        setTimeout(() => setNavigationError(null), 5000);
      } else if (DEBUG_TOC) {
        console.warn(`TableOfContents: All ${computedHeadings.length} headings found in DOM`);
      }
    };

    // Wait a bit for MDX content to render
    const timeout = setTimeout(validateHeadings, 500);
    return () => clearTimeout(timeout);
  }, [computedHeadings, isClient]);

  if (computedHeadings.length === 0) {
    return null;
  }

  const handleHeadingClick = useCallback(
    (headingId: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      setNavigationError(null);

      if (DEBUG_TOC) {
        console.warn(`TableOfContents: Clicking heading "${headingId}"`);
      }

      // Validate headingId
      if (!headingId || typeof headingId !== 'string') {
        const _error = 'Invalid heading ID';
        console.error('TableOfContents: Invalid heading ID:', headingId);
        setNavigationError(_error);
        setTimeout(() => setNavigationError(null), 3000);
        return;
      }

      // Try to find the heading element with retries
      let element = document.getElementById(headingId);
      let attempts = 0;
      const maxAttempts = 5;

      const tryScroll = () => {
        if (!element) {
          element = document.getElementById(headingId);
          attempts++;

          if (!element && attempts < maxAttempts) {
            // Element might still be rendering, wait a bit and try again
            setTimeout(tryScroll, 100);
            return;
          }
        }

        if (element) {
          try {
            // Get element position for debugging
            const rect = element.getBoundingClientRect();
            if (DEBUG_TOC) {
              console.warn(`TableOfContents: Found element "${headingId}" at position:`, {
                top: rect.top,
                bottom: rect.bottom,
                visible: rect.top >= 0 && rect.bottom <= window.innerHeight,
              });
            }

            // Scroll with custom offset
            const scrollOptions: ScrollIntoViewOptions = {
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest',
            };

            element.scrollIntoView(scrollOptions);

            // Update active state immediately
            setCurrentActiveId(headingId);

            // Update URL hash without causing a jump
            window.history.pushState(null, '', `#${headingId}`);

            if (DEBUG_TOC) {
              console.warn(`TableOfContents: Successfully scrolled to "${headingId}"`);
            }
          } catch (scrollError) {
            console.error('TableOfContents: Error during scroll:', scrollError);
            setNavigationError('Scroll failed');
            setTimeout(() => setNavigationError(null), 3000);

            // Fallback: update the hash directly
            try {
              window.location.hash = headingId;
            } catch (hashError) {
              console.error('TableOfContents: Hash update failed:', hashError);
            }
          }
        } else {
          console.error('TableOfContents: Heading element not found after retries:', {
            headingId,
            attempts: maxAttempts,
            availableHeadings: computedHeadings.map((h) => h.id),
          });
          setNavigationError('Section not found');
          setTimeout(() => setNavigationError(null), 3000);
        }
      };

      // Start the scroll attempt process
      tryScroll();
    },
    [computedHeadings]
  );

  const renderTableOfContentsItem = useCallback(
    (item: TableOfContentsItem, level: number = 0) => {
      const isActive = currentActiveId === item.id;
      const marginLeft = `${level * 16}px`;

      // Generate a safe test ID for debugging
      const testId = `toc-link-${item.id.replace(/[^a-zA-Z0-9]/g, '-')}`;

      // Get level-specific styling
      const getLevelStyles = (level: number) => {
        switch (level) {
          case 0:
            return 'font-semibold text-sm';
          case 1:
            return 'text-sm text-muted-foreground';
          case 2:
            return 'text-xs text-muted-foreground/80';
          default:
            return 'text-xs text-muted-foreground/60';
        }
      };

      const levelStyles = getLevelStyles(level);

      return (
        <li key={item.id} className='my-1'>
          <a
            href={`#${item.id}`}
            data-testid={testId}
            className={`block py-1.5 px-2 rounded-md transition-all duration-200 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group ${levelStyles} ${
              isActive
                ? 'bg-primary/15 text-primary font-medium border-l-3 border-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:translate-x-0.5'
            }`}
            style={{ marginLeft }}
            onClick={handleHeadingClick(item.id)}
            aria-label={`Navigate to section: ${item.text}`}
            aria-current={isActive ? 'location' : undefined}
            title={`Go to: ${item.text}`}
          >
            <span className='truncate flex items-center justify-between'>
              <span className='flex items-center flex-1 min-w-0'>
                {isActive && (
                  <span className='w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0 animate-pulse' />
                )}
                {!isActive && (
                  <span className='w-1.5 h-1.5 bg-muted-foreground/30 rounded-full mr-2 flex-shrink-0 group-hover:bg-muted-foreground/50 transition-colors' />
                )}
                <span className='truncate'>{item.text}</span>
              </span>
              {/* Add heading level indicator */}
              <span className='text-xs text-muted-foreground/50 ml-2 flex-shrink-0'>
                H{item.level}
              </span>
            </span>
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

  // Mobile floating button
  const MobileFloatingButton = () => (
    <Button
      onClick={toggleMobileMenu}
      className='lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90'
      aria-label='Toggle table of contents'
    >
      {isMobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
      <Badge
        variant='secondary'
        className='absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center'
      >
        {filteredHeadings.length}
      </Badge>
    </Button>
  );

  // Mobile overlay panel
  const MobilePanel = () =>
    isMobileMenuOpen && (
      <>
        {/* Overlay */}
        <div
          className='lg:hidden fixed inset-0 bg-black/50 z-40'
          onClick={toggleMobileMenu}
          aria-hidden='true'
        />

        {/* Mobile TOC Panel */}
        <div className='lg:hidden fixed inset-y-0 right-0 w-80 max-w-full bg-background shadow-xl z-50 transform transition-transform duration-300 ease-in-out'>
          <Card className='h-full rounded-none border-0 shadow-none'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4 border-b'>
              <CardTitle className='text-lg font-semibold'>Table of Contents</CardTitle>
              <Button variant='ghost' size='sm' onClick={toggleMobileMenu} className='h-8 w-8 p-0'>
                <X className='h-4 w-4' />
              </Button>
            </CardHeader>
            <CardContent className='pt-4 pb-6 h-full overflow-hidden flex flex-col'>
              {/* Search */}
              <div className='mb-4 relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search sections...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-9'
                />
              </div>

              {/* Reading Progress */}
              <div className='mb-4'>
                <div className='flex justify-between text-xs text-muted-foreground mb-1'>
                  <span>Reading Progress</span>
                  <span>{Math.round(readingProgress)}%</span>
                </div>
                <div className='w-full bg-muted rounded-full h-2'>
                  <div
                    className='bg-primary h-2 rounded-full transition-all duration-300 ease-out'
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
              </div>

              {/* TOC Content */}
              <div className='flex-1 overflow-y-auto'>
                {navigationError && (
                  <div className='mb-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive'>
                    {navigationError}
                  </div>
                )}

                <nav aria-label='Table of Contents' role='navigation' className='space-y-1'>
                  <ul className='space-y-1' role='list'>
                    {filteredHeadings.length > 0 ? (
                      filteredHeadings.map((heading) => renderTableOfContentsItem(heading))
                    ) : (
                      <div className='text-center text-muted-foreground py-8'>
                        <Search className='h-8 w-8 mx-auto mb-2 opacity-50' />
                        <p className='text-sm'>No sections found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </ul>
                </nav>
              </div>

              {/* Debug info in development */}
              {DEBUG_TOC && (
                <div className='mt-4 p-2 bg-muted/50 border rounded text-xs text-muted-foreground'>
                  <div>Active: {currentActiveId || 'none'}</div>
                  <div>Total: {computedHeadings.length}</div>
                  <div>Filtered: {filteredHeadings.length}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );

  // Scroll to top button
  const ScrollTopButton = () =>
    showScrollTop && (
      <Button
        onClick={scrollToTop}
        className='fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 lg:hidden'
        aria-label='Scroll to top'
        size='sm'
      >
        <ChevronUp className='w-5 h-5' />
      </Button>
    );

  // Show loading state on server-side
  if (!isClient) {
    return (
      <>
        <Card className='hidden lg:block sticky top-24 w-full max-w-xs opacity-50'>
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
        <MobileFloatingButton />
      </>
    );
  }

  if (computedHeadings.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop TOC */}
      <Card className='hidden lg:block sticky top-24 w-full max-w-xs shadow-sm border'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-lg flex items-center justify-between'>
            <span>Table of Contents</span>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='text-xs font-normal'>
                {computedHeadings.length} {computedHeadings.length === 1 ? 'section' : 'sections'}
              </Badge>
              {DEBUG_TOC && (
                <Badge variant='outline' className='text-xs'>
                  Debug
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-0 max-h-[60vh] overflow-y-auto'>
          {/* Search */}
          <div className='mb-3 relative'>
            <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-8 h-8 text-sm'
            />
          </div>

          {/* Reading Progress */}
          <div className='mb-4'>
            <div className='flex justify-between text-xs text-muted-foreground mb-1'>
              <span>Progress</span>
              <span>{Math.round(readingProgress)}%</span>
            </div>
            <div className='w-full bg-muted rounded-full h-1.5'>
              <div
                className='bg-primary h-1.5 rounded-full transition-all duration-300 ease-out'
                style={{ width: `${readingProgress}%` }}
              />
            </div>
          </div>

          {/* Error display */}
          {navigationError && (
            <div className='mb-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive'>
              {navigationError}
            </div>
          )}

          {/* Debug info in development */}
          {DEBUG_TOC && (
            <div className='mb-3 p-2 bg-muted/50 border rounded text-xs text-muted-foreground'>
              <div>Active: {currentActiveId || 'none'}</div>
              <div>Total: {computedHeadings.length}</div>
              <div>Filtered: {filteredHeadings.length}</div>
            </div>
          )}

          <nav aria-label='Table of Contents' role='navigation' className='space-y-1'>
            <ul className='space-y-1' role='list'>
              {filteredHeadings.length > 0 ? (
                filteredHeadings.map((heading) => renderTableOfContentsItem(heading))
              ) : (
                <div className='text-center text-muted-foreground py-6'>
                  <Search className='h-6 w-6 mx-auto mb-2 opacity-50' />
                  <p className='text-sm'>No sections found matching "{searchQuery}"</p>
                </div>
              )}
            </ul>
          </nav>
        </CardContent>
      </Card>

      {/* Mobile Components */}
      <MobileFloatingButton />
      <MobilePanel />
      <ScrollTopButton />
    </>
  );
}
