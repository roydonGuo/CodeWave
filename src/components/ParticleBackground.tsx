import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

type Particle = {
  id: string;
  x: number;
  size: number;
  opacity: number;
  durationMs: number;
  translateY: Animated.Value;
};

interface ParticleBackgroundProps {
  active: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  active,
  intensity = 'medium',
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationsRef = useRef<Map<string, Animated.CompositeAnimation>>(new Map());

  const config = useMemo(() => {
    switch (intensity) {
      case 'low':
        return { spawnEveryMs: 260, maxParticles: 18 };
      case 'high':
        return { spawnEveryMs: 120, maxParticles: 40 };
      case 'medium':
      default:
        return { spawnEveryMs: 170, maxParticles: 28 };
    }
  }, [intensity]);

  useEffect(() => {
    if (!active) {
      // stop + cleanup
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      animationsRef.current.forEach((a) => a.stop());
      animationsRef.current.clear();
      setParticles([]);
      return;
    }

    timerRef.current = setInterval(() => {
      setParticles((prev) => {
        if (prev.length >= config.maxParticles) {
          return prev;
        }

        const p = makeParticle();
        return [...prev, p];
      });
    }, config.spawnEveryMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [active, config.maxParticles, config.spawnEveryMs]);

  useEffect(() => {
    // start animations for new particles
    particles.forEach((p) => {
      if (animationsRef.current.has(p.id)) return;

      const anim = Animated.timing(p.translateY, {
        toValue: -220,
        duration: p.durationMs,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      });

      animationsRef.current.set(p.id, anim);
      anim.start(({ finished }) => {
        animationsRef.current.delete(p.id);
        if (finished) {
          setParticles((prev) => prev.filter((x) => x.id !== p.id));
        }
      });
    });
  }, [particles]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.gradientWash} />
      {particles.map((p) => (
        <Animated.View
          key={p.id}
          style={[
            styles.particle,
            {
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              transform: [{ translateY: p.translateY }],
            },
          ]}
        />
      ))}
    </View>
  );
};

function makeParticle(): Particle {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const x = 6 + Math.random() * 88;
  const size = 2 + Math.random() * 5;
  const opacity = 0.12 + Math.random() * 0.18;
  const durationMs = 1600 + Math.random() * 1600;
  const translateY = new Animated.Value(260);

  return { id, x, size, opacity, durationMs, translateY };
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 999,
    backgroundColor: '#818cf8',
  },
  gradientWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.15)',
  },
});


