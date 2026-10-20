import { randomUUID } from 'node:crypto';
import { encryptPayload } from './crypto.mjs';
export async function enqueueAuthMail({ userId, kind, token, expiresAt }, deps, session) {
  await deps.models.MailOutbox.updateMany(
    { userId, kind, status: { $in: ['pending', 'sending', 'failed'] } },
    { $set: { status: 'expired' }, $unset: { payload: '' } },
    { session },
  );
  await deps.models.MailOutbox.insertOne(
    {
      _id: randomUUID(),
      userId,
      kind,
      tokenDigest: (await import('../auth/sessions.mjs')).digest(token),
      payload: encryptPayload({ token }, deps.config.mailKey),
      expiresAt,
      status: 'pending',
      attempts: 0,
      createdAt: deps.now(),
      nextAttemptAt: deps.now(),
    },
    { session },
  );
}
