import { render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../src/app/App.jsx';
import { authApi } from '../src/features/auth/api.js';
import { analyticsApi } from '../src/features/analytics/api.js';

afterEach(() => {
  vi.restoreAllMocks();
  history.replaceState(null, '', '/');
});

it.each([
  ['analytics', ['sentimentSummary', 'sentimentTrends', 'sentimentResponses']],
  ['analytics-sentiment', ['sentimentSummary', 'sentimentTrends', 'sentimentResponses']],
  ['analytics-aspects', ['aspectAnalysis', 'aspectScoreComparison']],
  ['analytics-topics', ['topicsAndComplaints']],
  ['analytics-trends', ['trendsAndSignals']],
  ['analytics-comparison', ['branchComparison']],
])('loads only the live API methods for %s', async (route, methods) => {
  vi.spyOn(authApi, 'session').mockResolvedValue({
    user: { id: 'owner' },
    workspace: {
      id: 'workspace',
      businessName: 'Actual Cafe',
      onboardingStep: 'complete',
      branches: [],
    },
  });
  const requests = Object.fromEntries(
    Object.keys(analyticsApi).map((method) => [
      method,
      vi.spyOn(analyticsApi, method).mockResolvedValue({ result: method }),
    ]),
  );
  history.replaceState(null, '', `/?lang=en#/${route}`);
  render(<App />);

  for (const method of methods) expect(await screen.findByText(method)).toBeVisible();
  for (const [name, request] of Object.entries(requests)) {
    if (methods.includes(name)) {
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(expect.any(Object), expect.any(AbortSignal));
    } else expect(request).not.toHaveBeenCalled();
  }
});
