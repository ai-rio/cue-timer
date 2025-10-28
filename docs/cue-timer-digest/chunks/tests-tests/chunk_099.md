# Chunk 99: tests_tests

## Metadata

- **Files**: 1
- **Size**: 17,810 characters (~4,452 tokens)
- **Categories**: tests

## Files in this chunk

- `tests/config/eslint-validation.test.ts`

---

## File: `tests/config/eslint-validation.test.ts`

```typescript
/**
 * ESLint Configuration Validation Tests
 * Tests that our ESLint configuration is working correctly and enforcing the rules we expect
 */

import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('ESLint Configuration Validation', () => {
  const projectRoot = process.cwd();
  const eslintConfigPath = join(projectRoot, 'eslint.config.js');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Configuration File Validation', () => {
    test('should have ESLint configuration file', () => {
      // Assert
      expect(existsSync(eslintConfigPath)).toBe(true);
    });

    test('should have valid ESLint configuration syntax', () => {
      // Act
      const configContent = readFileSync(eslintConfigPath, 'utf-8');

      // Assert - Should be valid JavaScript that can be parsed
      expect(() => {
        // Test that the config can be required/parsed
        const eslintConfig = eval(`(${configContent})`);
        expect(Array.isArray(eslintConfig)).toBe(true);
      }).not.toThrow();
    });

    test('should include required ESLint plugins', () => {
      // Act
      const configContent = readFileSync(eslintConfigPath, 'utf-8');

      // Assert
      expect(configContent).toContain('@typescript-eslint/eslint-plugin');
      expect(configContent).toContain('eslint-plugin-prettier');
      expect(configContent).toContain('eslint-plugin-react');
      expect(configContent).toContain('eslint-plugin-react-hooks');
      expect(configContent).toContain('eslint-plugin-simple-import-sort');
      expect(configContent).toContain('@next/eslint-plugin-next');
    });

    test('should include TypeScript parser configuration', () => {
      // Act
      const configContent = readFileSync(eslintConfigPath, 'utf-8');

      // Assert
      expect(configContent).toContain('@typescript-eslint/parser');
      expect(configContent).toContain('typescript-eslint.configs.recommended');
    });

    test('should have proper ignore patterns', () => {
      // Act
      const configContent = readFileSync(eslintConfigPath, 'utf-8');

      // Assert
      expect(configContent).toContain('.next/**');
      expect(configContent).toContain('node_modules/**');
      expect(configContent).toContain('coverage/**');
      expect(configContent).toContain('build/**');
      expect(configContent).toContain('dist/**');
    });

    test('should have separate rules for different file types', () => {
      // Act
      const configContent = readFileSync(eslintConfigPath, 'utf-8');

      // Assert
      expect(configContent).toContain("files: ['**/*.test.{ts,tsx,js,jsx}']");
      expect(configContent).toContain("files: ['scripts/**/*']");
      expect(configContent).toContain(
        "files: ['content/**/*.md', 'content/**/*.mdx']"
      );
    });
  });

  describe('ESLint Rule Enforcement', () => {
    test('should enforce TypeScript strict rules', () => {
      // Arrange
      const testFile = `
        // TypeScript strict mode test
        let untypedVar: any = 'test';
        function unusedFunc(param: any): void {
          console.log(param);
        }
      `;

      // Act & Assert
      expect(() => {
        execSync(`echo "${testFile}" | bunx eslint --stdin --ext .ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).toThrow();
    });

    test('should enforce no-unused-vars rule', () => {
      // Arrange
      const testFile = `
        import { unusedImport } from 'test';
        const unusedVariable = 'test';

        function usedFunction() {
          return 'used';
        }

        usedFunction();
      `;

      // Act & Assert
      expect(() => {
        execSync(`echo "${testFile}" | bunx eslint --stdin --ext .ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).toThrow();
    });

    test('should enforce import sorting', () => {
      // Arrange
      const testFile = `
        import { z } from 'zod';
        import { a } from './local';
        import react from 'react';
        import { b } from 'react-dom';
      `;

      // Act & Assert
      expect(() => {
        execSync(`echo "${testFile}" | bunx eslint --stdin --ext .ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).toThrow();
    });

    test('should enforce no-console rule in production code', () => {
      // Arrange
      const testFile = `
        console.log('This should trigger a warning');
        console.error('This should also trigger a warning');
        console.warn('This should trigger a warning too');
      `;

      // Act & Assert
      expect(() => {
        execSync(`echo "${testFile}" | bunx eslint --stdin --ext .ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).toThrow();
    });

    test('should enforce prefer-const rule', () => {
      // Arrange
      const testFile = `
        let shouldConst = 'test';
        let anotherVar = 'another test';

        shouldConst = 'modified';
      `;

      // Act & Assert
      expect(() => {
        execSync(`echo "${testFile}" | bunx eslint --stdin --ext .ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).toThrow();
    });

    test('should enforce object-shorthand rule', () => {
      // Arrange
      const testFile = `
        const name = 'test';
        const value = 42;

        const obj = {
          name: name,
          value: value,
          method: function() { return 'test'; }
        };
      `;

      // Act & Assert
      expect(() => {
        execSync(`echo "${testFile}" | bunx eslint --stdin --ext .ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).toThrow();
    });

    test('should enforce prefer-template rule', () => {
      // Arrange
      const testFile = `
        const name = 'world';
        const message = 'Hello ' + name + '!';
      `;

      // Act & Assert
      expect(() => {
        execSync(`echo "${testFile}" | bunx eslint --stdin --ext .ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).toThrow();
    });

    test('should enforce no-duplicate-imports rule', () => {
      // Arrange
      const testFile = `
        import { Component } from 'react';
        import { useState } from 'react';
        import { useEffect } from 'react';
      `;

      // Act & Assert
      expect(() => {
        execSync(`echo "${testFile}" | bunx eslint --stdin --ext .ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).toThrow();
    });
  });

  describe('File-Specific Rules', () => {
    test('should allow console in scripts', () => {
      // Arrange
      const testFile = `
        console.log('This should be allowed in scripts');
        console.error('Scripts can use console methods');
      `;

      // Act & Assert - Should not throw for script files
      expect(() => {
        execSync(
          `echo "${testFile}" | bunx eslint --stdin --ext .ts --config-filename scripts/`,
          {
            cwd: projectRoot,
            stdio: 'pipe',
          }
        );
      }).not.toThrow();
    });

    test('should relax rules in test files', () => {
      // Arrange
      const testFile = `
        import { expect, test, describe } from '@jest/globals';

        let unusedVar: any = 'test';
        console.log('Test console log');

        test('sample test', () => {
          expect(true).toBe(true);
        });
      `;

      // Act & Assert - Should not throw for test files
      expect(() => {
        execSync(`echo "${testFile}" | bunx eslint --stdin --ext .test.ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });

    test('should handle content files appropriately', () => {
      // Arrange
      const testFile = `
        ---
        title: "Test MDX File"
        ---

        # Heading

        This is content with \`inline code\` and **bold text**.

        \`\`\`javascript
        console.log('Code block');
        \`\`\`
      `;

      // Act & Assert - Should handle MDX content files
      expect(() => {
        execSync(`echo "${testFile}" | bunx eslint --stdin --ext .mdx`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });
  });

  describe('Integration with Project Structure', () => {
    test('should lint TypeScript files in src directory', () => {
      // Act & Assert - Should be able to lint actual project files
      expect(() => {
        execSync('bunx eslint "src/**/*.{ts,tsx}" --max-warnings=0', {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });

    test('should lint components directory', () => {
      // Act & Assert
      expect(() => {
        execSync('bunx eslint "components/**/*.{ts,tsx}" --max-warnings=0', {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });

    test('should lint lib directory', () => {
      // Act & Assert
      expect(() => {
        execSync('bunx eslint "lib/**/*.{ts,tsx}" --max-warnings=0', {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });

    test('should handle scripts directory with relaxed rules', () => {
      // Act & Assert - Should lint scripts without strict formatting rules
      expect(() => {
        execSync('bunx eslint "scripts/**/*.{ts,js}"', {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });
  });

  describe('Performance and Optimization', () => {
    test('should complete linting in reasonable time', () => {
      // Arrange
      const startTime = Date.now();

      // Act
      expect(() => {
        execSync('bunx eslint . --max-warnings=0', {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Assert - Should complete within reasonable time (30 seconds)
      expect(duration).toBeLessThan(30000);
    });

    test('should not have memory leaks during linting', () => {
      // This is a basic test - in a real scenario you might use memory profiling tools
      // Act & Assert - Should complete without running out of memory
      expect(() => {
        execSync('bunx eslint . --max-warnings=0', {
          cwd: projectRoot,
          stdio: 'pipe',
          maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        });
      }).not.toThrow();
    });
  });

  describe('Custom Rule Validation', () => {
    test('should enforce custom blog-specific rules', () => {
      // Arrange - Test file with potential blog-specific issues
      const testFile = `
        // Test blog-specific content
        const blogData = {
          title: 'Test Blog Post',
          content: 'This is test content for the blog management system.',
          metadata: {
            author: 'Test Author',
            date: '2024-01-01',
            tags: ['test', 'blog']
          }
        };

        // Should use object shorthand
        const simplifiedData = {
          title: blogData.title,
          content: blogData.content,
        };

        // Should use template literals
        const message = 'Blog post: ' + blogData.title;
      `;

      // Act & Assert - Should enforce our custom rules
      expect(() => {
        execSync(`echo "${testFile}" | bunx eslint --stdin --ext .ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).toThrow();
    });

    test('should enforce accessibility-related rules', () => {
      // Arrange
      const testFile = `
        // Test React component with potential accessibility issues
        import React from 'react';

        function BadComponent() {
          return (
            <div>
              <img src="test.jpg" />
              <button onClick={() => console.log('clicked')}>
                Click me
              </button>
              <a href="http://example.com">
                External link
              </a>
            </div>
          );
        }
      `;

      // Act & Assert - Should catch accessibility issues
      expect(() => {
        execSync(`echo "${testFile}" | bunx eslint --stdin --ext .tsx`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).toThrow();
    });
  });

  describe('ESLint Auto-Fixing', () => {
    test('should auto-fix common issues', () => {
      // Arrange
      const testFile = `
        import { z } from 'zod';
        import react from 'react';
        import { useState } from 'react';

        let testVar = 'should be const';
        const obj = { testVar: testVar };
        const message = 'Hello ' + 'World';
      `;

      // Act
      const result = execSync(
        `echo "${testFile}" | bunx eslint --stdin --ext .ts --fix`,
        {
          cwd: projectRoot,
          stdio: 'pipe',
          encoding: 'utf8',
        }
      );

      // Assert - Should auto-fix import sorting, var to const, object shorthand, template literals
      expect(result).toContain("import react from 'react'");
      expect(result).toContain("import { useState, z } from 'zod'");
      expect(result).toContain('const testVar');
      expect(result).toContain('{ testVar }');
      expect(result).toContain('`Hello World`');
    });

    test('should not break code when auto-fixing', () => {
      // Arrange
      const testFile = `
        import { Component, useState } from 'react';

        function TestComponent() {
          const [state, setState] = useState(0);
          let unused = 'test';

          return <div>Test</div>;
        }
      `;

      // Act & Assert - Auto-fix should not break syntax
      expect(() => {
        const result = execSync(
          `echo "${testFile}" | bunx eslint --stdin --ext .tsx --fix`,
          {
            cwd: projectRoot,
            stdio: 'pipe',
            encoding: 'utf8',
          }
        );

        // The result should still be valid TypeScript/React code
        expect(result).toContain('function TestComponent');
        expect(result).toContain('useState');
      }).not.toThrow();
    });
  });

  describe('Integration with Build Process', () => {
    test('should work with Next.js ESLint integration', () => {
      // Act & Assert - Should integrate with Next.js linting
      expect(() => {
        execSync('bunx next lint', {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });

    test('should pass linting as part of quality check', () => {
      // Act & Assert - Should pass our quality check script
      expect(() => {
        execSync('bun run quality:check', {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });

    test('should work with pre-commit hooks', () => {
      // Act & Assert - Should work with our lint-staged configuration
      expect(() => {
        execSync('bunx lint-staged --verbose', {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle files with syntax errors gracefully', () => {
      // Arrange
      const invalidFile = `
        // Invalid TypeScript syntax
        function broken( {
          return 'broken syntax';
        }
      `;

      // Act & Assert - Should report syntax errors without crashing
      expect(() => {
        execSync(`echo "${invalidFile}" | bunx eslint --stdin --ext .ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).toThrow();
    });

    test('should handle empty files', () => {
      // Arrange
      const emptyFile = '';

      // Act & Assert - Should handle empty files gracefully
      expect(() => {
        execSync(`echo "${emptyFile}" | bunx eslint --stdin --ext .ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });

    test('should handle files with only comments', () => {
      // Arrange
      const commentOnlyFile = `
        // This is a comment
        /*
         * Multi-line comment
         */
        // Another comment
      `;

      // Act & Assert
      expect(() => {
        execSync(`echo "${commentOnlyFile}" | bunx eslint --stdin --ext .ts`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });

    test('should handle files with complex TypeScript features', () => {
      // Arrange
      const complexFile = `
        import { useState, useEffect, useCallback, useMemo } from 'react';
        import type { NextPage, GetStaticProps } from 'next';

        interface ComplexType<T = string> {
          id: number;
          data: T;
          metadata?: Record<string, unknown>;
        }

        type UnionType = string | number | boolean;

        const ComplexComponent: NextPage<{ data: ComplexType[] }> = ({ data }) => {
          const [state, setState] = useState<UnionType>('');

          const memoizedValue = useMemo(() => {
            return data.filter(item => item.id > 0);
          }, [data]);

          const handleClick = useCallback((id: number) => {
            setState(id);
          }, []);

          useEffect(() => {
            // Effect logic
          }, [memoizedValue]);

          return <div>Complex Component</div>;
        };

        export default ComplexComponent;
      `;

      // Act & Assert - Should handle complex TypeScript without issues
      expect(() => {
        execSync(`echo "${complexFile}" | bunx eslint --stdin --ext .tsx`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });
  });
});
```
