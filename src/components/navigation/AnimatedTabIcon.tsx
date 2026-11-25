import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hum } from '@/theme/hum';
import { useMotionPreference } from '@/theme/MotionPreference';

export function AnimatedTabIcon({ name, focused, color, size }: { name:keyof typeof Ionicons.glyphMap; focused:boolean; color:string; size:number }) {
  const reduced = useMotionPreference() !== false;
  const lift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) { lift.setValue(0); return; }
    const animation = Animated.timing(lift, { toValue: focused ? -2 : 0, duration: 140, useNativeDriver: Platform.OS !== 'web', isInteraction: false });
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
  bgOn: { backgroundColor: hum.pear, borderWidth: 1, borderBottomWidth: 3, borderColor: hum.pearEdge },
});
