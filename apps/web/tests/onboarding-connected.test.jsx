import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import App from '../src/app/App.jsx';
import { authApi } from '../src/features/auth/api.js';
import { workspaceApi } from '../src/features/workspaces/api.js';
it('failed business save retains fields and stays on the current persisted step', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue({
    user: { id: 'a', emailVerified: true },
    workspace: null,
  });
  vi.spyOn(workspaceApi, 'save').mockRejectedValue({ code: 'NETWORK_ERROR' });
  history.replaceState(null, '', '/#/business-information');
  render(<App />);
  await screen.findByRole('heading', { name: 'Business information' });
  fireEvent.change(screen.getByLabelText(/Business name/), { target: { value: 'Test Cafe' } });
  fireEvent.change(screen.getByLabelText(/Business type/), { target: { value: 'Cafe' } });
  fireEvent.click(screen.getByRole('button', { name: 'Continue', exact: true }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not save');
  expect(screen.getByLabelText(/Business name/)).toHaveValue('Test Cafe');
  expect(location.hash).toBe('#/business-information');
});
