import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { Article, SceneMode, CodeMode } from '../types';
import { SceneSelector } from '../components/SceneSelector';
import { ContentRenderer } from '../components/ContentRenderer';
import { CodeModeSelector } from '../components/CodeModeSelector';
import { ProgressBar } from '../components/ProgressBar';
import { PlayerControls } from '../components/PlayerControls';
import { ModeBackground } from '../components/ModeBackground';

interface PlayerScreenProps {
  article: Article | null;
  onLibraryPress: () => void;
}

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

export const PlayerScreen: React.FC<PlayerScreenProps> = ({ article, onLibraryPress }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sceneMode, setSceneMode] = useState<SceneMode>('standard');
  const [codeMode, setCodeMode] = useState<CodeMode>('summary');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);

  // 播放进度模拟
  useEffect(() => {
    if (!article) {
      setIsPlaying(false);
      setProgress(0);
      setCurrentSegmentIndex(0);
      return;
    }

    // @ts-ignore
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (!article) return 0;
          if (prev >= 100) {
            // 移动到下一个段落
            if (currentSegmentIndex < article.segments.length - 1) {
              setCurrentSegmentIndex((idx) => idx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }

          const currentSegment = article.segments[currentSegmentIndex];
          if (!currentSegment) return 100;

          let speedFactor = 1;

          if (currentSegment.type === 'code') {
            if (codeMode === 'skip') return 100; // 立即完成
            if (codeMode === 'label') speedFactor = 2; // 快速阅读标签
            if (codeMode === 'summary') speedFactor = 0.8; // 慢速阅读摘要
          }

          return prev + 0.5 * playbackSpeed * speedFactor;
        });
      }, 50);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    article,
    isPlaying,
    currentSegmentIndex,
    playbackSpeed,
    codeMode,
  ]);

  // 切换作品时重置进度
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentSegmentIndex(0);
  }, [article?.id]);

  const handleSpeedChange = () => {
    setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1));
  };

  const handleSkipBack = () => {
    if (!article) return;
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(currentSegmentIndex - 1);
      setProgress(0);
    }
  };

  const handleSkipForward = () => {
    if (!article) return;
    if (currentSegmentIndex < article.segments.length - 1) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
      setProgress(0);
    }
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const getSceneStyles = () => {
    // switch (sceneMode) {
    //   case 'driving':
    //     return { backgroundColor: '#020617' };
    //   case 'gym':
    //     return { backgroundColor: '#020617' };
    //   default:
    //     return { backgroundColor: '#020617' };
    // }
  };

  // 未选择作品时的占位视图
  if (!article) {
    return (
      <View style={[styles.container, { backgroundColor: '#020617' }]}>
        <ModeBackground active={false} sceneMode={sceneMode} />
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Volume2 size={24} color="#818cf8" />
          </View>
          <Text style={styles.emptyTitle}>还没有选择作品</Text>
          <Text style={styles.emptySubtitle}>前往知识库选择一篇作品开始播放</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={onLibraryPress} activeOpacity={0.85}>
            <Text style={styles.emptyButtonText}>去选择作品</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentSegment = article.segments[currentSegmentIndex] || {
    type: 'text',
    content: '内容结束。',
  };

  const buttonSize = sceneMode === 'driving' ? 'large' : 'standard';

  return (
    // <View style={[styles.container, getSceneStyles()]}>
    <View style={[styles.container]}>
      <ModeBackground active={isPlaying} sceneMode={sceneMode} />
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Volume2 size={16} color="#ffffff" />
          </View>
          <Text style={styles.logoText}>CodeWave</Text>
        </View>
        <SceneSelector sceneMode={sceneMode} onModeChange={setSceneMode} />
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Article Info */}
        <View style={styles.articleInfo}>
          <Text style={styles.category}>{article.category}</Text>
          <Text
            style={[
              styles.title,
              sceneMode === 'driving' && styles.titleLarge,
            ]}
          >
            {article.title}
          </Text>
          <Text style={styles.meta}>
              {article.createTime ? formatCreateTime(article.createTime) : ''}
          </Text>
        </View>

        {/* Content Renderer */}
        <View style={styles.contentArea}>
          <ContentRenderer segment={currentSegment} codeMode={codeMode} />
        </View>
      </ScrollView>

      {/* Player Controls (overlay) */}
      <View style={styles.controlsContainer}>
        <ProgressBar
          currentSegment={currentSegmentIndex}
          totalSegments={article.segments.length}
          progress={progress}
          duration={article.duration}
        />

        <PlayerControls
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onSkipBack={handleSkipBack}
          onSkipForward={handleSkipForward}
          onSpeedChange={handleSpeedChange}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          buttonSize={buttonSize}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12, 
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 220, // 为底部控制区预留空间，避免被遮挡
  },
  articleInfo: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#818cf8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },
  titleLarge: {
    fontSize: 28,
  },
  meta: {
    fontSize: 14,
    color: '#94a3b8',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  controlsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: 'transparent',  
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

