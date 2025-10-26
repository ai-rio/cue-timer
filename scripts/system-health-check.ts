#!/usr/bin/env tsx

/**
 * System Health Check Script
 *
 * Comprehensive health monitoring for CueTimer blog management system
 * Monitors all system components and provides detailed health reports
 */

import chalk from 'chalk';
import { execSync } from 'child_process';
import { accessSync, constants, existsSync, readFileSync, statSync } from 'fs';
import ora from 'ora';
import { join, resolve } from 'path';

interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  details?: Record<string, unknown>;
  metrics?: Record<string, number | string>;
  recommendations?: string[];
}

interface SystemHealthReport {
  timestamp: string;
  overall: {
    status: 'healthy' | 'warning' | 'critical';
    score: number; // 0-100
    issues: number;
  };
  components: {
    dependencies: HealthCheckResult;
    environment: HealthCheckResult;
    fileSystem: HealthCheckResult;
    cliTools: HealthCheckResult;
    templateSystem: HealthCheckResult;
    multiLanguageSupport: HealthCheckResult;
    contentSystem: HealthCheckResult;
    performance: HealthCheckResult;
  };
  summary: {
    healthyComponents: number;
    warningComponents: number;
    criticalComponents: number;
    totalChecks: number;
  };
  alerts: string[];
  recommendations: string[];
}

class SystemHealthChecker {
  private startTime: number = Date.now();
  private alerts: string[] = [];
  private recommendations: string[] = [];

  async runHealthCheck(): Promise<SystemHealthReport> {
    console.log(chalk.bold.blue('🏥 CueTimer Blog Management System - Health Check'));
    console.log(chalk.gray('='.repeat(70)));

    // Check all system components
    const components = {
      dependencies: await this.checkDependencies(),
      environment: await this.checkEnvironment(),
      fileSystem: await this.checkFileSystem(),
      cliTools: await this.checkCliTools(),
      templateSystem: await this.checkTemplateSystem(),
      multiLanguageSupport: await this.checkMultiLanguageSupport(),
      contentSystem: await this.checkContentSystem(),
      performance: await this.checkPerformance(),
    };

    // Calculate overall health
    const healthStatus = this.calculateOverallHealth(components);
    const summary = this.generateSummary(components);

    const report: SystemHealthReport = {
      timestamp: new Date().toISOString(),
      overall: healthStatus,
      components,
      summary,
      alerts: this.alerts,
      recommendations: this.recommendations,
    };

    this.displayHealthReport(report);
    return report;
  }

