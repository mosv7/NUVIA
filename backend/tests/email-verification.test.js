const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { setTimeout: delay } = require('node:timers/promises');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryReplSet } = require('mongodb-memory-server-core');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'synthetic-email-verification-test-secret-at-least-32-characters';
process.env.APP_ORIGIN = 'http://127.0.0.1:5173';
process.env.MAIL_MODE = 'file';
const app = require('../app');
const { BusinessOwner } = require('../src/models');
const password = 'SyntheticPassword123';
let replica;
let mailbox;

before(async () => {
  mailbox = await fs.mkdtemp(path.join(os.tmpdir(), 'nuvia-verification-mail-'));
  process.env.MAIL_FILE_DIRECTORY = mailbox;
  replica = await MongoMemoryReplSet.create({
    binary: { version: '7.0.24' },
    replSet: { count: 1 },
  });
  await mongoose.connect(replica.getUri(), { dbName: 'isolated_verification_tests' });
  await BusinessOwner.init();
});

after(async () => {
  await mongoose.disconnect();
  await replica?.stop();
  if (mailbox) await fs.rm(mailbox, { recursive: true, force: true });
});

function register(email) {
  return request(app)
    .post('/api/auth/register')
    .send({ name: 'Synthetic Owner', email, password, passwordConfirmation: password });
}

async function mailTokens(email, route = 'verify-email') {
  const messages = await Promise.all(
    (await fs.readdir(mailbox)).map(async (file) => {
      const text = await fs.readFile(path.join(mailbox, file), 'utf8');
      return text ? JSON.parse(text) : null;
    }),
  );
  return messages
    .filter((message) => message?.to === email)
    .map((message) =>
      message.text
        .split('\n')
        .find(
          (line) =>
            line.startsWith(process.env.APP_ORIGIN) && line.includes('#/' + route + '?token='),
        ),
    )
    .filter(Boolean)
    .map((link) => new URLSearchParams(new URL(link).hash.split('?')[1]).get('token'));
}

async function waitForMail(email, count = 1) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const tokens = await mailTokens(email);
    if (tokens.length >= count) return tokens;
    await delay(25);
  }
  assert.fail('Verification message missing from the isolated mailbox');
}

const verify = (token) => request(app).post('/api/auth/verify-email').send({ token });
const resend = (email) => request(app).post('/api/auth/resend-verification').send({ email });

test('signup signs in automatically and sends one-use verification for the current address', async () => {
  const email = 'signup@example.test';
  const signup = await register(email).expect(201);
  assert.ok(signup.headers['set-cookie'].some((cookie) => cookie.startsWith('nuvia_auth=')));
  assert.equal(signup.body.data.user.emailVerified, false);
  const [token] = await waitForMail(email);
  assert.match(token, /^[a-f0-9]{64}$/);
  const stored = await BusinessOwner.findOne({ email }).select('+emailVerification').lean();
  assert.equal(
    stored.emailVerification.tokenHash,
    createHash('sha256').update(token).digest('hex'),
  );
  const profile = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${signup.body.data.token}`)
    .expect(200);
  assert.equal(profile.body.data.emailVerification, undefined);
  const results = await Promise.all([verify(token), verify(token)]);
  assert.deepEqual(results.map((result) => result.status).sort(), [200, 400]);
  assert.ok(results.every((result) => !result.headers['set-cookie']));
  const session = await request(app)
    .get('/api/auth/session')
    .set('Cookie', signup.headers['set-cookie'])
    .expect(200);
  assert.equal(session.body.user.emailVerified, true);
});

test('verification rejects expired links and proof for a previous current address', async () => {
  const expiredEmail = 'expired@example.test';
  const oldEmail = 'old@example.test';
  await register(expiredEmail).expect(201);
  await register(oldEmail).expect(201);
  const [expiredToken] = await waitForMail(expiredEmail);
  const [oldToken] = await waitForMail(oldEmail);
  await BusinessOwner.updateOne(
    { email: expiredEmail },
    { $set: { 'emailVerification.expiresAt': new Date(0) } },
  );
  await BusinessOwner.updateOne({ email: oldEmail }, { $set: { email: 'new@example.test' } });
  await verify(expiredToken).expect(400);
  await verify(oldToken).expect(400);
  assert.equal((await BusinessOwner.findOne({ email: 'new@example.test' })).emailVerified, false);
});

test('resend accepts existing and unknown addresses equally, enforces cooldown and supersedes links', async () => {
  const email = 'resend@example.test';
  const signup = await register(email).expect(201);
  const [firstToken] = await waitForMail(email);
  const withinCooldown = await resend(email).expect(202);
  const unknown = await resend('unknown@example.test').expect(202);
  assert.deepEqual(unknown.body, withinCooldown.body);
  await delay(100);
  assert.deepEqual(await mailTokens(email), [firstToken]);
  await BusinessOwner.updateOne(
    { _id: signup.body.data.user.id },
    { $set: { 'emailVerification.requestedAt': new Date(0) } },
  );
  await Promise.all([resend(email).expect(202), resend(email).expect(202)]);
  const nextTokens = await waitForMail(email, 2);
  const newest = nextTokens.find((token) => token !== firstToken);
  await verify(firstToken).expect(400);
  await verify(newest).expect(200);
  assert.equal((await mailTokens(email)).length, 2);
});

test('signup remains available and resend is uniformly unavailable without mail configuration', async () => {
  delete process.env.MAIL_MODE;
  delete process.env.SMTP_HOST;
  delete process.env.MAIL_FROM;
  try {
    const email = 'mail-unavailable@example.test';
    const signup = await register(email).expect(201);
    assert.equal(signup.body.data.user.emailVerificationAvailable, false);
    assert.equal(signup.body.data.user.emailVerified, false);
    const existing = await resend(email).expect(503);
    const unknown = await resend('unknown@example.test').expect(503);
    assert.deepEqual(unknown.body, existing.body);
  } finally {
    process.env.MAIL_MODE = 'file';
  }
});

test('email change and signup verification can complete concurrently without keeping stale proofs', async () => {
  const oldEmail = 'verification-and-change@example.test';
  const newEmail = 'verification-and-change-new@example.test';
  const signup = await register(oldEmail).expect(201);
  const [signupToken] = await waitForMail(oldEmail);
  await request(app)
    .post('/api/settings/security/email')
    .set('Authorization', 'Bearer ' + signup.body.data.token)
    .send({ newEmail, currentPassword: password })
    .expect(200);
  const [changeToken] = await mailTokens(newEmail, 'confirm-email');
  assert.ok(changeToken);

  const [changed, verified] = await Promise.all([
    request(app).post('/api/auth/confirm-email').send({ token: changeToken }),
    verify(signupToken),
  ]);
  assert.equal(changed.status, 200);
  assert.ok([200, 400].includes(verified.status));
  const owner = await BusinessOwner.findById(signup.body.data.user.id)
    .select('+emailVerification')
    .lean();
  assert.equal(owner.email, newEmail);
  assert.equal(owner.emailVerified, true);
  assert.equal(owner.emailVerification, undefined);
  await verify(signupToken).expect(400);
});
