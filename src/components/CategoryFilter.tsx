import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export interface Category {
  id: number | null;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id ?? 'all'}
          style={[
            styles.tag,
            selectedCategoryId === category.id && styles.tagActive,
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <Text
            style={[
              styles.tagText,
              selectedCategoryId === category.id && styles.tagTextActive,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
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
    fontWeight: '400',
    color: '#94a3b8',
  },
  tagTextActive: {
    color: '#ffffff',
  },
});

