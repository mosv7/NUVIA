import { render, screen, waitFor } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import SecurityActionPage from '../src/features/auth/SecurityActionPage.jsx';
vi.mock('../src/app/providers/AuthProvider.jsx', () => ({ useAuth: () => ({}) }));
it('reacts to a new token even when the previous confirmation state was already ready', async () => {
  history.replaceState(null, '', '/#/confirm-email');
  const props = { page: 'confirm-email', language: 'en', setLanguage: vi.fn() };
  const { rerender } = render(<SecurityActionPage {...props} />);
  expect(screen.getByRole('button', { name: 'Confirm new email', exact: true })).toBeDisabled();
  history.replaceState(null, '', '/#/confirm-email?token=' + 'c'.repeat(64));
  rerender(<SecurityActionPage {...props} />);
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Confirm new email', exact: true })).toBeEnabled(),
  );
});
