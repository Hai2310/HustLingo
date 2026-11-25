import React from 'react';
import { ActivityIndicator, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { paperButton } from '@/theme/hum';
import { MotionPressable } from '../motion/Motion';

interface Props { title: string; onPress: () => void; loading?: boolean; disabled?: boolean; icon?: keyof typeof Ionicons.glyphMap; variant?: 'primary' | 'secondary' | 'ghost' | 'dark'; style?: ViewStyle; }

export function AppButton({ title, onPress, loading, disabled, icon, variant = 'primary', style }: Props) {
  const variantStyle = variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : variant === 'dark' ? styles.dark : styles.ghost;
  const ink = variant === 'dark' ? colors.white : variant === 'primary' ? colors.actionText : colors.primary;
  return (
    <MotionPressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ busy: loading, disabled: disabled || loading }} onPress={onPress} disabled={disabled || loading} style={[styles.button, variantStyle, style, (disabled || loading) && styles.disabled]}>
      {loading ? <ActivityIndicator color={ink} /> : <>
        {icon && <Ionicons aria-hidden name={icon} size={18} color={ink} />}
        <Text style={[styles.text, { color: ink }]}>{title}</Text>
      </>}
    </MotionPressable>
  );
}

const styles = StyleSheet.create({
  button: { ...paperButton, minHeight: 50, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primary: { backgroundColor: colors.action, borderColor: colors.actionEdge },
  secondary: { backgroundColor: colors.surface, borderColor: colors.borderStrong },
  ghost: { backgroundColor: colors.primarySoft, borderColor: 'transparent', borderBottomWidth: 1 },
  dark: { backgroundColor: colors.charcoal, borderColor: colors.charcoal },
  disabled: { opacity: 0.45 },
  text: { fontSize: 15, fontWeight: '700', flexShrink: 1, textAlign: 'center' },
});
