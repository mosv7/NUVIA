import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { loadConfig } from '../../src/backend/config.mjs';
import { connectDatabase, ensureSchema } from '../../src/backend/database.mjs';
import { createApp } from '../../src/backend/app.mjs';
import { runAccountScenario } from './accounts.spec.mjs';
let replica, connection, apiServer, frontend, browser;
const mailDirectory = await mkdtemp(join(tmpdir(), 'nuvia-browser-mail-'));
try {
  const localBinary = resolve('.local/tools/mongod.exe');
  replica = await MongoMemoryReplSet.create({
    binary: {
      version: '7.0.24',
      ...(existsSync(localBinary) ? { systemBinary: localBinary } : {}),
    },
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });
  const config = loadConfig({
    NODE_ENV: 'test',
    MONGODB_URI: replica.getUri(),
    MONGODB_DATABASE: `nuvia_test_${randomUUID()}`,
    MAIL_ENCRYPTION_KEY: 'b'.repeat(64),
    MAIL_DIRECTORY: mailDirectory,
  });
  connection = await connectDatabase(config);
  await ensureSchema(connection.db);
  const deps = { ...connection, config, now: () => new Date() };
  apiServer = createApp(deps).listen(0, '127.0.0.1');
  await new Promise((done, reject) => {
    apiServer.once('listening', done);
    apiServer.once('error', reject);
  });
  frontend = await createServer({
    root: resolve('src/frontend'),
    configFile: resolve('src/frontend/vite.config.js'),
    configLoader: 'runner',
    server: {
      host: '127.0.0.1',
      port: 5188,
      strictPort: true,
      proxy: { '/api': `http://127.0.0.1:${apiServer.address().port}` },
    },
  });
  await frontend.listen();
  const origin = `http://127.0.0.1:${frontend.httpServer.address().port}`;
  config.appOrigin = origin;
  const executable =
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
    [
      'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    ].find(existsSync);
  browser = await chromium.launch({
    headless: true,
    ...(executable ? { executablePath: executable } : {}),
  });
  const output = resolve('test-results/accounts');
  await mkdir(output, { recursive: true });
  await runAccountScenario({ browser, origin, deps, output });
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
  await frontend?.close();
  if (apiServer) {
    apiServer.closeAllConnections();
    await new Promise((done) => apiServer.close(done));
  }
  await connection?.close();
  await replica?.stop();
  await rm(mailDirectory, { recursive: true, force: true });
}
