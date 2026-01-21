import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react-native';

interface PlayerControlsProps {
  isPlaying: boolean;
  playbackSpeed: number;
  onPlayPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onSpeedChange: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  buttonSize?: 'standard' | 'large';
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  playbackSpeed,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onSpeedChange,
  isMuted,
  onToggleMute,
  buttonSize = 'standard',
}) => {
  const mainButtonSize = buttonSize === 'large' ? 88 : 78;

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
            <SkipBack size={28} color="#94a3b8" />
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
                size={buttonSize === 'large' ? 38 : 30}
                color="#0f172a"
                fill="#0f172a"
              />
            ) : (
              <Play
                size={buttonSize === 'large' ? 38 : 30}
                color="#0f172a"
                fill="#0f172a"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSkipForward}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <SkipForward size={28} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Mute Toggle */}
        <TouchableOpacity
          style={styles.muteButton}
          onPress={onToggleMute}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isMuted ? (
            <VolumeX size={24} color="#d5393e" />
          ) : (
            <Volume2 size={24} color="#94a3b8" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,  
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
  muteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

