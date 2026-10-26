import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { createServer as createHttpServer } from 'node:http';
import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import { createServer as createViteServer } from 'vite';
import { createTestDatabase } from '../../apps/api/tests/helpers/database.mjs';
import { createApp } from '../../apps/api/src/app.mjs';
import { decryptPayload } from '../../apps/api/src/modules/mail/crypto.mjs';
import { mkdir, rm } from 'node:fs/promises';
const root = new URL('../../', import.meta.url);
const dbDirectory = new URL(`.local/proxy-test-${randomUUID()}/`, root);
const absolute = (url) => fileURLToPath(url);
let replica, deps, api, vite;
const checks = [];
const originalFetch = globalThis.fetch;
try {
  const dbPath = absolute(dbDirectory);
  await mkdir(dbPath, { recursive: true });
  replica = await MongoMemoryReplSet.create({
    binary: { version: '7.0.24', downloadDir: absolute(new URL('.local/mongodb-binaries/', root)) },
    instanceOpts: [{ dbPath }],
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });
  process.env.MONGODB_TEST_URI = replica.getUri();
  deps = await createTestDatabase();
  api = createHttpServer();
  await new Promise((resolve) => api.listen(0, '127.0.0.1', resolve));
  process.env.NUVIA_API_TARGET = `http://127.0.0.1:${api.address().port}`;
  const portProbe = createHttpServer();
  await new Promise((resolve) => portProbe.listen(0, '127.0.0.1', resolve));
  const webPort = portProbe.address().port;
  await new Promise((resolve, reject) =>
    portProbe.close((error) => (error ? reject(error) : resolve())),
  );
  vite = await createViteServer({
    root: absolute(new URL('apps/web/', root)),
    configFile: absolute(new URL('apps/web/vite.config.js', root)),
    server: { host: '127.0.0.1', port: webPort, strictPort: true },
    logLevel: 'silent',
  });
  await vite.listen();
  const origin = `http://127.0.0.1:${vite.httpServer.address().port}`;
  deps.config.appOrigin = origin;
  api.on('request', createApp(deps));
  const cookies = new Map();
  globalThis.fetch = async (input, options = {}) => {
    const headers = new Headers(options.headers);
    headers.set('Origin', origin);
    if (cookies.size) headers.set('Cookie', [...cookies].map(([k, v]) => `${k}=${v}`).join('; '));
    const response = await originalFetch(new URL(input, origin), { ...options, headers });
    for (const cookie of response.headers.getSetCookie()) {
      const [pair] = cookie.split(';');
      const split = pair.indexOf('=');
      cookies.set(pair.slice(0, split), pair.slice(split + 1));
    }
    return response;
  };
  const { authApi } = await import('../../apps/web/src/features/auth/api.js');
  const { workspaceApi } = await import('../../apps/web/src/features/workspaces/api.js');
  const account = {
    name: 'Synthetic delivery owner',
    email: 'delivery@example.test',
    password: 'Synthetic123',
    terms: true,
    locale: 'en',
  };
  await authApi.session();
  checks.push('real proxy session bootstrap');
  await authApi.register(account);
  checks.push('registration through Vite proxy');
  await assert.rejects(
    () => authApi.login({ email: account.email, password: account.password }),
    (e) => e.status === 403,
  );
  checks.push('unverified login rejected');
  const job = await deps.db
    .collection('mail_outbox')
    .findOne({ kind: 'verify', status: 'pending' });
  await authApi.verify(decryptPayload(job.payload, deps.config.mailKey).token);
  checks.push('single-use verification');
  await authApi.login({ email: account.email, password: account.password });
  assert.equal((await authApi.session()).user.email, account.email);
  checks.push('real verified login and cookie session');
  await workspaceApi.save({
    businessName: 'Synthetic business',
    industry: 'Cafe',
    locale: 'en',
    reportingTimezone: 'Africa/Cairo',
  });
  const workspace = await workspaceApi.completeSetup({
    branchType: 'multiple',
    branchName: 'Primary',
  });
  assert.equal(workspace.onboardingStep, 'complete');
  checks.push('persistent onboarding');
  await workspaceApi.createBranch(workspace.id, { name: 'Second' });
  const rows = await workspaceApi.branches(workspace.id);
  const list = Array.isArray(rows) ? rows : rows.branches;
  const second = list.find((b) => b.name === 'Second');
  assert.ok(second);
  checks.push('owner-scoped branch create and list');
  await workspaceApi.updateBranch(workspace.id, second.id, { name: 'Renamed' });
  await workspaceApi.updateBranch(workspace.id, second.id, { archived: true });
  checks.push('branch update and archive');
  await authApi.logout();
  assert.equal((await authApi.session()).user, null);
  checks.push('logout clears server session');

  console.log('PASS', checks.join('; '));
} finally {
  globalThis.fetch = originalFetch;
  await vite?.close();
  if (api) await new Promise((resolve) => api.close(resolve));
  await deps?.cleanup();
  await replica?.stop();
  await rm(dbDirectory, { recursive: true, force: true });
}
