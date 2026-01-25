import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ResolvedThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'codewave_theme_mode';

// 完整的颜色系统定义
export const colorSchemes = {
  dark: {
    // 背景色
    background: '#020617', // Slate-950
    surface: '#0f172a', // Slate-900
    surfaceElevated: '#1e293b', // Slate-800
    surfaceBorder: '#334155', // Slate-700

    // 文本色
    text: '#ffffff',
    textPrimary: '#e2e8f0', // Slate-200
    textSecondary: '#94a3b8', // Slate-400
    textTertiary: '#64748b', // Slate-500

    // 强调色
    primary: '#818cf8', // Indigo-400
    primaryDark: '#6366f1', // Indigo-500
    accent: '#4f46e5', // Indigo-600

    // 状态色
    error: '#f87171', // Red-400
    success: '#10b981', // Emerald-500
    warning: '#f59e0b', // Amber-500
    info: '#3b82f6', // Blue-500

    // 其他
    overlay: 'rgba(0, 0, 0, 0.6)',
    divider: '#1e293b', // Slate-800
    card: 'rgba(2, 6, 23, 0.92)',
  },
  light: {
    // 背景色
    background: '#ffffff',
    surface: '#f8fafc', // Slate-50
    surfaceElevated: '#f1f5f9', // Slate-100
    surfaceBorder: '#e2e8f0', // Slate-200

    // 文本色
    text: '#0f172a', // Slate-900
    textPrimary: '#1e293b', // Slate-800
    textSecondary: '#475569', // Slate-600
    textTertiary: '#64748b', // Slate-500

    // 强调色
    primary: '#6366f1', // Indigo-500
    primaryDark: '#4f46e5', // Indigo-600
    accent: '#818cf8', // Indigo-400

    // 状态色
    error: '#ef4444', // Red-500
    success: '#10b981', // Emerald-500
    warning: '#f59e0b', // Amber-500
    info: '#3b82f6', // Blue-500

    // 其他
    overlay: 'rgba(0, 0, 0, 0.4)',
    divider: '#e2e8f0', // Slate-200
    card: '#ffffff',
  },
};

export type ColorScheme = typeof colorSchemes.dark;

interface ThemeState {
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  colors: ColorScheme;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

// 获取系统主题
const getSystemTheme = (): ResolvedThemeMode => {
  const systemColorScheme = Appearance.getColorScheme();
  return systemColorScheme === 'dark' ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [hydrated, setHydrated] = useState(false);

  // 使用 state 来触发重新渲染，监听系统主题变化
  const [systemTheme, setSystemTheme] = useState<ResolvedThemeMode>(getSystemTheme());

  // 监听系统主题变化（仅在 'auto' 模式下）
  useEffect(() => {
    if (mode !== 'auto') return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      const newSystemTheme = colorScheme === 'dark' ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
    });

    return () => {
      subscription.remove();
    };
  }, [mode]);

  // 重新计算 resolvedMode，考虑系统主题变化
  const resolvedMode = useMemo(() => {
    if (mode === 'auto') {
      return systemTheme;
    }
    return mode;
  }, [mode, systemTheme]);

  const colors = useMemo(() => colorSchemes[resolvedMode], [resolvedMode]);

  // 从存储加载主题
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'auto') {
          setModeState(stored);
        }
      } catch (error) {
        console.log('Failed to load theme from storage', error);
      } finally {
        setHydrated(true);
      }
    };
    loadTheme();
  }, []);

  // 保存主题到存储
  const saveTheme = useCallback(async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.log('Failed to save theme to storage', error);
    }
  }, []);

  const setTheme = useCallback(
    (newMode: ThemeMode) => {
      setModeState(newMode);
      void saveTheme(newMode);
    },
    [saveTheme]
  );

  const value = useMemo<ThemeState>(
    () => ({
      mode,
      resolvedMode,
      colors,
      setTheme,
    }),
    [mode, resolvedMode, colors, setTheme]
  );

  // 未完成持久化恢复前，先不渲染 children，避免闪烁
  if (!hydrated) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeState {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

