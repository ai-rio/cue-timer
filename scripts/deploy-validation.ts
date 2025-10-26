#!/usr/bin/env tsx

/**
 * Deployment Validation Script
 *
 * Comprehensive validation suite for CueTimer blog management system
 * Ensures production readiness through multiple validation layers
 */

import chalk from 'chalk';
import { execSync } from 'child_process';
import { existsSync, readFileSync, statSync } from 'fs';
import ora from 'ora';
import { join } from 'path';

interface ValidationResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
  duration?: number;
}

interface ValidationReport {
  overall: {
    success: boolean;
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    totalDuration: number;
  };
  categories: {
    typeSafety: ValidationResult;
    codeQuality: ValidationResult;
    buildValidation: ValidationResult;
    contentValidation: ValidationResult;
    cliValidation: ValidationResult;
    performanceValidation: ValidationResult;
    securityValidation: ValidationResult;
    dependencyValidation: ValidationResult;
  };
  recommendations: string[];
  criticalIssues: string[];
}

class DeploymentValidator {
  private startTime: number = Date.now();

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
  private report: Partial<ValidationReport> = {
    categories: {
      typeSafety: { success: false, message: '', duration: 0 },
      codeQuality: { success: false, message: '', duration: 0 },
      buildValidation: { success: false, message: '', duration: 0 },
      contentValidation: { success: false, message: '', duration: 0 },
      cliValidation: { success: false, message: '', duration: 0 },
      performanceValidation: { success: false, message: '', duration: 0 },
      securityValidation: { success: false, message: '', duration: 0 },
      dependencyValidation: { success: false, message: '', duration: 0 },
    },
    recommendations: [],
    criticalIssues: [],
  };

  async runFullValidation(): Promise<ValidationReport> {
    console.log(chalk.bold.blue('🚀 CueTimer Blog Management System - Deployment Validation'));
    console.log(chalk.gray('='.repeat(70)));

    // Run all validation categories
    await this.validateTypeSafety();
    await this.validateCodeQuality();
    await this.validateBuildProcess();
    await this.validateContentSystem();
    await this.validateCliTools();
    await this.validatePerformance();
    await this.validateSecurity();
    await this.validateDependencies();

    // Generate final report
    this.generateFinalReport();

    return this.report as ValidationReport;
  }

  private async validateTypeSafety(): Promise<ValidationResult> {
    const spinner = ora('Validating TypeScript type safety...').start();
    const startTime = Date.now();

    try {
      // Run TypeScript type checking
      const typeCheckOutput = execSync('bun run type-check', {
        encoding: 'utf8',
        stdio: 'pipe',
      });

      // Count TypeScript errors
      const errorCount = (typeCheckOutput.match(/error TS/g) || []).length;

      if (errorCount === 0) {
        spinner.succeed('TypeScript validation passed');
        this.report.categories!.typeSafety = {
          success: true,
          message: 'No TypeScript errors found',
          duration: Date.now() - startTime,
        };
      } else {
        spinner.fail(`TypeScript validation failed: ${errorCount} errors found`);
        this.report.categories!.typeSafety = {
          success: false,
          message: `Found ${errorCount} TypeScript errors`,
          details: { errorCount, sampleErrors: this.extractTypeScriptErrors(typeCheckOutput) },
          duration: Date.now() - startTime,
        };
        this.report.criticalIssues!.push(`${errorCount} TypeScript errors need to be resolved`);
      }
    } catch (error: unknown) {
      spinner.fail('TypeScript validation failed with exception');
      this.report.categories!.typeSafety = {
        success: false,
        message: 'TypeScript validation threw an exception',
        details: { error: this.getErrorMessage(error) },
        duration: Date.now() - startTime,
      };
      this.report.criticalIssues!.push('TypeScript validation is failing');
    }

    return this.report.categories!.typeSafety!;
  }

