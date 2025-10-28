# Chunk 45: documentation_docs

## Metadata

- **Files**: 3
- **Size**: 26,947 characters (~6,736 tokens)
- **Categories**: documentation

## Files in this chunk

- `docs/development/type-check/implementation-summary.md`
- `docs/development/type-check/integration-guide.md`
- `docs/development/type-check/quick-reference.md`

---

## File: `docs/development/type-check/implementation-summary.md`

````markdown
# Type Check Implementation Summary

## Overview

Successfully implemented a comprehensive dual type-check methodology for the
Resume-Matcher monorepo, covering both TypeScript (frontend) and Python
(backend) with unified tooling and documentation.

## What Was Implemented

### 1. Backend Type Checking (Pyright)

**Files Created/Modified:**

- `/apps/backend/pyrightconfig.json` - Pyright configuration with balanced
  strictness
- `/apps/backend/pyproject.toml` - Added pyright dependency (v1.1.390+)

**Configuration Highlights:**

- Type checking mode: `standard` (balanced for incremental adoption)
- Python version: 3.12
- Enabled critical checks: `reportGeneralTypeIssues`,
  `reportOptionalMemberAccess`, `reportUnboundVariable`
- Disabled noisy checks initially: `reportUnusedImport`,
  `reportUnknownParameterType`
- Virtual environment support configured

### 2. Unified Type Check Scripts

**Updated:** `/package.json` (root)

**New Commands:**

```bash
# Type checking
bun run type-check                    # Check both frontend and backend
bun run type-check:frontend           # Check TypeScript only
bun run type-check:backend            # Check Python only

# Error analysis
bun run type-check:errors             # Comprehensive error analysis (both)
bun run type-check:errors:frontend    # Frontend error analysis
bun run type-check:errors:backend     # Backend error analysis

# Linting (also enhanced)
bun run lint                          # Lint both frontend and backend
bun run lint:backend                  # Lint Python with Ruff
bun run lint:fix:backend              # Auto-fix Python linting issues
```
````

### 3. Error Analysis Tool

**Created:** `/scripts/type-check-errors.js`

**Features:**

- Runs both TypeScript and Python type checks
- Counts total errors, warnings, and information messages
- Groups errors by type/code
- Identifies top files with most errors
- Provides actionable insights and next steps
- Color-coded output for easy reading
- Supports analyzing frontend-only, backend-only, or both
- Exit code 1 if errors found (CI/CD friendly)

**Sample Output:**

```
🔍 Type Check Error Analysis Tool

TypeScript Type Check Results:
✓ No TypeScript errors found!

Python Type Check Results:
Errors: 124
Warnings: 7

Top 10 Files with Errors:
  36 errors in app/services/score_improvement_service.py
  35 errors in app/services/resume_service.py
  ...

Combined Summary:
Frontend (TypeScript): ✓ PASS
Backend (Python):      ✗ 124 errors (7 warnings)

Total: 124 errors, 7 warnings
```

### 4. Comprehensive Documentation

**Created:** `/docs/development/type-check/README.md`

**Contents:**

- Quick start guide
- Methodology overview (impact, frequency, complexity prioritization)
- TypeScript error classification with 14+ common error codes
- Python error classification with 8+ common error types
- Fixing strategies for both languages
- 30+ code examples covering:
  - TypeScript: Next.js components, React patterns, Supabase types
  - Python: FastAPI routes, Pydantic models, service layers
- Configuration file explanations
- Tools and commands reference
- CI/CD integration examples
- Troubleshooting section
- Monorepo-specific considerations
- Quick reference cheat sheet

## Current State

### Frontend (TypeScript)

- ✅ **Status**: Passing (0 errors)
- ✅ Configuration: Already had `tsconfig.json` with strict mode
- ✅ Type check script: Already working
- ✅ New: Error analysis integration

### Backend (Python)

- ⚠️ **Status**: 124 errors, 7 warnings detected
- ✅ Configuration: Pyright configured with balanced settings
- ✅ Type check script: Now functional
- ✅ New: Full pyright integration

**Error Breakdown (Backend):**

- Most errors in service layer (score_improvement_service.py: 36,
  resume_service.py: 35)
- Common issues:
  - `reportArgumentType`: str | None passed where str expected
  - `reportOptionalMemberAccess`: Accessing attributes on possibly None values
  - `reportMissingImports`: Some llama_index imports not resolved
  - `reportAttributeAccessIssue`: Dict access patterns need type safety

## Best Practices Applied

### From context7 Research:

