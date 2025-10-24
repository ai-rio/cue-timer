Mandatory Type Check Workflow for CueTimer Project

Based on docs/development/type-check/README.md methodology, this project
requires:

1. **Pre-build Type Check Mandatory**: Always run type checks before building
2. **Bulk Fix Methodology**: Use systematic approach for type errors
3. **Error Classification**:
   - Critical: Build-blocking errors (fix immediately)
   - High: Affects multiple files (within 1 day)
   - Medium: Local to component (within 1 week)
   - Low: Cosmetic (fix anytime)

Commands:

- `bun run type-check` - Fast TypeScript type check
- Count errors: `bun run type-check 2>&1 | grep "error TS" | wc -l`
- Group errors:
  `bun run type-check 2>&1 | grep "error TS" | sed 's/.*error \(TS[0-9]*\).*/\1/' | sort | uniq -c | sort -nr`

This workflow is mandatory for all development work to ensure code quality and
build reliability.
