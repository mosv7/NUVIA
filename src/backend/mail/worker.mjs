import { decryptPayload } from './crypto.mjs';
import { createMailAdapter } from './adapters.mjs';
import { randomUUID } from 'node:crypto';
export async function deliverPendingMail(
  deps,
  { limit = 10, adapter = createMailAdapter(deps.config) } = {},
) {
  const jobs = deps.db.collection('mail_outbox');
  await jobs.updateMany(
    { expiresAt: { $lte: deps.now() } },
    { $set: { status: 'expired' }, $unset: { payload: '' } },
  );
  const result = { sent: 0, failed: 0 };
  for (let i = 0; i < limit; i++) {
    const leaseId = randomUUID();
    const job = await jobs.findOneAndUpdate(
      {
        expiresAt: { $gt: deps.now() },
        attempts: { $lt: 3 },
        $or: [
          { status: 'pending', nextAttemptAt: { $lte: deps.now() } },
          { status: 'sending', leaseUntil: { $lte: deps.now() } },
        ],
      },
      {
        $set: { status: 'sending', leaseId, leaseUntil: new Date(deps.now().getTime() + 60000) },
        $inc: { attempts: 1 },
      },
      { sort: { createdAt: 1 }, returnDocument: 'after' },
    );
    if (!job) break;
    const match = { _id: job._id, status: 'sending', leaseId };
    try {
      const current = await deps.db.collection('auth_tokens').findOne({
        userId: job.userId,
        purpose: job.kind,
        digest: job.tokenDigest,
        expiresAt: { $gt: deps.now() },
      });
      const user = await deps.db.collection('users').findOne({ _id: job.userId });
      if (!current || !user || !job.payload) {
        await jobs.updateOne(match, {
          $set: { status: 'expired' },
          $unset: { payload: '', leaseUntil: '' },
        });
        continue;
      }
      const { token } = decryptPayload(job.payload, deps.config.mailKey);
      const verify = job.kind === 'verify',
        ar = user.locale === 'ar';
      const link = `${deps.config.appOrigin}/#/${verify ? 'verify-email' : 'reset'}?token=${encodeURIComponent(token)}`;
      const subject = verify
        ? ar
          ? 'تأكيد بريد NUVIA'
          : 'Verify your NUVIA email'
        : ar
          ? 'إعادة تعيين كلمة مرور NUVIA'
          : 'Reset your NUVIA password';
      await adapter.send({
        id: job._id,
        to: user.email,
        subject,
        text: `${subject}\n${link}\n${ar ? 'تجاهل الرسالة إذا لم تطلبها.' : 'Ignore this message if you did not request it.'}`,
      });
      await jobs.updateOne(match, {
        $set: { status: 'sent', sentAt: deps.now() },
        $unset: { payload: '', leaseUntil: '' },
      });
      result.sent++;
    } catch {
      await jobs.updateOne(match, {
        $set: {
          status: job.attempts >= 3 ? 'failed' : 'pending',
          errorCode: 'DELIVERY_FAILED',
          nextAttemptAt: new Date(deps.now().getTime() + 60000 * 2 ** (job.attempts - 1)),
        },
        $unset: { leaseUntil: '' },
      });
      result.failed++;
    }
  }
  return result;
}
