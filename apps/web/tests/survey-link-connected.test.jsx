import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../src/app/App.jsx';
import { authApi } from '../src/features/auth/api.js';
import { surveyApi } from '../src/features/surveys/api.js';

const originalClipboard = navigator.clipboard;

afterEach(() => {
  vi.restoreAllMocks();
  history.replaceState(null, '', '/');
  Object.defineProperty(navigator, 'clipboard', {
    value: originalClipboard,
    configurable: true,
  });
});

it('copies a real shortCode as a same-origin public survey link', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue({
    user: { id: 'owner', name: 'Actual Owner', emailVerified: true },
    workspace: {
      id: 'workspace',
      businessName: 'Actual Cafe',
      industry: 'Cafe',
      onboardingStep: 'complete',
      branches: [],
    },
  });
  vi.spyOn(surveyApi, 'list').mockResolvedValue({
    surveys: [
      {
        id: '507f1f77bcf86cd799439011',
        name: 'Real survey',
        status: 'live',
        shortCode: 'abc123',
        questionCount: 1,
        responseCount: 0,
      },
    ],
  });
  vi.spyOn(surveyApi, 'summary').mockResolvedValue({});
  vi.spyOn(surveyApi, 'templates').mockResolvedValue([]);
  const writeText = vi.fn().mockResolvedValue();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });

  history.replaceState(null, '', '/#/surveys');
  render(<App />);
  fireEvent.click(
    await screen.findByRole('button', { name: 'Copy public link' }, undefined, { timeout: 5000 }),
  );

  await waitFor(() =>
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/#/public-survey?code=abc123`),
  );
  expect(await screen.findByText(/Keep the original site origin/)).toBeVisible();
  expect(screen.queryByText(/nuvia\.link/)).not.toBeInTheDocument();
});

it('opens the real create-survey editor from the registered create action', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue({
    user: { id: 'owner', name: 'Actual Owner', emailVerified: true },
    workspace: {
      id: 'workspace',
      businessName: 'Actual Cafe',
      industry: 'Cafe',
      onboardingStep: 'complete',
      branches: [],
    },
  });
  vi.spyOn(surveyApi, 'list').mockResolvedValue({ surveys: [] });
  vi.spyOn(surveyApi, 'summary').mockResolvedValue({});
  vi.spyOn(surveyApi, 'templates').mockResolvedValue([]);

  history.replaceState(null, '', '/#/surveys?create=1');
  render(<App />);

  expect(await screen.findByRole('heading', { name: 'Create survey' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Create', exact: true })).toBeVisible();
});
