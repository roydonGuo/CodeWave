/**
 * CodeWave - 程序员技术博客转语音 App
 * 使用 React Navigation 进行路由管理
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/state/theme/ThemeContext';
import { AuthProvider, useAuth } from './src/state/auth/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ToastManager, showToast } from './src/components/ToastManager';
import { LoginModal } from './src/components/LoginModal';
import { setShowToastHandler } from './src/api/client';

function AppContent() {
  const auth = useAuth();

  // 注册全局 toast 回调
  React.useEffect(() => {
    setShowToastHandler(showToast);
    return () => {
      setShowToastHandler(null);
    };
  }, []);

  return (
    <>
      <AppNavigator />
      <ToastManager />
      <LoginModal
        visible={auth.isLoginModalVisible}
        onClose={auth.hideLoginModal}
        onLoginSuccess={() => {
          // 登录成功后可以刷新当前页面数据
        }}
      />
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
