import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { Article } from '../types';
import { MOCK_LIBRARY } from '../data/mockData';
import { Header } from '../components/Header';
import { CategoryFilter } from '../components/CategoryFilter';
import { ArticleCard } from '../components/ArticleCard';

interface LibraryScreenProps {
  currentArticle: Article | null;
  isPlaying: boolean;
  onArticleSelect: (article: Article) => void;
}

const PAGE_SIZE = 10; // 每页加载的文章数量

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  currentArticle,
  isPlaying,
  onArticleSelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = ['全部', 'Frontend', 'System', 'Architecture', 'DevOps', 'AI', 'Mysql', 'App'];

  // 使用 useMemo 稳定 filteredArticles 的引用
  const filteredArticles = useMemo(() => {
    return selectedCategory === '全部'
      ? MOCK_LIBRARY
      : MOCK_LIBRARY.filter((article) => article.category === selectedCategory);
  }, [selectedCategory]);

  // 加载更多文章
  const loadMoreArticles = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 模拟网络延迟
    timeoutRef.current = setTimeout(() => {
      setDisplayedArticles((prev) => {
        const startIndex = prev.length;
        const endIndex = startIndex + PAGE_SIZE;
        const newArticles = filteredArticles.slice(startIndex, endIndex);

        if (newArticles.length > 0) {
          setHasMore(endIndex < filteredArticles.length);
          return [...prev, ...newArticles];
        } else {
          setHasMore(false);
          return prev;
        }
      });
      
      setIsLoading(false);
    }, 500);
  }, [filteredArticles, isLoading, hasMore]);

  // 分类改变时重置分页
  useEffect(() => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // 重置状态
    setIsLoading(false);
    setDisplayedArticles([]);
    setHasMore(true);
    
    // 立即加载第一页
    const timer = setTimeout(() => {
      const firstPageArticles = filteredArticles.slice(0, PAGE_SIZE);
      if (firstPageArticles.length > 0) {
        setDisplayedArticles(firstPageArticles);
        setHasMore(filteredArticles.length > PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    }, 100);
    
    timeoutRef.current = timer;
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [selectedCategory, filteredArticles]);

  // 下拉刷新处理
  const onRefresh = useCallback(() => {
    if (refreshing) return;
    
    setRefreshing(true);
    
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // 重置状态
    setIsLoading(false);
    setDisplayedArticles([]);
    setHasMore(true);
    
    // 模拟网络延迟后重新加载第一页
    timeoutRef.current = setTimeout(() => {
      const firstPageArticles = filteredArticles.slice(0, PAGE_SIZE);
      if (firstPageArticles.length > 0) {
        setDisplayedArticles(firstPageArticles);
        setHasMore(filteredArticles.length > PAGE_SIZE);
      } else {
        setHasMore(false);
      }
      setRefreshing(false);
    }, 800); // 刷新延迟稍长，让用户看到刷新效果
  }, [refreshing, filteredArticles]);

  // 滚动事件处理
  const handleScroll = useCallback(
    (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingToBottom = 200; // 距离底部200px时触发加载
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

      if (isCloseToBottom && hasMore && !isLoading && !refreshing) {
        loadMoreArticles();
      }
    },
    [hasMore, isLoading, refreshing, loadMoreArticles]
  );

  return (
    <View style={styles.container}>
      <Header title="知识库" />
      <View style={styles.filterContainer}>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#818cf8"
            colors={['#818cf8']}
            progressBackgroundColor="#1e293b"
          />
        }
      >
        {displayedArticles.map((article) => {
          const isCurrent = currentArticle?.id === article.id;
          return (
            <ArticleCard
              key={article.id}
              article={article}
              isCurrent={isCurrent}
              isPlaying={isCurrent && isPlaying}
              onPress={() => onArticleSelect(article)}
            />
          );
        })}
        
        {/* 加载指示器 */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#818cf8" />
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        )}
        
        {/* 没有更多数据提示 */}
        {!hasMore && displayedArticles.length > 0 && (
          <View style={styles.endContainer}>
            <Text style={styles.endText}>没有更多内容了</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  filterContainer: {
    // 高度自适应，根据内容自动调整
  },
  scrollView: {
    flex: 1, // 填充剩余高度
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  endContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endText: {
    color: '#64748b',
    fontSize: 12,
  },
});

