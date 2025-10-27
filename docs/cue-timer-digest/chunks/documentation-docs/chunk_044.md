# Chunk 44: documentation_docs

## Metadata

- **Files**: 5
- **Size**: 26,129 characters (~6,532 tokens)
- **Categories**: documentation

## Files in this chunk

- `docs/development/guides/troubleshooting-guide.md`
- `docs/development/roadmap/next-steps-ARCHIVED.md`
- `docs/development/roadmap/next-steps.md`
- `docs/development/setup/technical-setup-summary.md`
- `docs/development/type-check/README.md`

---

## File: `docs/development/guides/troubleshooting-guide.md`

````markdown
# Troubleshooting Guide

## Overview

This comprehensive troubleshooting guide addresses common issues encountered
during CueTimer development. It provides solutions for setup problems, build
errors, runtime issues, and development workflow challenges.

## Quick Reference

### Most Common Issues

| Issue                       | Solution                  | Command                              |
| --------------------------- | ------------------------- | ------------------------------------ |
| Dependencies not installing | Clear cache and reinstall | `rm -rf node_modules && bun install` |
| TypeScript errors           | Check type configuration  | `bun run type-check`                 |
| Tailwind not working        | Verify PostCSS setup      | Check `postcss.config.js`            |
| Build fails                 | Clear Next.js cache       | `rm -rf .next && bun run build`      |
| Tests failing               | Run with verbose output   | `bun test --verbose`                 |

## Environment Setup Issues

### Node.js Version Incompatibility

**Problem**: `Node.js version X.X.X is not supported`

```bash
Error: Node.js version 16.x.x is not supported. Please use Node.js >= 18.0.0
```
````

**Solutions**:

1. **Check current version**:

   ```bash
   node --version
   ```

2. **Install correct version**:

   ```bash
   # Using nvm
   nvm install 18
   nvm use 18

   # Using fnm
   fnm install 18
   fnm use 18

   # Direct download
   # Download from https://nodejs.org
   ```

3. **Verify installation**:
   ```bash
   node --version  # Should show >= 18.0.0
   bun --version   # Should show >= 1.0.0
   ```

### Bun Installation Issues

**Problem**: `bun command not found`

```bash
zsh: command not found: bun
```

**Solutions**:

1. **Install Bun**:

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Update shell profile**:

   ```bash
   # Add to ~/.zshrc or ~/.bashrc
   export BUN_INSTALL="$HOME/.bun"
   export PATH="$BUN_INSTALL/bin:$PATH"
   ```

3. **Reload shell**:

   ```bash
   source ~/.zshrc  # or ~/.bashrc
   ```

4. **Verify installation**:
   ```bash
   bun --version
   ```

### Git Hooks Not Working

**Problem**: Pre-commit hooks not running

```bash
git commit -m "feat: add new feature"
# Hooks don't run, commit goes through
```

**Solutions**:

1. **Install Husky**:

   ```bash
   bun run prepare
   ```

2. **Verify hooks are installed**:

   ```bash
   ls -la .husky/
   # Should show pre-commit file
   ```

3. **Make hooks executable**:

   ```bash
   chmod +x .husky/pre-commit
   ```

4. **Manual hook test**:
   ```bash
   .husky/pre-commit
   ```

## Dependency Issues

### Package Installation Failures

**Problem**: Dependency installation errors

```bash
error bun install failed
Error: Cannot resolve dependency "react@19.2.0"
```

**Solutions**:

1. **Clear all caches**:

   ```bash
   rm -rf node_modules
   rm -rf .bun
   rm bun.lockb
   rm -rf .next
   ```

2. **Clean install**:

   ```bash
   bun install --force
   ```

3. **Check Node/Bun compatibility**:

   ```bash
   node --version
   bun --version
   # Ensure versions meet requirements
   ```

4. **Install specific versions**:
   ```bash
   bun install react@19.2.0 react-dom@19.2.0
   ```

### Peer Dependency Conflicts

**Problem**: Peer dependency warnings

```bash
warning "react" is a peer dependency of "some-package"
```

**Solutions**:

1. **Install missing peer dependencies**:

   ```bash
   bun add react react-dom
   ```

2. **Use legacy peer deps** (last resort):

   ```bash
   bun install --legacy-peer-deps
   ```

3. **Check package.json for version alignment**:
   ```json
   {
     "dependencies": {
       "react": "^19.2.0",
       "react-dom": "^19.2.0"
     }
   }
   ```

## TypeScript Issues

### Type Errors Not Showing

**Problem**: TypeScript errors not appearing in editor

```bash
# No errors in VS Code, but build fails
```

**Solutions**:

1. **Check TypeScript version**:

   ```bash
   bunx tsc --version
   ```