  private async validateCodeQuality(): Promise<ValidationResult> {
    const spinner = ora('Validating code quality (ESLint, Prettier)...').start();
    const startTime = Date.now();

    try {
      // Run ESLint
      const eslintOutput = execSync('bun run lint:all', {
        encoding: 'utf8',
        stdio: 'pipe',
      });

      // Check Prettier formatting
      const prettierOutput = execSync('bun run format:check', {
        encoding: 'utf8',
        stdio: 'pipe',
      });

      // Count ESLint warnings and errors
      const eslintErrors = (eslintOutput.match(/error/g) || []).length;
      const eslintWarnings = (eslintOutput.match(/warning/g) || []).length;

      if (eslintErrors === 0 && prettierOutput.trim() === '') {
        spinner.succeed('Code quality validation passed');
        this.report.categories!.codeQuality = {
          success: true,
          message: 'Code quality standards met',
          details: { eslintErrors: 0, eslintWarnings, prettierCompliant: true },
          duration: Date.now() - startTime,
        };
      } else {
        spinner.fail(`Code quality issues found: ${eslintErrors} errors, formatting issues`);
        this.report.categories!.codeQuality = {
          success: false,
          message: 'Code quality issues detected',
          details: { eslintErrors, eslintWarnings, prettierIssues: prettierOutput.trim() !== '' },
          duration: Date.now() - startTime,
        };

        if (eslintErrors > 0) {
          this.report.criticalIssues!.push(`${eslintErrors} ESLint errors need to be fixed`);
        }
        if (prettierOutput.trim() !== '') {
          this.report.recommendations!.push('Run `bun run format` to fix formatting issues');
        }
      }
    } catch (error: unknown) {
      spinner.fail('Code quality validation failed');
      this.report.categories!.codeQuality = {
        success: false,
        message: 'Code quality validation threw an exception',
        details: { error: this.getErrorMessage(error) },
        duration: Date.now() - startTime,
      };
      this.report.recommendations!.push('Review code quality issues manually');
    }

    return this.report.categories!.codeQuality!;
  }

  private async validateBuildProcess(): Promise<ValidationResult> {
    const spinner = ora('Validating build process...').start();
    const startTime = Date.now();

    try {
      // Run Next.js build
      const buildOutput = execSync('bun run build', {
        encoding: 'utf8',
        stdio: 'pipe',
      });

      // Check for build errors
      const buildErrors = (buildOutput.match(/error/gi) || []).length;

      // Check if .next directory was created successfully
      const nextDirExists = existsSync('.next');
      const buildStats = nextDirExists ? this.getBuildStats() : null;

      if (buildErrors === 0 && nextDirExists && buildStats) {
        spinner.succeed('Build validation passed');
        this.report.categories!.buildValidation = {
          success: true,
          message: 'Application builds successfully',
          details: { buildStats },
          duration: Date.now() - startTime,
        };
      } else {
        spinner.fail('Build validation failed');
        this.report.categories!.buildValidation = {
          success: false,
          message: `Build process failed: ${buildErrors} errors`,
          details: { buildErrors, nextDirExists, buildStats },
          duration: Date.now() - startTime,
        };
        this.report.criticalIssues!.push('Application build is failing');
      }
    } catch (error: unknown) {
      spinner.fail('Build validation failed with exception');
      this.report.categories!.buildValidation = {
        success: false,
        message: 'Build process threw an exception',
        details: { error: this.getErrorMessage(error) },
        duration: Date.now() - startTime,
      };
      this.report.criticalIssues!.push('Build process is broken');
    }

    return this.report.categories!.buildValidation!;
  }

