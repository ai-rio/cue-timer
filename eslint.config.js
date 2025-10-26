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
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
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
