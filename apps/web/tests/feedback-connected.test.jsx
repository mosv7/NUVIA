import { safeLocalStorage } from '../src/lib/storage.js';
import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(feedbackApi.list).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 10 }));

    fireEvent.change(screen.getByPlaceholderText('Search feedback'), {
      target: { value: 'Great' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(feedbackApi.list).toHaveBeenLastCalledWith(expect.objectContaining({ search: 'Great' }));
  },
);

it('shows an honest empty state when the account has no responses', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
  vi.spyOn(feedbackApi, 'list').mockResolvedValue({
    feedbacks: [],
    pagination: { page: 1, totalPages: 0 },
  });
  vi.spyOn(feedbackApi, 'filters').mockResolvedValue({ sentiments: [], branches: [], surveys: [] });
  history.replaceState(null, '', '/#/feedbacks');
  render(<App />);
  expect(await screen.findByText('No responses yet.')).toBeVisible();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
  expect(screen.queryByText('Your first response starts here')).not.toBeInTheDocument();
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
