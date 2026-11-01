const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server-core');
const Response = require('../src/models/customerResponse.model');
const Branch = require('../src/models/branch.model');

let replica, server, app, calls, mode, entered, release, captured;
const oid = () => new mongoose.Types.ObjectId();
const service = () => require('../src/services/assistant.service');
function envelope(payload) {
  const source = payload.texts[0];
  const quote = source.text.split('\n')[0];
  return {
    schema_version: '1',
    operation: 'answers',
    request_id: '12345678-1234-1234-1234-123456789abc',
    provenance: {
      models: ['groq-test'],
      profile: 'a'.repeat(64),
      prompt_version: 'extractive-v1',
      method_version: 'aspects-v1',
      scores: 'uncalibrated',
      quality_status: 'baseline',
      quality_accepted: false,
      warnings: ['experimental_baseline', 'quality_not_accepted'],
    },
    result: { status: 'answered', items: [{ text: quote, citations: [{ id: source.id, quote }] }] },
  };
}
before(async () => {
  replica = await MongoMemoryReplSet.create({
    binary: { version: '7.0.24' },
    replSet: { count: 1 },
  });
  await mongoose.connect(replica.getUri(), { dbName: 'isolated_assistant_tests' });
  process.env.JWT_SECRET = 'assistant-isolated-test-secret-with-thirty-two-characters';
  process.env.APP_ORIGIN = 'http://127.0.0.1:5173';
  process.env.NODE_ENV = 'test';
  process.env.AI_SERVICE_TOKEN = 's'.repeat(32);
  server = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    captured = JSON.parse(Buffer.concat(chunks));
    calls += 1;
    assert.equal(req.headers['x-ai-service-token'], process.env.AI_SERVICE_TOKEN);
    if (mode === 'hold') {
      entered();
      await new Promise((resolve) => {
        release = resolve;
      });
    }
    if (mode === 'busy') {
      res.writeHead(429);
      res.end();
      return;
    }
    const result = envelope(captured);
    if (mode === 'forged') result.result.items[0].citations[0].id = 'foreign-id';
    if (mode === 'invented') result.result.items[0].text = 'invented narrative';
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  process.env.AI_SERVICE_URL = `http://127.0.0.1:${server.address().port}`;
  app = require('../app');
  await Promise.all(Object.values(require('../src/models')).map((model) => model.init()));
});
beforeEach(async () => {
  calls = 0;
  mode = 'valid';
  captured = null;
  await Promise.all([Response.deleteMany({}), Branch.deleteMany({})]);
});
after(async () => {
  server?.closeAllConnections();
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  if (replica) await replica.stop();
});
async function response(overrides = {}) {
  return Response.create({
    businessId: oid(),
    branchId: oid(),
    surveyId: oid(),
    number: 1,
    formVersion: 'a'.repeat(64),
    formSnapshot: { survey: {} },
    feedbackText: 'service was slow',
    language: 'en',
    ...overrides,
  });
}
async function signedIn() {
  const agent = request.agent(app);
  const session = await agent.get('/api/auth/session').expect(200);
  const mutate = (url, body) =>
    agent
      .post(url)
      .set('Origin', process.env.APP_ORIGIN)
      .set('X-CSRF-Token', session.body.csrfToken)
      .send(body);
  await mutate('/api/auth/register', {
    name: 'Synthetic Owner',
    email: `owner-${oid()}@example.test`,
    password: 'SyntheticPassword123',
    passwordConfirmation: 'SyntheticPassword123',
  }).expect(201);
  await agent.get('/api/ai/assistant/context').expect(409);
  const setup = await agent
    .put('/api/onboarding/business')
    .set('Origin', process.env.APP_ORIGIN)
    .set('X-CSRF-Token', session.body.csrfToken)
    .send({ name: 'Synthetic Cafe', type: 'restaurant' })
    .expect(200);
  return { agent, mutate, businessId: setup.body.data.business.id };
}
test('assistant routes require owner session, business, strict fields and browser CSRF', async () => {
  await request(app).get('/api/ai/assistant/context').expect(401);
  const { agent, mutate, businessId } = await signedIn();
  const own = await Branch.create({ businessId, name: 'Main' });
  const foreign = await Branch.create({ businessId: oid(), name: 'Foreign' });
  const context = await agent.get('/api/ai/assistant/context').expect(200);
  assert.deepEqual(context.body.data.branches, [{ id: String(own._id), name: 'Main' }]);
  assert.equal(context.headers['cache-control'], 'no-store');
  for (const query of [
    'unknown=x',
    'from=2026-02-30',
    'from=2026-10-02&to=2026-10-01',
    'from=2026-01-01&from=2026-01-02',
    'branchId[$ne]=x',
    'branchId=bad',
  ])
    await agent.get(`/api/ai/assistant/context?${query}`).expect(400);
  await agent.get(`/api/ai/assistant/context?branchId=${foreign._id}`).expect(404);
  await agent
    .post('/api/ai/assistant/answers')
    .send({ question: 'service?', locale: 'en' })
    .expect(403);
  for (const body of [
    { question: 4, locale: 'en' },
    { question: 'service?', locale: 'fr' },
    { question: 'service?', locale: 'en', texts: [] },
    { question: 'service?', locale: 'en', previousQuestion: [] },
    { question: 'service?', locale: 'en', from: '2026-02-30' },
    { question: ' '.repeat(3), locale: 'en' },
  ])
    await mutate('/api/ai/assistant/answers', body).expect(400);
  const empty = await mutate('/api/ai/assistant/answers', {
    question: 'service?',
    locale: 'en',
  }).expect(200);
  assert.equal(empty.body.data.status, 'insufficient_evidence');
  assert.equal(calls, 0);
});
test('metrics use the full owned UTC-day scope and distinguish accepted analysis from baseline or missing', async () => {
  const businessId = oid();
  const branch = await Branch.create({ businessId, name: 'Main' });
  const base = {
    businessId,
    branchId: branch._id,
    submittedAt: new Date('2026-10-10T23:59:59.999Z'),
  };
  await response({
    ...base,
    number: 1,
    analysis: {
      status: 'completed',
      overallSentiment: 'negative',
      provenance: { qualityStatus: 'accepted', qualityAccepted: true },
      aspects: [
        { name: 'Service', evidence: 'service', polarity: 'negative' },
        { name: 'Service', evidence: 'slow', polarity: 'negative' },
      ],
    },
  });
  await response({
    ...base,
    number: 2,
    analysis: {
      status: 'completed',
      overallSentiment: 'positive',
      provenance: { qualityStatus: 'baseline', qualityAccepted: false },
    },
  });
  await response({ ...base, number: 3, feedbackText: '', analysis: { status: 'skipped' } });
  await response({ ...base, number: 4, submittedAt: new Date('2026-10-11T00:00:00Z') });
  await response({ ...base, businessId: oid(), number: 1 });
  const { metrics } = await service().context(
    { businessId },
    { branchId: String(branch._id), from: '2026-10-10', to: '2026-10-10' },
  );
  assert.equal(metrics.totalResponses, 3);
  assert.equal(metrics.writtenResponses, 2);
  assert.equal(metrics.analysisStatuses.completed, 2);
  assert.equal(metrics.analysisStatuses.baseline, 1);
  assert.equal(metrics.analysisStatuses.accepted, 1);
  assert.equal(metrics.analysisStatuses.unaccepted, 2);
  assert.deepEqual(metrics.sentiments, { positive: 0, negative: 1, neutral: 0, mixed: 0 });
  assert.deepEqual(metrics.negativeAspects, [{ name: 'Service', count: 1 }]);
});
test('answers send only scoped relevant redacted excerpts and map validated citations', async () => {
  const own = await response({
    feedbackText:
      'Service was slow.\nPlease contact Sara Smith sara@example.test +20 100 123 4567.',
    respondent: { name: 'Sara Smith', email: 'sara@example.test' },
  });
  await response({
    businessId: own.businessId,
    number: 2,
    feedbackText: 'coffee tastes wonderful',
  });
  await response({ feedbackText: 'foreign service evidence' });
  const result = await service().answer(
    { businessId: own.businessId },
    { question: 'Service for Sara Smith sara@example.test +20 100 123 4567?', locale: 'en' },
  );
  assert.equal(result.status, 'answered');
  assert.equal(captured.texts.length, 1);
  assert.deepEqual(Object.keys(captured).sort(), ['locale', 'question', 'texts']);
  assert.match(captured.texts[0].id, /^e\d+$/);
  assert.ok(!JSON.stringify(captured).includes(String(own._id)));
  for (const privateText of ['Sara Smith', 'sara@example.test', '100 123 4567'])
    assert.ok(!JSON.stringify(captured).includes(privateText));
  assert.equal(result.items[0].citations[0].responseId, String(own._id));
  assert.equal(result.items[0].citations[0].number, 1);
  assert.equal(result.provenance.quality_accepted, false);
  assert.deepEqual(result.coverage, {
    candidateLimit: 500,
    candidatesScanned: 2,
    evidenceCount: 1,
    sampled: true,
  });
});
test('irrelevant questions do not send unrelated evidence, Arabic normalization and follow-up relevance work', async () => {
  const own = await response({ feedbackText: 'الخِدمة كانت بطيئة جدا 🍕' });
  let result = await service().answer(
    { businessId: own.businessId },
    { question: 'parking availability?', locale: 'en' },
  );
  assert.equal(result.status, 'insufficient_evidence');
  assert.equal(calls, 0);
  result = await service().answer(
    { businessId: own.businessId },
    { question: 'والسبب؟', previousQuestion: 'ماذا عن الخدمة؟', locale: 'ar' },
  );
  assert.equal(result.status, 'answered');
  assert.equal(result.items[0].text, own.feedbackText);
});
test('retrieval is capped to latest 500 candidates and ten Unicode-bounded excerpts while metrics cover all', async () => {
  const businessId = oid(),
    branchId = oid(),
    surveyId = oid();
  const docs = Array.from({ length: 505 }, (_, i) => ({
    businessId,
    branchId,
    surveyId,
    number: i + 1,
    formVersion: 'a'.repeat(64),
    formSnapshot: {},
    language: 'en',
    feedbackText: `service ${'🍕'.repeat(2100)}\n${i}`,
    submittedAt: new Date(1000 * i),
  }));
  await Response.insertMany(docs);
  const result = await service().answer({ businessId }, { question: 'service', locale: 'en' });
  assert.equal(result.metrics.totalResponses, 505);
  assert.equal(result.coverage.candidatesScanned, 500);
  assert.equal(result.coverage.evidenceCount, 10);
  assert.equal(captured.texts.length, 10);
  assert.ok(captured.texts.every(({ text }) => [...text].length <= 2000));
  assert.equal(result.items[0].citations[0].number, 505);
});
test('forged or invented answers and changed source ownership never become feedback links', async () => {
  const own = await response();
  const user = { businessId: own.businessId };
  for (const invalid of ['forged', 'invented']) {
    mode = invalid;
    await assert.rejects(service().answer(user, { question: 'service', locale: 'en' }), {
      status: 502,
    });
  }
  mode = 'hold';
  const waiting = new Promise((resolve) => {
    entered = resolve;
  });
  const pending = service().answer(user, { question: 'service', locale: 'en' });
  await waiting;
  await Response.updateOne({ _id: own._id }, { $set: { businessId: oid() } });
  release();
  await assert.rejects(pending, { status: 502 });
});
test('caller cancellation and busy upstream preserve safe errors', async () => {
  const own = await response();
  mode = 'busy';
  await assert.rejects(
    service().answer({ businessId: own.businessId }, { question: 'service', locale: 'en' }),
    { code: 'AI_BUSY', status: 429 },
  );
  mode = 'hold';
  const waiting = new Promise((resolve) => {
    entered = resolve;
  });
  const controller = new AbortController();
  const pending = service().answer(
    { businessId: own.businessId },
    { question: 'service', locale: 'en' },
    { signal: controller.signal },
  );
  await waiting;
  controller.abort();
  release();
  await assert.rejects(pending, { code: 'AI_CANCELLED', status: 499 });
});

