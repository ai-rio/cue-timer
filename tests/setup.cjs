// Jest setup file for global test configuration
require('@testing-library/jest-dom');

// Mock for Node.js environment
const { TextDecoder, TextEncoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Enhanced IntersectionObserver mock for TOC functionality
global.IntersectionObserver = jest.fn().mockImplementation((callback, options) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock getBoundingClientRect for element positioning
Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
  value: jest.fn(() => ({
    top: 100,
    bottom: 200,
    left: 0,
    right: 300,
    width: 300,
    height: 100,
  })),
  writable: true,
});

// Additional window methods if not available in jsdom
if (!window.history) {
  Object.defineProperty(window, 'history', {
    value: {
      pushState: jest.fn(),
      replaceState: jest.fn(),
      go: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    },
    writable: true,
  });
}

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

// Mock window.scrollIntoView
Object.defineProperty(window, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

// Setup for file system tests
const { promises: fs } = require('fs');
const { join } = require('path');

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
