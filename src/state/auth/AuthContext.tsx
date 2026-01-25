import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as AuthApi from '../../api/auth';
import { clearAuthStorage, loadAuthFromStorage, saveAuthToStorage } from './storage';
import { setAuthRequiredHandler } from '../../api/client';

export interface AuthUser {
  id: string | number;
  username: string;
  nickName?: string;
  email?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (req: AuthApi.LoginRequest) => Promise<void>;
  logout: () => void;
  showLoginModal: () => void;
  hideLoginModal: () => void;
  isLoginModalVisible: boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  // 启动时从本地恢复登录态（持久化）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await loadAuthFromStorage();
        if (cancelled) return;
        if (stored.token && stored.user) {
          setToken(stored.token);
          setUser(stored.user);
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (req: AuthApi.LoginRequest) => {
    // 1. 调用登录接口获取 token（code 判断在 auth.ts 内处理）
    const { token: newToken } = await AuthApi.login(req);
    setToken(newToken);

    // 2. 使用 token 调用 /getInfo 获取用户信息
    const info = await AuthApi.getUserInfo(newToken);
    const nextUser: AuthUser = {
      id: info.id,
      username: info.username,
      nickName: info.nickName,
      email: info.email,
    };
    setUser(nextUser);

    // 3. 持久化
    await saveAuthToStorage(newToken, nextUser);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    void clearAuthStorage();
  }, []);

  const showLoginModal = useCallback(() => {
    setIsLoginModalVisible(true);
  }, []);

  const hideLoginModal = useCallback(() => {
    setIsLoginModalVisible(false);
  }, []);

  // 注册全局回调：当请求返回 401/403 时自动弹出登录弹窗
  useEffect(() => {
    setAuthRequiredHandler(showLoginModal);
    return () => {
      setAuthRequiredHandler(null);
    };
  }, [showLoginModal]);

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      isLoggedIn: !!token && !!user,
      login,
      logout,
      showLoginModal,
      hideLoginModal,
      isLoginModalVisible,
    }),
    [token, user, login, logout, showLoginModal, hideLoginModal, isLoginModalVisible]
  );

  // 未完成持久化恢复前，先不渲染 children，避免闪烁/误判登录态
  if (!hydrated) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth 必须在 AuthProvider 内使用');
  }
  return ctx;
}


