import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { resolveConfig, isFileServingAllowed } from 'vite';

test('development server allows app/shared dependencies and blocks private repository files', async () => {
  const config = await resolveConfig(
    {
      root: fileURLToPath(new URL('../', import.meta.url)),
      configFile: fileURLToPath(new URL('../vite.config.js', import.meta.url)),
    },
    'serve',
  );
  const allowed = (relative) =>
    isFileServingAllowed(config, fileURLToPath(new URL(relative, import.meta.url)));
  assert.equal(allowed('../src/main.jsx'), true);
  assert.equal(allowed('../../../packages/shared-types/src/index.js'), true);
  assert.equal(allowed('../../../node_modules/example/index.js'), true);
  // Synthetic paths only: never open private configuration or mailbox files.
  for (const path of [
    '../../../.local/mail/synthetic.json',
    '../../../.local/config/atlas-credentials.env',
    '../../../atlas-credentials.env',
    '../../../README.md',
    '../.env',
    '../synthetic.pem',
  ]) {
    assert.equal(allowed(path), false, path);
  }
});
