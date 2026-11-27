import { apiRequest } from '../../lib/http/client.js';
import { queryString } from '../../lib/http/query.js';

const data = async (request) => (await request).data;
const idPath = (id) => encodeURIComponent(id);

export const surveyApi = {
  list: (filters = {}, signal) => data(apiRequest(`/surveys${queryString(filters)}`, { signal })),
  summary: (signal) => data(apiRequest('/surveys/summary', { signal })),
  templates: (signal) => data(apiRequest('/survey-templates', { signal })),
  get: (id, signal) => data(apiRequest(`/surveys/${idPath(id)}`, { signal })),
  share: (id, signal) => data(apiRequest(`/surveys/${idPath(id)}/share`, { signal })),
  qr: (id, branchId, signal) =>
    apiRequest(`/surveys/${idPath(id)}/qr${queryString({ branchId, format: 'png' })}`, {
      signal,
      responseType: 'blob',
    }),
  create: (body, signal) => data(apiRequest('/surveys', { method: 'POST', body, signal })),
  update: (id, body, signal) =>
    data(apiRequest(`/surveys/${idPath(id)}`, { method: 'PATCH', body, signal })),
  remove: (id, signal) => apiRequest(`/surveys/${idPath(id)}`, { method: 'DELETE', signal }),
  updateStatus: (id, body, signal) =>
    data(apiRequest(`/surveys/${idPath(id)}/status`, { method: 'PATCH', body, signal })),
  duplicate: (id, signal) =>
    data(apiRequest(`/surveys/${idPath(id)}/duplicate`, { method: 'POST', body: {}, signal })),
  publish: (id, signal) =>
    data(apiRequest(`/surveys/${idPath(id)}/publish`, { method: 'POST', body: {}, signal })),
  addQuestion: (id, body, signal) =>
    data(apiRequest(`/surveys/${idPath(id)}/questions`, { method: 'POST', body, signal })),
  reorderQuestions: (id, body, signal) =>
    data(apiRequest(`/surveys/${idPath(id)}/questions/reorder`, { method: 'PUT', body, signal })),
  updateQuestion: (id, questionId, body, signal) =>
    data(
      apiRequest(`/surveys/${idPath(id)}/questions/${idPath(questionId)}`, {
        method: 'PATCH',
        body,
        signal,
      }),
    ),
  deleteQuestion: (id, questionId, signal) =>
    apiRequest(`/surveys/${idPath(id)}/questions/${idPath(questionId)}`, {
      method: 'DELETE',
      signal,
    }),
  duplicateQuestion: (id, questionId, signal) =>
    data(
      apiRequest(`/surveys/${idPath(id)}/questions/${idPath(questionId)}/duplicate`, {
        method: 'POST',
        body: {},
        signal,
      }),
    ),
};