**Pyright:**

- Used `standard` mode instead of `strict` for incremental adoption
- Enabled critical safety checks (Optional access, general type issues)
- Disabled noisy checks initially (unused variables, unknown types)
- Configured virtual environment support
- Set appropriate Python version (3.12)

**FastAPI/Pydantic:**

- Emphasized proper type hints in route handlers
- Showed Pydantic model best practices
- Demonstrated response_model usage
- Included Optional/union type patterns for Python 3.10+

**TypeScript:**

- Maintained strict mode for frontend
- Showed null safety patterns
- Demonstrated proper generic usage
- Included Next.js-specific patterns

### From creator-flow Methodology:

- High-impact, systematic approach
- Error prioritization by impact/frequency/complexity
- Incremental adoption strategy
- Quick wins with type assertions
- Documentation of common patterns
- CI/CD integration guidance

## Usage Examples

### Daily Development Workflow

```bash
# Before committing
bun run type-check

# If errors found, analyze them
bun run type-check:errors

# Fix specific part
bun run type-check:backend

# Check progress
bun run type-check:errors:backend
```

### Fixing Backend Errors (Example)

**Before:**

```python
def get_resume(resume_id: str):
    resume = db.query(Resume).first()
    return resume.title  # Error: resume is possibly None
```

**After:**

```python
def get_resume(resume_id: str) -> str | None:
    resume = db.query(Resume).first()
    if resume is None:
        return None
    return resume.title  # Type-safe
```

### Analyzing Specific Issues

```bash
# Find all reportArgumentType errors
bun run type-check:backend 2>&1 | grep "reportArgumentType"

# Check specific file
cd apps/backend
uv run pyright app/services/resume_service.py
```

## Next Steps for the Team

### Immediate (High Priority)

1. **Fix Critical Errors First**
   - Focus on service layer (score_improvement_service.py, resume_service.py)
   - Fix `reportArgumentType` errors (str | None → str issues)
   - Add None checks for Optional access

2. **Add Type Hints to Key Functions**
   - Service methods
   - FastAPI route handlers
   - Pydantic model validators

3. **Run Type Checks Regularly**
   - Before commits: `bun run type-check`
   - During development: `bun run type-check:backend`
   - Weekly: `bun run type-check:errors` to track progress

### Short Term (1-2 Weeks)

1. **Reduce Backend Errors to < 50**
   - Target high-frequency error types
   - Fix one file at a time
   - Document patterns as you go

2. **Add Pre-commit Hook** (Optional)
   - Update `.husky/pre-commit` to include type checks
   - Or run manually before PRs

3. **CI/CD Integration** (Recommended)
   - Add GitHub Actions workflow
   - Fail PRs with new type errors
   - Generate error reports

### Long Term (1-2 Months)

1. **Enable Stricter Checks**
   - Gradually increase pyright strictness
   - Enable `reportUnknownParameterType`
   - Enable `reportMissingTypeArgument`

2. **Shared Types Package** (Future)
   - Consider creating shared types between frontend/backend
   - Use pydantic-to-typescript for code generation

3. **Team Training**
   - Review documentation together
   - Establish team conventions
   - Share fixing patterns

## Integration Options

### Option 1: Pre-commit Hook (Strict)

Add to `.husky/pre-commit`:

```bash
# Run type checks
bun run type-check || {
  echo "❌ Type check failed. Fix errors or use --no-verify to skip."
  exit 1
}
```

**Pros:** Catches errors immediately **Cons:** May slow down commits initially

### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/type-check.yml`:

```yaml
name: Type Check
on: [pull_request]
jobs:
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run type-check
```

**Pros:** Doesn't block local development **Cons:** Errors found later in
workflow

### Option 3: Manual (Current)

Run manually before PRs:

```bash
bun run type-check:errors
```

**Pros:** Maximum flexibility **Cons:** Easy to forget

## Files Summary

### Created Files (5)

1. `/apps/backend/pyrightconfig.json` - Pyright configuration
2. `/scripts/type-check-errors.js` - Error analysis tool (executable)
3. `/docs/development/type-check/README.md` - Main documentation
4. `/docs/development/type-check/IMPLEMENTATION-SUMMARY.md` - This file

### Modified Files (2)

1. `/apps/backend/pyproject.toml` - Added pyright dependency
2. `/package.json` - Added 6 new scripts (type-check, lint commands)

### Dependencies Added (1)

- `pyright>=1.1.390` in backend

## Maintenance

### Updating Pyright Version

