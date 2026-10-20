import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    proxy: { '/api': 'http://127.0.0.1:3001' },
    host: '127.0.0.1',
    fs: {
      deny: [
        '.env',
        '.env.*',
        '*.{crt,pem}',
        '**/.git/**',
        '**/.local/**',
        '**/.codex-remote-attachments/**',
        '**/atlas-credentials.env',
      ],
      allow: [
        fileURLToPath(new URL('.', import.meta.url)),
        fileURLToPath(new URL('../../packages/shared-types', import.meta.url)),
        fileURLToPath(new URL('../../node_modules', import.meta.url)),
      ],
    },
  },
});
