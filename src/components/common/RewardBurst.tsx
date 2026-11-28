import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { cosmic } from '@/theme/cosmic';
import { useMotionPreference } from '@/theme/MotionPreference';

const confettiColors = [cosmic.ice, cosmic.gold, cosmic.rose, cosmic.violet, cosmic.mint] as const;
const particles = Array.from({ length: 12 }, (_, index) => {
  const angle = index * Math.PI / 6;
  return { x: Math.cos(angle) * (60 + (index % 3) * 22), y: Math.sin(angle) * 48, color: confettiColors[index % confettiColors.length] };
});

export function RewardBurst({ lesson = false }: { lesson?: boolean } = {}) {
  const reduced = useMotionPreference() !== false;
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const animation = Animated.timing(progress, { toValue: 1, duration: lesson ? 920 : 750, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web', isInteraction: false });
    animation.start();
    return () => animation.stop();
  }, [lesson, progress, reduced]);

  if (reduced) return null;
  const opacity = progress.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] });
  return (
    <View testID="cosmic-reward-burst" style={[styles.burst, lesson && styles.lessonBurst]} pointerEvents="none" aria-hidden>
      {lesson && <Animated.View style={[styles.flare, { opacity, transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.15, 2.5] }) }] }]} />}
      {particles.map(({ x, y, color }, index) => (
        <Animated.View key={index} style={[
          styles.particle, lesson && styles.litParticle, { backgroundColor: color, opacity, transform: [
            { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, lesson ? x * 1.4 : x] }) },
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, lesson ? y * 1.65 : y] }) },
            { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${60 + index * 15}deg`] }) },
          ] },
        ]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  burst: { position: 'absolute', top: 17, left: '50%', width: 1, height: 1, zIndex: 2 },
  lessonBurst: { top: '47%' },
  particle: { position: 'absolute', width: 6, height: 4, borderRadius: 2 },
  litParticle: { width: 7, height: 7, boxShadow: '0 0 9px #c594ffe0' },
  flare: { position: 'absolute', left: -24, top: -24, width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: cosmic.gold, boxShadow: '0 0 14px #daa7ffdd' },
});
