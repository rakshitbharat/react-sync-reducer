import '@testing-library/jest-dom';

// Mock console.warn for store.reset() tests
global.console = {
  ...console,
  warn: jest.fn(),
};
