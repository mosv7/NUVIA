import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../src/app/App.jsx';
import { authApi } from '../src/features/auth/api.js';

const ownerSession = () => ({
  user: { id: 'owner', name: 'Actual Owner', email: 'owner@example.test', emailVerified: true },
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

it('states that demo booking did not send a request', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
  history.replaceState(null, '', '/#/landing');
  render(<App />);

  fireEvent.change(await screen.findByPlaceholderText('Your name'), {
    target: { value: 'Actual Person' },
  });
  fireEvent.change(screen.getByPlaceholderText('you@company.com'), {
    target: { value: 'actual@example.test' },
  });
  fireEvent.change(screen.getByPlaceholderText('Company name'), {
    target: { value: 'Actual Cafe' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Book my demo' }));

  expect(
    await screen.findByText('Demo only: your details were checked. No booking or email was sent.'),
  ).toBeVisible();
});

it('shows an explicit unavailable notification state in production', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
  history.replaceState(null, '', '/#/dashboard');
  render(<App />);

  fireEvent.click(await screen.findByRole('button', { name: 'Notifications' }));

  expect(await screen.findByText('Notifications are not available yet')).toBeVisible();
  expect(screen.queryByText('You’re all caught up')).not.toBeInTheDocument();
});

it('uses the real connected identity in the production profile popover', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(ownerSession());
  history.replaceState(null, '', '/#/dashboard');
  render(<App />);

  fireEvent.click(await screen.findByRole('button', { name: 'Profile' }));

  await waitFor(() => expect(screen.getAllByText('Actual Cafe').length).toBeGreaterThan(0));
  expect(screen.getAllByText('Actual Owner').length).toBeGreaterThan(0);
  expect(screen.queryByText('Sample workspace profile')).not.toBeInTheDocument();
});
