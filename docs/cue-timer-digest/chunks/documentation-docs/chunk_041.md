# Chunk 41: documentation_docs

## Metadata

- **Files**: 2
- **Size**: 19,110 characters (~4,777 tokens)
- **Categories**: documentation

## Files in this chunk

- `docs/development/guides/development-workflow.md`
- `docs/development/guides/git-workflow-guide.md`

---

## File: `docs/development/guides/development-workflow.md`

````markdown
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
````

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

````

## File: `docs/development/guides/git-workflow-guide.md`

```markdown
# CueTimer Git Flow Workflow Guide

## Overview

This guide documents the complete Git Flow workflow implementation for CueTimer,
including all pre-commit hooks, branch strategies, and development processes.

## Repository Status

✅ **Git Flow Structure**: Successfully implemented with proper branch hierarchy
✅ **Pre-commit Hooks**: Fully functional with linting and validation ✅
**Commit Message Validation**: Conventional commits with CueTimer-specific types
✅ **Code Quality**: ESLint, Prettier, and TypeScript checking integrated ✅
**Branch Protection**: Master and Develop branches protected via workflow

## Branch Structure

### Main Branches

- **`master`**: Production-ready code (protected)
- **`develop`**: Integration branch for features (protected)

### Supporting Branches

- **`feature/*`**: New features (branches from develop, merges to develop)
- **`release/*`**: Release preparation (branches from develop, merges to master
  and develop)
- **`hotfix/*`**: Emergency production fixes (branches from master, merges to
  master and develop)

## Pre-commit Hooks

### Pre-commit Hook (`.husky/pre-commit`)

- **Lint-staged**: Runs ESLint and Prettier on staged files
- **TypeScript checking**: Ensures type safety before commits
- **MDX validation**: Validates content files
- **File size checks**: Prevents large files (>5MB) from being committed
- **Security checks**: Warns about potential sensitive data

### Commit Message Hook (`.husky/commit-msg`)

- **Conventional Commits**: Enforces proper commit message format
- **CueTimer-specific types**: Includes timer, mobile, marketing, supabase,
  billing
- **Issue tracking**: Supports ticket prefixes (CUE-, TIMER-, MOBILE-, WEB-,
  CT-)

## Commit Message Format

````

type(scope): description

[optional body]

🤖 Generated with Claude Code Co-Authored-By: Claude <noreply@anthropic.com>

```

### Available Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/modifications
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI configuration changes
- `revert`: Revert previous commit
- `bump`: Version bump
- `lint`: Linting fixes
- `security`: Security fixes
- `deps`: Dependency updates
- `i18n`: Internationalization changes
- `wip`: Work in progress
- `content`: Marketing/content changes
- `mobile`: Mobile-specific changes
- `timer`: Timer feature changes
- `marketing`: Marketing site changes
- `supabase`: Database/Supabase changes
- `billing`: Billing/payment changes

### CueTimer-Specific Examples

```

feat(timer): add countdown display with large numbers fix(mobile): resolve touch
gesture conflicts on iOS docs(marketing): update landing page features
content(pricing): add new pricing tiers with testimonials refactor(supabase):
optimize timer events query test(timer): add integration tests for timer sync
perf(mobile): reduce bundle size for faster initial load

````

## Workflow Commands

### Feature Development

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
git push -u origin feature/your-feature-name

# Work on your feature...
git add .
git commit -m "feat(timer): add countdown functionality"

# Finish feature
git checkout develop
git pull origin develop
git merge --no-ff feature/your-feature-name
git push origin develop
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
````

### Release Process

```bash
# Start release
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Update version and prepare release
git commit -am "chore(release): bump version to 1.2.0"
git push -u origin release/v1.2.0

# Finish release
git checkout master
git pull origin master
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin master --tags
git checkout develop
git merge --no-ff release/v1.2.0
git push origin develop
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### Hotfix Process

```bash
# Start hotfix
git checkout master
git pull origin master
git checkout -b hotfix/critical-fix
git push -u origin hotfix/critical-fix

# Work on hotfix...
git add .
git commit -m "fix(timer): resolve critical countdown bug"

# Finish hotfix
git checkout master
git merge --no-ff hotfix/critical-fix
git tag -a v1.2.1 -m "Hotfix v1.2.1"
git push origin master --tags
git checkout develop
git merge --no-ff hotfix/critical-fix
git push origin develop
git branch -d hotfix/critical-fix
git push origin --delete hotfix/critical-fix
```

## Quality Assurance

### Pre-commit Quality Checks

- **ESLint**: Code linting with 20 warnings maximum
- **Prettier**: Code formatting
- **TypeScript**: Type checking without emitting
- **Remark**: Content validation for MDX files
- **File size validation**: Prevents large files
- **Security scanning**: Basic sensitive data detection

### Lint-staged Configuration

```javascript
// TypeScript/JavaScript files
'*.{ts,tsx,js,jsx}': [
  'eslint --fix --max-warnings=20 --config eslint.config.js',
  'prettier --write',
],

// MDX and markdown files
'*.{md,mdx}': [
  'prettier --write',
  'remark --frail --quiet',
],

// Config files
'*.{config.js,config.mjs,config.cjs,config.ts}': [
  'eslint --fix --max-warnings=20 --config eslint.config.js',
  'prettier --write',
],
```

## Current Status

### Active Branches

- `master` (production)
- `develop` (integration)

### Recent Tags

- `v0.1.1`: Hotfix release with workflow improvements
- `v0.1.0`: Initial release with Git Flow setup

### Workflow Health

- ✅ All pre-commit hooks functional
- ✅ Commit message validation working
- ✅ Proper branch hierarchy established
- ✅ Release process tested and working
- ✅ Hotfix workflow validated

## Best Practices

### DO

- ✅ Always pull before creating new branches
- ✅ Use descriptive branch names following conventions
- ✅ Write meaningful commit messages with proper format
- ✅ Run tests before finishing branches
- ✅ Keep feature branches small and focused
- ✅ Delete branches after merging
- ✅ Use conventional commit format
- ✅ Include proper scope in commits

### DON'T

- ❌ Push directly to master or develop
- ❌ Force push to shared branches
- ❌ Merge without running tests
- ❌ Create branches with unclear names
- ❌ Leave stale branches undeleted
- ❌ Ignore pre-commit hook failures
- ❌ Skip commit message validation
- ❌ Commit sensitive data

## Marketing Infrastructure Readiness

The Git Flow workflow is fully prepared for autonomous marketing infrastructure
development:

1. **Feature Branches**: Ready for `feature/marketing-*` branches
2. **Marketing Content**: Dedicated `marketing` commit type available
3. **Content Validation**: MDX and markdown validation in place
4. **Code Quality**: Strict linting for marketing components
5. **Release Process**: Tested and ready for regular releases

### **IMPORTANT: QuoteKit Reference-Only Policy**

QuoteKit is used as reference inspiration only - **NO QuoteKit packages or
dependencies** will be installed.

### Suggested Marketing Infrastructure Workflow

```bash
# Start marketing infrastructure feature
git checkout develop
git pull origin develop
git checkout -b feature/marketing-landing-page

# Work on marketing infrastructure (inspired by QuoteKit patterns)...
git add .
git commit -m "feat(marketing): build independent landing page components"

# Test and validate
bun run quality:check
bun run dev

# Complete implementation
git checkout develop
git merge --no-ff feature/marketing-landing-page
git push origin develop
```

## Troubleshooting

### Common Issues

1. **Pre-commit hook failures**
   - Check ESLint warnings and fix them
   - Ensure TypeScript compilation passes
   - Verify file formats are correct

2. **Commit message validation failures**
   - Use correct commit type from allowed list
   - Follow format: `type(scope): description`
   - Keep subject under 72 characters

3. **Merge conflicts**
   - Pull latest changes before merging
   - Resolve conflicts carefully
   - Test after conflict resolution

4. **Branch protection violations**
   - Never push directly to master/develop
   - Always use feature branches
   - Follow proper merge procedures

### Hook Issues

If hooks fail with encoding issues:

```bash
# Recreate hooks with proper encoding
rm .husky/pre-commit .husky/commit-msg
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env bash
# hook content here
EOF
chmod +x .husky/pre-commit
```

## Configuration Files

### Key Configuration Files

- `.husky/pre-commit`: Pre-commit quality checks
- `.husky/commit-msg`: Commit message validation
- `commitlint.config.cjs`: Commit message rules
- `lint-staged.config.cjs`: Staged file linting
- `eslint.config.js`: ESLint configuration
- `prettier.config.mjs`: Prettier formatting rules

## Continuous Integration

The workflow is designed to integrate seamlessly with CI/CD pipelines:

- **Pre-commit hooks** ensure quality before commits
- **Conventional commits** enable automated changelog generation
- **Semantic versioning** through proper release tagging
- **Branch protection** enforces proper workflow

This Git Flow implementation provides a robust, professional development
workflow suitable for the CueTimer project's autonomous marketing infrastructure
development phase and ongoing development.

```

```
