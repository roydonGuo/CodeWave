import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Toast } from './Toast';

interface ToastState {
  id: string;
  message: string;
  visible: boolean;
}

let toastIdCounter = 0;
let showToastFn: ((message: string) => void) | null = null;

export const ToastManager: React.FC = () => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string) => {
    const id = `toast-${toastIdCounter++}`;
    setToast({ id, message, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => (prev ? { ...prev, visible: false } : null));
  }, []);

  // 暴露全局方法
  React.useEffect(() => {
    showToastFn = showToast;
    return () => {
      showToastFn = null;
    };
  }, [showToast]);

  if (!toast) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Toast
        message={toast.message}
        visible={toast.visible}
        onHide={hideToast}
        duration={3000}
      />
    </View>
  );
};

// 全局方法：在任何地方调用 showToast('消息')
export function showToast(message: string): void {
  if (showToastFn) {
    showToastFn(message);
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: 'none',
  },
});

