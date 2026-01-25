import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Volume2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../state/theme/ThemeContext';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightContent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightContent,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 0) }]}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            onPress={onBackPress}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      </View>
      {rightContent && <View style={styles.rightSection}>{rightContent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

