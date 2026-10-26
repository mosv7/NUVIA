import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import { resetApiSession } from '../src/lib/http/client.js';
import { authApi } from '../src/features/auth/api.js';
import { workspaceApi } from '../src/features/workspaces/api.js';
const ok = (body) => ({ ok: true, status: 200, json: async () => body });
beforeEach(() => {
  resetApiSession();
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(ok({ csrfToken: 'csrf', workspace: { id: 'business' } })),
  );
});
afterEach(() => vi.unstubAllGlobals());
it('uses the survey backend registration and password confirmation contract', async () => {
  await authApi.register({
    name: 'Owner',
    email: 'owner@example.test',
    password: 'Synthetic123',
    passwordConfirmation: 'Synthetic123',
    locale: 'ar',
    terms: true,
  });
  expect(fetch.mock.calls[0][0]).toBe('/api/auth/session');
  expect(fetch.mock.calls[1][0]).toBe('/api/auth/register');
  expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({
    name: 'Owner',
    email: 'owner@example.test',
    password: 'Synthetic123',
    passwordConfirmation: 'Synthetic123',
    preferredLanguage: 'ar',
  });
});
it('uses the real business onboarding route and reloads the saved session', async () => {
  const saved = await workspaceApi.save({ businessName: 'Cafe', industry: 'Cafe' });
  const call = fetch.mock.calls.find(([url]) => url === '/api/onboarding/business');
  expect(call).toBeDefined();
  expect(JSON.parse(call[1].body)).toEqual({ name: 'Cafe', type: 'food_beverage' });
  expect(saved).toEqual({ id: 'business' });
});
it('uses branch archive action instead of the removed workspace PATCH contract', async () => {
  await workspaceApi.updateBranch('business', 'branch', { archived: true });
  expect(fetch.mock.calls.at(-1)[0]).toBe('/api/branches/branch/archive');
  expect(fetch.mock.calls.at(-1)[1].method).toBe('POST');
});
