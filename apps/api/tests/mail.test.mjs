import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { encryptPayload, decryptPayload } from '../src/modules/mail/crypto.mjs';
import { deliverPendingMail } from '../src/modules/mail/worker.mjs';
import { createMailAdapter } from '../src/integrations/mail/adapters.mjs';
import { createTestDatabase } from './helpers/database.mjs';
import { registerOwner } from '../src/modules/auth/service.mjs';
test('mail encryption authenticates payload, nonce and key', () => {
  const key = Buffer.alloc(32, 1),
    payload = encryptPayload({ token: 'private token' }, key);
  assert.ok(!JSON.stringify(payload).includes('private token'));
  assert.equal(decryptPayload(payload, key).token, 'private token');
  assert.throws(() => decryptPayload(payload, Buffer.alloc(32, 2)));
  assert.throws(() =>
    decryptPayload({ ...payload, tag: Buffer.alloc(16).toString('base64') }, key),
  );
});
test('mail outbox retries failure and dispatches only current tokens to a private mailbox', async () => {
  const deps = await createTestDatabase();
  const directory = await mkdtemp(join(tmpdir(), 'nuvia-mail-'));
  try {
    const c = { ...deps.config, mailDirectory: directory };
    const d = { ...deps, config: c };
    await registerOwner(
      {
        name: 'Synthetic',
        email: 'mail@example.test',
        password: 'Synthetic123',
        locale: 'ar',
        terms: true,
      },
      d,
    );
    const failed = await deliverPendingMail(d, {
      adapter: {
        send: async () => {
          throw new Error('secret SMTP failure');
        },
      },
    });
    assert.equal(failed.failed, 1);
    const job = await deps.db.collection('mail_outbox').findOne();
    assert.ok(job.payload);
    assert.ok(!JSON.stringify(job).includes('secret SMTP'));
    const future = { ...d, now: () => new Date(Date.now() + 120000) };
    assert.equal((await deliverPendingMail(future)).sent, 1);
    const files = await readdir(directory);
    const message = JSON.parse(await readFile(join(directory, files[0]), 'utf8'));
    assert.ok(message.text.includes('#/verify-email?token='));
    assert.equal((await deps.db.collection('mail_outbox').findOne()).payload, undefined);
    assert.throws(() => createMailAdapter({ ...c, mode: 'production' }));
  } finally {
    await deps.cleanup();
    await rm(directory, { recursive: true, force: true });
  }
});
