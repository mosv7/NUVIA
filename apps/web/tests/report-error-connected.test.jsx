import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../src/app/App.jsx';
import { authApi } from '../src/features/auth/api.js';
import { reportsApi } from '../src/features/reports/api.js';

const ownerSession = () => ({
  user: { id: 'owner', name: 'Actual Owner', emailVerified: true },
  workspace: {
    id: 'workspace',
    businessName: 'Actual Cafe',
    industry: 'Cafe',
    onboardingStep: 'complete',
    branches: [],
  },
});

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

afterEach(() => {
  vi.restoreAllMocks();
  history.replaceState(null, '', '/');
  Object.defineProperty(URL, 'createObjectURL', {
    value: originalCreateObjectURL,
    configurable: true,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    value: originalRevokeObjectURL,
    configurable: true,
  });
});

it('shows the real backend failure when report generation returns HTTP 500', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
  vi.spyOn(reportsApi, 'list').mockResolvedValue([]);
  const generate = vi.spyOn(reportsApi, 'generate').mockRejectedValue(
    Object.assign(new Error('REQUEST_FAILED'), {
      code: 'REQUEST_FAILED',
      status: 500,
      serverMessage: 'Something went wrong, please try again',
      details: [],
    }),
  );

  history.replaceState(null, '', '/#/reports');
  render(<App />);
  const button = await screen.findByRole('button', { name: 'Generate report' });
  fireEvent.click(button);

  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Something went wrong, please try again (HTTP 500, REQUEST_FAILED)',
    ),
  );
  expect(generate).toHaveBeenCalledTimes(1);
  expect(screen.queryByText('Report generated and saved.')).not.toBeInTheDocument();
});

it('exports only real saved report metadata from the reports API', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
  vi.spyOn(reportsApi, 'list').mockResolvedValue([
    {
      reportName: 'Actual monthly report',
      periodCovered: '2026-11-01 to 2026-11-30',
      totalReviewsAnalyzed: 7,
      createdAt: '2026-11-26T10:00:00.000Z',
      executiveSummary: '7 feedback responses analyzed.',
    },
  ]);
  const createObjectURL = vi.fn().mockReturnValue('blob:reports');
  Object.defineProperty(URL, 'createObjectURL', {
    value: createObjectURL,
    configurable: true,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    value: vi.fn(),
    configurable: true,
  });

  history.replaceState(null, '', '/#/reports');
  render(<App />);
  const exportButton = await screen.findByRole('button', { name: 'Export report list' });
  await waitFor(() => expect(exportButton).toBeEnabled());
  fireEvent.click(exportButton);

  expect(await screen.findByText('Saved report list exported as CSV.')).toBeVisible();
  expect(createObjectURL).toHaveBeenCalledTimes(1);
});
