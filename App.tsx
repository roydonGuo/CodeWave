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
import { LoginScreen } from './src/pages/LoginScreen';
import { CreatePostScreen } from './src/pages/CreatePostScreen';
import { BottomNavigation, TabType } from './src/components/BottomNavigation';
import { Article } from './src/types';
import { AuthProvider, useAuth } from './src/state/auth/AuthContext';
import { AppBackground } from './src/components/AppBackground';

type Route = 'main' | 'login' | 'createPost';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('player');
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [route, setRoute] = useState<Route>('main');
  const insets = useSafeAreaInsets();
  const auth = useAuth();

  const handleArticleSelect = (article: Article) => {
    setCurrentArticle(article);
    setIsPlaying(true);
    setActiveTab('player');
  };

  const renderContent = () => {
    if (route === 'login') {
      return (
        <LoginScreen
          onBack={() => {
            setRoute('main');
          }}
        />
      );
    }

    if (route === 'createPost') {
      return (
        <CreatePostScreen
          onBack={() => {
            setRoute('main');
          }}
        />
      );
    }

    switch (activeTab) {
      case 'library':
        return (
          <LibraryScreen
            currentArticle={currentArticle}
            isPlaying={isPlaying}
            onArticleSelect={handleArticleSelect}
            onCreatePostPress={() => setRoute('createPost')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            isLoggedIn={auth.isLoggedIn}
            username={auth.user?.username ?? null}
            email={auth.user?.email ?? null}
            onLoginPress={() => setRoute('login')}
            onLogoutPress={() => auth.logout()}
          />
        );
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
        <AppBackground />
        <View style={styles.content}>{renderContent()}</View>
        {route === 'main' && (
          <View
            style={[styles.navigation, { paddingBottom: Math.max(insets.bottom, 0) }]}
          >
            <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </View>
        )}
      </View>
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  navigation: {
    backgroundColor: 'rgba(2, 0, 12, 0.6)',
  },
});

export default App;
