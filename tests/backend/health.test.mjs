import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../../src/backend/app.mjs';
import { createTestDatabase, assertTestDatabase } from './helpers/database.mjs';
import { ensureSchema } from '../../src/backend/database.mjs';

test('health readiness checks actual storage, safe failures and schema upgrades', async () => {
  const deps = await createTestDatabase();
  try {
    const app = createApp(deps);
    await request(app).get('/api/v1/health/live').expect(200);
    await request(app).get('/api/v1/health/ready').expect(200);
    await ensureSchema(deps.db);
    await deps.db
      .collection('schema_versions')
      .updateOne({ _id: 'foundation' }, { $set: { version: 99 } });
    await assert.rejects(ensureSchema(deps.db));
    const failed = createApp({
      ...deps,
      db: {
        command: async () => {
          throw new Error('private storage detail');
        },
      },
    });
    const res = await request(failed).get('/api/v1/health/ready').expect(503);
    assert.equal(res.body.error.code, 'SERVICE_UNAVAILABLE');
    assert.ok(!res.text.includes('private storage detail'));
  } finally {
    await deps.cleanup();
  }
});
test('database safety refuses ordinary names', () => {
  for (const name of ['nuvia', 'admin', 'nuvia_test_config'])
    assert.throws(() => assertTestDatabase(name));
});
