# Chunk 64: other\_.husky

## Metadata

- **Files**: 3
- **Size**: 3,883 characters (~970 tokens)
- **Categories**: other

## Files in this chunk

- `.husky/commit-msg`
- `.husky/post-commit`
- `.husky/pre-commit`

---

## File: `.husky/commit-msg`

```
#!/usr/bin/env bash

echo "📝 Validating CueTimer commit message..."

# Run commitlint
bunx commitlint --edit $1 --config commitlint.config.cjs || {
    echo ""
    echo "❌ Commit message validation failed!"
    echo ""
    echo "Commit messages must follow the conventional commit format:"
    echo "  type(scope): description"
    echo ""
    echo "CueTimer-specific examples:"
    echo "  feat(timer): add countdown display with large numbers"
    echo "  fix(mobile): resolve touch gesture conflicts on iOS"
    echo "  docs(marketing): update landing page features"
    echo "  content(pricing): add new pricing tiers with testimonials"
    echo "  refactor(supabase): optimize timer events query"
    echo "  test(timer): add integration tests for timer sync"
    echo "  perf(mobile): reduce bundle size for faster initial load"
    echo ""
    echo "Available types: feat, fix, docs, style, refactor, perf, test, chore,"
    echo "build, ci, revert, bump, lint, security, deps, i18n, wip, content,"
    echo "mobile, timer, marketing, supabase, billing"
    echo ""
    exit 1
}

echo "✅ Commit message validation passed!"
```

## File: `.husky/post-commit`

```
#!/usr/bin/env bash

echo "📊 Recording CueTimer commit metrics..."

# Get commit info
COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_AUTHOR=$(git log -1 --format='%an')
COMMIT_DATE=$(git log -1 --format='%ad' --date=short)
FILES_CHANGED=$(git diff-tree --no-commit-id --name-only -r HEAD)
FILE_COUNT=$(echo "$FILES_CHANGED" | wc -l)

# Calculate commit size
ADDITIONS=$(git diff --stat HEAD~1 HEAD | tail -1 | grep -o '[0-9]*' | head -1)
DELETIONS=$(git diff --stat HEAD~1 HEAD | tail -1 | grep -o '[0-9]*' | head -2 | tail -1)

# Log metrics
echo "Commit: $COMMIT_HASH"
echo "Author: $COMMIT_AUTHOR"
echo "Date: $COMMIT_DATE"
echo "Files changed: $FILE_COUNT"
echo "Additions: ${ADDITIONS:-0}"
echo "Deletions: ${DELETIONS:-0}"

# Check for specific CueTimer patterns
if echo "$FILES_CHANGED" | grep -q "supabase/migrations"; then
    echo "🗄️ Supabase migration committed"
fi

if echo "$FILES_CHANGED" | grep -q "src/components/timer\|src/app/timer"; then
    echo "⏱️ Timer functionality updated"
fi

if echo "$FILES_CHANGED" | grep -q "content/\|src/components/marketing"; then
    echo "📈 Marketing content updated"
fi

if echo "$FILES_CHANGED" | grep -q "ios/\|android/\|capacitor.config"; then
    echo "📱 Mobile configuration updated"
fi

if echo "$FILES_CHANGED" | grep -q "src/app/marketing"; then
    echo "🌐 Marketing site updated"
fi

if echo "$FILES_CHANGED" | grep -q ".md\|.mdx"; then
    echo "📝 Documentation/content files updated"
fi

if echo "$FILES_CHANGED" | grep -q "src/components"; then
    echo "🧩 Components updated"
fi

if echo "$FILES_CHANGED" | grep -q "src/app"; then
    echo "🚀 App routes updated"
fi

# Optional: Trigger deployment or other post-commit actions
# Uncomment and modify as needed
# if echo "$FILES_CHANGED" | grep -q "src/app/marketing"; then
#     echo "🚀 Triggering marketing site deployment..."
#     # Trigger deployment webhook
# fi

echo "🎉 CueTimer commit $COMMIT_HASH completed successfully!"

# Performance tip
if [ "${ADDITIONS:-0}" -gt 500 ]; then
    echo "💡 Tip: Large commit detected. Consider breaking into smaller commits for better tracking."
fi
```

## File: `.husky/pre-commit`

```
#!/usr/bin/env bash

echo "🚀 CueTimer Pre-commit Checks Starting..."

# Check for staged frontend files and run lint-staged
if git diff --cached --name-only | grep -qE "\.(ts|tsx|js|jsx|css|scss|less|json|md|mdx)$"; then
    echo "📝 Running frontend checks..."

    echo "  📝 Running lint-staged..."
    bunx lint-staged || {
        echo "❌ Lint-staged failed - fix errors before committing"
        exit 1
    }

    echo "  📝 Running TypeScript type checking..."
    bun run type-check || {
        echo "❌ TypeScript type checking failed - fix type errors before committing"
        exit 1
    }
fi

echo "✅ All pre-commit checks passed!"
```
