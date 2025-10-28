# Chunk 65: other_root

## Metadata

- **Files**: 7
- **Size**: 5,538 characters (~1,384 tokens)
- **Categories**: other

## Files in this chunk

- `commitlint.config.cjs`
- `LICENSE`
- `lint-staged.config.cjs`
- `postcss.config.cjs`
- `prettier.config.mjs`
- `tailwind.config.ts.disabled`
- `.env.example`

---

## File: `commitlint.config.cjs`

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style changes (formatting, etc)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Test additions/modifications
        'chore', // Maintenance tasks
        'build', // Build system changes
        'ci', // CI configuration changes
        'revert', // Revert previous commit
        'bump', // Version bump
        'lint', // Linting fixes
        'security', // Security fixes
        'deps', // Dependency updates
        'i18n', // Internationalization changes
        'wip', // Work in progress
        'content', // Marketing/content changes
        'mobile', // Mobile-specific changes
        'timer', // Timer feature changes
        'marketing', // Marketing site changes
        'supabase', // Database/Supabase changes
        'billing', // Billing/payment changes
      ],
    ],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [0], // Optional scope
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
  },
  // Custom parser preset for CueTimer context
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['CUE-', 'TIMER-', 'MOBILE-', 'WEB-', 'CT-'],
    },
  },
};
```

## File: `LICENSE`

```
[Empty file]
```

## File: `lint-staged.config.cjs`

```javascript
module.exports = {
  // TypeScript/JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix --config eslint.config.js',
    'prettier --write',
  ],

  // MDX and markdown files
  '*.{md,mdx}': [
    'prettier --write',
    // Content validation
    'remark --frail --quiet',
  ],

  // Style files
  '*.{css,scss,less,sass}': ['prettier --write'],

  // Config and data files
  '*.{json,yml,yaml,toml}': ['prettier --write'],

  // Public files (validate but don't format)
  'public/**/*.{html,xml,svg}': [
    // Add HTML validation if needed
  ],

  // Config files (with specific formatting)
  '*.{config.js,config.mjs,config.cjs,config.ts}': [
    'eslint --fix --config eslint.config.js',
    'prettier --write',
  ],

  // Type definition files
  '*.d.ts': ['prettier --write'],

  // Test files
  '*.{test,spec}.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],

  // Story files
  '*.stories.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],

  // Supabase migration files
  'supabase/migrations/*.sql': [
    // SQL formatting (if a formatter is added)
    // 'sql-formatter --fix',
  ],
};
```

## File: `postcss.config.cjs`

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

## File: `prettier.config.mjs`

```javascript
export default {
  plugins: [],
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'lf',
  arrowParens: 'always',
  bracketSpacing: true,
  bracketSameLine: false,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  embeddedLanguageFormatting: 'auto',

  // File-specific overrides
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 80,
      },
    },
    {
      files: '*.mdx',
      options: {
        proseWrap: 'preserve',
        printWidth: 100,
      },
    },
    {
      files: 'package.json',
      options: {
        tabWidth: 2,
      },
    },
    {
      files: '*.json',
      options: {
        tabWidth: 2,
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
      },
    },
    {
      files: '*.yaml',
      options: {
        tabWidth: 2,
      },
    },
  ],
};
```

## File: `tailwind.config.ts.disabled`

```
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

## File: `.env.example`

```
# Development Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=noreply@cuetimer.io
RESEND_FROM_NAME=CueTimer

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_at_least_32_characters

# Feature Flags
NEXT_PUBLIC_ENABLE_BLOG=true
NEXT_PUBLIC_ENABLE_CHECKOUT=true
NEXT_PUBLIC_ENABLE_DASHBOARD=true

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_HOTJAR_ID=

# Development Tools
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_LOG_LEVEL=info
```
