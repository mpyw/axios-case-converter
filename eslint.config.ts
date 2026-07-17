import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    // Build outputs. `es/`, `lib/`, `typings/` are stale v1 artifacts that may
    // still linger in a working tree; flat-config ESLint does not read
    // .gitignore, so list them explicitly to avoid linting generated files.
    ignores: ['dist', 'coverage', 'node_modules', 'es', 'lib', 'typings'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        // Browser + Node globals used by src and tests.
        console: 'readonly',
        navigator: 'readonly',
        globalThis: 'readonly',
        global: 'readonly',
        process: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        // Vitest globals (test.globals = true).
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
