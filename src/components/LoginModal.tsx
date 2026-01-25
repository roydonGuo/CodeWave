import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, LogIn } from 'lucide-react-native';
import { useAuth } from '../state/auth/AuthContext';
import { ApiError } from '../api/client';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  onClose,
  onLoginSuccess,
}) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => username.trim().length > 0 && password.length > 0,
    [username, password]
  );

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await login({ username: username.trim(), password });
      // 登录成功，清空表单并关闭弹窗
      setUsername('');
      setPassword('');
      setError(null);
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (e) {
      if (e instanceof ApiError) {
        setError(typeof e.body === 'string' ? e.body : e.message);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('登录失败，请稍后重试');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setUsername('');
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>快速登录</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                disabled={submitting}
              >
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>用户名</Text>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="请输入用户名"
                  placeholderTextColor="#64748b"
                  style={styles.input}
                  autoCapitalize="none"
                  editable={!submitting}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>密码</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="请输入密码"
                  placeholderTextColor="#64748b"
                  style={styles.input}
                  secureTextEntry
                  editable={!submitting}
                />
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.submitBtn, (!canSubmit || submitting) && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={!canSubmit || submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#0f172a" />
                ) : (
                  <>
                    <LogIn size={18} color="#0f172a" />
                    <Text style={styles.submitText}>登录</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    color: '#e2e8f0',
    fontSize: 15,
  },
  errorText: {
    marginTop: 4,
    marginBottom: 12,
    color: '#f87171',
    fontSize: 12,
  },
  submitBtn: {
    marginTop: 8,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
});

