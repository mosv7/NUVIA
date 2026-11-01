import { apiRequest } from '../../lib/http/client.js';
export const feedbackApi = {
  detail: async (id, signal) =>
    (await apiRequest('/feedbacks/' + encodeURIComponent(id), { signal })).data,
  analysis: async (id, signal) =>
    (await apiRequest('/feedbacks/' + encodeURIComponent(id) + '/analysis', { signal })).data,
};
