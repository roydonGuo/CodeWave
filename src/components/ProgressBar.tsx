import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  currentSegment: number;
  totalSegments: number;
  progress: number; // 0-100
  duration: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentSegment,
  totalSegments,
  progress,
  duration,
}) => {
  const totalProgress =
    (currentSegment / totalSegments) * 100 + progress / totalSegments;

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={[styles.progressBar, { width: `${totalProgress}%` }]} />
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>00:{currentSegment}0</Text>
        <Text style={styles.timeText}>-{duration}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  barContainer: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: '#64748b',
    fontFamily: 'monospace',
  },
});