  private async validateContentSystem(): Promise<ValidationResult> {
    const spinner = ora('Validating MDX content and templates...').start();
    const startTime = Date.now();

    try {
      // Check content directories
      const contentDirExists = existsSync('content');
      const blogDirExists = existsSync('content/blog');

      // Validate MDX files
      const mdxFiles = this.findMdxFiles('content');
      const validMdxFiles = [];
      const invalidMdxFiles = [];

      for (const file of mdxFiles) {
        try {
          const content = readFileSync(file, 'utf8');
          // Basic MDX validation
          if (content.includes('---') && content.includes('title:')) {
            validMdxFiles.push(file);
          } else {
            invalidMdxFiles.push(file);
          }
        } catch (error) {
          invalidMdxFiles.push(file);
        }
      }

      // Check template system
      const templatesDirExists = existsSync('lib/blog-scripts/templates');
      const templateCount = templatesDirExists
        ? this.countFiles('lib/blog-scripts/templates', '.ts')
        : 0;

      const totalChecks = 4;
      const passedChecks = [
        contentDirExists,
        blogDirExists,
        invalidMdxFiles.length === 0,
        templateCount >= 4, // Expecting at least 4 templates
      ].filter(Boolean).length;

      const success = passedChecks === totalChecks;

      if (success) {
        spinner.succeed('Content system validation passed');
        this.report.categories!.contentValidation = {
          success: true,
          message: 'Content system is fully functional',
          details: {
            mdxFiles: validMdxFiles.length,
            templates: templateCount,
            contentStructure: 'valid',
          },
          duration: Date.now() - startTime,
        };
      } else {
        spinner.fail('Content system validation failed');
        this.report.categories!.contentValidation = {
          success: false,
          message: `Content system issues: ${totalChecks - passedChecks} problems found`,
          details: {
            contentDirExists,
            blogDirExists,
            invalidMdxFiles: invalidMdxFiles.length,
            templates: templateCount,
          },
          duration: Date.now() - startTime,
        };

        if (invalidMdxFiles.length > 0) {
          this.report.recommendations!.push(`Fix ${invalidMdxFiles.length} invalid MDX files`);
        }
        if (templateCount < 4) {
          this.report.recommendations!.push('Ensure all blog templates are implemented');
        }
      }
    } catch (error: unknown) {
      spinner.fail('Content validation failed');
      this.report.categories!.contentValidation = {
        success: false,
        message: 'Content validation threw an exception',
        details: { error: this.getErrorMessage(error) },
        duration: Date.now() - startTime,
      };
    }

    return this.report.categories!.contentValidation!;
  }

  private async validateCliTools(): Promise<ValidationResult> {
    const spinner = ora('Validating CLI tools functionality...').start();
    const startTime = Date.now();

    try {
      const cliTools = [
        'blog:create',
        'blog:publish',
        'blog:analytics',
        'blog:seo-check',
        'blog:workflow:status',
      ];

      const results = [];

      for (const tool of cliTools) {
        try {
          // Test CLI tool help/usage (dry run)
          execSync(`bun run ${tool} --help`, {
            encoding: 'utf8',
            stdio: 'pipe',
            timeout: 5000,
          });
          results.push({ tool, status: 'success' });
        } catch (error: unknown) {
          results.push({ tool, status: 'failed', error: this.getErrorMessage(error) });
        }
      }

      const successCount = results.filter((r) => r.status === 'success').length;
      const success = successCount === cliTools.length;

      if (success) {
        spinner.succeed('CLI tools validation passed');
        this.report.categories!.cliValidation = {
          success: true,
          message: 'All CLI tools are functional',
          details: { tools: cliTools.length, allWorking: true },
          duration: Date.now() - startTime,
        };
      } else {
        spinner.fail(`CLI validation failed: ${cliTools.length - successCount} tools not working`);
        this.report.categories!.cliValidation = {
          success: false,
          message: 'Some CLI tools are not functional',
          details: {
            total: cliTools.length,
            working: successCount,
            failed: results.filter((r) => r.status === 'failed'),
          },
          duration: Date.now() - startTime,
        };

        const failedTools = results.filter((r) => r.status === 'failed');
        if (failedTools.length > 0) {
          this.report.recommendations!.push(`Fix ${failedTools.length} non-functional CLI tools`);
        }
      }
    } catch (error: unknown) {
      spinner.fail('CLI validation failed');
      this.report.categories!.cliValidation = {
        success: false,
        message: 'CLI validation threw an exception',
        details: { error: this.getErrorMessage(error) },
        duration: Date.now() - startTime,
      };
    }

    return this.report.categories!.cliValidation!;
  }

