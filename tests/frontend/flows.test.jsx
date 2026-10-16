import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../../src/frontend/src/App.jsx';
import * as auth from '../../src/frontend/src/services/auth.js';

function openRoute(route) {
  history.replaceState(null, '', '/#/' + route);
  render(<App />);
}

describe('bilingual frontend flows', () => {
  it('switches the landing page to Arabic and persists the language preference', async () => {
    const user = userEvent.setup();
    openRoute('landing');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Language / اللغة' }), 'ar');
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    expect(document.documentElement).toHaveAttribute('lang', 'ar');
    expect(localStorage.getItem('nuvia-language')).toBe('ar');
    expect(screen.getByRole('link', { name: 'تسجيل الدخول' })).toBeVisible();
  });

  it('blocks invalid signup and never persists a password', async () => {
    const user = userEvent.setup();
    openRoute('signup');
    await user.click(screen.getByRole('button', { name: 'Create account', exact: true }));
    expect(screen.getAllByText('This field is required.').length).toBeGreaterThan(0);
    await user.type(screen.getByLabelText('Full name'), 'Demo owner');
    await user.type(screen.getByLabelText('Work email'), 'invalid-address');
    await user.type(screen.getByLabelText('Password', { exact: true }), 'short');
    await user.click(screen.getByRole('button', { name: 'Create account', exact: true }));
    expect(screen.getByText('Enter a valid email address.')).toBeVisible();
    expect(Object.values(localStorage)).not.toContain('short');
    expect(location.hash).toBe('#/signup');
  });

  it('requires business details and a primary branch, then carries them to the final step', async () => {
    const user = userEvent.setup();
    openRoute('business-information');
    await user.click(screen.getByRole('button', { name: 'Continue', exact: true }));
    expect(screen.getByText('Enter your business name to continue.')).toBeVisible();
    expect(screen.getByText('Enter an industry to continue.')).toBeVisible();
    await user.type(screen.getByLabelText(/Business name/), 'Demo Cafe');
    await user.type(screen.getByLabelText(/Business type/), 'Cafe');
    await user.click(screen.getByRole('button', { name: 'Continue', exact: true }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Business setup' })).toBeVisible(),
    );
    await user.click(screen.getByRole('button', { name: 'Continue', exact: true }));
    expect(screen.getByText('Enter your primary branch name to continue.')).toBeVisible();
    await user.type(screen.getByLabelText(/Primary branch name/), 'Main branch');
    await user.click(screen.getByRole('button', { name: 'Continue', exact: true }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Welcome to NUVIA' })).toBeVisible(),
    );
    expect(screen.getByText('Demo Cafe')).toBeVisible();
    expect(screen.getByText(/Main branch/)).toBeVisible();
    expect(localStorage.getItem('businessName')).toBeNull();
  });

  it('shows the demo response after valid signup without creating a session', async () => {
    const user = userEvent.setup();
    openRoute('signup');
    await user.type(screen.getByLabelText('Full name'), 'Demo owner');
    await user.type(screen.getByLabelText('Work email'), 'demo@example.com');
    await user.type(screen.getByLabelText('Password', { exact: true }), 'Synthetic123');
    await user.type(screen.getByLabelText('Confirm password'), 'Synthetic123');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Create account', exact: true }));
    expect(await screen.findByRole('status')).toHaveTextContent('No account was created.');
    expect(location.hash).toBe('#/signup');
    expect(JSON.stringify({ ...localStorage })).not.toContain('Synthetic123');
  });

  it('supports keyboard focus and password visibility without losing typed text', async () => {
    const user = userEvent.setup();
    openRoute('login');
    const password = screen.getByLabelText('Password', { exact: true });
    await user.click(password);
    await user.type(password, 'Synthetic123');
    await user.tab();
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(password).toHaveAttribute('type', 'text');
    expect(password).toHaveValue('Synthetic123');
    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(password).toHaveAttribute('type', 'password');
  });
});

it('ignores a pending login response after navigating to signup, including its busy state', async () => {
  let finishLogin, finishSignup;
  vi.spyOn(auth, 'submitDemo')
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishLogin = resolve;
        }),
    )
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishSignup = resolve;
        }),
    );
  openRoute('login');
  fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'demo@example.com' } });
  fireEvent.change(screen.getByLabelText('Password', { exact: true }), {
    target: { value: 'Synthetic123' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Log in', exact: true }));
  await waitFor(() => expect(finishLogin).toBeTypeOf('function'));
  await act(async () => {
    history.replaceState(null, '', '/#/signup');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.getByRole('button', { name: 'Create account', exact: true })).toBeEnabled();
  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Demo owner' } });
  fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'demo@example.com' } });
  fireEvent.change(screen.getByLabelText('Password', { exact: true }), {
    target: { value: 'Synthetic123' },
  });
  fireEvent.change(screen.getByLabelText('Confirm password'), {
    target: { value: 'Synthetic123' },
  });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Create account', exact: true }));
  await waitFor(() => expect(finishSignup).toBeTypeOf('function'));
  await act(async () => {
    finishLogin({ error: 'loginFailed' });
  });
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(document.querySelector('.signup button[type=submit]')).toBeDisabled();
  await act(async () => {
    finishSignup({ message: 'accountDemo' });
  });
  expect(screen.getByRole('status')).toHaveTextContent('No account was created.');
});