2. **Verify tsconfig.json**:

   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noEmit": true,
       "jsx": "preserve"
     }
   }
   ```

3. **Restart TypeScript server in VS Code**:
   - `Cmd+Shift+P` → "TypeScript: Restart TS Server"

4. **Manual type check**:
   ```bash
   bun run type-check
   ```

### Import Path Errors

**Problem**: Cannot find module errors

```bash
error TS2307: Cannot find module '@/components/timer' or its corresponding type declarations.
```

**Solutions**:

1. **Check tsconfig.json paths**:

   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

2. **Verify file exists**:

   ```bash
   ls -la components/timer
   ```

3. **Check import statement**:

   ```typescript
   // Correct
   import { Timer } from '@/components/timer';

   // Incorrect
   import { Timer } from './components/timer';
   ```

### Type Definition Missing

**Problem**: Types for package not found

```bash
error TS7016: Could not find a declaration file for module 'some-package'
```

**Solutions**:

1. **Install types**:

   ```bash
   bun add -d @types/some-package
   ```

2. **Create declaration file** (if no types exist):

   ```typescript
   // types/some-package.d.ts
   declare module 'some-package' {
     export interface SomeInterface {
       property: string;
     }
   }
   ```

3. **Use require with type assertion**:
   ```typescript
   const somePackage = require('some-package') as any;
   ```

## Tailwind CSS Issues

### Styles Not Applying

**Problem**: Tailwind classes not working

```html
<div className="bg-blue-500 text-white p-4">{/* Styles not applied */}</div>
```

**Solutions**:

1. **Check content paths in tailwind.config.cjs**:

   ```javascript
   module.exports = {
     content: [
       './pages/**/*.{js,ts,jsx,tsx,mdx}',
       './components/**/*.{js,ts,jsx,tsx,mdx}',
       './app/**/*.{js,ts,jsx,tsx,mdx}',
     ],
   };
   ```

2. **Verify PostCSS configuration**:

   ```javascript
   // postcss.config.js
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

