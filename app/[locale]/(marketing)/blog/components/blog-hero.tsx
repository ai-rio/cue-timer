/**
 * BlogHero Component
 *
 * A professional hero section for the CueTimer blog that showcases brand identity,
 * provides navigation to key content, and includes search functionality.
 *
 * Features:
 * - Responsive design with mobile-first approach
 * - CueTimer brand colors and typography
 * - Search integration with autocomplete suggestions
 * - Call-to-action buttons for key actions
 * - Accessibility compliance with ARIA labels
 * - Smooth animations and micro-interactions
 * - Background decorations and patterns
 */

import { ArrowRight, BookOpen, Clock, Search, Sparkles, Users } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Import blog design system
import {
  BLOG_ACCESSIBILITY,
  BLOG_COLORS,
  BLOG_TYPOGRAPHY,
  type BlogButtonSize,
  type BlogButtonVariant,
} from './styles/blog-styles';

// ===== TYPE DEFINITIONS =====

export interface BlogHeroProps {
  /** Main headline for the blog */
  headline: string;
  /** Subtitle or description text */
  subtitle?: string;
  /** Call-to-action buttons */
  actions?: BlogHeroAction[];
  /** Search configuration */
  search?: BlogHeroSearchConfig;
  /** Background decoration type */
  backgroundVariant?: 'gradient' | 'pattern' | 'minimal';
  /** Featured categories to highlight */
  featuredCategories?: FeaturedCategory[];
  /** Additional CSS class names */
  className?: string;
  /** Custom styles for specific elements */
  customStyles?: {
    headline?: string;
    subtitle?: string;
    actions?: string;
  };
}

export interface BlogHeroAction {
  /** Button text */
  label: string;
  /** Button URL or navigation target */
  href: string;
  /** Button variant */
  variant?: BlogButtonVariant;
  /** Button size */
  size?: BlogButtonSize;
  /** Optional icon component */
  icon?: React.ReactNode;
  /** Whether this is the primary action */
  primary?: boolean;
  /** onClick handler for client-side navigation */
  onClick?: () => void;
}

export interface BlogHeroSearchConfig {
  /** Search placeholder text */
  placeholder?: string;
  /** Popular search suggestions */
  suggestions?: string[];
  /** Search submit handler */
  onSearch: (query: string) => void;
  /** Search input change handler */
  onInputChange?: (query: string) => void;
  /** Whether to show search suggestions */
  showSuggestions?: boolean;
}

export interface FeaturedCategory {
  /** Category name */
  name: string;
  /** Category URL */
  href: string;
  /** Category icon */
  icon?: React.ReactNode;
  /** Number of posts in category */
  postCount?: number;
  /** Category color theme */
  color?: 'spotlight' | 'timing' | 'success' | 'info';
}

// ===== HELPER COMPONENTS =====

interface SearchSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  isVisible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelect,
  isVisible,
}) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div
      className={cn(
        'absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50',
        'max-h-64 overflow-y-auto',
        'animate-fadeIn'
      )}
    >
      <div className='p-2'>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className={cn(
              'w-full text-left px-3 py-2 rounded-md text-sm',
              'hover:bg-spotlight-50 hover:text-spotlight-700',
              'focus:bg-spotlight-50 focus:text-spotlight-700 focus:outline-none',
              'transition-colors duration-200'
            )}
            onClick={() => onSelect(suggestion)}
            role='option'
          >
            <div className='flex items-center gap-2'>
              <Search className='h-4 w-4 text-gray-400' />
              <span>{suggestion}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

interface BackgroundDecorationProps {
  variant: 'gradient' | 'pattern' | 'minimal';
}

const BackgroundDecoration: React.FC<BackgroundDecorationProps> = ({ variant }) => {
  switch (variant) {
    case 'gradient':
      return (
        <>
          <div className='absolute inset-0 bg-gradient-to-br from-spotlight-50 via-white to-timing-50 opacity-70' />
          <div className='absolute top-0 left-0 w-96 h-96 bg-spotlight-200 rounded-full filter blur-3xl opacity-20 animate-pulse' />
          <div className='absolute bottom-0 right-0 w-96 h-96 bg-timing-200 rounded-full filter blur-3xl opacity-20 animate-pulse' />
        </>
      );

    case 'pattern':
      return (
        <>
          <div className='absolute inset-0 bg-gradient-to-br from-white to-gray-50' />
          <div
            className='absolute inset-0 opacity-5'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${BLOG_COLORS.spotlightOrange.slice(1)}' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </>
      );

    case 'minimal':
    default:
      return <div className='absolute inset-0 bg-gradient-to-b from-white to-gray-50/50' />;
  }
};

interface FeaturedCategoriesProps {
  categories: FeaturedCategory[];
}