  private async validatePerformance(): Promise<ValidationResult> {
    const spinner = ora('Validating performance benchmarks...').start();
    const startTime = Date.now();

    try {
      // Check bundle size (if .next exists)
      const bundleSize = this.getBundleSize();

      // Check build time performance
      const buildTime = this.measureBuildTime();

      // Memory usage simulation
      const memoryUsage = process.memoryUsage();

      const performanceMetrics = {
        bundleSizeMB: bundleSize ? (bundleSize / 1024 / 1024).toFixed(2) : 'unknown',
        buildTimeSeconds: (buildTime / 1000).toFixed(2),
        memoryUsageMB: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
      };

      // Performance thresholds
      const bundleSizeOk = !bundleSize || bundleSize < 50 * 1024 * 1024; // < 50MB
      const buildTimeOk = buildTime < 120000; // < 2 minutes
      const memoryOk = memoryUsage.heapUsed < 512 * 1024 * 1024; // < 512MB

      const success = bundleSizeOk && buildTimeOk && memoryOk;

      if (success) {
        spinner.succeed('Performance validation passed');
        this.report.categories!.performanceValidation = {
          success: true,
          message: 'Performance benchmarks are within acceptable limits',
          details: performanceMetrics,
          duration: Date.now() - startTime,
        };
      } else {
        spinner.fail('Performance validation failed');
        this.report.categories!.performanceValidation = {
          success: false,
          message: 'Performance issues detected',
          details: {
            ...performanceMetrics,
            bundleSizeOk,
            buildTimeOk,
            memoryOk,
          },
          duration: Date.now() - startTime,
        };

        if (!bundleSizeOk) {
          this.report.recommendations!.push('Consider optimizing bundle size');
        }
        if (!buildTimeOk) {
          this.report.recommendations!.push('Build time is slow, consider optimization');
        }
      }
    } catch (error: unknown) {
      spinner.fail('Performance validation failed');
      this.report.categories!.performanceValidation = {
        success: false,
        message: 'Performance validation threw an exception',
        details: { error: this.getErrorMessage(error) },
        duration: Date.now() - startTime,
      };
    }

    return this.report.categories!.performanceValidation!;
  }

  private async validateSecurity(): Promise<ValidationResult> {
    const spinner = ora('Validating security best practices...').start();
    const startTime = Date.now();

    try {
      // Run security audit
      const auditOutput = execSync('bun run security:audit', {
        encoding: 'utf8',
        stdio: 'pipe',
      });

      // Count vulnerabilities
      const vulnerabilities = this.parseSecurityAudit(auditOutput);

      // Check for sensitive files
      const sensitiveFiles = this.checkForSensitiveFiles();

      // Check environment variables validation
      const envValidation = this.validateEnvironmentSecurity();

      const hasVulnerabilities = vulnerabilities.total > 0;
      const hasSensitiveFiles = sensitiveFiles.length > 0;
      const envSecure = envValidation.valid;

      const success = !hasVulnerabilities && !hasSensitiveFiles && envSecure;

      if (success) {
        spinner.succeed('Security validation passed');
        this.report.categories!.securityValidation = {
          success: true,
          message: 'Security best practices are followed',
          details: { vulnerabilities, sensitiveFiles: 0, envSecure: true },
          duration: Date.now() - startTime,
        };
      } else {
        spinner.fail('Security validation failed');
        this.report.categories!.securityValidation = {
          success: false,
          message: 'Security issues detected',
          details: {
            vulnerabilities,
            sensitiveFiles: sensitiveFiles.length,
            envSecure,
          },
          duration: Date.now() - startTime,
        };

        if (hasVulnerabilities) {
          this.report.criticalIssues!.push(
            `${vulnerabilities.total} security vulnerabilities found`
          );
          this.report.recommendations!.push('Run `bun audit fix` to resolve vulnerabilities');
        }
        if (hasSensitiveFiles) {
          this.report.criticalIssues!.push('Sensitive files detected in repository');
        }
        if (!envSecure) {
          this.report.recommendations!.push('Review environment variable security');
        }
      }
    } catch (error: unknown) {
      spinner.fail('Security validation failed');
      this.report.categories!.securityValidation = {
        success: false,
        message: 'Security validation threw an exception',
        details: { error: this.getErrorMessage(error) },
        duration: Date.now() - startTime,
      };
    }

    return this.report.categories!.securityValidation!;
  }

