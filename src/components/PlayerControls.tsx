import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Layers,
} from 'lucide-react-native';

interface PlayerControlsProps {
  isPlaying: boolean;
  playbackSpeed: number;
  onPlayPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onSpeedChange: () => void;
  onLibraryPress: () => void;
  buttonSize?: 'standard' | 'large';
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  playbackSpeed,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onSpeedChange,
  onLibraryPress,
  buttonSize = 'standard',
}) => {
  const mainButtonSize = buttonSize === 'large' ? 96 : 88;

  return (
    <View style={styles.container}>
      <View style={styles.controlsRow}>
        {/* Speed Toggle */}
        <TouchableOpacity
          style={styles.speedButton}
          onPress={onSpeedChange}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.speedText}>{playbackSpeed}x</Text>
        </TouchableOpacity>

        {/* Main Controls */}
        <View style={styles.mainControls}>
          <TouchableOpacity
            onPress={onSkipBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <SkipBack size={32} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.playButton,
              { width: mainButtonSize, height: mainButtonSize },
            ]}
            onPress={onPlayPause}
          >
            {isPlaying ? (
              <Pause
                size={buttonSize === 'large' ? 40 : 32}
                color="#0f172a"
                fill="#0f172a"
              />
            ) : (
              <Play
                size={buttonSize === 'large' ? 40 : 32}
                color="#0f172a"
                fill="#0f172a"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSkipForward}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <SkipForward size={32} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Library Button */}
        <TouchableOpacity
          style={styles.libraryButton}
          onPress={onLibraryPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Layers size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speedButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  playButton: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  libraryButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

