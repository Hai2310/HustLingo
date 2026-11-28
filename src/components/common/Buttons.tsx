import React, { useId } from 'react';
import { ActivityIndicator, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { actionGradient, cosmic, gameButton } from '@/theme/cosmic';
import { MotionPressable } from '../motion/Motion';

interface Props { title: string; onPress: () => void; loading?: boolean; disabled?: boolean; icon?: keyof typeof Ionicons.glyphMap; variant?: 'primary' | 'secondary' | 'ghost' | 'dark'; style?: ViewStyle; }

export function AppButton({ title, onPress, loading, disabled, icon, variant = 'primary', style }: Props) {
  const id = useId();
  const variantStyle = variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : variant === 'dark' ? styles.dark : styles.ghost;
  const ink = variant === 'dark' ? colors.white : variant === 'primary' ? colors.actionText : colors.primary;
  return (
    <MotionPressable nativeID={'cosmic-press-' + id} accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ busy: loading, disabled: disabled || loading }} onPress={onPress} disabled={disabled || loading} style={[styles.button, variantStyle, style, (disabled || loading) && styles.disabled]}>
      {variant === 'primary' && <LinearGradient colors={actionGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} pointerEvents="none" style={StyleSheet.absoluteFill} />}
      {loading ? <ActivityIndicator color={ink} /> : <>
        {icon && <Ionicons aria-hidden name={icon} size={18} color={ink} />}
        <Text style={[styles.text, { color: ink }]}>{title}</Text>
      </>}
    </MotionPressable>
  );
}

const styles = StyleSheet.create({
  button: { ...gameButton, minHeight: 50, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, overflow: 'hidden' },
  primary: { backgroundColor: colors.action, borderColor: colors.actionEdge, boxShadow: '0 5px 20px #5233ba59' },
  secondary: { backgroundColor: colors.surface, borderColor: colors.borderStrong },
  ghost: { backgroundColor: colors.primarySoft, borderColor: 'transparent', borderBottomWidth: 1 },
  dark: { backgroundColor: colors.charcoal, borderColor: cosmic.border },
  disabled: { opacity: 0.45 },
  text: { fontSize: 15, fontWeight: '700', flexShrink: 1, textAlign: 'center' },
});
