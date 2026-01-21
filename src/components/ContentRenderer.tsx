import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SkipForward, Code as CodeIcon, Cpu } from 'lucide-react-native';
import { Segment, CodeMode } from '../types';

interface ContentRendererProps {
  segment: Segment;
  codeMode: CodeMode;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  segment,
  codeMode,
}) => {
  if (segment.type === 'text') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{segment.content}</Text>
      </View>
    );
  }

  if (segment.type === 'code') {
    if (codeMode === 'skip') {
      return (
        <View style={styles.skipContainer}>
          <SkipForward size={32} color="#64748b" />
          <Text style={styles.skipText}>已自动跳过代码块...</Text>
        </View>
      );
    }

    if (codeMode === 'label') {
      return (
        <View style={styles.labelContainer}>
          <View style={styles.labelHeader}>
            <CodeIcon size={24} color="#818cf8" />
            <Text style={styles.labelTitle}>语音标注模式</Text>
          </View>
          <Text style={styles.labelContent}>"正在朗读：{segment.label}"</Text>
          <View style={styles.codePreview}>
            <Text style={styles.codeText} numberOfLines={3}>
              {segment.raw}
            </Text>
          </View>
        </View>
      );
    }

    if (codeMode === 'summary') {
      return (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryHeaderLeft}>
              <Cpu size={20} color="#c7d2fe" />
              <Text style={styles.summaryHeaderText}>AI 语义摘要生成中</Text>
            </View>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>GPT-4 Turbo</Text>
            </View>
          </View>
          <Text style={styles.summaryContent}>{segment.summary}</Text>
          <View style={styles.codeContainer}>
            <View style={styles.codeLabel}>
              <Text style={styles.codeLabelText}>源代码(已静音)</Text>
            </View>
            <ScrollView style={styles.codeScrollView}>
              <Text style={styles.codeRawText}>{segment.raw}</Text>
            </ScrollView>
          </View>
        </View>
      );
    }
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  skipContainer: {
    height: 192,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#64748b',
  },
  labelContainer: {
    padding: 24,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  labelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  labelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#818cf8',
  },
  labelContent: {
    fontSize: 18,
    color: '#cbd5e1',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  codePreview: {
    opacity: 0.5,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#64748b',
    lineHeight: 18,
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#c7d2fe',
  },
  summaryBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  summaryBadgeText: {
    fontSize: 12,
    color: '#818cf8',
  },
  summaryContent: {
    fontSize: 18,
    lineHeight: 28,
    color: '#ffffff',
    marginBottom: 16,
  },
  codeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    position: 'relative',
    maxHeight: 200,
  },
  codeLabel: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomLeftRadius: 4,
  },
  codeLabelText: {
    fontSize: 10,
    color: '#f87171',
  },
  codeScrollView: {
    maxHeight: 150,
  },
  codeRawText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#94a3b8',
  },
});

