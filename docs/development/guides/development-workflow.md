# Development Workflow Guide

## Overview

This guide outlines the complete development workflow for CueTimer, from initial
setup to deployment. It follows modern development practices with an emphasis on
code quality, collaboration, and efficiency.

## Prerequisites

### Required Tools

- **Node.js** >= 18.0.0
- **Bun** >= 1.0.0
- **Git** (latest stable version)
- **VS Code** (recommended) with extensions

### VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Auto Rename Tag
- GitLens
- Thunder Client (for API testing)

## Initial Setup

### 1. Repository Setup

```bash
# Clone the repository
git clone <repository-url>
cd cue-timer

# Install dependencies
bun install

# Set up development environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize Git hooks
bun run prepare
```

### 2. Environment Configuration

Create `.env.local` with:

```bash
# Development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (when implemented)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth (when implemented)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 3. Verification

```bash
# Start development server
bun dev

# Verify all quality checks pass
bun run quality:check

# Run tests
bun test
```

## Daily Development Workflow

### 1. Start Development

```bash
# Pull latest changes
git pull origin develop

# Install any new dependencies
bun install

# Start development server
bun dev

# In another terminal, run tests in watch mode
bun test:watch

# Optional: Type checking in watch mode
bun run type-check:watch
```

### 2. Creating a New Feature

#### Branch Creation

```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Use conventional naming:
# feature/feature-name
# bugfix/bug-description
# chore/maintenance-task
# hotfix/critical-fix
```

#### Development Process

1. **Plan the implementation**
   - Review requirements
   - Break down into small tasks
   - Consider edge cases

2. **Create components/pages**

   ```bash
   # Example: Creating a new component
   mkdir -p components/timer
   touch components/timer/timer-display.tsx
   touch components/timer/timer-controls.tsx
   ```

3. **Follow code patterns**

   ```typescript
   // Component structure
   import React from 'react';
   import { cn } from '@/lib/utils';

   interface TimerDisplayProps {
     time: number;
     className?: string;
   }

   export const TimerDisplay: React.FC<TimerDisplayProps> = ({
     time,
     className
   }) => {
     return (
       <div className={cn("timer-display", className)}>
         {/* Component content */}
       </div>
     );
   };
   ```

4. **Add tests**

   ```typescript
   // __tests__/timer-display.test.tsx
   import { render, screen } from '@testing-library/react';
   import { TimerDisplay } from '../timer-display';

   describe('TimerDisplay', () => {
     it('renders time correctly', () => {
       render(<TimerDisplay time={60} />);
       expect(screen.getByText('01:00')).toBeInTheDocument();
     });
   });
   ```

### 3. Code Quality Workflow

#### During Development

- **Automatic formatting**: Prettier runs on save in VS Code
- **Linting**: ESLint shows real-time errors
- **Type checking**: TypeScript provides immediate feedback

#### Before Committing

```bash
# Format all files
bun run format

# Run full lint check
bun run lint:all

# Type check
bun run type-check

# Run tests
bun test

# Optional: Full quality check
bun run quality:check
```

### 4. Commit Process

#### Pre-commit Hooks (Automatic)

Husky automatically runs:

1. **lint-staged**: Formats and lints staged files
2. **Commitlint**: Validates commit message format

#### Commit Message Format

```bash
# Conventional commits required
feat: add timer display component
fix: resolve styling issue on mobile
docs: update API documentation
refactor: extract timer logic into custom hook
test: add unit tests for timer utilities
chore: update dependencies

# With scope and breaking change
feat(timer): add countdown functionality
BREAKING CHANGE: Timer component API updated

# With description
feat(i18n): add Portuguese translations

