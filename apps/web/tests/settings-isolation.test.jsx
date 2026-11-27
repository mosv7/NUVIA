import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import renderSecurityPages from '../src/features/workspace/SecurityPages.jsx';
import WorkspaceDialogs from '../src/features/workspace/WorkspaceDialogs.jsx';
import useWorkspaceModel from '../src/features/workspace/useWorkspaceModel.jsx';

const { api, auth } = vi.hoisted(() => ({
  api: {
    account: vi.fn(),
    updateAccount: vi.fn(),
    setAvatar: vi.fn(),
    removeAvatar: vi.fn(),
    language: vi.fn(),
    updateLanguage: vi.fn(),
    notifications: vi.fn(),
    updateNotifications: vi.fn(),
    pendingEmailChange: vi.fn(),
    requestEmailChange: vi.fn(),
    cancelEmailChange: vi.fn(),
    changePassword: vi.fn(),
    security: vi.fn(),
    sessions: vi.fn(),
    setupTwoFactor: vi.fn(),
    enableTwoFactor: vi.fn(),
    disableTwoFactor: vi.fn(),
    revokeSession: vi.fn(),
    signOutAll: vi.fn(),
  },
  auth: { user: { id: 'owner' }, preview: false, refresh: vi.fn(), saveWorkspace: vi.fn() },
}));

vi.mock('../src/features/settings/api.js', () => ({ settingsApi: api }));
vi.mock('../src/app/providers/AuthProvider.jsx', () => ({ useAuth: () => auth }));

const profile = { name: 'Owner', email: 'owner@example.test', avatarUrl: '/api/settings/avatar' };

function deferred() {
  let resolve;
  const promise = new Promise((done) => (resolve = done));
  return { resolve, promise };
}

beforeEach(() => {
  vi.resetAllMocks();
  auth.preview = false;
  api.account.mockResolvedValue(profile);
  api.language.mockResolvedValue({});
  api.security.mockResolvedValue({ twoFactorEnabled: false });
  api.sessions.mockResolvedValue([]);
});

