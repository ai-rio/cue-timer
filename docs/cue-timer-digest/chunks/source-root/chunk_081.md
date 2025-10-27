# Chunk 81: source_root

## Metadata

- **Files**: 9
- **Size**: 25,106 characters (~6,276 tokens)
- **Categories**: source

## Files in this chunk

- `eslint.config.js`
- `global.d.ts`
- `i18n.ts`
- `jest.config.ci.js`
- `jest.config.js`
- `middleware.ts`
- `next-env.d.ts`
- `next.config.js`
- `tailwind.config.ts`

---

## File: `eslint.config.js`

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import next from '@next/eslint-plugin-next';

const nextConfig = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: {
    '@next/next': next,
  },
  rules: {
    '@next/next/no-img-element': 'error',
    '@next/next/no-sync-scripts': 'error',
  },
};

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  nextConfig,
  prettierConfig,
  {
    ignores: [
      '.next/**',
      'out/**',
      'dist/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      '*.config.cjs',
      '.lintstagedrc.js',
      'jest.setup.js',
      'jest.config.js',
      'public/**',
      'build/**',
      '.git/**',
      'coverage/**',
      'next-env.d.ts',
      'reports/**',
      '.supabase/**',
      'ios/**',
      'android/**',
      ' capacitor.config.ts',
      '.claude/**',
      '.serena/**',
      'content/**/*.md',
      'content/**/*.mdx',
      'tests/**/*.js',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': next,
      'simple-import-sort': simpleImportSort,
      prettier: prettier,
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      react: react,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // Import sorting
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      // TypeScript rules - UPGRADED TO ERROR FOR MAX AUTO-FIXES
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-require-imports': 'off',

      // General code quality - AGGRESSIVE AUTO-FIX RULES
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-debugger': 'error',
      'no-alert': 'error',

      // NEW AGGRESSIVE AUTO-FIX RULES FOR DRAMATIC REDUCTION
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'arrow-spacing': 'error',
      // REMOVED: arrow-parens - handled by Prettier to avoid circular fixes
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-destructuring': ['error', { object: true, array: false }],
      'no-duplicate-imports': 'error',
      'no-useless-rename': 'error',

      // REMOVED FORMATTING RULES - HANDLED BY PRETTIER
      // These rules were conflicting with Prettier's formatting:
      // - comma-dangle, quotes, jsx-quotes, quote-props (Prettier manages)
      // - object-curly-spacing, array-bracket-spacing (Prettier manages)
      // - spacing rules (Prettier manages all formatting)
      // - function spacing rules (Prettier manages)
      // - arrow-parens (Prettier manages)

      // KEEP ONLY CODE QUALITY RULES (NOT FORMATTING)
      'no-useless-escape': 'warn',

      // Next.js/React specific rules
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',

      // Next.js specific rules - downgraded to warn for build stability
      '@next/next/no-img-element': 'warn',
      '@next/next/no-sync-scripts': 'warn',
      '@next/next/no-page-custom-font': 'warn',

      // Marketing/Content specific rules
      // Formatting rules removed - handled by Prettier
      'no-useless-escape': 'warn', // Downgrade to avoid build blocking
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...tseslint.configs.recommended[0].languageOptions?.globals,
      },
    },
  },
  {
    files: ['**/*.test.{ts,tsx,js,jsx}', 'tests/**/*', '__tests__/**/*'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'prefer-const': 'off',
      'no-debugger': 'off',
      // RELAX AUTO-FIX RULES FOR TESTS
      'object-shorthand': 'off',
      'prefer-arrow-callback': 'off',
      'prefer-template': 'off',
      'template-curly-spacing': 'off',
      'arrow-spacing': 'off',
      'arrow-parens': 'off',
      'arrow-body-style': 'off',
      'prefer-destructuring': 'off',
      'no-duplicate-imports': 'off',
      'no-useless-rename': 'off',
      'comma-dangle': 'off',
      semi: 'off',
      quotes: 'off',
      'quote-props': 'off',
      'jsx-quotes': 'off',
      'no-trailing-spaces': 'off',
      indent: 'off',
      'key-spacing': 'off',
      'space-before-blocks': 'off',
      'space-infix-ops': 'off',
      'space-unary-ops': 'off',
      'spaced-comment': 'off',
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      'comma-spacing': 'off',
      'computed-property-spacing': 'off',
      'func-call-spacing': 'off',
      'space-before-function-paren': 'off',
      'no-multiple-empty-lines': 'off',
      'eol-last': 'off',
      'no-useless-escape': 'off',
    },
  },
  {
    files: ['scripts/**/*', 'jest.*.{js,mjs}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
      'prefer-const': 'off',
      // ALLOW CONSOLE IN SCRIPTS BUT KEEP OTHER AUTO-FIXES
      'object-shorthand': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      'template-curly-spacing': 'warn',
      'arrow-spacing': 'warn',
      // REMOVED: arrow-parens - handled by Prettier to avoid circular fixes
      'arrow-body-style': ['warn', 'as-needed'],
      'prefer-destructuring': ['warn', { object: true, array: false }],
      'no-duplicate-imports': 'warn',
      'no-useless-rename': 'warn',
      // REMOVED: comma-dangle - handled by Prettier to avoid circular fixes
      quotes: ['warn', 'single', { avoidEscape: true }],
      'quote-props': ['warn', 'as-needed'],
      'jsx-quotes': ['warn', 'prefer-double'],
      'no-trailing-spaces': 'warn',
      'key-spacing': 'warn',
      'space-before-blocks': 'warn',
      'space-infix-ops': 'warn',
      'space-unary-ops': 'warn',
      'spaced-comment': ['warn', 'always'],
      'object-curly-spacing': ['warn', 'always'],
      'array-bracket-spacing': ['warn', 'never'],
      'comma-spacing': 'warn',
      'computed-property-spacing': 'warn',
      'func-call-spacing': 'warn',
      'space-before-function-paren': [
        'warn',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 1 }],
      'eol-last': ['warn', 'always'],
      'no-useless-escape': 'warn',
    },
  },
  {
    files: ['content/**/*.md', 'content/**/*.mdx'],
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['src/components/marketing/**/*', 'src/app/(marketing)/**/*'],
    rules: {
      // Marketing components might need more flexibility
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    files: ['src/app/timer/**/*', 'src/components/timer/**/*'],
    rules: {
      // Timer app needs stricter rules for reliability
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
];
```

## File: `global.d.ts`

```typescript
import '@testing-library/jest-dom';

// Global type declarations for Jest DOM matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveFocus(): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: Record<string, string>): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | number): R;
      toBeChecked(): R;
      toHaveDescription(text: string | RegExp): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toHaveErrorMessage(text: string | RegExp): R;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toHaveFormValues(values: Record<string, any>): R;
      toHaveHTMLContent(html: string | RegExp): R;
      toHaveRole(role: string): R;
      toHaveAccessibleDescription(text: string | RegExp): R;
      toHaveAccessibleName(text: string | RegExp): R;
      toBeEmptyDOMElement(): R;
      toBePartiallyChecked(checkedState: 'true' | 'false' | 'mixed'): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
    }
  }
}

