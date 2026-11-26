import { apiRequest } from '../../lib/http/client.js';

const reportPayload = (response) => response.report ?? response.data ?? response;

export const reportsApi = {
  list: async (signal) => {
    const response = await apiRequest('/reports', { signal });
    return response.reports ?? response.data ?? [];
  },
  get: async (id, signal) => {
    const response = await apiRequest(`/reports/${encodeURIComponent(id)}`, { signal });
    return reportPayload(response);
  },
  generate: async (body = {}, signal) => {
    const response = await apiRequest('/reports', { method: 'POST', body, signal });
    return reportPayload(response);
  },
};