test('EN/AR overview suggestions retrieve samples but privacy placeholders are never relevance terms', async () => {
  const own = await response({
    feedbackText: 'Service was slow.\nCustomer: Sara Smith',
    respondent: { name: 'Sara Smith' },
  });
  const user = { businessId: own.businessId };
  for (const question of [
    'Which aspect needs improvement?',
    'ما أكثر الشكاوى شيوعًا؟',
    'أي جانب يحتاج إلى تحسين؟',
  ]) {
    const result = await service().answer(user, { question, locale: 'ar' });
    assert.equal(result.status, 'answered', question);
    assert.equal(result.coverage.sampled, true);
  }
  const count = calls;
  const irrelevant = await service().answer(user, {
    question: 'parking for Sara Smith?',
    locale: 'en',
  });
  assert.equal(irrelevant.status, 'insufficient_evidence');
  assert.equal(calls, count);
});

test('a browser session revoked during inference cannot receive a stale private result', async () => {
  const { agent, mutate, businessId } = await signedIn();
  await response({ businessId });
  mode = 'hold';
  const waiting = new Promise((resolve) => {
    entered = resolve;
  });
  const pending = mutate('/api/ai/assistant/answers', { question: 'service', locale: 'en' }).then(
    (result) => result,
  );
  await waiting;
  await agent
    .post('/api/auth/logout')
    .set('Origin', process.env.APP_ORIGIN)
    .set('X-CSRF-Token', (await agent.get('/api/auth/session')).body.csrfToken)
    .send({})
    .expect(204);
  release();
  const result = await pending;
  assert.equal(result.status, 401);
  assert.equal(result.body.data, undefined);
});

test('legitimate citations can contain privacy markers without leaking raw respondent details', async () => {
  const own = await response({
    feedbackText: 'Service for Sara Smith sara@example.test +20 100 123 4567 was slow.',
    respondent: { name: 'Sara Smith' },
  });
  const result = await service().answer(
    { businessId: own.businessId },
    { question: 'service', locale: 'en' },
  );
  assert.equal(result.status, 'answered');
  assert.match(result.items[0].citations[0].quote, /\[redacted\]/u);
  assert.ok(!JSON.stringify(result).includes('Sara Smith'));
  assert.ok(!JSON.stringify(captured).includes('sara@example.test'));
});
