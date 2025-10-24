# Technical Setup Summary

## Overview

CueTimer is built on a modern Next.js 15.5.6 foundation with TypeScript,
utilizing Bun as the package manager for optimal performance. This document
provides a comprehensive overview of the technical architecture, tools, and
configurations that power the platform.

## Core Technology Stack

### Frontend Framework

- **Next.js 15.5.6**: React framework with App Router
- **React 19.2.0**: Latest React version with concurrent features
- **TypeScript 5.9.3**: Type-safe development
- **Tailwind CSS v4.1.16**: Utility-first CSS framework with PostCSS

### Package Management

- **Bun**: Fast package manager and runtime
- **Node.js >=18.0.0**: Runtime environment requirement

### Development Tools

- **ESLint 9.27.0**: Code linting with React and TypeScript rules
- **Prettier 3.5.3**: Code formatting with Tailwind plugin
- **Husky 9.1.7**: Git hooks for pre-commit quality checks
- **Jest 30.2.0**: Testing framework with React Testing Library

### Mobile & PWA

- **Ionic React 8.4.2**: Mobile UI components
- **Capacitor 6.1.2**: Native mobile app deployment
- **Next PWA**: Progressive Web App capabilities

### Backend & Database

- **Supabase**: Authentication and database (configured for future use)
- **Next.js API Routes**: Server-side API endpoints

## Configuration Files

### Next.js Configuration (`next.config.js`)

```javascript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    },
  },
  transpilePackages: ['@radix-ui/react-slot', '@ionic/react'],
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // Security headers and performance optimizations
  // ... (see full config in repository)
};

export default withNextIntl(nextConfig);
```

### Tailwind CSS Configuration (`tailwind.config.cjs`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
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
          // ... full color palette
        },
      },
    },
  },
  plugins: [],
};
```

### ESLint Configuration (`eslint.config.js`)

- React 19 support
- TypeScript strict mode
- Prettier integration
- Next.js specific rules
- Import sorting

### Prettier Configuration (`.prettierrc`)

- Tailwind CSS class sorting
- Consistent formatting rules
- JSX single quotes
- Trailing commas

## Project Structure

```
cue-timer/
├── app/                          # Next.js App Router
│   └── [locale]/                 # Internationalized routes
│       ├── layout.tsx           # Root layout
│       ├── page.tsx             # Landing page
│       └── test/                # Test pages
├── components/                   # React components
├── lib/                         # Utility functions
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript type definitions
├── i18n.ts                      # Internationalization config
├── middleware.ts                # Next.js middleware for locale
├── messages/                    # Translation files
│   ├── en.json                 # English translations
│   ├── pt-br.json              # Portuguese (Brazil)
│   ├── es.json                 # Spanish
│   ├── fr.json                 # French
│   └── de.json                 # German
├── docs/                        # Documentation
├── .husky/                     # Git hooks
└── public/                     # Static assets
```

## Development Scripts

### Core Development

```bash
bun dev                # Start development server
bun build              # Build for production
bun start              # Start production server
```

### Code Quality

```bash
bun lint:all           # Run all linting
bun lint:fix           # Fix linting issues
bun format             # Format code with Prettier
bun type-check         # TypeScript type checking
```

### Testing

```bash
bun test               # Run tests
bun test:watch         # Run tests in watch mode
bun test:coverage      # Generate coverage report
```

### Mobile Development

```bash
bun mobile:build       # Build mobile app
bun mobile:sync        # Sync with Capacitor
bun mobile:run:ios     # Run on iOS
bun mobile:run:android # Run on Android
```

## Key Dependencies

### UI Components

- **@radix-ui/**: Accessible component primitives
- **lucide-react**: Icon library
- **framer-motion**: Animation library

### Internationalization

- **next-intl**: React internationalization for Next.js
- **next-themes**: Dark/light mode support

### Content & Markdown

- **next-mdx-remote**: MDX rendering
- **mdx-embed**: Embed rich content in MDX
- **@tailwindcss/typography**: Typography styles

## Environment Setup

### Prerequisites

- Node.js >=18.0.0
- Bun >=1.0.0
- Git

### Installation Steps

1. Clone the repository
2. Install dependencies: `bun install`
3. Set up environment variables (see `.env.example`)
4. Initialize Husky: `bun run prepare`
5. Start development server: `bun dev`

### Environment Variables

```bash
# Supabase (future use)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Development Workflow

### Pre-commit Hooks

Husky is configured with the following pre-commit hooks:

- **lint-staged**: Runs ESLint and Prettier on staged files
- **Commitlint**: Ensures conventional commit messages

### Git Flow

1. Create feature branch from `develop`
2. Make changes with frequent commits
3. Pre-commit hooks run automatically
4. Create pull request to `develop`
5. Code review and merge

### Code Quality Gates

- All tests must pass
- No ESLint warnings or errors
- TypeScript compilation succeeds
- Prettier formatting applied

## Performance Optimizations

### Next.js Optimizations

- Image optimization with WebP/AVIF support
- Static asset caching
- Compression enabled
- Security headers configured

### Build Optimizations

- Bundle analyzer available (`bun run build:analyze`)
- Tree shaking enabled
- Code splitting automatic

### Development Optimizations

- Fast Refresh enabled
- TypeScript watch mode
- Hot reloading for styles

## Security Configuration

### Headers

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### Next.js Security

- Powered by header disabled
- Server actions restricted to allowed origins
- Source maps disabled in production

## Troubleshooting Common Issues

### Tailwind CSS Not Working

1. Check PostCSS configuration
2. Verify content paths in `tailwind.config.cjs`
3. Ensure `@tailwind` directives are in CSS
4. Restart development server

### TypeScript Errors

1. Run `bun run type-check` for detailed errors
2. Check `tsconfig.json` configuration
3. Verify import paths are correct

### Build Failures

1. Clear Next.js cache: `rm -rf .next`
2. Clear node_modules and reinstall
3. Check for memory issues
4. Verify environment variables

## Next Steps

### Immediate Tasks

- [ ] Configure Supabase integration
- [ ] Set up authentication flow
- [ ] Build autonomous marketing infrastructure (QuoteKit patterns as reference only)
- [ ] Add testing infrastructure

### Future Enhancements

- [ ] PWA configuration
- [ ] Service worker implementation
- [ ] Advanced caching strategies
- [ ] Monitoring and analytics

---

**Last Updated:** 2025-10-23 **Maintained by:** Development Team **Review
Frequency:** Monthly **Next Review:** 2025-11-23
