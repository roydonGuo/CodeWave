import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

interface StandardShaderBackgroundProps {
  active: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

type WaveLine = {
  id: string;
  y: number;
  amplitude: number;
  frequency: number;
  speed: number;
  width: number;
  opacity: number;
  phase: number;
  translateX: Animated.Value;
};

type MovingCircle = {
  id: string;
  initialX: number;
  initialY: number;
  radius: number;
  opacity: number;
  speed: number;
  translateX: Animated.Value;
  translateY: Animated.Value;
};

export const StandardShaderBackground: React.FC<StandardShaderBackgroundProps> = ({
  active,
  intensity = 'low',
}) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const [waveLines, setWaveLines] = useState<WaveLine[]>([]);
  const [circles, setCircles] = useState<MovingCircle[]>([]);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const circleAnimationsRef = useRef<Map<string, { h: Animated.CompositeAnimation; v: Animated.CompositeAnimation }>>(new Map());

  const config = {
    low: { waveCount: 6, circleCount: 3, spawnInterval: 4000 },
    medium: { waveCount: 10, circleCount: 5, spawnInterval: 2500 },
    high: { waveCount: 14, circleCount: 7, spawnInterval: 1800 },
  }[intensity];

  // 生成波浪线
  const generateWaveLine = (): WaveLine => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const y = SCREEN_HEIGHT * (0.2 + Math.random() * 0.6);
    const amplitude = 20 + Math.random() * 40;
    const frequency = 0.01 + Math.random() * 0.02;
    const speed = 0.3 + Math.random() * 0.4;
    const width = 1 + Math.random() * 2;
    const opacity = 0.15 + Math.random() * 0.25;
    const phase = Math.random() * Math.PI * 2;
    const translateX = new Animated.Value(0);

