/**
 * ESM import test
 *
 * This test verifies that the package can be correctly imported
 * in Node.js ESM environment (type: module).
 *
 * Run with: node test/esm/test-esm-import.mjs
 */

import applyCaseMiddleware from '../../lib/index.mjs';

// Test 1: Default export is a function
if (typeof applyCaseMiddleware !== 'function') {
  console.error('FAIL: applyCaseMiddleware is not a function');
  console.error('  typeof:', typeof applyCaseMiddleware);
  console.error('  value:', applyCaseMiddleware);
  process.exit(1);
}

console.log('PASS: Default export is a function');

// Test 2: Function can be called with axios-like object
const mockAxios = {
  defaults: {
    transformRequest: [],
    transformResponse: [],
  },
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} },
  },
};

try {
  const result = applyCaseMiddleware(mockAxios);
  if (result !== mockAxios) {
    console.error('FAIL: applyCaseMiddleware did not return the axios instance');
    process.exit(1);
  }
  console.log('PASS: applyCaseMiddleware works correctly');
} catch (e) {
  console.error('FAIL: applyCaseMiddleware threw an error:', e.message);
  process.exit(1);
}

console.log('');
console.log('All ESM tests passed!');
