import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const derive = promisify(scrypt);
const params = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt, 64, params);
  return `scrypt$32768$8$1$${salt}$${key.toString('hex')}`;
}
export async function verifyPassword(password, encoded = '') {
  if (
    typeof password !== 'string' ||
    password.length > 128 ||
    typeof encoded !== 'string' ||
    !/^scrypt\$32768\$8\$1\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(encoded)
  )
    return false;
  const [, , , , salt, expected] = encoded.split('$');
  const actual = await derive(password, salt, 64, params);
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}
export const dummyHash = await hashPassword(randomBytes(32).toString('hex'));
