# CueTimer Blog Post Page Enhancement Sequential Execution Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Enhance CueTimer's individual blog post pages by adapting QuoteKit's
advanced patterns (Table of Contents, breadcrumbs, enhanced navigation) while
maintaining CueTimer's brand identity and event industry focus.

**Architecture:** Direct component migration from QuoteKit's proven blog post
patterns with CueTimer-first visual design, advanced TOC with scroll tracking,
and enhanced user experience features.

**Tech Stack:** Next.js 15+, React 18+, TypeScript, Tailwind CSS, shadcn/ui,
Lucide React, Framer Motion

---

## Implementation Overview

This plan enhances CueTimer's existing blog post pages with QuoteKit's advanced
features:

**Key Enhancements:**

- Advanced Table of Contents with scroll tracking and hierarchical structure
- Enhanced breadcrumb navigation with category filtering
- Improved blog post header with better visual hierarchy
- Enhanced post navigation with better UX
- Reading progress indicators
- Mobile-optimized sidebar TOC
- Improved structured data and SEO

**Specialist Agent Allocation:**

- **ui-ux-motion-specialist:** Table of Contents and user experience
  enhancements
- **frontend-specialist:** Component architecture and Next.js implementation
- **test-writer-agent:** Testing implementation and coverage
- **code-reviewer-agent:** Code quality and standards compliance
- **orchestrator-agent:** Final integration and documentation

---

## Phase 1: Advanced Table of Contents Implementation (Tasks 1-3)

### Task 1: Table of Contents Core Component

**Specialist Agent:** `ui-ux-motion-specialist` (advanced UX and scroll
tracking) **Files:**

- Create:
  `app/[locale]/(marketing)/blog/[slug]/components/table-of-contents.tsx`
- Create: `app/[locale]/(marketing)/blog/[slug]/hooks/use-heading-extraction.ts`
- Create: `app/[locale]/(marketing)/blog/[slug]/hooks/use-scroll-tracking.ts`

**Step 1: Create heading extraction hook**

```typescript
// hooks/use-heading-extraction.ts
export function useHeadingExtraction() {
  const [headings, setHeadings] = useState<TOCHeading[]>([]);

  useEffect(() => {
    const extractHeadings = () => {
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const extractedHeadings: TOCHeading[] = [];

      elements.forEach((element) => {
        const level = parseInt(element.tagName.charAt(1));
        let id = element.id;

        // Generate ID if missing
        if (!id) {
          id =
            element.textContent
              ?.toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .trim() || '';
          element.id = id;
        }

        if (element.textContent && id) {
          extractedHeadings.push({
            id,
            text: element.textContent,
            level,
          });
        }
      });

      setHeadings(extractedHeadings);
    };

    extractHeadings();
    // Re-extract on content changes
    const observer = new MutationObserver(extractHeadings);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return headings;
}
```

**Step 2: Create scroll tracking hook**

```typescript
// hooks/use-scroll-tracking.ts
export function useScrollTracking(headings: TOCHeading[]) {
  const [activeId, setActiveId] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Offset for sticky header

      // Find current active heading
      let currentActiveId = '';
      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          currentActiveId = headings[i].id;
          break;
        }
      }

      setActiveId(currentActiveId);

      // Calculate reading progress
      const articleElement = document.querySelector('article');
      if (articleElement) {
        const articleTop = articleElement.offsetTop;
        const articleHeight = articleElement.offsetHeight;
        const windowHeight = window.innerHeight;
        const readProgress = Math.min(
          Math.max(
            ((scrollPosition - articleTop) / (articleHeight - windowHeight)) *
              100,
            0
          ),
          100
        );
        setProgress(readProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  return { activeId, progress };
}
```

**Step 3: Create Table of Contents component**

