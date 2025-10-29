/**
 * CueTimer Blog Design System Utilities
 *
 * Utility functions and helpers for working with the blog design system.
 * Provides CSS-in-JS integration, responsive utilities, and helper functions.
 */

import { BLOG_COLORS, BLOG_DESIGN_SYSTEM, type BlogCategory } from './blog-styles';

// ===== CSS-IN-JS UTILITIES =====

/**
 * Creates a CSS variable reference for design system values
 */
export const cssVar = (name: string, fallback?: string) =>
  `var(--blog-${name}${fallback ? `, ${fallback}` : ''})`;

/**
 * Generates CSS custom properties from the design system
 */
export const generateCSSVariables = () => {
  const variables: Record<string, string> = {};

  // Color variables
  Object.entries(BLOG_COLORS.spotlight).forEach(([key, value]) => {
    variables[`--blog-color-spotlight-${key}`] = value;
  });

  Object.entries(BLOG_COLORS.timing).forEach(([key, value]) => {
    variables[`--blog-color-timing-${key}`] = value;
  });

  Object.entries(BLOG_COLORS.professional).forEach(([key, value]) => {
    variables[`--blog-color-professional-${key}`] = value;
  });

  // Spacing variables
  Object.entries(BLOG_DESIGN_SYSTEM.spacing.spacing).forEach(([key, value]) => {
    variables[`--blog-spacing-${key}`] = value;
  });

  // Typography variables
  Object.entries(BLOG_DESIGN_SYSTEM.typography.fontSize).forEach(([key, value]) => {
    variables[`--blog-font-size-${key}`] = value;
  });

  // Animation variables
  Object.entries(BLOG_DESIGN_SYSTEM.animations.duration).forEach(([key, value]) => {
    variables[`--blog-duration-${key}`] = value;
  });

  return variables;
};

// ===== RESPONSIVE UTILITIES =====

/**
 * Creates responsive style objects for different breakpoints
 */
export const responsive = <T>(base: T, sm?: T, md?: T, lg?: T, xl?: T): Record<string, T> => {
  const result: Record<string, T> = { base };

  if (sm) result.sm = sm;
  if (md) result.md = md;
  if (lg) result.lg = lg;
  if (xl) result.xl = xl;

  return result;
};

/**
 * Creates a responsive spacing value
 */
export const responsiveSpacing = (value: string | number) => {
  const spacing = typeof value === 'number' ? `${value}px` : value;
  return responsive(spacing, spacing, spacing, spacing, spacing);
};

// ===== COLOR UTILITIES =====

/**
 * Gets the appropriate text color for a background color
 */
export const getTextColor = (bgColor: string): string => {
  // Simple contrast calculation - can be enhanced with actual luminance calculation
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? BLOG_COLORS.professionalGray : '#ffffff';
};

/**
 * Creates a gradient string from brand colors
 */
export const createGradient = (
  direction: 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'diagonal' = 'diagonal',
  colors: string[] = [BLOG_COLORS.spotlight[500], BLOG_COLORS.timing[400]]
): string => {
  const directions = {
    'to-right': 'to right',
    'to-left': 'to left',
    'to-bottom': 'to bottom',
    'to-top': 'to top',
    diagonal: '135deg',
  };

  return `linear-gradient(${directions[direction]}, ${colors.join(', ')})`;
};

/**
 * Adjusts color opacity
 */
export const adjustColorOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

// ===== TYPOGRAPHY UTILITIES =====

/**
 * Creates responsive typography styles
 */
export const responsiveTypography = (
  variant: keyof typeof BLOG_DESIGN_SYSTEM.typography.fontSize
) => {
  const fontSize = BLOG_DESIGN_SYSTEM.typography.fontSize[variant];
  const lineHeight = BLOG_DESIGN_SYSTEM.typography.lineHeight.normal;
  const letterSpacing = BLOG_DESIGN_SYSTEM.typography.letterSpacing.normal;

  return {
    fontSize,
    lineHeight,
    letterSpacing,
  };
};

/**
 * Gets heading styles by level
 */
