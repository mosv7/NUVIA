import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { it, expect, vi, beforeEach } from 'vitest';
import App from '../src/app/App.jsx';
import { authApi } from '../src/features/auth/api.js';
import { resetApiSession } from '../src/lib/http/client.js';
beforeEach(() => {
  resetApiSession();
  vi.spyOn(authApi, 'session').mockResolvedValue({ user: null, workspace: null });
});
function open(route) {
  history.replaceState(null, '', `/#/${route}`);
  render(<App />);
}
it('redirects anonymous private navigation to login without displaying sample analytics', async () => {
  open('dashboard');
  expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeVisible();
  expect(screen.queryByText('1,248')).not.toBeInTheDocument();
});
it('real signup enters persistent onboarding without claiming email verification', async () => {
  const register = vi
    .spyOn(authApi, 'register')
    .mockResolvedValue({ data: { user: { id: 'owner' } } });
  authApi.session.mockResolvedValueOnce({ user: null, workspace: null }).mockResolvedValueOnce({
    user: {
      id: 'owner',
      name: 'Owner',
      email: 'owner@example.test',
      emailVerificationAvailable: false,
    },
    workspace: null,
  });
  open('signup');
  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Owner' } });
  fireEvent.change(screen.getByLabelText('Work email'), {
    target: { value: 'owner@example.test' },
  });
  fireEvent.change(screen.getByLabelText('Password', { exact: true }), {
    target: { value: 'Synthetic123' },
  });
  fireEvent.change(screen.getByLabelText('Confirm password'), {
    target: { value: 'Synthetic123' },
  });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Create account', exact: true }));
  expect(await screen.findByRole('heading', { name: 'Business information' })).toBeVisible();
  expect(location.hash).toBe('#/business-information');
  expect(screen.queryByRole('heading', { name: 'Email verified' })).not.toBeInTheDocument();
  expect(register).toHaveBeenCalledWith(
    expect.objectContaining({ email: 'owner@example.test', locale: 'en' }),
    expect.any(AbortSignal),
  );
  expect(JSON.stringify({ ...localStorage })).not.toContain('Synthetic123');
});
it('a stale login result cannot navigate or clear a new account submission', async () => {
  let finish;
  vi.spyOn(authApi, 'login').mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  open('login');
  fireEvent.change(screen.getByLabelText('Work email'), {
    target: { value: 'owner@example.test' },
  });
  fireEvent.change(screen.getByLabelText('Password', { exact: true }), {
    target: { value: 'Synthetic123' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Log in', exact: true }));
  await waitFor(() => expect(finish).toBeTypeOf('function'));
  await act(async () => {
    location.hash = '/signup';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  await act(async () => finish({ user: { id: 'owner' } }));
  expect(screen.getByRole('heading', { name: 'Create your account' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Create account', exact: true })).toBeEnabled();
});
it('account-backed Overview uses saved business labels and hides sample feedback and assistant claims', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue({
    user: { id: 'a', emailVerified: true },
    workspace: {
      id: 'w',
      businessName: 'Saved Cafe',
      industry: 'Restaurant',
      branchType: 'multiple',
      primaryBranchId: 'b',
      onboardingStep: 'complete',
      branches: [{ id: 'b', name: 'Saved Branch' }],
    },
  });
  open('dashboard');
  expect((await screen.findAllByText('Saved Cafe', { exact: true }))[0]).toBeVisible();
  expect(screen.queryByText('Bloom & Co.', { exact: true })).not.toBeInTheDocument();
  expect(screen.queryByText('12', { exact: true })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Log out', exact: true })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Open Ask NUVIA' }));
  expect(screen.getByRole('dialog', { name: 'Ask NUVIA' })).toBeVisible();
  expect(screen.queryByText('Cairo’s wait times need a closer look')).not.toBeInTheDocument();
  expect(screen.getAllByText(/AI Assistant is not available yet/).length).toBeGreaterThan(0);
  expect(location.hash).toBe('#/dashboard');
  fireEvent.click(screen.getByRole('button', { name: 'Close assistant' }));
  expect(screen.queryByText('Cairo’s wait times need a closer look')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Notifications', exact: true }));
  expect(
    screen.getByText('No notifications yet. Updates about your workspace will appear here.'),
  ).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Profile', exact: true }));
  expect(screen.getByRole('button', { name: 'Sign out', exact: true })).toBeVisible();
  expect(screen.queryByText('Sample workspace profile')).not.toBeInTheDocument();
  const logout = vi.spyOn(authApi, 'logout').mockResolvedValue(undefined);
  fireEvent.click(screen.getByRole('button', { name: 'Sign out', exact: true }));
  expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeVisible();
  expect(logout).toHaveBeenCalledTimes(1);
});
it('marks old real verification links under development without consuming tokens', async () => {
  const verify = vi.spyOn(authApi, 'verify');
  open('verify-email?token=' + 'a'.repeat(64));
  expect(
    await screen.findByRole('heading', { name: 'Email verification is under development' }),
  ).toBeVisible();
  expect(verify).not.toHaveBeenCalled();
});
it('preview verification never bootstraps sessions or sends real verification requests', async () => {
  const verify = vi.spyOn(authApi, 'verify').mockResolvedValue({ status: 'verified' });
  const resend = vi.spyOn(authApi, 'resend').mockResolvedValue({ status: 'accepted' });
  history.replaceState(null, '', '/preview/#/verify-email');
  render(<App />);
  await act(async () => {});
  fireEvent.click(screen.getByRole('button', { name: 'Change', exact: true }));
  fireEvent.change(screen.getByLabelText('Email address'), {
    target: { value: 'owner@example.test' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Resend verification link' }));
  await act(async () => {});
  await act(async () => {
    location.hash = '/verify-email?token=' + 'a'.repeat(64);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(verify).not.toHaveBeenCalled();
  expect(resend).not.toHaveBeenCalled();
  expect(authApi.session).not.toHaveBeenCalled();
});

it.each([
  ['verify-email-expired', 'This link has expired'],
  ['verify-email-verified', 'Email verified'],
])('shows the original %s design only in explicit preview mode', async (route, title) => {
  const verify = vi.spyOn(authApi, 'verify').mockResolvedValue({});
  history.replaceState(null, '', '/preview/#/' + route);
  render(<App />);
  expect(await screen.findByRole('heading', { name: title, exact: true })).toBeVisible();
  expect(verify).not.toHaveBeenCalled();
  expect(authApi.session).not.toHaveBeenCalled();
});

it('opens the connected assistant workspace without sample conversations or metrics', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue({
    user: { id: 'a', name: 'Saved Owner', email: 'owner@example.test', emailVerified: true },
    workspace: {
      id: 'w',
      businessName: 'Saved Cafe',
      industry: 'Restaurant',
      primaryBranchId: 'b',
      onboardingStep: 'complete',
      branches: [{ id: 'b', name: 'Saved Branch' }],
    },
  });
  open('dashboard');
  fireEvent.click(await screen.findByRole('button', { name: 'NUVIA Assistant', exact: true }));
  expect(await screen.findByText('AI Assistant', { exact: true })).toBeVisible();
  expect(
    screen.getByText(
      'AI Assistant is not available yet. Your conversations will appear here when the service is available.',
    ),
  ).toBeVisible();
  expect(screen.getByText('0 reviews')).toBeVisible();
  expect(screen.getByText('Saved Branch', { exact: true })).toBeVisible();
  expect(screen.queryByText('1,250 reviews')).not.toBeInTheDocument();
  expect(screen.queryByText('Sample feedback scope')).not.toBeInTheDocument();
  expect(screen.getByText('Sara Ahmed · Just now')).not.toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Profile', exact: true }));
  fireEvent.click(screen.getByRole('button', { name: 'View profile', exact: true }));
  expect(location.hash).toBe('#/settings');
  expect(screen.queryByRole('dialog', { name: 'Profile' })).not.toBeInTheDocument();
  expect(screen.queryByText('Sample workspace profile')).not.toBeInTheDocument();
});
