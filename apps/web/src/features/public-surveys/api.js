import { apiRequest } from '../../lib/http/client.js';
const data = async (request) => (await request).data;
export const publicSurveyApi = {
  get: (shortCode, branch, signal) => {
    const query = branch ? `?branch=${encodeURIComponent(branch)}` : '';
    return data(apiRequest(`/public/surveys/${encodeURIComponent(shortCode)}${query}`, { signal }));
  },
  submit: (shortCode, body, signal) =>
    apiRequest(`/public/surveys/${encodeURIComponent(shortCode)}/responses`, { method: 'POST', body, signal }),
};
