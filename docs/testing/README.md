# Testing Guide

This guide covers the comprehensive testing strategy for the CueTimer blog
management system, ensuring code quality, type safety, and ESLint compliance.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Structure](#test-structure)
3. [Running Tests](#running-tests)
4. [Test Types](#test-types)
5. [CI/CD Integration](#cicd-integration)
6. [Coverage Reports](#coverage-reports)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Testing Philosophy

Our testing approach follows these principles:

- **Type Safety First**: TypeScript strict mode catches issues before runtime
- **ESLint Compliance**: Code quality is enforced through automated linting
- **Comprehensive Coverage**: Unit, integration, and E2E tests cover all
  critical paths
- **Fast Feedback**: Tests run quickly to enable rapid development
- **Documentation**: Tests serve as living documentation of system behavior

## Test Structure

```
tests/
├── integration/           # Integration tests
│   ├── mdx-renderers.test.tsx
│   └── blog-content-manager.test.tsx
├── scripts/              # Unit tests for CLI scripts
│   ├── blog-create.test.ts
│   ├── deploy-validation.test.ts
│   └── blog-seo-check.test.ts
├── config/               # Configuration tests
│   └── eslint-validation.test.ts
├── typescript/           # Type enforcement tests
│   └── type-enforcement.test.ts
├── blog-scripts/         # Blog script tests
│   └── content-creator.test.ts
├── performance/          # Performance tests
└── setup.ts             # Global test setup
```

## Running Tests

### Local Development

```bash
# Run complete test suite
bun run scripts/test-local.sh

# Run quick pre-commit tests
bun run scripts/test-local.sh quick

# Generate coverage report
bun run scripts/test-local.sh coverage

# Run performance tests
bun run scripts/test-local.sh performance
```

### Individual Test Commands

```bash
# Type checking
bun run type-check

# ESLint
bun run lint:all
bun run lint:fix

# Unit tests
bun run test:ci

# Integration tests
bun run test:ci --testPathPattern="tests/integration"

# Coverage
bun run test:coverage
```

### CI/CD

Tests automatically run on:

- Pull requests to `main`, `master`, and `develop` branches
- Pushes to feature branches
- Merges to main branches

## Test Types

### 1. Unit Tests

**Location**: `tests/scripts/`, `tests/blog-scripts/`

Unit tests focus on individual functions and components in isolation.

**Example CLI Script Test**:

```typescript
describe('blog-create CLI Script', () => {
  test('should create blog post with timing-guide template', async () => {
    const options = {
      template: 'timing-guide',
      title: 'Test Timing Guide',
      interactive: false,
    };

    await expect(createBlogPost(options)).resolves.not.toThrow();
  });
});
```

**Key Areas Tested**:

- CLI script functionality
- Blog content creation
- SEO analysis
- Deployment validation
- Content creator utilities

### 2. Integration Tests

**Location**: `tests/integration/`

Integration tests verify that components work together correctly.

**Example Component Integration**:

```typescript
describe('MDX Renderer Components Integration Tests', () => {
  test('should render basic markdown content with proper accessibility', async () => {
    render(<AccessibleMDXRenderer content={basicContent} />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
```

**Key Areas Tested**:

- MDX renderer components
- Blog content manager
- Component interactions
- Accessibility compliance

### 3. Configuration Tests

**Location**: `tests/config/`

Configuration tests validate that our tooling is correctly configured.

**Example ESLint Validation**:

```typescript
describe('ESLint Configuration Validation', () => {
  test('should enforce TypeScript strict rules', () => {
    const testFile = 'let untypedVar: any = "test";';

    expect(() => {
      execSync(`echo "${testFile}" | bunx eslint --stdin --ext .ts`);
    }).toThrow();
  });
});
```

**Key Areas Tested**:

- ESLint configuration
- Rule enforcement
- File-specific rules
- Auto-fixing functionality

### 4. Type Enforcement Tests

**Location**: `tests/typescript/`

Type enforcement tests ensure TypeScript is properly configured and catching
errors.

**Example Type Enforcement**:

```typescript
describe('TypeScript Type Enforcement Tests', () => {
  test('should catch missing type annotations', () => {
    const testFile = 'function untypedFunction(param) { return param; }';

    expect(() => {
      execSync(`echo "${testFile}" | bunx tsc --noEmit --strict`);
    }).toThrow();
  });
});
```

**Key Areas Tested**:

- TypeScript configuration
- Type safety enforcement
- Generic type usage
- React component types

## CI/CD Integration

### GitHub Actions Workflow

Our CI/CD pipeline includes:

1. **Type Check**: TypeScript compilation
2. **Lint Check**: ESLint validation
3. **Unit Tests**: Fast feedback on core functionality
4. **Integration Tests**: Component interaction validation
5. **Blog Scripts Tests**: CLI tool validation
6. **Build Test**: Production build verification
7. **Security Audit**: Dependency vulnerability scanning
8. **Performance Tests**: Lighthouse validation
9. **Quality Gate**: Final validation before deployment

### Quality Gates

All required checks must pass before:

- Pull requests can be merged
- Code can be deployed to production
- Releases can be created

### Environment-Specific Testing

- **Development**: Fast feedback with essential checks
- **Staging**: Full test suite with performance validation
- **Production**: Security scans and deployment validation

## Coverage Reports

### Coverage Thresholds

We maintain strict coverage requirements:

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 75,
    lines: 80,
    statements: 80,
  },
  './lib/blog-scripts/': {
    branches: 80,
    functions: 85,
    lines: 85,
    statements: 85,
  },
  './scripts/': {
    branches: 75,
    functions: 80,
    lines: 80,
    statements: 80,
  },
  './components/blog/': {
    branches: 70,
    functions: 75,
    lines: 75,
    statements: 75,
  },
}
```

### Viewing Coverage

```bash
# Generate coverage report
bun run test:coverage

# View detailed HTML report
open coverage/lcov-report/index.html
```

### Coverage Integration

Coverage reports are automatically:

- Generated on each test run
- Uploaded to Codecov for PR analysis
- Included in build artifacts
- Tracked against coverage trends

## Best Practices

### Writing Tests

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how
2. **Use Descriptive Names**: Test names should clearly describe what's being
   tested
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Mock External Dependencies**: Isolate code from external systems
5. **Test Edge Cases**: Include error conditions and boundary values

### ESLint Compliance in Tests

```typescript
// ✅ Good: TypeScript-compliant test
describe('Component Test', () => {
  const mockFn = jest.fn();

  test('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<Component onClick={mockFn} />);

    await user.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});

// ❌ Bad: Using 'any' type
describe('Component Test', () => {
  test('should handle interaction', () => {
    const mockData: any = {}; // Avoid 'any'
    // ...
  });
});
```

### Type Safety in Tests

```typescript
// ✅ Good: Proper typing
interface TestProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

// ❌ Bad: Missing types
const testProps = {
  title: 'Test',
  // Missing onSubmit type
};
```

### Mock Management

```typescript
// ✅ Good: Proper mock setup
beforeEach(() => {
  jest.clearAllMocks();
  mockAPI.getBlogAnalytics.mockResolvedValue(mockAnalytics);
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

## Troubleshooting

### Common Issues

#### 1. Test Timeouts

```bash
# Increase timeout for slow tests
jest.setTimeout(10000);
```

#### 2. Mock Configuration

```typescript
// Ensure mocks are properly configured
jest.mock('module-name', () => ({
  __esModule: true,
  default: jest.fn(),
}));
```

#### 3. ESLint Issues in Tests

Tests have relaxed ESLint rules, but should still follow basic patterns:

```typescript
// ✅ Acceptable in tests
const unusedVar = 'test'; // Allowed in tests

// ❌ Still problematic
const badlyFormattedCode = 'test'; // Formatting still matters
```

#### 4. TypeScript Compilation Errors

```bash
# Check TypeScript configuration
bun run type-check

# Update TypeScript types
bunx npm-check-updates --target typescript
```

### Debugging Tests

```bash
# Run tests in watch mode
bun run test:watch

# Run specific test file
bun run test -- tests/path/to/test.test.ts

# Run tests with debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Performance Issues

```bash
# Run tests with limited workers
bun run test:ci --maxWorkers=1

# Generate performance report
bun run test:coverage --reporters=performance
```

## Test Data Management

### Fixtures

Use test fixtures for consistent test data:

```typescript
// tests/fixtures/blogPosts.ts
export const mockBlogPost = {
  slug: 'test-post',
  title: 'Test Post',
  content: 'Test content',
  // ...
};
```

### Test Utilities

Create reusable test utilities:

```typescript
// tests/utils/render.tsx
export const renderWithProviders = (component: ReactElement) => {
  return render(
    <TestProviders>
      {component}
    </TestProviders>
  );
};
```

## Continuous Improvement

### Test Metrics

Track these metrics:

- Test execution time
- Coverage percentage
- Test failure rate
- Flaky test identification

### Regular Reviews

- Review test coverage quarterly
- Update test patterns based on failures
- Refactor tests for better maintainability
- Add tests for new features

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [TypeScript Testing](https://basarat.gitbook.io/typescript/testing)
- [ESLint Testing Rules](https://eslint.org/docs/rules/)

## Support

For testing-related questions:

1. Check this documentation
2. Review existing tests for patterns
3. Ask in team discussions
4. Create issues for test failures

---

_Last updated: 2025-01-25_
