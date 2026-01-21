import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PlayCircle, Volume2, Clock, User } from 'lucide-react-native';
import { Article } from '../types';

// 格式化创建时间
const formatCreateTime = (createTime: string): string => {
  try {
    // 解析时间字符串，格式: "2026-01-21 13:53:43"
    // 将空格替换为 T，使其符合 ISO 格式
    const isoString = createTime.replace(' ', 'T');
    const date = new Date(isoString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return createTime.split(' ')[0]; // 如果无效，返回日期部分
    }
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // 如果时间在未来或无效，返回日期
    if (diff < 0) {
      return createTime.split(' ')[0];
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days}天前`;
    } else if (hours > 0) {
      return `${hours}小时前`;
    } else if (minutes > 0) {
      return `${minutes}分钟前`;
    } else {
      return '刚刚';
    }
  } catch (error) {
    // 如果解析失败，返回原始时间字符串的简化版本
    return createTime.split(' ')[0]; // 返回日期部分
  }
};

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
          {article.createTime ? (
            <View style={styles.metaItem}>
              <Clock size={10} color="#64748b" />
              <Text style={styles.metaText}>{formatCreateTime(article.createTime)}</Text>
            </View>
          ) : (
            <View style={styles.metaItem}>
              <Clock size={10} color="#64748b" />
              <Text style={styles.metaText}>{article.duration}</Text>
            </View>
          )}
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