    return {
      id,
      y,
      amplitude,
      frequency,
      speed,
      width,
      opacity,
      phase,
      translateX,
    };
  };

  // 生成移动的圆形
  const generateCircle = (): MovingCircle => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const initialX = -50 - Math.random() * 100;
    const initialY = SCREEN_HEIGHT * (0.3 + Math.random() * 0.4);
    const radius = 2 + Math.random() * 3;
    const opacity = 0.15 + Math.random() * 0.25;
    const speed = 0.3 + Math.random() * 0.5;
    const translateX = new Animated.Value(0);
    const translateY = new Animated.Value(0);

    return { id, initialX, initialY, radius, opacity, speed, translateX, translateY };
  };

  // 初始化波浪线和圆形
  useEffect(() => {
    if (!active) {
      setWaveLines([]);
      setCircles([]);
      return;
    }

    const initialWaves = Array.from({ length: config.waveCount }, () => generateWaveLine());
    const initialCircles = Array.from({ length: config.circleCount }, () => generateCircle());
    setWaveLines(initialWaves);
    setCircles(initialCircles);
  }, [active, config.waveCount, config.circleCount, SCREEN_WIDTH, SCREEN_HEIGHT]);

  // 定期生成新的圆形
  useEffect(() => {
    if (!active) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCircles((prev) => {
        if (prev.length >= config.circleCount * 2) {
          // 移除最旧的圆形
          const oldest = prev[0];
          if (oldest) {
            const anims = circleAnimationsRef.current.get(oldest.id);
            if (anims) {
              anims.h.stop();
              anims.v.stop();
              circleAnimationsRef.current.delete(oldest.id);
            }
          }
          return prev.slice(1);
        }
        return [...prev, generateCircle()];
      });
    }, config.spawnInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active, config.circleCount, config.spawnInterval]);

  // 波浪线动画
  useEffect(() => {
    if (!active) return;

    waveLines.forEach((wave) => {
      wave.translateX.setValue(0);
      const anim = Animated.loop(
        Animated.timing(wave.translateX, {
          toValue: SCREEN_WIDTH * 2,
          duration: (4000 + Math.random() * 3000) / wave.speed,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      anim.start();
    });
  }, [active, waveLines, SCREEN_WIDTH]);

  // 圆形动画
  useEffect(() => {
    if (!active) {
      circleAnimationsRef.current.forEach((anims) => {
        anims.h.stop();
        anims.v.stop();
      });
      circleAnimationsRef.current.clear();
      return;
    }

    circles.forEach((circle) => {
      if (circleAnimationsRef.current.has(circle.id)) return;

      circle.translateX.setValue(0);
      circle.translateY.setValue(0);

      const horizontalAnim = Animated.loop(
        Animated.timing(circle.translateX, {
          toValue: SCREEN_WIDTH + 100,
          duration: (5000 + Math.random() * 3000) / circle.speed,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      const verticalAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(circle.translateY, {
            toValue: -40,
            duration: 2500 + Math.random() * 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(circle.translateY, {
            toValue: 40,
            duration: 2500 + Math.random() * 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );

      horizontalAnim.start();
      verticalAnim.start();
      circleAnimationsRef.current.set(circle.id, { h: horizontalAnim, v: verticalAnim });
    });
  }, [active, circles, SCREEN_WIDTH]);

  if (!active || SCREEN_WIDTH === 0 || SCREEN_HEIGHT === 0) return null;

  // 生成网格线
  const gridLines = [];
  const gridSpacing = 60;
  for (let i = 0; i < SCREEN_WIDTH; i += gridSpacing) {
    gridLines.push(
      <Line
        key={`v-${i}`}
        x1={i}
        y1={0}
        x2={i}
        y2={SCREEN_HEIGHT}
        stroke="rgba(100, 100, 100, 0.08)"
        strokeWidth={0.5}
      />
    );
  }
  for (let i = 0; i < SCREEN_HEIGHT; i += gridSpacing) {
    gridLines.push(
      <Line
        key={`h-${i}`}
        x1={0}
        y1={i}
        x2={SCREEN_WIDTH}
        y2={i}
        stroke="rgba(100, 100, 100, 0.08)"
        strokeWidth={0.5}
      />
    );
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* 渐变背景 */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: '#1a1a4d',
          },
        ]}
      />

      {/* SVG 内容 - 网格线 */}
      <Svg style={StyleSheet.absoluteFill} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
        {gridLines}
      </Svg>

      {/* 使用 Animated.View 渲染圆形（因为 SVG 的 transform 不支持 Animated） */}
      {circles.map((circle) => (
        <Animated.View
          key={circle.id}
          style={[
            {
              position: 'absolute',
              left: circle.initialX,
              top: circle.initialY,
              transform: [
                { translateX: circle.translateX },
                { translateY: circle.translateY },
              ],
            },
          ]}
        >
          <Svg width={circle.radius * 2} height={circle.radius * 2}>
            <Circle
              cx={circle.radius}
              cy={circle.radius}
              r={circle.radius}
              fill="rgba(100, 50, 200, 0.6)"
              opacity={circle.opacity}
            />
          </Svg>
        </Animated.View>
      ))}

      {/* 波浪线效果 - 使用水平移动的线条 */}
      {waveLines.map((wave) => (
        <Animated.View
          key={wave.id}
          style={[
            {
              position: 'absolute',
              top: wave.y - wave.width / 2,
              left: 0,
              width: SCREEN_WIDTH * 2,
              height: wave.width,
              transform: [{ translateX: wave.translateX }],
              opacity: wave.opacity,
            },
          ]}
        >
          <Svg width={SCREEN_WIDTH * 2} height={wave.width}>
            <Line
              x1={0}
              y1={wave.width / 2}
              x2={SCREEN_WIDTH * 2}
              y2={wave.width / 2}
              stroke="rgba(100, 50, 200, 0.5)"
              strokeWidth={wave.width}
            />
          </Svg>
        </Animated.View>
      ))}

      {/* 垂直渐变遮罩 */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: 0.2,
            backgroundColor: 'transparent',
          },
        ]}
      />
    </View>
  );
};

