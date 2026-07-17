import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.ts'],
    // Keep vitest's built-in excludes and add the non-spec helper modules.
    exclude: [
      ...configDefaults.exclude,
      'test/global-env.ts',
      'test/axios-headers-dirty-hacks.ts',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'lcov'],
    },
  },
});
