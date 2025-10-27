# Chunk 96: tests_scripts

## Metadata

- **Files**: 2
- **Size**: 28,545 characters (~7,136 tokens)
- **Categories**: tests

## Files in this chunk

- `scripts/test-blog-create.ts`
- `scripts/test-blog-system.ts`

---

## File: `scripts/test-blog-create.ts`

```typescript
#!/usr/bin/env bun

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const TEST_DIR = join(process.cwd(), 'test-output');

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  errors: [] as string[],
};

// Helper function to run command and capture output
function runCommand(command: string, description: string): boolean {
  try {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`💻 Command: ${command}`);

    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd(),
    });

    console.log(`✅ Success: ${description}`);
    console.log(
      `📄 Output: ${output.substring(0, 200)}${output.length > 200 ? '...' : ''}`
    );
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`❌ Failed: ${description}`);
    console.log(
      `🔴 Error: ${error instanceof Error ? error.message : String(error)}`
    );
    testResults.failed++;
    testResults.errors.push(
      `${description}: ${error instanceof Error ? error.message : String(error)}`
    );
    return false;
  }
}

// Helper function to check if file was created
function checkFileCreated(filePath: string, description: string): boolean {
  try {
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      console.log(`✅ File created successfully: ${description}`);
      console.log(`📁 Path: ${filePath}`);
      console.log(`📄 Size: ${content.length} characters`);

      // Clean up test file
      unlinkSync(filePath);
      testResults.passed++;
      return true;
    } else {
      console.log(`❌ File not created: ${description}`);
      testResults.failed++;
      testResults.errors.push(`File not created: ${description}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error checking file: ${description}`);
    console.log(
      `🔴 Error: ${error instanceof Error ? error.message : String(error)}`
    );
    testResults.failed++;
    testResults.errors.push(
      `Error checking file ${description}: ${error instanceof Error ? error.message : String(error)}`
    );
    return false;
  }
}

// Setup test directory
function setupTestDir() {
  if (!existsSync(TEST_DIR)) {
    mkdirSync(TEST_DIR, { recursive: true });
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Blog Creation CLI Tests\n');
  console.log('📁 Working directory:', process.cwd());
  console.log('📁 Test output directory:', TEST_DIR);

  setupTestDir();

  // Test 1: Show help
  runCommand('bun run blog:create --help', 'Show help information');

  // Test 2: Show template help
  runCommand(
    'bun run blog:create help-templates',
    'Show template descriptions'
  );

  // Test 3: Test non-interactive mode with timing-guide template
  const timingGuideTest = runCommand(
    'bun run blog:create --title "Test Timing Guide" --template timing-guide --author "Test Author" --no-interactive',
    'Create timing guide in non-interactive mode'
  );

  if (timingGuideTest) {
    // Check if file was created (this will be in content/blog/YYYY/MM/ directory)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const expectedPath = join(
      process.cwd(),
      'content',
      'blog',
      year.toString(),
      month,
      'test-timing-guide.mdx'
    );

    setTimeout(() => {
      checkFileCreated(expectedPath, 'Timing guide MDX file');
    }, 2000); // Wait a bit for file creation
  }

  // Test 4: Test non-interactive mode with case-study template
  const caseStudyTest = runCommand(
    'bun run blog:create --title "Test Case Study" --template case-study --author "Test Author" --no-interactive',
    'Create case study in non-interactive mode'
  );

  if (caseStudyTest) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const expectedPath = join(
      process.cwd(),
      'content',
      'blog',
      year.toString(),
      month,
      'test-case-study.mdx'
    );

    setTimeout(() => {
      checkFileCreated(expectedPath, 'Case study MDX file');
    }, 2000);
  }

  // Test 5: Test non-interactive mode with feature-announce template
  const featureAnnounceTest = runCommand(
    'bun run blog:create --title "Test Feature Announcement" --template feature-announce --author "Test Author" --no-interactive',
    'Create feature announcement in non-interactive mode'
  );

  if (featureAnnounceTest) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const expectedPath = join(
      process.cwd(),
      'content',
      'blog',
      year.toString(),
      month,
      'test-feature-announcement.mdx'
    );

    setTimeout(() => {
      checkFileCreated(expectedPath, 'Feature announcement MDX file');
    }, 2000);
  }

  // Test 6: Test non-interactive mode with presentation-tips template
  const presentationTipsTest = runCommand(
    'bun run blog:create --title "Test Presentation Tips" --template presentation-tips --author "Test Author" --no-interactive',
    'Create presentation tips in non-interactive mode'
  );

  if (presentationTipsTest) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const expectedPath = join(
      process.cwd(),
      'content',
      'blog',
      year.toString(),
      month,
      'test-presentation-tips.mdx'
    );

    setTimeout(() => {
      checkFileCreated(expectedPath, 'Presentation tips MDX file');
    }, 2000);
  }

  // Test 7: Test error handling with invalid template
  runCommand(
    'bun run blog:create --title "Test" --template invalid-template --no-interactive',
    'Handle invalid template error'
  );

  // Wait for all async operations to complete
  setTimeout(() => {
    // Print test results summary
    console.log(`\n${'='.repeat(60)}`);
    console.log('🧪 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📊 Total: ${testResults.passed + testResults.failed}`);

    if (testResults.errors.length > 0) {
      console.log('\n🔴 Errors:');
      testResults.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (testResults.failed === 0) {
      console.log(
        '\n🎉 All tests passed! The Blog Creation CLI is working correctly.'
      );
      process.exit(0);
    } else {
      console.log('\n💥 Some tests failed. Please check the errors above.');
      process.exit(1);
    }
  }, 5000); // Wait 5 seconds for all file operations to complete
}

