# Chunk 20: config_root

## Metadata

- **Files**: 3
- **Size**: 8,078 characters (~2,019 tokens)
- **Categories**: config

## Files in this chunk

- `lighthouserc.json`
- `package.json`
- `tsconfig.json`

---

## File: `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "bun run start",
      "startServerReadyPattern": "ready on",
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/blog",
        "http://localhost:3000/pricing"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.8 }],
        "categories:seo": ["warn", { "minScore": 0.8 }],
        "categories:pwa": "off"
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## File: `package.json`

```json
{
  "name": "cue-timer",
  "version": "0.1.0",
  "description": "Professional presentation timer platform with real-time sync",
  "private": true,
  "type": "module",
  "scripts": {
    "prepare": "husky .husky",
    "hooks:install": "husky install",
    "hooks:uninstall": "husky uninstall",
    "dev": "bun run dev:web",
    "dev:web": "next dev",
    "build": "bun run build:web",
    "build:web": "next build",
    "build:analyze": "ANALYZE=true next build",
    "start": "next start",
    "lint": "bunx lint-staged",
    "lint:all": "bunx eslint . --max-warnings=0",
    "lint:fix": "bunx eslint . --fix",
    "format": "bunx prettier --write .",
    "format:check": "bunx prettier --check .",
    "type-check": "bunx tsc --noEmit",
    "type-check:watch": "bunx tsc --noEmit --watch",
    "test": "NODE_OPTIONS=--experimental-vm-modules bunx jest",
    "test:watch": "NODE_OPTIONS=--experimental-vm-modules bunx jest --watch",
    "test:coverage": "NODE_OPTIONS=--experimental-vm-modules bunx jest --coverage",
    "test:ci": "bunx jest --ci --coverage --watchAll=false",
    "content:check": "bunx contentlint --content-dir content",
    "content:validate": "bunx remark --frail --quiet content/**/*.md",
    "mdx:check": "bunx next-mdx-remote-check content/**/*.mdx",
    "quality:check": "bun run lint:all && bun run type-check && bun run test:ci",
    "quality:fix": "bun run lint:fix && bun run format",
    "deps:check": "bunx npm-check-updates",
    "deps:update": "bunx npm-check-updates -u",
    "security:audit": "bunx audit",
    "security:fix": "bunx audit fix",
    "supabase:types": "bunx supabase gen types typescript --local > src/types/supabase.ts",
    "supabase:migrations:new": "bunx supabase migration new",
    "supabase:db:reset": "bunx supabase db reset",
    "supabase:db:push": "bunx supabase db push",
    "mobile:build": "bunx cap build",
    "mobile:sync": "bunx cap sync",
    "mobile:run:ios": "bunx cap run ios",
    "mobile:run:android": "bunx cap run android",
    "perf:audit": "bunx lighthouse --chrome-flags='--headless' --output=html --output-path=./reports/lighthouse.html http://localhost:3000",
    "perf:bundle": "ANALYZE=true bun run build",
    "bundle-analyzer": "bunx @next/bundle-analyzer",
    "blog:create": "tsx scripts/blog-create.ts",
    "blog:publish": "tsx scripts/blog-publish.ts",
    "blog:analytics": "tsx scripts/blog-analytics.ts",
    "blog:seo-check": "tsx scripts/blog-seo-check.ts",
    "blog:workflow:status": "tsx scripts/blog-workflow-status.ts"
  },
  "devDependencies": {
    "@commitlint/cli": "^19.5.0",
    "@commitlint/config-conventional": "^19.5.0",
    "@eslint/eslintrc": "^3",
    "@next/bundle-analyzer": "^15.1.6",
    "@tailwindcss/postcss": "^4",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/inquirer": "^9.0.9",
    "@types/jest": "^30.0.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/tailwindcss": "^3.1.0",
    "@typescript-eslint/eslint-plugin": "^8.15.0",
    "@typescript-eslint/parser": "^8.15.0",
    "eslint": "^9.27.0",
    "eslint-config-next": "^15.1.6",
    "eslint-config-prettier": "^10.1.5",
    "eslint-nibble": "^9.1.1",
    "eslint-plugin-prettier": "^5.4.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.0.0",
    "eslint-plugin-simple-import-sort": "^12.1.1",
    "husky": "^9.1.7",
    "jest": "^30.2.0",
    "jest-environment-jsdom": "^30.2.0",
    "lint-staged": "^15.2.10",
    "prettier": "^3.5.3",
    "prettier-plugin-tailwindcss": "^0.6.14",
    "remark": "^15.0.1",
    "remark-cli": "^12.0.1",
    "tsx": "^4.20.6",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.15.0"
  },
  "dependencies": {
    "@capacitor/android": "^6.1.2",
    "@capacitor/app": "^6.0.1",
    "@capacitor/core": "^6.1.2",
    "@capacitor/ios": "^6.1.2",
    "@heroicons/react": "^2.2.0",
    "@hookform/resolvers": "^5.2.2",
    "@ionic/react": "^8.4.2",
    "@ionic/react-router": "^8.4.2",
    "@next/mdx": "^16.0.0",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@react-email/components": "^0.5.7",
    "@react-email/tailwind": "^1.2.2",
    "@stripe/react-stripe-js": "^5.2.0",
    "@stripe/stripe-js": "^8.1.0",
    "@supabase/ssr": "^0.7.0",
    "@supabase/supabase-js": "^2.39.3",
    "@tailwindcss/typography": "^0.5.19",
    "@types/stripe": "^8.0.417",
    "autoprefixer": "^10.4.21",
    "chalk": "^5.6.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "commander": "^14.0.2",
    "date-fns": "^4.1.0",
    "framer-motion": "^12.23.24",
    "glob": "^11.0.3",
    "gray-matter": "^4.0.3",
    "inquirer": "^12.10.0",
    "lucide-react": "^0.546.0",
    "mdx-embed": "^1.0.0",
    "next": "^15.1.6",
    "next-intl": "^4.3.6",
    "next-mdx-remote": "^5.0.0",
    "next-themes": "^0.4.6",
    "ora": "^9.0.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.65.0",
    "react-router-dom": "^5.3.4",
    "reading-time": "^1.5.0",
    "rehype-highlight": "^7.0.2",
    "rehype-prism-plus": "^2.0.1",
    "resend": "^6.2.2",
    "stripe": "^19.1.0",
    "tailwind-merge": "^3.3.1",
    "tailwindcss": "^4",
    "web-vitals": "^4.2.4",
    "zod": "^4.1.12"
  },
  "engines": {
    "node": ">=18.0.0",
    "bun": ">=1.0.0"
  },
  "keywords": [
    "timer",
    "presentation",
    "speaker",
    "events",
    "next.js",
    "supabase",
    "mobile",
    "pwa"
  ]
}
```

## File: `tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "types": ["jest", "@testing-library/jest-dom"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "incremental": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/store/*": ["./store/*"],
      "@/utils/*": ["./utils/*"],
      "@/styles/*": ["./styles/*"],
      "@/content/*": ["./content/*"],
      "@/app/*": ["./app/*"]
    },
    "target": "ES2017",
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": [
    "next-env.d.ts",
    ".next/types/**/*.ts",
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx",
    "**/*.mdx",
    "content/**/*.md",
    "content/**/*.mdx",
    ".next/dev/types/**/*.ts",
    "jest.config.*.js",
    "*.config.js",
    "global.d.ts",
    "types/**/*.d.ts"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "out",
    "build",
    "coverage",
    "ios",
    "android"
  ]
}
```
