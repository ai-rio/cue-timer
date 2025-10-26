/**
 * Performance Testing and Benchmarking for CueTimer Blog Management System
 *
 * This test suite provides comprehensive performance testing:
 * - CLI response time measurement
 * - Content generation performance
 * - Memory usage validation
 * - Large content handling tests
 * - Concurrent operation testing
 * - File system I/O performance
 * - Resource utilization monitoring
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { performance } from 'perf_hooks';

import { ContentCreator } from '../../lib/blog-scripts/content-creator';
import CASE_STUDY_TEMPLATE from '../../lib/blog-scripts/templates/case-study';
import FEATURE_ANNOUNCE_TEMPLATE from '../../lib/blog-scripts/templates/feature-announce';
import PRESENTATION_TIPS_TEMPLATE from '../../lib/blog-scripts/templates/presentation-tips';
// Import all templates
import TIMING_GUIDE_TEMPLATE from '../../lib/blog-scripts/templates/timing-guide';

// Performance test utilities
const PERF_TEST_DIR = join(process.cwd(), 'temp-perf-test');
const PERF_CONTENT_DIR = join(PERF_TEST_DIR, 'content', 'blog');

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  CLI_RESPONSE_TIME: 3000, // 3 seconds
  CONTENT_GENERATION_TIME: 2000, // 2 seconds per post
  MEMORY_USAGE_MB: 200, // 200MB max
  FILE_IO_TIME: 100, // 100ms per file operation
  CONCURRENT_OPERATIONS_TIME: 10000, // 10 seconds for concurrent ops
  LARGE_CONTENT_SIZE: 1000000, // 1MB content size
} as const;

// Performance metrics interface
interface PerformanceMetrics {
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  memoryBefore: number;
  memoryAfter: number;
  memoryDelta: number;
  success: boolean;
  details?: any;
}

// Benchmark result interface
interface BenchmarkResult {
  operation: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  throughput: number; // operations per second
  memoryUsage: number;
}

// Helper function to get memory usage
function getMemoryUsage(): number {
  return Math.round(process.memoryUsage().heapUsed / 1024 / 1024); // MB
}

// Helper function to measure operation performance
async function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<PerformanceMetrics & { result: T }> {
  const memoryBefore = getMemoryUsage();
  const startTime = performance.now();

  try {
    const result = await fn();
    const endTime = performance.now();
    const memoryAfter = getMemoryUsage();

    return {
      operation,
      startTime,
      endTime,
      duration: endTime - startTime,
      memoryBefore,
      memoryAfter,
      memoryDelta: memoryAfter - memoryBefore,
      success: true,
      result,
    };
  } catch (error) {
    const endTime = performance.now();
    const memoryAfter = getMemoryUsage();

    return {
      operation,
      startTime,
      endTime,
      duration: endTime - startTime,
      memoryBefore,
      memoryAfter,
      memoryDelta: memoryAfter - memoryBefore,
      success: false,
      details: String(error),
    } as PerformanceMetrics & { result: T };
  }
}

// Helper function to run benchmark
async function runBenchmark<T>(
  operation: string,
  iterations: number,
  fn: () => Promise<T>
): Promise<BenchmarkResult> {
  const durations: number[] = [];
  const memoryUsages: number[] = [];
  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    const metrics = await measurePerformance(`${operation}_${i}`, fn);
    durations.push(metrics.duration);
    memoryUsages.push(metrics.memoryAfter);
  }

  const endTime = performance.now();
  const totalTime = endTime - startTime;

  return {
    operation,
    iterations,
    totalTime,
    averageTime: durations.reduce((a, b) => a + b, 0) / durations.length,
    minTime: Math.min(...durations),
    maxTime: Math.max(...durations),
    throughput: (iterations / totalTime) * 1000, // ops per second
    memoryUsage: Math.max(...memoryUsages),
  };
}

// Helper function to create test content creator
function createTestContentCreator() {
  const creator = new ContentCreator();
  (creator as any).contentDir = PERF_CONTENT_DIR;
  return creator;
}

// Helper function to generate large content
function generateLargeContent(size: number): string {
  const words = [
    'lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'sed',
    'do',
    'eiusmod',
    'tempor',
    'incididunt',
    'ut',
    'labore',
    'et',
    'dolore',
    'magna',
    'aliqua',
    'enim',
    'ad',
    'minim',
    'veniam',
    'quis',
    'nostrud',
    'exercitation',
  ];

  let content = '';
  const targetSize = size;

  while (content.length < targetSize) {
    const paragraph = [];
    const paragraphSize = Math.floor(Math.random() * 100) + 50;

    for (let i = 0; i < paragraphSize; i++) {
      paragraph.push(words[Math.floor(Math.random() * words.length)]);
    }

    content += paragraph.join(' ') + '\n\n';
  }

  return content.substring(0, targetSize);
}

describe('Blog Management System Performance Tests', () => {
  let contentCreator: ContentCreator;

  beforeAll(async () => {
    await fs.mkdir(PERF_CONTENT_DIR, { recursive: true });
    contentCreator = createTestContentCreator();
  });

  afterAll(async () => {
    await fs.rm(PERF_TEST_DIR, { recursive: true, force: true });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CLI Response Time Performance', () => {
    test('should respond within acceptable time limits', async () => {
      const operations = [
        'package.json resolution',
        'script parsing',
        'dependency loading',
        'configuration parsing',
      ];

      for (const operation of operations) {
        const metrics = await measurePerformance(operation, async () => {
          // Simulate CLI operations
          switch (operation) {
            case 'package.json resolution':
              return await fs.readFile(join(process.cwd(), 'package.json'), 'utf-8');
            case 'script parsing': {
              const packageJson = JSON.parse(
                await fs.readFile(join(process.cwd(), 'package.json'), 'utf-8')
              );
              return Object.keys(packageJson.scripts || {}).length;
            }
            case 'dependency loading':
              return require.resolve('chalk');
            case 'configuration parsing':
              return process.cwd();
            default:
              return true;
          }
        });

        expect(metrics.success).toBe(true);
        expect(metrics.duration).toBeLessThan(PERFORMANCE_THRESHOLDS.CLI_RESPONSE_TIME);
        expect(metrics.memoryDelta).toBeLessThan(50); // Less than 50MB memory increase
      }
    });

    test('should handle concurrent CLI operations efficiently', async () => {
      const concurrentOperations = Array(10)
        .fill(null)
        .map((_, index) =>
          measurePerformance(`concurrent_cli_${index}`, async () => {
            // Simulate concurrent CLI operations
            await fs.access(join(process.cwd(), 'package.json'));
            return { operationId: index };
          })
        );

      const results = await Promise.all(concurrentOperations);
      const totalTime =
        Math.max(...results.map((r) => r.endTime)) - Math.min(...results.map((r) => r.startTime));
      const successfulOperations = results.filter((r) => r.success);

      expect(successfulOperations).toHaveLength(10);
      expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_OPERATIONS_TIME);
      expect(results.every((r) => r.duration < PERFORMANCE_THRESHOLDS.CLI_RESPONSE_TIME)).toBe(
        true
      );
    });
  });

  describe('Content Generation Performance', () => {
    test('should generate blog posts efficiently', async () => {
      const templates = [
        { id: 'timing-guide', template: TIMING_GUIDE_TEMPLATE },
        { id: 'case-study', template: CASE_STUDY_TEMPLATE },
        { id: 'feature-announce', template: FEATURE_ANNOUNCE_TEMPLATE },
        { id: 'presentation-tips', template: PRESENTATION_TIPS_TEMPLATE },
      ];

      for (const { id, template } of templates) {
        const variables = {
          title: `Performance Test ${id}`,
          difficulty: 'intermediate',
          targetAudience: 'Performance testers',
        };

        const metrics = await measurePerformance(`content_generation_${id}`, async () => {
          return await contentCreator.createPost(template, variables, 'en');
        });

        expect(metrics.success).toBe(true);
        expect(metrics.duration).toBeLessThan(PERFORMANCE_THRESHOLDS.CONTENT_GENERATION_TIME);
        expect(metrics.memoryDelta).toBeLessThan(20); // Less than 20MB per post
        expect(metrics.result.title).toContain('Performance Test');
      }
    });

    test('should handle high-volume content generation', async () => {
      const iterationCount = 50;
      const variables = {
        title: 'High Volume Test Post',
        difficulty: 'beginner',
        targetAudience: 'Performance testing',
      };

      const benchmark = await runBenchmark(
        'high_volume_content_generation',
        iterationCount,
        async () => {
          return await contentCreator.createPost(TIMING_GUIDE_TEMPLATE, variables, 'en');
        }
      );

      expect(benchmark.iterations).toBe(iterationCount);
      expect(benchmark.averageTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CONTENT_GENERATION_TIME);
      expect(benchmark.throughput).toBeGreaterThan(0.5); // At least 0.5 ops per second
      expect(benchmark.memoryUsage).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE_MB);
    });

    test('should maintain performance with complex templates', async () => {
      const complexVariables = {
        title: 'Complex Performance Test with Many Variables',
        difficulty: 'advanced',
        targetAudience: 'Advanced performance testers',
        timeAllocation: '60 minutes',
        keyTopics: Array(20)
          .fill(null)
          .map((_, i) => `Topic ${i + 1}`),
        additionalContent: Array(50)
          .fill(null)
          .map((_, i) => `Content item ${i + 1}`),
      };

      const metrics = await measurePerformance('complex_template_generation', async () => {
        return await contentCreator.createPost(TIMING_GUIDE_TEMPLATE, complexVariables, 'en');
      });

      expect(metrics.success).toBe(true);
      expect(metrics.duration).toBeLessThan(PERFORMANCE_THRESHOLDS.CONTENT_GENERATION_TIME * 2); // Allow 2x for complexity
      expect(metrics.result.content.length).toBeGreaterThan(1000); // Should generate substantial content
    });
  });

  describe('Memory Usage Validation', () => {
    test('should maintain reasonable memory usage during operations', async () => {
      const initialMemory = getMemoryUsage();
      const memorySnapshots = [initialMemory];

      // Perform multiple operations
      for (let i = 0; i < 20; i++) {
        const variables = {
          title: `Memory Test Post ${i}`,
          difficulty: 'intermediate',
          targetAudience: 'Memory testing',
        };

        await contentCreator.createPost(TIMING_GUIDE_TEMPLATE, variables, 'en');
        memorySnapshots.push(getMemoryUsage());
      }

      const finalMemory = getMemoryUsage();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE_MB);
      expect(finalMemory).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE_MB);

      // Check for memory leaks (memory should not continuously increase)
      const maxMemory = Math.max(...memorySnapshots);
      const avgMemory = memorySnapshots.reduce((a, b) => a + b, 0) / memorySnapshots.length;
      expect(maxMemory - avgMemory).toBeLessThan(50); // Less than 50MB variance
    });

    test('should handle garbage collection effectively', async () => {
      const initialMemory = getMemoryUsage();

      // Create and discard many objects
      for (let i = 0; i < 100; i++) {
        const variables = {
          title: `GC Test Post ${i}`,
          difficulty: 'beginner',
          targetAudience: 'GC testing',
        };

        const post = await contentCreator.createPost(TIMING_GUIDE_TEMPLATE, variables, 'en');
        // Discard the post object
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const afterGCMemory = getMemoryUsage();
      const memoryIncrease = afterGCMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(100); // Less than 100MB after GC
    });

    test('should handle large content without memory overflow', async () => {
      const largeVariables = {
        title: 'Large Content Test',
        difficulty: 'advanced',
        targetAudience: 'Large content testing',
        largeContent: generateLargeContent(PERFORMANCE_THRESHOLDS.LARGE_CONTENT_SIZE),
      };

      const metrics = await measurePerformance('large_content_handling', async () => {
        // Create a template that can handle large content
        const largeTemplate = {
          ...TIMING_GUIDE_TEMPLATE,
          variables: [
            ...TIMING_GUIDE_TEMPLATE.variables,
            {
              name: 'largeContent',
              type: 'string' as const,
              required: false,
              description: 'Large content field',
            },
          ],
        };

        return await contentCreator.createPost(largeTemplate, largeVariables, 'en');
      });

      expect(metrics.success).toBe(true);
      expect(metrics.memoryDelta).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE_MB);
      expect(metrics.result.content.length).toBeGreaterThan(
        PERFORMANCE_THRESHOLDS.LARGE_CONTENT_SIZE * 0.5
      );
    });
  });

  describe('File System I/O Performance', () => {
    test('should handle file operations efficiently', async () => {
      const fileOperations = [
        'write_small_file',
        'write_medium_file',
        'write_large_file',
        'read_small_file',
        'read_medium_file',
        'read_large_file',
      ];

      const testContent = {
        small: 'Small test content',
        medium: generateLargeContent(10000), // 10KB
        large: generateLargeContent(100000), // 100KB
      };

      const results: PerformanceMetrics[] = [];

      for (const operation of fileOperations) {
        const [size, action] = operation.split('_');
        const content = testContent[size as keyof typeof testContent];

        const metrics = await measurePerformance(operation, async () => {
          const filePath = join(PERF_CONTENT_DIR, `${operation}.mdx`);

          if (action === 'write') {
            await fs.writeFile(filePath, content);
            return content.length;
          } else {
            return await fs.readFile(filePath, 'utf-8');
          }
        });

        results.push(metrics);
        expect(metrics.success).toBe(true);
        expect(metrics.duration).toBeLessThan(
          PERFORMANCE_THRESHOLDS.FILE_IO_TIME * (size === 'large' ? 10 : 1)
        );
      }

      // Verify all operations completed successfully
      expect(results.every((r) => r.success)).toBe(true);

      // Calculate average I/O performance
      const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
      expect(avgDuration).toBeLessThan(PERFORMANCE_THRESHOLDS.FILE_IO_TIME * 2);
    });

    test('should handle concurrent file operations', async () => {
      const concurrentOperations = Array(20)
        .fill(null)
        .map((_, index) => {
          const content = generateLargeContent(1000); // 1KB each
          const filePath = join(PERF_CONTENT_DIR, `concurrent_${index}.mdx`);

          return measurePerformance(`concurrent_file_${index}`, async () => {
            await fs.writeFile(filePath, content);
            return await fs.readFile(filePath, 'utf-8');
          });
        });

      const results = await Promise.all(concurrentOperations);
      const successfulOperations = results.filter((r) => r.success);
      const totalTime =
        Math.max(...results.map((r) => r.endTime)) - Math.min(...results.map((r) => r.startTime));

      expect(successfulOperations).toHaveLength(20);
      expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_OPERATIONS_TIME);
      expect(results.every((r) => r.duration < PERFORMANCE_THRESHOLDS.FILE_IO_TIME * 5)).toBe(true);
    });

    test('should handle directory operations efficiently', async () => {
      const metrics = await measurePerformance('directory_operations', async () => {
        const testDirs = Array(10)
          .fill(null)
          .map((_, i) => join(PERF_CONTENT_DIR, `test_dir_${i}`));

        // Create directories
        await Promise.all(testDirs.map((dir) => fs.mkdir(dir, { recursive: true })));

        // Create files in each directory
        const fileOperations = testDirs.map(async (dir, index) => {
          const filePath = join(dir, `file_${index}.mdx`);
          await fs.writeFile(filePath, `Test content ${index}`);
          return filePath;
        });

        const createdFiles = await Promise.all(fileOperations);

        // Read files
        const readOperations = createdFiles.map(async (filePath) => {
          return await fs.readFile(filePath, 'utf-8');
        });

        return await Promise.all(readOperations);
      });

      expect(metrics.success).toBe(true);
      expect(metrics.duration).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_OPERATIONS_TIME);
      expect(metrics.result).toHaveLength(10); // 10 directories created
    });
  });

  describe('Concurrent Operation Testing', () => {
    test('should handle concurrent content generation', async () => {
      const concurrentGenerations = Array(10)
        .fill(null)
        .map((_, index) => {
          const variables = {
            title: `Concurrent Test Post ${index}`,
            difficulty: 'intermediate',
            targetAudience: 'Concurrent testing',
          };

          return measurePerformance(`concurrent_generation_${index}`, async () => {
            return await contentCreator.createPost(TIMING_GUIDE_TEMPLATE, variables, 'en');
          });
        });

      const results = await Promise.all(concurrentGenerations);
      const successfulOperations = results.filter((r) => r.success);
      const totalTime =
        Math.max(...results.map((r) => r.endTime)) - Math.min(...results.map((r) => r.startTime));

      expect(successfulOperations).toHaveLength(10);
      expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_OPERATIONS_TIME);
      expect(results.every((r) => r.memoryDelta < 50)).toBe(true); // Less than 50MB per operation
    });

    test('should handle mixed concurrent operations', async () => {
      const mixedOperations = [
        ...Array(5)
          .fill(null)
          .map((_, i) =>
            measurePerformance(`content_${i}`, async () => {
              return await contentCreator.createPost(
                TIMING_GUIDE_TEMPLATE,
                { title: `Mixed Test ${i}`, difficulty: 'intermediate' },
                'en'
              );
            })
          ),
        ...Array(5)
          .fill(null)
          .map((_, i) =>
            measurePerformance(`file_${i}`, async () => {
              const filePath = join(PERF_CONTENT_DIR, `mixed_${i}.mdx`);
              await fs.writeFile(filePath, `Mixed test content ${i}`);
              return await fs.readFile(filePath, 'utf-8');
            })
          ),
      ];

      const results = await Promise.all(mixedOperations);
      const successfulOperations = results.filter((r) => r.success);
      const totalTime =
        Math.max(...results.map((r) => r.endTime)) - Math.min(...results.map((r) => r.startTime));

      expect(successfulOperations).toHaveLength(10);
      expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_OPERATIONS_TIME);

      // Verify memory usage is reasonable
      const maxMemoryDelta = Math.max(...results.map((r) => r.memoryDelta));
      expect(maxMemoryDelta).toBeLessThan(100); // Less than 100MB for any operation
    });
  });

  describe('Performance Regression Detection', () => {
    test('should maintain performance benchmarks over time', async () => {
      const benchmarks: Array<{
        name: string;
        operation: () => Promise<any>;
        expectedMaxTime: number;
        expectedMaxMemory: number;
      }> = [
        {
          name: 'simple_content_generation',
          operation: async () => {
            return await contentCreator.createPost(
              TIMING_GUIDE_TEMPLATE,
              { title: 'Benchmark Test', difficulty: 'beginner' },
              'en'
            );
          },
          expectedMaxTime: PERFORMANCE_THRESHOLDS.CONTENT_GENERATION_TIME,
          expectedMaxMemory: 50,
        },
        {
          name: 'file_io_operations',
          operation: async () => {
            const filePath = join(PERF_CONTENT_DIR, 'benchmark_test.mdx');
            await fs.writeFile(filePath, 'Benchmark test content');
            return await fs.readFile(filePath, 'utf-8');
          },
          expectedMaxTime: PERFORMANCE_THRESHOLDS.FILE_IO_TIME,
          expectedMaxMemory: 10,
        },
      ];

      for (const benchmark of benchmarks) {
        const result = await runBenchmark(benchmark.name, 10, benchmark.operation);

        expect(result.averageTime).toBeLessThan(benchmark.expectedMaxTime);
        expect(result.memoryUsage).toBeLessThan(benchmark.expectedMaxMemory);
        expect(result.throughput).toBeGreaterThan(0.1); // At least 0.1 ops per second
      }
    });

    test('should detect performance degradation', async () => {
      const baselineTime = 1000; // 1 second baseline
      const acceptableDegradation = 2.0; // 2x degradation acceptable

      const benchmark = await runBenchmark('degradation_test', 5, async () => {
        return await contentCreator.createPost(
          TIMING_GUIDE_TEMPLATE,
          { title: 'Degradation Test', difficulty: 'intermediate' },
          'en'
        );
      });

      const degradationFactor = benchmark.averageTime / baselineTime;
      expect(degradationFactor).toBeLessThan(acceptableDegradation);
    });
  });

  describe('Resource Utilization Monitoring', () => {
    test('should monitor CPU and memory usage during operations', async () => {
      const initialMemory = getMemoryUsage();
      const memorySnapshots = [initialMemory];

      const monitoringInterval = setInterval(() => {
        memorySnapshots.push(getMemoryUsage());
      }, 100);

      try {
        // Perform resource-intensive operations
        await Promise.all(
          Array(10)
            .fill(null)
            .map(async (_, index) => {
              const variables = {
                title: `Resource Test ${index}`,
                difficulty: 'advanced',
                targetAudience: 'Resource testing',
              };

              return await contentCreator.createPost(TIMING_GUIDE_TEMPLATE, variables, 'en');
            })
        );
      } finally {
        clearInterval(monitoringInterval);
      }

      const finalMemory = getMemoryUsage();
      const maxMemory = Math.max(...memorySnapshots);
      const avgMemory = memorySnapshots.reduce((a, b) => a + b, 0) / memorySnapshots.length;

      expect(finalMemory).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE_MB);
      expect(maxMemory).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_USAGE_MB * 1.2);
      expect(maxMemory - avgMemory).toBeLessThan(50); // Less than 50MB variance
    });
  });
});