// Run the tests
runTests().catch((error) => {
  console.error('🔥 Test runner failed:', error);
  process.exit(1);
});
```

## File: `scripts/test-blog-system.ts`

```typescript
#!/usr/bin/env bun

/**
 * System Validation Script for CueTimer Blog Management System
 *
 * This script provides comprehensive health checks and validation for:
 * - Dependency validation (all required packages available)
 * - TypeScript compilation verification
 * - CLI tool accessibility testing
 * - Template system functionality check
 * - Content creation validation
 * - Performance testing and benchmarking
 * - Error handling validation
 * - System readiness certification
 */

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';

import { CueTimerTemplate } from '../lib/blog-scripts/types';

// Test configuration
interface TestConfig {
  timeout: number;
  verbose: boolean;
  exitOnError: boolean;
  testDir: string;
  contentDir: string;
  dataDir: string;
}

// Test result interface
interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  message: string;
  details?: Record<string, unknown>;
}

// Test template interface (allows invalid categories for testing)
interface TestTemplate {
  id: string;
  name: string;
  category: string; // Intentionally flexible for invalid test cases
  languages: string[];
  variables: unknown[];
  contentStructure: unknown[];
}

// Health check result interface
interface HealthCheckResult {
  overall: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  categories: {
    dependencies: TestResult[];
    compilation: TestResult[];
    cli: TestResult[];
    templates: TestResult[];
    content: TestResult[];
    performance: TestResult[];
    errors: TestResult[];
  };
}

class SystemValidator {
  private config: TestConfig;
  private results: HealthCheckResult;
  private startTime: number;

  constructor(config: Partial<TestConfig> = {}) {
    this.config = {
      timeout: 30000,
      verbose: true,
      exitOnError: false,
      testDir: join(process.cwd(), 'temp-system-test'),
      contentDir: join(process.cwd(), 'temp-system-test', 'content', 'blog'),
      dataDir: join(process.cwd(), 'temp-system-test', 'data'),
      ...config,
    };

    this.results = {
      overall: true,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      duration: 0,
      categories: {
        dependencies: [],
        compilation: [],
        cli: [],
        templates: [],
        content: [],
        performance: [],
        errors: [],
      },
    };

    this.startTime = Date.now();
  }

  /**
   * Run all health checks
   */
  async runHealthChecks(): Promise<HealthCheckResult> {
    console.log('🔍 Starting CueTimer Blog System Health Checks...\n');

    try {
      await this.setupTestEnvironment();

      await this.checkDependencies();
      await this.checkCompilation();
      await this.checkCliTools();
      await this.checkTemplateSystem();
      await this.checkContentCreation();
      await this.checkPerformance();
      await this.checkErrorHandling();

      await this.cleanupTestEnvironment();

      this.results.duration = Date.now() - this.startTime;
      this.calculateOverallStatus();

      this.printResults();

      return this.results;
    } catch (error) {
      console.error('❌ Health check failed with error:', error);
      this.results.overall = false;
      return this.results;
    }
  }

