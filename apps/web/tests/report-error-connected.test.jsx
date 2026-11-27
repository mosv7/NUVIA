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
  vi.spyOn(reportsApi, 'listPage').mockResolvedValue({ reports: [] });
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
  const list = vi.spyOn(reportsApi, 'listPage').mockImplementation(async (page) => ({
    reports:
      page === 1
        ? [{ reportName: 'First report page' }]
        : [
            {
              reportName: 'Actual monthly report',
              periodCovered: '2026-11-01 to 2026-11-30',
              totalReviewsAnalyzed: 7,
              createdAt: '2026-11-26T10:00:00.000Z',
              executiveSummary: '7 feedback responses analyzed.',
            },
          ],
    pagination: { page, hasMore: page === 1 },
  }));
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
  fireEvent.click(await screen.findByRole('button', { name: 'Next' }));
  expect(await screen.findByText('Actual monthly report')).toBeVisible();
  expect(screen.queryByText('First report page')).not.toBeInTheDocument();
  expect(list).toHaveBeenLastCalledWith(2, expect.any(AbortSignal));
  const exportButton = await screen.findByRole('button', { name: 'Export current page' });
  await waitFor(() => expect(exportButton).toBeEnabled());
  fireEvent.click(exportButton);

  expect(await screen.findByText('Current report page exported as CSV.')).toBeVisible();
  expect(createObjectURL).toHaveBeenCalledTimes(1);
});

it('shows the saved report quality and links each cited quote to its owned feedback', async () => {
  const id = '012345678901234567890123';
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
  const get = vi.spyOn(reportsApi, 'get').mockResolvedValue({
    reportName: 'Actual monthly report',
    executiveSummary: 'One analyzed response.',
    qualityStatus: 'baseline',
    qualityAccepted: false,
    strengths: [
      {
        text: 'Customers liked the service.',
        citations: [{ responseId: id, number: 7, quote: 'Great service' }],
      },
    ],
  });
  history.replaceState(null, '', '/#/report-details?id=507f1f77bcf86cd799439012');
  render(<App />);

  expect(
    await screen.findByText('Experimental AI output. Quality has not been accepted.'),
  ).toBeVisible();
  expect(screen.getByText('Great service', { exact: false })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Feedback #7' })).toHaveAttribute(
    'href',
    `#/feedback-details?id=${id}`,
  );
  expect(get).toHaveBeenCalledWith('507f1f77bcf86cd799439012', expect.any(AbortSignal));
});