export const getHeadingStyles = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const headingMap = {
    1: BLOG_DESIGN_SYSTEM.components.heading.h1,
    2: BLOG_DESIGN_SYSTEM.components.heading.h2,
    3: BLOG_DESIGN_SYSTEM.components.heading.h3,
    4: BLOG_DESIGN_SYSTEM.components.heading.h4,
    5: BLOG_DESIGN_SYSTEM.components.heading.h5,
    6: BLOG_DESIGN_SYSTEM.components.heading.h6,
  };

  return headingMap[level];
};

// ===== ANIMATION UTILITIES =====

/**
 * Creates a CSS animation object
 */
export const createAnimation = (
  name: keyof typeof BLOG_DESIGN_SYSTEM.animations.keyframes,
  duration: keyof typeof BLOG_DESIGN_SYSTEM.animations.duration = 'normal',
  easing: keyof typeof BLOG_DESIGN_SYSTEM.animations.easing = 'easeInOut',
  fillMode: 'forwards' | 'backwards' | 'both' | 'none' = 'both'
) => {
  const keyframes = BLOG_DESIGN_SYSTEM.animations.keyframes[name];
  const durationValue = BLOG_DESIGN_SYSTEM.animations.duration[duration];
  const easingValue = BLOG_DESIGN_SYSTEM.animations.easing[easing];

  return {
    animation: `${durationValue} ${easingValue} ${fillMode}`,
    '@keyframes': keyframes,
  };
};

/**
 * Creates transition styles for hover states
 */
export const createHoverTransition = (
  properties: string[] = ['transform', 'color', 'background-color'],
  duration: keyof typeof BLOG_DESIGN_SYSTEM.animations.duration = 'fast'
) => {
  const durationValue = BLOG_DESIGN_SYSTEM.animations.duration[duration];
  const easingValue = BLOG_DESIGN_SYSTEM.animations.easing.easeOut;

  return {
    transition: properties.map((prop) => `${prop} ${durationValue} ${easingValue}`).join(', '),
  };
};

// ===== COMPONENT STYLE BUILDERS =====

/**
 * Builds card styles dynamically
 */
export const buildCardStyles = (
  variant: keyof typeof BLOG_DESIGN_SYSTEM.components.card = 'default'
) => {
  const baseStyles = BLOG_DESIGN_SYSTEM.components.card.base;
  const variantStyles = BLOG_DESIGN_SYSTEM.components.card[variant];
  const hoverStyles = BLOG_DESIGN_SYSTEM.components.card.hover;

  return `${baseStyles} ${variantStyles} ${hoverStyles}`;
};

/**
 * Builds button styles dynamically
 */
export const buildButtonStyles = (
  variant: keyof typeof BLOG_DESIGN_SYSTEM.components.button = 'primary',
  size: keyof typeof BLOG_DESIGN_SYSTEM.components.button.sizes = 'md'
) => {
  const baseStyles = BLOG_DESIGN_SYSTEM.components.button.base;
  const variantStyles = BLOG_DESIGN_SYSTEM.components.button[variant];
  const sizeStyles = BLOG_DESIGN_SYSTEM.components.button.sizes[size];

  return `${baseStyles} ${variantStyles} ${sizeStyles}`;
};

/**
 * Builds category badge styles
 */
export const buildCategoryStyles = (category: BlogCategory) => {
  const baseStyles = BLOG_DESIGN_SYSTEM.components.category.base;
  const categoryStyles = BLOG_DESIGN_SYSTEM.components.category[category];

  return `${baseStyles} ${categoryStyles}`;
};

// ===== LAYOUT UTILITIES =====

/**
 * Creates a responsive grid configuration
 */
export const createGrid = (
  columns: number | Record<string, number>,
  gap: keyof typeof BLOG_DESIGN_SYSTEM.spacing.spacing = 4
) => {
  const gapValue = BLOG_DESIGN_SYSTEM.spacing.spacing[gap];

  if (typeof columns === 'number') {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: gapValue,
    };
  }

  const columnsConfig = Object.entries(columns)
    .map(([breakpoint, cols]) => {
      if (breakpoint === 'base') {
        return `grid-template-columns: repeat(${cols}, 1fr);`;
      }
      return `@media (min-width: ${BLOG_DESIGN_SYSTEM.breakpoints.screens[breakpoint as keyof typeof BLOG_DESIGN_SYSTEM.breakpoints.screens]}) {
        grid-template-columns: repeat(${cols}, 1fr);
      }`;
    })
    .join('\n');

  return {
    display: 'grid',
    gap: gapValue,
    css: columnsConfig,
  };
};

