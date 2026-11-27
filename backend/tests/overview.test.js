const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server-core');
const CustomerResponse = require('../src/models/customerResponse.model');
const Branch = require('../src/models/branch.model');
const Survey = require('../src/models/survey.model');

const oid = () => new mongoose.Types.ObjectId();
const origin = 'http://127.0.0.1:5173';
let replica, app, agent, businessId, branchId, surveyId;

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'analytics-fixture-secret-for-synthetic-tests-only';
  process.env.APP_ORIGIN = origin;
  app = require('../app');
  replica = await MongoMemoryReplSet.create({
    binary: { version: '7.0.24' },
    replSet: { count: 1 },
  });
  await mongoose.connect(replica.getUri(), { dbName: 'isolated_overview_tests' });
  await Promise.all(Object.values(require('../src/models')).map((model) => model.init()));
  agent = request.agent(app);
  const { body } = await agent.get('/api/auth/session').expect(200);
  const authorize = (call) => call.set('Origin', origin).set('X-CSRF-Token', body.csrfToken);
  await authorize(agent.post('/api/auth/register'))
    .send({
      name: 'Analytics Owner',
      email: 'analytics-owner@example.test',
      password: 'SyntheticPassword123',
      passwordConfirmation: 'SyntheticPassword123',
    })
    .expect(201);
  const setup = await authorize(agent.put('/api/onboarding/business'))
    .send({ name: 'Analytics Cafe', type: 'restaurant' })
    .expect(200);
  businessId = setup.body.data.business.id;
  branchId = (await Branch.create({ businessId, name: 'First' })).id;
  surveyId = (
    await Survey.create({ businessId, name: 'First survey', shortCode: 'analytics-test' })
  ).id;
});

after(async () => {
  await mongoose.disconnect();
  if (replica) await replica.stop();
});

test('credentialed browser responses use the configured application origin', async () => {
  await request(app)
    .get('/api/auth/session')
    .set('Origin', origin)
    .expect('Access-Control-Allow-Origin', origin)
    .expect('Access-Control-Allow-Credentials', 'true')
    .expect(200);
});

test('analytics counts submissions without presenting baseline sentiment or an invented completion rate', async () => {
  const fewHours = new Date('2026-10-27T20:00:00Z');
  const foreignId = oid();
  const aspect = { name: 'Service', evidence: 'Service', score: 0.8, polarity: 'positive' };
  const record = (number, qualityAccepted, owner = businessId) => ({
    businessId: owner,
    branchId,
    surveyId,
    number,
    formVersion: 'a'.repeat(64),
    formSnapshot: { survey: {} },
    feedbackText: 'Service',
    language: 'en',
    submittedAt: fewHours,
    analysis: {
      status: 'completed',
      overallSentiment: qualityAccepted ? 'mixed' : 'positive',
      aspects: [aspect],
      provenance: { qualityAccepted, qualityStatus: qualityAccepted ? 'accepted' : 'baseline' },
    },
  });
  await CustomerResponse.create([record(1, true), record(2, false), record(1, true, foreignId)]);
  await Survey.updateOne({ _id: surveyId }, { status: 'live' });
  const query = '?startDate=2026-10-27&endDate=2026-10-27';
  const metrics = (await agent.get('/api/overview/metrics' + query).expect(200)).body.data;
  assert.equal(metrics.totalResponses, 2);
  assert.equal(metrics.activeSurveys, 1);
  assert.equal(metrics.estimatedCompletionRate, null);
  const sentiment = (await agent.get('/api/overview/sentiment' + query).expect(200)).body.data;
  assert.equal(sentiment.totalAnalyzed, 1);
  assert.equal(sentiment.mixed.count, 1);
  assert.equal(sentiment.positive.count, 0);
  const aspects = (await agent.get('/api/analytics/aspect-score-comparison' + query).expect(200))
    .body.data;
  assert.equal(aspects.length, 1);
  assert.equal(aspects[0].mentions, 1);
  const trends = (await agent.get('/api/trends' + query).expect(200)).body.data;
  assert.equal(trends.selectedAspect, 'Service');
  assert.equal(trends.summary.latestWeeklyScore, 0.8);
  assert.equal(trends.weeklyBreakdown[0].totalResponses, 1);
  assert.equal(trends.signalsAndAnomalies.satisfactionForecast.status, 'Unavailable');
  const branches = (await agent.get('/api/branch-comparison' + query).expect(200)).body.data;
  assert.equal(branches.summary.responsesInSelectedBranches, 2);
  assert.equal(branches.summary.positiveSentimentGap, null);
  const aspectSummary = (await agent.get('/api/analytics/aspect-based' + query).expect(200)).body
    .data;
  assert.equal(aspectSummary.summary.totalAspectMentions, 1);
  const emptyAspect = (
    await agent
      .get('/api/analytics/aspect-sentiment-breakdown' + query + '&aspectName=Missing')
      .expect(200)
  ).body.data;
  assert.equal(emptyAspect.totalMentions, 0);
  const topics = (await agent.get('/api/topics' + query).expect(200)).body.data;
  assert.equal(topics.summary.mostFrequentTopic.name, 'Service');
  assert.equal(topics.summary.selectedComplaintCluster.name, null);
  assert.equal(topics.summary.selectedComplaintCluster.mentions, 0);
  const endpoints = [
    '/api/overview/trends',
    '/api/overview/aspect-scores',
    '/api/sentiment/summary',
    '/api/sentiment/trends',
    '/api/sentiment/responses',
    '/api/analytics/aspect-based',
    '/api/analytics/aspect-trend',
    '/api/analytics/aspect-feedbacks',
    '/api/analytics/aspect-sentiment-breakdown',
    '/api/topics',
    '/api/topics/details',
  ];
  for (const path of endpoints) await agent.get(path + query).expect(200);
});

test('connected analytics rejects invalid days and bounded trend ranges', async () => {
  await agent.get('/api/topics?endDate=2026-02-30').expect(400);
  await agent.get('/api/overview/trends?startDate=2020-01-01&endDate=2026-10-27').expect(400);
  await agent.get('/api/trends?branchId=invalid').expect(400);
  await agent.get('/api/sentiment/trends?startDate=2020-01-01&endDate=2026-10-27').expect(400);
});