  private async validateDependencies(): Promise<ValidationResult> {
    const spinner = ora('Validating dependencies and compatibility...').start();
    const startTime = Date.now();

    try {
      // Check package.json exists and is valid
      const packageJsonExists = existsSync('package.json');
      let packageJsonValid = false;
      let dependenciesCount = 0;
      let outdatedCount = 0;

      if (packageJsonExists) {
        try {
          const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
          packageJsonValid = true;
          dependenciesCount = Object.keys(packageJson.dependencies || {}).length;

          // Check for outdated packages
          const outdatedOutput = execSync('bunx npm-check-updates', {
            encoding: 'utf8',
            stdio: 'pipe',
          });
          outdatedCount = (outdatedOutput.match(/↑/g) || []).length;
        } catch (error) {
          packageJsonValid = false;
        }
      }

      // Check node_modules exists
      const nodeModulesExists = existsSync('node_modules');

      // Check for critical dependencies
      const criticalDeps = ['next', 'react', 'typescript'];
      const missingCriticalDeps = this.checkMissingDependencies(criticalDeps);

      const success = packageJsonValid && nodeModulesExists && missingCriticalDeps.length === 0;

      if (success) {
        spinner.succeed('Dependency validation passed');
        this.report.categories!.dependencyValidation = {
          success: true,
          message: 'Dependencies are properly installed and compatible',
          details: {
            dependenciesCount,
            outdatedCount,
            criticalDepsOk: true,
          },
          duration: Date.now() - startTime,
        };
      } else {
        spinner.fail('Dependency validation failed');
        this.report.categories!.dependencyValidation = {
          success: false,
          message: 'Dependency issues detected',
          details: {
            packageJsonExists,
            packageJsonValid,
            nodeModulesExists,
            missingCriticalDeps,
            dependenciesCount,
          },
          duration: Date.now() - startTime,
        };

        if (!packageJsonValid) {
          this.report.criticalIssues!.push('package.json is invalid or missing');
        }
        if (!nodeModulesExists) {
          this.report.criticalIssues!.push('node_modules directory missing - run npm install');
        }
        if (missingCriticalDeps.length > 0) {
          this.report.criticalIssues!.push(
            `Missing critical dependencies: ${missingCriticalDeps.join(', ')}`
          );
        }
        if (outdatedCount > 0) {
          this.report.recommendations!.push(`${outdatedCount} packages can be updated`);
        }
      }
    } catch (error: unknown) {
      spinner.fail('Dependency validation failed');
      this.report.categories!.dependencyValidation = {
        success: false,
        message: 'Dependency validation threw an exception',
        details: { error: this.getErrorMessage(error) },
        duration: Date.now() - startTime,
      };
    }

    return this.report.categories!.dependencyValidation!;
  }

