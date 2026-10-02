'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from './api';
import type { User } from './types';

const TOKEN_STORAGE_KEY = 'url-shortener:token';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }

    authApi
      .me(stored)
      .then((me) => {
        setToken(stored);
        setUser(me);
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const applyAuth = useCallback((accessToken: string, nextUser: User) => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    setToken(accessToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login({ email, password });
      applyAuth(res.accessToken, res.user);
    },
    [applyAuth],
  );

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      const res = await authApi.register({ email, password, name });
      applyAuth(res.accessToken, res.user);
    },
    [applyAuth],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isLoading, login, register, logout }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
