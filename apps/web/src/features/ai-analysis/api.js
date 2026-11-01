import { apiRequest } from '../../lib/http/client.js';
export const assistantApi = {
  context: async (scope, signal) =>
    (
      await apiRequest(
        '/ai/assistant/context' +
          (Object.keys(scope).length ? '?' + new URLSearchParams(scope) : ''),
        { signal },
      )
    ).data,
  answer: async (body, signal) =>
    (await apiRequest('/ai/assistant/answers', { method: 'POST', body, signal })).data,
};
