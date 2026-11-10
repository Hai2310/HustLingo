import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import type { TutorCorrection } from '../types';

export function CorrectionCard({ correction }: { correction: TutorCorrection }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}><Ionicons name="sparkles-outline" size={16} color={colors.primary} /><Text style={styles.title}>QUICK CORRECTION</Text></View>
      <Text style={styles.original}>{correction.original}</Text>
      <View style={styles.arrow}><Ionicons name="arrow-down" size={14} color={colors.textMuted} /></View>
      <Text style={styles.corrected}>{correction.corrected}</Text>
      <Text style={styles.explanation}>{correction.explanation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 2, marginBottom: 14, padding: 14, borderRadius: 15, backgroundColor: colors.violetSoft, borderWidth: 1, borderColor: '#D9D5FF' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  title: { fontSize: 8.5, fontWeight: '900', letterSpacing: 1, color: colors.violet },
  original: { marginTop: 10, fontSize: 12, color: colors.textSecondary, textDecorationLine: 'line-through' },
  arrow: { marginTop: 4 },
  corrected: { marginTop: 3, fontSize: 13, fontWeight: '900', color: colors.text },
  explanation: { marginTop: 7, fontSize: 11, lineHeight: 17, color: colors.textSecondary },
});
