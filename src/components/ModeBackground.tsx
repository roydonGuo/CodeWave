import React from 'react';
import { SceneMode } from '../types';
import { ParticleBackground } from './ParticleBackground';
import { DrivingStreakBackground } from './DrivingStreakBackground';
import { GymPulseBackground } from './GymPulseBackground';
import { StandardShaderBackground } from './StandardShaderBackground';

type Intensity = 'low' | 'medium' | 'high';
type BackgroundVariant = 'particles' | 'drivingStreaks' | 'gymPulse' | 'standardShader';

interface ModeBackgroundConfig {
  variant: BackgroundVariant;
  intensity: Intensity;
}

// 所有场景模式背景配置集中在这里，后续扩展只改这个对象即可
const MODE_BACKGROUND_CONFIG: Record<SceneMode, ModeBackgroundConfig> = {
  standard: {
    // 标准模式：使用 shader 风格的动效背景
    variant: 'standardShader',
    intensity: 'low',
  },
  gym: {
    // 健身房：有节奏的脉冲光晕
    variant: 'gymPulse',
    intensity: 'medium',
  },
  running: {
    // 跑步：比 standard 略强的粒子流动，营造流动感
    variant: 'particles',
    intensity: 'medium',
  },
  driving: {
    // 驾驶：速度线效果，强调前进感
    variant: 'drivingStreaks',
    intensity: 'high',
  },
  private: {
    // 私人：更克制的粒子，保持安静不打扰
    variant: 'particles',
    intensity: 'low',
  },
};

interface ModeBackgroundProps {
  active: boolean;
  sceneMode: SceneMode;
}

export const ModeBackground: React.FC<ModeBackgroundProps> = ({ active, sceneMode }) => {
  const config = MODE_BACKGROUND_CONFIG[sceneMode] ?? MODE_BACKGROUND_CONFIG.standard;

  if (!active) {
    // 不在播放时不渲染任何动效，避免额外开销
    return null;
  }

  switch (config.variant) {
    case 'drivingStreaks':
      return <DrivingStreakBackground active intensity={config.intensity} />;
    case 'gymPulse':
      return <GymPulseBackground active intensity={config.intensity} />;
    case 'standardShader':
      return <StandardShaderBackground active intensity={config.intensity} />;
    case 'particles':
    default:
      return <ParticleBackground active intensity={config.intensity} />;
  }
};

