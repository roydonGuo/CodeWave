import React, { useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlayerScreen } from '../pages/PlayerScreen';
import { LibraryScreen } from '../pages/LibraryScreen';
import { ProfileScreen } from '../pages/ProfileScreen';
import { BottomNavigation, TabType } from '../components/BottomNavigation';
import { Article } from '../types';
import { useAuth } from '../state/auth/AuthContext';
import { AppBackground } from '../components/AppBackground';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

export const MainTabs: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('player');
  const [mountedTabs, setMountedTabs] = useState<TabType[]>(['player']);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const insets = useSafeAreaInsets();
  const auth = useAuth();

  const handleArticleSelect = (article: Article) => {
    setCurrentArticle(article);
    setIsPlaying(true);
    handleTabChange('player');
  };

  const handleTabChange = (nextTab: TabType) => {
    setActiveTab(nextTab);
    if (!mountedTabs.includes(nextTab)) {
      setMountedTabs((prev) => [...prev, nextTab]);
    }
  };

  const mainTabNodes = useMemo(() => {
    const renderTab = (tab: TabType) => {
      switch (tab) {
        case 'library':
          return (
            <LibraryScreen
              currentArticle={currentArticle}
              isPlaying={isPlaying}
              onArticleSelect={handleArticleSelect}
              onCreatePostPress={() => navigation.navigate('CreatePost')}
            />
          );
        case 'profile':
          return (
            <ProfileScreen
              isLoggedIn={auth.isLoggedIn}
              username={auth.user?.username ?? null}
              email={auth.user?.email ?? null}
              onLoginPress={() => navigation.navigate('Login')}
              onLogoutPress={() => auth.logout()}
            />
          );
        case 'player':
        default:
          return (
            <PlayerScreen
              article={currentArticle}
              onLibraryPress={() => handleTabChange('library')}
            />
          );
      }
    };

    return mountedTabs.map((tab) => (
      <View
        key={tab}
        style={[styles.tabPage, { display: activeTab === tab ? 'flex' : 'none' }]}
      >
        {renderTab(tab)}
      </View>
    ));
  }, [mountedTabs, activeTab, currentArticle, isPlaying, auth, navigation]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <View style={styles.container}>
        <AppBackground />
        <View style={styles.content}>{mainTabNodes}</View>
        <View
          style={[styles.navigation, { paddingBottom: Math.max(insets.bottom, 0) }]}
        >
          <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // 防止底层露白
  },
  content: {
    flex: 1,
  },
  navigation: {
    backgroundColor: 'rgba(2, 0, 12, 0.6)',
  },
  tabPage: {
    flex: 1,
  },
});


