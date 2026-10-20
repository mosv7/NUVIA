import mongoose from 'mongoose';
import { createModels } from './models/index.mjs';
import dns from 'node:dns';
import tls from 'node:tls';

export async function connectDatabase(config) {
  if (config.dnsServers.length) dns.setServers(config.dnsServers);
  const options = {
    dbName: config.mongoDatabase,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    autoCreate: false,
    autoIndex: false,
    bufferCommands: false,
  };
  if (config.tlsMaxVersion)
    options.secureContext = tls.createSecureContext({
      minVersion: 'TLSv1.2',
      maxVersion: config.tlsMaxVersion,
    });
  const connection = mongoose.createConnection(config.mongoUri, options);
  try {
    await connection.asPromise();
    const db = connection.db;
    await db.command({ ping: 1 });
    return {
      connection,
      client: connection.getClient(),
      db,
      models: createModels(connection),
      close: () => connection.close(),
    };
  } catch (error) {
    await connection.close();
    throw error;
  }
}

export async function ensureSchema(models) {
  const versions = models.SchemaVersion;
  const version = await versions.findOne({ _id: 'foundation' }).lean();
  if (version && version.version !== 1) throw new Error('Unsupported database schema version');
  // Add missing declared indexes; never sync/drop existing application indexes.
  for (const model of Object.values(models)) await model.createIndexes();
  await versions.updateOne(
    { _id: 'foundation' },
    { $setOnInsert: { version: 1, appliedAt: new Date() } },
    { upsert: true },
  );
}

export function transaction(deps, action) {
  return deps.client.withSession((session) => session.withTransaction(() => action(session)));
}
