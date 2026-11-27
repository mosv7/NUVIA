import { safeLocalStorage } from '../src/lib/storage.js';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, it, expect, vi } from 'vitest';
import App from '../src/app/App.jsx';
import { authApi } from '../src/features/auth/api.js';
import { feedbackApi } from '../src/features/feedback/api.js';

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

afterEach(() => {
  vi.restoreAllMocks();
  history.replaceState(null, '', '/');
  safeLocalStorage.setItem('nuvia-language', 'en');
});

it.each(['feedbacks', 'feedbacks-empty'])(
  'renders real account responses from the feedback API on %s',
  async (route) => {
    vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
    vi.spyOn(feedbackApi, 'list').mockResolvedValue({
      feedbacks: [
        {
          id: '012345678901234567890123',
          displayId: 7,
          surveyName: 'Actual Cafe survey',
          branchName: 'Main',
          preview: 'Great service',
          sentiment: 'positive',
          submittedAt: '2026-11-01T10:00:00.000Z',
          analysisStatus: 'completed',
        },
      ],
      pagination: { page: 1, totalPages: 1 },
    });
    vi.spyOn(feedbackApi, 'filters').mockResolvedValue({
      sentiments: ['positive'],
      branches: [{ id: 'b1', name: 'Main' }],
      surveys: [{ id: 's1', name: 'Actual Cafe survey' }],
    });
    history.replaceState(null, '', '/#/' + route);
    render(<App />);
    expect((await screen.findAllByRole('heading', { name: 'Feedbacks' }))[0]).toBeVisible();
    expect(await screen.findByText('Great service')).toBeVisible();
    expect(screen.getAllByText('Actual Cafe survey').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Actual Cafe').length).toBeGreaterThan(0);
    expect(screen.queryByText('Bloom & Co.')).not.toBeInTheDocument();
    expect(feedbackApi.list).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10 }),
      expect.any(AbortSignal),
    );

    fireEvent.change(screen.getByPlaceholderText('Search feedback'), {
      target: { value: 'Great' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(feedbackApi.list).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: 'Great' }),
      expect.any(AbortSignal),
    );
    expect(await screen.findByRole('link', { name: 'Export CSV' })).toHaveAttribute(
      'href',
      '/api/feedbacks/export?search=Great&range=30d',
    );
  },
);

it('shows an honest empty state when the account has no responses', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
  vi.spyOn(feedbackApi, 'list').mockResolvedValue({
    items: [],
    pagination: { page: 1, totalPages: 0 },
    hasAnyResponses: false,
  });
  vi.spyOn(feedbackApi, 'filters').mockResolvedValue({ sentiments: [], branches: [], surveys: [] });
  history.replaceState(null, '', '/#/feedbacks');
  render(<App />);
  expect(await screen.findByText('Your first response starts here')).toBeVisible();
  expect(screen.getByRole('table')).toBeVisible();
  expect(screen.getByText('0 responses')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Share a survey' })).toBeVisible();
  expect(screen.getByRole('link', { name: 'View sample responses' })).toHaveAttribute(
    'href',
    '/preview/#/feedbacks',
  );
});

it('opens an owned source on the account route and retries its failed analysis', async () => {
  const id = '012345678901234567890123';
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
  vi.spyOn(feedbackApi, 'detail').mockResolvedValue({
    id,
    number: 7,
    original: { question: 'How was your visit?', text: 'This is the original comment.' },
  });
  vi.spyOn(feedbackApi, 'analysis').mockResolvedValue({
    status: 'partial',
    aspects: [{ name: 'Service', quote: 'This is the original comment.', polarity: 'positive' }],
    provenance: { qualityAccepted: false },
  });
  const retry = vi.spyOn(feedbackApi, 'retryAnalysis').mockResolvedValue({ status: 'pending' });
  history.replaceState(null, '', `/#/feedback-details?id=${id}`);
  render(<App />);
  expect(
    await screen.findByText('Experimental analysis; quality has not been accepted.'),
  ).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Retry analysis' }));
  expect(await screen.findByText('Analysis retry queued.')).toBeVisible();
  expect(screen.getByText('This is the original comment.')).toBeVisible();
  expect(screen.getByRole('link', { name: 'Back to assistant' })).toHaveAttribute(
    'href',
    '#/nuvia-assistant',
  );
  expect(retry).toHaveBeenCalledWith(id, expect.any(AbortSignal));
});

it('ignores an out-of-order result after owner feedback filters change', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
  let finishPrevious;
  const earlier = new Promise((resolve) => {
    finishPrevious = resolve;
  });
  const list = vi.spyOn(feedbackApi, 'list').mockImplementation(({ search }) =>
    search === 'earlier'
      ? earlier
      : Promise.resolve({
          items: [{ id: 'response', preview: search || 'Initial response' }],
          hasAnyResponses: true,
        }),
  );
  vi.spyOn(feedbackApi, 'filters').mockResolvedValue({});
  history.replaceState(null, '', '/#/feedbacks');
  render(<App />);
  expect(await screen.findByText('Initial response')).toBeVisible();
  const search = screen.getByPlaceholderText('Search feedback');
  fireEvent.change(search, { target: { value: 'earlier' } });
  const previousSignal = list.mock.calls.at(-1)[1];
  fireEvent.change(search, { target: { value: 'Latest response' } });
  expect(await screen.findByText('Latest response')).toBeVisible();
  await act(async () => finishPrevious({ items: [{ id: 'old', preview: 'Stale response' }] }));
  expect(previousSignal.aborted).toBe(true);
  expect(screen.getByText('Latest response')).toBeVisible();
  expect(screen.queryByText('Stale response')).not.toBeInTheDocument();
});

it.each([
  [
    'en',
    'Create a survey for Bloom & Co. Once your first responses arrive, your metrics, charts and AI insights will appear here.',
  ],
  [
    'ar',
    'أنشئ استبيانًا لـ Bloom & Co. بمجرد وصول أول ردود العملاء، ستظهر هنا مؤشراتك ورسومك البيانية ورؤى الذكاء الاصطناعي.',
  ],
])(
  'preserves the reviewed overview empty copy in the %s design preview',
  async (language, copy) => {
    safeLocalStorage.setItem('nuvia-language', language);
    history.replaceState(null, '', '/preview/#/dashboard-empty');
    render(<App />);
    expect(await screen.findByText(copy)).toBeVisible();
  },
);

it('rejects a missing owned detail id without showing a sample or the empty list', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue({
    user: { id: 'owner' },
    workspace: {
      id: 'workspace',
      businessName: 'Actual Cafe',
      onboardingStep: 'complete',
      branches: [],
    },
  });
  const detail = vi.spyOn(feedbackApi, 'detail');
  history.replaceState(null, '', '/#/feedback-details');
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent('This feedback could not be loaded.');
  expect(detail).not.toHaveBeenCalled();
  expect(
    screen.queryByRole('heading', { name: 'Your first response starts here' }),
  ).not.toBeInTheDocument();
});
