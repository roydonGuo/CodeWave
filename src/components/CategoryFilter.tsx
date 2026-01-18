import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.tag,
            selectedCategory === category && styles.tagActive,
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <Text
            style={[
              styles.tagText,
              selectedCategory === category && styles.tagTextActive,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // 高度自适应，根据内容自动调整
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    borderWidth: 1, 
    borderColor: '#334155',
  },
  tagActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
  },
  tagTextActive: {
    color: '#ffffff',
  },
});

