import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { glassCard } from '@/theme/cosmic';
import { MotionPressable } from '../motion/Motion';

export function AppCard({ children, onPress, style, dark = false }: { children: React.ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle>; dark?: boolean }) {
  const body = <View style={[styles.card, dark && styles.dark, style]}>{children}</View>;
  if (!onPress) return body;
  return <MotionPressable accessibilityRole="button" onPress={onPress}>{body}</MotionPressable>;
}

const styles = StyleSheet.create({
  card: { ...glassCard, padding: 16 },
  dark:{backgroundColor:colors.charcoal,borderColor:colors.charcoal},
});
