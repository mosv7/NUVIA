import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createTestDatabase } from './helpers/database.mjs';
import { createHttp } from './helpers/http.mjs';
import { hashPassword } from '../src/modules/auth/passwords.mjs';
async function loggedIn(deps, email) {
  const http = createHttp(deps);
  await deps.db.collection('users').insertOne({
    _id: randomUUID(),
    name: 'Test',
    email,
    locale: 'ar',
    verifiedAt: deps.now(),
    passwordHash: await hashPassword('Synthetic123'),
    credentialsVersion: 1,
  });
  await http.mutate('post', '/auth/login', { email, password: 'Synthetic123' });
  return http;
}
test('workspace onboarding persists, survives retries and isolates owners and branches', async () => {
  const deps = await createTestDatabase();
  try {
    const a = await loggedIn(deps, 'a@example.test'),
      b = await loggedIn(deps, 'b@example.test');
    await a.get('/workspace', 404);
    await a.mutate('put', '/workspace', { businessName: 'مقهى', industry: 'Cafe', locale: 'ar' });
    assert.equal((await a.get('/workspace')).body.onboardingStep, 'branches');
    await a.mutate('put', '/workspace/setup', { branchType: 'multiple', branchName: '' }, 422);
    const requests = await Promise.all(
      [1, 2].map(() =>
        a.mutate('put', '/workspace/setup', { branchType: 'multiple', branchName: 'Cairo' }),
      ),
    );
    assert.equal(requests[0].body.id, requests[1].body.id);
    const workspace = (await a.get('/workspace')).body;
    assert.equal(workspace.branches.length, 1);
    assert.equal(workspace.onboardingStep, 'complete');
    assert.equal((await a.get('/auth/session')).body.workspace.businessName, 'مقهى');
    await b.get(`/workspaces/${workspace.id}/branches`, 404);
    await b.mutate(
      'patch',
      `/workspaces/${workspace.id}/branches/${workspace.primaryBranchId}`,
      { name: 'Hacked' },
      404,
    );
    await a.mutate(
      'put',
      '/workspace',
      { businessName: 'Fake', industry: 'Fake', ownerUserId: 'forged' },
      422,
    );
    const second = (
      await a.mutate('post', `/workspaces/${workspace.id}/branches`, { name: 'Giza' }, 201)
    ).body;
    await a.mutate('post', `/workspaces/${workspace.id}/branches`, { name: ' giza ' }, 409);
    await a.mutate(
      'patch',
      `/workspaces/${workspace.id}/branches/${workspace.primaryBranchId}`,
      { archived: true },
      409,
    );
    await a.mutate('put', '/workspace/setup', { branchType: 'single' }, 409);
    await a.mutate(
      'patch',
      `/workspaces/${workspace.id}/branches/${second.id}`,
      { name: 'Cairo' },
      409,
    );
    await a.mutate('patch', `/workspaces/${workspace.id}/branches/${second.id}`, {
      archived: true,
    });
    await a.mutate('put', '/workspace/setup', { branchType: 'single' });
    const final = (await a.get('/workspace')).body;
    assert.equal(final.branches.length, 1);
    assert.equal(await deps.db.collection('branches').countDocuments(), 2);
  } finally {
    await deps.cleanup();
  }
});
