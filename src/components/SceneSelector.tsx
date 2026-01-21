import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Headphones, Activity, Car, Dumbbell, PawPrint, VenetianMask  } from 'lucide-react-native';
import { SceneMode } from '../types';

interface SceneSelectorProps {
  sceneMode: SceneMode;
  onModeChange: (mode: SceneMode) => void;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({
  sceneMode,
  onModeChange,
}) => {
  const modes: { id: SceneMode; icon: typeof Headphones }[] = [
    { id: 'standard', icon: Headphones },
    { id: 'gym', icon: Dumbbell }, 
    { id: 'running', icon: PawPrint  },
    { id: 'driving', icon: Car },
    { id: 'private', icon: VenetianMask  },
  ];

  return (
    <View style={styles.container}>
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = sceneMode === mode.id;
        return (
          <TouchableOpacity
            key={mode.id}
            style={[styles.button, isActive && styles.buttonActive]}
            onPress={() => onModeChange(mode.id)}
          >
            <Icon size={16} color={isActive ? '#ffffff' : '#64748b'} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 4,
    gap: 4,
  },
  button: {
    padding: 7,
    borderRadius: 16,
  },
  buttonActive: {
    backgroundColor: '#4f46e5',
  },
});

