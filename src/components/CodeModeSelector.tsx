import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Settings } from 'lucide-react-native';
import { CodeMode } from '../types';

interface CodeModeSelectorProps {
  codeMode: CodeMode;
  onModeChange: (mode: CodeMode) => void;
}

export const CodeModeSelector: React.FC<CodeModeSelectorProps> = ({
  codeMode,
  onModeChange,
}) => {
  const modes: { id: CodeMode; label: string }[] = [
    { id: 'skip', label: '跳过' },
    { id: 'label', label: '仅标注' },
    { id: 'summary', label: 'AI摘要' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.labelContainer}>
          <Settings size={12} color="#64748b" />
          <Text style={styles.label}>代码处理策略</Text>
        </View>
        <View style={styles.modesContainer}>
          {modes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeButton,
                codeMode === mode.id && styles.modeButtonActive,
              ]}
              onPress={() => onModeChange(mode.id)}
            >
              <Text
                style={[
                  styles.modeText,
                  codeMode === mode.id && styles.modeTextActive,
                ]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  content: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  modesContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#1e293b',
  },
  modeButtonActive: {
    backgroundColor: '#4f46e5',
  },
  modeText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  modeTextActive: {
    color: '#ffffff',
  },
});

