import { MongoClient } from 'mongodb';
import dns from 'node:dns';
import tls from 'node:tls';

export async function connectDatabase(config) {
  if (config.dnsServers.length) dns.setServers(config.dnsServers);
  const options = { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 };
  if (config.tlsMaxVersion)
    options.secureContext = tls.createSecureContext({
      minVersion: 'TLSv1.2',
      maxVersion: config.tlsMaxVersion,
    });
  const client = new MongoClient(config.mongoUri, options);
  try {
    await client.connect();
    const db = client.db(config.mongoDatabase);
    await db.command({ ping: 1 });
    return { client, db, close: () => client.close() };
  } catch (error) {
    await client.close();
    throw error;
  }
}

export async function ensureSchema(db) {
  const versions = db.collection('schema_versions');
  const version = await versions.findOne({ _id: 'foundation' });
  if (version && version.version !== 1) throw new Error('Unsupported database schema version');
  const definitions = [
    ['users', { email: 1 }, { unique: true }],
    ['sessions', { digest: 1 }, { unique: true }],
    ['sessions', { expiresAt: 1 }, { expireAfterSeconds: 0 }],
    ['sessions', { userId: 1 }, {}],
    ['auth_tokens', { userId: 1, purpose: 1 }, { unique: true }],
    ['auth_tokens', { digest: 1 }, { unique: true }],
    ['auth_tokens', { expiresAt: 1 }, { expireAfterSeconds: 0 }],
    ['workspaces', { ownerUserId: 1 }, { unique: true }],
    [
      'branches',
      { workspaceId: 1, normalizedName: 1 },
      { unique: true, partialFilterExpression: { archivedAt: null } },
    ],
    ['mail_outbox', { status: 1, nextAttemptAt: 1 }, {}],
    ['mail_outbox', { expiresAt: 1 }, { expireAfterSeconds: 0 }],
  ];
  for (const [collection, keys, options] of definitions)
    await db.collection(collection).createIndex(keys, options);
  await versions.updateOne(
    { _id: 'foundation' },
    { $setOnInsert: { version: 1, appliedAt: new Date() } },
    { upsert: true },
  );
}

export function transaction(deps, action) {
  return deps.client.withSession((session) => session.withTransaction(() => action(session)));
}
