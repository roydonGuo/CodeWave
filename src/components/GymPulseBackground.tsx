import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface GymPulseBackgroundProps {
  active: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export const GymPulseBackground: React.FC<GymPulseBackgroundProps> = ({
  active,
  intensity = 'medium',
}) => {
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  const config = useMemo(() => {
    switch (intensity) {
      case 'low':
        return { duration: 2600, maxOpacity: 0.18 };
      case 'high':
        return { duration: 1500, maxOpacity: 0.34 };
      case 'medium':
      default:
        return { duration: 2000, maxOpacity: 0.26 };
    }
  }, [intensity]);

  useEffect(() => {
    if (!active) {
      loopRef.current?.stop();
      loopRef.current = null;
      a1.setValue(0);
      a2.setValue(0);
      return;
    }

    const makeLoop = () =>
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(a1, {
              toValue: 1,
              duration: config.duration,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(a1, {
              toValue: 0,
              duration: config.duration,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.delay(config.duration / 2),
            Animated.timing(a2, {
              toValue: 1,
              duration: config.duration,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(a2, {
              toValue: 0,
              duration: config.duration,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ])
      );

    loopRef.current = makeLoop();
    loopRef.current.start();

    return () => {
      loopRef.current?.stop();
      loopRef.current = null;
    };
  }, [active, a1, a2, config.duration]);

  const ringStyle = (a: Animated.Value) => ({
    opacity: a.interpolate({
      inputRange: [0, 1],
      outputRange: [0, config.maxOpacity],
    }),
    transform: [
      {
        scale: a.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.6],
        }),
      },
    ],
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.wash} />
      <Animated.View style={[styles.ring, styles.ringOne, ringStyle(a1)]} />
      <Animated.View style={[styles.ring, styles.ringTwo, ringStyle(a2)]} />
    </View>
  );
};

const styles = StyleSheet.create({
  wash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.18)',
  },
  ring: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: '#4f46e5',
  },
  ringOne: {
    left: -80,
    top: 120,
  },
  ringTwo: {
    right: -90,
    bottom: 140,
    backgroundColor: '#818cf8',
  },
});


