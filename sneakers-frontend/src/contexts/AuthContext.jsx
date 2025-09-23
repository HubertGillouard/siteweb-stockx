import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { bootAuthFromStorage as bootAuth, login as apiLogin, logout as apiLogout } from "../api";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, loading: true, error: null });

  const boot = useCallback(async () => {
    try {
      await bootAuth((s) => setState((cur) => ({ ...cur, ...s })));
    } finally {
      setState((cur) => ({ ...cur, loading: false }));
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await apiLogin(email, password);
    const user = res?.user || { email: res?.email || email, roles: res?.roles || res?.role || ["client"] };
    setState({ user, loading: false, error: null });
    return user;
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setState({ user: null, loading: false, error: null });
  }, []);

  const value = useMemo(() => ({
    user: state.user,
    loading: state.loading,
    error: state.error,
    boot,
    login,
    logout,
  }), [state, boot, login, logout]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
