import { describe, it, expect, vi, afterEach } from 'vitest';
import { apiRequest, resetApiSession } from '../src/lib/http/client.js';
afterEach(() => {
  resetApiSession();
  vi.unstubAllGlobals();
});
describe('API transport', () => {
  it('re-bootstraps stale CSRF on the next explicit attempt without replaying a mutation', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ user: null, csrfToken: 'old-csrf' })))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { code: 'CSRF_REJECTED' } }), { status: 403 }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ user: null, csrfToken: 'new-csrf' })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: 'accepted' })));
    vi.stubGlobal('fetch', fetch);
    await expect(apiRequest('/auth/login', { method: 'POST', body: {} })).rejects.toMatchObject({
      code: 'CSRF_REJECTED',
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    await apiRequest('/auth/login', { method: 'POST', body: {} });
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(fetch.mock.calls[3][1].headers['X-CSRF-Token']).toBe('new-csrf');
  });
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
