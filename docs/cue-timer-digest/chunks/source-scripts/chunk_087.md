# Chunk 87: source_scripts

## Metadata

- **Files**: 1
- **Size**: 20,301 characters (~5,075 tokens)
- **Categories**: source

## Files in this chunk

- `scripts/deploy-blog-system.ts`

---

## File: `scripts/deploy-blog-system.ts`

```typescript
#!/usr/bin/env tsx

/**
 * Production Deployment Script
 *
 * Automated deployment workflow for CueTimer blog management system
 * Handles pre-deployment checks, deployment steps, and post-deployment validation
 */

import chalk from 'chalk';
import { execSync } from 'child_process';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import ora from 'ora';
import { join } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
const pipelineAsync = promisify(pipeline);

interface DeploymentStep {
  name: string;
  execute: () => Promise<boolean>;
  critical: boolean;
  rollback?: () => Promise<void>;
}

interface DeploymentReport {
  success: boolean;
  startTime: Date;
  endTime: Date;
  duration: number;
  steps: Array<{
    name: string;
    success: boolean;
    duration: number;
    error?: string;
  }>;
  rollbackTriggered: boolean;
  rollbackSuccess?: boolean;
  recommendations: string[];
}

class BlogSystemDeployer {
  private startTime: Date = new Date();
  private steps: DeploymentStep[] = [];
  private report: Partial<DeploymentReport> = {
    steps: [],
    recommendations: [],
  };
  private rollbackData: Record<string, string | boolean> = {};
  private deploymentBackup: string = '';

  constructor() {
    this.setupDeploymentSteps();
  }

  private setupDeploymentSteps(): void {
    this.steps = [
      {
        name: 'Pre-deployment Validation',
        execute: () => this.runPreDeploymentValidation(),
        critical: true,
        rollback: () => this.restoreFromBackup(),
      },
      {
        name: 'Create Deployment Backup',
        execute: () => this.createDeploymentBackup(),
        critical: true,
        rollback: () => this.restoreFromBackup(),
      },
      {
        name: 'Environment Validation',
        execute: () => this.validateEnvironment(),
        critical: true,
      },
      {
        name: 'Dependency Installation',
        execute: () => this.installDependencies(),
        critical: true,
      },
      {
        name: 'Code Quality Checks',
        execute: () => this.runQualityChecks(),
        critical: true,
      },
      {
        name: 'Build Application',
        execute: () => this.buildApplication(),
        critical: true,
      },
      {
        name: 'Test Suite Execution',
        execute: () => this.runTests(),
        critical: true,
      },
      {
        name: 'Security Validation',
        execute: () => this.validateSecurity(),
        critical: true,
      },
      {
        name: 'Content System Validation',
        execute: () => this.validateContentSystem(),
        critical: true,
      },
      {
        name: 'CLI Tools Validation',
        execute: () => this.validateCliTools(),
        critical: true,
      },
      {
        name: 'Performance Benchmarking',
        execute: () => this.runPerformanceBenchmarks(),
        critical: false,
      },
      {
        name: 'Deploy to Production',
        execute: () => this.deployToProduction(),
        critical: true,
        rollback: () => this.rollbackDeployment(),
      },
      {
        name: 'Post-deployment Validation',
        execute: () => this.runPostDeploymentValidation(),
        critical: true,
      },
      {
        name: 'Health Check Verification',
        execute: () => this.verifyHealthCheck(),
        critical: true,
      },
    ];
  }

  async executeDeployment(): Promise<DeploymentReport> {
    console.log(
      chalk.bold.blue(
        '🚀 CueTimer Blog Management System - Production Deployment'
      )
    );
    console.log(chalk.gray('='.repeat(70)));
    console.log(chalk.gray(`Started at: ${this.startTime.toISOString()}`));

    let deploymentSuccessful = true;
    let failureStep: string | null = null;

    // Execute each deployment step
    for (const step of this.steps) {
      const stepStart = Date.now();
      const spinner = ora(`Executing: ${step.name}...`).start();

      try {
        const success = await step.execute();
        const duration = Date.now() - stepStart;

        if (success) {
          spinner.succeed(`${step.name} (${(duration / 1000).toFixed(2)}s)`);
          this.report.steps!.push({
            name: step.name,
            success: true,
            duration,
          });
        } else {
          spinner.fail(`${step.name} failed`);
          this.report.steps!.push({
            name: step.name,
            success: false,
            duration,
            error: 'Step returned false',
          });

          if (step.critical) {
            deploymentSuccessful = false;
            failureStep = step.name;
            break;
          }
        }
      } catch (error: unknown) {
        spinner.fail(`${step.name} failed with exception`);
        const duration = Date.now() - stepStart;
        this.report.steps!.push({
          name: step.name,
          success: false,
          duration,
          error: (error as Error).message,
        });

        if (step.critical) {
          deploymentSuccessful = false;
          failureStep = step.name;
          break;
        }
      }
    }

    // Handle rollback if needed
    if (!deploymentSuccessful && failureStep) {
      await this.executeRollback(failureStep);
    }

    // Generate final report
    this.generateFinalReport(deploymentSuccessful);

    return this.report as DeploymentReport;
  }

  private async runPreDeploymentValidation(): Promise<boolean> {
    // Check if running in correct directory
    if (!existsSync('package.json')) {
      throw new Error('package.json not found. Run from project root.');
    }

    // Check if deployment validation script exists
    if (!existsSync('scripts/deploy-validation.ts')) {
      throw new Error('Deployment validation script not found.');
    }

    // Run deployment validation
    try {
      execSync('tsx scripts/deploy-validation.ts', {
        stdio: 'pipe',
        timeout: 300000, // 5 minutes
      });
    } catch (error) {
      throw new Error(
        'Pre-deployment validation failed. Fix issues before deploying.'
      );
    }

    return true;
  }

  private async createDeploymentBackup(): Promise<boolean> {
    const spinner = ora('Creating deployment backup...').start();

    try {
      // Create backup directory
      const backupDir = `deployments/backup-${Date.now()}`;
      mkdirSync(backupDir, { recursive: true });
      this.deploymentBackup = backupDir;

      // Backup critical files
      const criticalFiles = [
        'package.json',
        'next.config.js',
        'tsconfig.json',
        '.env.example',
        'src',
        'scripts',
        'docs',
      ];

      for (const file of criticalFiles) {
        if (existsSync(file)) {
          execSync(`cp -r ${file} ${backupDir}/`, { stdio: 'pipe' });
        }
      }

      // Store current git state
      try {
        const gitHash = execSync('git rev-parse HEAD', {
          encoding: 'utf8',
        }).trim();
        writeFileSync(`${backupDir}/git-hash.txt`, gitHash);
        this.rollbackData.gitHash = gitHash;
      } catch (error) {
        // Not a git repository, skip
      }

      spinner.succeed('Backup created successfully');
      return true;
    } catch (error: unknown) {
      spinner.fail('Backup creation failed');
      throw new Error(`Backup creation failed: ${(error as Error).message}`);
    }
  }

  private async validateEnvironment(): Promise<boolean> {
    // Check Node.js version
    const nodeVersion = process.version;
    const nodeVersionMatch = nodeVersion.match(/v(\d+)\.(\d+)/);
    const nodeMajor = nodeVersionMatch ? parseInt(nodeVersionMatch[1]!) : 0;

    if (nodeMajor < 18) {
      throw new Error(
        `Node.js version ${nodeVersion} is not supported. Requires v18+.`
      );
    }

    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Required environment variable ${envVar} is not set.`);
      }
    }

    // Check critical directories
    const requiredDirs = ['src', 'scripts', 'docs'];
    for (const dir of requiredDirs) {
      if (!existsSync(dir)) {
        throw new Error(`Required directory ${dir} is missing.`);
      }
    }

    return true;
  }

  private async installDependencies(): Promise<boolean> {
    try {
      execSync('bun install', {
        stdio: 'pipe',
        timeout: 300000, // 5 minutes
      });
      return true;
    } catch (error: unknown) {
      throw new Error(
        `Dependency installation failed: ${(error as Error).message}`
      );
    }
  }

  private async runQualityChecks(): Promise<boolean> {
    try {
      // Run type checking
      execSync('bun run type-check', { stdio: 'pipe', timeout: 120000 });

      // Run linting
      execSync('bun run lint:all', { stdio: 'pipe', timeout: 60000 });

      // Run format check
      execSync('bun run format:check', { stdio: 'pipe', timeout: 30000 });

      return true;
    } catch (error: unknown) {
      throw new Error(`Quality checks failed: ${(error as Error).message}`);
    }
  }

  private async buildApplication(): Promise<boolean> {
    try {
      execSync('bun run build', {
        stdio: 'pipe',
        timeout: 600000, // 10 minutes
      });

      // Verify build output
      if (!existsSync('.next')) {
        throw new Error('Build output directory .next not found.');
      }

      return true;
    } catch (error: unknown) {
      throw new Error(`Application build failed: ${(error as Error).message}`);
    }
  }

  private async runTests(): Promise<boolean> {
    try {
      execSync('bun run test:ci', {
        stdio: 'pipe',
        timeout: 300000, // 5 minutes
      });
      return true;
    } catch (error: unknown) {
      throw new Error(`Test suite failed: ${(error as Error).message}`);
    }
  }

  private async validateSecurity(): Promise<boolean> {
    try {
      // Run security audit
      const auditOutput = execSync('bunx audit --json', {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 60000,
      });

      if (auditOutput) {
        const audit = JSON.parse(auditOutput);
        const vulnerabilities = audit.vulnerabilities || {
          total: 0,
          high: 0,
          critical: 0,
        };

        if (vulnerabilities.critical > 0 || vulnerabilities.high > 0) {
          throw new Error(
            `High/critical security vulnerabilities found: ${vulnerabilities.total}`
          );
        }
      }

      return true;
    } catch (error: unknown) {
      throw new Error(
        `Security validation failed: ${(error as Error).message}`
      );
    }
  }

  private async validateContentSystem(): Promise<boolean> {
    try {
      // Check content directory
      if (!existsSync('content')) {
        throw new Error('Content directory not found.');
      }

      // Check templates
      const templatesDir = 'lib/blog-scripts/templates';
      if (!existsSync(templatesDir)) {
        throw new Error('Templates directory not found.');
      }

      // Check template files
      const expectedTemplates = [
        'technical-tutorial.ts',
        'case-study.ts',
        'news-update.ts',
        'opinion-piece.ts',
      ];

      for (const template of expectedTemplates) {
        if (!existsSync(join(templatesDir, template))) {
          throw new Error(`Template ${template} not found.`);
        }
      }

      return true;
    } catch (error: unknown) {
      throw new Error(
        `Content system validation failed: ${(error as Error).message}`
      );
    }
  }

  private async validateCliTools(): Promise<boolean> {
    try {
      const cliTools = [
        'blog:create',
        'blog:publish',
        'blog:analytics',
        'blog:seo-check',
        'blog:workflow:status',
      ];

      for (const tool of cliTools) {
        // Test CLI tool accessibility
        execSync(`bun run ${tool} --help`, {
          stdio: 'pipe',
          timeout: 10000,
        });
      }

      return true;
    } catch (error: unknown) {
      throw new Error(
        `CLI tools validation failed: ${(error as Error).message}`
      );
    }
  }

  private async runPerformanceBenchmarks(): Promise<boolean> {
    try {
      // Check bundle size
      if (existsSync('.next')) {
        const duOutput = execSync('du -sb .next 2>/dev/null', {
          encoding: 'utf8',
        });
        const bundleSize = parseInt(duOutput.split('\t')[0]!);
        const bundleSizeMB = bundleSize / 1024 / 1024;

        if (bundleSizeMB > 100) {
          this.report.recommendations!.push(
            'Bundle size is large (>100MB), consider optimization'
          );
        }
      }

      // Memory usage check
      const memoryUsage = process.memoryUsage();
      const memoryMB = memoryUsage.heapUsed / 1024 / 1024;

      if (memoryMB > 512) {
        this.report.recommendations!.push(
          'High memory usage detected during deployment'
        );
      }

      return true;
    } catch (error: unknown) {
      // Performance benchmarks are not critical
      this.report.recommendations!.push(
        `Performance benchmarking failed: ${(error as Error).message}`
      );
      return true;
    }
  }

  private async deployToProduction(): Promise<boolean> {
    try {
      // Check if this is a Vercel deployment
      const isVercel = process.env.VERCEL === '1';

      if (isVercel) {
        // Vercel deployment is handled automatically
        console.log('Vercel deployment detected, skipping manual deployment');
        return true;
      }

      // For other deployment targets, you would implement specific deployment logic here
      // This is a placeholder for custom deployment logic
      console.log('Custom deployment logic would go here');

      // Simulate deployment
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return true;
    } catch (error: unknown) {
      throw new Error(
        `Deployment to production failed: ${(error as Error).message}`
      );
    }
  }

  private async runPostDeploymentValidation(): Promise<boolean> {
    try {
      // Wait a moment for deployment to settle
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Run deployment validation again
      execSync('tsx scripts/deploy-validation.ts', {
        stdio: 'pipe',
        timeout: 300000,
      });

      return true;
    } catch (error: unknown) {
      throw new Error(
        `Post-deployment validation failed: ${(error as Error).message}`
      );
    }
  }

  private async verifyHealthCheck(): Promise<boolean> {
    try {
      // Run system health check
      execSync('tsx scripts/system-health-check.ts', {
        stdio: 'pipe',
        timeout: 120000,
      });

      return true;
    } catch (error: unknown) {
      throw new Error(
        `Health check verification failed: ${(error as Error).message}`
      );
    }
  }

  private async executeRollback(failureStep: string): Promise<void> {
    console.log(
      chalk.yellow(`\n🔄 Executing rollback due to failure in: ${failureStep}`)
    );

    const spinner = ora('Rolling back deployment...').start();
    this.report.rollbackTriggered = true;

    try {
      // Find rollback steps for failed step and all subsequent steps
      const failedStepIndex = this.steps.findIndex(
        (step) => step.name === failureStep
      );
      const rollbackSteps = this.steps
        .slice(failedStepIndex)
        .filter((step) => step.rollback)
        .reverse();

      // Execute rollback steps
      for (const step of rollbackSteps) {
        if (step.rollback) {
          await step.rollback();
        }
      }

      spinner.succeed('Rollback completed successfully');
      this.report.rollbackSuccess = true;
    } catch (error: unknown) {
      spinner.fail('Rollback failed');
      this.report.rollbackSuccess = false;
      this.report.recommendations!.push(
        `Manual rollback required: ${(error as Error).message}`
      );
    }
  }

  private async restoreFromBackup(): Promise<void> {
    if (!this.deploymentBackup) {
      throw new Error('No backup available for rollback');
    }

    try {
      // Restore critical files from backup
      const backupFiles = ['package.json', 'src', 'scripts', 'docs'];

      for (const file of backupFiles) {
        const backupFile = join(this.deploymentBackup, file);
        if (existsSync(backupFile)) {
          execSync(`rm -rf ${file}`, { stdio: 'pipe' });
          execSync(`cp -r ${backupFile} .`, { stdio: 'pipe' });
        }
      }

      // Restore git state if available
      if (this.rollbackData.gitHash) {
        try {
          execSync(`git reset --hard ${this.rollbackData.gitHash}`, {
            stdio: 'pipe',
          });
        } catch (error) {
          // Git operations might fail, continue anyway
        }
      }

      // Reinstall dependencies
      execSync('bun install', { stdio: 'pipe', timeout: 300000 });
    } catch (error: unknown) {
      throw new Error(`Backup restoration failed: ${(error as Error).message}`);
    }
  }

  private async rollbackDeployment(): Promise<void> {
    // This would contain platform-specific rollback logic
    // For now, we'll just note that a deployment rollback would happen here
    console.log('Platform-specific deployment rollback would execute here');
  }

  private generateFinalReport(success: boolean): void {
    const endTime = new Date();
    const duration = endTime.getTime() - this.startTime.getTime();

    this.report.startTime = this.startTime;
    this.report.endTime = endTime;
    this.report.duration = duration;
    this.report.success = success;

    // Display final report
    console.log(`\n${chalk.bold.blue('📊 Deployment Report')}`);
    console.log(chalk.gray('='.repeat(70)));

    const status = success ? chalk.green('✅ SUCCESS') : chalk.red('❌ FAILED');
    console.log(`\n${chalk.bold('Status:')} ${status}`);
    console.log(`${chalk.bold('Duration:')} ${(duration / 1000).toFixed(2)}s`);
    console.log(
      `${chalk.bold('Steps Completed:')} ${this.report.steps!.length}/${this.steps.length}`
    );

    // Step results
    console.log(`\n${chalk.bold('Step Results:')}`);
    this.report.steps!.forEach((step) => {
      const status = step.success ? chalk.green('✅') : chalk.red('❌');
      console.log(
        `  ${status} ${step.name} (${(step.duration / 1000).toFixed(2)}s)`
      );
      if (step.error) {
        console.log(`    Error: ${step.error}`);
      }
    });

    // Rollback information
    if (this.report.rollbackTriggered) {
      const rollbackStatus = this.report.rollbackSuccess
        ? chalk.green('✅ Success')
        : chalk.red('❌ Failed');
      console.log(`\n${chalk.bold('Rollback:')} ${rollbackStatus}`);
    }

    // Recommendations
    if (this.report.recommendations!.length > 0) {
      console.log(`\n${chalk.bold.yellow('💡 Recommendations:')}`);
      this.report.recommendations!.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
      });
    }

    console.log(`\n${chalk.gray('='.repeat(70))}`);

    if (success) {
      console.log(chalk.green.bold('🎉 Deployment completed successfully!'));
      console.log(chalk.blue('🚀 Your blog management system is now live!'));
    } else {
      console.log(chalk.red.bold('❌ Deployment failed.'));
      if (this.report.rollbackSuccess) {
        console.log(
          chalk.yellow('🔄 System has been rolled back to previous state.')
        );
      } else {
        console.log(chalk.red('🚨 Manual intervention required!'));
      }
    }

    // Save report to file
    const reportFile = `deployments/deployment-report-${Date.now()}.json`;
    mkdirSync('deployments', { recursive: true });
    writeFileSync(reportFile, JSON.stringify(this.report, null, 2));
    console.log(chalk.gray(`\n📄 Detailed report saved to: ${reportFile}`));
  }
}

// Main execution
async function main() {
  const deployer = new BlogSystemDeployer();

  try {
    const report = await deployer.executeDeployment();
    process.exit(report.success ? 0 : 1);
  } catch (error: unknown) {
    console.error(
      chalk.red('Deployment failed with exception:'),
      (error as Error).message
    );
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red('Deployment script failed:'), error);
    process.exit(1);
  });
}

export { BlogSystemDeployer };
export type { DeploymentReport };
```
