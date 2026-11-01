const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server-core');
const { runBatch } = require('../src/services/analysis.service');
const worker = require('../src/services/analysisWorker.service');
const Response = require('../src/models/customerResponse.model');
const feedback = require('../src/services/feedback.service');
let replica,
  server,
  mode = 'valid',
  received,
  release;
function envelope(texts) {
  return {
    schema_version: '1',
    operation: 'analyze',
    request_id: '12345678-1234-1234-1234-123456789abc',
    provenance: {
      models: ['aspect', 'polarity'],
      profile: 'a'.repeat(64),
      prompt_version: 'extractive-v1',
      method_version: 'aspects-v1',
      scores: 'uncalibrated',
      quality_status: 'baseline',
      quality_accepted: false,
      warnings: ['experimental_baseline', 'quality_not_accepted'],
    },
    result: {
      items: texts.map(({ id, text }) => ({
        id,
        sentiment: 'positive',
        reason: null,
        method: 'aspect_derived',
        coverage: 'partial_aspects',
        contributing_ids: ['m0'],
        excluded_count: 0,
        mentions: [
          {
            id: 'm0',
            text: [...text].slice(0, 4).join(''),
            start: 0,
            end: 4,
            sentiment: 'positive',
            score: 0.9,
            extraction_score: 0.95,
            accepted: true,
          },
        ],
      })),
    },
  };
}
before(async () => {
  replica = await MongoMemoryReplSet.create({
    binary: { version: '7.0.24' },
    replSet: { count: 1 },
  });
  await mongoose.connect(replica.getUri(), { dbName: 'isolated_feedback_tests' });
  await Response.init();
  process.env.AI_SERVICE_TOKEN = 's'.repeat(32);
  server = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const payload = JSON.parse(Buffer.concat(chunks));
    const result = envelope(payload.texts);
    if (mode === 'quality') result.provenance.quality_accepted = true;
    if (mode === 'duplicate') result.result.items.push(result.result.items[0]);
    if (mode === 'schema') delete result.schema_version;
    if (mode === 'partial') result.result.items[0].mentions[0].start = 1;
    if (mode === 'hold') {
      received();
      await new Promise((resolve) => {
        release = resolve;
      });
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  process.env.AI_SERVICE_URL = `http://127.0.0.1:${server.address().port}`;
});
beforeEach(async () => {
  worker.stop();
  mode = 'valid';
  await Response.deleteMany({});
});
after(async () => {
  worker.stop();
  server?.closeAllConnections();
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  if (replica) await replica.stop();
});
async function response(overrides = {}) {
  return Response.create({
    businessId: new mongoose.Types.ObjectId(),
    branchId: new mongoose.Types.ObjectId(),
    surveyId: new mongoose.Types.ObjectId(),
    number: 1,
    formVersion: 'a'.repeat(64),
    formSnapshot: { survey: {} },
    feedbackText: 'food good',
    language: 'en',
    analysis: { status: 'pending', requestedAt: new Date() },
    ...overrides,
  });
}
test('stored analysis rejects contradictory quality flags, duplicate ids and missing schema', async () => {
  for (const bad of ['quality', 'duplicate', 'schema']) {
    mode = bad;
    const [result] = await runBatch([
      { _id: new mongoose.Types.ObjectId(), feedbackText: 'food good' },
    ]);
    assert.equal(result.ok, false, bad);
  }
});
test('worker stores baseline provenance and source quotes without promoting quality', async () => {
  const doc = await response();
  assert.equal(await worker.tick(), 1);
  const stored = await Response.findById(doc._id).lean();
  assert.equal(stored.analysis.status, 'completed');
  assert.equal(stored.analysis.overallSentiment, 'positive');
  assert.equal(stored.analysis.provenance.qualityAccepted, false);
  assert.equal(stored.analysis.provenance.qualityStatus, 'baseline');
  assert.ok(stored.feedbackText.includes(stored.analysis.aspects[0].evidence));
});
test('an expired claim cannot overwrite a newer worker claim', async () => {
  const doc = await response();
  mode = 'hold';
  const entered = new Promise((resolve) => {
    received = resolve;
  });
  const pending = worker.tick();
  await entered;
  try {
    await Response.updateOne(
      { _id: doc._id },
      {
        $set: {
          'analysis.claimId': 'new-worker',
          'analysis.status': 'processing',
          'analysis.startedAt': new Date(),
        },
      },
    );
  } finally {
    release();
  }
  await pending;
  const stored = await Response.findById(doc._id).lean();
  assert.equal(stored.analysis.status, 'processing');
  assert.equal(stored.analysis.claimId, 'new-worker');
});
test('recovery uses the renewable lease instead of original start time', async () => {
  const doc = await response({
    analysis: {
      status: 'processing',
      startedAt: new Date(0),
      leaseUntil: new Date(Date.now() + 60000),
      claimId: 'live-worker',
    },
  });
  await worker.sweep();
  assert.equal((await Response.findById(doc._id)).analysis.status, 'processing');
  await Response.updateOne({ _id: doc._id }, { $set: { 'analysis.leaseUntil': new Date(0) } });
  await worker.sweep();
  assert.equal((await Response.findById(doc._id)).analysis.status, 'pending');
});
test('retry is owned, clears prior result and only one concurrent retry wins', async () => {
  const doc = await response({
    analysis: {
      status: 'failed',
      errorCode: 'INTERNAL',
      overallSentiment: 'negative',
      summary: 'old summary',
    },
  });
  await assert.rejects(feedback.retry({ businessId: new mongoose.Types.ObjectId() }, doc._id), {
    statusCode: 404,
  });
  const user = { businessId: doc.businessId, role: 'owner' };
  const outcomes = await Promise.allSettled([
    feedback.retry(user, doc._id),
    feedback.retry(user, doc._id),
  ]);
  assert.equal(outcomes.filter((r) => r.status === 'fulfilled').length, 1);
  const stored = await Response.findById(doc._id).lean();
  assert.equal(stored.analysis.status, 'pending');
  assert.equal(stored.analysis.overallSentiment, undefined);
  assert.equal(stored.analysis.summary, undefined);
});
test('feedback list search treats regex operators literally and business scope applies', async () => {
  const own = await response({ feedbackText: 'literal a+b' });
  await response({ feedbackText: 'literal a+b' });
  const result = await feedback.list(
    { businessId: own.businessId },
    { range: 'all', search: 'a+b' },
  );
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].id, String(own._id));
  await assert.rejects(feedback.getById({ businessId: new mongoose.Types.ObjectId() }, own._id), {
    statusCode: 404,
  });
});
test('partial analysis is a valid persisted lifecycle state', async () => {
  const doc = await response({ analysis: { status: 'partial' } });
  assert.equal(doc.analysis.status, 'partial');
});

