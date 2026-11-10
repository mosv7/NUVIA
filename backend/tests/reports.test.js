const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { randomUUID } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryReplSet } = require('mongodb-memory-server-core');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'reports-isolated-secret-at-least-thirty-two-characters';
process.env.APP_ORIGIN = 'http://127.0.0.1:5173';
process.env.AI_SERVICE_TOKEN = 'r'.repeat(32);

const app = require('../app');
const Business = require('../src/models/business.model');
const BusinessOwner = require('../src/models/businessOwner.model');
const CustomerResponse = require('../src/models/customerResponse.model');
const Survey = require('../src/models/survey.model');

let replica;
let upstream;
let base;
const received = [];

before(async () => {
  const candidate = path.resolve(__dirname, '../../.local/tools/mongod.exe');
  replica = await MongoMemoryReplSet.create({
    binary: { version: '7.0.24', ...(fs.existsSync(candidate) ? { systemBinary: candidate } : {}) },
    replSet: { count: 1 },
    instanceOpts: [{ launchTimeout: 60000 }],
  });
  await mongoose.connect(replica.getUri(), { dbName: 'isolated_reports_tests' });
  await Promise.all(Object.values(require('../src/models')).map((model) => model.init()));
  upstream = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    received.push(payload);
    const evidence = payload.texts[0];
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        schema_version: '1',
        operation: 'reports',
        request_id: randomUUID(),
        provenance: {
          models: ['fixture'],
          profile: 'a'.repeat(64),
          prompt_version: 'baseline-extractive-v2',
          method_version: 'aspects-v1',
          scores: 'uncalibrated',
          quality_status: 'baseline',
          quality_accepted: false,
          warnings: ['experimental_baseline', 'quality_not_accepted'],
        },
        result: {
          strengths: [],
          problems: [
            { text: evidence.text, citations: [{ id: evidence.id, quote: evidence.text }] },
          ],
          suggested_actions: [],
        },
      }),
    );
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

async function createOwner(email) {
  const agent = request.agent(app);
  const session = await agent.get('/api/auth/session');
  const csrf = session.body.csrfToken;
  const mutate = (url, body) =>
    agent.post(url).set('Origin', process.env.APP_ORIGIN).set('X-CSRF-Token', csrf).send(body);
  await mutate('/api/auth/register', {
    name: 'Reports Owner',
    email,
    password: 'SyntheticPassword123',
    passwordConfirmation: 'SyntheticPassword123',
    preferredLanguage: 'en',
  }).expect(201);
  await agent
    .put('/api/onboarding/business')
    .set('Origin', process.env.APP_ORIGIN)
    .set('X-CSRF-Token', csrf)
    .send({ name: 'Reports Cafe', type: 'restaurant' })
    .expect(200);
  const owner = await BusinessOwner.findOne({ email });
  const business = await Business.findOne({ ownerId: owner._id });
  return { mutate, owner, business };
}

test('report generation selects owner surveys, batches all feedback and preserves evidence links', async () => {
  const account = await createOwner('reports-owner@example.test');
  const input = { from: '2026-10-01', to: '2026-10-31', locale: 'en' };

  await account.mutate('/api/reports/generate', { ...input, businessId: 'untrusted' }).expect(400);
  await account.mutate('/api/reports/generate', input).expect(409);
  assert.equal(received.length, 0);

  const ownedSurvey = await Survey.create({
    businessId: account.business._id,
    name: 'Owner survey',
    status: 'live',
    shortCode: 'owner-report-survey',
    createdBy: account.owner._id,
  });
  const emptySurvey = await Survey.create({
    businessId: account.business._id,
    name: 'No feedback survey',
    shortCode: 'empty-report-survey',
    createdBy: account.owner._id,
  });
  const otherSurvey = await Survey.create({
    businessId: account.business._id,
    name: 'Other creator survey',
    shortCode: 'other-report-survey',
    createdBy: new mongoose.Types.ObjectId(),
  });

  const feedback = Array.from({ length: 11 }, (_, index) => ({
    businessId: account.business._id,
    surveyId: ownedSurvey._id,
    branchId: new mongoose.Types.ObjectId(),
    number: index + 1,
    formVersion: 'a'.repeat(64),
    formSnapshot: {},
    feedbackText: `Feedback ${index + 1}`,
    language: 'en',
    submittedAt: new Date(`2026-10-${String(index + 1).padStart(2, '0')}T12:00:00.000Z`),
  }));
  feedback.push(
    {
      ...feedback[0],
      surveyId: otherSurvey._id,
      number: 12,
      feedbackText: 'Not owned by this creator',
    },
    {
      ...feedback[0],
      number: 13,
      feedbackText: 'Outside the selected period',
      submittedAt: new Date('2026-09-30T12:00:00.000Z'),
    },
  );
  await CustomerResponse.create(feedback);

  const response = await account.mutate('/api/reports/generate', input).expect(200);
  const data = response.body.data;
  assert.deepEqual(data.period, { from: input.from, to: input.to });
  assert.equal(data.surveyCount, 1);
  assert.equal(data.reports[0].survey.id, String(ownedSurvey._id));
  assert.equal(data.reports[0].responseCount, 11);
  assert.equal(data.reports[0].analyzedTextCount, 11);
  assert.equal(data.reports[0].batches.length, 2);
  assert.deepEqual(
    data.reports[0].batches.map((batch) => batch.sources.length),
    [10, 1],
  );
  assert.deepEqual(data.skippedSurveys, [
    { id: String(emptySurvey._id), name: emptySurvey.name, reason: 'no_feedback' },
  ]);
  assert.deepEqual(
    received.map((batch) => batch.texts.length),
    [10, 1],
  );
  assert.ok(received.every((batch) => batch.locale === 'en'));

  const sourceIds = data.reports[0].batches.flatMap((batch) =>
    batch.sources.map((source) => source.feedbackId),
  );
  assert.equal(new Set(sourceIds).size, 11);
  assert.ok(
    data.reports[0].batches.every((batch) => batch.provenance.quality_status === 'baseline'),
  );
});
