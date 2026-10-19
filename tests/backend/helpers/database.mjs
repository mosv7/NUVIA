import { randomUUID } from 'node:crypto';
import dns from 'node:dns';
import { MongoClient } from 'mongodb';
import { loadConfig } from '../../../src/backend/config.mjs';
import { ensureSchema } from '../../../src/backend/database.mjs';

export function assertTestDatabase(name) {
  if (!/^nuvia_test_[0-9a-f-]{36}$/.test(name))
    throw new Error('Refusing non-isolated test database');
}
export async function createTestDatabase() {
  if (process.env.MONGODB_TEST_DNS_SERVERS)
    dns.setServers(process.env.MONGODB_TEST_DNS_SERVERS.split(','));
  const name = `nuvia_test_${randomUUID()}`;
  assertTestDatabase(name);
  const uri = process.env.MONGODB_TEST_URI;
  if (!uri) throw new Error('Use npm run test:backend for replica-set integration tests');
  const config = loadConfig({
    NODE_ENV: 'test',
    MONGODB_URI: uri,
    MONGODB_DATABASE: name,
    MAIL_ENCRYPTION_KEY: 'a'.repeat(64),
  });
  const client = await new MongoClient(uri).connect();
  const db = client.db(name);
  await ensureSchema(db);
  return {
    client,
    db,
    config,
    now: () => new Date(),
    cleanup: async () => {
      assertTestDatabase(db.databaseName);
      await db.dropDatabase();
      await client.close();
    },
  };
}
