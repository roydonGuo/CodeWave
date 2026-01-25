import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Settings,
  Bell,
  Heart,
  History,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../state/theme/ThemeContext';

interface ProfileScreenProps {
  isLoggedIn: boolean;
  username: string | null;
  email?: string | null;
  onLoginPress: () => void;
  onLogoutPress: () => void;
  onSettingsPress?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  isLoggedIn,
  username,
  email,
  onLoginPress,
  onLogoutPress,
  onSettingsPress,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const menuItems = [
    {
      id: 'settings',
      icon: Settings,
      title: '设置',
      color: colors.primary,
    },
    {
      id: 'notifications',
      icon: Bell,
      title: '通知',
      color: colors.warning,
    },
    {
      id: 'favorites',
      icon: Heart,
      title: '收藏',
      color: colors.error,
    },
    {
      id: 'history',
      icon: History,
      title: '播放历史',
      color: colors.success,
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: '帮助与反馈',
      color: colors.info,
    },
    {
      id: 'logout',
      icon: LogOut,
      title: '退出登录',
      color: colors.textSecondary,
    },
  ];

  const displayName = useMemo(() => {
    if (!isLoggedIn) return '点击登录';
    return username || '用户';
  }, [isLoggedIn, username]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, 0), backgroundColor: colors.surface },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>我的</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Section */}
        <TouchableOpacity
          style={styles.userSection}
          activeOpacity={0.85}
          onPress={() => {
            if (!isLoggedIn) onLoginPress();
          }}
        >
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={[styles.avatarText, { color: colors.text }]}>
              {(displayName.trim()[0] || 'U').toUpperCase()}
            </Text>
          </View>
          <View style={styles.userRow}>
            <View style={styles.userCol}>
              <Text style={[styles.userName, { color: colors.textPrimary }]}>{displayName}</Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                {isLoggedIn ? email || '—' : '登录后同步你的收藏与历史'}
              </Text>
            </View>
            {!isLoggedIn && <ChevronRight size={18} color={colors.textTertiary} />}
          </View>
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isLogout = item.id === 'logout';
            const isSettings = item.id === 'settings';
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceBorder,
                  },
                  isLogout && !isLoggedIn && styles.menuItemDisabled,
                ]}
                activeOpacity={0.7}
                disabled={isLogout && !isLoggedIn}
                onPress={() => {
                  if (isLogout) {
                    onLogoutPress();
                  } else if (isSettings && onSettingsPress) {
                    onSettingsPress();
                  }
                }}
              >
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                  <Icon size={20} color={item.color} />
                </View>
                <Text style={[styles.menuText, { color: colors.textPrimary }]}>{item.title}</Text>
                {isSettings && (
                  <ChevronRight size={18} color={colors.textTertiary} style={styles.chevron} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: colors.textTertiary }]}>
            CodeWave v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  userRow: {
    marginTop: 12,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userCol: {
    flex: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  menuItemDisabled: {
    opacity: 0.45,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  appInfoText: {
    fontSize: 12,
  },
});

