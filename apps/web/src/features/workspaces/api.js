import { apiRequest } from '../../lib/http/client.js';
export const workspaceApi = {
  get: () => apiRequest('/workspace'),
  save: (body, signal) => apiRequest('/workspace', { method: 'PUT', body, signal }),
  completeSetup: (body, signal) => apiRequest('/workspace/setup', { method: 'PUT', body, signal }),
};
