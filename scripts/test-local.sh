#!/bin/bash

# Local Testing Script
# Runs comprehensive tests locally to validate code before commits

set -e  # Exit on any error

echo "🚀 Starting local test suite..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to run a test step and check result
run_test_step() {
    local step_name="$1"
    local step_command="$2"

    print_status "Running $step_name..."

    if eval "$step_command"; then
        print_success "$step_name passed!"
        return 0
    else
        print_error "$step_name failed!"
        return 1
    fi
}

# Create test directory structure if it doesn't exist
setup_test_environment() {
    print_status "Setting up test environment..."

    # Create temp directories for tests
    mkdir -p temp-test-files/content/blog/2025/01

    # Create test blog post
    cat > temp-test-files/content/blog/2025/01/test-post.mdx << 'EOF'
---
title: "Test Blog Post"
slug: "test-blog-post"
summary: "A test blog post for local validation"
author: "Local Test"
publishedAt: "2024-01-01"
isDraft: false
readTime: 3
tags: ["test", "local"]
category: "timing-guide"
---

# Test Blog Post

This is a test blog post for local development validation.

## Content Section

Here's some test content with **bold** and *italic* text.

```javascript
console.log('Hello from local test!');
```

- Test item 1
- Test item 2
- Test item 3
EOF

    print_success "Test environment setup complete!"
}

# Clean up test environment
cleanup_test_environment() {
    print_status "Cleaning up test environment..."

    if [ -d "temp-test-files" ]; then
        rm -rf temp-test-files
        print_success "Test environment cleaned up!"
    fi
}

# Run the complete test suite
run_complete_test_suite() {
    local failed_steps=0

    echo
    print_status "Starting comprehensive test suite..."
    echo "=================================="

    # 1. TypeScript Type Checking
    if ! run_test_step "TypeScript Type Checking" "bun run type-check"; then
        ((failed_steps++))
    fi

    echo
    # 2. ESLint Checking
    if ! run_test_step "ESLint Code Quality Check" "bun run lint:all"; then
        ((failed_steps++))
    fi

    echo
    # 3. Unit Tests
    if ! run_test_step "Unit Tests" "bun run test:ci --testPathPattern='tests/(scripts|config|typescript)'"; then
        ((failed_steps++))
    fi

    echo
    # 4. Integration Tests
    if ! run_test_step "Integration Tests" "bun run test:ci --testPathPattern='tests/integration'"; then
        ((failed_steps++))
    fi

    echo
    # 5. Build Test
    if ! run_test_step "Build Test" "bun run build"; then
        ((failed_steps++))
    fi

    echo
    # 6. Security Audit
    if ! run_test_step "Security Audit" "bun run security:audit"; then
        ((failed_steps++))
    fi

    echo
    # 7. Blog Scripts Test
    if ! run_test_step "Blog Scripts Validation" "timeout 30s bun run blog:create --title 'Local Test Post' --template timing-guide --no-interactive || true"; then
        ((failed_steps++))
    fi

    if ! run_test_step "Blog SEO Check" "timeout 30s bun run blog:seo-check --all || true"; then
        ((failed_steps++))
    fi

    if ! run_test_step "Deployment Validation" "timeout 60s bun tsx scripts/deploy-validation.ts || true"; then
        ((failed_steps++))
    fi

    echo "=================================="

    if [ $failed_steps -eq 0 ]; then
        print_success "🎉 All tests passed! Your code is ready to commit."
        return 0
    else
        print_error "❌ $failed_steps test step(s) failed. Please fix the issues before committing."
        return 1
    fi
}

# Run quick tests for pre-commit hooks
run_quick_tests() {
    local failed_steps=0

    echo
    print_status "Running quick pre-commit tests..."
    echo "=================================="

    # 1. TypeScript Type Checking
    if ! run_test_step "TypeScript Type Checking" "bun run type-check"; then
        ((failed_steps++))
    fi

    echo
    # 2. ESLint Checking (with fixes)
    if ! run_test_step "ESLint Code Quality Check" "bun run lint:fix"; then
        ((failed_steps++))
    fi

    echo
    # 3. Critical Unit Tests
    if ! run_test_step "Critical Unit Tests" "bun run test:ci --testPathPattern='tests/scripts/blog-create.test.ts'"; then
        ((failed_steps++))
    fi

    echo "=================================="

    if [ $failed_steps -eq 0 ]; then
        print_success "✅ Quick tests passed! Ready to commit."
        return 0
    else
        print_error "❌ $failed_steps quick test(s) failed. Please fix the issues."
        return 1
    fi
}

# Show test coverage report
show_coverage() {
    print_status "Generating test coverage report..."

    if bun run test:coverage; then
        print_success "Coverage report generated!"
        print_status "Open coverage/lcov-report/index.html in your browser to view the detailed report."
    else
        print_error "Failed to generate coverage report."
        return 1
    fi
}

# Performance benchmarking
run_performance_tests() {
    print_status "Running performance tests..."

    # Check if we have performance tests
    if [ -d "tests/performance" ]; then
        if bun run test:ci --testPathPattern='tests/performance'; then
            print_success "Performance tests passed!"
        else
            print_error "Performance tests failed!"
            return 1
        fi
    else
        print_warning "No performance tests found. Skipping."
    fi
}

# Main script logic
case "${1:-complete}" in
    "complete")
        setup_test_environment
        if run_complete_test_suite; then
            exit_code=0
        else
            exit_code=1
        fi
        cleanup_test_environment
        exit $exit_code
        ;;
    "quick")
        if run_quick_tests; then
            exit 0
        else
            exit 1
        fi
        ;;
    "coverage")
        show_coverage
        exit $?
        ;;
    "performance")
        run_performance_tests
        exit $?
        ;;
    "setup")
        setup_test_environment
        exit 0
        ;;
    "cleanup")
        cleanup_test_environment
        exit 0
        ;;
    "help"|"-h"|"--help")
        echo "Local Test Suite Script"
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  complete    Run the complete test suite (default)"
        echo "  quick       Run quick pre-commit tests"
        echo "  coverage    Generate and show test coverage report"
        echo "  performance Run performance tests"
        echo "  setup       Set up test environment"
        echo "  cleanup     Clean up test environment"
        echo "  help        Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                # Run complete test suite"
        echo "  $0 quick          # Run quick tests for pre-commit"
        echo "  $0 coverage        # Generate coverage report"
        exit 0
        ;;
    *)
        print_error "Unknown command: $1"
        print_status "Run '$0 help' for usage information."
        exit 1
        ;;
esac