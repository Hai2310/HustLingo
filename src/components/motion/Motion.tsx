import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { useMotionPreference } from '@/theme/MotionPreference';

export function FadeIn({ children, delay = 0, distance = 12, style }: { children: React.ReactNode; delay?: number; distance?: number; style?: StyleProp<ViewStyle> }) {
  const reduced = useMotionPreference() !== false;
  const p = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reduced) { p.setValue(1); return; }
    p.setValue(0.75);
    const animation = Animated.timing(p, { toValue: 1, duration: 230, delay: Math.min(delay, 120), easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web', isInteraction: false });
    animation.start();
    return () => animation.stop();
  }, [delay, p, reduced]);
  return (
    <Animated.View style={[style, { opacity: p, transform: [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }] }]}>
      {children}
    </Animated.View>
  );
}

export function ScaleIn({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  return <FadeIn delay={delay} distance={8} style={style}>{children}</FadeIn>;
}

export function MotionPressable({ children, style, onPressIn, onPressOut, ...props }: PressableProps & { style?: StyleProp<ViewStyle> }) {
  const reduced = useMotionPreference() !== false;
  const lift = useRef(new Animated.Value(0)).current;
  useEffect(() => { if (reduced) lift.setValue(0); }, [lift, reduced]);
  const animate = (toValue: number) => {
    if (reduced) return;
    Animated.spring(lift, { toValue, stiffness: 340, damping: 18, mass: 0.55, useNativeDriver: Platform.OS !== 'web', isInteraction: false }).start();
  };
  return (
    <Animated.View style={{ transform: [{ translateY: lift }, { scale: lift.interpolate({ inputRange: [0, 2], outputRange: [1, 0.975] }) }] }}>
      <Pressable
        {...props}
        onPressIn={(e) => { animate(2); onPressIn?.(e); }}
        onPressOut={(e) => { animate(0); onPressOut?.(e); }}
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

export function Float({ children, distance = 7, duration = 2200, delay = 0, iterations = -1, style }: { children: React.ReactNode; distance?: number; duration?: number; delay?: number; iterations?: number; style?: StyleProp<ViewStyle> }) {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(p, { toValue: 1, duration, delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(p, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]), { iterations });
    loop.start();
    return () => loop.stop();
  }, [delay, duration, iterations, p]);
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
