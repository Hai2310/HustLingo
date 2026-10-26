import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

export function FadeIn({ children, delay = 0, distance = 12, style }: { children: React.ReactNode; delay?: number; distance?: number; style?: StyleProp<ViewStyle> }) {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(p, { toValue: 1, duration: 440, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [delay, p]);
  return (
    <Animated.View style={[style, { opacity: p, transform: [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }] }]}>
      {children}
    </Animated.View>
  );
}

export function ScaleIn({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(p, { toValue: 1, delay, tension: 70, friction: 10, useNativeDriver: true }).start();
  }, [delay, p]);
  return <Animated.View style={[style, { opacity: p, transform: [{ scale: p }] }]}>{children}</Animated.View>;
}

export function MotionPressable({ children, style, onPressIn, onPressOut, ...props }: PressableProps & { style?: StyleProp<ViewStyle> }) {
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (toValue: number) => Animated.spring(scale, { toValue, speed: 28, bounciness: 2, useNativeDriver: true }).start();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        {...props}
        onPressIn={(e) => { animate(0.972); onPressIn?.(e); }}
        onPressOut={(e) => { animate(1); onPressOut?.(e); }}
        style={style as any}
      >{children}</Pressable>
    </Animated.View>
  );
}

export function Pulse({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(p, { toValue: 1, duration: 1700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(p, { toValue: 0, duration: 1700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [p]);
  return <Animated.View style={[style, { transform: [{ scale: p.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] }) }] }]}>{children}</Animated.View>;
}

export function Float({ children, distance = 7, duration = 2200, delay = 0, style }: { children: React.ReactNode; distance?: number; duration?: number; delay?: number; style?: StyleProp<ViewStyle> }) {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(p, { toValue: 1, duration, delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(p, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [delay, duration, p]);
  return <Animated.View style={[style, { transform: [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [0, -distance] }) }] }]}>{children}</Animated.View>;
}

export function Shimmer({ style }: { style?: StyleProp<ViewStyle> }) {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.delay(850),
      Animated.timing(p, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      Animated.timing(p, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.delay(1700),
    ]));
    loop.start();
    return () => loop.stop();
  }, [p]);
  return <Animated.View pointerEvents="none" style={[style, { opacity: 0.22, transform: [{ translateX: p.interpolate({ inputRange: [0, 1], outputRange: [-220, 620] }) }, { rotate: '18deg' }] }]} />;
}
