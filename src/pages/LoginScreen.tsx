import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ArrowLeft, LogIn } from 'lucide-react-native';
import { ApiError } from '../api/client';
import { useAuth } from '../state/auth/AuthContext';

interface LoginScreenProps {
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBack }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => username.trim().length > 0 && password.length > 0, [username, password]);

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await login({ username: username.trim(), password });
      onBack();
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft size={24} color="#94a3b8" />
        </TouchableOpacity>
        <Text style={styles.title}>登录</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>用户名</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="请输入用户名"
          placeholderTextColor="#64748b"
          style={styles.input}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { marginTop: 12 }]}>密码</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="请输入密码"
          placeholderTextColor="#64748b"
          style={styles.input}
          secureTextEntry
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.submitBtn, (!canSubmit || submitting) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={!canSubmit || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <>
              <LogIn size={18} color="#0f172a" />
              <Text style={styles.submitText}>登录</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.tip}>
          提示：接口基础地址为 localhost:5090（真机/模拟器可能需要改为局域网 IP 或 10.0.2.2）。
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#0b1220',
    borderWidth: 1,
    borderColor: '#334155',
    color: '#e2e8f0',
  },
  errorText: {
    marginTop: 12,
    color: '#f87171',
    fontSize: 12,
  },
  submitBtn: {
    marginTop: 16,
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
  tip: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 12,
    lineHeight: 18,
  },
});


