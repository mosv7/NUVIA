import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.mjs';
import { createTestDatabase } from './helpers/database.mjs';
import { createHttp } from './helpers/http.mjs';
test('sessions bootstrap is anonymous and CSRF blocks foreign or missing origins', async () => {
  const deps = await createTestDatabase();
  try {
    const app = createApp(deps),
      agent = request.agent(app);
    const first = await agent.get('/api/v1/auth/session').expect(200);
    assert.equal(first.body.user, null);
    assert.ok(first.body.csrfToken);
    assert.match(first.headers['set-cookie'][0], /HttpOnly/);
    assert.match(first.headers['set-cookie'][0], /SameSite=Lax/);
    assert.equal((await agent.get('/api/v1/auth/session')).body.csrfToken, first.body.csrfToken);
    for (const origin of [undefined, 'https://foreign.test']) {
      let req = agent.post('/api/v1/auth/logout').set('X-CSRF-Token', first.body.csrfToken);
      if (origin) req = req.set('Origin', origin);
      await req.expect(403);
    }
    await agent.post('/api/v1/auth/logout').set('Origin', deps.config.appOrigin).expect(403);
    await agent
      .post('/api/v1/auth/logout')
      .set('Origin', deps.config.appOrigin)
      .set('X-CSRF-Token', first.body.csrfToken)
      .expect(204);
    await agent.get('/api/v1/workspace').expect(401);
  } finally {
    await deps.cleanup();
  }
});
test('sessions reject expired records before TTL cleanup and production cookies are secure', async () => {
  const deps = await createTestDatabase();
  try {
    const http = createHttp(deps);
    await http.get('/auth/session');
    const session = await deps.db.collection('sessions').findOne();
    assert.equal(session.expiresAt.getTime() - session.createdAt.getTime(), 86400000);
    await deps.db.collection('sessions').updateMany({}, { $set: { expiresAt: new Date(0) } });
    await http.get('/auth/session');
    assert.equal(await deps.db.collection('sessions').countDocuments(), 2);
    const secure = createApp({
      ...deps,
      config: { ...deps.config, mode: 'production', appOrigin: 'https://example.test' },
    });
    const response = await request(secure).get('/api/v1/auth/session').expect(200);
    assert.match(response.headers['set-cookie'][0], /Secure/);
    await http.mutate(
      'post',
      '/auth/reset-password',
      { token: 'x'.repeat(40000), password: 'Synthetic123' },
      413,
    );
  } finally {
    await deps.cleanup();
  }
});
