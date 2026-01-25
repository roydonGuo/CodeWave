import React from 'react';
import { NavigationContainer, DarkTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../pages/LoginScreen';
import { CreatePostScreen } from '../pages/CreatePostScreen';
import { SettingsScreen } from '../pages/SettingsScreen';
import { MainTabs } from './MainTabs';

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  CreatePost: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 自定义导航主题，避免默认白色背景导致边缘露白
const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#020617', // 深色背景
    card: 'rgba(2, 6, 23, 0.92)',
    border: 'rgba(148, 163, 184, 0.16)',
  },
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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