```bash
cd apps/backend
uv add "pyright>=1.1.400"  # Update to newer version
```

### Adjusting Strictness

Edit `/apps/backend/pyrightconfig.json`:

```json
{
  "typeCheckingMode": "strict", // "off", "basic", "standard", "strict"
  "reportUnknownParameterType": true // Enable/disable specific checks
}
```

### Monitoring Progress

```bash
# Track error count over time
echo "$(date): $(bun run type-check:backend 2>&1 | grep -c 'error:')" >> type-check-log.txt
```

## Troubleshooting

### "Cannot find module pyright"

```bash
cd apps/backend
uv sync  # Reinstall dependencies
```

### "Import could not be resolved" (False Positives)

Add to `pyrightconfig.json`:

```json
{
  "ignore": ["**/problematic_file.py"]
}
```

### VSCode Not Using Pyright

1. Install "Pylance" extension (uses Pyright)
2. Set Python interpreter to backend venv
3. Reload window

## Success Metrics

### Current Baseline

- Frontend: 0 errors ✅
- Backend: 124 errors ⚠️
- Total: 124 errors

### Short-term Goals (2 weeks)

- Backend: < 50 errors
- Total: < 50 errors

### Long-term Goals (2 months)

- Frontend: 0 errors ✅
- Backend: < 10 errors
- Total: < 10 errors

---

## Questions?

Refer to:

1. Main documentation: `/docs/development/type-check/README.md`
2. TypeScript handbook: https://www.typescriptlang.org/docs/
3. Pyright docs: https://github.com/microsoft/pyright
4. FastAPI type hints: https://fastapi.tiangolo.com/python-types/
5. Pydantic docs: https://docs.pydantic.dev/

---

**Implementation Date:** 2025-09-29 **Status:** ✅ Complete and Tested **Ready
for:** Team Review and Usage

````

## File: `docs/development/type-check/integration-guide.md`

```markdown
# Type Checking Integration Guide

**Purpose**: Complete guide for integrating automated type checking into
CV-Match development workflow **Target**: Brazilian SaaS platform with
comprehensive type safety

---

## 🎯 Overview

This guide explains how the comprehensive type checking methodology from
`/docs/development/type-check/README.md` has been integrated into the CI/CD
pipeline and development workflow.

### Integration Components

1. **GitHub Actions Workflows**: Automated type checking and fixing
2. **PR Templates**: Type safety metrics and checklists
3. **Manual Scripts**: Bulk type fixing automation
4. **Quality Gates**: Progressive error handling
5. **Brazilian Market Validation**: PT-BR and BRL type checking

---

## 🔄 Automated Workflows

### 1. Type Checking Automation Workflow

**File**: `.github/workflows/type-checking-automation.yml`

**Triggers**:

- Push to any branch
- Pull requests to main/develop
- Manual workflow dispatch

**Jobs**:

#### Type Error Analysis

- Analyzes TypeScript and Python type errors
- Classifies errors by priority (Critical, High, Medium, Low)
- Calculates type safety score
- Generates detailed reports

#### Progressive Type Fixing

- Applies automated fixes by priority level
- Critical errors require manual intervention
- High/Medium/Low errors have automated fixes
- Commits fixes automatically when improvements are made

#### Type Quality Gates

- Enforces error thresholds for each priority
- Blocks merges when quality gates fail
- Provides detailed feedback on violations

#### Brazilian Market Validation

- Validates PT-BR translation types
- Checks BRL currency type definitions
- Ensures Brazilian payment method types

### 2. Enhanced Branch Protection

**File**: `.github/workflows/branch-protection.yml`

**Enhancements**:

- Detailed type error analysis in frontend and backend jobs
- Type safety score calculation
- Quality gate enforcement
- Automatic build failure on critical errors

### 3. Pull Request Automation

**File**: `.github/workflows/pull-request-automation.yml`

**Features**:

- Real-time type error analysis for PRs
- Type safety metrics in PR descriptions
- Automated PR labeling based on type errors
- Brazilian market type validation

---

## 📝 Pull Request Template

**File**: `.github/pull_request_template.md`

### Type Safety Metrics Section

| Priority    | Errors                      | Status                        |
| ----------- | --------------------------- | ----------------------------- |
| 🔴 Critical | {{ TYPE_CRITICAL_ERRORS }}  | {{ TYPE_CRITICAL_STATUS }}    |
| 🟡 High     | {{ TYPE_HIGH_ERRORS }}      | {{ TYPE_HIGH_STATUS }}        |
| 🟢 Medium   | {{ TYPE_MEDIUM_ERRORS }}    | {{ TYPE_MEDIUM_STATUS }}      |
| ⚪ Low      | {{ TYPE_LOW_ERRORS }}       | {{ TYPE_LOW_STATUS }}         |
| **Total**   | **{{ TYPE_TOTAL_ERRORS }}** | **{{ TYPE_OVERALL_STATUS }}** |

_Type Safety Score: {{ TYPE_SAFETY_SCORE }}%_

### Type Safety Checklist

#### Frontend (TypeScript)

- [ ] No critical type errors (TS2307, TS2304)
- [ ] High priority errors under threshold (TS2339, TS2345)
- [ ] Component props properly typed
- [ ] API response types defined
- [ ] Event handlers typed correctly
- [ ] Null/undefined safety implemented

#### Backend (Python)

- [ ] No critical type errors
- [ ] Function signatures typed
- [ ] Return types specified
- [ ] Database models typed
- [ ] API request/response models typed

#### Brazilian Market Types

- [ ] BRL currency types defined
- [ ] CPF/CNPJ validation types
- [ ] Brazilian address types
- [ ] PT-BR translation types
- [ ] Payment method types for Brazil

---

## 🛠️ Manual Automation Scripts

### Type Fix Automation Script

**File**: `scripts/type-fix-automation.sh`

**Usage**:

```bash
# Analyze current state (no changes)
bun run type-analysis

