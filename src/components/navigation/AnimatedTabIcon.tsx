import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cosmic } from '@/theme/cosmic';
import { useMotionPreference } from '@/theme/MotionPreference';

export function AnimatedTabIcon({ name, focused, color, size }: { name:keyof typeof Ionicons.glyphMap; focused:boolean; color:string; size:number }) {
  const reduced = useMotionPreference() !== false;
  const lift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) { lift.setValue(0); return; }
    const animation = Animated.spring(lift, { toValue: focused ? -3 : 0, stiffness: 310, damping: 16, mass: 0.6, useNativeDriver: Platform.OS !== 'web', isInteraction: false });
    animation.start();
    return () => animation.stop();
  }, [focused, lift, reduced]);
  return (
    <Animated.View aria-hidden style={[styles.wrap, { transform: [{ translateY: lift }] }]}>
      <View style={[styles.bg, focused && styles.bgOn]}><Ionicons name={name} color={color} size={size} /></View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  wrap: { width: 42, height: 35, alignItems: 'center', justifyContent: 'center' },
  bg: { width: 39, height: 31, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  bgOn: { backgroundColor: cosmic.iceSurface, borderWidth: 1, borderColor: cosmic.iceEdge, boxShadow: '0 0 14px #4c8da966' },
});
