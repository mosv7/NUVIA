import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTestDatabase } from './helpers/database.mjs';
import { createHttp } from './helpers/http.mjs';
import { decryptPayload } from '../../src/backend/mail/crypto.mjs';
import { createSession } from '../../src/backend/auth/sessions.mjs';
const owner = {
  name: 'Synthetic owner',
  email: 'owner@example.test',
  password: 'Synthetic123',
  terms: true,
  locale: 'en',
};
async function mailToken(deps, purpose = 'verify') {
  const job = await deps.db
    .collection('mail_outbox')
    .findOne({ kind: purpose, status: 'pending' }, { sort: { createdAt: -1 } });
  return decryptPayload(job.payload, deps.config.mailKey).token;
}
test('registration login logout require verified identity and never return secrets', async () => {
  const deps = await createTestDatabase();
  try {
    const http = createHttp(deps);
    const signup = await http.mutate('post', '/auth/register', owner, 201);
    assert.equal(signup.body.email, owner.email);
    assert.ok(!signup.text.includes(owner.password));
    await http.get('/workspace', 401);
    await http.mutate('post', '/auth/login', { email: owner.email, password: owner.password }, 403);
    await http.mutate('post', '/auth/register', { ...owner, email: ' OWNER@example.test ' }, 409);
    const token = await mailToken(deps);
    await http.mutate('post', '/auth/verify-email', { token });
    await http.mutate('post', '/auth/verify-email', { token }, 400);
    const invalid = await http.mutate(
      'post',
      '/auth/login',
      { email: owner.email, password: 'Bad12345' },
      401,
    );
    const unknown = await http.mutate(
      'post',
      '/auth/login',
      { email: 'unknown@example.test', password: 'Bad12345' },
      401,
    );
    assert.equal(invalid.body.error.code, unknown.body.error.code);
    const login = await http.mutate('post', '/auth/login', {
      email: owner.email,
      password: owner.password,
      remember: true,
    });
    assert.equal(login.body.user.emailVerified, true);
    assert.match(login.headers['set-cookie'][0], /Max-Age=2592000/);
    const session = await http.get('/auth/session');
    assert.equal(session.body.user.email, owner.email);
    assert.ok(!session.text.includes('credentialsVersion'));
    await http.mutate('post', '/auth/logout', {}, 204);
    assert.equal((await http.get('/auth/session')).body.user, null);
    const raw = await deps.db.collection('users').findOne({ email: owner.email });
    assert.ok(raw.passwordHash.startsWith('scrypt$'));
    assert.ok(
      !JSON.stringify(await deps.db.collection('auth_tokens').find().toArray()).includes(token),
    );
  } finally {
    await deps.cleanup();
  }
});
test('reset invalidates a session created from credentials read before the reset', async () => {
  const deps = await createTestDatabase();
  try {
    const http = createHttp(deps);
    await http.mutate('post', '/auth/register', owner, 201);
    await http.mutate('post', '/auth/verify-email', { token: await mailToken(deps) });
    const old = await deps.db.collection('users').findOne();
    await http.mutate('post', '/auth/forgot-password', { email: owner.email }, 202);
    await http.mutate('post', '/auth/reset-password', {
      token: await mailToken(deps, 'reset'),
      password: 'Changed123',
    });
    let raw;
    await createSession(
      {
        cookie: (_name, value) => {
          raw = value;
        },
      },
      { userId: old._id, credentialsVersion: old.credentialsVersion },
      deps,
    );
    await http.agent.get('/api/v1/workspace').set('Cookie', `nuvia_session=${raw}`).expect(401);
  } finally {
    await deps.cleanup();
  }
});
test('registration strict fields, duplicate concurrency and malformed requests', async () => {
  const deps = await createTestDatabase();
  try {
    const http = createHttp(deps);
    for (const patch of [
      { terms: false },
      { password: 'x' },
      { email: { $ne: '' } },
      { ownerUserId: 'forged' },
    ])
      await http.mutate('post', '/auth/register', { ...owner, ...patch }, 422);
    const results = await Promise.all(
      [createHttp(deps), createHttp(deps)].map((h) =>
        h.mutate('post', '/auth/register', owner, null),
      ),
    );
    assert.deepEqual(results.map((r) => r.status).sort(), [201, 409]);
    assert.equal(await deps.db.collection('users').countDocuments(), 1);
    assert.equal(await deps.db.collection('mail_outbox').countDocuments(), 1);
  } finally {
    await deps.cleanup();
  }
});
test('password recovery is single-use, expiring and revokes existing sessions', async () => {
  const deps = await createTestDatabase();
  try {
    const http = createHttp(deps);
    await http.mutate('post', '/auth/register', owner, 201);
    await http.mutate('post', '/auth/verify-email', { token: await mailToken(deps) });
    await http.mutate('post', '/auth/login', { email: owner.email, password: owner.password });
    const known = await http.mutate('post', '/auth/forgot-password', { email: owner.email }, 202);
    const unknown = await http.mutate(
      'post',
      '/auth/forgot-password',
      { email: 'unknown@example.test' },
      202,
    );
    assert.deepEqual(known.body, unknown.body);
    const token = await mailToken(deps, 'reset');
    const results = await Promise.all(
      [createHttp(deps), createHttp(deps)].map((h) =>
        h.mutate('post', '/auth/reset-password', { token, password: 'Replacement123' }, null),
      ),
    );
    assert.deepEqual(results.map((r) => r.status).sort(), [200, 400]);
    assert.equal((await http.get('/auth/session')).body.user, null);
    await http.mutate('post', '/auth/login', { email: owner.email, password: owner.password }, 401);
    await http.mutate('post', '/auth/login', { email: owner.email, password: 'Replacement123' });
    await http.mutate('post', '/auth/forgot-password', { email: owner.email }, 202);
    const expired = await mailToken(deps, 'reset');
    const future = new Date(Date.now() + 31 * 60 * 1000);
    const futureHttp = createHttp({ ...deps, now: () => future });
    await futureHttp.mutate(
      'post',
      '/auth/reset-password',
      { token: expired, password: 'Changed123' },
      400,
    );
  } finally {
    await deps.cleanup();
  }
});
test('verification resend invalidates previous token and expired verification is rejected', async () => {
  const deps = await createTestDatabase();
  try {
    const http = createHttp(deps);
    await http.mutate('post', '/auth/register', owner, 201);
    const old = await mailToken(deps);
    await http.mutate('post', '/auth/resend-verification', { email: owner.email }, 202);
    const current = await mailToken(deps);
    assert.notEqual(current, old);
    await http.mutate('post', '/auth/verify-email', { token: old }, 400);
    const futureHttp = createHttp({ ...deps, now: () => new Date(Date.now() + 25 * 3600000) });
    await futureHttp.mutate('post', '/auth/verify-email', { token: current }, 400);
  } finally {
    await deps.cleanup();
  }
});