// Add any other global type declarations here
declare global {
  namespace NodeJS {
    interface Global {
      describe: typeof jest.describe;
      test: typeof jest.test;
      expect: typeof jest.expect;
      beforeAll: typeof jest.beforeAll;
      afterAll: typeof jest.afterAll;
      beforeEach: typeof jest.beforeEach;
      afterEach: typeof jest.afterEach;
      jest: typeof jest;
    }
  }
}

export {};
```

## File: `i18n.ts`

```typescript
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'pt-br', 'es', 'fr', 'de'] as const;
export const defaultLocale = 'en' as const;

export default getRequestConfig(async ({ requestLocale }) => {
  // Provide a fallback locale if requestLocale is not available
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    locale = defaultLocale;
  }

  // Load all translation namespaces for the locale
  const messages: Record<string, unknown> = {};

  // Define all available namespaces specific to CueTimer
  const namespaces = [
    'common',
    'navigation',
    'hero',
    'timer',
    'events',
    'presentations',
    'dashboard',
    'auth',
    'pricing',
    'errors',
    'settings',
    'billing',
    'support',
    'blog',
  ];

  // Load each namespace with fallback to English
  for (const namespace of namespaces) {
    try {
      messages[namespace] = (
        await import(`./locales/${locale}/${namespace}.json`)
      ).default;
    } catch {
      try {
        // Fallback to English if locale-specific translation doesn't exist
        messages[namespace] = (
          await import(`./locales/${defaultLocale}/${namespace}.json`)
        ).default;
        // Silent fallback handling
      } catch {
        // Final fallback - create empty object to prevent errors
        // Silent error handling for missing translation files
        messages[namespace] = {};
      }
    }
  }

  return {
    locale,
    messages,
    // Handle missing messages gracefully with structured logging
    onError(error) {
      // const errorInfo = {
      //   type: 'I18N_ERROR',
      //   code: error.code,
      //   message: error.message,
      //   namespace: (error as any).namespace,
      //   key: (error as any).key,
      //   timestamp: new Date().toISOString(),
      // };

      if (error.code === 'MISSING_MESSAGE') {
        // Silent handling of missing messages
      } else {
        // Silent handling of other i18n errors
      }
    },
    getMessageFallback({ namespace, key }) {
      const path = [namespace, key].filter((part) => part != null).join('.');
      return `${path}`;
    },
  };
});
```

## File: `jest.config.ci.js`

```javascript
/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'scripts/**/*.{ts,js}',
    'components/**/*.{ts,tsx}',
    'src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/.next/**',
    '!**/build/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json', 'clover'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
    './lib/blog-scripts/': {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './scripts/': {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './components/blog/': {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  testTimeout: 30000,
  verbose: true,
  maxWorkers: '50%',
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx,js}'],
      testPathIgnorePatterns: [
        '<rootDir>/tests/integration/',
        '<rootDir>/tests/performance/',
      ],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.{ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    },
    {
      displayName: 'config',
      testMatch: ['<rootDir>/tests/config/**/*.test.{ts,tsx,js}'],
      testEnvironment: 'node',
    },
    {
      displayName: 'typescript',
      testMatch: ['<rootDir>/tests/typescript/**/*.test.{ts,tsx,js}'],
      testEnvironment: 'node',
    },
  ],
};
```

## File: `jest.config.js`

```javascript
/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'lib/blog-scripts/**/*.{ts,tsx}',
    'scripts/blog-*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  testTimeout: 30000,
  verbose: true,
};
```

## File: `middleware.ts`

```typescript
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'pt-br', 'es', 'fr', 'de'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Always show locale prefix to avoid conflicts with root layout
  localePrefix: 'always',

  // Optional: Detect locale from user preferences
  localeDetection: true,
});

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Required for Next.js development
    "style-src 'self' 'unsafe-inline'", // Required for Tailwind
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co", // WebSocket support for real-time timer sync
    "frame-src 'none'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Skip all internal paths (_next) and API routes
    '/((?!_next|api|favicon.ico).*)',
  ],
};
```

## File: `next-env.d.ts`

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference path="./.next/types/routes.d.ts" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

## File: `next.config.js`

```javascript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set workspace root for git worktree environments
  outputFileTracingRoot:
    '/home/carlos/projects/cue-timer/.worktrees/blog-management',
  experimental: {
    // Enable server actions with proper configuration
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    },
    // Optimize webpack chunks to prevent vendor chunk issues
    optimizePackageImports: ['next-intl'],
  },
  // Enable transpilation of packages
  transpilePackages: ['@radix-ui/react-slot', '@ionic/react'],
  // Configure webpack to handle vendor chunks properly
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        crypto: false,
        stream: false,
        assert: false,
        http: false,
        https: false,
        os: false,
        url: false,
      };

      // Fix module concatenation issues that cause "Cannot read properties of undefined (reading 'call')"
      config.optimization.concatenateModules = false;

      // Handle dynamic imports properly
      config.externals = config.externals || [];
      config.resolve.alias = {
        ...config.resolve.alias,
        // Ensure proper module resolution
      };

      // Fix React server components issues
      config.resolve.extensionAlias = {
        '.js': ['.js', '.jsx', '.ts', '.tsx'],
        '.jsx': ['.jsx', '.tsx'],
        '.ts': ['.ts', '.tsx'],
        '.tsx': ['.tsx'],
      };
    }
    return config;
  },
  // Configure images
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // Configure headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/css/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
        ],
      },
      {
        source: '/_next/static/chunks/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },
  // Enable compression for better performance
  compress: true,
  // Enable powered by header removal for security
  poweredByHeader: false,
  // Generate source maps for production debugging (optional)
  productionBrowserSourceMaps: false,
};

