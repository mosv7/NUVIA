import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { apiRequest, resetApiSession, bootstrapSession } from '../src/lib/http/client.js';
import { authApi } from '../src/features/auth/api.js';
const ok = (data) => ({ ok: true, status: 200, json: async () => data });
beforeEach(() => {
  resetApiSession();
  vi.stubGlobal('fetch', vi.fn());
});
afterEach(() => vi.unstubAllGlobals());
describe('real cookie and CSRF API transport', () => {
  it('bootstraps a session before a mutation and sends only contract fields', async () => {
    fetch
      .mockResolvedValueOnce(ok({ csrfToken: 'test-csrf' }))
      .mockResolvedValueOnce(ok({ user: { id: 'test-user' } }));
    await authApi.login({ email: 'test@example.com', password: 'test-only', remember: false });
    expect(fetch.mock.calls[0][0]).toBe('/api/v1/auth/session');
    const [url, opts] = fetch.mock.calls[1];
    expect(url).toBe('/api/v1/auth/login');
    expect(opts.credentials).toBe('include');
    expect(opts.headers['X-CSRF-Token']).toBe('test-csrf');
    expect(JSON.parse(opts.body)).toEqual({
      email: 'test@example.com',
      password: 'test-only',
      remember: false,
    });
  });
  it('shares concurrent session bootstraps', async () => {
    fetch.mockResolvedValue(ok({ csrfToken: 'test' }));
    await Promise.all([bootstrapSession(), bootstrapSession()]);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('never reports success when the server rejects credentials', async () => {
    fetch.mockResolvedValueOnce(ok({ csrfToken: 'test' })).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: { code: 'INVALID_CREDENTIALS' } }),
    });
    await expect(authApi.login({ email: 'a', password: 'b' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
      status: 401,
    });
  });
  it('maps network failures without fabricating an account', async () => {
    fetch.mockRejectedValue(new Error('offline'));
    await expect(authApi.session()).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  });
  it('respects aborts before posting credentials', async () => {
    fetch.mockResolvedValueOnce(ok({ csrfToken: 'test' }));
    const c = new AbortController();
    c.abort();
    await expect(authApi.login({ email: 'a', password: 'b' }, c.signal)).rejects.toMatchObject({
      name: 'AbortError',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('handles empty logout responses', async () => {
    fetch
      .mockResolvedValueOnce(ok({ csrfToken: 'test' }))
      .mockResolvedValueOnce({ ok: true, status: 204 });
    await expect(authApi.logout()).resolves.toBeUndefined();
  });
  it('does not let an obsolete session bootstrap replace a newer token', async () => {
    let resolve;
    fetch.mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    const stale = bootstrapSession();
    resetApiSession();
    fetch.mockResolvedValueOnce(ok({ csrfToken: 'new-token' }));
    await bootstrapSession();
    resolve(ok({ csrfToken: 'old-token' }));
    await stale;
    fetch.mockResolvedValueOnce(ok({}));
    await apiRequest('/auth/resend-verification', {
      method: 'POST',
      body: { email: 'test@example.com' },
    });
    expect(fetch.mock.calls.at(-1)[1].headers['X-CSRF-Token']).toBe('new-token');
  });
});
