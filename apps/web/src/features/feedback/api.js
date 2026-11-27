import { API_PREFIX } from '@nuvia/shared-types';
import { apiRequest } from '../../lib/http/client.js';
import { queryString } from '../../lib/http/query.js';

export const feedbackApi = {
  list: async (filters = {}, signal) =>
    (await apiRequest(`/feedbacks${queryString(filters)}`, { signal })).data,
  filters: async (signal) => (await apiRequest('/feedbacks/filters', { signal })).data,
  exportLink: (filters = {}) => `${API_PREFIX}/feedbacks/export${queryString(filters)}`,
  detail: async (id, signal) =>
    (await apiRequest('/feedbacks/' + encodeURIComponent(id), { signal })).data,
  analysis: async (id, signal) =>
    (await apiRequest('/feedbacks/' + encodeURIComponent(id) + '/analysis', { signal })).data,
  retryAnalysis: async (id, signal) =>
    (
      await apiRequest('/feedbacks/' + encodeURIComponent(id) + '/analysis/retry', {
        method: 'POST',
        body: {},
        signal,
      })
    ).data,
};
