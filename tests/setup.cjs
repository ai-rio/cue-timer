// Jest setup file for global test configuration
require('@testing-library/jest-dom');

// Mock for Node.js environment
const { TextDecoder, TextEncoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Make jest available globally - Fix for "jest.mock is not a function" error
const { jest } = require('@jest/globals');
global.jest = jest;

// Global DOM setup for browser environment testing
// Ensure proper DOM mocking for jsdom environment
Object.defineProperty(window, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

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

// Mock window location
Object.defineProperty(window, 'location', {
  value: {
    hash: '',
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
  },
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
