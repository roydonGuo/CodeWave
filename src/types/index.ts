// 统一导出类型
export type { Article, Segment, CodeSegment, TextSegment } from '../data/mockData';

// 场景模式
/**
 * standard: 标准模式
 * gym: 健身房模式
 * running: 跑步模式
 * driving: 驾驶模式
 * private: 私人模式
 */
export type SceneMode = 'standard' | 'gym' | 'running' | 'driving' | 'private';

// 代码处理模式
export type CodeMode = 'skip' | 'label' | 'summary';

