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

interface ProfileScreenProps {
  isLoggedIn: boolean;
  username: string | null;
  email?: string | null;
  onLoginPress: () => void;
  onLogoutPress: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  isLoggedIn,
  username,
  email,
  onLoginPress,
  onLogoutPress,
}) => {
  const menuItems = [
    {
      id: 'settings',
      icon: Settings,
      title: '设置',
      color: '#818cf8',
    },
    {
      id: 'notifications',
      icon: Bell,
      title: '通知',
      color: '#f59e0b',
    },
    {
      id: 'favorites',
      icon: Heart,
      title: '收藏',
      color: '#ef4444',
    },
    {
      id: 'history',
      icon: History,
      title: '播放历史',
      color: '#10b981',
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: '帮助与反馈',
      color: '#3b82f6',
    },
    {
      id: 'logout',
      icon: LogOut,
      title: '退出登录',
      color: '#94a3b8',
    },
  ];

  const displayName = useMemo(() => {
    if (!isLoggedIn) return '点击登录';
    return username || '用户';
  }, [isLoggedIn, username]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的</Text>
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
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(displayName.trim()[0] || 'U').toUpperCase()}
            </Text>
          </View>
          <View style={styles.userRow}>
            <View style={styles.userCol}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>
                {isLoggedIn ? email || '—' : '登录后同步你的收藏与历史'}
              </Text>
            </View>
            {!isLoggedIn && <ChevronRight size={18} color="#64748b" />}
          </View>
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isLogout = item.id === 'logout';
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, isLogout && !isLoggedIn && styles.menuItemDisabled]}
                activeOpacity={0.7}
                disabled={isLogout && !isLoggedIn}
                onPress={() => {
                  if (isLogout) onLogoutPress();
                }}
              >
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                  <Icon size={20} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>CodeWave v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 32,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
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
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#94a3b8',
  },
  menuSection: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
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
    color: '#e2e8f0',
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  appInfoText: {
    fontSize: 12,
    color: '#64748b',
  },
});

