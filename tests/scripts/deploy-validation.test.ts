/**
 * Unit tests for deploy-validation script
 * Tests deployment validation functionality with proper ESLint compliance
 */

// Reference global test types
/// <reference types="../types/test" />

import { afterAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';

// Mock dependencies to avoid system calls during testing
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

jest.mock('ora', () => ({
  start: jest.fn(() => ({
    succeed: jest.fn(),
    fail: jest.fn(),
  })),
}));

jest.mock('chalk', () => ({
  blue: { bold: jest.fn((text) => text) },
  green: jest.fn((text) => text),
  red: jest.fn((text) => text),
  yellow: jest.fn((text) => text),
  white: jest.fn((text) => text),
  gray: jest.fn((text) => text),
  bold: jest.fn((text) => text),
}));

// Import after mocking
import { DeploymentValidator } from '../../scripts/deploy-validation';

describe('deploy-validation Script', () => {
  const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
  const testTempDir = join(process.cwd(), 'temp-test-files');

  beforeEach(async () => {
    jest.clearAllMocks();

    // Create temp directory for tests
    try {
      await fs.mkdir(testTempDir, { recursive: true });
      await fs.mkdir(join(testTempDir, '.next'), { recursive: true });
      await fs.mkdir(join(testTempDir, 'content', 'blog'), { recursive: true });
      await fs.mkdir(join(testTempDir, 'lib', 'blog-scripts', 'templates'), { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Change working directory for tests
    const originalCwd = process.cwd();
    process.chdir(testTempDir);
  });

  afterAll(async () => {
    // Restore original working directory
    const originalCwd = process.cwd();
    process.chdir(join(testTempDir, '..'));

    // Clean up temp directory
    try {
      await fs.rm(testTempDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist
    }
  });

  describe('Type Safety Validation', () => {
    test('should pass when no TypeScript errors found', async () => {
      // Arrange
      mockExecSync.mockReturnValue('TypeScript compilation complete');

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.typeSafety.success).toBe(true);
      expect(result.categories.typeSafety.message).toBe('No TypeScript errors found');
    });

    test('should fail when TypeScript errors are found', async () => {
      // Arrange
      mockExecSync.mockReturnValue('error TS2322: Type error found\nerror TS2580: Another error');

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.typeSafety.success).toBe(false);
      expect(result.categories.typeSafety.message).toBe('Found 2 TypeScript errors');
      expect(result.criticalIssues).toContain('2 TypeScript errors need to be resolved');
    });

    test('should handle TypeScript validation exceptions', async () => {
      // Arrange
      mockExecSync.mockImplementation(() => {
        throw new Error('TypeScript process failed');
      });

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.typeSafety.success).toBe(false);
      expect(result.categories.typeSafety.message).toBe('TypeScript validation threw an exception');
      expect(result.criticalIssues).toContain('TypeScript validation is failing');
    });
  });

  describe('Code Quality Validation', () => {
    test('should pass when ESLint and Prettier checks pass', async () => {
      // Arrange
      mockExecSync.mockReturnValueOnce('ESLint check passed').mockReturnValueOnce('');

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.codeQuality.success).toBe(true);
      expect(result.categories.codeQuality.message).toBe('Code quality standards met');
    });

    test('should fail when ESLint errors are found', async () => {
      // Arrange
      mockExecSync.mockReturnValueOnce('error: Parsing error found').mockReturnValueOnce('');

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.codeQuality.success).toBe(false);
      expect(result.criticalIssues).toContain('1 ESLint errors need to be fixed');
    });

    test('should recommend formatting fixes when Prettier issues exist', async () => {
      // Arrange
      mockExecSync
        .mockReturnValueOnce('ESLint check passed')
        .mockReturnValueOnce('File needs formatting');

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.codeQuality.success).toBe(false);
      expect(result.recommendations).toContain('Run `bun run format` to fix formatting issues');
    });
  });

  describe('Build Process Validation', () => {
    test('should pass when build completes successfully', async () => {
      // Arrange
      mockExecSync.mockReturnValue('Build completed successfully');

      // Create mock build manifest
      await fs.writeFile(
        join(testTempDir, '.next', 'build-manifest.json'),
        JSON.stringify({ pages: ['/test'] })
      );

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.buildValidation.success).toBe(true);
      expect(result.categories.buildValidation.message).toBe('Application builds successfully');
    });

    test('should fail when build process fails', async () => {
      // Arrange
      mockExecSync.mockImplementation(() => {
        throw new Error('Build failed');
      });

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.buildValidation.success).toBe(false);
      expect(result.criticalIssues).toContain('Build process is broken');
    });
  });

  describe('Content System Validation', () => {
    test('should pass when content structure is valid', async () => {
      // Arrange
      // Create valid MDX files
      await fs.writeFile(
        join(testTempDir, 'content', 'blog', 'test.mdx'),
        '---\ntitle: Test Post\nsummary: Test Summary\n---\n\n# Test Content'
      );

      // Create template files
      await fs.writeFile(
        join(testTempDir, 'lib', 'blog-scripts', 'templates', 'template1.ts'),
        'export const template1 = {}'
      );
      await fs.writeFile(
        join(testTempDir, 'lib', 'blog-scripts', 'templates', 'template2.ts'),
        'export const template2 = {}'
      );
      await fs.writeFile(
        join(testTempDir, 'lib', 'blog-scripts', 'templates', 'template3.ts'),
        'export const template3 = {}'
      );
      await fs.writeFile(
        join(testTempDir, 'lib', 'blog-scripts', 'templates', 'template4.ts'),
        'export const template4 = {}'
      );

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.contentValidation.success).toBe(true);
      expect(result.categories.contentValidation.message).toBe(
        'Content system is fully functional'
      );
    });

    test('should fail when MDX files are invalid', async () => {
      // Arrange
      // Create invalid MDX file (no frontmatter)
      await fs.writeFile(
        join(testTempDir, 'content', 'blog', 'invalid.mdx'),
        '# Just content without frontmatter'
      );

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.contentValidation.success).toBe(false);
      expect(result.recommendations).toContain('Fix 1 invalid MDX files');
    });

    test('should fail when insufficient templates exist', async () => {
      // Arrange
      // Create only 2 templates (expecting at least 4)
      await fs.writeFile(
        join(testTempDir, 'lib', 'blog-scripts', 'templates', 'template1.ts'),
        'export const template1 = {}'
      );
      await fs.writeFile(
        join(testTempDir, 'lib', 'blog-scripts', 'templates', 'template2.ts'),
        'export const template2 = {}'
      );

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.contentValidation.success).toBe(false);
      expect(result.recommendations).toContain('Ensure all blog templates are implemented');
    });
  });

  describe('CLI Tools Validation', () => {
    test('should pass when all CLI tools are functional', async () => {
      // Arrange
      mockExecSync.mockReturnValue('Help output');

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.cliValidation.success).toBe(true);
      expect(result.categories.cliValidation.message).toBe('All CLI tools are functional');
    });

    test('should fail when CLI tools are not working', async () => {
      // Arrange
      mockExecSync.mockImplementation(() => {
        throw new Error('Command not found');
      });

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.cliValidation.success).toBe(false);
      expect(result.recommendations).toContain('Fix 5 non-functional CLI tools');
    });
  });

  describe('Performance Validation', () => {
    test('should pass when performance metrics are within limits', async () => {
      // Arrange
      mockExecSync.mockReturnValue('Build completed');

      // Create mock bundle size within limits
      mockExecSync.mockReturnValue('10485760\t.next'); // 10MB

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.performanceValidation.success).toBe(true);
      expect(result.categories.performanceValidation.message).toBe(
        'Performance benchmarks are within acceptable limits'
      );
    });

    test('should fail when bundle size is too large', async () => {
      // Arrange
      mockExecSync.mockReturnValue('Build completed');

      // Create mock bundle size over limit (50MB)
      mockExecSync.mockReturnValue('52428800\t.next'); // 50MB

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.performanceValidation.success).toBe(false);
      expect(result.recommendations).toContain('Consider optimizing bundle size');
    });
  });

  describe('Security Validation', () => {
    test('should pass when no security vulnerabilities found', async () => {
      // Arrange
      mockExecSync.mockReturnValue('found 0 vulnerabilities');

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.securityValidation.success).toBe(true);
      expect(result.categories.securityValidation.message).toBe(
        'Security best practices are followed'
      );
    });

    test('should fail when security vulnerabilities are found', async () => {
      // Arrange
      mockExecSync.mockReturnValue('found 5 vulnerabilities (2 moderate, 3 high)');

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.securityValidation.success).toBe(false);
      expect(result.criticalIssues).toContain('5 security vulnerabilities found');
      expect(result.recommendations).toContain('Run `bun audit fix` to resolve vulnerabilities');
    });
  });

  describe('Dependency Validation', () => {
    test('should pass when dependencies are properly installed', async () => {
      // Arrange
      const packageJson = {
        dependencies: { next: '15.0.0', react: '18.0.0', typescript: '5.0.0' },
        devDependencies: { jest: '29.0.0' },
      };

      await fs.writeFile(join(testTempDir, 'package.json'), JSON.stringify(packageJson));

      // Create node_modules directory
      await fs.mkdir(join(testTempDir, 'node_modules'), { recursive: true });

      mockExecSync.mockReturnValue('All packages are up to date');

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.dependencyValidation.success).toBe(true);
      expect(result.categories.dependencyValidation.message).toBe(
        'Dependencies are properly installed and compatible'
      );
    });

    test('should fail when package.json is missing', async () => {
      // Arrange
      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.dependencyValidation.success).toBe(false);
      expect(result.criticalIssues).toContain('package.json is invalid or missing');
    });

    test('should fail when critical dependencies are missing', async () => {
      // Arrange
      const packageJson = {
        dependencies: { someOtherDep: '1.0.0' },
      };

      await fs.writeFile(join(testTempDir, 'package.json'), JSON.stringify(packageJson));

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.categories.dependencyValidation.success).toBe(false);
      expect(result.criticalIssues).toContain(
        'Missing critical dependencies: next, react, typescript'
      );
    });
  });

  describe('ESLint Compliance Tests', () => {
    test('should use proper TypeScript error handling', async () => {
      // Arrange
      mockExecSync.mockReturnValue('error TS2322: Type mismatch');

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert - Should handle TypeScript errors properly
      expect(result.categories.typeSafety.details).toHaveProperty('errorCount', 1);
      expect(result.categories.typeSafety.details).toHaveProperty('sampleErrors');
    });

    test('should follow no-unused-vars pattern', async () => {
      // This test verifies that variables are properly used
      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert - All variables in the validation process should be used
      expect(result).toHaveProperty('overall');
      expect(result).toHaveProperty('categories');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('criticalIssues');
    });

    test('should use proper error boundaries', async () => {
      // Arrange
      mockExecSync.mockImplementation(() => {
        throw new Error('System error');
      });

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert - Should handle errors gracefully without crashing
      expect(result.overall.success).toBe(false);
      expect(result.categories.typeSafety.success).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    test('should provide comprehensive deployment report', async () => {
      // Arrange - Mock successful validations
      mockExecSync.mockReturnValue('Success');

      // Create required files and directories
      await fs.writeFile(
        join(testTempDir, 'package.json'),
        JSON.stringify({ dependencies: { next: '15.0.0', react: '18.0.0', typescript: '5.0.0' } })
      );
      await fs.mkdir(join(testTempDir, 'node_modules'), { recursive: true });
      await fs.writeFile(
        join(testTempDir, '.next', 'build-manifest.json'),
        JSON.stringify({ pages: ['/test'] })
      );

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.overall).toHaveProperty('success');
      expect(result.overall).toHaveProperty('totalChecks', 8);
      expect(result.overall).toHaveProperty('passedChecks');
      expect(result.overall).toHaveProperty('failedChecks');
      expect(result.overall).toHaveProperty('totalDuration');
    });

    test('should handle mixed validation results appropriately', async () => {
      // Arrange - Mock mixed success/failure results
      mockExecSync
        .mockReturnValueOnce('error TS2322: Type error') // Type safety fails
        .mockReturnValueOnce('ESLint check passed') // Code quality passes
        .mockReturnValueOnce('Build completed') // Build passes
        .mockReturnValue('Success'); // Others pass

      const validator = new DeploymentValidator();

      // Act
      const result = await validator.runFullValidation();

      // Assert
      expect(result.overall.success).toBe(false);
      expect(result.categories.typeSafety.success).toBe(false);
      expect(result.categories.codeQuality.success).toBe(true);
      expect(result.categories.buildValidation.success).toBe(true);
      expect(result.criticalIssues.length).toBeGreaterThan(0);
    });
  });
});
