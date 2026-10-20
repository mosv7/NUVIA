import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { repositoryRoot } from '../src/config/paths.mjs';
import { loadConfig } from '../src/config/env.mjs';

test('workspace configuration resolves the repository root independently of the package cwd', () => {
  const expected = fileURLToPath(new URL('../../../', import.meta.url));
  const previous = process.cwd();
  try {
    process.chdir(resolve(expected, 'apps/api'));
    assert.equal(repositoryRoot, resolve(expected));
    const config = loadConfig({
      NODE_ENV: 'test',
      MONGODB_URI: 'mongodb://127.0.0.1:27017',
      MAIL_ENCRYPTION_KEY: 'a'.repeat(64),
    });
    assert.equal(config.mailDirectory, resolve(expected, '.local/mail'));
  } finally {
    process.chdir(previous);
  }
});
