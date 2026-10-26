import assert from 'node:assert/strict';
import { startConnectedFixture } from './backend-fixture.mjs';
const fixture = await startConnectedFixture();
const originalFetch = globalThis.fetch;
try {
  const cookies = new Map();
  globalThis.fetch = async (input, options = {}) => {
    const headers = new Headers(options.headers);
    headers.set('Origin', fixture.origin);
    if (cookies.size) headers.set('Cookie', [...cookies].map(([k, v]) => `${k}=${v}`).join('; '));
    const response = await originalFetch(new URL(input, fixture.origin), { ...options, headers });
    for (const cookie of response.headers.getSetCookie()) {
      const [pair] = cookie.split(';');
      const i = pair.indexOf('=');
      cookies.set(pair.slice(0, i), pair.slice(i + 1));
    }
    return response;
  };
  const { authApi } = await import('../../apps/web/src/features/auth/api.js');
  const { workspaceApi } = await import('../../apps/web/src/features/workspaces/api.js');
  await authApi.session();
  await authApi.register({
    name: 'Synthetic owner',
    email: 'proxy@example.test',
    password: 'Synthetic123',
    passwordConfirmation: 'Synthetic123',
    locale: 'en',
  });
  assert.equal((await authApi.session()).user.email, 'proxy@example.test');
  await workspaceApi.save({ businessName: 'Proxy Cafe', industry: 'Cafe' });
  assert.equal(
    (await workspaceApi.completeSetup({ branchType: 'multiple', branchName: 'Primary' }))
      .onboardingStep,
    'welcome',
  );
  const workspace = await workspaceApi.finishOnboarding({});
  assert.equal(workspace.onboardingStep, 'complete');
  const details = { name: 'Second', country: 'Egypt', city: 'Cairo', address: 'Synthetic street' };
  const second = await workspaceApi.createBranch(workspace.id, details);
  await workspaceApi.updateBranch(workspace.id, second.id, { ...details, name: 'Renamed' });
  await workspaceApi.updateBranch(workspace.id, second.id, { archived: true });
  const branches = await workspaceApi.branches(workspace.id);
  assert.ok(branches.some((b) => b.id === second.id && b.archivedAt));
  await authApi.logout();
  assert.equal((await authApi.session()).user, null);
  await assert.rejects(
    () => authApi.login({ email: 'proxy@example.test', password: 'wrong' }),
    (e) => e.code === 'INVALID_CREDENTIALS',
  );
  console.log(
    'PASS: sole-backend proxy signup, cookie session, onboarding, branch lifecycle, logout and rejected login',
  );
} finally {
  globalThis.fetch = originalFetch;
  await fixture.close();
}
