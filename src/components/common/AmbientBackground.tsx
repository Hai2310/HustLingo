import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';

export function AmbientBackground() {
  const drift = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 7800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 7800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 5400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 5400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    driftLoop.start();
    breatheLoop.start();
    return () => { driftLoop.stop(); breatheLoop.stop(); };
  }, [breathe, drift]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.orb, styles.red, { transform: [
        { translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [0, 40] }) },
        { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, -24] }) },
        { scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) },
      ] }]} />
      <Animated.View style={[styles.orb, styles.orange, { transform: [
        { translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [0, -34] }) },
        { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, 28] }) },
      ] }]} />
      <Animated.View style={[styles.orb, styles.blue, { transform: [
        { translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [-12, 22] }) },
        { translateY: breathe.interpolate({ inputRange: [0, 1], outputRange: [0, 20] }) },
        { scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.04] }) },
      ] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: { position: 'absolute', borderRadius: 999 },
  red: { width: 300, height: 300, right: -155, top: 70, backgroundColor: colors.primaryWash, opacity: 0.40 },
  orange: { width: 245, height: 245, left: -150, top: 380, backgroundColor: colors.orangeSoft, opacity: 0.52 },
  blue: { width: 210, height: 210, right: -120, bottom: 120, backgroundColor: colors.blueSoft, opacity: 0.45 },
});
