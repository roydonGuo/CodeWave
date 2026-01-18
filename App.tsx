/**
 * CodeWave - 程序员技术博客转语音 App
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { PlayerScreen } from './src/pages/PlayerScreen';
import { LibraryScreen } from './src/pages/LibraryScreen';
import { ProfileScreen } from './src/pages/ProfileScreen';
import { BottomNavigation, TabType } from './src/components/BottomNavigation';
import { MOCK_LIBRARY } from './src/data/mockData';
import { Article } from './src/types';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('player');
  const [currentArticle, setCurrentArticle] = useState<Article>(MOCK_LIBRARY[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const insets = useSafeAreaInsets();

  const handleArticleSelect = (article: Article) => {
    setCurrentArticle(article);
    setIsPlaying(true);
    setActiveTab('player');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'library':
        return (
          <LibraryScreen
            currentArticle={currentArticle}
            isPlaying={isPlaying}
            onArticleSelect={handleArticleSelect}
          />
        );
      case 'profile':
        return <ProfileScreen />;
      case 'player':
      default:
        return (
          <PlayerScreen
            article={currentArticle}
            onLibraryPress={() => setActiveTab('library')}
          />
        );
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <View style={styles.container}>
        <View style={styles.content}>{renderContent()}</View>
        <View style={[styles.navigation, { paddingBottom: Math.max(insets.bottom, 0) }]}>
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </View>
      </View>
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    flex: 1,
  },
  navigation: {
    backgroundColor: '#0f172a',
  },
});

export default App;