test('long emoji/Arabic feedback keeps exact source offsets across AI requests', async () => {
  const text = '🍕 الأكل ممتاز '.repeat(450);
  const id = new mongoose.Types.ObjectId();
  const [result] = await runBatch([{ _id: id, feedbackText: text }]);
  assert.equal(result.ok, true);
  assert.equal(result.id, String(id));
  for (const aspect of result.analysis.aspects) {
    assert.equal([...text].slice(aspect.start, aspect.end).join(''), aspect.term);
    assert.ok(text.includes(aspect.evidence));
  }
});
test('a slow live claim renews its lease and survives recovery', async () => {
  process.env.AI_STALE_MS = '1000';
  const doc = await response();
  mode = 'hold';
  const entered = new Promise((resolve) => {
    received = resolve;
  });
  const pending = worker.tick();
  await entered;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1150));
    await worker.sweep();
    assert.equal((await Response.findById(doc._id)).analysis.status, 'processing');
  } finally {
    release();
    delete process.env.AI_STALE_MS;
    await pending;
  }
});
test('feedback routes require a session, enforce ownership and protect browser retries with CSRF', async () => {
  const request = require('supertest');
  process.env.JWT_SECRET = 'feedback-isolated-secret-at-least-thirty-two-characters';
  process.env.APP_ORIGIN = 'http://127.0.0.1:5173';
  process.env.NODE_ENV = 'test';
  const app = require('../app');
  await Promise.all(Object.values(require('../src/models')).map((model) => model.init()));
  await request(app).get('/api/feedbacks').expect(401);
  const agent = request.agent(app);
  const session = await agent.get('/api/auth/session').expect(200);
  const mutate = (method, url, body) =>
    agent[method](url)
      .set('Origin', process.env.APP_ORIGIN)
      .set('X-CSRF-Token', session.body.csrfToken)
      .send(body);
  await mutate('post', '/api/auth/register', {
    name: 'Feedback Owner',
    email: 'feedback@example.test',
    password: 'SyntheticPassword123',
    passwordConfirmation: 'SyntheticPassword123',
  }).expect(201);
  await agent.get('/api/feedbacks').expect(409);
  const setup = await mutate('put', '/api/onboarding/business', {
    name: 'Feedback Cafe',
    type: 'restaurant',
  }).expect(200);
  const doc = await response({
    businessId: setup.body.data.business.id,
    feedbackText: '=formula()',
    analysis: { status: 'failed' },
  });
  const foreign = await response();
  const list = await agent.get('/api/feedbacks?range=all').expect(200);
  assert.equal(list.body.data.items.length, 1);
  assert.equal(list.body.data.items[0].id, String(doc._id));
  await agent.get(`/api/feedbacks/${foreign._id}`).expect(404);
  await agent.get(`/api/feedbacks/${foreign._id}/analysis`).expect(404);
  await mutate('post', `/api/feedbacks/${foreign._id}/analysis/retry`, {}).expect(404);
  await agent.post(`/api/feedbacks/${doc._id}/analysis/retry`).send({}).expect(403);
  await agent.get('/api/feedbacks?page=bad').expect(400);
  await agent.get('/api/feedbacks?branchId=bad').expect(400);
  const csv = await agent.get('/api/feedbacks/export?range=all').expect(200);
  assert.ok(csv.text.includes("'=formula()"));
  await mutate('post', `/api/feedbacks/${doc._id}/analysis/retry`, {}).expect(202);
});