  private generateFinalReport(): void {
    const totalDuration = Date.now() - this.startTime;
    const categories = Object.values(this.report.categories!);
    const passedChecks = categories.filter((c) => c.success).length;
    const failedChecks = categories.length - passedChecks;

    this.report.overall = {
      success: failedChecks === 0,
      totalChecks: categories.length,
      passedChecks,
      failedChecks,
      totalDuration,
    };

    // Display final report
    console.log(`\n${chalk.bold.blue('📊 Deployment Validation Report')}`);
    console.log(chalk.gray('='.repeat(70)));

    console.log(
      `\n${chalk.bold('Overall Status:')} ${
        this.report.overall.success
          ? chalk.green('✅ READY FOR DEPLOYMENT')
          : chalk.red('❌ NOT READY FOR DEPLOYMENT')
      }`
    );

    console.log(
      `\n${chalk.bold('Summary:')} ${passedChecks}/${categories.length} categories passed`
    );
    console.log(`${chalk.bold('Duration:')} ${(totalDuration / 1000).toFixed(2)}s`);

    // Category results
    console.log(`\n${chalk.bold('Category Results:')}`);
    Object.entries(this.report.categories!).forEach(([category, result]) => {
      const status = result.success ? chalk.green('✅') : chalk.red('❌');
      const name = category.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      console.log(`  ${status} ${name}: ${result.message}`);
    });

    // Critical issues
    if (this.report.criticalIssues!.length > 0) {
      console.log(`\n${chalk.bold.red('🚨 Critical Issues:')}`);
      this.report.criticalIssues!.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue}`);
      });
    }

    // Recommendations
    if (this.report.recommendations!.length > 0) {
      console.log(`\n${chalk.bold.yellow('💡 Recommendations:')}`);
      this.report.recommendations!.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
      });
    }

    console.log(`\n${chalk.gray('='.repeat(70))}`);

    if (this.report.overall.success) {
      console.log(chalk.green.bold('🎉 System is ready for production deployment!'));
    } else {
      console.log(chalk.red.bold('⚠️  Please address critical issues before deployment.'));
    }
  }

  // Helper methods
  private extractTypeScriptErrors(output: string): string[] {
    const lines = output.split('\n');
    return lines
      .filter((line) => line.includes('error TS'))
      .slice(0, 5) // First 5 errors as sample
      .map((line) => line.trim());
  }

  private findMdxFiles(dir: string): string[] {
    const { execSync } = require('child_process');
    try {
      const output = execSync(`find ${dir} -name "*.mdx" 2>/dev/null`, { encoding: 'utf8' });
      return output.trim().split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }

  private countFiles(dir: string, extension: string): number {
    try {
      const output = execSync(`find ${dir} -name "*${extension}" 2>/dev/null`, {
        encoding: 'utf8',
      });
      return output.trim().split('\n').filter(Boolean).length;
    } catch {
      return 0;
    }
  }

  private getBuildStats(): { buildManifestExists: boolean; [key: string]: unknown } {
    try {
      const buildManifest = readFileSync('.next/build-manifest.json', 'utf8');
      return { buildManifestExists: true };
    } catch {
      return { buildManifestExists: false };
    }
  }

  private getBundleSize(): number | null {
    try {
      // Try to get total size of .next directory
      const output = execSync('du -sb .next 2>/dev/null', { encoding: 'utf8' });
      return parseInt(output.split('\t')[0]!);
    } catch {
      return null;
    }
  }

  private measureBuildTime(): number {
    const start = Date.now();
    try {
      execSync('bun run build', { stdio: 'pipe' });
      return Date.now() - start;
    } catch {
      return Date.now() - start;
    }
  }

  private parseSecurityAudit(output: string): {
    low: number;
    moderate: number;
    high: number;
    critical: number;
    total: number;
  } {
    const vulnerabilities = { low: 0, moderate: 0, high: 0, critical: 0, total: 0 };

    const lines = output.split('\n');
    lines.forEach((line) => {
      if (line.includes('vulnerabilities')) {
        const match = line.match(/(\d+)\s+(\w+)\s+vulnerabilities?/);
        if (match) {
          const count = parseInt(match[1]!);
          const severity = match[2]!.toLowerCase();
          if (severity in vulnerabilities) {
            (vulnerabilities as Record<string, number>)[severity] = count;
            vulnerabilities.total += count;
          }
        }
      }
    });

    return vulnerabilities;
  }

  private checkForSensitiveFiles(): string[] {
    const sensitivePatterns = ['.env', '*.key', '*.pem', 'id_rsa', '.env.local', '.env.production'];

    const found = [];
    for (const pattern of sensitivePatterns) {
      try {
        const output = execSync(
          `find . -name "${pattern}" -not -path "./node_modules/*" 2>/dev/null`,
          { encoding: 'utf8' }
        );
        if (output.trim()) {
          found.push(...output.trim().split('\n'));
        }
      } catch {
        // No files found
      }
    }

    return found;
  }

  private validateEnvironmentSecurity(): { valid: boolean; issues: string[] } {
    const issues = [];

    // Check for .env files
    const envFiles = ['.env', '.env.local', '.env.production'];
    for (const envFile of envFiles) {
      if (existsSync(envFile)) {
        // Check if .env is in .gitignore
        try {
          const gitignore = readFileSync('.gitignore', 'utf8');
          if (!gitignore.includes(envFile)) {
            issues.push(`${envFile} should be in .gitignore`);
          }
        } catch {
          issues.push('.gitignore file missing');
        }
      }
    }

    return { valid: issues.length === 0, issues };
  }

  private checkMissingDependencies(deps: string[]): string[] {
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const allDeps = {
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
      };

      return deps.filter((dep) => !(dep in allDeps));
    } catch {
      return deps; // Assume all are missing if package.json is invalid
    }
  }
}

// Main execution
async function main() {
  const validator = new DeploymentValidator();
  const report = await validator.runFullValidation();

  // Exit with appropriate code
  process.exit(report.overall.success ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red('Deployment validation failed:'), error);
    process.exit(1);
  });
}

export { DeploymentValidator };
export type { ValidationReport };
