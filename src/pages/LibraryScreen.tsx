import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { Article, TextSegment } from '../types';
import { Header } from '../components/Header';
import { CategoryFilter, Category } from '../components/CategoryFilter';
import { ArticleCard } from '../components/ArticleCard';
import { AddCategoryModal } from '../components/AddCategoryModal';
import { getCategoryList, addCategory } from '../api/category';
import { getPostList, Post } from '../api/post';
import { useAuth } from '../state/auth/AuthContext';
import { useTheme } from '../state/theme/ThemeContext';
import { Plus } from 'lucide-react-native';

interface LibraryScreenProps {
  currentArticle: Article | null;
  isPlaying: boolean;
  onArticleSelect: (article: Article) => void;
  onCreatePostPress: () => void;
}

const PAGE_SIZE = 10; // 每页加载的文章数量

// 将 Post 转换为 Article 的适配器函数
const convertPostToArticle = (post: Post, categoryName: string): Article => {
  // 将 HTML content 转换为简单的文本段（后续可以完善 MD 解析）
  const textContent = post.content.replace(/<[^>]*>/g, '').trim();
  const segments: TextSegment[] = textContent
    ? [{ type: 'text', content: textContent }]
    : [{ type: 'text', content: '暂无内容' }];

  // 计算预估时长（简单估算：每 200 字符约 1 分钟）
  const estimatedMinutes = Math.max(1, Math.ceil(textContent.length / 200));
  const duration = `${estimatedMinutes}:00`;

  return {
    id: post.id,
    title: post.title,
    author: '作者', // 暂时使用占位值，后续可以从 userId 获取
    duration,
    category: categoryName,
    segments,
    createTime: post.createTime, // 保留创建时间
  };
};

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  currentArticle,
  isPlaying,
  onArticleSelect,
  onCreatePostPress,
}) => {
  const { token } = useAuth();
  const { colors } = useTheme();
  const [categories, setCategories] = useState<Category[]>([{ id: null, name: '全部' }]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
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
      console.log('加载分类列表失败:', error);
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

  // 加载作品列表
  const loadPosts = useCallback(
    async (pageNum: number, categoryId: number | null, append: boolean = false) => {
      try {
        setIsLoading(true);
        const result = await getPostList(
          {
            pageNum,
            pageSize: PAGE_SIZE,
            categoryId: categoryId || undefined,
          },
          token
        );

        // 将 Post 转换为 Article
        const articles = result.rows.map((post) => {
          const category = categories.find((cat) => cat.id === post.categoryId);
          const categoryName = category?.name || '未分类';
          return convertPostToArticle(post, categoryName);
        });

        setTotalPosts(result.total);

        if (append) {
          setDisplayedArticles((prev) => [...prev, ...articles]);
        } else {
          setDisplayedArticles(articles);
        }

        const currentTotal = append ? displayedArticles.length + articles.length : articles.length;
        setHasMore(currentTotal < result.total);
      } catch (error) {
        console.log('加载作品列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [token, categories]
  );

  // 加载作品列表：分类加载完成后初始化，分类改变时刷新
  useEffect(() => {
    if (!loadingCategories && categories.length > 0) {
      setCurrentPage(1);
      setDisplayedArticles([]);
      setHasMore(true);
      loadPosts(1, selectedCategoryId, false);
    }
  }, [selectedCategoryId, loadingCategories, categories.length, loadPosts]);

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
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadPosts(nextPage, selectedCategoryId, true);
  }, [isLoading, hasMore, currentPage, selectedCategoryId, loadPosts]);

  // 下拉刷新处理
  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    setCurrentPage(1);
    setDisplayedArticles([]);
    setHasMore(true);

    await loadPosts(1, selectedCategoryId, false);
    setRefreshing(false);
  }, [refreshing, selectedCategoryId, loadPosts]);

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="知识库" />
      <View style={styles.filterContainer}>
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.accent }]}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={14} color={colors.text} />
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
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
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
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>加载中...</Text>
          </View>
        )}

        {/* 没有更多数据提示 */}
        {!hasMore && displayedArticles.length > 0 && (
          <View style={styles.endContainer}>
            <Text style={[styles.endText, { color: colors.textTertiary }]}>没有更多内容了</Text>
          </View>
        )}
      </ScrollView>

      <AddCategoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleAddCategory}
      />

      {/* 创建作品浮动按钮 */}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: colors.accent }]}
        onPress={onCreatePostPress}
        activeOpacity={0.8}
      >
        <Plus size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 16,
    alignSelf: 'center',
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '400',
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
    fontSize: 14,
  },
  endContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endText: {
    fontSize: 12,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});

