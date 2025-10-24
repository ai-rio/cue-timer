import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import next from '@next/eslint-plugin-next';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
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
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
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

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',

      // General code quality
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-debugger': 'error',
      'no-alert': 'error',

      // Next.js/React specific rules
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',

      // Marketing/Content specific rules
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'eol-last': ['warn', 'always'],
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
    },
  },
  {
    files: ['scripts/**/*', 'jest.*.{js,mjs}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
      'prefer-const': 'off',
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
    files: ['src/components/marketing/**/*', 'src/app/marketing/**/*'],
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
