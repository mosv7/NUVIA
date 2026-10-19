let csrfToken = null,
  pendingBootstrap = null,
  epoch = 0;
export function resetApiSession() {
  epoch++;
  csrfToken = null;
  pendingBootstrap = null;
}
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api/v1${path}`, {
      credentials: 'include',
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw Object.assign(new Error('NETWORK_ERROR'), { code: 'NETWORK_ERROR', status: 0 });
  }
  const data = response.status === 204 ? undefined : await response.json().catch(() => ({}));
  if (!response.ok)
    throw Object.assign(new Error(data?.error?.code || 'REQUEST_FAILED'), {
      code: data?.error?.code || 'REQUEST_FAILED',
      status: response.status,
      details: data?.error?.details || [],
    });
  return data;
}
export function bootstrapSession() {
  if (pendingBootstrap) return pendingBootstrap;
  const version = epoch;
  const promise = request('/auth/session')
    .then((data) => {
      if (version === epoch) csrfToken = data.csrfToken;
      return data;
    })
    .finally(() => {
      if (pendingBootstrap === promise) pendingBootstrap = null;
    });
  pendingBootstrap = promise;
  return promise;
}
export async function apiRequest(path, { method = 'GET', body, signal } = {}) {
  if (path === '/auth/session' && method === 'GET') return bootstrapSession();
  if (method !== 'GET' && !csrfToken) await bootstrapSession();
  const version = epoch;
  let data;
  try {
    data = await request(path, {
      method,
      signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      headers: method === 'GET' ? {} : { 'X-CSRF-Token': csrfToken },
    });
  } catch (error) {
    if (version === epoch && ['AUTH_REQUIRED', 'CSRF_REJECTED'].includes(error.code)) {
      resetApiSession();
      window.dispatchEvent(new Event('nuvia:session-expired'));
    }
    throw error;
  }
  if (version === epoch && data?.csrfToken) csrfToken = data.csrfToken;
  if (method !== 'GET' && path === '/auth/logout') resetApiSession();
  return data;
}