# Apply automated fixes by priority
bun run type-fix:all          # All priorities
bun run type-fix:critical     # Manual intervention required
bun run type-fix:high         # Automated fixes
bun run type-fix:medium       # Automated fixes
bun run type-fix:low          # Automated fixes

# Preview changes before applying
bun run type-fix:dry-run

# Generate comprehensive report
bun run type-safety:report

# Auto-commit fixes
./scripts/type-fix-automation.sh high --auto-commit
````

**Features**:

- Bulk error classification and analysis
- Progressive fixing by priority
- Brazilian market type validation
- Type safety score calculation
- Automated commit generation

---

## 📊 Type Quality Gates

### Error Thresholds

| Priority              | Threshold | Action                                 |
| --------------------- | --------- | -------------------------------------- |
| 🔴 Critical           | 0         | Block merge completely                 |
| 🟡 High               | 10        | Require review but allow with warnings |
| 🟢 Medium             | 25        | Allow with automated fixes             |
| ⚪ Low                | 50        | Allow with warnings                    |
| **Type Safety Score** | 80%       | Minimum for production                 |

### Quality Gate Enforcement

1. **Critical Errors**: Always block merges
2. **High Priority**: Block if > 10 errors
3. **Medium Priority**: Warning if > 25 errors
4. **Low Priority**: Warning if > 50 errors
5. **Type Safety Score**: Must be ≥ 80% for production

---

## 🇧🇷 Brazilian Market Integration

### Type Validation

1. **PT-BR Translations**
   - Validates JSON structure
   - Checks for required translation keys
   - Ensures type safety in translation usage

2. **BRL Currency Types**
   - Validates BRL-specific currency types
   - Checks proper centavo handling
   - Ensures formatted amount types

3. **Payment Methods**
   - Validates PIX, Boleto, and credit card types
   - Checks Brazilian-specific payment logic
   - Ensures proper tax calculation types

4. **Document Validation**
   - CPF type definitions and validation
   - CNPJ type definitions and validation
   - Brazilian address types

### Brazilian Type Examples

```typescript
// BRL Currency Type
type BRLAmount = number & { readonly __brand: 'BRL' };

// Brazilian Payment Method
type BrazilianPaymentMethod = 'pix' | 'boleto' | 'credit_card' | 'debit_card';

// Document Types
interface CPF {
  value: string;
  formatted: string;
  isValid: boolean;
}

interface CNPJ {
  value: string;
  formatted: string;
  isValid: boolean;
}

// PT-BR Translation Keys
type PTBRTranslationKey =
  | 'payment.amount'
  | 'payment.method.pix'
  | 'user.cpf.invalid'
  | 'user.cnpj.invalid';
```

---

## 📈 Metrics and Monitoring

### Type Safety Score Calculation

```
Type Safety Score = max(0, 100 - (total_errors * 2))
```

- 100%: No type errors
- 80%: Production minimum
- 60%: Development acceptable
- < 60%: Requires immediate attention

### Progress Tracking

1. **Error Reduction Metrics**
   - Track errors fixed per session
   - Monitor type safety score improvement
   - Measure time to resolve priority levels