const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ categories }) => {
  if (categories.length === 0) return null;

  return (
    <div className='flex flex-wrap gap-3 justify-center'>
      {categories.map((category, index) => (
        <a
          key={index}
          href={category.href}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
            'bg-white border border-gray-200 hover:border-spotlight-300',
            'hover:bg-spotlight-50 hover:text-spotlight-700 hover:shadow-md',
            'transition-all duration-300 hover:scale-105',
            BLOG_ACCESSIBILITY.focus.ring,
            BLOG_ACCESSIBILITY.focus.ringColors.primary
          )}
        >
          {category.icon && <span className='text-spotlight-600'>{category.icon}</span>}
          <span>{category.name}</span>
          {category.postCount && (
            <Badge variant='secondary' className='ml-1 text-xs'>
              {category.postCount}
            </Badge>
          )}
        </a>
      ))}
    </div>
  );
};

// ===== MAIN BLOG HERO COMPONENT =====

const BlogHero: React.FC<BlogHeroProps> = ({
  headline,
  subtitle,
  actions = [],
  search,
  backgroundVariant = 'gradient',
  featuredCategories = [],
  className,
  customStyles,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLFormElement>(null);

  // Handle search input changes
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      setShowSuggestions(query.length > 0 && isSearchFocused);
      search?.onInputChange?.(query);
    },
    [isSearchFocused, search]
  );

  // Handle search submission
  const handleSearchSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (searchQuery.trim()) {
        search?.onSearch(searchQuery.trim());
        setShowSuggestions(false);
      }
    },
    [searchQuery, search]
  );

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    (suggestion: string) => {
      setSearchQuery(suggestion);
      setShowSuggestions(false);
      search?.onSearch(suggestion);
    },
    [search]
  );

  // Handle search focus
  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  }, [searchQuery]);

  // Handle search blur
  const handleSearchBlur = useCallback((e: React.FocusEvent) => {
    setIsSearchFocused(false);
    // Delay hiding suggestions to allow click on suggestion
    setTimeout(() => {
      if (!searchContainerRef.current?.contains(e.relatedTarget)) {
        setShowSuggestions(false);
      }
    }, 150);
  }, []);

  // Handle keyboard navigation in suggestions
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      searchInputRef.current?.blur();
    }
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        'py-16 md:py-24 lg:py-32',
        'transition-all duration-300',
        className
      )}
      role='banner'
      aria-label='Blog hero section'
    >
      {/* Background Decoration */}
      <div className='absolute inset-0 -z-10'>
        <BackgroundDecoration variant={backgroundVariant} />
      </div>

      {/* Content Container */}
      <div className='relative z-10'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-4xl mx-auto'>
            {/* Badge */}
            <Badge
              className={cn(
                'mb-6 bg-spotlight-100 text-spotlight-700 border-spotlight-200',
                'hover:bg-spotlight-200 transition-colors duration-300',
                'text-sm font-medium px-4 py-2'
              )}
            >
              <Sparkles className='w-4 h-4 mr-2' />
              Professional Event Timing Insights
            </Badge>

            {/* Headline */}
            <h1
              className={cn(
                'font-bold text-professional-900 tracking-tight mb-6',
                'text-4xl sm:text-5xl lg:text-6xl',
                'animate-slideUp',
                customStyles?.headline
              )}
              style={{
                fontFamily: BLOG_TYPOGRAPHY.fontFamily.sans.join(', '),
                fontSize: BLOG_TYPOGRAPHY.fontSize.h1,
                lineHeight: BLOG_TYPOGRAPHY.lineHeight.tight,
              }}
            >
              {headline}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p
                className={cn(
                  'text-xl text-professional-600 leading-relaxed mb-8',
                  'max-w-3xl mx-auto',
                  'animate-slideUp animation-delay-200',
                  customStyles?.subtitle
                )}
                style={{
                  fontFamily: BLOG_TYPOGRAPHY.fontFamily.sans.join(', '),
                  fontSize: BLOG_TYPOGRAPHY.fontSize.body,
                  lineHeight: BLOG_TYPOGRAPHY.lineHeight.relaxed,
                }}
              >
                {subtitle}
              </p>
            )}

            {/* Search Section */}
            {search && (
              <div className='mb-12 animate-slideUp animation-delay-300'>
                <form
                  ref={searchContainerRef}
                  onSubmit={handleSearchSubmit}
                  className='relative max-w-2xl mx-auto'
                  role='search'
                  aria-label='Blog search'
                >
                  <div className='relative'>
                    <Search
                      className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5'
                      aria-hidden='true'
                    />
                    <Input
                      ref={searchInputRef}
                      type='search'
                      placeholder={
                        search.placeholder || 'Search articles, tutorials, and guides...'
                      }
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      onKeyDown={handleSearchKeyDown}
                      className={cn(
                        'h-14 pl-12 pr-14 text-lg',
                        'border-gray-300 focus:border-spotlight-500 focus:ring-2 focus:ring-spotlight-500/20',
                        'bg-white/90 backdrop-blur-sm',
                        'transition-all duration-300 hover:border-spotlight-400',
                        'placeholder:text-gray-500'
                      )}
                      aria-label='Search blog articles'
                      aria-describedby='search-description'
                      aria-expanded={showSuggestions}
                      aria-autocomplete='list'
                    />
                    <Button
                      type='submit'
                      size='default'
                      className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-spotlight-500 hover:bg-spotlight-600 text-white h-8 w-8 p-0'
                      aria-label='Submit search'
                    >
                      <ArrowRight className='h-4 w-4' />
                    </Button>
                  </div>

                  {/* Search Suggestions */}
                  {search.showSuggestions && search.suggestions && (
                    <SearchSuggestions
                      suggestions={search.suggestions.filter((suggestion) =>
                        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                      )}
                      onSelect={handleSuggestionSelect}
                      isVisible={showSuggestions}
                    />
                  )}
                </form>
                <p
                  id='search-description'
                  className='mt-2 text-sm text-gray-500'
                  aria-live='polite'
                >
                  Popular searches:{' '}
                  {search.suggestions?.slice(0, 3).join(', ') ||
                    'Event timing, speaker management, production tips'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {actions.length > 0 && (
              <div
                className={cn(
                  'flex flex-col sm:flex-row items-center justify-center gap-4 mb-12',
                  'animate-slideUp animation-delay-400',
                  customStyles?.actions
                )}
              >
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    asChild={!action.onClick}
                    onClick={action.onClick}
                    variant={action.primary ? 'default' : 'outline'}
                    size={
                      action.size === 'xl' || action.size === 'lg'
                        ? 'lg'
                        : action.size === 'sm'
                          ? 'sm'
                          : 'lg'
                    }
                    className={cn(
                      'min-w-[160px] group',
                      action.primary &&
                        'bg-spotlight-500 hover:bg-spotlight-600 text-white border-spotlight-500',
                      !action.primary &&
                        'border-gray-300 hover:border-spotlight-300 hover:bg-spotlight-50 hover:text-spotlight-700',
                      'transition-all duration-300 hover:scale-105 hover:shadow-lg',
                      BLOG_ACCESSIBILITY.focus.ring,
                      BLOG_ACCESSIBILITY.focus.ringColors.primary
                    )}
                  >
                    {action.href ? (
                      <a href={action.href} className='flex items-center gap-2'>
                        {action.icon && (
                          <span className='group-hover:scale-110 transition-transform'>
                            {action.icon}
                          </span>
                        )}
                        <span>{action.label}</span>
                        <ArrowRight className='h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform' />
                      </a>
                    ) : (
                      <button type='button' className='flex items-center gap-2'>
                        {action.icon && (
                          <span className='group-hover:scale-110 transition-transform'>
                            {action.icon}
                          </span>
                        )}
                        <span>{action.label}</span>
                        <ArrowRight className='h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform' />
                      </button>
                    )}
                  </Button>
                ))}
              </div>
            )}

            {/* Featured Categories */}
            {featuredCategories.length > 0 && (
              <div className='animate-slideUp animation-delay-500'>
                <FeaturedCategories categories={featuredCategories} />
              </div>
            )}

            {/* Stats or Additional Info */}
            <div className='mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 animate-slideUp animation-delay-600'>
              <div className='text-center group'>
                <div className='flex justify-center mb-2'>
                  <div className='p-3 bg-spotlight-100 rounded-lg group-hover:bg-spotlight-200 transition-colors'>
                    <BookOpen className='h-6 w-6 text-spotlight-600' />
                  </div>
                </div>
                <div className='text-2xl font-bold text-professional-900'>100+</div>
                <div className='text-sm text-professional-600'>Expert Articles</div>
              </div>

              <div className='text-center group'>
                <div className='flex justify-center mb-2'>
                  <div className='p-3 bg-timing-100 rounded-lg group-hover:bg-timing-200 transition-colors'>
                    <Clock className='h-6 w-6 text-timing-600' />
                  </div>
                </div>
                <div className='text-2xl font-bold text-professional-900'>10+ Years</div>
                <div className='text-sm text-professional-600'>Industry Experience</div>
              </div>

              <div className='text-center group'>
                <div className='flex justify-center mb-2'>
                  <div className='p-3 bg-success-100 rounded-lg group-hover:bg-success-200 transition-colors'>
                    <Users className='h-6 w-6 text-success-600' />
                  </div>
                </div>
                <div className='text-2xl font-bold text-professional-900'>50K+</div>
                <div className='text-sm text-professional-600'>Event Professionals</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </section>
  );
};

BlogHero.displayName = 'BlogHero';

export default BlogHero;