Add support for Brazilian Portuguese locale including:
- Time format translations
- UI text translations
- Date/time localization
```

### 5. Pull Request Process

#### Creating a Pull Request

1. **Push branch to remote**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR in GitHub**
   - Target: `develop` branch
   - Title: Follow conventional commit format
   - Description: Include testing instructions and relevant context

3. **PR Template**

   ```markdown
   ## Description

   Brief description of changes

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing

   - [ ] Unit tests pass
   - [ ] Manual testing completed
   - [ ] Cross-browser tested
   - [ ] Mobile tested

   ## Checklist

   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] Tests added/updated
   ```

#### Code Review Process

1. **Self-review**: Review your own changes first
2. **Team review**: Request review from team members
3. **Address feedback**: Make requested changes
4. **Approval**: Get required approvals
5. **Merge**: Merge to develop branch

## Branch Strategy

### Main Branches

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features

### Supporting Branches

- **`feature/*`**: New features
- **`bugfix/*`**: Bug fixes
- **`hotfix/*`**: Critical production fixes
- **`release/*`**: Release preparation

### Branch Protection Rules

- **Develop branch**:
  - Require pull request reviews
  - Require status checks to pass
  - Require up-to-date branches

- **Main branch**:
  - All develop protections
  - Additional approval requirements

## Testing Strategy

### Test Types

1. **Unit Tests**: Component and utility function tests
2. **Integration Tests**: Component interaction tests
3. **E2E Tests**: Full user journey tests (planned)

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Generate coverage report
bun test:coverage

# Run specific test file
bun test TimerDisplay.test.tsx

# Run tests matching pattern
bun test --testNamePattern="timer"
```

### Test Organization

```
src/
├── components/
│   └── timer/
│       ├── timer-display.tsx
│       └── __tests__/
│           └── timer-display.test.tsx
├── lib/
│   ├── timer.ts
│   └── __tests__/
│       └── timer.test.ts
```

## Deployment Workflow

### Development Deployment

```bash
# Build for development
bun run build

# Start production server locally
bun start
```

### Staging Deployment (Future)

```bash
# Deploy to staging
bun run deploy:staging

# Run integration tests
bun run test:e2e:staging
```

### Production Deployment (Future)

```bash
# Deploy to production
bun run deploy:production

# Run smoke tests
bun run test:smoke
```

## Troubleshooting Guide

### Common Issues

#### Dependency Issues

```bash
# Clear cache and reinstall
rm -rf node_modules
rm bun.lockb
bun install
```

#### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
bun run build
```

#### TypeScript Errors

```bash
# Check specific errors
bun run type-check

# Generate detailed report
bun run type-check > type-errors.txt
```

#### Test Failures

```bash
# Run tests with verbose output
bun test --verbose

# Run tests with coverage
bun test --coverage

# Debug specific test
bun test --testNamePattern="failing test"
```

### Getting Help

1. Check documentation in `docs/`
2. Search existing issues
3. Ask in team chat
4. Create new issue with detailed description

## Performance Guidelines

### Development Performance

- Use `bun dev` for fast development server
- Enable Fast Refresh in VS Code
- Use TypeScript watch mode for immediate feedback

### Build Performance

- Analyze bundle size: `bun run build:analyze`
- Optimize imports and dependencies
- Use code splitting for large components

### Runtime Performance

- Profile React components with React DevTools
- Use Next.js built-in optimizations
- Implement lazy loading where appropriate

## Code Quality Standards

### TypeScript

- Use strict mode
- Prefer explicit return types
- Use interfaces for object shapes
- Avoid `any` type

### React

- Use functional components with hooks
- Follow hooks rules strictly
- Use memo for expensive components
- Implement proper error boundaries

### CSS/Tailwind

- Use utility classes first
- Create component-specific classes when needed
- Follow responsive design patterns
- Maintain consistent spacing and colors

### Accessibility

- Use semantic HTML
- Implement ARIA labels
- Ensure keyboard navigation
- Test with screen readers

## Collaboration Best Practices

### Code Reviews

- Be constructive and specific
- Focus on code quality, not style
- Suggest improvements, don't just point out issues
- Learn from each other's code

### Communication

- Use clear commit messages
- Document complex logic
- Update README when needed
- Share knowledge in team meetings

### Knowledge Sharing

- Document decisions in ADRs
- Share useful resources
- Pair program on complex features
- Conduct code walkthroughs

---

**Last Updated:** 2025-10-23 **Maintained by:** Development Team **Review
Frequency:** Monthly **Next Review:** 2025-11-23
