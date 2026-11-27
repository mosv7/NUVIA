const { createHash, randomBytes } = require('node:crypto');
const BusinessOwner = require('../models/businessOwner.model');
const { appOrigin } = require('../utils/browserSession');
const { mailDeliveryAvailable, sendMail } = require('../utils/mailer');

const expiryHours = 24;
const cooldownMs = 10 * 60 * 1000;
const hash = (token) => createHash('sha256').update(token).digest('hex');

async function sendVerification(email) {
  const now = new Date();
  const token = randomBytes(32).toString('hex');
  const tokenHash = hash(token);
  const expiresAt = new Date(now.getTime() + expiryHours * 60 * 60 * 1000);
  const url = new URL(appOrigin());
  url.hash = `/verify-email?token=${token}`;
  const owner = await BusinessOwner.findOneAndUpdate(
    {
      email,
      status: 'active',
      emailVerified: { $ne: true },
      $or: [
        { 'emailVerification.requestedAt': { $exists: false } },
        { 'emailVerification.requestedAt': { $lte: new Date(now.getTime() - cooldownMs) } },
      ],
    },
    { $set: { emailVerification: { email, tokenHash, expiresAt, requestedAt: now } } },
    { returnDocument: 'before' },
  )
    .select('email preferredLanguage +emailVerification')
    .lean();
  if (!owner) return;

  const arabic = owner.preferredLanguage === 'ar';
  if (arabic) url.searchParams.set('lang', 'ar');
  const subject = arabic ? 'أكّد بريدك الإلكتروني في NUVIA' : 'Verify your NUVIA email address';
  const text = arabic
    ? `افتح الرابط ثم اختر تأكيد البريد الإلكتروني. تنتهي صلاحية الرابط بعد ٢٤ ساعة.\n\n${url.href}\n\nإذا لم تطلب التأكيد، يمكنك تجاهل هذه الرسالة.`
    : `Open this link and select Confirm email address. The link expires in ${expiryHours} hours.\n\n${url.href}\n\nIf you did not request verification, you can ignore this message.`;
  try {
    await sendMail({ to: owner.email, subject, text });
  } catch {
    // Restore the earlier proof only while this attempt still owns the reservation.
    const previous = owner.emailVerification;
    await BusinessOwner.updateOne(
      { _id: owner._id, email, 'emailVerification.tokenHash': tokenHash },
      {
        $set: {
          emailVerification: {
            ...(previous?.tokenHash && previous.expiresAt > now ? previous : {}),
            requestedAt: now,
          },
        },
      },
    );
    console.error('Could not send email-verification message');
  }
}

function scheduleVerification(email) {
  if (!mailDeliveryAvailable()) return;
  // Public requests return a uniform response without waiting for lookup or delivery.
  setImmediate(() => {
    sendVerification(email).catch(() =>
      console.error('Could not process email-verification request'),
    );
  });
}

async function verifyEmail(token) {
  const result = await BusinessOwner.updateOne(
    {
      status: 'active',
      emailVerified: { $ne: true },
      'emailVerification.tokenHash': hash(token),
      'emailVerification.expiresAt': { $gt: new Date() },
      $expr: { $eq: ['$email', '$emailVerification.email'] },
    },
    { $set: { emailVerified: true }, $unset: { emailVerification: 1 } },
  );
  return result.modifiedCount === 1;
}

module.exports = { scheduleVerification, verifyEmail };
