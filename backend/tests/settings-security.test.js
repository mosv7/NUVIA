const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryReplSet } = require('mongodb-memory-server-core');
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'isolated-settings-security-secret-at-least-thirty-two-characters';
process.env.APP_ORIGIN = 'http://127.0.0.1:5173';
process.env.MAIL_MODE = 'file';
const app = require('../app');
const models = require('../src/models');
const { encrypt } = require('../src/utils/secretBox');
const totp = require('../src/utils/totp');
let replica, mailbox;
const password = 'SyntheticPassword123';
before(async () => {
  mailbox = fs.mkdtempSync(path.join(os.tmpdir(), 'nuvia-settings-mail-'));
  process.env.MAIL_FILE_DIRECTORY = mailbox;
  const binary = path.resolve(__dirname, '../../.local/tools/mongod.exe');
  replica = await MongoMemoryReplSet.create({
    binary: { version: '7.0.24', ...(fs.existsSync(binary) ? { systemBinary: binary } : {}) },
    replSet: { count: 1 },
  });
  await mongoose.connect(replica.getUri(), { dbName: 'isolated_settings_tests' });
  await Promise.all(Object.values(models).map((model) => model.init()));
});
after(async () => {
  await mongoose.disconnect();
  await replica?.stop();
  fs.rmSync(mailbox, { recursive: true, force: true });
});
async function browser(email) {
  const agent = request.agent(app);
  const { body } = await agent.get('/api/auth/session').expect(200);
  const mutate = (method, url, data) =>
    agent[method](url)
      .set('Origin', process.env.APP_ORIGIN)
      .set('X-CSRF-Token', body.csrfToken)
      .send(data);
  const registration = await mutate('post', '/api/auth/register', {
    name: 'Settings Owner',
    email,
    password,
    passwordConfirmation: password,
  }).expect(201);
  return { agent, mutate, token: registration.body.data.token, id: registration.body.data.user.id };
}
test('TOTP validates RFC 6238 vector, rejects replay and produces enrollment secrets', () => {
  const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
  assert.equal(totp.verifyCode(secret, '287082', { now: 59000 }), 1);
  assert.equal(totp.verifyCode(secret, '287082', { now: 59000, afterStep: 1 }), null);
  assert.equal(totp.verifyCode(secret, '000000', { now: 59000 }), null);
  assert.match(totp.generateSecret(), /^[A-Z2-7]{32}$/);
  assert.match(
    totp.buildOtpAuthUri({ secret, account: 'owner@example.test' }),
    /^otpauth:\/\/totp\//,
  );
});
test('settings persist owner data, enforce CSRF including binary avatars and isolate owners', async () => {
  const owner = await browser('settings@example.test');
  const other = await browser('other-settings@example.test');
  await owner
    .mutate('patch', '/api/settings/account', { name: 'Saved Owner', country: 'EG' })
    .expect(200);
  assert.equal((await owner.agent.get('/api/settings/account')).body.data.name, 'Saved Owner');
  assert.equal((await other.agent.get('/api/settings/account')).body.data.name, 'Settings Owner');
  await owner
    .mutate('put', '/api/settings/language', { displayLanguage: 'ar-EG', timeZone: 'UTC' })
    .expect(200);
  assert.equal((await owner.agent.get('/api/auth/session')).body.user.locale, 'ar');
  await owner
    .mutate('put', '/api/settings/notifications', { channels: { email: false } })
    .expect(200);
  assert.equal(
    (await owner.agent.get('/api/settings/notifications')).body.data.channels.email,
    false,
  );
  await owner
    .mutate('put', '/api/settings/notifications', { email: { unknown: true } })
    .expect(400);
  const image = Buffer.from('89504e470d0a1a0a00000000', 'hex');
  await owner.agent
    .put('/api/settings/avatar')
    .set('Content-Type', 'image/png')
    .send(image)
    .expect(403);
  const csrf = (await owner.agent.get('/api/auth/session')).body.csrfToken;
  await owner.agent
    .put('/api/settings/avatar')
    .set('Origin', process.env.APP_ORIGIN)
    .set('X-CSRF-Token', csrf)
    .set('Content-Type', 'image/png')
    .send(image)
    .expect(200);
  assert.deepEqual((await owner.agent.get('/api/settings/avatar').expect(200)).body, image);
  await other.agent.get('/api/settings/avatar').expect(404);
});
test('device revocation covers onboarding tokens, expired sessions and password changes', async () => {
  const owner = await browser('devices@example.test');
  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: 'devices@example.test', password })
    .expect(200);
  const token = login.body.data.token;
  const onboarding = await request(app)
    .put('/api/onboarding/business')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Device Cafe', type: 'restaurant' })
    .expect(200);
  const list = (await owner.agent.get('/api/settings/security/sessions').expect(200)).body.data;
  assert.equal(list.length, 2);
  const second = list.find((session) => !session.isCurrent);
  await owner.mutate('delete', `/api/settings/security/sessions/${second.id}`).expect(204);
  await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${onboarding.body.data.token}`)
    .expect(401);
  const newPassword = 'DifferentPassword123!';
  await owner
    .mutate('post', '/api/settings/security/password', {
      currentPassword: password,
      newPassword,
      confirmPassword: newPassword,
    })
    .expect(200);
  await owner.agent.get('/api/auth/me').expect(200);
  await request(app)
    .post('/api/auth/login')
    .send({ email: 'devices@example.test', password })
    .expect(401);
  const current = list.find((session) => session.isCurrent);
  await models.Session.updateOne({ _id: current.id }, { expiresAt: new Date(Date.now() - 1000) });
  await owner.agent.get('/api/auth/me').expect(401);
});
test('2FA challenges cannot authenticate, survive credential revocation or replay recovery codes', async () => {
  const owner = await browser('twofactor@example.test');
  const setup = await owner.mutate('post', '/api/settings/security/2fa/setup', {}).expect(200);
  assert.ok(setup.body.data.qrSvg.includes('<svg'));
  const recoveryCode = 'abcde-12345';
  await models.BusinessOwner.updateOne(
    { _id: owner.id },
    {
      $set: {
        'twoFactor.enabled': true,
        'twoFactor.secretEnc': encrypt('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'),
        'twoFactor.recoveryCodeHashes': [
          crypto.createHash('sha256').update(recoveryCode).digest('hex'),
        ],
      },
    },
  );
  const challenge = await request(app)
    .post('/api/auth/login')
    .send({ email: 'twofactor@example.test', password })
    .expect(200);
  assert.equal(challenge.body.data.requiresTwoFactor, true);
  assert.equal(challenge.headers['set-cookie'], undefined);
  await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${challenge.body.data.twoFactorToken}`)
    .expect(401);
  const complete = await request(app)
    .post('/api/auth/login/2fa')
    .send({ twoFactorToken: challenge.body.data.twoFactorToken, code: recoveryCode })
    .expect(200);
  assert.ok(complete.headers['set-cookie'].some((cookie) => cookie.includes('HttpOnly')));
  await request(app)
    .post('/api/auth/login/2fa')
    .send({ twoFactorToken: challenge.body.data.twoFactorToken, code: recoveryCode })
    .expect(401);
  await owner.mutate('post', '/api/settings/security/sessions/sign-out-all', {}).expect(204);
  await request(app)
    .post('/api/auth/login/2fa')
    .send({ twoFactorToken: challenge.body.data.twoFactorToken, code: 'abcde-12345' })
    .expect(401);
});
test('email confirmation is one-use, invalidates old credentials and sends canonical file links', async () => {
  const owner = await browser('old-email@example.test');
  await owner
    .mutate('post', '/api/settings/security/email', {
      newEmail: 'new-email@example.test',
      currentPassword: password,
    })
    .expect(200);
  const mail = fs
    .readdirSync(mailbox)
    .map((file) => JSON.parse(fs.readFileSync(path.join(mailbox, file), 'utf8')))
    .find((message) => message.to === 'new-email@example.test');
  const match = mail.text.match(/token=([a-f0-9]{64})/);
  assert.ok(mail.text.includes(process.env.APP_ORIGIN));
  const results = await Promise.all(
    [1, 2].map(() => request(app).post('/api/auth/confirm-email').send({ token: match[1] })),
  );
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 400]);
  await request(app).get('/api/auth/me').set('Authorization', `Bearer ${owner.token}`).expect(401);
  await request(app)
    .post('/api/auth/login')
    .send({ email: 'new-email@example.test', password })
    .expect(200);
});
test('2FA enrollment commits once when enable requests overlap', async () => {
  const owner = await browser('enable-race@example.test');
  await owner.mutate('post', '/api/settings/security/2fa/setup', {}).expect(200);
  const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
  await models.BusinessOwner.updateOne(
    { _id: owner.id },
    { 'twoFactor.pendingSecretEnc': encrypt(secret) },
  );
  const step = Math.floor(Date.now() / 30000);
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const digest = crypto.createHmac('sha1', '12345678901234567890').update(counter).digest();
  const code = String((digest.readUInt32BE(digest[19] & 15) & 0x7fffffff) % 1000000).padStart(
    6,
    '0',
  );
  const results = await Promise.all(
    [1, 2].map(() => owner.mutate('post', '/api/settings/security/2fa/enable', { code })),
  );
  assert.deepEqual(results.map((result) => result.status).sort(), [200, 409]);
});
test('authentication rejects sessionless tokens, suspended owners and stale business claims', async () => {
  const owner = await browser('scope-status@example.test');
  const { generateToken } = require('../src/utils/jwt');
  const legacy = generateToken({ id: owner.id, type: 'owner', role: 'owner' });
  await request(app).get('/api/auth/me').set('Authorization', `Bearer ${legacy}`).expect(401);
  await models.BusinessOwner.updateOne({ _id: owner.id }, { status: 'suspended' });
  await owner.agent.get('/api/auth/me').expect(401);
  await models.BusinessOwner.updateOne({ _id: owner.id }, { status: 'active' });
  const claims = require('../src/utils/jwt').verifyToken(owner.token);
  const forgedScope = generateToken({ ...claims, businessId: new mongoose.Types.ObjectId() });
  await request(app).get('/api/branches').set('Authorization', `Bearer ${forgedScope}`).expect(409);
});
