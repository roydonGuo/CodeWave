import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { Article } from '../types';
import { MOCK_LIBRARY } from '../data/mockData';
import { Header } from '../components/Header';
import { CategoryFilter, Category } from '../components/CategoryFilter';
import { ArticleCard } from '../components/ArticleCard';
import { AddCategoryModal } from '../components/AddCategoryModal';
import { getCategoryList, addCategory } from '../api/category';
import { useAuth } from '../state/auth/AuthContext';

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
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([{ id: null, name: '全部' }]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 加载分类列表
  const loadCategories = useCallback(async (): Promise<Category[]> => {
    try {
      setLoadingCategories(true);
      const categoryList = await getCategoryList(token);
      // 在首节点添加"全部"分类
      setCategories([{ id: null, name: '全部' }, ...categoryList]);
      return categoryList;
    } catch (error) {
      console.error('加载分类列表失败:', error);
      // 如果加载失败，至少保留"全部"选项
      setCategories([{ id: null, name: '全部' }]);
      return [];
    } finally {
      setLoadingCategories(false);
    }
  }, [token]);

  // 初始化加载分类
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // 使用 useMemo 稳定 filteredArticles 的引用
  const filteredArticles = useMemo(() => {
    if (selectedCategoryId === null) {
      // "全部"分类，显示所有文章
      return MOCK_LIBRARY;
    }
    // 根据分类名称过滤（因为 Article 的 category 是 string）
    // 后续如果 Article 改为使用 categoryId，这里需要相应调整
    return MOCK_LIBRARY.filter((article) => {
      const category = categories.find((cat) => cat.id === selectedCategoryId);
      return category && article.category === category.name;
    });
  }, [selectedCategoryId, categories]);

  // 处理添加分类
  const handleAddCategory = useCallback(
    async (name: string) => {
      // 调用添加分类接口，只有成功（code === 200）才会继续执行
      await addCategory({ name }, token);
      
      // 添加成功后，重新获取分类列表以获取最新数据
      // loadCategories 会更新 categories 状态并返回分类列表
      const categoryList = await loadCategories();
      
      // 由于接口响应中没有返回分类数据，需要通过刷新后的列表来查找新添加的分类
      // const newCategory = categoryList.find((cat) => cat.name === name);
      // if (newCategory) {
      //   setSelectedCategoryId(newCategory.id);
      // }
    },
    [token, loadCategories]
  );

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
  }, [selectedCategoryId, filteredArticles]);

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
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ 新增</Text>
        </TouchableOpacity>
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
      
      <AddCategoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleAddCategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#4f46e5',
    marginRight: 16,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1, // 填充剩余高度
  },
  scrollContent: {
    paddingHorizontal: 16,
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

