/**
 * CueTimer Blog Design System
 *
 * This file contains all design constants, brand colors, typography,
 * spacing, and styling patterns for the CueTimer blog components.
 *
 * Integrates with existing Tailwind CSS configuration and maintains
 * brand consistency across all blog components.
 */

// ===== BRAND COLORS =====
export const BLOG_COLORS = {
  // Primary brand colors - matching Tailwind config
  spotlightOrange: '#FF6B35',
  timingYellow: '#FFD23F',
  successGreen: '#48BB78',
  infoBlue: '#4299E1',
  professionalGray: '#2D3748',

  // Extended color palette for blog
  spotlight: {
    50: '#fff5f0',
    100: '#ffe8db',
    200: '#ffd4bf',
    300: '#ffb395',
    400: '#ff8b64',
    500: '#ff6b35',
    600: '#e55a2b',
    700: '#cc4e24',
    800: '#a33e1c',
    900: '#7a3015',
  },

  timing: {
    50: '#fffef3',
    100: '#fffbe6',
    200: '#fff7cc',
    300: '#ffee99',
    400: '#ffe466',
    500: '#ffd23f',
    600: '#e6bd38',
    700: '#cca831',
    800: '#a38628',
    900: '#7a641e',
  },

  professional: {
    50: '#f7fafc',
    100: '#edf2f7',
    200: '#e2e8f0',
    300: '#cbd5e0',
    400: '#a0aec0',
    500: '#718096',
    600: '#4a5568',
    700: '#2d3748',
    800: '#1a202c',
    900: '#171923',
  },

  success: {
    50: '#f0fff4',
    100: '#c6f6d5',
    200: '#9ae6b4',
    300: '#68d391',
    400: '#48bb78',
    500: '#38a169',
    600: '#2f855a',
    700: '#276749',
    800: '#22543d',
    900: '#1c4532',
  },

  info: {
    50: '#ebf8ff',
    100: '#bee3f8',
    200: '#90cdf4',
    300: '#63b3ed',
    400: '#4299e1',
    500: '#3182ce',
    600: '#2b6cb5',
    700: '#2c5282',
    800: '#2a4e7c',
    900: '#2a4e7c',
  },
} as const;

