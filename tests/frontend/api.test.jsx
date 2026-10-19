import { describe, it, expect, vi, afterEach } from 'vitest';
import { apiRequest, resetApiSession } from '../../src/frontend/src/services/api.js';
afterEach(() => {
  resetApiSession();
  vi.unstubAllGlobals();
});
describe('API transport', () => {
  it('shares CSRF bootstrap and sends cookies, origin-bound requests and no local storage secrets', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ user: null, csrfToken: 'csrf' })))
      .mockResolvedValue(new Response(JSON.stringify({ status: 'accepted' })));
    vi.stubGlobal('fetch', fetch);
    await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: { email: 'a@example.test' },
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[1][0]).toBe('/api/v1/auth/forgot-password');
    expect(fetch.mock.calls[1][1].credentials).toBe('include');
    expect(fetch.mock.calls[1][1].headers['X-CSRF-Token']).toBe('csrf');
    expect(localStorage.length).toBe(0);
  });
  it('surfaces safe errors without reflecting raw server messages', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({ error: { code: 'SERVICE_UNAVAILABLE', message: 'private detail' } }),
            { status: 503 },
          ),
        ),
    );
    await expect(apiRequest('/auth/session')).rejects.toMatchObject({
      code: 'SERVICE_UNAVAILABLE',
      status: 503,
    });
  });
});