3. **Check global CSS imports**:

   ```css
   /* app/globals.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Restart development server**:
   ```bash
   bun dev
   ```

### Custom Colors Not Working

**Problem**: Custom theme colors not available

```css
/* This doesn't work */
<div className="bg-brand-primary">
```

**Solutions**:

1. **Check tailwind.config.cjs**:

   ```javascript
   module.exports = {
     theme: {
       extend: {
         colors: {
           'brand-primary': '#0ea5e9',
         },
       },
     },
   };
   ```

2. **Use correct class name**:

   ```html
   <div className="bg-brand-primary"></div>
   ```

3. **Restart dev server** after config changes

### JIT Compilation Issues

**Problem**: New classes not appearing

```bash
# Added new class but it's not working
```

**Solutions**:

1. **Restart development server**:

   ```bash
   bun dev
   ```

2. **Check class name syntax**:

   ```css
   /* Correct */
   className="bg-blue-500 hover:bg-blue-600"

   /* Incorrect */
   className="bg blue 500"
   ```

3. **Verify file is in content path**:
   ```bash
   # Check if file is included in tailwind.config.cjs content array
   ```

## Next.js Issues

### Build Failures

**Problem**: `next build` fails

```bash
Error: Build optimization failed
```

**Solutions**:

1. **Check build logs for specific error**:

   ```bash
   bun run build 2>&1 | tee build.log
   cat build.log
   ```

2. **Common fixes**:

   ```bash
   # Clear Next.js cache
   rm -rf .next

   # Clean install dependencies
   rm -rf node_modules && bun install

   # Check for memory issues
   export NODE_OPTIONS="--max-old-space-size=4096"
   bun run build
   ```

3. **Check environment variables**:
   ```bash
   # Ensure .env.local exists with required variables
   cp .env.example .env.local
   ```

### API Route Issues

**Problem**: API routes not working

```bash
Error: Cannot find module for API route
```

**Solutions**:

1. **Check file structure**:

   ```
   app/api/
   ├── route.ts         # Correct
   └── timers/
       └── route.ts     # Correct
   ```

2. **Verify export format**:

   ```typescript
   // app/api/route.ts
   import { NextResponse } from 'next/server';

   export async function GET() {
     return NextResponse.json({ message: 'Hello World' });
   }
   ```

3. **Check for dynamic routes**:
   ```typescript
   // app/api/timers/[id]/route.ts
   export async function GET(
     request: Request,
     { params }: { params: { id: string } }
   ) {
     // Implementation
   }
   ```

### Development Server Issues

**Problem**: Dev server not starting

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions**:

1. **Kill process on port 3000**:

   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9

   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Use different port**:

   ```bash
   PORT=3001 bun dev
   ```

3. **Check for other Next.js instances**:
   ```bash
   ps aux | grep next
   ```

## Internationalization Issues

### Translation Not Loading

**Problem**: Translations not showing

```typescript
// t('common.start') returns key instead of translation
```

**Solutions**:

1. **Check i18n configuration**:

   ```typescript
   // i18n.ts
   import { getRequestConfig } from 'next-intl/server';

   export default getRequestConfig(async ({ locale }) => ({
     messages: (await import(`../messages/${locale}.json`)).default,
   }));
   ```

2. **Verify translation file exists**:

   ```bash
   ls -la messages/en.json
   ```

3. **Check JSON syntax**:

   ```bash
   bunx jsonlint messages/en.json
   ```

4. **Restart development server** after adding new locales

### Locale Detection Not Working

**Problem**: Always defaulting to English locale

```bash
# URL should be /pt-br/home but shows /en/home
```

**Solutions**:

1. **Check middleware configuration**:

   ```typescript
   // middleware.ts
   import createMiddleware from 'next-intl/middleware';

   export default createMiddleware({
     locales: ['en', 'pt-br', 'es', 'fr', 'de'],
     defaultLocale: 'en',
   });
   ```

2. **Verify middleware matcher**:

   ```typescript
   export const config = {
     matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
   };
   ```

3. **Clear browser cache and cookies**:
   ```bash
   # Clear browser or use incognito mode
   ```

## Testing Issues

### Jest Configuration Errors

**Problem**: Jest configuration errors

```bash
Jest encountered an unexpected token
```

**Solutions**:

1. **Check jest.config.js**:

   ```javascript
   const nextJest = require('next/jest');

   const createJestConfig = nextJest({
     dir: './',
   });

   const customJestConfig = {
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     moduleNameMapping: {
       '^@/(.*)$': '<rootDir>/$1',
     },
     testEnvironment: 'jest-environment-jsdom',
   };

   module.exports = createJestConfig(customJestConfig);
   ```

2. **Create jest.setup.js**:

   ```javascript
   // jest.setup.js
   import '@testing-library/jest-dom';
   ```

3. **Check NODE_OPTIONS**:
   ```bash
   export NODE_OPTIONS="--experimental-vm-modules"
   bun test
   ```

### Test Environment Issues

**Problem**: Tests failing with DOM errors

```bash
ReferenceError: document is not defined
```

**Solutions**:

1. **Verify test environment**:

   ```javascript
   // jest.config.js
   module.exports = {
     testEnvironment: 'jest-environment-jsdom',
   };
   ```

2. **Mock window/document if needed**:

   ```typescript
   // __mocks__/fileMock.js
   module.exports = 'test-file-stub';
   ```

3. **Check for server-side code in tests**:
   ```typescript
   // Avoid testing server-only code in client tests
   if (typeof window === 'undefined') {
     // Skip or mock server code
   }
   ```

## Performance Issues

### Slow Development Server

**Problem**: Dev server starting slowly

```bash
# bun dev takes >30 seconds to start
```

**Solutions**:

1. **Check dependencies count**:

   ```bash
   bunx ls
   ```

2. **Remove unused dependencies**:

   ```bash
   bunx depcheck
   ```

3. **Increase Node.js memory**:

   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   bun dev
   ```

4. **Use SWC instead of Babel** (if applicable):
   ```javascript
   // next.config.js
   experimental: {
     swcMinify: true,
   }
   ```

### Bundle Size Too Large

**Problem**: Production bundle too large

```bash
# Bundle > 1MB for initial load
```

**Solutions**:

1. **Analyze bundle**:

   ```bash
   bun run build:analyze
   ```

2. **Optimize imports**:

   ```typescript
   // Instead of
   import { Button, Input, Card, Modal } from 'ui-library';

   // Use
   import { Button } from 'ui-library/button';
   import { Input } from 'ui-library/input';
   ```

3. **Remove unused code**:

   ```bash
   bunx ts-unused-exports tsconfig.json
   ```

4. **Use dynamic imports**:
   ```typescript
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <div>Loading...</div>
   });
   ```

## Mobile Development Issues

### Capacitor Build Failures

**Problem**: Mobile app build fails

```bash
Error: Cannot find module 'capacitor'
```

**Solutions**:

1. **Install Capacitor CLI**:

   ```bash
   bun add -d @capacitor/cli
   npx cap init
   ```

2. **Check capacitor.config.ts**:

   ```typescript
   import { CapacitorConfig } from '@capacitor/cli';

   const config: CapacitorConfig = {
     appId: 'com.cuetimer.app',
     appName: 'CueTimer',
     webDir: 'out',
   };
   ```

3. **Sync project**:
   ```bash
   bun run mobile:sync
   ```

### Native Features Not Working

**Problem**: Camera, notifications not working

```bash
# Permission denied or feature not available
```

**Solutions**:

1. **Install required plugins**:

   ```bash
   bun add @capacitor/camera @capacitor/notifications
   ```