export default withNextIntl(nextConfig);
```

## File: `tailwind.config.ts`

```typescript
const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CueTimer Brand Colors - consistent with CSS custom properties
        brand: {
          orange: '#FF6B35',
          yellow: '#FFD23F',
          gray: '#2D3748',
          50: '#fff5ed',
          100: '#ffe7d6',
          200: '#ffceb3',
          300: '#ffb380',
          400: '#ff8c4d',
          500: '#FF6B35', // Primary brand color
          600: '#e55a2b',
          700: '#cc4922',
          800: '#b33819',
          900: '#992710',
        },
        // Spotlight orange for consistency
        spotlight: {
          orange: '#FF6B35',
          'orange-50': '#fff5f0',
          'orange-100': '#ffe8db',
          'orange-200': '#ffd4bf',
          'orange-300': '#ffb395',
          'orange-400': '#ff8b64',
          'orange-500': '#ff6b35',
          'orange-600': '#e55a2b',
          'orange-700': '#cc4e24',
          'orange-800': '#a33e1c',
          'orange-900': '#7a3015',
        },
        // Timing yellow
        timing: {
          yellow: '#FFD23F',
          'yellow-50': '#fffef3',
          'yellow-100': '#fffbe6',
          'yellow-200': '#fff7cc',
          'yellow-300': '#ffee99',
          'yellow-400': '#ffe466',
          'yellow-500': '#ffd23f',
          'yellow-600': '#e6bd38',
          'yellow-700': '#cca831',
          'yellow-800': '#a38628',
          'yellow-900': '#7a641e',
        },
        // Professional gray
        professional: {
          gray: '#2D3748',
          'gray-50': '#f7fafc',
          'gray-100': '#edf2f7',
          'gray-200': '#e2e8f0',
          'gray-300': '#cbd5e0',
          'gray-400': '#a0aec0',
          'gray-500': '#718096',
          'gray-600': '#4a5568',
          'gray-700': '#2d3748',
          'gray-800': '#1a202c',
          'gray-900': '#171923',
        },
        // Semantic colors
        success: {
          DEFAULT: '#48BB78',
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
        warning: {
          DEFAULT: '#F56565',
          50: '#fff5f5',
          100: '#fed7d7',
          200: '#feb2b2',
          300: '#fc8181',
          400: '#f56565',
          500: '#e53e3e',
          600: '#c53030',
          700: '#9b2c2c',
          800: '#742a2a',
          900: '#5a2c2c',
        },
        info: {
          DEFAULT: '#4299E1',
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
        // Keep existing primary for compatibility
        primary: {
          DEFAULT: '#FF6B35',
          50: '#fff5ed',
          100: '#ffe7d6',
          200: '#ffceb3',
          300: '#ffb380',
          400: '#ff8c4d',
          500: '#FF6B35',
          600: '#e55a2b',
          700: '#cc4922',
          800: '#b33819',
          900: '#992710',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        timer: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 1s ease-in-out',
        'theme-transition': 'themeTransition 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        themeTransition: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.95' },
          '100%': { opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        brand: '0 4px 14px 0 rgba(255, 107, 53, 0.1)',
        'brand-lg': '0 10px 40px 0 rgba(255, 107, 53, 0.15)',
        theme:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'theme-dark':
          '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
```
