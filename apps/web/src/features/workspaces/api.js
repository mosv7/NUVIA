import { apiRequest } from '../../lib/http/client.js';
import { businessType, presentWorkspace } from './business-types.js';
const data = async (request) => (await request).data;
const savedWorkspace = async (request) => {
  await request;
  return presentWorkspace((await apiRequest('/auth/session')).workspace);
};
export const workspaceApi = {
  branches: (_businessId, signal) => data(apiRequest('/branches?status=all', { signal })),
  createBranch: (_businessId, body, signal) =>
    data(apiRequest('/branches', { method: 'POST', body, signal })),
  updateBranch: (_businessId, branchId, body, signal) =>
    data(
      apiRequest(`/branches/${encodeURIComponent(branchId)}${body.archived ? '/archive' : ''}`, {
        method: body.archived ? 'POST' : 'PUT',
        body: body.archived ? {} : body,
        signal,
      }),
    ),
  get: async () => presentWorkspace((await apiRequest('/auth/session')).workspace),
  save: ({ businessName, industry }, signal) =>
    savedWorkspace(
      apiRequest('/onboarding/business', {
        method: 'PUT',
        body: { name: businessName, type: businessType(industry) },
        signal,
      }),
    ),
  completeSetup: ({ branchType, branchName }, signal) =>
    savedWorkspace(
      apiRequest('/onboarding/setup', {
        method: 'PUT',
        body: {
          hasMultipleBranches: branchType === 'multiple',
          ...(branchType === 'multiple' ? { primaryBranchName: branchName } : {}),
        },
        signal,
      }),
    ),
  finishOnboarding: (_body, signal) =>
    savedWorkspace(
      apiRequest('/onboarding/complete', {
        method: 'POST',
        body: {},
        signal,
      }),
    ),
};
