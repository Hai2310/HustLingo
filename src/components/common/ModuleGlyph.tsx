import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { moduleSpectra } from '@/theme/cosmic';

export type ModuleId = keyof typeof moduleSpectra;

export const moduleIcons = {
  vocabulary: 'text-outline',
  grammar: 'library-outline',
  listening: 'headset-outline',
  speaking: 'mic-outline',
  reading: 'book-outline',
  writing: 'create-outline',
} as const;

export function ModuleGlyph({ module, size = 44 }: { module: ModuleId; size?: number }) {
  const spectrum = moduleSpectra[module];
  return (
    <LinearGradient aria-hidden colors={spectrum.gradient} start={{ x: 0, y: 0.1 }} end={{ x: 0.85, y: 1 }}
      style={[styles.glyph, { width: size, height: size, borderRadius: size * 0.32, borderColor: spectrum.edge }]}>
      <Ionicons aria-hidden name={moduleIcons[module]} color={spectrum.main} size={Math.round(size * 0.48)} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  glyph: { flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderBottomWidth: 2 },
});
