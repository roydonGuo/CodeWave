import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Header } from '../components/Header';

interface CreatePostScreenProps {
  onBack: () => void;
}

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <Header title="创建作品" showBackButton onBackPress={onBack} />
      <View style={styles.content}>
        <Text style={styles.placeholderText}>创建作品页面（待实现）</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#94a3b8',
    fontSize: 16,
  },
});

