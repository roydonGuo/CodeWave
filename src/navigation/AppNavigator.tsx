import React from 'react';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../pages/LoginScreen';
import { CreatePostScreen } from '../pages/CreatePostScreen';
import { SettingsScreen } from '../pages/SettingsScreen';
import { MainTabs } from './MainTabs';
import { useTheme } from '../state/theme/ThemeContext';

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  CreatePost: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { colors, resolvedMode } = useTheme();

  // 根据主题动态生成导航主题
  const navTheme: Theme = {
    dark: resolvedMode === 'dark',
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.textPrimary,
      border: colors.surfaceBorder,
      notification: colors.error,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400' as const,
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700' as const,
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '800' as const,
      },
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: navTheme.colors.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Login" component={LoginScreenWrapper} />
        <Stack.Screen name="CreatePost" component={CreatePostScreenWrapper} />
        <Stack.Screen name="Settings" component={SettingsScreenWrapper} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// 下面两个是简单的包装组件，用于给现有页面传入 onBack 等回调

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreenWrapper: React.FC<LoginProps> = ({ navigation }) => {
  return <LoginScreen onBack={() => navigation.goBack()} />;
};

type CreatePostProps = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

const CreatePostScreenWrapper: React.FC<CreatePostProps> = ({ navigation }) => {
  return <CreatePostScreen onBack={() => navigation.goBack()} />;
};

type SettingsProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreenWrapper: React.FC<SettingsProps> = ({ navigation }) => {
  return <SettingsScreen onBack={() => navigation.goBack()} />;
};