/**
 * Creates a flex container configuration
 */
export const createFlex = (
  direction: 'row' | 'col' = 'row',
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' = 'start',
  align: 'start' | 'center' | 'end' | 'stretch' = 'center',
  wrap: boolean = false
) => ({
  display: 'flex',
  flexDirection: direction === 'col' ? 'column' : 'row',
  justifyContent: `flex-${justify}`,
  alignItems: `flex-${align}`,
  flexWrap: wrap ? 'wrap' : 'nowrap',
});

// ===== ACCESSIBILITY UTILITIES =====

/**
 * Creates focus styles for interactive elements
 */
export const createFocusStyles = (
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'primary'
) => {
  const colorMap = {
    primary: BLOG_COLORS.spotlight[500],
    secondary: BLOG_COLORS.professional[500],
    success: BLOG_COLORS.success[500],
    warning: BLOG_COLORS.timing[500],
    error: '#ef4444', // Red from standard palette
  };

  return {
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${colorMap[color]}, 0 0 0 4px rgba(255, 255, 255, 0.1)`,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${colorMap[color]}, 0 0 0 4px rgba(255, 255, 255, 0.1)`,
    },
  };
};

/**
 * Creates reduced motion styles
 */
export const createReducedMotionStyles = () => ({
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none !important',
    transition: 'none !important',
  },
});

// ===== THEME UTILITIES =====

/**
 * Checks if dark mode is preferred
 */
export const prefersDarkMode = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Gets theme-appropriate colors
 */
export const getThemeColors = (isDark: boolean = false) => ({
  background: isDark ? BLOG_COLORS.professional[900] : '#ffffff',
  text: isDark ? BLOG_COLORS.professional[100] : BLOG_COLORS.professional[700],
  border: isDark ? BLOG_COLORS.professional[700] : BLOG_COLORS.professional[200],
  muted: isDark ? BLOG_COLORS.professional[600] : BLOG_COLORS.professional[500],
});

// ===== VALIDATION UTILITIES =====

/**
 * Validates if a color is a valid hex color
 */
export const isValidHexColor = (color: string): boolean =>
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

/**
 * Validates if a category is supported
 */
export const isValidCategory = (category: string): category is BlogCategory =>
  Object.keys(BLOG_DESIGN_SYSTEM.components.category).includes(category) && category !== 'base';

// ===== PERFORMANCE UTILITIES =====

/**
 * Creates a memoized style object to prevent re-renders
 */
export const createMemoizedStyles = <T extends Record<string, unknown>>(styles: T): T =>
  // In a real implementation, you might use useMemo or a similar optimization
  styles;

/**
 * Optimizes color values for better performance
 */
export const optimizeColors = (colors: Record<string, string>) => {
  const optimized: Record<string, string> = {};

  Object.entries(colors).forEach(([key, value]) => {
    // Convert to shorter format where possible
    if (
      value.length === 7 &&
      value[1] === value[2] &&
      value[3] === value[4] &&
      value[5] === value[6]
    ) {
      optimized[key] = `#${value[1]}${value[3]}${value[5]}`;
    } else {
      optimized[key] = value;
    }
  });

  return optimized;
};

export default {
  cssVar,
  generateCSSVariables,
  responsive,
  responsiveSpacing,
  getTextColor,
  createGradient,
  adjustColorOpacity,
  responsiveTypography,
  getHeadingStyles,
  createAnimation,
  createHoverTransition,
  buildCardStyles,
  buildButtonStyles,
  buildCategoryStyles,
  createGrid,
  createFlex,
  createFocusStyles,
  createReducedMotionStyles,
  prefersDarkMode,
  getThemeColors,
  isValidHexColor,
  isValidCategory,
  createMemoizedStyles,
  optimizeColors,
};
