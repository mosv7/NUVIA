import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import { readdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const flags = process.argv.slice(2);
if (flags.some((f) => !/^--test-name-pattern=.+$/.test(f)))
  throw new Error('Unsupported test option');
let replica;
try {
  let uri = process.env.MONGODB_TEST_URI;
  if (uri) {
    const dbName = new URL(uri).pathname.slice(1);
    if (dbName && !/^nuvia_test_[0-9a-f-]{36}$/.test(dbName))
      throw new Error('Refusing a non-test database URI');
  } else {
    const localBinary = resolve('.local/tools/mongod.exe');
    replica = await MongoMemoryReplSet.create({
      binary: {
        version: '7.0.24',
        ...(existsSync(localBinary) ? { systemBinary: localBinary } : {}),
      },
      replSet: { count: 1, storageEngine: 'wiredTiger' },
    });
    uri = replica.getUri();
  }
  const files = (await readdir('tests/backend'))
    .filter((f) => f.endsWith('.test.mjs'))
    .map((f) => `tests/backend/${f}`);
  const child = spawn(process.execPath, ['--test', '--test-concurrency=1', ...flags, ...files], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'test', MONGODB_TEST_URI: uri },
  });
  process.exitCode = await new Promise((resolve) => {
    child.on('exit', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  });
} finally {
  await replica?.stop();
}
