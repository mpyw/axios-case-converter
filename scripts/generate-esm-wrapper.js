#!/usr/bin/env node
/**
 * Generate ESM wrapper for Node.js ESM compatibility
 *
 * Node.js ESM imports CJS module.exports as default, but our CJS export is:
 *   exports.default = applyCaseMiddleware
 *
 * This means: import x from 'pkg' => x = { default: fn, ... }
 * We need:    import x from 'pkg' => x = fn
 *
 * This wrapper re-exports the default correctly.
 */

const fs = require('fs');
const path = require('path');

const wrapper = `// ESM wrapper for Node.js compatibility
import cjs from './index.js';
export default cjs.default;
export * from './index.js';
`;

const libDir = path.join(__dirname, '..', 'lib');
const wrapperPath = path.join(libDir, 'index.mjs');

fs.writeFileSync(wrapperPath, wrapper);
console.log('Generated:', wrapperPath);
