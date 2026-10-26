const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const os = require('node:os');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryReplSet } = require('mongodb-memory-server-core');

process.env.JWT_SECRET = 'isolated-tests-only-secret-at-least-thirty-two-characters';
process.env.APP_ORIGIN = 'http://127.0.0.1:5173';
process.env.NODE_ENV = 'test';
const app = require('../app');
let replica;
let mailbox;
before(async () => {
  mailbox = fs.mkdtempSync(path.join(os.tmpdir(), 'nuvia-backend-mail-test-'));
  process.env.MAIL_MODE = 'file';
  process.env.MAIL_FILE_DIRECTORY = mailbox;
  const candidate = path.resolve(__dirname, '../../.local/tools/mongod.exe');
  replica = await MongoMemoryReplSet.create({
    binary: { version: '7.0.24', ...(fs.existsSync(candidate) ? { systemBinary: candidate } : {}) },
    replSet: { count: 1 },
  });
  await mongoose.connect(replica.getUri(), { dbName: 'isolated_backend_tests' });
  await Promise.all(Object.values(require('../src/models')).map((model) => model.init()));
});
after(async () => {
  await mongoose.disconnect();
  if (replica) await replica.stop();
  if (mailbox) fs.rmSync(mailbox, { recursive: true, force: true });
});

const password = 'SyntheticPassword123';
async function browser(email) {
  const agent = request.agent(app);
  const session = await agent.get('/api/auth/session').expect(200);
  assert.equal(session.body.user, null);
  assert.ok(session.body.csrfToken);
  const mutate = (method, url, body) =>
    agent[method](url)
      .set('Origin', process.env.APP_ORIGIN)
      .set('X-CSRF-Token', session.body.csrfToken)
      .send(body);
  const registration = await mutate('post', '/api/auth/register', {
    name: 'Synthetic Owner',
    email,
    password,
    passwordConfirmation: password,
    preferredLanguage: 'ar',
  }).expect(201);
  assert.ok(registration.headers['set-cookie'].some((cookie) => cookie.includes('HttpOnly')));
  return { agent, mutate, token: registration.body.data.token, user: registration.body.data.user };
}

