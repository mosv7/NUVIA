import { render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../src/app/App.jsx';
import { authApi } from '../src/features/auth/api.js';
import { analyticsApi } from '../src/features/analytics/api.js';

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
});

it('renders real saved recommendations from the overview next-actions API', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
  const nextActions = vi.spyOn(analyticsApi, 'nextActions').mockResolvedValue({
    reportName: 'Actual monthly report',
    actions: ['Review waiting-time feedback', 'Clarify combo pricing'],
  });

  history.replaceState(null, '', '/#/action-board');
  render(<App />);

  expect(await screen.findByText('Review waiting-time feedback')).toBeVisible();
  expect(screen.getByText('Clarify combo pricing')).toBeVisible();
  expect(nextActions).toHaveBeenCalledTimes(1);
  expect(screen.queryByText('This feature is not available yet.')).not.toBeInTheDocument();
});

it('shows an honest empty action board when no saved report has recommendations', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
  vi.spyOn(analyticsApi, 'nextActions').mockResolvedValue({ reportName: null, actions: [] });

  history.replaceState(null, '', '/#/action-board');
  render(<App />);

  expect(
    await screen.findByText(
      'No saved recommendations yet. Actions appear when a generated report includes them.',
    ),
  ).toBeVisible();
});

it('keeps production evidence preview-only without invented data', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());

  history.replaceState(null, '', '/#/evidence');
  render(<App />);

  expect(
    await screen.findByRole('heading', { name: 'This feature is not available yet.' }),
  ).toBeVisible();
  expect(screen.queryByText('104 Cairo delay reviews')).not.toBeInTheDocument();
});