2. **Quality Metrics**
   - Percentage of PRs passing type gates
   - Average time to resolve type errors
   - Type coverage across codebase

3. **Brazilian Market Metrics**
   - PT-BR translation type coverage
   - BRL payment type implementation
   - Brazilian document validation coverage

---

## 🔧 Development Workflow Integration

### Daily Development

1. **Before Starting Work**

   ```bash
   bun run type-analysis
   # Review current type safety state
   ```

2. **During Development**

   ```bash
   bun run type-check:all
   # Check types as you work
   ```

3. **Before Committing**

   ```bash
   bun run quality:check
   # Full quality check including types
   ```

4. **Before Pushing**
   ```bash
   bun run type-fix:medium --dry-run
   # Preview potential fixes
   ```

### Feature Branch Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Develop with Type Safety**

   ```bash
   # Regular type checking
   bun run type-check:all

   # Fix critical errors immediately
   bun run type-fix:critical

   # Apply automated fixes periodically
   bun run type-fix:high
   ```

3. **Before PR**

   ```bash
   # Comprehensive analysis
   bun run type-safety:report

   # Apply remaining fixes
   bun run type-fix:all
   ```

4. **Create PR**
   - PR template automatically includes type metrics
   - CI/CD runs comprehensive type analysis
   - Quality gates enforce type safety standards

### Release Branch Workflow

1. **Create Release Branch**

   ```bash
   git checkout -b release/v1.2.0
   ```

2. **Strict Type Validation**

   ```bash
   # Target 90%+ type safety score
   bun run type-fix:all

   # Verify Brazilian market types
   bun run type-analysis
   ```

3. **Release Validation**
   - All critical errors must be resolved
   - Type safety score ≥ 90%
   - Brazilian market types fully validated

---

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails on Type Errors**
   - Check GitHub Actions logs for error details
   - Use `bun run type-analysis` to reproduce locally
   - Apply fixes using `bun run type-fix:[priority]`

2. **Type Safety Score Low**
   - Run `bun run type-fix:all` for bulk fixes
   - Focus on critical and high priority errors first
   - Use manual fixes for complex issues

3. **Brazilian Market Type Errors**
   - Check PT-BR translation file structure
   - Verify BRL currency type definitions
   - Ensure Brazilian payment method types

4. **PR Blocked by Type Gates**
   - Review type error comments in PR
   - Apply suggested fixes
   - Re-run CI/CD after fixes

### Recovery Commands

```bash
# Reset to last known good state
git reset --hard HEAD~1

# Revert type fixes if needed
git revert HEAD -m "Revert type fixes"

# Check type history
git log --oneline --grep="fix(types)"
```

---

## 🎯 Best Practices

### Development Practices

1. **Progressive Type Safety**
   - Start with critical errors
   - Work through high priority issues
   - Use automation for medium/low priority

2. **Brazilian Market First**
   - Include PT-BR types from the beginning
   - Design BRL currency types properly
   - Validate Brazilian document types

3. **Regular Maintenance**
   - Run type analysis weekly
   - Address type debt regularly
   - Monitor type safety score trends

### Code Review Guidelines

1. **Type Safety Review**
   - Check for new type errors
   - Verify proper type annotations
   - Ensure Brazilian market types

2. **Automated Validation**
   - Trust automated type fixes for simple issues
   - Review complex type changes manually
   - Validate Brazilian market integration

3. **Quality Gate Compliance**
   - Ensure all critical errors resolved
   - Keep high priority errors under threshold
   - Maintain type safety score ≥ 80%

---

## 📚 Related Documentation

- **Type Checking Methodology**: `/docs/development/type-check/README.md`
- **Troubleshooting Guide**: `/docs/development/type-check/TROUBLESHOOTING.md`
- **Git Workflow**: `/docs/GIT-WORKFLOW.md`
- **GitHub Actions**: `.github/workflows/`
- **Type Fix Script**: `scripts/type-fix-automation.sh`

---

## ✨ Summary

This integration provides:

✅ **Automated type checking** in CI/CD pipeline ✅ **Progressive error
handling** by priority ✅ **Brazilian market type validation** ✅ **Manual bulk
fix automation** ✅ **Type quality gates** enforcement ✅ **Comprehensive
metrics** and monitoring ✅ **Developer-friendly** workflows ✅ **PR template
integration**

The type checking methodology is now seamlessly integrated into the development
workflow, ensuring high code quality while maintaining focus on the Brazilian
SaaS market requirements.

````

