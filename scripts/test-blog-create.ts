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
    console.log(`📄 Output: ${output.substring(0, 200)}${output.length > 200 ? '...' : ''}`);
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`❌ Failed: ${description}`);
    console.log(`🔴 Error: ${error instanceof Error ? error.message : String(error)}`);
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
    console.log(`🔴 Error: ${error instanceof Error ? error.message : String(error)}`);
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
  runCommand('bun run blog:create help-templates', 'Show template descriptions');

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
      console.log('\n🎉 All tests passed! The Blog Creation CLI is working correctly.');
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
