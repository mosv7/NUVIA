import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../../src/backend/auth/passwords.mjs';
test('password hashes are salted, strict and constant-format scrypt', async () => {
  const first = await hashPassword('Synthetic123');
  const second = await hashPassword('Synthetic123');
  assert.notEqual(first, second);
  assert.ok(first.startsWith('scrypt$32768$8$1$'));
  assert.equal(await verifyPassword('Synthetic123', first), true);
  assert.equal(await verifyPassword('wrong123', first), false);
  assert.equal(await verifyPassword('Synthetic123', 'scrypt$9999999999$8$1$x$x'), false);
  assert.equal(await verifyPassword('Synthetic123', 'x'.repeat(10000)), false);
});
