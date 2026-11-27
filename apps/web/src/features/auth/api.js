import { apiRequest } from '../../lib/http/client.js';
import { presentWorkspace } from '../workspaces/business-types.js';
export const authApi = {
  session: async () => {
    const session = await apiRequest('/auth/session');
    return { ...session, workspace: presentWorkspace(session.workspace) };
  },
  register: ({ name, email, password, passwordConfirmation, locale }, signal) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password, passwordConfirmation, preferredLanguage: locale },
      signal,
    }),
  login: (body, signal) => apiRequest('/auth/login', { method: 'POST', body, signal }),
  loginTwoFactor: (body, signal) => apiRequest('/auth/login/2fa', { method: 'POST', body, signal }),
  confirmEmail: (token, signal) =>
    apiRequest('/auth/confirm-email', { method: 'POST', body: { token }, signal }),
  logout: () => apiRequest('/auth/logout', { method: 'POST', body: {} }),
  verify: (token, signal) =>
    apiRequest('/auth/verify-email', { method: 'POST', body: { token }, signal }),
  resend: (email, signal) =>
    apiRequest('/auth/resend-verification', { method: 'POST', body: { email }, signal }),
  forgot: (email, signal) =>
    apiRequest('/auth/forgot-password', { method: 'POST', body: { email }, signal }),
  reset: (body, signal) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: { ...body, passwordConfirmation: body.passwordConfirmation ?? body.password },
      signal,
    }),
};
// Explicit /preview/ routes only. Never stores credentials or sessions.
export async function submitDemo(action, values) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (action === 'login') return { error: 'loginFailed' };
  if (action === 'signup' && values.email.toLowerCase() === 'used@example.com')
    return { field: 'email', error: 'emailUsed' };
  return {
    message:
      action === 'forgot' ? 'resetDemo' : action === 'reset' ? 'passwordDemo' : 'accountDemo',
  };
}