2. **Request permissions**:

   ```typescript
   import { Camera, CameraResultType } from '@capacitor/camera';

   const photo = await Camera.getPhoto({
     resultType: CameraResultType.Uri,
   });
   ```

3. **Test on real device** (not simulator)

## Getting Help

### Diagnostic Commands

```bash
# System information
node --version
bun --version
npm --version
git --version

# Project information
bun run type-check
bun run lint:all
bun test --coverage

# Build diagnostics
bun run build:analyze
bun run perf:audit
```

### Log Files to Check

- `.next/build.log` - Next.js build logs
- `bun.lockb` - Dependency lock file
- `coverage/lcov-report/index.html` - Test coverage report

### Community Resources

- Next.js Discord: https://discord.gg/nextjs
- Tailwind CSS Discord: https://discord.gg/tailwindcss
- Stack Overflow: Tag with `nextjs`, `tailwindcss`, `typescript`

### Internal Resources

- Check `docs/` directory for specific documentation
- Review existing GitHub issues
- Contact development team in internal chat

---

**Last Updated:** 2025-10-23 **Maintained by:** Development Team **Review
Frequency:** Monthly **Next Review:** 2025-11-23

````

## File: `docs/development/roadmap/next-steps-ARCHIVED.md`

```markdown
# ARCHIVED: Next Steps Development Roadmap

**⚠️ ARCHIVED DOCUMENT - REDIRECT REQUIRED**

This document has been superseded by the consolidated master roadmap.

## **Current Authoritative Roadmap**

👉
**[../strategy/roadmap/project-roadmap-master.md](../strategy/roadmap/project-roadmap-master.md)**

---

## Archive Information

**Archived Date:** October 24, 2025 **Reason:** Consolidated into master roadmap
for comprehensive coverage **Replacement:**
`../strategy/roadmap/project-roadmap-master.md`

### What Was Archived

This document contained development implementation details that have now been
integrated into the consolidated master roadmap along with strategic planning
content.

### Migration Details

All implementation tasks, technical specifications, and development priorities
from this document have been incorporated into:

- **Phase 1:** Enhanced with detailed implementation tasks
- **Phase 2-4:** Added technical implementation specifics
- **Technical Appendix:** Consolidated all infrastructure details
- **QA Checklist:** Integrated quality standards

---

## Quick Reference

### Current Development Environment ✅

- **Next.js 15.1.6** with TypeScript setup
- **Bun package manager** integration
- **Tailwind CSS v4.1.16** with PostCSS
- **shadcn/ui components** installed
- **Internationalization** with next-intl (5 locales)
- **Development server:** `http://localhost:3000` ✅

### Immediate Priority: Phase 1 Marketing Infrastructure

**Week 1 Tasks:**

- Install required payment and marketing packages
- Configure development environment
- Implement brand theme development
- Set up Stripe integration

---

**For current development planning and detailed implementation tasks, please use
the master roadmap document.**
````

## File: `docs/development/roadmap/next-steps.md`

```markdown
# REDIRECT: Next Steps Development Roadmap

**⚠️ DOCUMENT MOVED - NEW LOCATION**

This development roadmap has been consolidated into the master project roadmap.

## **👉 Current Authoritative Roadmap**

**[../strategy/roadmap/project-roadmap-master.md](../strategy/roadmap/project-roadmap-master.md)**

---

## Why This Change?

The development implementation details have been integrated with strategic
planning to create a single, comprehensive master document that provides both
strategic direction and tactical execution guidance.

### What's Now in the Master Document:

- ✅ All development tasks and implementation details
- ✅ Enhanced with strategic context and business metrics
- ✅ Technical specifications and infrastructure details
- ✅ Unified timeline and resource allocation
- ✅ Consolidated success metrics and KPIs
- ✅ Quality standards and QA checklists

### Quick Reference - Current Status:

**Foundation Complete ✅**

- Next.js 15.1.6 with TypeScript
- Bun package manager
- Tailwind CSS v4.1.16
- shadcn/ui components
- Development server running at localhost:3000

**Current Phase: Phase 1 - Marketing Infrastructure (Weeks 1-4)**

- Priority: Critical
- Status: Ready to Start
- Focus: Autonomous marketing infrastructure with payment processing

---

**Please update your bookmarks and references to use the new master roadmap
document.**
```

## File: `docs/development/setup/technical-setup-summary.md`

````markdown
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
````

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
- [ ] Build autonomous marketing infrastructure (QuoteKit patterns as reference
      only)
- [ ] Add testing infrastructure

### Future Enhancements

- [ ] PWA configuration
- [ ] Service worker implementation
- [ ] Advanced caching strategies
- [ ] Monitoring and analytics

---

**Last Updated:** 2025-10-23 **Maintained by:** Development Team **Review
Frequency:** Monthly **Next Review:** 2025-11-23

````

## File: `docs/development/type-check/README.md`

```markdown
[Binary file]
````
