import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { it, expect, vi, beforeEach } from 'vitest';
import App from '../../src/frontend/src/App.jsx';
import { authApi } from '../../src/frontend/src/services/auth.js';
import { resetApiSession } from '../../src/frontend/src/services/api.js';
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
it('real signup creates an account and moves to verification while clearing credentials', async () => {
  const register = vi.spyOn(authApi, 'register').mockResolvedValue({ id: 'owner' });
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
  expect(await screen.findByRole('heading', { name: 'Verify your email' })).toBeVisible();
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
  expect(screen.queryByRole('button', { name: 'Open Ask NUVIA' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Log out' })).toBeVisible();
});
it('consumes a verification link opened while the verification page is already mounted', async () => {
  const verify = vi.spyOn(authApi, 'verify').mockResolvedValue({ status: 'verified' });
  open('verify-email');
  await act(async () => {
    location.hash = '/verify-email?token=' + 'a'.repeat(64);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(await screen.findByText('Email verified. You can log in now.')).toBeVisible();
  expect(verify).toHaveBeenCalledTimes(1);
  expect(location.hash).not.toContain('token=');
});
it('preview verification never bootstraps sessions or sends real verification requests', async () => {
  const verify = vi.spyOn(authApi, 'verify').mockResolvedValue({ status: 'verified' });
  const resend = vi.spyOn(authApi, 'resend').mockResolvedValue({ status: 'accepted' });
  history.replaceState(null, '', '/preview/#/verify-email');
  render(<App />);
  await act(async () => {});
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'owner@example.test' } });
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
