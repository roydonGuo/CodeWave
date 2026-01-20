import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

type Streak = {
  id: string;
  topPct: number;
  height: number;
  width: number;
  opacity: number;
  durationMs: number;
  translateX: Animated.Value;
};

interface DrivingStreakBackgroundProps {
  active: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export const DrivingStreakBackground: React.FC<DrivingStreakBackgroundProps> = ({
  active,
  intensity = 'medium',
}) => {
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationsRef = useRef<Map<string, Animated.CompositeAnimation>>(new Map());

  const config = useMemo(() => {
    switch (intensity) {
      case 'low':
        return { spawnEveryMs: 220, max: 16 };
      case 'high':
        return { spawnEveryMs: 90, max: 36 };
      case 'medium':
      default:
        return { spawnEveryMs: 140, max: 24 };
    }
  }, [intensity]);

  useEffect(() => {
    if (!active) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      animationsRef.current.forEach((a) => a.stop());
      animationsRef.current.clear();
      setStreaks([]);
      return;
    }

    timerRef.current = setInterval(() => {
      setStreaks((prev) => {
        if (prev.length >= config.max) return prev;
        return [...prev, makeStreak()];
      });
    }, config.spawnEveryMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [active, config.max, config.spawnEveryMs]);

  useEffect(() => {
    streaks.forEach((s) => {
      if (animationsRef.current.has(s.id)) return;

      const anim = Animated.timing(s.translateX, {
        toValue: 420,
        duration: s.durationMs,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      });

      animationsRef.current.set(s.id, anim);
      anim.start(({ finished }) => {
        animationsRef.current.delete(s.id);
        if (finished) setStreaks((prev) => prev.filter((x) => x.id !== s.id));
      });
    });
  }, [streaks]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.wash} />
      {streaks.map((s) => (
        <Animated.View
          key={s.id}
          style={[
            styles.streak,
            {
              top: `${s.topPct}%`,
              height: s.height,
              width: s.width,
              opacity: s.opacity,
              transform: [{ translateX: s.translateX }],
            },
          ]}
        />
      ))}
    </View>
  );
};

function makeStreak(): Streak {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const topPct = 12 + Math.random() * 70;
  const height = 1 + Math.random() * 2.5;
  const width = 40 + Math.random() * 160;
  const opacity = 0.06 + Math.random() * 0.14;
  const durationMs = 600 + Math.random() * 700;
  const translateX = new Animated.Value(-260 - Math.random() * 120);
  return { id, topPct, height, width, opacity, durationMs, translateX };
}

const styles = StyleSheet.create({
  wash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.20)',
  },
  streak: {
    position: 'absolute',
    left: 0,
    borderRadius: 999,
    backgroundColor: '#c7d2fe',
  },
});


