import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { radius, shadow } from '@/theme/layout';
import { MotionPressable } from '../motion/Motion';

export function AppCard({ children, onPress, style, dark = false }: { children: React.ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle>; dark?: boolean }) {
  const body = <View style={[styles.card, dark && styles.dark, style]}>{children}</View>;
  if (!onPress) return body;
  return <MotionPressable onPress={onPress}>{body}</MotionPressable>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16, ...shadow.card },
  dark:{backgroundColor:colors.charcoal,borderColor:colors.charcoal},
});
