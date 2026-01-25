import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Moon, Sun, Monitor } from 'lucide-react-native';
import { useTheme } from '../state/theme/ThemeContext';

interface ThemeSelectorProps {
  style?: any;
}

interface ThemeOption {
  mode: 'light' | 'dark' | 'auto';
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ style }) => {
  const { mode, colors, setTheme } = useTheme();

  const options: ThemeOption[] = [
    { mode: 'dark', label: '深色模式', icon: Moon },
    { mode: 'light', label: '浅色模式', icon: Sun },
    { mode: 'auto', label: '跟随系统', icon: Monitor },
  ];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>主题设置</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          选择应用的主题模式
        </Text>
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = mode === option.mode;
          return (
            <TouchableOpacity
              key={option.mode}
              style={[
                styles.card,
                {
                  backgroundColor: isSelected ? `${colors.primary}15` : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.surfaceBorder,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => setTheme(option.mode)}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isSelected ? `${colors.primary}20` : `${colors.textTertiary}15`,
                  },
                ]}
              >
                <Icon
                  size={24}
                  color={isSelected ? colors.primary : colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.cardLabel,
                  {
                    color: isSelected ? colors.textPrimary : colors.textSecondary,
                    fontWeight: isSelected ? '600' : '500',
                  },
                ]}
              >
                {option.label}
              </Text>
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <View
                    style={[
                      styles.selectedDot,
                      {
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    position: 'relative',
    minHeight: 100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