test('browser session persists onboarding, protects CSRF, and revokes logout tokens', async () => {
  const { agent, mutate, token } = await browser('owner@example.test');
  const current = await agent.get('/api/auth/session').expect(200);
  assert.equal(current.body.user.locale, 'ar');
  assert.equal(current.body.workspace, null);
  await agent
    .put('/api/onboarding/business')
    .send({ name: 'Unsafe', type: 'restaurant' })
    .expect(403);
  await agent
    .put('/api/onboarding/business')
    .set('Origin', 'https://foreign.example')
    .set('X-CSRF-Token', current.body.csrfToken)
    .send({ name: 'Unsafe', type: 'restaurant' })
    .expect(403);
  await mutate('put', '/api/onboarding/business', {
    name: 'Synthetic Cafe',
    type: 'restaurant',
  }).expect(200);
  await mutate('put', '/api/onboarding/setup', {
    hasMultipleBranches: true,
    primaryBranchName: 'Cairo',
  }).expect(200);
  await mutate('post', '/api/onboarding/complete', {}).expect(200);
  const saved = await agent.get('/api/auth/session').expect(200);
  assert.equal(saved.body.workspace.businessName, 'Synthetic Cafe');
  assert.equal(saved.body.workspace.onboardingStep, 'complete');
  assert.equal(saved.body.workspace.branches.length, 1);
  assert.equal(saved.body.workspace.primaryBranchId, saved.body.workspace.branches[0].id);
  await mutate('post', '/api/auth/logout', {}).expect(204);
  assert.equal((await agent.get('/api/auth/session')).body.user, null);
  await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`).expect(401);
  const fresh = await agent.get('/api/auth/session');
  await agent
    .post('/api/auth/login')
    .set('Origin', process.env.APP_ORIGIN)
    .set('X-CSRF-Token', fresh.body.csrfToken)
    .send({ email: 'owner@example.test', password: 'wrong' })
    .expect(401);
  await agent
    .post('/api/auth/login')
    .set('Origin', process.env.APP_ORIGIN)
    .set('X-CSRF-Token', fresh.body.csrfToken)
    .send({ email: 'owner@example.test', password })
    .expect(200);
  assert.ok((await agent.get('/api/auth/session')).body.user);
});

test('manual questions, templates, publishing, and foreign resource ownership', async () => {
  const owner = await browser('surveys@example.test');
  const other = await browser('other@example.test');
  for (const account of [owner, other]) {
    await account
      .mutate('put', '/api/onboarding/business', { name: account.user.email, type: 'other' })
      .expect(200);
    await account
      .mutate('put', '/api/onboarding/setup', { hasMultipleBranches: false })
      .expect(200);
  }
  const created = await owner.mutate('post', '/api/surveys', { name: 'Manual survey' }).expect(201);
  const id = created.body.data.id;
  await owner.mutate('post', `/api/surveys/${id}/publish`, {}).expect(422);
  const added = await owner
    .mutate('post', `/api/surveys/${id}/questions`, {
      type: 'short_text',
      questionTextEn: 'Any comments?',
      isRequired: false,
    })
    .expect(201);
  assert.equal(added.body.data.questionTextEn, 'Any comments?');
  await owner.mutate('post', `/api/surveys/${id}/publish`, {}).expect(200);
  await other.agent.get(`/api/surveys/${id}`).expect(404);
  await other.mutate('patch', `/api/surveys/${id}`, { name: 'Foreign edit' }).expect(404);
  await other.mutate('post', `/api/surveys/${id}/questions`, { type: 'rating' }).expect(404);
  const session = await owner.agent.get('/api/auth/session');
  await other.agent.get(`/api/branches/${session.body.workspace.branches[0].id}`).expect(404);
  const template = await owner
    .mutate('post', '/api/surveys', {
      name: 'Template survey',
      templateId: 'customer-experience',
      languages: ['ar', 'en'],
    })
    .expect(201);
  assert.equal(template.body.data.questions.length, 6);
  await owner.mutate('post', `/api/surveys/${template.body.data.id}/publish`, {}).expect(200);
  await owner.agent.get('/api/surveys/summary').expect(200);
});

test('password-reset token is single-use and invalidates existing cookie and bearer sessions', async () => {
  const { agent, mutate, token } = await browser('reset@example.test');
  const resetToken = crypto.randomBytes(32).toString('hex');
  const PasswordReset = require('../src/models/passwordReset.model');
  await PasswordReset.create({
    email: 'reset@example.test',
    tokenHash: crypto.createHash('sha256').update(resetToken).digest('hex'),
    expiresAt: new Date(Date.now() + 60000),
  });
  await mutate('post', '/api/auth/verify-reset-token', { token: resetToken }).expect(200);
  await mutate('post', '/api/auth/reset-password', {
    token: resetToken,
    password: 'ChangedPassword123',
    passwordConfirmation: 'ChangedPassword123',
  }).expect(200);
  assert.equal((await agent.get('/api/auth/session')).body.user, null);
  await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`).expect(401);
  await mutate('post', '/api/auth/reset-password', {
    token: resetToken,
    password,
    passwordConfirmation: password,
  }).expect(400);
});

test('existing explicit bearer clients work and expired credentials are rejected', async () => {
  const registration = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'CLI Owner',
      email: 'cli@example.test',
      password,
      passwordConfirmation: password,
    })
    .expect(201);
  const token = registration.body.data.token;
  await request(app)
    .put('/api/onboarding/business')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'CLI business', type: 'other' })
    .expect(200);
  await request(app).get('/api/branches').set('Authorization', `Bearer ${token}`).expect(200);
  const jwt = require('jsonwebtoken');
  const expired = jwt.sign(
    { id: registration.body.data.user.id, type: 'owner', role: 'owner', tokenVersion: 0 },
    process.env.JWT_SECRET,
    { expiresIn: -1 },
  );
  await request(app).get('/api/auth/me').set('Authorization', `Bearer ${expired}`).expect(401);
  const anonymous = await request(app)
    .get('/api/auth/session')
    .set('Cookie', `nuvia_auth=${expired}`)
    .expect(200);
  assert.equal(anonymous.body.user, null);
  await request(app)
    .post('/api/auth/login')
    .send({ email: 'missing@example.test', password })
    .expect(401);
});

test('file-mode recovery sends a working reset URL without exposing account existence', async () => {
  const { mutate, agent } = await browser('mail@example.test');
  const known = await mutate('post', '/api/auth/forgot-password', {
    email: 'mail@example.test',
  }).expect(200);
  const unknown = await mutate('post', '/api/auth/forgot-password', {
    email: 'unknown@example.test',
  }).expect(200);
  assert.deepEqual(known.body, unknown.body);
  const messages = fs
    .readdirSync(mailbox)
    .map((name) => JSON.parse(fs.readFileSync(path.join(mailbox, name), 'utf8')));
  const message = messages.find((item) => item.to === 'mail@example.test');
  assert.ok(message.text.includes(`${process.env.APP_ORIGIN}/#/reset?token=`));
  const token = message.text.match(/token=([a-f0-9]{64})/)[1];
  await mutate('post', '/api/auth/reset-password', {
    token,
    password: 'NewMailPassword123',
    passwordConfirmation: 'NewMailPassword123',
  }).expect(200);
  const session = await agent.get('/api/auth/session');
  assert.equal(session.body.user, null);
  await request(app)
    .post('/api/auth/login')
    .send({ email: 'mail@example.test', password })
    .expect(401);
  await request(app)
    .post('/api/auth/login')
    .send({ email: 'mail@example.test', password: 'NewMailPassword123' })
    .expect(200);
});

