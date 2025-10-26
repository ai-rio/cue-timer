// Jest setup file for global test configuration
import '@testing-library/jest-dom';

import { jest } from '@jest/globals';
import { expect } from '@jest/globals';
import { TextDecoder, TextEncoder } from 'util';

// Mock for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Make jest available globally
global.jest = jest;

// Setup for file system tests
import { promises as fs } from 'fs';
import { join } from 'path';

const TEST_TEMP_DIR = join(process.cwd(), 'temp-test-files');

// Global test setup
beforeAll(async () => {
  // Create temp directory for tests
  try {
    await fs.mkdir(TEST_TEMP_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
});

// Global test cleanup
afterAll(async () => {
  // Clean up temp directory
  try {
    await fs.rm(TEST_TEMP_DIR, { recursive: true, force: true });
  } catch (error) {
    // Directory might not exist
  }
});

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  // Uncomment to silence specific console methods during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
