// Encrypts small secrets (the 2FA secret) before they are stored, so a database leak alone
// doesn't hand out working authenticator codes. AES-256-GCM.
// Set TWO_FACTOR_KEY in .env (any long random string). It falls back to JWT_SECRET.
const crypto = require('crypto');

const key = () =>
  crypto
    .createHash('sha256')
    .update(process.env.TWO_FACTOR_KEY || process.env.JWT_SECRET)
    .digest();

const encrypt = (plain) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const body = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), body].map((b) => b.toString('base64')).join('.');
};

const decrypt = (stored) => {
  const [iv, tag, body] = stored.split('.').map((p) => Buffer.from(p, 'base64'));
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8');
};

module.exports = { encrypt, decrypt };
