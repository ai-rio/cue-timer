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
