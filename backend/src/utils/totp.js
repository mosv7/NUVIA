const crypto = require('node:crypto');
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const generateSecret = () => {
  let bits = '';
  for (const byte of crypto.randomBytes(20)) bits += byte.toString(2).padStart(8, '0');
  return bits
    .match(/.{5}/g)
    .map((part) => alphabet[parseInt(part, 2)])
    .join('');
};
const secretBytes = (secret) => {
  if (!/^[A-Z2-7]+$/.test(secret)) throw new Error('Invalid authenticator secret');
  const bits = [...secret]
    .map((char) => alphabet.indexOf(char).toString(2).padStart(5, '0'))
    .join('');
  return Buffer.from(bits.match(/.{8}/g).map((byte) => parseInt(byte, 2)));
};
// RFC 6238: SHA-1, six digits, a 30-second period and one step of clock skew.
const verifyCode = (secret, code, { afterStep = -1, now = Date.now() } = {}) => {
  if (!/^\d{6}$/.test(String(code))) return null;
  const key = secretBytes(secret);
  const current = Math.floor(now / 30000);
  for (const step of [current, current - 1, current + 1]) {
    if (step < 0 || step <= afterStep) continue;
    const counter = Buffer.alloc(8);
    counter.writeBigUInt64BE(BigInt(step));
    const mac = crypto.createHmac('sha1', key).update(counter).digest();
    const offset = mac[mac.length - 1] & 15;
    const expected = String((mac.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(6, '0');
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(code)))) return step;
  }
  return null;
};
const buildOtpAuthUri = ({ secret, account }) =>
  `otpauth://totp/${encodeURIComponent('NUVIA:' + account)}?${new URLSearchParams({ secret, issuer: 'NUVIA', algorithm: 'SHA1', digits: '6', period: '30' })}`;
module.exports = { generateSecret, verifyCode, buildOtpAuthUri };
