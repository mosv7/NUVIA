import { apiRequest } from '../../lib/http/client.js';
const data = async (request) => (await request).data;
export const businessApi = {
  get: (signal) => data(apiRequest('/business', { signal })),
  update: (body, signal) => data(apiRequest('/business', { method: 'PUT', body, signal })),
  onboardingStatus: (signal) => data(apiRequest('/onboarding/status', { signal })),
};
