import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  resolve: { preserveSymlinks: true },
  test: {
    environment: 'jsdom',
    pool: 'threads',
    include: ['../../tests/frontend/**/*.test.jsx'],
    setupFiles: ['../../tests/frontend/setup.js'],
    restoreMocks: true,
  },
});