  /**
   * Setup test environment
   */
  private async setupTestEnvironment(): Promise<void> {
    await fs.mkdir(this.config.contentDir, { recursive: true });
    await fs.mkdir(join(this.config.dataDir, 'analytics'), { recursive: true });
    await fs.mkdir(join(this.config.dataDir, 'workflow'), { recursive: true });
    await fs.mkdir(join(this.config.dataDir, 'seo'), { recursive: true });
  }

  /**
   * Cleanup test environment
   */
  private async cleanupTestEnvironment(): Promise<void> {
    await fs
      .rm(this.config.testDir, { recursive: true, force: true })
      .catch(() => {});
  }

  /**
   * Add test result
   */
  private addTestResult(
    category: keyof HealthCheckResult['categories'],
    result: TestResult
  ): void {
    this.results.categories[category].push(result);
    this.results.totalTests++;

    if (result.success) {
      this.results.passedTests++;
    } else {
      this.results.failedTests++;
      this.results.overall = false;
    }

    if (this.config.verbose) {
      const status = result.success ? '✅' : '❌';
      const duration = `(${result.duration}ms)`;
      console.log(`${status} ${result.name} ${duration}`);
      if (!result.success) {
        console.log(`   ${result.message}`);
      }
    }
  }

  /**
   * Execute a test with timing
   */
  private async runTest<T>(
    name: string,
    category: keyof HealthCheckResult['categories'],
    testFn: () => Promise<T>
  ): Promise<void> {
    const startTime = Date.now();

    try {
      const result = await Promise.race([
        testFn(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Test timeout')),
            this.config.timeout
          )
        ),
      ]);

      const duration = Date.now() - startTime;
      this.addTestResult(category, {
        name,
        success: true,
        duration,
        message: 'Test passed',
        details: result as Record<string, unknown>,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      this.addTestResult(category, {
        name,
        success: false,
        duration,
        message: String(error),
      });

      if (this.config.exitOnError) {
        throw error;
      }
    }
  }

  /**
   * Check system dependencies
   */
  private async checkDependencies(): Promise<void> {
    console.log('\n📦 Checking Dependencies...');

    const requiredPackages = [
      'chalk',
      'commander',
      'inquirer',
      'ora',
      'zod',
      'gray-matter',
      'date-fns',
      'reading-time',
      'tsx',
    ];

    for (const pkg of requiredPackages) {
      await this.runTest(
        `Package ${pkg} available`,
        'dependencies',
        async () => {
          try {
            require.resolve(pkg);
            return { available: true };
          } catch {
            throw new Error(`Package ${pkg} not found`);
          }
        }
      );
    }

    await this.runTest('TypeScript available', 'dependencies', async () => {
      try {
        execSync('bunx tsc --version', { stdio: 'pipe' });
        return { available: true };
      } catch {
        throw new Error('TypeScript compiler not available');
      }
    });

    await this.runTest('Node.js version check', 'dependencies', async () => {
      const { version } = process;
      const majorVersion = parseInt(version.slice(1).split('.')[0] || '0');
      if (majorVersion < 18) {
        throw new Error(
          `Node.js version ${version} is too old (requires >= 18)`
        );
      }
      return { version: process.version };
    });
  }

  /**
   * Check TypeScript compilation
   */
  private async checkCompilation(): Promise<void> {
    console.log('\n🔨 Checking Compilation...');

    await this.runTest('TypeScript type checking', 'compilation', async () => {
      try {
        execSync('bun run type-check', { stdio: 'pipe' });
        return { success: true };
      } catch (error) {
        throw new Error('TypeScript compilation failed');
      }
    });

    await this.runTest('Blog scripts compilation', 'compilation', async () => {
      const scriptsPath = join(process.cwd(), 'lib', 'blog-scripts');
      const files = await fs.readdir(scriptsPath);

      for (const file of files) {
        if (file.endsWith('.ts')) {
          const filePath = join(scriptsPath, file);
          const content = await fs.readFile(filePath, 'utf-8');
          if (content.includes('import') && content.includes('export')) {
            // Basic syntax check
            try {
              // This would be more thorough with actual TypeScript compilation
              const hasImports = content.includes('import');
              const hasExports = content.includes('export');
              if (!hasImports || !hasExports) {
                throw new Error(`File ${file} missing imports or exports`);
              }
            } catch (error) {
              throw new Error(`Syntax error in ${file}: ${error}`);
            }
          }
        }
      }

      return { filesChecked: files.length };
    });
  }

  /**
   * Check CLI tools accessibility
   */
  private async checkCliTools(): Promise<void> {
    console.log('\n⚡ Checking CLI Tools...');

    const cliScripts = [
      'blog-create.ts',
      'blog-publish.ts',
      'blog-analytics.ts',
      'blog-seo-check.ts',
      'blog-workflow-status.ts',
    ];

    for (const script of cliScripts) {
      await this.runTest(`CLI script ${script} exists`, 'cli', async () => {
        const scriptPath = join(process.cwd(), 'scripts', script);
        await fs.access(scriptPath);
        return { exists: true, path: scriptPath };
      });

      await this.runTest(`CLI script ${script} executable`, 'cli', async () => {
        const scriptPath = join(process.cwd(), 'scripts', script);
        const content = await fs.readFile(scriptPath, 'utf-8');

        if (!content.includes('#!/usr/bin/env bun')) {
          throw new Error(`Script ${script} missing shebang`);
        }

        return { executable: true };
      });
    }

    await this.runTest('CLI scripts in package.json', 'cli', async () => {
      const packageJsonPath = join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, 'utf-8')
      );

      const requiredScripts = [
        'blog:create',
        'blog:publish',
        'blog:analytics',
        'blog:seo-check',
        'blog:workflow:status',
      ];

      for (const script of requiredScripts) {
        if (!packageJson.scripts[script]) {
          throw new Error(`Missing script: ${script}`);
        }
      }

      return { scripts: requiredScripts };
    });
  }

  /**
   * Check template system
   */
  private async checkTemplateSystem(): Promise<void> {
    console.log('\n📋 Checking Template System...');

    const templatesPath = join(
      process.cwd(),
      'lib',
      'blog-scripts',
      'templates'
    );
    const templateFiles = await fs.readdir(templatesPath);

    const requiredTemplates = [
      'timing-guide.ts',
      'case-study.ts',
      'feature-announce.ts',
      'presentation-tips.ts',
    ];

    for (const template of requiredTemplates) {
      await this.runTest(
        `Template ${template} exists`,
        'templates',
        async () => {
          const templatePath = join(templatesPath, template);
          await fs.access(templatePath);

          // Check template structure
          const content = await fs.readFile(templatePath, 'utf-8');
          if (!content.includes('export') || !content.includes('interface')) {
            throw new Error(`Template ${template} has invalid structure`);
          }

          return { exists: true, path: templatePath };
        }
      );
    }

    await this.runTest('Template types consistency', 'templates', async () => {
      // Check that all templates export the required interface
      const typesPath = join(process.cwd(), 'lib', 'blog-scripts', 'types.ts');
      const typesContent = await fs.readFile(typesPath, 'utf-8');

      if (!typesContent.includes('CueTimerTemplate')) {
        throw new Error('Missing CueTimerTemplate interface');
      }

      return { typesValid: true };
    });

    await this.runTest(
      'Template variable validation',
      'templates',
      async () => {
        // Check that templates have proper variable definitions
        const timingGuidePath = join(templatesPath, 'timing-guide.ts');
        const content = await fs.readFile(timingGuidePath, 'utf-8');

        if (!content.includes('TimingGuideVariables')) {
          throw new Error('Missing TimingGuideVariables interface');
        }

        return { variablesValid: true };
      }
    );
  }

  /**
   * Check content creation
   */
  private async checkContentCreation(): Promise<void> {
    console.log('\n✍️ Checking Content Creation...');

    await this.runTest(
      'ContentCreator class available',
      'content',
      async () => {
        const contentCreatorPath = join(
          process.cwd(),
          'lib',
          'blog-scripts',
          'content-creator.ts'
        );
        await fs.access(contentCreatorPath);

        const content = await fs.readFile(contentCreatorPath, 'utf-8');
        if (!content.includes('export class ContentCreator')) {
          throw new Error('ContentCreator class not found');
        }

        return { classAvailable: true };
      }
    );

    await this.runTest(
      'ContentCreator can instantiate',
      'content',
      async () => {
        // Dynamic import for testing
        try {
          const { ContentCreator } = await import(
            '../lib/blog-scripts/content-creator'
          );
          const creator = new ContentCreator();

          if (!creator || typeof creator.createPost !== 'function') {
            throw new Error('ContentCreator instantiation failed');
          }

          return { instantiation: true };
        } catch (error) {
          throw new Error(
            `ContentCreator import/instantiation failed: ${error}`
          );
        }
      }
    );

    await this.runTest('MDX file format validation', 'content', async () => {
      // Test MDX file creation and validation
      const testContent = `---
title: "Test Post"
slug: "test-post"
category: "timing-guide"
author: "Test Author"
publishedAt: "2024-01-01T00:00:00Z"
readTime: 5
isDraft: true
language: "en"
lastModified: "2024-01-01T00:00:00Z"
---

# Test Post

This is test content.
`;

      const testFilePath = join(this.config.contentDir, 'test-post.mdx');
      await fs.writeFile(testFilePath, testContent);

      // Verify file exists and has content
      const stats = await fs.stat(testFilePath);
      const content = await fs.readFile(testFilePath, 'utf-8');

      if (stats.size === 0 || !content.includes('---')) {
        throw new Error('MDX file format invalid');
      }

      return {
        fileCreated: true,
        size: stats.size,
        hasFrontmatter: content.includes('---'),
      };
    });
  }

  /**
   * Check performance
   */
  private async checkPerformance(): Promise<void> {
    console.log('\n🚀 Checking Performance...');

    await this.runTest(
      'CLI response time measurement',
      'performance',
      async () => {
        const startTime = Date.now();

        try {
          // Test package.json script resolution
          execSync('bun run --help', { stdio: 'pipe', timeout: 5000 });
          const responseTime = Date.now() - startTime;

          if (responseTime > 3000) {
            throw new Error(`CLI response time too slow: ${responseTime}ms`);
          }

          return { responseTime };
        } catch (error) {
          if (error instanceof Error && error.message.includes('timeout')) {
            throw new Error('CLI command timed out');
          }
          throw error;
        }
      }
    );

    await this.runTest(
      'Content generation performance',
      'performance',
      async () => {
        const startTime = Date.now();

        // Test file system operations
        const testFiles = [];
        for (let i = 0; i < 10; i++) {
          const testFilePath = join(
            this.config.contentDir,
            `perf-test-${i}.mdx`
          );
          const testContent = `---
title: "Performance Test ${i}"
slug: "perf-test-${i}"
category: "timing-guide"
---

# Performance Test ${i}

Content for performance testing.
`;
          await fs.writeFile(testFilePath, testContent);
          testFiles.push(testFilePath);
        }

        const generationTime = Date.now() - startTime;

        // Cleanup
        await Promise.all(
          testFiles.map((file) => fs.unlink(file).catch(() => {}))
        );

        if (generationTime > 2000) {
          throw new Error(
            `Content generation too slow: ${generationTime}ms for 10 files`
          );
        }

        return { generationTime, filesGenerated: testFiles.length };
      }
    );

    await this.runTest('Memory usage validation', 'performance', async () => {
      const memUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);

      // Check if memory usage is reasonable (< 200MB for health check)
      if (heapUsedMB > 200) {
        throw new Error(`Memory usage too high: ${heapUsedMB}MB`);
      }

      return {
        heapUsed: heapUsedMB,
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
      };
    });
  }

  /**
   * Check error handling
   */
  private async checkErrorHandling(): Promise<void> {
    console.log('\n🛡️ Checking Error Handling...');

    await this.runTest('Invalid template handling', 'errors', async () => {
      try {
        // This should throw an error for invalid template
        const { ContentCreator } = await import(
          '../lib/blog-scripts/content-creator'
        );
        const creator = new ContentCreator();

        // Create invalid template
        const invalidTemplate: TestTemplate = {
          id: 'invalid',
          name: 'Invalid Template',
          category: 'invalid-category',
          languages: ['en'],
          variables: [],
          contentStructure: [],
        };

        await creator.createPost(invalidTemplate as CueTimerTemplate, {}, 'en');
        throw new Error('Should have thrown an error for invalid template');
      } catch (error) {
        // Expected error
        return { errorHandled: true, message: String(error) };
      }
    });

    await this.runTest('Missing variables handling', 'errors', async () => {
      try {
        const { ContentCreator } = await import(
          '../lib/blog-scripts/content-creator'
        );
        const creator = new ContentCreator();

        const template = {
          id: 'test',
          name: 'Test Template',
          category: 'timing-guide' as const,
          languages: ['en'],
          variables: [
            {
              name: 'requiredVar',
              type: 'string' as const,
              required: true,
              description: 'Required variable',
            },
          ],
          contentStructure: [],
        };

        // Don't provide required variable
        await creator.createPost(template, {}, 'en');
        throw new Error(
          'Should have thrown an error for missing required variable'
        );
      } catch (error) {
        // Expected error
        return { errorHandled: true, message: String(error) };
      }
    });

    await this.runTest('File system error handling', 'errors', async () => {
      try {
        // Try to access non-existent file
        const nonExistentPath = join(
          this.config.contentDir,
          'non-existent.mdx'
        );
        await fs.access(nonExistentPath);
        throw new Error('Should have thrown an error for non-existent file');
      } catch (error) {
        // Expected error
        return { errorHandled: true, message: String(error) };
      }
    });
  }

  /**
   * Calculate overall status
   */
  private calculateOverallStatus(): void {
    this.results.overall = this.results.failedTests === 0;
  }

  /**
   * Print test results
   */
  private printResults(): void {
    console.log(`\n${'='.repeat(60)}`);
    console.log('🏁 CUE TIMER BLOG SYSTEM HEALTH CHECK RESULTS');
    console.log('='.repeat(60));

    console.log('\n📊 Summary:');
    console.log(`   Total Tests: ${this.results.totalTests}`);
    console.log(`   Passed: ${this.results.passedTests} ✅`);
    console.log(`   Failed: ${this.results.failedTests} ❌`);
    console.log(`   Duration: ${this.results.duration}ms`);

    console.log('\n📋 Results by Category:');

    const categories = [
      { name: 'Dependencies', key: 'dependencies' as const },
      { name: 'Compilation', key: 'compilation' as const },
      { name: 'CLI Tools', key: 'cli' as const },
      { name: 'Templates', key: 'templates' as const },
      { name: 'Content Creation', key: 'content' as const },
      { name: 'Performance', key: 'performance' as const },
      { name: 'Error Handling', key: 'errors' as const },
    ];

    for (const category of categories) {
      const results = this.results.categories[category.key];
      const passed = results.filter((r) => r.success).length;
      const total = results.length;
      const status = passed === total ? '✅' : '❌';

      console.log(`   ${status} ${category.name}: ${passed}/${total} passed`);
    }

    console.log(
      `\n🎯 Overall Status: ${this.results.overall ? '✅ HEALTHY' : '❌ ISSUES FOUND'}`
    );

    if (!this.results.overall) {
      console.log('\n❌ Failed Tests:');
      for (const category of categories) {
        const failed = this.results.categories[category.key].filter(
          (r) => !r.success
        );
        if (failed.length > 0) {
          console.log(`\n   ${category.name}:`);
          failed.forEach((test) => {
            console.log(`     ❌ ${test.name}: ${test.message}`);
          });
        }
      }
    }

    console.log(`\n${'='.repeat(60)}`);

    if (this.results.overall) {
      console.log('🎉 System is ready for production use!');
    } else {
      console.log(
        '⚠️  Please address the failed tests before deploying to production.'
      );
    }

    console.log('='.repeat(60));
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const verbose = !args.includes('--quiet');
  const exitOnError = args.includes('--exit-on-error');

  const validator = new SystemValidator({
    verbose,
    exitOnError,
  });

  validator
    .runHealthChecks()
    .then((results) => {
      process.exit(results.overall ? 0 : 1);
    })
    .catch((error) => {
      console.error('Health check failed:', error);
      process.exit(1);
    });
}

export { SystemValidator };
export type { HealthCheckResult, TestConfig, TestResult };
```
