import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,

} from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { Article, SceneMode, CodeMode } from '../types';
import { SceneSelector } from '../components/SceneSelector';
import { ContentRenderer } from '../components/ContentRenderer';
import { CodeModeSelector } from '../components/CodeModeSelector';
import { ProgressBar } from '../components/ProgressBar';
import { PlayerControls } from '../components/PlayerControls';
import { ModeBackground } from '../components/ModeBackground';

interface PlayerScreenProps {
  article: Article;
  onLibraryPress: () => void;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({
  article,
  onLibraryPress,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sceneMode, setSceneMode] = useState<SceneMode>('standard');
  const [codeMode, setCodeMode] = useState<CodeMode>('summary');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // 播放进度模拟
  useEffect(() => {
    // @ts-ignore
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
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
    isPlaying,
    currentSegmentIndex,
    playbackSpeed,
    codeMode,
    article.segments.length,
  ]);

  const handleSpeedChange = () => {
    setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1));
  };

  const handleSkipBack = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(currentSegmentIndex - 1);
      setProgress(0);
    }
  };

  const handleSkipForward = () => {
    if (currentSegmentIndex < article.segments.length - 1) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
      setProgress(0);
    }
  };

  const getSceneStyles = () => {
    switch (sceneMode) {
      case 'driving':
        return { backgroundColor: '#020617' };
      case 'gym':
        return { backgroundColor: '#020617' };
      default:
        return { backgroundColor: '#020617' };
    }
  };

  const currentSegment = article.segments[currentSegmentIndex] || {
    type: 'text',
    content: '内容结束。',
  };

  const buttonSize = sceneMode === 'driving' ? 'large' : 'standard';

  return (
    <View style={[styles.container, getSceneStyles()]}>
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
            {article.author} • {article.duration}
          </Text>
        </View>

        {/* Content Renderer */}
        <View style={styles.contentArea}>
          <ContentRenderer segment={currentSegment} codeMode={codeMode} />
        </View>
      </ScrollView>

      {/* Code Mode Selector */}
      <CodeModeSelector codeMode={codeMode} onModeChange={setCodeMode} />

      {/* Player Controls */}
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
          onLibraryPress={onLibraryPress}
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
    paddingVertical: 16,
    paddingTop: 32,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
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
    fontSize: 24,
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
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 16,
  },
});

