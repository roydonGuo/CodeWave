import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

/**
 * 全局背景渐变（径向）
 * 对应 CSS: radial-gradient(125% 125% at 50% 100%, rgb(124, 111, 201) 40%, rgb(1,1,51) 100%)
 */
export const AppBackground: React.FC = () => {
  const { width, height } = useWindowDimensions();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="appBgGradient"
            cx="50%"
            cy="100%"
            r="125%"
            fx="50%"
            fy="100%"
          >
            <Stop offset="20%" stopColor="rgb(7, 1, 41)" stopOpacity="1" />
            <Stop offset="40%" stopColor="rgb(16, 5, 75)" stopOpacity="1" />
            <Stop offset="60%" stopColor="rgb(15, 4, 71)" stopOpacity="1" />
            <Stop offset="80%" stopColor="rgb(5, 0, 31)" stopOpacity="1" />
            <Stop offset="100%" stopColor="rgb(0, 0, 0)" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="url(#appBgGradient)" />
      </Svg>
    </View>
  );
};

