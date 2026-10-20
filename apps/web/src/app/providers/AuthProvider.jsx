import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { authApi } from '../../features/auth/api.js';
import { workspaceApi } from '../../features/workspaces/api.js';
import { resetApiSession } from '../../lib/http/client.js';
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children, preview = false }) {
  const [view, setView] = useState({
    status: preview ? 'ready' : 'loading',
    user: null,
    workspace: null,
  });
  const generation = useRef(0),
    active = useRef(null);
  const refresh = useCallback(async () => {
    const id = ++generation.current;
    try {
      const data = await authApi.session();
      if (id !== generation.current) return null;
      setView({ status: 'ready', user: data.user, workspace: data.workspace });
      return data;
    } catch (error) {
      if (id === generation.current) setView({ status: 'error', user: null, workspace: null });
      throw error;
    }
  }, []);
  useEffect(() => {
    const counter = generation;
    const expired = () => {
      counter.current++;
      active.current?.abort();
      active.current = null;
      setView({ status: 'loading', user: null, workspace: null });
      refresh().catch(() => {});
    };
    if (!preview) window.addEventListener('nuvia:session-expired', expired);
    if (!preview) refresh().catch(() => {});
    return () => {
      window.removeEventListener('nuvia:session-expired', expired);
      counter.current++;
      active.current?.abort();
    };
  }, [preview, refresh]);
  const cancel = useCallback(() => {
    if (active.current) {
      generation.current++;
      active.current.abort();
      active.current = null;
      setView((old) => (old.status === 'loading' ? { ...old, status: 'ready' } : old));
    }
  }, []);
  const login = async (body, signal) => {
    const id = ++generation.current;
    const controller = new AbortController();
    active.current = controller;
    if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true });
    try {
      await authApi.login(body, controller.signal);
    } catch (error) {
      if (id === generation.current) setView((old) => ({ ...old, status: 'ready' }));
      throw error;
    }
    if (id !== generation.current || controller.signal.aborted) return null;
    resetApiSession();
    return refresh();
  };
  const logout = async () => {
    cancel();
    await authApi.logout();
    resetApiSession();
    setView({ status: 'ready', user: null, workspace: null });
    location.hash = '/login';
  };
  const save = async (operation, body, signal) => {
    const id = generation.current;
    const result = await operation(body, signal);
    if (id !== generation.current || signal?.aborted) return null;
    setView((old) => ({ ...old, workspace: result }));
    return result;
  };
  return (
    <AuthContext.Provider
      value={{
        ...view,
        preview,
        refresh,
        login,
        logout,
        cancel,
        saveWorkspace: (body, signal) => save(workspaceApi.save, body, signal),
        completeSetup: (body, signal) => save(workspaceApi.completeSetup, body, signal),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
