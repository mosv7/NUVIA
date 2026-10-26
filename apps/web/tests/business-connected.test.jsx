import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import App from '../src/app/App.jsx';
import { authApi } from '../src/features/auth/api.js';
import { workspaceApi } from '../src/features/workspaces/api.js';
const workspace = {
  id: 'workspace',
  businessName: 'Actual Cafe',
  industry: 'Restaurant',
  locale: 'en',
  reportingTimezone: 'Africa/Cairo',
  onboardingStep: 'complete',
  branches: [{ id: 'primary', name: 'Saved branch', archivedAt: null }],
};
function setup(route) {
  vi.spyOn(authApi, 'session').mockResolvedValue({
    user: { id: 'owner', name: 'Actual Owner', email: 'owner@example.test', emailVerified: true },
    workspace,
  });
  vi.spyOn(workspaceApi, 'branches').mockResolvedValue(workspace.branches);
  history.replaceState(null, '', '/#/' + route);
  render(<App />);
}
it('saves approved business identity through the existing workspace API', async () => {
  const save = vi
    .spyOn(workspaceApi, 'save')
    .mockResolvedValue({ ...workspace, businessName: 'Updated Cafe' });
  setup('business');
  fireEvent.click(await screen.findByRole('button', { name: 'Edit profile', exact: true }));
  fireEvent.change(await screen.findByLabelText(/Business name/), {
    target: { value: 'Updated Cafe' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Save changes', exact: true }));
  await waitFor(() =>
    expect(save).toHaveBeenCalledWith(
      {
        businessName: 'Updated Cafe',
        industry: 'Restaurant',
        locale: 'en',
        reportingTimezone: 'Africa/Cairo',
      },
      expect.any(AbortSignal),
    ),
  );
  expect(await screen.findByRole('heading', { name: 'Updated Cafe' })).toBeVisible();
  expect(screen.queryByText('Bloom & Co.')).not.toBeInTheDocument();
});
it('does not claim an unsupported location field is persisted when adding a branch', async () => {
  const create = vi
    .spyOn(workspaceApi, 'createBranch')
    .mockResolvedValue({ id: 'new', name: 'Second branch' });
  setup('branch-add');
  const name = await screen.findByLabelText(/Branch name/);
  expect(screen.getByLabelText(/Country/)).toBeDisabled();
  expect(screen.getByLabelText(/City/)).toBeDisabled();
  fireEvent.change(name, { target: { value: 'Second branch' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save branch', exact: true }));
  await waitFor(() =>
    expect(create).toHaveBeenCalledWith(
      'workspace',
      { name: 'Second branch' },
      expect.any(AbortSignal),
    ),
  );
  await waitFor(() => expect(location.hash).toBe('#/branches'));
});
it('keeps the edited values and reports failure instead of optimistic success', async () => {
  vi.spyOn(workspaceApi, 'save').mockRejectedValue(new Error('NETWORK_ERROR'));
  setup('business-edit');
  fireEvent.change(await screen.findByLabelText(/Business name/), {
    target: { value: 'Retained Cafe' },
  });
  fireEvent.change(screen.getByLabelText(/Business type/), { target: { value: 'Restaurant' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save changes', exact: true }));
  expect(await screen.findByRole('status')).toHaveTextContent(
    'Could not save changes. Please try again.',
  );
  expect(screen.getByLabelText(/Business name/)).toHaveValue('Retained Cafe');
  expect(location.hash).toBe('#/business-edit');
});
