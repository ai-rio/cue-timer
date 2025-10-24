# CueTimer Husky & Code Quality Setup

This guide explains the Husky-based code quality setup adapted from CV-Match for
CueTimer's Next.js + Marketing + Timer application.

## 🚀 Quick Setup

### Prerequisites

- **Bun** >= 1.0.0 (recommended)
- **Node.js** >= 18.0.0
- **Git** with hooks enabled

### Installation

1. **Install Dependencies**

   ```bash
   bun install
   ```

2. **Set up Husky Hooks**

   ```bash
   bun run hooks:install
   ```

3. **Verify Setup**
   ```bash
   bun run quality:check
   ```

## 📁 Configuration Files

| File                     | Purpose                              | Key Features                              |
| ------------------------ | ------------------------------------ | ----------------------------------------- |
| `package.json`           | Main project config with Bun scripts | Mobile, timer, marketing specific scripts |
| `eslint.config.js`       | Modern flat ESLint config            | TypeScript, React, marketing rules        |
| `prettier.config.mjs`    | Code formatting                      | Tailwind plugin, MDX support              |
| `lint-staged.config.cjs` | Staged file linting                  | File-type specific rules                  |
| `commitlint.config.cjs`  | Commit message validation            | CueTimer-specific commit types            |
| `tsconfig.json`          | TypeScript configuration             | MDX support, path aliases                 |
| `.husky/`                | Git hooks directory                  | Pre-commit, commit-msg, post-commit       |

## 🎯 Available Scripts

### Development

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
```

### Code Quality

```bash
bun run lint         # Run ESLint on all files
bun run lint:fix     # Auto-fix ESLint issues
bun run format       # Format code with Prettier
bun run type-check   # TypeScript type checking
bun run quality:check # Run all quality checks
bun run quality:fix  # Auto-fix all quality issues
```

### Testing

```bash
bun run test         # Run tests
bun run test:watch   # Run tests in watch mode
bun run test:coverage # Run tests with coverage
```

### Content & Marketing

```bash
bun run content:check    # Validate markdown content
bun run content:validate # Validate MDX files
bun run mdx:check        # Check MDX syntax
```

### Mobile Development

```bash
bun run mobile:build     # Build mobile app
bun run mobile:sync      # Sync with Capacitor
bun run mobile:run:ios   # Run on iOS
bun run mobile:run:android # Run on Android
```

### Supabase Integration

```bash
bun run supabase:types   # Generate TypeScript types
bun run supabase:migrations:new # Create new migration
bun run supabase:db:reset # Reset database
```

## 🔧 Git Hooks

### Pre-commit Hook

- ✅ Runs lint-staged on staged files
- ✅ TypeScript type checking
- ✅ Content validation for MD/MDX files
- ✅ Supabase migration validation
- ✅ File size checks (5MB limit)
- ✅ Sensitive data detection
- ✅ Timer and marketing specific validations

### Commit-msg Hook

- ✅ Conventional commit format validation
- ✅ CueTimer-specific commit types
- ✅ Issue prefix validation (CUE-, TIMER-, MOBILE-, etc.)
- ✅ Breaking change detection

### Post-commit Hook

- ✅ Commit metrics logging
- ✅ Change type detection
- ✅ Performance tips for large commits

## 📝 Commit Message Format

CueTimer extends conventional commits with project-specific types:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Available Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Test additions/modifications
- `chore` - Maintenance tasks
- `build` - Build system changes
- `ci` - CI configuration changes
- `revert` - Revert previous commit
- `content` - Marketing/content changes
- `mobile` - Mobile-specific changes
- `timer` - Timer feature changes
- `marketing` - Marketing site changes
- `supabase` - Database/Supabase changes
- `billing` - Billing/payment changes

### Examples

```
feat(timer): add countdown display with large numbers
fix(mobile): resolve touch gesture conflicts on iOS
docs(marketing): update landing page features
content(pricing): add new pricing tiers with testimonials
refactor(supabase): optimize timer events query
test(timer): add integration tests for timer sync
perf(mobile): reduce bundle size for faster initial load
```

## 🎨 Code Style Rules

### ESLint Configuration Highlights

- **Flat config** with TypeScript support
- **Prettier integration** for consistent formatting
- **Import sorting** with simple-import-sort
- **Different rules** for different file types:
  - Marketing components: More flexible
  - Timer components: Stricter rules for reliability
  - Test files: Relaxed rules
  - MDX files: Content-specific rules

### Prettier Configuration

- **Tailwind CSS** class sorting
- **MDX/Markdown** support with appropriate line widths
- **JSON/YAML** specific formatting
- **Consistent quotes** and semicolons

## 🧪 Testing Integration

The setup includes comprehensive testing configuration:

- **Jest** with TypeScript support
- **React Testing Library** for component testing
- **Coverage reporting** with thresholds
- **Watch mode** for development
- **CI mode** for automated pipelines

## 📱 Mobile-Specific Features

Since CueTimer targets both web and mobile platforms:

- **Capacitor integration** scripts
- **iOS/Android build** commands
- **Mobile-specific linting** rules
- **Cross-platform path aliases**

## 🗄️ Supabase Integration

For the database layer:

- **Type generation** from Supabase schema
- **Migration validation** in pre-commit hooks
- **SQL syntax checking** for destructive operations
- **Database reset** and sync commands

## 🔍 Troubleshooting

### Common Issues

1. **Husky hooks not running**

   ```bash
   chmod +x .husky/*
   bun run hooks:install
   ```

2. **TypeScript errors in build**

   ```bash
   bun run type-check
   bun run quality:fix
   ```

3. **Lint-staged failures**

   ```bash
   bun run lint:fix
   bun run format
   ```

4. **MDX content validation errors**

   ```bash
   bun run content:validate
   # Fix content issues
   ```

5. **Mobile build issues**
   ```bash
   bun run mobile:sync
   # Ensure Capacitor is properly configured
   ```

### Performance Tips

- **Large commits**: Break into smaller, focused commits
- **Bundle size**: Use `bun run perf:bundle` to analyze
- **Content validation**: Run `bun run content:check` before commits
- **Type checking**: Use `bun run type-check:watch` during development

## 🔄 Migration from Existing Projects

If migrating an existing CueTimer project:

1. **Backup current configurations**
2. **Install new dependencies**: `bun install`
3. **Replace configuration files** with the ones in this guide
4. **Run setup**: `bun run hooks:install`
5. **Fix any initial issues**: `bun run quality:fix`
6. **Test thoroughly**: `bun run quality:check`

## 🎯 Best Practices

1. **Commit often** with focused changes
2. **Use conventional commits** for better tracking
3. **Run quality checks** locally before pushing
4. **Write tests** for timer functionality
5. **Validate content** before publishing
6. **Monitor bundle size** for mobile performance
7. **Use TypeScript** strictly for timer components
8. **Follow mobile-first** design principles

## 📚 Additional Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [ESLint Next.js Guide](https://nextjs.org/docs/basic-features/eslint)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Supabase TypeScript Types](https://supabase.com/docs/reference/javascript/typescript-support)
