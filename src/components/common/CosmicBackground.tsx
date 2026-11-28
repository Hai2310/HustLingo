import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cosmic } from '@/theme/cosmic';
import { useMotionPreference } from '@/theme/MotionPreference';

const stars = [
  [8, 11], [22, 42], [29, 20], [37, 78], [48, 8], [56, 53], [63, 26],
  [69, 86], [74, 12], [80, 45], [83, 67], [91, 23], [95, 71], [14, 85],
] as const;

export function CosmicBackground() {
  const reduced = useMotionPreference() !== false;
  const drift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (Platform.OS === 'web' || reduced) { drift.setValue(0); return; }
    const move = (toValue: number) => Animated.timing(drift, {
      toValue, duration: 11000, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false,
    });
    const loop = Animated.loop(Animated.sequence([move(1), move(0)]));
    loop.start();
    return () => loop.stop();
  }, [drift, reduced]);

  return (
    <View nativeID="cosmic-background" pointerEvents="none" aria-hidden style={styles.layer}>
      {Platform.OS !== 'web' && <>
        <LinearGradient colors={[cosmic.canvas, cosmic.violetSurface, cosmic.canvas]} style={StyleSheet.absoluteFill} />
        <Animated.View style={[styles.aurora, { transform: [{ translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [-34, 30] }) }] }]}>
          <LinearGradient colors={[cosmic.clear, cosmic.iceSurface, cosmic.clear]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
        {stars.map(([left, top]) => <View key={left} style={[styles.star, { left: `${left}%`, top: `${top}%` }]} />)}
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden', backgroundColor: cosmic.canvas },
  aurora: { position: 'absolute', left: '-30%', top: 0, width: '160%', height: '100%', opacity: 0.65 },
  star: { position: 'absolute', width: 2, height: 2, backgroundColor: cosmic.ice, borderRadius: 1, opacity: 0.32 },
});
