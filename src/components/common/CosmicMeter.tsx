import React, { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cosmic } from '@/theme/cosmic';
import { useMotionPreference } from '@/theme/MotionPreference';

export function CosmicMeter({ value, max = 100, label, color = cosmic.ice, style, animateOnMount = false }: {
  value: number;
  max?: number;
  label: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  animateOnMount?: boolean;
}) {
  const reduced = useMotionPreference() !== false;
  const amount = Math.min(Math.max(value, 0), max);
  const fraction = max > 0 ? amount / max : 0;
  const [fill] = useState(() => new Animated.Value(animateOnMount && !reduced ? 0 : fraction));
  useEffect(() => {
    if (reduced) { fill.setValue(fraction); return; }
    const animation = Animated.spring(fill, {
      toValue: fraction, stiffness: 155, damping: 23, mass: 0.8, overshootClamping: true,
      useNativeDriver: Platform.OS !== 'web', isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [fill, fraction, reduced]);

  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={amount} style={[styles.track, style]}>
      <Animated.View style={[styles.fill, { transform: [{ scaleX: fill }] }]}>
        <LinearGradient colors={[cosmic.action, color]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, borderRadius: 8, backgroundColor: cosmic.raised, overflow: 'hidden' },
  fill: { width: '100%', height: '100%', transformOrigin: 'left center', overflow: 'hidden', borderRadius: 8 },
});