function navigate(destination) {
  act(() => {
    location.hash = '/' + destination;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
}

it('simulates signing out preview devices without reaching the account', () => {
  auth.preview = true;
  history.replaceState(null, '', '/preview/#/settings-devices');
  function Devices() {
    const model = useWorkspaceModel({ language: 'en' });
    return (
      <>
        {renderSecurityPages(model)}
        <WorkspaceDialogs model={model} />
      </>
    );
  }
  render(<Devices />);
  fireEvent.click(screen.getAllByRole('button', { name: 'Sign out', exact: true })[0]);
  fireEvent.click(
    within(screen.getByRole('dialog')).getByRole('button', { name: 'Sign out', exact: true }),
  );
  expect(screen.getAllByRole('button', { name: 'Sign out', exact: true })).toHaveLength(2);
  fireEvent.click(screen.getByRole('button', { name: 'Sign out of all devices' }));
  expect(screen.getByRole('dialog')).toHaveTextContent('simulated in the preview');
  fireEvent.click(
    within(screen.getByRole('dialog')).getByRole('button', { name: 'Sign out', exact: true }),
  );
  expect(screen.getByText('No active sessions found.')).toBeInTheDocument();
  expect(api.signOutAll).not.toHaveBeenCalled();
  expect(api.revokeSession).not.toHaveBeenCalled();
  expect(auth.refresh).not.toHaveBeenCalled();
  expect(location.hash).toBe('#/settings-devices');
});

it('keeps preview settings edits local', async () => {
  auth.preview = true;
  history.replaceState(null, '', '/preview/#/settings-profile');
  const setLanguage = vi.fn();
  const { result } = renderHook(() => useWorkspaceModel({ language: 'en', setLanguage }));
  act(() => result.current.setDraft({ name: 'Sample Owner', email: 'preview@example.test' }));
  await act(async () => result.current.saveEmailChange());
  expect(result.current.pending).toBe('preview@example.test');
  await act(async () => result.current.cancelEmailChange());
  expect(result.current.pending).toBe('');
  act(() => result.current.setDraft({ name: 'Sample Owner' }));
  await act(async () => result.current.saveAccount());
  expect(result.current.account.name).toBe('Sample Owner');
  act(() => result.current.setPrefDraft({ ...result.current.prefDraft, language: 'ar' }));
  await act(async () => result.current.saveLanguage());
  expect(setLanguage).toHaveBeenCalledWith('ar');
  act(() => result.current.setSwitchDraft({ ...result.current.switchDraft, email: false }));
  await act(async () => result.current.saveNotifications('settings-notifications'));
  expect(result.current.toggles.email).toBe(false);
  await act(async () => result.current.enableTwoFactor());
  expect(result.current.twoFA).toBe(true);
  await act(async () => result.current.disableTwoFactor());
  expect(result.current.twoFA).toBe(false);
  await act(async () => result.current.savePassword());
  for (const request of Object.values(api)) expect(request).not.toHaveBeenCalled();
  expect(auth.refresh).not.toHaveBeenCalled();
});

it('ignores a late profile save after navigation and skips its follow-up avatar request', async () => {
  history.replaceState(null, '', '/#/settings-profile');
  const request = deferred();
  api.updateAccount.mockReturnValue(request.promise);
  const { result } = renderHook(() => useWorkspaceModel({ language: 'en' }));
  await waitFor(() => expect(result.current.draft.name).toBe('Owner'));
  act(() =>
    result.current.setDraft({ name: 'Updated name', photoFile: new File([''], 'photo.png') }),
  );
  act(() => {
    void result.current.saveAccount();
  });
  expect(api.updateAccount).toHaveBeenCalledTimes(1);
  const signal = api.updateAccount.mock.calls[0][1];
  navigate('settings-language');
  expect(signal.aborted).toBe(true);
  await waitFor(() => expect(result.current.settingsLoading).toBe(false));
  act(() => result.current.setPrefDraft({ ...result.current.prefDraft, zone: 'Europe/London' }));
  await act(async () => request.resolve({ ...profile, name: 'Updated name' }));
  expect(location.hash).toBe('#/settings-language');
  expect(result.current.prefDraft.zone).toBe('Europe/London');
  expect(api.setAvatar).not.toHaveBeenCalled();
});

it('retains the profile draft when the saved profile succeeds and the avatar step fails', async () => {
  history.replaceState(null, '', '/#/settings-profile');
  api.updateAccount.mockResolvedValue({ ...profile, name: 'Updated name' });
  api.setAvatar.mockRejectedValue(new Error('UPLOAD_FAILED'));
  const { result } = renderHook(() => useWorkspaceModel({ language: 'en' }));
  await waitFor(() => expect(result.current.settingsLoading).toBe(false));
  const photoFile = new File(['photo'], 'photo.png');
  act(() => result.current.setDraft({ ...result.current.draft, name: 'Updated name', photoFile }));
  await act(async () => result.current.saveAccount());
  expect(result.current.account.name).toBe('Updated name');
  expect(result.current.draft.photoFile).toBe(photoFile);
  expect(result.current.toast).toBe('Could not save account details.');
  expect(location.hash).toBe('#/settings-profile');
});

it('clears the password draft and ignores its late save after navigation', async () => {
  history.replaceState(null, '', '/#/settings-password');
  const request = deferred();
  api.changePassword.mockReturnValue(request.promise);
  const { result } = renderHook(() => useWorkspaceModel({ language: 'en' }));
  act(() => result.current.setDraft({ current: 'current', password: 'next', confirm: 'next' }));
  act(() => {
    void result.current.savePassword();
    void result.current.savePassword();
  });
  expect(api.changePassword).toHaveBeenCalledTimes(1);
  navigate('settings-language');
  expect(result.current.draft).toEqual({});
  expect(api.changePassword.mock.calls[0][1].aborted).toBe(true);
  await act(async () => request.resolve({}));
  expect(location.hash).toBe('#/settings-language');
  expect(auth.refresh).not.toHaveBeenCalled();
});

it('skips the session refresh when the device sign-out reply arrives after navigation', async () => {
  history.replaceState(null, '', '/#/settings-devices');
  const request = deferred();
  api.signOutAll.mockReturnValue(request.promise);
  const { result } = renderHook(() => useWorkspaceModel({ language: 'en' }));
  await waitFor(() => expect(result.current.settingsLoading).toBe(false));
  act(() => {
    void result.current.signOutAllSessions();
  });
  navigate('settings-language');
  await act(async () => request.resolve({}));
  expect(auth.refresh).not.toHaveBeenCalled();
  expect(location.hash).toBe('#/settings-language');
});

it('ignores a session refresh completion after leaving the device settings', async () => {
  history.replaceState(null, '', '/#/settings-devices');
  api.signOutAll.mockResolvedValue({});
  const request = deferred();
  auth.refresh.mockReturnValue(request.promise);
  const { result } = renderHook(() => useWorkspaceModel({ language: 'en' }));
  await waitFor(() => expect(result.current.settingsLoading).toBe(false));
  await act(async () => {
    void result.current.signOutAllSessions();
  });
  expect(auth.refresh).toHaveBeenCalledTimes(1);
  navigate('settings-language');
  await act(async () => request.resolve({}));
  expect(location.hash).toBe('#/settings-language');
});
