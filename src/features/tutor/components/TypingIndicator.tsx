import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';
import { useMotionPreference } from '@/theme/MotionPreference';

export function TypingIndicator() {
  const progress = useRef(new Animated.Value(0)).current;
  const reduced = useMotionPreference() !== false;
  useEffect(() => {
    if (reduced) { progress.setValue(1); return; }
    const timing = { duration: 700, useNativeDriver: Platform.OS !== 'web', isInteraction: false };
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(progress, { ...timing, toValue: 1 }),
      Animated.timing(progress, { ...timing, toValue: 0 }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [progress, reduced]);
  return (
    <View style={styles.bubble}>
      {[0, 1, 2].map(index => (
        <Animated.View key={index} style={[styles.dot, { opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.35 + index * 0.15, 1] }) }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { flexDirection: 'row', gap: 5, alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 14, borderRadius: 17, borderBottomLeftRadius: 5, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  dot: { width: 6, height: 6, borderRadius: 6, backgroundColor: colors.primary },
});
