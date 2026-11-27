import { apiRequest } from '../../lib/http/client.js';
const data = async (request) => (await request).data;
const idPath = (id) => encodeURIComponent(id);

export const settingsApi = {
  account: (signal) => data(apiRequest('/settings/account', { signal })),
  updateAccount: (body, signal) =>
    data(apiRequest('/settings/account', { method: 'PATCH', body, signal })),
  setAvatar: (file, signal) =>
    data(
      apiRequest('/settings/avatar', {
        method: 'PUT',
        rawBody: file,
        contentType: file.type,
        signal,
      }),
    ),
  removeAvatar: (signal) => apiRequest('/settings/avatar', { method: 'DELETE', signal }),
  language: (signal) => data(apiRequest('/settings/language', { signal })),
  updateLanguage: (body, signal) =>
    data(apiRequest('/settings/language', { method: 'PUT', body, signal })),
  notifications: (signal) => data(apiRequest('/settings/notifications', { signal })),
  updateNotifications: (body, signal) =>
    data(apiRequest('/settings/notifications', { method: 'PUT', body, signal })),
  security: (signal) => data(apiRequest('/settings/security', { signal })),
  changePassword: (body, signal) =>
    data(apiRequest('/settings/security/password', { method: 'POST', body, signal })),
  setupTwoFactor: (signal) =>
    data(apiRequest('/settings/security/2fa/setup', { method: 'POST', body: {}, signal })),
  enableTwoFactor: (body, signal) =>
    data(apiRequest('/settings/security/2fa/enable', { method: 'POST', body, signal })),
  disableTwoFactor: (body, signal) =>
    data(apiRequest('/settings/security/2fa/disable', { method: 'POST', body, signal })),
  sessions: (signal) => data(apiRequest('/settings/security/sessions', { signal })),
  revokeSession: (sessionId, signal) =>
    apiRequest(`/settings/security/sessions/${idPath(sessionId)}`, { method: 'DELETE', signal }),
  signOutAll: (signal) =>
    data(
      apiRequest('/settings/security/sessions/sign-out-all', { method: 'POST', body: {}, signal }),
    ),
  requestEmailChange: (body, signal) =>
    data(apiRequest('/settings/security/email', { method: 'POST', body, signal })),
  pendingEmailChange: (signal) => data(apiRequest('/settings/security/email/pending', { signal })),
  cancelEmailChange: (signal) =>
    apiRequest('/settings/security/email/pending', { method: 'DELETE', signal }),
};
