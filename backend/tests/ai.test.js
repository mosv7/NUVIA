const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryReplSet } = require('mongodb-memory-server-core');
const { callService } = require('../src/integrations/ai-service/client');
const { validateOutput } = require('../src/integrations/ai-service/contracts');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'ai-isolated-secret-at-least-thirty-two-characters';
process.env.APP_ORIGIN = 'http://127.0.0.1:5173';
process.env.AI_SERVICE_TOKEN = 's'.repeat(32);
const app = require('../app');
let replica, upstream, base;
let mode = 'capabilities';
let calls = 0;
const capabilities = {
  schema_version: '1',
  capabilities: Object.fromEntries(
    ['analyze', 'summaries', 'reports', 'survey-suggestions', 'answers'].map((operation) => [
      operation,
      { ready: false, reason: 'unassessed', models: ['fixture'], profile: 'a'.repeat(64) },
    ]),
  ),
};

before(async () => {
  const candidate = path.resolve(__dirname, '../../.local/tools/mongod.exe');
  replica = await MongoMemoryReplSet.create({
    binary: { version: '7.0.24', ...(fs.existsSync(candidate) ? { systemBinary: candidate } : {}) },
    replSet: { count: 1 },
  });
  await mongoose.connect(replica.getUri(), { dbName: 'isolated_ai_tests' });
  await Promise.all(Object.values(require('../src/models')).map((model) => model.init()));
  upstream = http.createServer(async (req, res) => {
    calls++;
    assert.equal(req.headers['x-ai-service-token'], process.env.AI_SERVICE_TOKEN);
    for await (const chunk of req) void chunk;
    if (mode === 'slow') {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    if (mode === 'redirect') return res.writeHead(302, { Location: base }).end();
    res.setHeader('Content-Type', 'application/json');
    if (mode === 'failure') return res.writeHead(503).end('{"error":{"code":"secret-path"}}');
    res.end(JSON.stringify(mode === 'malformed' ? { surprise: 'private' } : capabilities));
  });
  await new Promise((resolve) => upstream.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${upstream.address().port}`;
  process.env.AI_SERVICE_URL = base;
});
after(async () => {
  await mongoose.disconnect();
  if (replica) await replica.stop();
  if (upstream) {
    upstream.closeAllConnections();
    await new Promise((resolve) => upstream.close(resolve));
  }
});

async function owner(email, setup = true) {
  const agent = request.agent(app);
  const session = await agent.get('/api/auth/session');
  const csrf = session.body.csrfToken;
  const mutate = (url, body) =>
    agent.post(url).set('Origin', process.env.APP_ORIGIN).set('X-CSRF-Token', csrf).send(body);
  const registration = await mutate('/api/auth/register', {
    name: 'AI Owner',
    email,
    password: 'SyntheticPassword123',
    passwordConfirmation: 'SyntheticPassword123',
    preferredLanguage: 'en',
  }).expect(201);
  if (setup) {
    await agent
      .put('/api/onboarding/business')
      .set('Origin', process.env.APP_ORIGIN)
      .set('X-CSRF-Token', csrf)
      .send({ name: 'AI Cafe', type: 'restaurant' })
      .expect(200);
  }
  // Onboarding may rotate credentials; use the current browser session as canonical.
  return { agent, mutate, token: registration.body.data.token };
}

test('AI routes require current owner business, browser CSRF and active device', async () => {
  await request(app).get('/api/ai/capabilities').expect(401);
  const pending = await owner('pending-ai@example.test', false);
  await pending.agent.get('/api/ai/capabilities').expect(409);
  const account = await owner('owner-ai@example.test');
  mode = 'capabilities';
  const response = await account.agent.get('/api/ai/capabilities').expect(200);
  assert.equal(response.body.data.capabilities.analyze.reason, 'unassessed');
  const previous = calls;
  await account.agent
    .post('/api/ai/analyze')
    .send({ texts: [{ id: 'a', text: 'Good' }] })
    .expect(403);
  await account
    .mutate('/api/ai/analyze', {
      texts: [{ id: 'a', text: 'Good' }],
      businessId: 'foreign',
    })
    .expect(400);
  await account
    .mutate('/api/ai/analyze', {
      texts: [{ id: 'a', text: 'Good', ownerId: 'foreign' }],
    })
    .expect(400);
  assert.equal(calls, previous);
  await account.mutate('/api/auth/logout', {}).expect(204);
  await request(app)
    .get('/api/ai/capabilities')
    .set('Authorization', `Bearer ${account.token}`)
    .expect(401);
});

test('body byte limits and malformed upstream never leak internal output', async () => {
  const account = await owner('validation-ai@example.test');
  const large = JSON.stringify({ texts: [{ id: 'a', text: 'x' }] }) + ' '.repeat(65536);
  await account.agent
    .post('/api/ai/analyze')
    .set('Authorization', `Bearer ${account.token}`)
    .set('Content-Type', 'application/json')
    .send(large)
    .expect(413);
  mode = 'malformed';
  const invalid = await account.agent.get('/api/ai/capabilities').expect(502);
  assert.ok(!JSON.stringify(invalid.body).includes('private'));
  mode = 'failure';
  const unavailable = await account.agent.get('/api/ai/capabilities').expect(503);
  assert.ok(!JSON.stringify(unavailable.body).includes('secret-path'));
  mode = 'capabilities';
});

test('transport refuses redirects and times out using a real local upstream', async () => {
  const config = { base, token: process.env.AI_SERVICE_TOKEN, timeout: 30 };
  mode = 'redirect';
  await assert.rejects(callService('capabilities', undefined, { config }), {
    code: 'AI_UPSTREAM_INVALID',
  });
  mode = 'slow';
  await assert.rejects(callService('capabilities', undefined, { config }), { code: 'AI_TIMEOUT' });
  mode = 'capabilities';
});

test('successful analysis preserves Unicode offsets and rejects invented mixed or foreign evidence', () => {
  const payload = { texts: [{ id: 'a', text: '🍕 food good service bad' }] };
  const result = {
    schema_version: '1',
    operation: 'analyze',
    request_id: '12345678-1234-1234-1234-123456789abc',
    provenance: {
      models: ['aspect', 'polarity'],
      profile: 'a'.repeat(64),
      prompt_version: 'extractive-v1',
      method_version: 'aspects-v1',
      scores: 'uncalibrated',
    },
    result: {
      items: [
        {
          id: 'a',
          sentiment: 'mixed',
          reason: null,
          method: 'aspect_derived',
          coverage: 'partial_aspects',
          contributing_ids: ['m0', 'm1'],
          excluded_count: 0,
          mentions: [
            {
              id: 'm0',
              text: 'food',
              start: 2,
              end: 6,
              sentiment: 'positive',
              score: 0.9,
              extraction_score: 0.95,
              accepted: true,
            },
            {
              id: 'm1',
              text: 'service',
              start: 12,
              end: 19,
              sentiment: 'negative',
              score: 0.9,
              extraction_score: 0.95,
              accepted: true,
            },
          ],
        },
      ],
    },
  };
  assert.equal(validateOutput('analyze', result, payload), true);
  result.result.items[0].sentiment = 'neutral';
  assert.equal(validateOutput('analyze', result, payload), false);
  result.result.items[0].sentiment = 'mixed';
  result.result.items[0].mentions[0].start = 3;
  assert.equal(validateOutput('analyze', result, payload), false);
});

test('authenticated owner rate limits are isolated and explicit Bearer works', async () => {
  const account = await owner('rate-ai@example.test');
  mode = 'failure';
  for (let i = 0; i < 30; i++) {
    await request(app)
      .post('/api/ai/analyze')
      .set('Authorization', `Bearer ${account.token}`)
      .send({ texts: [{ id: 'a', text: 'Good food' }] })
      .expect(503);
  }
  await request(app)
    .post('/api/ai/analyze')
    .set('Authorization', `Bearer ${account.token}`)
    .send({ texts: [{ id: 'a', text: 'Good food' }] })
    .expect(429);
  const second = await owner('rate-ai-other@example.test');
  await second.mutate('/api/ai/analyze', { texts: [{ id: 'a', text: 'Other food' }] }).expect(503);
  mode = 'capabilities';
});
