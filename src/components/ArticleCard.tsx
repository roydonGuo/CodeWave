import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PlayCircle, Volume2, Clock, User } from 'lucide-react-native';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  isCurrent?: boolean;
  isPlaying?: boolean;
  onPress: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isCurrent = false,
  isPlaying = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCurrent && isPlaying && styles.containerActive,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.category}>{article.category}</Text>
          {isCurrent && isPlaying && (
            <View style={styles.indicator}>
              <View style={styles.indicatorDot} />
            </View>
          )}
        </View>
        <Text
          style={[styles.title, isCurrent && styles.titleActive]}
          numberOfLines={2}
        >
          {article.title}
        </Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <User size={10} color="#64748b" />
            <Text style={styles.metaText}>{article.author}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={10} color="#64748b" />
            <Text style={styles.metaText}>{article.duration}</Text>
          </View>
        </View>
      </View>
      <View
        style={[
          styles.iconContainer,
          isCurrent && styles.iconContainerActive,
        ]}
      >
        {isCurrent && isPlaying ? (
          <Volume2 size={20} color="#818cf8" />
        ) : (
          <PlayCircle size={20} color="#475569" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 12,
  },
  containerActive: {
    backgroundColor: 'rgba(67, 56, 202, 0.2)',
    borderColor: 'rgba(99, 102, 241, 0.5)',
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#818cf8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  indicator: {
    marginLeft: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 8,
    lineHeight: 24,
  },
  titleActive: {
    color: '#c7d2fe',
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
});