```typescript
// components/table-of-contents.tsx
interface TableOfContentsProps {
  headings: TOCHeading[];
  enableScrollTracking?: boolean;
  className?: string;
}

export function TableOfContents({
  headings,
  enableScrollTracking = true,
  className = ""
}: TableOfContentsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const { activeId, progress } = useScrollTracking(headings);

  // Group headings hierarchically
  const groupedHeadings = useMemo(() => {
    const groups: Array<{
      id: string;
      text: string;
      level: number;
      children: TOCHeading[];
    }> = [];

    let currentGroup: typeof groups[0] | null = null;

    headings.forEach(heading => {
      if (heading.level === 2) {
        currentGroup = {
          id: heading.id,
          text: heading.text,
          level: heading.level,
          children: []
        };
        groups.push(currentGroup);
      } else if (heading.level > 2 && currentGroup) {
        currentGroup.children.push(heading);
      }
    });

    return groups;
  }, [headings]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.offsetTop - headerOffset;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Apply CueTimer brand colors
  const tocColors = {
    active: '#FF6B35',      // Spotlight Orange
    hover: '#FFD23F',      // Timing Yellow
    text: '#2D3748',       // Professional Gray
    background: '#FFFFFF',  // White
  };

  return (
    <Card className={`bg-white border-gray-200 shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-orange-600">
          Table of Contents
        </CardTitle>

        {/* Reading progress */}
        {enableScrollTracking && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Reading Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <nav className="space-y-2">
          {groupedHeadings.map((group) => {
            const isActive = enableScrollTracking && activeId === group.id;
            const hasActiveChild = enableScrollTracking && group.children.some(child => child.id === activeId);
            const shouldHighlight = isActive || hasActiveChild;

            return (
              <div key={group.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Main heading */}
                <button
                  onClick={() => scrollToSection(group.id)}
                  className={`
                    w-full text-left p-3 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset
                    ${shouldHighlight
                      ? 'bg-orange-50 text-orange-600 border-l-4 border-l-orange-500'
                      : 'hover:bg-gray-50 text-gray-700 border-l-4 border-l-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div className={`
                      w-2 h-2 rounded-full transition-colors
                      ${shouldHighlight ? 'bg-orange-500' : 'bg-gray-400'}
                    `} />
                    <span className="font-medium">{group.text}</span>
                    {group.children.length > 0 && (
                      <span className="text-xs text-gray-500 ml-auto">
                        {group.children.length}
                      </span>
                    )}
                  </div>
                </button>

                {/* Subheadings */}
                {group.children.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-200">
                    {group.children.map((child) => {
                      const isChildActive = enableScrollTracking && activeId === child.id;

                      return (
                        <button
                          key={child.id}
                          onClick={() => scrollToSection(child.id)}
                          className={`
                            w-full text-left p-2 pl-6 transition-all duration-200
                            border-l-2 border-l-transparent
                            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset
                            ${isChildActive
                              ? 'border-l-orange-500 bg-orange-50 text-orange-600'
                              : 'hover:border-l-orange-300 hover:bg-gray-100 text-gray-600'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`
                              w-1.5 h-1.5 rounded-full
                              ${isChildActive ? 'bg-orange-500' : 'bg-gray-400'}
                            `} />
                            <span className="text-sm">{child.text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}
```

**Step 4: Test TOC functionality**

- Test heading extraction on various content structures
- Test scroll tracking accuracy
- Test mobile responsiveness
- Verify smooth scrolling behavior

**Step 5: Commit TOC implementation**

```bash
git add app/[locale]/(marketing)/blog/[slug]/components/table-of-contents.tsx
git add app/[locale]/(marketing)/blog/[slug]/hooks/
git commit -m "feat: implement advanced Table of Contents with scroll tracking and CueTimer branding"
```

### Task 2: Enhanced Blog Post Header

**Specialist Agent:** `frontend-specialist` (component enhancement and shadcn/ui
integration) **Files:**

- Modify: `app/[locale]/(marketing)/blog/[slug]/page.tsx`
- Create: `app/[locale]/(marketing)/blog/[slug]/components/blog-post-header.tsx`

**Step 1: Create enhanced BlogPostHeader component**

```typescript
// components/blog-post-header.tsx
interface BlogPostHeaderProps {
  post: BlogPost;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'event-management':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'timer-tips':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'app-features':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'industry-insights':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog Link */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>

          {/* Category and Featured Badges */}
          <div className="flex items-center gap-3 mb-6">
            <Badge
              variant="outline"
              className={getCategoryColor(post.category)}
            >
              {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            {post.featured && (
              <Badge variant="default" className="bg-yellow-500 text-white">
                Featured
              </Badge>
            )}
            {post.draft && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                Draft
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Summary */}
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {post.summary}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{post.wordCount} words</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Featured Image */}
          {post.image && (
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Integrate enhanced header into blog post page**

- Replace existing header implementation
- Ensure proper responsive design
- Test with different post types (featured, draft, regular)

**Step 3: Test header functionality**

- Test responsive behavior on mobile devices
- Verify accessibility with screen readers
- Check image loading and optimization
- Test badge rendering with different categories

**Step 4: Commit header enhancement**

```bash
git add app/[locale]/(marketing)/blog/[slug]/components/blog-post-header.tsx
git add app/[locale]/(marketing)/blog/[slug]/page.tsx
git commit -m "feat: enhance blog post header with improved visual hierarchy and CueTimer branding"
```

### Task 3: Mobile-Optimized TOC Layout

**Specialist Agent:** `ui-ux-motion-specialist` (mobile UX and responsive
design) **Files:**

- Modify:
  `app/[locale]/(marketing)/blog/[slug]/components/table-of-contents.tsx`
- Create:
  `app/[locale]/(marketing)/blog/[slug]/components/mobile-toc-toggle.tsx`

**Step 1: Create mobile TOC toggle component**

```typescript
// components/mobile-toc-toggle.tsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileTocToggleProps {
  children: React.ReactNode;
  headingsCount: number;
}

export function MobileTocToggle({ children, headingsCount }: MobileTocToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (headingsCount === 0) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg w-14 h-14 p-0"
          aria-label="Toggle table of contents"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile TOC Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Table of Contents</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

**Step 2: Update Table of Contents for mobile optimization**

```typescript
// Enhanced TOC with mobile support
export function TableOfContents({
  headings,
  enableScrollTracking = true,
  className = ""
}: TableOfContentsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { activeId, progress } = useScrollTracking(headings);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Rest of the TOC component with mobile optimizations
  const tocContent = (
    <Card className={`${isMobile ? 'border-none shadow-none' : 'bg-white border-gray-200 shadow-lg'} ${className}`}>
      {/* ... existing TOC content ... */}
    </Card>
  );

  if (isMobile) {
    return (
      <MobileTocToggle headingsCount={headings.length}>
        {tocContent}
      </MobileTocToggle>
    );
  }

  return tocContent;
}
```

**Step 3: Test mobile TOC functionality**

- Test toggle behavior on mobile devices
- Verify overlay positioning and animations
- Test touch interactions and accessibility
- Check performance on mobile networks

**Step 4: Commit mobile TOC optimization**

```bash
git add app/[locale]/(marketing)/blog/[slug]/components/mobile-toc-toggle.tsx
git add app/[locale]/(marketing)/blog/[slug]/components/table-of-contents.tsx
git commit -m "feat: add mobile-optimized Table of Contents with floating toggle and overlay"
```

---

## Phase 2: Enhanced Navigation and UX (Tasks 4-6)

### Task 4: Enhanced Breadcrumb Navigation

**Specialist Agent:** `frontend-specialist` (navigation and shadcn/ui
components) **Files:**

- Create: `app/[locale]/(marketing)/blog/[slug]/components/blog-breadcrumb.tsx`
- Modify: `app/[locale]/(marketing)/blog/[slug]/page.tsx`

**Step 1: Create enhanced breadcrumb component**

```typescript
// components/blog-breadcrumb.tsx
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface BlogBreadcrumbProps {
  post?: {
    title: string;
    category: string;
    slug: string;
  };
  className?: string;
}

export function BlogBreadcrumb({ post, className = "" }: BlogBreadcrumbProps) {
  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Blog', href: '/blog' }
  ];

  if (post) {
    // Add category with filtering
    breadcrumbItems.push({
      label: post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      href: `/blog?category=${encodeURIComponent(post.category)}`
    });

    // Current post (no link)
    breadcrumbItems.push({
      label: post.title,
      href: ''
    });
  }

  return (
    <div className={`bg-gray-50 border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href}
                        className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors"
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-gray-900 font-medium">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </BreadcrumbSeparator>
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
```

**Step 2: Integrate breadcrumbs into blog post page**

- Add breadcrumb component above header
- Ensure proper structured data for SEO
- Test category filtering links

**Step 3: Test breadcrumb functionality**

- Test navigation links work correctly
- Verify category filtering integration
- Check accessibility with screen readers
- Test responsive behavior

**Step 4: Commit breadcrumb implementation**

```bash
git add app/[locale]/(marketing)/blog/[slug]/components/blog-breadcrumb.tsx
git add app/[locale]/(marketing)/blog/[slug]/page.tsx
git commit -m "feat: add enhanced breadcrumb navigation with category filtering"
```

### Task 5: Enhanced Blog Post Navigation

**Specialist Agent:** `frontend-specialist` (navigation enhancement and UX)
**Files:**

- Modify: `components/blog/BlogPostNavigation.tsx`
- Create:
  `app/[locale]/(marketing)/blog/[slug]/components/enhanced-post-navigation.tsx`

**Step 1: Create enhanced post navigation component**

```typescript
// components/enhanced-post-navigation.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EnhancedPostNavigationProps {
  previousPost?: {
    title: string;
    slug: string;
    category: string;
    summary?: string;
  };
  nextPost?: {
    title: string;
    slug: string;
    category: string;
    summary?: string;
  };
}

export function EnhancedPostNavigation({ previousPost, nextPost }: EnhancedPostNavigationProps) {
  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Continue Reading
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Previous Post */}
            {previousPost && (
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="mb-3"
                      >
                        <Link href={`/blog/${previousPost.slug}`}>
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Link>
                      </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-orange-600 font-medium mb-2">
                        {previousPost.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2 line-clamp-2">
                        {previousPost.title}
                      </h3>
                      {previousPost.summary && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {previousPost.summary}
                        </p>
                      )}
                      <Link
                        href={`/blog/${previousPost.slug}`}
                        className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium mt-3"
                      >
                        Read more
                        <ChevronLeft className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Post */}
            {nextPost && (
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0 text-right">
                      <div className="text-sm text-orange-600 font-medium mb-2">
                        {nextPost.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2 line-clamp-2">
                        {nextPost.title}
                      </h3>
                      {nextPost.summary && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {nextPost.summary}
                        </p>
                      )}
                      <Link
                        href={`/blog/${nextPost.slug}`}
                        className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium mt-3"
                      >
                        Read more
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="mb-3"
                      >
                        <Link href={`/blog/${nextPost.slug}`}>
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Update blog post navigation data**

- Enhance navigation data fetching to include summaries
- Update navigation logic to pass enhanced data
- Test navigation with various post scenarios

**Step 3: Test enhanced navigation**

- Test previous/next navigation functionality
- Verify responsive design on mobile devices
- Test keyboard navigation accessibility
- Check hover states and transitions

**Step 4: Commit enhanced navigation**

```bash
git add app/[locale]/(marketing)/blog/[slug]/components/enhanced-post-navigation.tsx
git add components/blog/BlogPostNavigation.tsx
git commit -m "feat: enhance blog post navigation with improved UX and category context"
```

### Task 6: Reading Progress and Engagement Features

**Specialist Agent:** `ui-ux-motion-specialist` (user engagement and
micro-interactions) **Files:**

- Create:
  `app/[locale]/(marketing)/blog/[slug]/components/reading-progress-bar.tsx`
- Create:
  `app/[locale]/(marketing)/blog/[slug]/components/social-share-buttons.tsx`

**Step 1: Create reading progress bar component**

```typescript
// components/reading-progress-bar.tsx
import { useEffect, useState } from 'react';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const articleElement = document.querySelector('article');
      if (!articleElement) return;

      const articleTop = articleElement.offsetTop;
      const articleHeight = articleElement.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      const articleProgress = Math.min(
        Math.max((scrollPosition - articleTop + windowHeight) / (articleHeight) * 100, 0),
        100
      );

      setProgress(articleProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial progress

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-orange-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
```

**Step 2: Create enhanced social share buttons**

```typescript
// components/social-share-buttons.tsx
import { Facebook, Linkedin, Twitter, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SocialShareButtonsProps {
  title: string;
  summary: string;
  slug: string;
}

export function SocialShareButtons({ title, summary, slug }: SocialShareButtonsProps) {
  const url = `https://cuetimer.com/blog/${slug}`;

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-50 hover:text-blue-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-50 hover:text-blue-700'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-50 hover:text-blue-800'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Share this article
        </h3>
        <div className="flex flex-wrap gap-3">
          {shareLinks.map((social) => (
            <Button
              key={social.name}
              variant="outline"
              size="sm"
              asChild
              className={`flex items-center gap-2 ${social.color}`}
            >
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <social.icon className="w-4 h-4" />
                {social.name}
              </a>
            </Button>
          ))}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Copy Link
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-sm text-gray-600">
                Link copied to clipboard!
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 3: Integrate progress bar and social sharing into blog post page**

- Add reading progress bar to the top of the page
- Integrate social share buttons after article content
- Test interactions and animations

**Step 4: Test engagement features**

- Test reading progress accuracy
- Test social share functionality
- Verify responsive behavior
- Check accessibility compliance

**Step 5: Commit engagement features**

```bash
git add app/[locale]/(marketing)/blog/[slug]/components/reading-progress-bar.tsx
git add app/[locale]/(marketing)/blog/[slug]/components/social-share-buttons.tsx
git add app/[locale]/(marketing)/blog/[slug]/page.tsx
git commit -m "feat: add reading progress bar and enhanced social sharing functionality"
```

---

## Phase 3: Integration and Testing (Tasks 7-9)

### Task 7: Complete Blog Post Page Integration

**Specialist Agent:** `orchestrator-agent` (complex integration and
coordination) **Files:**

- Modify: `app/[locale]/(marketing)/blog/[slug]/page.tsx`
- Update: `components/blog/RelatedPosts.tsx` (enhance with CueTimer branding)
- Test: `app/[locale]/(marketing)/blog/[slug]/__tests__/blog-post-page.test.tsx`

**Step 1: Integrate all components into blog post page**

```typescript
// Updated blog post page structure
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [navigation, relatedPosts] = await Promise.all([
    getPostNavigation(slug),
    getRelatedPosts(post, 3),
  ]);

  return (
    <>
      <ReadingProgressBar />

      <div className="min-h-screen bg-white">
        <BlogBreadcrumb post={{
          title: post.title,
          category: post.category,
          slug: post.slug
        }} />

        <BlogPostHeader post={post} />

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <article className="flex-1 min-w-0">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
                <BlogPostContent content={post.content} />
              </div>

              <SocialShareButtons
                title={post.title}
                summary={post.summary}
                slug={post.slug}
              />
            </article>

            {/* Table of Contents Sidebar */}
            <aside className="hidden lg:block lg:w-80 flex-shrink-0">
              <div className="sticky top-8">
                <TableOfContents
                  headings={extractHeadingsFromContent(post.content || '')}
                  enableScrollTracking={true}
                />
              </div>
            </aside>
          </div>
        </div>

        <EnhancedPostNavigation
          previousPost={navigation.previous}
          nextPost={navigation.next}
        />

        <RelatedPosts posts={relatedPosts} />
      </div>
    </>
  );
}
```

**Step 2: Enhance RelatedPosts component with CueTimer branding**

- Update RelatedPosts to use CueTimer colors
- Improve responsive design
- Add hover animations

**Step 3: Test complete integration**

- Test all components work together seamlessly
- Verify responsive behavior across all breakpoints
- Test navigation flow between pages
- Check accessibility compliance

**Step 4: Commit complete integration**

```bash
git add app/[locale]/(marketing)/blog/[slug]/page.tsx
git add components/blog/RelatedPosts.tsx
git add app/[locale]/(marketing)/blog/[slug]/__tests__/
git commit -m "feat: complete blog post page integration with all enhanced components"
```

### Task 8: Comprehensive Testing Suite

**Specialist Agent:** `test-writer-agent` (testing implementation and coverage)
**Files:**

- Create: `app/[locale]/(marketing)/blog/[slug]/__tests__/components/`
- Create: `app/[locale]/(marketing)/blog/[slug]/__tests__/integration/`
- Create: `app/[locale]/(marketing)/blog/[slug]/__tests__/hooks/`

**Step 1: Write component unit tests**

```typescript
// __tests__/components/table-of-contents.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TableOfContents } from '../components/table-of-contents';

describe('TableOfContents', () => {
  const mockHeadings = [
    { id: 'heading-1', text: 'First Heading', level: 2 },
    { id: 'heading-2', text: 'Second Heading', level: 2 },
    { id: 'subheading-1', text: 'Subheading', level: 3 }
  ];

  test('renders headings correctly', () => {
    render(<TableOfContents headings={mockHeadings} />);
    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    expect(screen.getByText('First Heading')).toBeInTheDocument();
    expect(screen.getByText('Second Heading')).toBeInTheDocument();
  });

  test('handles click events', () => {
    const mockScrollTo = jest.fn();
    window.scrollTo = mockScrollTo;

    render(<TableOfContents headings={mockHeadings} />);

    const firstHeading = screen.getByText('First Heading');
    fireEvent.click(firstHeading);

    expect(mockScrollTo).toHaveBeenCalled();
  });
});
```

**Step 2: Write integration tests**

```typescript
// __tests__/integration/blog-post-page.test.tsx
import { render, screen } from '@testing-library/react';
import BlogPostPage from '../page';

// Mock the blog data
jest.mock('@/lib/blog', () => ({
  getPostBySlug: jest.fn(),
  getPostNavigation: jest.fn(),
  getRelatedPosts: jest.fn(),
}));

describe('Blog Post Page Integration', () => {
  test('renders complete blog post page', async () => {
    const mockPost = {
      title: 'Test Post',
      content: '<h2>Test Heading</h2><p>Test content</p>',
      author: 'Test Author',
      publishedAt: '2024-01-01',
      category: 'event-management',
      summary: 'Test summary',
      readTime: 5,
      wordCount: 500,
    };

    // Mock the data fetching
    (getPostBySlug as jest.Mock).mockResolvedValue(mockPost);
    (getPostNavigation as jest.Mock).mockResolvedValue({
      previous: null,
      next: null,
    });
    (getRelatedPosts as jest.Mock).mockResolvedValue([]);

    render(
      await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) })
    );

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test summary')).toBeInTheDocument();
    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
  });
});
```

**Step 3: Write hook tests**

```typescript
// __tests__/hooks/use-scroll-tracking.test.ts
import { renderHook } from '@testing-library/react';
import { useScrollTracking } from '../hooks/use-scroll-tracking';

describe('useScrollTracking', () => {
  test('tracks active heading correctly', () => {
    const mockHeadings = [
      { id: 'heading-1', text: 'First Heading', level: 2 },
      { id: 'heading-2', text: 'Second Heading', level: 2 },
    ];

    const { result } = renderHook(() => useScrollTracking(mockHeadings));

    expect(result.current.activeId).toBeDefined();
    expect(result.current.progress).toBeDefined();
  });
});
```

**Step 4: Achieve comprehensive test coverage**

- Ensure > 90% code coverage
- Test all user interaction paths
- Cover error states and edge cases
- Test accessibility features

**Step 5: Commit testing suite**

```bash
git add app/[locale]/(marketing)/blog/[slug]/__tests__/
git commit -m "test: implement comprehensive testing suite for enhanced blog post pages"
```

### Task 9: Performance Optimization and Final Polish

**Specialist Agent:** `performance-optimizer:performance-engineer` (performance
optimization) **Files:**

- Optimize: All blog post page components
- Analyze: Bundle size and loading performance
- Implement: Image optimization and lazy loading

**Step 1: Optimize component rendering performance**

```typescript
// Add memoization where needed
export const TableOfContents = React.memo(function TableOfContents({
  headings,
  enableScrollTracking = true,
  className = '',
}: TableOfContentsProps) {
  // Component implementation
});

// Optimize scroll tracking with throttling
export function useScrollTracking(headings: TOCHeading[]) {
  const [activeId, setActiveId] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll tracking logic
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  return { activeId, progress };
}
```

**Step 2: Optimize images and assets**

- Ensure all images use Next.js Image optimization
- Implement lazy loading for below-fold content
- Optimize image formats and sizes

**Step 3: Bundle size optimization**

- Analyze bundle size impact of new components
- Implement dynamic imports where appropriate
- Remove unused dependencies

**Step 4: Performance testing**

- Run Lighthouse performance audits
- Test Core Web Vitals metrics
- Verify mobile performance
- Check loading speed on slow connections

**Step 5: Final code review and polish**

- Review all components for consistency
- Ensure proper error handling
- Add missing accessibility features
- Polish animations and transitions

**Step 6: Commit performance optimizations**

```bash
git add .
git commit -m "perf: optimize blog post page performance and polish user experience"
```

---

## Success Criteria

### Functional Requirements

- [ ] Advanced Table of Contents with hierarchical structure and scroll tracking
- [ ] Mobile-optimized TOC with floating toggle and overlay
- [ ] Enhanced breadcrumb navigation with category filtering
- [ ] Improved blog post header with better visual hierarchy
- [ ] Enhanced post navigation with category context
- [ ] Reading progress bar and social sharing functionality
- [ ] Responsive design works across all breakpoints
- [ ] All interactive elements are accessible via keyboard

### Performance Requirements

- [ ] Page load time < 2.5 seconds on mobile
- [ ] TOC scroll tracking responds within 16ms (60fps)
- [ ] Smooth animations maintain 60fps
- [ ] Core Web Vitals all green
- [ ] Bundle size increase < 150KB

### Quality Requirements

- [ ] 90%+ test coverage for new components
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] WCAG AA accessibility compliance
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### Design Requirements

- [ ] CueTimer brand colors applied consistently throughout
- [ ] Typography follows design system guidelines
- [ ] Smooth animations and micro-interactions
- [ ] Professional appearance that matches brand identity
- [ ] Mobile-first responsive design with excellent UX

---

## Testing Strategy by Specialist Agent

### ui-ux-motion-specialist Focus Areas

- Table of Contents user experience and scroll tracking
- Mobile-optimized interactions and animations
- Reading progress indicators and engagement features
- Accessibility and inclusive design implementation

### frontend-specialist Focus Areas

- Component architecture and TypeScript implementation
- shadcn/ui integration and customization
- Next.js optimization and server-side rendering
- Responsive design and mobile optimization

### test-writer-agent Focus Areas

- Comprehensive test coverage for all new components
- Integration testing for user workflows
- Performance testing and optimization validation
- Accessibility testing and validation

### code-reviewer-agent Focus Areas

- Code quality and standards compliance
- TypeScript type safety and best practices
- Security considerations and data handling
- Performance optimization and efficiency

### orchestrator-agent Focus Areas

- Cross-component coordination and data flow
- Final integration and production readiness
- Documentation completeness and clarity
- Quality assurance and validation

---

**Document Ownership:** Development Team **Execution Order:** Sequential tasks
1-9 **Timeline Estimate:** 2-3 weeks **Review Points:** After each phase (3,
6, 9) **Final Approval:** Product Owner review after task 9
