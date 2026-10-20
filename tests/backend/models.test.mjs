import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createTestDatabase, assertTestDatabase } from './helpers/database.mjs';
import { ensureSchema, connectDatabase } from '../../src/backend/database.mjs';
import { hashPassword } from '../../src/backend/auth/passwords.mjs';
import { digest } from '../../src/backend/auth/sessions.mjs';
import { getWorkspace } from '../../src/backend/workspaces/service.mjs';
import { createHttp } from './helpers/http.mjs';

const collections = {
  User: 'users',
  Session: 'sessions',
  AuthToken: 'auth_tokens',
  Workspace: 'workspaces',
  Branch: 'branches',
  MailOutbox: 'mail_outbox',
  SchemaVersion: 'schema_versions',
};

test('Mongoose connection and model reads do not create collections before explicit setup', async () => {
  const deps = await createTestDatabase();
  let connection;
  try {
    const name = `nuvia_test_${randomUUID()}`;
    assertTestDatabase(name);
    connection = await connectDatabase({ ...deps.config, mongoDatabase: name });
    assert.equal(await connection.models.User.findOne().lean(), null);
    assert.deepEqual(await connection.db.listCollections().toArray(), []);
  } finally {
    if (connection) {
      assertTestDatabase(connection.db.databaseName);
      await connection.db.dropDatabase();
      await connection.close();
    }
    await deps.cleanup();
  }
});

test('Mongoose models are connection-scoped and enforce create/update schemas', async () => {
  const deps = await createTestDatabase();
  try {
    assert.ok(deps.models, 'Expected explicit Mongoose models');
    for (const [name, collection] of Object.entries(collections)) {
      assert.equal(deps.models[name].collection.collectionName, collection);
      assert.equal(deps.models[name].schema.options.versionKey, false);
      assert.equal(deps.models[name].schema.options.autoIndex, false);
    }
    await assert.rejects(deps.models.User.insertOne({ _id: randomUUID(), locale: 'invalid' }), {
      name: 'ValidationError',
    });
    const id = randomUUID();
    await deps.db.collection('users').insertOne({ _id: id, locale: 'en' });
    await assert.rejects(deps.models.User.updateOne({ _id: id }, { $set: { locale: 'invalid' } }), {
      name: 'ValidationError',
    });
    assert.equal((await deps.db.collection('users').findOne({ _id: id })).locale, 'en');
    await assert.rejects(deps.models.User.updateOne({ _id: id }, { $set: { unexpected: true } }), {
      name: 'StrictModeError',
    });
    const second = await createTestDatabase();
    try {
      assert.notEqual(deps.models.User, second.models.User);
      assert.equal(await second.models.User.countDocuments(), 0);
    } finally {
      await second.cleanup();
    }
  } finally {
    await deps.cleanup();
  }
});

test('Mongoose preserves legacy UUID documents, ObjectId tokens, indexes and account flow after reconnect', async () => {
  const deps = await createTestDatabase();
  let reopened;
  try {
    assert.ok(deps.models, 'Expected explicit Mongoose models');
    const userId = randomUUID(),
      workspaceId = randomUUID(),
      branchId = randomUUID(),
      now = new Date();
    await deps.db.collection('users').insertOne({
      _id: userId,
      name: 'Legacy Owner',
      email: 'legacy@example.test',
      locale: 'en',
      passwordHash: await hashPassword('Legacy123'),
      credentialsVersion: 1,
      verifiedAt: now,
      termsAcceptedAt: now,
      createdAt: now,
      updatedAt: now,
    });
    await deps.db.collection('workspaces').insertOne({
      _id: workspaceId,
      ownerUserId: userId,
      name: 'Legacy Cafe',
      industry: 'Cafe',
      locale: 'en',
      reportingTimezone: 'Africa/Cairo',
      branchMode: 'multiple',
      primaryBranchId: branchId,
      onboardingStep: 'complete',
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
    await deps.db.collection('branches').insertOne({
      _id: branchId,
      workspaceId,
      name: 'Legacy Branch',
      normalizedName: 'legacy branch',
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    });
    const token = 'd'.repeat(64);
    const inserted = await deps.db.collection('auth_tokens').insertOne({
      userId,
      purpose: 'reset',
      digest: digest(token),
      createdAt: now,
      expiresAt: new Date(Date.now() + 600000),
    });
    await deps.db
      .collection('users')
      .createIndex({ createdAt: 1 }, { name: 'legacy_custom_index' });
    reopened = await connectDatabase(deps.config);
    await ensureSchema(reopened.models);
    const d = { ...deps, ...reopened };
    assert.equal(reopened.models.User.db, reopened.connection);
    assert.equal((await getWorkspace(userId, d)).branches[0].id, branchId);
    const http = createHttp(d);
    await http.mutate('post', '/auth/login', {
      email: 'legacy@example.test',
      password: 'Legacy123',
    });
    await http.mutate('post', '/auth/reset-password', { token, password: 'Changed123' });
    assert.equal(
      await deps.db.collection('auth_tokens').findOne({ _id: inserted.insertedId }),
      null,
    );
    assert.equal(
      (await deps.db.collection('users').findOne({ _id: userId })).credentialsVersion,
      2,
    );
    assert.equal((await deps.db.collection('users').findOne({ _id: userId })).__v, undefined);
    const indexes = await deps.db.collection('users').indexes();
    assert.ok(indexes.some((i) => i.name === 'legacy_custom_index'));
    const ttl = await deps.db.collection('sessions').indexes();
    assert.equal(ttl.find((i) => i.key.expiresAt === 1).expireAfterSeconds, 0);
    const branchIndexes = await deps.db.collection('branches').indexes();
    assert.deepEqual(
      branchIndexes.find((i) => i.key.normalizedName === 1).partialFilterExpression,
      { archivedAt: null },
    );
    assert.deepEqual(
      (await deps.db.listCollections().toArray()).map((c) => c.name).sort(),
      Object.values(collections).sort(),
    );
  } finally {
    await reopened?.close();
    await deps.cleanup();
  }
});
