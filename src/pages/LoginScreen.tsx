import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ArrowLeft, LogIn } from 'lucide-react-native';
import { ApiError } from '../api/client';
import { useAuth } from '../state/auth/AuthContext';
import { useTheme } from '../state/theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LoginScreenProps {
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBack }) => {
  const { login } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 0),
            backgroundColor: colors.surface,
            borderBottomColor: colors.surfaceBorder,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>登录</Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.surfaceBorder,
          },
        ]}
      >
        <Text style={[styles.label, { color: colors.textSecondary }]}>用户名</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="请输入用户名"
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              borderColor: colors.surfaceBorder,
              color: colors.textPrimary,
            },
          ]}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { marginTop: 12, color: colors.textSecondary }]}>密码</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="请输入密码"
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              borderColor: colors.surfaceBorder,
              color: colors.textPrimary,
            },
          ]}
          secureTextEntry
        />

        {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}

        <TouchableOpacity
          style={[
            styles.submitBtn,
            {
              backgroundColor: colors.text,
            },
            (!canSubmit || submitting) && styles.submitBtnDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={!canSubmit || submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <>
              <LogIn size={18} color={colors.background} />
              <Text style={[styles.submitText, { color: colors.background }]}>登录</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={[styles.tip, { color: colors.textTertiary }]}>
          提示：接口基础地址为 localhost:5090（真机/模拟器可能需要改为局域网 IP 或 10.0.2.2）。
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  errorText: {
    marginTop: 12,
    fontSize: 12,
  },
  submitBtn: {
    marginTop: 16,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
  },
  tip: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
  },
});


