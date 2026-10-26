import { apiRequest } from '../../lib/http/client.js';
export const workspaceApi = {
  branches: (id, signal) =>
    apiRequest(`/workspaces/${encodeURIComponent(id)}/branches?includeArchived=true`, { signal }),
  createBranch: (id, body, signal) =>
    apiRequest(`/workspaces/${encodeURIComponent(id)}/branches`, { method: 'POST', body, signal }),
  updateBranch: (id, branchId, body, signal) =>
    apiRequest(`/workspaces/${encodeURIComponent(id)}/branches/${encodeURIComponent(branchId)}`, {
      method: 'PATCH',
      body,
      signal,
    }),
  get: () => apiRequest('/workspace'),
  save: (body, signal) => apiRequest('/workspace', { method: 'PUT', body, signal }),
  completeSetup: (body, signal) => apiRequest('/workspace/setup', { method: 'PUT', body, signal }),
};
