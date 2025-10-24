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

```
type(scope): description

[optional body]

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
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
feat(timer): add countdown display with large numbers
fix(mobile): resolve touch gesture conflicts on iOS
docs(marketing): update landing page features
content(pricing): add new pricing tiers with testimonials
refactor(supabase): optimize timer events query
test(timer): add integration tests for timer sync
perf(mobile): reduce bundle size for faster initial load
```

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
```

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

The Git Flow workflow is fully prepared for autonomous marketing infrastructure development:

1. **Feature Branches**: Ready for `feature/marketing-*` branches
2. **Marketing Content**: Dedicated `marketing` commit type available
3. **Content Validation**: MDX and markdown validation in place
4. **Code Quality**: Strict linting for marketing components
5. **Release Process**: Tested and ready for regular releases

### **IMPORTANT: QuoteKit Reference-Only Policy**
QuoteKit is used as reference inspiration only - **NO QuoteKit packages or dependencies** will be installed.

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
workflow suitable for the CueTimer project's autonomous marketing infrastructure development phase and
ongoing development.
