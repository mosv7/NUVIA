import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import { createServer } from 'vite';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';
const require = createRequire(new URL('../../backend/package.json', import.meta.url));
export async function startConnectedFixture() {
  let replica, mongoose, api, web;
  const mailDirectory = await mkdtemp(join(tmpdir(), 'nuvia-browser-mail-'));
  const close = async () => {
    await web?.close();
    if (api) {
      api.closeAllConnections();
      await new Promise((done) => api.close(done));
    }
    await mongoose?.disconnect();
    await replica?.stop();
    await rm(mailDirectory, { recursive: true, force: true });
  };
  try {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'synthetic-browser-jwt-secret-'.repeat(3);
    process.env.MAIL_MODE = 'file';
    process.env.MAIL_FILE_DIRECTORY = mailDirectory;
    const binary = resolve('.local/tools/mongod.exe');
    replica = await MongoMemoryReplSet.create({
      binary: { version: '7.0.24', ...(existsSync(binary) ? { systemBinary: binary } : {}) },
      replSet: { count: 1, storageEngine: 'wiredTiger' },
    });
    mongoose = require('mongoose');
    await mongoose.connect(replica.getUri(), { dbName: `nuvia_test_${randomUUID()}` });
    await Promise.all(Object.values(require('./src/models')).map((model) => model.init()));
    api = require('./app').listen(0, '127.0.0.1');
    await new Promise((done, reject) => {
      api.once('listening', done);
      api.once('error', reject);
    });
    web = await createServer({
      root: resolve('apps/web'),
      configFile: resolve('apps/web/vite.config.js'),
      configLoader: 'runner',
      logLevel: 'error',
      server: {
        host: '127.0.0.1',
        port: 0,
        strictPort: false,
        proxy: {
          '/api': { target: `http://127.0.0.1:${api.address().port}`, changeOrigin: false },
        },
      },
    });
    await web.listen();
    const origin = `http://127.0.0.1:${web.httpServer.address().port}`;
    process.env.APP_ORIGIN = origin;
    process.env.FRONTEND_URL = origin;
    return { origin, deps: { config: { mailDirectory } }, close };
  } catch (error) {
    await close();
    throw error;
  }
}
