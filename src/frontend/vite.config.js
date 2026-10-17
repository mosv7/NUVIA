import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  resolve: { preserveSymlinks: true },
  server: {
    host: '127.0.0.1',
    fs: {
      allow: [
        fileURLToPath(new URL('.', import.meta.url)),
        fileURLToPath(new URL('../../node_modules', import.meta.url)),
      ],
    },
  },
  build: { rollupOptions: { preserveSymlinks: true } },
});
