import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadConfig } from '../../src/backend/config.mjs';

const settings = {
  NODE_ENV: 'test',
  MONGODB_URI: 'mongodb://127.0.0.1:27017',
  MONGODB_DATABASE: 'nuvia_test_config',
  APP_ORIGIN: 'http://127.0.0.1:5173',
  MAIL_ENCRYPTION_KEY: 'a'.repeat(64),
};
test('configuration loads organized private Atlas settings and preserves explicit precedence', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'nuvia-organized-config-'));
  try {
    await mkdir(join(rootDir, '.local', 'config'), { recursive: true });
    await writeFile(
      join(rootDir, '.local', 'config', 'atlas-credentials.env'),
      `MONGODB_URI=mongodb://localhost:27018\nMAIL_ENCRYPTION_KEY=${'c'.repeat(64)}\n`,
    );
    await writeFile(
      join(rootDir, 'atlas-credentials.env'),
      'MONGODB_URI=mongodb://localhost:27017\n',
    );
    assert.equal(
      loadConfig({ NODE_ENV: 'development' }, { rootDir }).mongoUri,
      'mongodb://localhost:27018',
    );
    await writeFile(join(rootDir, '.env'), 'MONGODB_URI=mongodb://localhost:27019\n');
    assert.equal(
      loadConfig({ NODE_ENV: 'development' }, { rootDir }).mongoUri,
      'mongodb://localhost:27019',
    );
    assert.equal(
      loadConfig({ ...settings, NODE_ENV: 'development' }, { rootDir }).mongoUri,
      settings.MONGODB_URI,
    );
    assert.throws(() => loadConfig({ NODE_ENV: 'production' }, { rootDir }));
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});
test('configuration validates settings and never discloses values in errors', () => {
  const config = loadConfig(settings);
  assert.equal(config.port, 3001);
  assert.equal(config.tlsMaxVersion, undefined);
  assert.deepEqual(config.dnsServers, []);
  for (const field of [
    'MONGODB_URI',
    'APP_ORIGIN',
    'MAIL_ENCRYPTION_KEY',
    'MONGODB_DNS_SERVERS',
    'MONGODB_TLS_MAX_VERSION',
  ]) {
    assert.throws(
      () => loadConfig({ ...settings, [field]: 'private-invalid-value' }),
      (error) => !error.message.includes('private-invalid-value'),
    );
  }
});
test('configuration honors environment over local files and production never loads them', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'nuvia-config-'));
  try {
    await writeFile(
      join(rootDir, 'atlas-credentials.env'),
      'MONGODB_URI=mongodb://localhost:27017\n',
    );
    await writeFile(
      join(rootDir, '.env'),
      `MONGODB_DATABASE=local\nMAIL_ENCRYPTION_KEY=${'b'.repeat(64)}\n`,
    );
    const config = loadConfig({ ...settings, NODE_ENV: 'development' }, { rootDir });
    assert.equal(config.mongoDatabase, settings.MONGODB_DATABASE);
    assert.throws(() => loadConfig({ NODE_ENV: 'production' }, { rootDir }));
    assert.throws(() =>
      loadConfig({
        ...settings,
        NODE_ENV: 'production',
        APP_ORIGIN: 'https://example.test',
        MAIL_MODE: 'file',
      }),
    );
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});
