import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import {
  Share2,
  Star,
  Info,
  Shield,
  MessageSquare,
  Mail,
  ChevronRight,
} from 'lucide-react-native';
import { Header } from '../components/Header';
import { ThemeSelector } from '../components/ThemeSelector';
import { useTheme } from '../state/theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingsScreenProps {
  onBack: () => void;
}

interface SettingItem {
  id: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  subtitle?: string;
  color: string;
  onPress: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const handleShareApp = () => {
    // 分享功能（需要根据平台实现）
    Alert.alert('分享应用', '分享功能开发中...');
  };

  const handleRateApp = () => {
    // 跳转到应用商店评分
    const appStoreUrl = 'https://apps.apple.com/app/id123456789'; // iOS
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.codewave'; // Android
    
    Alert.alert('给好评', '跳转到应用商店评分', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        onPress: () => {
          // 这里可以根据平台打开对应的应用商店
          Linking.openURL(appStoreUrl).catch(() => {
            Alert.alert('错误', '无法打开应用商店');
          });
        },
      },
    ]);
  };

  const handleAboutApp = () => {
    Alert.alert(
      '关于 CodeWave',
      'CodeWave v1.0.0\n\n一个程序员技术博客转语音应用\n\n让技术文章变成可听的音频内容',
      [{ text: '确定' }]
    );
  };

  const handlePrivacyPolicy = () => {
    // 打开隐私政策页面或链接
    const privacyUrl = 'https://codewave.example.com/privacy';
    Linking.openURL(privacyUrl).catch(() => {
      Alert.alert('错误', '无法打开隐私政策页面');
    });
  };

  const handleFeedback = () => {
    Alert.alert('意见反馈', '请通过以下方式联系我们：\n\n邮箱：feedback@codewave.example.com', [
      { text: '取消', style: 'cancel' },
      {
        text: '发送邮件',
        onPress: () => {
          Linking.openURL('mailto:feedback@codewave.example.com?subject=CodeWave意见反馈').catch(
            () => {
              Alert.alert('错误', '无法打开邮件应用');
            }
          );
        },
      },
    ]);
  };

  const handleContactDeveloper = () => {
    Alert.alert('联系开发者', '邮箱：developer@codewave.example.com', [
      { text: '取消', style: 'cancel' },
      {
        text: '发送邮件',
        onPress: () => {
          Linking.openURL('mailto:developer@codewave.example.com?subject=CodeWave开发者联系').catch(
            () => {
              Alert.alert('错误', '无法打开邮件应用');
            }
          );
        },
      },
    ]);
  };

  const settingsItems: SettingItem[] = [
    {
      id: 'share',
      icon: Share2,
      title: '分享应用',
      subtitle: '推荐给朋友',
      color: '#818cf8',
      onPress: handleShareApp,
    },
    {
      id: 'rate',
      icon: Star,
      title: '给好评',
      subtitle: '在应用商店评分',
      color: '#f59e0b',
      onPress: handleRateApp,
    },
    {
      id: 'about',
      icon: Info,
      title: '关于应用',
      subtitle: '版本信息和介绍',
      color: '#3b82f6',
      onPress: handleAboutApp,
    },
    {
      id: 'privacy',
      icon: Shield,
      title: '隐私政策',
      subtitle: '了解我们如何保护您的隐私',
      color: '#10b981',
      onPress: handlePrivacyPolicy,
    },
    {
      id: 'feedback',
      icon: MessageSquare,
      title: '意见反馈',
      subtitle: '告诉我们您的想法',
      color: '#f87171',
      onPress: handleFeedback,
    },
    {
      id: 'contact',
      icon: Mail,
      title: '联系开发者',
      subtitle: '有问题？联系我们',
      color: '#64748b',
      onPress: handleContactDeveloper,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="设置" showBackButton onBackPress={onBack} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 主题选择器 */}
        <View
          style={[
            styles.themeSection,
            {
              backgroundColor: colors.surface,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          <ThemeSelector />
        </View>

        {/* 其他设置项 */}
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.listItem,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.surfaceBorder,
                },
              ]}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                <Icon size={20} color={item.color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
                    {item.subtitle}
                  </Text>
                )}
              </View>
              <ChevronRight size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  themeSection: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
  },
});

