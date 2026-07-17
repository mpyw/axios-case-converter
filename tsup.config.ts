import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es2021',
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // Keep runtime dependencies external; they are resolved from node_modules.
  external: ['axios', 'camel-case', 'snake-case', 'header-case'],
});
