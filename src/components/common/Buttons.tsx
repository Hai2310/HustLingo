import React from 'react';
import { ActivityIndicator, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/layout';
import { MotionPressable } from '../motion/Motion';

interface Props { title: string; onPress: () => void; loading?: boolean; disabled?: boolean; icon?: keyof typeof Ionicons.glyphMap; variant?: 'primary' | 'secondary' | 'ghost' | 'dark'; style?: ViewStyle; }

export function AppButton({ title, onPress, loading, disabled, icon, variant = 'primary', style }: Props) {
  const variantStyle = variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : variant === 'dark' ? styles.dark : styles.ghost;
  const light = variant === 'primary' || variant === 'dark';
  return (
    <MotionPressable accessibilityRole="button" onPress={onPress} disabled={disabled || loading} style={[styles.button, variantStyle, style, (disabled || loading) && styles.disabled]}>
      {loading ? <ActivityIndicator color={light ? colors.white : colors.primary} /> : <>
        {icon && <Ionicons name={icon} size={18} color={light ? colors.white : colors.primary} />}
        <Text style={[styles.text, { color: light ? colors.white : colors.primary }]}>{title}</Text>
      </>}
    </MotionPressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 50, borderRadius: radius.md, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primary: { backgroundColor: colors.primary }, secondary: { backgroundColor: colors.surface, borderWidth: 1.2, borderColor: colors.primary }, ghost: { backgroundColor: colors.primarySoft }, dark: { backgroundColor: colors.charcoal }, disabled: { opacity: 0.45 }, text: { fontSize: 14, fontWeight: '800', letterSpacing: -0.1 },
});