test('failed onboarding setup rolls back branch writes and reports failure', async () => {
  const { mutate, agent } = await browser('rollback@example.test');
  await mutate('put', '/api/onboarding/business', { name: 'Rollback Cafe', type: 'other' }).expect(
    200,
  );
  const Business = require('../src/models/business.model');
  const original = Business.prototype.save;
  Business.prototype.save = async function () {
    throw new Error('Synthetic failed business save');
  };
  try {
    const failure = await mutate('put', '/api/onboarding/setup', {
      hasMultipleBranches: true,
      primaryBranchName: 'Rollback Branch',
    }).expect(500);
    assert.equal(failure.body.message, 'Something went wrong, please try again');
  } finally {
    Business.prototype.save = original;
  }
  const state = await agent.get('/api/auth/session').expect(200);
  assert.equal(state.body.workspace.branches.length, 0);
  assert.equal(state.body.workspace.onboardingStep, 'branches');
});

test('concurrent archives preserve one active branch, its primary identity, and archived history', async () => {
  const { mutate, agent } = await browser('branch-race@example.test');
  await mutate('put', '/api/onboarding/business', {
    name: 'Concurrent Branch Cafe',
    type: 'other',
  }).expect(200);
  await mutate('put', '/api/onboarding/setup', { hasMultipleBranches: false }).expect(200);
  const created = await mutate('post', '/api/branches', {
    name: 'Second Branch',
    country: 'Egypt',
    city: 'Cairo',
    address: 'Synthetic Street',
  }).expect(201);
  const before = await agent.get('/api/auth/session').expect(200);
  const firstId = before.body.workspace.primaryBranchId;
  const secondId = created.body.data.id;
  const Branch = require('../src/models/branch.model');
  const originalSave = Branch.prototype.save;
  // Force overlap after the last-active check, exposing unprotected count/save races.
  Branch.prototype.save = async function (...args) {
    if (this.status === 'archived') await new Promise((resolve) => setTimeout(resolve, 40));
    return originalSave.apply(this, args);
  };
  let outcomes;
  try {
    outcomes = await Promise.all(
      [firstId, secondId].map((id) => mutate('post', `/api/branches/${id}/archive`, {})),
    );
  } finally {
    Branch.prototype.save = originalSave;
  }
  assert.deepEqual(outcomes.map((response) => response.status).sort(), [200, 409]);
  const branches = await agent.get('/api/branches?status=all').expect(200);
  const active = branches.body.data.filter((branch) => branch.status === 'active');
  const archived = branches.body.data.filter((branch) => branch.status === 'archived');
  assert.equal(active.length, 1);
  assert.equal(archived.length, 1);
  assert.ok(archived[0].archivedAt);
  const after = await agent.get('/api/auth/session').expect(200);
  assert.equal(after.body.workspace.primaryBranchId, active[0].id);
  assert.equal(after.body.workspace.branches.filter((branch) => branch.isPrimary).length, 1);
  await agent.get(`/api/branches/${archived[0].id}/history`).expect(200);
  await mutate('post', `/api/branches/${active[0].id}/archive`, {}).expect(409);
  await mutate('put', `/api/branches/${archived[0].id}`, {
    name: 'Cannot edit archive',
    country: 'Egypt',
    city: 'Cairo',
    address: 'Synthetic Street',
  }).expect(409);
});

test('failed branch creation rolls back the branch and multi-branch flag together', async () => {
  const { mutate, agent } = await browser('branch-rollback@example.test');
  await mutate('put', '/api/onboarding/business', {
    name: 'Branch Rollback Cafe',
    type: 'other',
  }).expect(200);
  await mutate('put', '/api/onboarding/setup', { hasMultipleBranches: false }).expect(200);
  const Business = require('../src/models/business.model');
  const originalSave = Business.prototype.save;
  Business.prototype.save = async function () {
    throw new Error('Synthetic failed branch flag save');
  };
  try {
    await mutate('post', '/api/branches', {
      name: 'Should roll back',
      country: 'Egypt',
      city: 'Cairo',
      address: 'Synthetic Street',
    }).expect(500);
  } finally {
    Business.prototype.save = originalSave;
  }
  const state = await agent.get('/api/auth/session').expect(200);
  assert.equal(state.body.workspace.branches.length, 1);
  assert.equal(state.body.workspace.branchType, 'single');
});