// ===== TYPOGRAPHY =====
export const BLOG_TYPOGRAPHY = {
  // Font families
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    serif: ['Georgia', 'Times New Roman', 'serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },

  // Font sizes (clamp for responsive typography)
  fontSize: {
    // Headings
    h1: 'clamp(2rem, 5vw, 3rem)', // 32px - 48px
    h2: 'clamp(1.5rem, 4vw, 2.25rem)', // 24px - 36px
    h3: 'clamp(1.25rem, 3vw, 1.75rem)', // 20px - 28px
    h4: 'clamp(1.125rem, 2.5vw, 1.5rem)', // 18px - 24px
    h5: 'clamp(1rem, 2vw, 1.25rem)', // 16px - 20px
    h6: 'clamp(0.875rem, 1.5vw, 1.125rem)', // 14px - 18px

    // Body text
    body: 'clamp(0.875rem, 1.5vw, 1rem)', // 14px - 16px
    small: 'clamp(0.75rem, 1.25vw, 0.875rem)', // 12px - 14px
    xs: 'clamp(0.6875rem, 1vw, 0.75rem)', // 11px - 12px

    // Specialized text
    caption: '0.75rem', // 12px
    overline: '0.625rem', // 10px
  },

  // Font weights
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ===== SPACING & SIZING =====
export const BLOG_SPACING = {
  // Spacing scale (8px base unit)
  spacing: {
    0: '0px',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    32: '8rem', // 128px
  },

  // Component-specific spacing
  component: {
    cardPadding: '1.5rem',
    cardGap: '1.5rem',
    sectionGap: '3rem',
    articlePadding: '2rem',
    tocWidth: '20rem', // 320px
    sidebarGap: '2rem',
  },

  // Container max widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    blog: '800px', // Optimal reading width
    blogWide: '1200px', // For featured content
  },
} as const;

// ===== ANIMATIONS & TRANSITIONS =====
export const BLOG_ANIMATIONS = {
  // Transition durations
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
  },

  // Transition timing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    custom: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Animation keyframes
  keyframes: {
    fadeIn: {
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
    slideUp: {
      from: { transform: 'translateY(10px)', opacity: '0' },
      to: { transform: 'translateY(0)', opacity: '1' },
    },
    slideDown: {
      from: { transform: 'translateY(-10px)', opacity: '0' },
      to: { transform: 'translateY(0)', opacity: '1' },
    },
    slideInLeft: {
      from: { transform: 'translateX(-10px)', opacity: '0' },
      to: { transform: 'translateX(0)', opacity: '1' },
    },
    slideInRight: {
      from: { transform: 'translateX(10px)', opacity: '0' },
      to: { transform: 'translateX(0)', opacity: '1' },
    },
    scaleIn: {
      from: { transform: 'scale(0.95)', opacity: '0' },
      to: { transform: 'scale(1)', opacity: '1' },
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.7' },
    },
    bounce: {
      '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
      '40%, 43%': { transform: 'translateY(-8px)' },
      '70%': { transform: 'translateY(-4px)' },
      '90%': { transform: 'translateY(-2px)' },
    },
    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
  },

  // Common animation combinations
  transitions: {
    // Hover states
    hover: {
      duration: '200ms',
      easing: 'ease-out',
      properties: ['transform', 'color', 'background-color', 'border-color', 'box-shadow'],
    },
    // Focus states
    focus: {
      duration: '150ms',
      easing: 'ease-out',
      properties: ['outline', 'outline-offset', 'box-shadow'],
    },
    // Modal/overlay
    overlay: {
      duration: '300ms',
      easing: 'ease-out',
      properties: ['opacity'],
    },
    // Mobile menu
    mobileMenu: {
      duration: '300ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      properties: ['transform', 'opacity'],
    },
  },
} as const;

// ===== SHADOWS & BORDERS =====
export const BLOG_EFFECTS = {
  // Box shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

    // Brand-specific shadows
    brand: '0 4px 14px 0 rgba(255, 107, 53, 0.1)',
    brandHover: '0 8px 25px 0 rgba(255, 107, 53, 0.15)',
    brandSoft: '0 2px 8px 0 rgba(255, 107, 53, 0.05)',
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    default: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Borders
  borders: {
    default: '1px solid',
    medium: '2px solid',
    thick: '4px solid',
  },
} as const;

// ===== RESPONSIVE BREAKPOINTS =====
export const BLOG_BREAKPOINTS = {
  // Screen sizes (matching Tailwind)
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Container queries (when supported)
  containers: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

// ===== COMPONENT STYLES =====
export const BLOG_COMPONENTS = {
  // Card styles
  card: {
    base: 'bg-white border border-gray-200 rounded-lg overflow-hidden',
    hover: 'hover:shadow-lg hover:border-spotlight-300 transition-all duration-300',
    default:
      'bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-spotlight-300 transition-all duration-300',
    featured:
      'bg-gradient-to-br from-spotlight-50 to-timing-50 border-spotlight-200 rounded-xl hover:shadow-xl hover:border-spotlight-300 transition-all duration-300',
    compact:
      'border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-spotlight-200 transition-all duration-200',
  },

  // Button styles
  button: {
    base: 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    primary: 'bg-spotlight-500 text-white hover:bg-spotlight-600 focus:ring-spotlight-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline:
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-spotlight-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-spotlight-500',
    link: 'text-spotlight-600 underline-offset-4 hover:underline focus:ring-spotlight-500',

    sizes: {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg',
    },
  },

  // Typography styles
  heading: {
    h1: 'font-bold text-professional-900 tracking-tight',
    h2: 'font-semibold text-professional-900 tracking-tight',
    h3: 'font-semibold text-professional-800',
    h4: 'font-medium text-professional-800',
    h5: 'font-medium text-professional-700',
    h6: 'font-medium text-professional-600',
  },

  body: {
    base: 'text-professional-700 leading-relaxed',
    small: 'text-professional-600 text-sm',
    muted: 'text-professional-500',
    accent: 'text-spotlight-600',
  },

  // Category badges
  category: {
    base: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
    timing: 'bg-blue-100 text-blue-800 border-blue-200',
    productivity: 'bg-green-100 text-green-800 border-green-200',
    events: 'bg-purple-100 text-purple-800 border-purple-200',
    features: 'bg-orange-100 text-orange-800 border-orange-200',
    tutorials: 'bg-pink-100 text-pink-800 border-pink-200',
    industry: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },

  // Tag styles
  tag: {
    base: 'inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200',
    active: 'bg-spotlight-100 text-spotlight-700 hover:bg-spotlight-200',
  },

  // Search and filter styles
  search: {
    input:
      'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spotlight-500 focus:border-spotlight-500 transition-all duration-200',
    container: 'relative max-w-md',
    icon: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4',
  },

  // Table of Contents styles
  toc: {
    container: 'sticky top-24 w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-sm',
    header: 'flex items-center justify-between pb-3 border-b border-gray-200',
    link: {
      base: 'block py-1.5 px-2 rounded-md transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-spotlight-500',
      active: 'bg-spotlight-50 text-spotlight-600 font-medium border-l-2 border-spotlight-500',
      inactive: 'text-gray-600 hover:text-gray-900',
    },
    mobile: {
      button:
        'lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg bg-spotlight-500 text-white hover:bg-spotlight-600',
      panel:
        'lg:hidden fixed inset-y-0 right-0 w-80 max-w-full bg-white shadow-xl z-50 transform transition-transform duration-300',
    },
  },

  // Article content styles
  article: {
    container: 'max-w-blog mx-auto',
    header: 'mb-8 pb-6 border-b border-gray-200',
    content: 'prose prose-lg prose-gray max-w-none',
    metadata: 'flex items-center gap-4 text-sm text-gray-500',
    navigation: 'flex items-center justify-between pt-8 mt-12 border-t border-gray-200',
  },

  // Loading states
  loading: {
    skeleton: 'bg-gray-200 rounded animate-pulse',
    spinner: 'animate-spin rounded-full border-2 border-gray-300 border-t-spotlight-500',
    shimmer:
      'bg-gradient-to-r from-transparent via-gray-200 to-transparent bg-[length:200%_100%] animate-shimmer',
  },
} as const;

// ===== ACCESSIBILITY =====
export const BLOG_ACCESSIBILITY = {
  // Focus states
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
    ringColors: {
      primary: 'focus:ring-spotlight-500',
      secondary: 'focus:ring-gray-500',
      success: 'focus:ring-success-500',
      warning: 'focus:ring-yellow-500',
      error: 'focus:ring-red-500',
    },
    visible: 'focus:ring-offset-2 focus:ring-2',
  },

  // Screen reader only
  srOnly: 'sr-only',

  // Reduced motion
  reducedMotion: 'motion-reduce:transition-none motion-reduce:transform-none',

  // High contrast
  highContrast: {
    text: 'contrast-more:contrast-150',
    borders: 'contrast-more:border-contrast-200',
  },
} as const;

// ===== UTILITIES =====
export const BLOG_UTILITIES = {
  // Text truncation
  truncate: {
    lineClamp: {
      1: 'line-clamp-1',
      2: 'line-clamp-2',
      3: 'line-clamp-3',
      4: 'line-clamp-4',
      5: 'line-clamp-5',
    },
  },

  // Aspect ratios
  aspectRatio: {
    square: 'aspect-square',
    video: 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    '16/9': 'aspect-[16/9]',
    '21/9': 'aspect-[21/9]',
  },

  // Grid layouts
  grid: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      responsive: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    },
  },

  // Flex utilities
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    wrap: 'flex flex-wrap',
    gap: {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  },
} as const;

// ===== TYPE DEFINITIONS =====
export type BlogColor = keyof typeof BLOG_COLORS.spotlight;
export type BlogCategory = keyof typeof BLOG_COMPONENTS.category;
export type BlogButtonSize = keyof typeof BLOG_COMPONENTS.button.sizes;
export type BlogButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

// Export default configuration
export const BLOG_DESIGN_SYSTEM = {
  colors: BLOG_COLORS,
  typography: BLOG_TYPOGRAPHY,
  spacing: BLOG_SPACING,
  animations: BLOG_ANIMATIONS,
  effects: BLOG_EFFECTS,
  breakpoints: BLOG_BREAKPOINTS,
  components: BLOG_COMPONENTS,
  accessibility: BLOG_ACCESSIBILITY,
  utilities: BLOG_UTILITIES,
} as const;

export default BLOG_DESIGN_SYSTEM;