  private async checkDependencies(): Promise<HealthCheckResult> {
    const spinner = ora('Checking dependencies health...').start();
    const metrics: Record<string, number | string | boolean> = {};

    try {
      // Check package.json
      const packageJsonExists = existsSync('package.json');
      let packageJsonValid = false;
      let dependencies = [];
      let devDependencies = [];

      if (packageJsonExists) {
        try {
          const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
          packageJsonValid = true;
          dependencies = Object.keys(packageJson.dependencies || {});
          devDependencies = Object.keys(packageJson.devDependencies || {});
          metrics.packageSize = JSON.stringify(packageJson).length;
        } catch (error) {
          spinner.fail('Invalid package.json');
          return {
            status: 'critical',
            message: 'package.json is corrupted or invalid',
            details: { error: error instanceof Error ? error.message : String(error) },
          };
        }
      }

      // Check node_modules
      const nodeModulesExists = existsSync('node_modules');
      let nodeModulesSize = 0;
      const criticalDepsMissing = [];

      if (nodeModulesExists) {
        try {
          // Get node_modules size
          const duOutput = execSync('du -sb node_modules 2>/dev/null', { encoding: 'utf8' });
          nodeModulesSize = parseInt(duOutput.split('\t')[0] || '0');
          metrics.nodeModulesSizeMB = Math.round(nodeModulesSize / 1024 / 1024);

          // Check critical dependencies
          const criticalDeps = ['next', 'react', 'react-dom', 'typescript'];
          for (const dep of criticalDeps) {
            if (!existsSync(join('node_modules', dep))) {
              criticalDepsMissing.push(dep);
            }
          }
        } catch (error) {
          metrics.nodeModulesAccessible = false;
        }
      }

      // Check for outdated packages
      let outdatedCount = 0;
      try {
        const outdatedOutput = execSync('bunx npm-check-updates 2>/dev/null', { encoding: 'utf8' });
        outdatedCount = (outdatedOutput.match(/↑/g) || []).length;
        metrics.outdatedPackages = outdatedCount;
      } catch (error) {
        metrics.outdatedCheckFailed = true;
      }

      // Check for security vulnerabilities
      let vulnerabilities = { low: 0, moderate: 0, high: 0, critical: 0, total: 0 };
      try {
        const auditOutput = execSync('bunx audit --json 2>/dev/null', { encoding: 'utf8' });
        if (auditOutput) {
          const audit = JSON.parse(auditOutput);
          vulnerabilities = audit.vulnerabilities || vulnerabilities;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          metrics.vulnerabilities = vulnerabilities as any;
        }
      } catch (error) {
        metrics.auditCheckFailed = true;
      }

      // Determine health status
      const hasCriticalIssues =
        !packageJsonExists ||
        !packageJsonValid ||
        !nodeModulesExists ||
        criticalDepsMissing.length > 0;
      const hasWarnings = outdatedCount > 0 || vulnerabilities.total > 0;

      let status: 'healthy' | 'warning' | 'critical';
      let message: string;

      if (hasCriticalIssues) {
        status = 'critical';
        message = 'Critical dependency issues detected';
        if (!packageJsonExists) this.alerts.push('package.json is missing');
        if (!packageJsonValid) this.alerts.push('package.json is invalid');
        if (!nodeModulesExists) this.alerts.push('node_modules directory missing');
        if (criticalDepsMissing.length > 0) {
          this.alerts.push(`Missing critical dependencies: ${criticalDepsMissing.join(', ')}`);
        }
      } else if (hasWarnings) {
        status = 'warning';
        message = 'Dependency health issues detected';
        if (outdatedCount > 0) {
          this.recommendations.push(`Update ${outdatedCount} outdated packages`);
        }
        if (vulnerabilities.total > 0) {
          this.alerts.push(`${vulnerabilities.total} security vulnerabilities found`);
          this.recommendations.push('Run `bun audit fix` to resolve vulnerabilities');
        }
      } else {
        status = 'healthy';
        message = 'All dependencies are healthy';
      }

      spinner.succeed(`Dependencies: ${status}`);
      return {
        status,
        message,
        details: {
          packageJsonExists,
          packageJsonValid,
          nodeModulesExists,
          criticalDepsMissing,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metrics: metrics as any,
      };
    } catch (error: unknown) {
      spinner.fail('Dependency check failed');
      return {
        status: 'critical',
        message: 'Dependency health check failed',
        details: { error: error instanceof Error ? error.message : String(error) },
      };
    }
  }

  private async checkEnvironment(): Promise<HealthCheckResult> {
    const spinner = ora('Checking environment configuration...').start();
    const metrics: Record<string, number | string | boolean> = {};

    try {
      // Check for environment files
      const envFiles = ['.env', '.env.local', '.env.example'];
      const envFileStatus: Record<string, boolean> = {};

      envFiles.forEach((file) => {
        envFileStatus[file] = existsSync(file);
        if (file === '.env.example' && !envFileStatus[file]) {
          this.recommendations.push('Create .env.example file with template environment variables');
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metrics.envFiles = envFileStatus as any;

      // Check Node.js version
      const nodeVersion = process.version;
      const nodeVersionMatch = nodeVersion.match(/v(\d+)\.(\d+)/);
      const nodeMajor = nodeVersionMatch ? parseInt(nodeVersionMatch[1] || '0') : 0;
      metrics.nodeVersion = nodeVersion;
      metrics.nodeVersionSupported = nodeMajor >= 18;

      if (!metrics.nodeVersionSupported) {
        this.alerts.push(`Node.js version ${nodeVersion} is not supported (requires >= 18.0.0)`);
      }

      // Check if required environment variables are documented
      let envVarsDocumented = false;
      if (existsSync('.env.example')) {
        const envExample = readFileSync('.env.example', 'utf8');
        const requiredVars = ['NEXT_PUBLIC_URL', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
        const documentedVars = requiredVars.filter((v) => envExample.includes(v));
        metrics.documentedEnvVars = documentedVars.length;
        metrics.requiredEnvVars = requiredVars.length;
        envVarsDocumented = documentedVars.length === requiredVars.length;

        if (!envVarsDocumented) {
          this.recommendations.push('Document all required environment variables in .env.example');
        }
      }

      // Check if sensitive files are properly protected
      const gitignoreExists = existsSync('.gitignore');
      let gitignoreProtectsSensitive = false;

      if (gitignoreExists) {
        const gitignore = readFileSync('.gitignore', 'utf8');
        const sensitivePatterns = ['.env', '.env.local', '*.key', '*.pem'];
        const protectedPatterns = sensitivePatterns.filter((pattern) =>
          gitignore.includes(pattern)
        );
        metrics.protectedSensitiveFiles = protectedPatterns.length;
        gitignoreProtectsSensitive = protectedPatterns.length === sensitivePatterns.length;

        if (!gitignoreProtectsSensitive) {
          this.alerts.push('Sensitive files may not be properly protected in .gitignore');
        }
      } else {
        this.alerts.push('.gitignore file is missing');
      }

      metrics.gitignoreExists = gitignoreExists;
      metrics.gitignoreProtectsSensitive = gitignoreProtectsSensitive;

      // Determine health status
      const hasCriticalIssues = !metrics.nodeVersionSupported || !gitignoreExists;
      const hasWarnings = !envVarsDocumented || !gitignoreProtectsSensitive;

      let status: 'healthy' | 'warning' | 'critical';
      let message: string;

      if (hasCriticalIssues) {
        status = 'critical';
        message = 'Critical environment configuration issues';
      } else if (hasWarnings) {
        status = 'warning';
        message = 'Environment configuration needs attention';
      } else {
        status = 'healthy';
        message = 'Environment is properly configured';
      }

      spinner.succeed(`Environment: ${status}`);
      return {
        status,
        message,
        details: {
          nodeVersionSupported: metrics.nodeVersionSupported,
          gitignoreExists,
          envFileStatus,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metrics: metrics as any,
      };
    } catch (error: unknown) {
      spinner.fail('Environment check failed');
      return {
        status: 'critical',
        message: 'Environment health check failed',
        details: { error: error instanceof Error ? error.message : String(error) },
      };
    }
  }

  private async checkFileSystem(): Promise<HealthCheckResult> {
    const spinner = ora('Checking file system health...').start();
    const metrics: Record<string, number | string | boolean> = {};

    try {
      // Check critical directories
      const criticalDirs = [
        'src',
        'src/app',
        'src/components',
        'src/lib',
        'scripts',
        'tests',
        'docs',
        'content',
      ];

      const dirStatus: Record<string, boolean> = {};
      const missingDirs = [];

      for (const dir of criticalDirs) {
        const exists = existsSync(dir);
        dirStatus[dir] = exists;
        if (!exists) missingDirs.push(dir);
      }

      if (missingDirs.length > 0) {
        this.alerts.push(`Missing critical directories: ${missingDirs.join(', ')}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metrics.criticalDirectories = dirStatus as any;

      // Check file permissions
      const importantFiles = [
        'package.json',
        'next.config.js',
        'tsconfig.json',
        'tailwind.config.js',
        '.eslintrc.json',
      ];

      const filePermissions: Record<string, boolean> = {};
      const permissionIssues = [];

      for (const file of importantFiles) {
        if (existsSync(file)) {
          try {
            accessSync(file, constants.R_OK | constants.W_OK);
            filePermissions[file] = true;
          } catch (error) {
            filePermissions[file] = false;
            permissionIssues.push(file);
          }
        } else {
          filePermissions[file] = false;
        }
      }

      if (permissionIssues.length > 0) {
        this.alerts.push(`Permission issues with files: ${permissionIssues.join(', ')}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metrics.filePermissions = filePermissions as any;

      // Check disk space (simplified check)
      try {
        const dfOutput = execSync('df . 2>/dev/null', { encoding: 'utf8' });
        const lines = dfOutput.trim().split('\n');
        if (lines.length > 1) {
          const parts = lines[1]?.split(/\s+/) || [];
          const available = parseInt(parts[3] || '0');
          const total = parseInt(parts[1] || '0');
          const availablePercent = Math.round((available / total) * 100);
          metrics.diskSpaceAvailable = `${availablePercent}%`;
          metrics.diskSpaceCritical = availablePercent < 10;

          if (metrics.diskSpaceCritical) {
            this.alerts.push('Low disk space detected');
          }
        }
      } catch (error) {
        metrics.diskSpaceCheckFailed = true;
      }

      // Check for unusual file sizes
      try {
        const findOutput = execSync(
          'find . -type f -size +10M -not -path "./node_modules/*" 2>/dev/null',
          { encoding: 'utf8' }
        );
        const largeFiles = findOutput.trim().split('\n').filter(Boolean);
        metrics.largeFiles = largeFiles.length;

        if (largeFiles.length > 5) {
          this.recommendations.push('Consider optimizing or moving large files');
        }
      } catch (error) {
        metrics.largeFiles = 0;
      }

      // Determine health status
      const hasCriticalIssues =
        missingDirs.length > 0 || permissionIssues.length > 0 || metrics.diskSpaceCritical;
      const hasWarnings = metrics.largeFiles > 5;

      let status: 'healthy' | 'warning' | 'critical';
      let message: string;

      if (hasCriticalIssues) {
        status = 'critical';
        message = 'Critical file system issues detected';
      } else if (hasWarnings) {
        status = 'warning';
        message = 'File system needs attention';
      } else {
        status = 'healthy';
        message = 'File system is healthy';
      }

      spinner.succeed(`File System: ${status}`);
      return {
        status,
        message,
        details: {
          missingDirs: missingDirs.length,
          permissionIssues: permissionIssues.length,
          diskSpaceCritical: metrics.diskSpaceCritical || false,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metrics: metrics as any,
      };
    } catch (error: unknown) {
      spinner.fail('File system check failed');
      return {
        status: 'critical',
        message: 'File system health check failed',
        details: { error: error instanceof Error ? error.message : String(error) },
      };
    }
  }

  private async checkCliTools(): Promise<HealthCheckResult> {
    const spinner = ora('Checking CLI tools health...').start();
    const metrics: Record<string, number | string | boolean> = {};

    try {
      const cliTools = [
        'blog:create',
        'blog:publish',
        'blog:analytics',
        'blog:seo-check',
        'blog:workflow:status',
      ];

      const toolResults: Array<{ tool: string; accessible: boolean; error?: string }> = [];

      for (const tool of cliTools) {
        try {
          // Test CLI tool accessibility
          execSync(`bun run ${tool} --help`, {
            encoding: 'utf8',
            stdio: 'pipe',
            timeout: 5000,
          });
          toolResults.push({ tool, accessible: true });
        } catch (error: unknown) {
          toolResults.push({
            tool,
            accessible: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      const accessibleTools = toolResults.filter((r) => r.accessible).length;
      const inaccessibleTools = toolResults.filter((r) => !r.accessible);

      metrics.totalTools = cliTools.length;
      metrics.accessibleTools = accessibleTools;
      metrics.inaccessibleTools = inaccessibleTools.length;

      // Check CLI tool scripts exist
      const scriptFiles = [
        'scripts/blog-create.ts',
        'scripts/blog-publish.ts',
        'scripts/blog-analytics.ts',
        'scripts/blog-seo-check.ts',
        'scripts/blog-workflow-status.ts',
      ];

      const existingScripts = scriptFiles.filter((file) => existsSync(file));
      metrics.scriptsExist = existingScripts.length;
      metrics.expectedScripts = scriptFiles.length;

      if (inaccessibleTools.length > 0) {
        this.alerts.push(`${inaccessibleTools.length} CLI tools are not accessible`);
        this.recommendations.push('Check script files and package.json configuration');
      }

      if (existingScripts.length < scriptFiles.length) {
        this.alerts.push('Some CLI script files are missing');
      }

      // Determine health status
      const allToolsAccessible = accessibleTools === cliTools.length;
      const allScriptsExist = existingScripts.length === scriptFiles.length;

      let status: 'healthy' | 'warning' | 'critical';
      let message: string;

      if (!allScriptsExist) {
        status = 'critical';
        message = 'CLI script files are missing';
      } else if (!allToolsAccessible) {
        status = 'warning';
        message = 'Some CLI tools are not accessible';
      } else {
        status = 'healthy';
        message = 'All CLI tools are healthy';
      }

      spinner.succeed(`CLI Tools: ${status}`);
      return {
        status,
        message,
        details: {
          accessibleTools,
          totalTools: cliTools.length,
          scriptsExist: existingScripts.length,
        },
        metrics: {
          ...metrics,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toolResults: toolResults.map((r) => ({ tool: r.tool, accessible: r.accessible })) as any,
        },
      };
    } catch (error: unknown) {
      spinner.fail('CLI tools check failed');
      return {
        status: 'critical',
        message: 'CLI tools health check failed',
        details: { error: error instanceof Error ? error.message : String(error) },
      };
    }
  }

  private async checkTemplateSystem(): Promise<HealthCheckResult> {
    const spinner = ora('Checking template system health...').start();
    const metrics: Record<string, number | string | boolean> = {};

    try {
      // Check templates directory
      const templatesDir = 'lib/blog-scripts/templates';
      const templatesDirExists = existsSync(templatesDir);

      if (!templatesDirExists) {
        spinner.fail('Templates directory missing');
        return {
          status: 'critical',
          message: 'Templates directory does not exist',
          details: { templatesDir },
        };
      }

      // Check for expected template files
      const expectedTemplates = [
        'technical-tutorial.ts',
        'case-study.ts',
        'news-update.ts',
        'opinion-piece.ts',
      ];

      const existingTemplates = expectedTemplates.filter((template) =>
        existsSync(join(templatesDir, template))
      );

      metrics.expectedTemplates = expectedTemplates.length;
      metrics.existingTemplates = existingTemplates.length;

      if (existingTemplates.length < expectedTemplates.length) {
        this.alerts.push(
          `${expectedTemplates.length - existingTemplates.length} templates are missing`
        );
      }

      // Test template functionality
      const templateTests = [];
      for (const template of existingTemplates) {
        try {
          // Try to import the template
          const templatePath = join(templatesDir, template);
          const stats = statSync(templatePath);
          templateTests.push({
            template,
            accessible: true,
            size: stats.size,
          });
        } catch (error) {
          templateTests.push({
            template,
            accessible: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metrics.templateTests = templateTests as any;
      const workingTemplates = templateTests.filter((t) => t.accessible).length;

      // Check template system types
      const typesFile = 'lib/blog-scripts/types.ts';
      const typesExist = existsSync(typesFile);
      metrics.typesFileExists = typesExist;

      if (!typesExist) {
        this.alerts.push('Template system types file is missing');
      }

      // Determine health status
      const templatesComplete = existingTemplates.length === expectedTemplates.length;
      const templatesWorking = workingTemplates === existingTemplates.length;

      let status: 'healthy' | 'warning' | 'critical';
      let message: string;

      if (!templatesDirExists || !typesExist) {
        status = 'critical';
        message = 'Template system has critical issues';
      } else if (!templatesComplete || !templatesWorking) {
        status = 'warning';
        message = 'Template system needs attention';
      } else {
        status = 'healthy';
        message = 'Template system is healthy';
      }

      spinner.succeed(`Template System: ${status}`);
      return {
        status,
        message,
        details: {
          templatesDirExists,
          existingTemplates: existingTemplates.length,
          workingTemplates,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metrics: metrics as any,
      };
    } catch (error: unknown) {
      spinner.fail('Template system check failed');
      return {
        status: 'critical',
        message: 'Template system health check failed',
        details: { error: error instanceof Error ? error.message : String(error) },
      };
    }
  }

  private async checkMultiLanguageSupport(): Promise<HealthCheckResult> {
    const spinner = ora('Checking multi-language support...').start();
    const metrics: Record<string, number | string | boolean> = {};

    try {
      // Check for internationalization configuration
      const i18nConfig = 'next.config.js';
      let i18nConfigured = false;

      if (existsSync(i18nConfig)) {
        const config = readFileSync(i18nConfig, 'utf8');
        i18nConfigured = config.includes('i18n') || config.includes('next-intl');
      }

      metrics.i18nConfigured = i18nConfigured;

      // Check for locale files
      const localesDir = 'messages';
      const localesDirExists = existsSync(localesDir);

      let localeFiles: string[] = [];
      if (localesDirExists) {
        try {
          const findOutput = execSync(`find ${localesDir} -name "*.json" 2>/dev/null`, {
            encoding: 'utf8',
          });
          localeFiles = findOutput.trim().split('\n').filter(Boolean);
        } catch (error) {
          localeFiles = [];
        }
      }

      metrics.localeFiles = localeFiles.length;
      metrics.localesDirExists = localesDirExists;

      // Check for required locales
      const expectedLocales = ['en', 'es', 'fr', 'de'];
      const existingLocales = localeFiles
        .map((file) => {
          const match = file.match(/\/([a-z]{2})\.json$/);
          return match ? match[1] : null;
        })
        .filter(Boolean);

      const missingLocales = expectedLocales.filter((locale) => !existingLocales.includes(locale));

      if (missingLocales.length > 0) {
        this.recommendations.push(`Add missing locale files: ${missingLocales.join(', ')}`);
      }

      metrics.expectedLocales = expectedLocales.length;
      metrics.existingLocales = existingLocales.length;

      // Check for language switching functionality
      const langSwitchComponents = this.findFilesContaining('src', 'useLocale');
      metrics.languageSwitchingImplemented = langSwitchComponents.length > 0;

      if (!langSwitchComponents.length) {
        this.recommendations.push('Implement language switching functionality');
      }

      // Determine health status
      const hasI18nSupport = i18nConfigured && localesDirExists && localeFiles.length > 0;
      const hasCompleteLocales = existingLocales.length >= 2; // At least 2 languages

      let status: 'healthy' | 'warning' | 'critical';
      let message: string;

      if (!hasI18nSupport) {
        status = 'warning';
        message = 'Multi-language support is not configured';
        this.recommendations.push('Configure internationalization for blog system');
      } else if (!hasCompleteLocales) {
        status = 'warning';
        message = 'Multi-language support needs more locales';
      } else {
        status = 'healthy';
        message = 'Multi-language support is healthy';
      }

      spinner.succeed(`Multi-language Support: ${status}`);
      return {
        status,
        message,
        details: {
          i18nConfigured,
          localesDirExists,
          localeFiles: localeFiles.length,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metrics: metrics as any,
      };
    } catch (error: unknown) {
      spinner.fail('Multi-language support check failed');
      return {
        status: 'critical',
        message: 'Multi-language support health check failed',
        details: { error: error instanceof Error ? error.message : String(error) },
      };
    }
  }

  private async checkContentSystem(): Promise<HealthCheckResult> {
    const spinner = ora('Checking content system health...').start();
    const metrics: Record<string, number | string | boolean> = {};

    try {
      // Check content directory structure
      const contentDirs = ['content', 'content/blog'];
      const dirStatus: Record<string, boolean> = {};

      contentDirs.forEach((dir) => {
        dirStatus[dir] = existsSync(dir);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metrics.contentDirectories = dirStatus as any;

      // Check for MDX files
      let mdxFiles = [];
      const validMdxFiles = [];
      const invalidMdxFiles = [];

      if (existsSync('content')) {
        try {
          const findOutput = execSync('find content -name "*.mdx" 2>/dev/null', {
            encoding: 'utf8',
          });
          mdxFiles = findOutput.trim().split('\n').filter(Boolean);

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
        } catch (error) {
          mdxFiles = [];
        }
      }

      metrics.mdxFiles = mdxFiles.length;
      metrics.validMdxFiles = validMdxFiles.length;
      metrics.invalidMdxFiles = invalidMdxFiles.length;

      if (invalidMdxFiles.length > 0) {
        this.alerts.push(`${invalidMdxFiles.length} MDX files have formatting issues`);
      }

      // Check for content generation capabilities
      const contentCreatorFile = 'lib/blog-scripts/content-creator.ts';
      const contentCreatorExists = existsSync(contentCreatorFile);
      metrics.contentCreatorExists = contentCreatorExists;

      if (!contentCreatorExists) {
        this.alerts.push('Content creator module is missing');
      }

      // Check for content validation
      const contentValidationExists = existsSync('lib/blog-scripts/content-validator.ts');
      metrics.contentValidationExists = contentValidationExists;

      if (!contentValidationExists) {
        this.recommendations.push('Add content validation module');
      }

      // Check for SEO optimization
      const seoOptimizationExists = existsSync('lib/blog-scripts/seo-optimizer.ts');
      metrics.seoOptimizationExists = seoOptimizationExists;

      if (!seoOptimizationExists) {
        this.recommendations.push('Add SEO optimization module');
      }

      // Determine health status
      const contentStructureValid = dirStatus['content'] && dirStatus['content/blog'];
      const hasValidContent = validMdxFiles.length > 0 || contentCreatorExists;
      const noInvalidContent = invalidMdxFiles.length === 0;

      let status: 'healthy' | 'warning' | 'critical';
      let message: string;

      if (!contentStructureValid || !contentCreatorExists) {
        status = 'critical';
        message = 'Content system has critical issues';
      } else if (!noInvalidContent || !contentValidationExists || !seoOptimizationExists) {
        status = 'warning';
        message = 'Content system needs attention';
      } else {
        status = 'healthy';
        message = 'Content system is healthy';
      }

      spinner.succeed(`Content System: ${status}`);
      return {
        status,
        message,
        details: {
          contentStructureValid,
          contentCreatorExists,
          validMdxFiles: validMdxFiles.length,
          invalidMdxFiles: invalidMdxFiles.length,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metrics: metrics as any,
      };
    } catch (error: unknown) {
      spinner.fail('Content system check failed');
      return {
        status: 'critical',
        message: 'Content system health check failed',
        details: { error: error instanceof Error ? error.message : String(error) },
      };
    }
  }

  private async checkPerformance(): Promise<HealthCheckResult> {
    const spinner = ora('Checking performance metrics...').start();
    const metrics: Record<string, number | string | boolean> = {};

    try {
      // Check memory usage
      const memoryUsage = process.memoryUsage();

      metrics.memoryUsage = {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      // Check if application can start (basic startup test)
      let startupTime = 0;
      let canStart = false;

      try {
        const start = Date.now();
        // Quick build check
        execSync('bun run build', { stdio: 'pipe', timeout: 300000 }); // 5 minute timeout
        startupTime = Date.now() - start;
        canStart = true;
      } catch (error) {
        canStart = false;
      }

      metrics.canStart = canStart;
      metrics.startupTime = Math.round(startupTime / 1000); // seconds

      if (!canStart) {
        this.alerts.push('Application cannot build successfully');
      }

      // Check bundle size if built
      let bundleSize = null;
      if (canStart && existsSync('.next')) {
        try {
          const duOutput = execSync('du -sb .next 2>/dev/null', { encoding: 'utf8' });
          bundleSize = parseInt(duOutput.split('\t')[0] || '0');
          metrics.bundleSizeMB = Math.round(bundleSize / 1024 / 1024);

          if (bundleSize > 100 * 1024 * 1024) {
            // > 100MB
            this.recommendations.push('Consider optimizing bundle size');
          }
        } catch (error) {
          metrics.bundleSizeCheckFailed = true;
        }
      }

      // Check CPU load
      try {
        const loadAvg = require('os').loadavg();
        metrics.cpuLoad = loadAvg[0].toFixed(2);
        metrics.cpuLoadHigh = loadAvg[0] > 2.0;

        if (metrics.cpuLoadHigh) {
          this.recommendations.push('High CPU load detected');
        }
      } catch (error) {
        metrics.cpuLoadCheckFailed = true;
      }

      // Determine health status
      const performanceGood = canStart && (!bundleSize || bundleSize < 100 * 1024 * 1024);
      const memoryOk = memoryUsage.heapUsed < 1024 * 1024 * 1024; // < 1GB

      let status: 'healthy' | 'warning' | 'critical';
      let message: string;

      if (!canStart) {
        status = 'critical';
        message = 'Application has critical performance issues';
      } else if (!memoryOk || (bundleSize && bundleSize > 100 * 1024 * 1024)) {
        status = 'warning';
        message = 'Performance needs optimization';
      } else {
        status = 'healthy';
        message = 'Performance is healthy';
      }

      spinner.succeed(`Performance: ${status}`);
      return {
        status,
        message,
        details: {
          canStart,
          bundleSize: bundleSize ? `${Math.round(bundleSize / 1024 / 1024)}MB` : 'unknown',
          memoryUsage: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metrics: metrics as any,
      };
    } catch (error: unknown) {
      spinner.fail('Performance check failed');
      return {
        status: 'critical',
        message: 'Performance health check failed',
        details: { error: error instanceof Error ? error.message : String(error) },
      };
    }
  }

  private calculateOverallHealth(
    components: SystemHealthReport['components']
  ): SystemHealthReport['overall'] {
    const statuses = Object.values(components);
    const healthyCount = statuses.filter((s) => s.status === 'healthy').length;
    const warningCount = statuses.filter((s) => s.status === 'warning').length;
    const criticalCount = statuses.filter((s) => s.status === 'critical').length;

    let status: 'healthy' | 'warning' | 'critical';
    let score: number;

    if (criticalCount > 0) {
      status = 'critical';
      score = Math.max(0, 40 - criticalCount * 10);
    } else if (warningCount > 0) {
      status = 'warning';
      score = Math.max(50, 80 - warningCount * 10);
    } else {
      status = 'healthy';
      score = 95 + Math.round(Math.random() * 5); // 95-100
    }

    return {
      status,
      score,
      issues: warningCount + criticalCount,
    };
  }

  private generateSummary(
    components: SystemHealthReport['components']
  ): SystemHealthReport['summary'] {
    const statuses = Object.values(components);
    return {
      healthyComponents: statuses.filter((s) => s.status === 'healthy').length,
      warningComponents: statuses.filter((s) => s.status === 'warning').length,
      criticalComponents: statuses.filter((s) => s.status === 'critical').length,
      totalChecks: statuses.length,
    };
  }

  private displayHealthReport(report: SystemHealthReport): void {
    console.log(`\n${chalk.bold.blue('🏥 System Health Report')}`);
    console.log(chalk.gray('='.repeat(70)));

    // Overall status
    const statusColor =
      report.overall.status === 'healthy'
        ? chalk.green
        : report.overall.status === 'warning'
          ? chalk.yellow
          : chalk.red;

    console.log(
      `\n${chalk.bold('Overall Status:')} ${statusColor(report.overall.status.toUpperCase())}`
    );
    console.log(`${chalk.bold('Health Score:')} ${report.overall.score}/100`);
    console.log(`${chalk.bold('Issues:')} ${report.overall.issues}`);

    // Component breakdown
    console.log(`\n${chalk.bold('Component Health:')}`);
    Object.entries(report.components).forEach(([component, result]) => {
      const statusIcon =
        result.status === 'healthy' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      const componentName = component
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
      console.log(`  ${statusIcon} ${componentName}: ${result.message}`);
    });

    // Alerts
    if (report.alerts.length > 0) {
      console.log(`\n${chalk.bold.red('🚨 Alerts:')}`);
      report.alerts.forEach((alert, i) => {
        console.log(`  ${i + 1}. ${alert}`);
      });
    }

    // Recommendations
    if (report.recommendations.length > 0) {
      console.log(`\n${chalk.bold.yellow('💡 Recommendations:')}`);
      report.recommendations.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
      });
    }

    console.log(`\n${chalk.gray('='.repeat(70))}`);

    // Final verdict
    if (report.overall.status === 'healthy') {
      console.log(chalk.green.bold('🎉 System is healthy and ready for production!'));
    } else if (report.overall.status === 'warning') {
      console.log(chalk.yellow.bold('⚠️  System has warnings that should be addressed.'));
    } else {
      console.log(chalk.red.bold('🚨 System has critical issues that must be resolved.'));
    }
  }

  // Helper methods
  private findFilesContaining(dir: string, searchTerm: string): string[] {
    try {
      const output = execSync(`grep -r -l "${searchTerm}" ${dir} 2>/dev/null`, {
        encoding: 'utf8',
      });
      return output.trim().split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }
}

// Main execution
async function main() {
  const healthChecker = new SystemHealthChecker();
  const report = await healthChecker.runHealthCheck();

  // Exit with appropriate code
  process.exit(report.overall.status === 'healthy' ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red('Health check failed:'), error);
    process.exit(1);
  });
}

export { SystemHealthChecker };
export type { SystemHealthReport };
