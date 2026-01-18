import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BookOpen, Play, User } from 'lucide-react-native';

export type TabType = 'library' | 'player' | 'profile';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: TabType; icon: typeof BookOpen }[] = [
    { id: 'library', icon: BookOpen },
    { id: 'player', icon: Play },
    { id: 'profile', icon: User },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Icon
              size={24}
              color={isActive ? '#818cf8' : '#64748b'}
              fill={isActive ? '#818cf8' : 'transparent'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabActive: {
    // 可以添加激活状态的额外样式
  },
});