## File: `docs/development/type-check/quick-reference.md`

```markdown
# Type Check Quick Reference

## Commands Cheat Sheet

```bash
# Full type check (both frontend and backend)
bun run type-check

# Individual checks
bun run type-check:frontend           # TypeScript only
bun run type-check:backend            # Python only

# Error analysis (with detailed breakdown)
bun run type-check:errors             # Both
bun run type-check:errors:frontend    # Frontend only
bun run type-check:errors:backend     # Backend only

# Linting
bun run lint                          # Both
bun run lint:frontend                 # TypeScript/JavaScript
bun run lint:backend                  # Python with Ruff
bun run lint:fix                      # Auto-fix both
bun run lint:fix:backend              # Auto-fix Python only
````

---

## Quick Fixes by Error Type

### TypeScript

| Error Code                  | Quick Fix                           |
| --------------------------- | ----------------------------------- |
| **TS2339** Property missing | `obj?.property` or add to interface |
| **TS2345** Wrong argument   | Cast: `value as Type`               |
| **TS18047** Possibly null   | Add `!` or `??` operator            |
| **TS7006** Implicit any     | Add type: `(param: Type)`           |
| **TS2322** Type mismatch    | Cast or fix type                    |
| **TS2304** Name not found   | Import or install package           |

### Python

| Error Type                     | Quick Fix                                    |
| ------------------------------ | -------------------------------------------- |
| **reportArgumentType**         | Add None check or change type hint           |
| **reportOptionalMemberAccess** | `if value is not None:` check                |
| **reportMissingImports**       | `uv add package-name`                        |
| **reportGeneralTypeIssues**    | Add type hints: `def func(x: Type) -> Type:` |
| **reportUnboundVariable**      | Initialize before use                        |

---

## Common Patterns

### TypeScript - Null Safety

```typescript
// Optional chaining
const email = user?.profile?.email;

// Nullish coalescing
const name = user?.name ?? 'Anonymous';

// Type guard
if (user !== null) {
  console.log(user.name); // Safe
}
```

### TypeScript - Type Assertions

```typescript
// Safe assertion after check
const value = getValue();
if (typeof value === 'string') {
  const upper = value.toUpperCase(); // Safe
}

// Type casting (use sparingly)
const data = response as MyType;
```

### Python - Optional Handling

```python
from typing import Optional

# Function with optional return
def find_user(id: str) -> Optional[User]:
    user = db.query(User).first()
    if user is None:
        return None
    return user

# Using walrus operator
if (user := find_user(id)) is not None:
    print(user.email)
```

### Python - Type Hints

```python
# Basic types
def greet(name: str) -> str:
    return f"Hello, {name}"

# Generics
def get_items() -> list[dict[str, Any]]:
    return []

# Pydantic models
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str | None = None  # Optional in Python 3.10+
```

---

## Error Priority

**Fix in this order:**

1. 🔴 **Critical** - Build failures, imports, unbound variables
2. 🟡 **High** - Type mismatches in core logic, null safety in routes
3. 🟢 **Medium** - Component types, parameter annotations
4. ⚪ **Low** - Unused variables, cosmetic issues

---

## Configuration Files

### Frontend: `apps/frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "module": "esnext"
  }
}
```

### Backend: `apps/backend/pyrightconfig.json`

```json
{
  "typeCheckingMode": "standard",
  "pythonVersion": "3.12",
  "reportGeneralTypeIssues": true
}
```

---

## Troubleshooting

| Problem             | Solution                                |
| ------------------- | --------------------------------------- |
| Pyright not found   | `cd apps/backend && uv sync`            |
| False import errors | Add to `ignore` in pyrightconfig.json   |
| VSCode not checking | Install Pylance, set Python interpreter |
| Too many errors     | Start with one file, fix incrementally  |

---

## Daily Workflow

```bash
# 1. Before starting work
bun run type-check

# 2. During development (as needed)
bun run type-check:backend  # or :frontend

# 3. Before committing
bun run type-check:errors

# 4. If errors found
# - Fix critical errors first
# - Run type-check again
# - Commit when clean (or document why skipping)
```

---

## Resources

- **Full Docs**: `/docs/development/type-check/README.md`
- **Implementation**: `/docs/development/type-check/IMPLEMENTATION-SUMMARY.md`
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Pyright**: https://github.com/microsoft/pyright
- **FastAPI**: https://fastapi.tiangolo.com/python-types/
- **Pydantic**: https://docs.pydantic.dev/

---

**Last Updated**: 2025-09-29

```

```
