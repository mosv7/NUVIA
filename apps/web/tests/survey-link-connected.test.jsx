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

it('shares only live surveys and copies the selected server-generated branch link', async () => {
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
      {
        id: '507f1f77bcf86cd799439012',
        name: 'Unpublished survey',
        status: 'draft',
        shortCode: 'draft-code',
      },
    ],
  });
  vi.spyOn(surveyApi, 'summary').mockResolvedValue({});
  vi.spyOn(surveyApi, 'templates').mockResolvedValue([]);
  const surveyUrl = 'https://customer.example/#/public-survey?code=abc123';
  const branchUrl = `${surveyUrl}&branch=main`;
  const share = vi.spyOn(surveyApi, 'share').mockResolvedValue({
    survey: { name: 'Real survey' },
    link: surveyUrl,
    branches: [{ id: 'branch-id', name: 'Main', slug: 'main', link: branchUrl }],
  });
  const writeText = vi.fn().mockResolvedValue();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });

  history.replaceState(null, '', '/#/surveys');
  render(<App />);
  expect(await screen.findAllByRole('link', { name: 'Share survey' })).toHaveLength(1);
  expect(screen.getByText('Unpublished survey').closest('tr')).not.toHaveTextContent(
    'Share survey',
  );
  location.hash = screen.getByRole('link', { name: 'Share survey' }).hash;

  const branch = await screen.findByRole('combobox', { name: 'Branch' });
  expect(share).toHaveBeenCalledWith('507f1f77bcf86cd799439011', expect.any(AbortSignal));
  fireEvent.change(branch, { target: { value: 'branch-id' } });
  expect(screen.getByRole('link', { name: 'Open public link' })).toHaveAttribute('href', branchUrl);
  fireEvent.click(screen.getByRole('button', { name: 'Copy public link' }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith(branchUrl));
  expect(await screen.findByRole('status')).toHaveTextContent('Public survey link copied.');
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
