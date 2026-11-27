import { API_PREFIX } from '@nuvia/shared-types';
let csrfToken = null,
  pendingBootstrap = null,
  epoch = 0;
export function resetApiSession() {
  epoch++;
  csrfToken = null;
  pendingBootstrap = null;
}
async function request(path, options = {}, responseType) {
  let response;
  try {
    response = await fetch(`${API_PREFIX}${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw Object.assign(new Error('NETWORK_ERROR'), { code: 'NETWORK_ERROR', status: 0 });
  }
  if (response.ok && responseType === 'blob') return response.blob();
  const data = response.status === 204 ? undefined : await response.json().catch(() => ({}));
  if (!response.ok) {
    const code =
      data?.error?.code ||
      data?.code ||
      (response.status === 401
        ? ['/auth/login', '/auth/login/2fa'].includes(path)
          ? 'INVALID_CREDENTIALS'
          : 'AUTH_REQUIRED'
        : response.status === 429
          ? 'RATE_LIMITED'
          : /email already exists/i.test(data?.message || '')
            ? 'EMAIL_USED'
            : 'REQUEST_FAILED');
    const serverMessage = [data?.message, data?.error?.message].find(
      (value) => typeof value === 'string' && value.trim(),
    );
    throw Object.assign(new Error(code), {
      code,
      status: response.status,
      details: data?.error?.details || data?.errors || [],
      serverMessage: serverMessage ? serverMessage.slice(0, 300) : '',
    });
  }
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
export async function apiRequest(
  path,
  { method = 'GET', body, rawBody, contentType, signal, responseType } = {},
) {
  if (path === '/auth/session' && method === 'GET') return bootstrapSession();
  if (method !== 'GET' && !csrfToken) await bootstrapSession();
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const version = epoch;
  let data;
  try {
    data = await request(
      path,
      {
        method,
        signal,
        ...(rawBody !== undefined
          ? { body: rawBody }
          : body !== undefined
            ? { body: JSON.stringify(body) }
            : {}),
        headers:
          method === 'GET'
            ? {}
            : {
                'X-CSRF-Token': csrfToken,
                ...(contentType ? { 'Content-Type': contentType } : {}),
              },
      },
      responseType,
    );
  } catch (error) {
    if (
      version === epoch &&
      ['AUTH_REQUIRED', 'SESSION_EXPIRED', 'CSRF_REJECTED'].includes(error.code)
    ) {
      resetApiSession();
      window.dispatchEvent(new Event('nuvia:session-expired'));
    }
    throw error;
  }
  if (version === epoch && data?.csrfToken) csrfToken = data.csrfToken;
  if (method !== 'GET' && path === '/auth/logout') resetApiSession();
  return data;
}
