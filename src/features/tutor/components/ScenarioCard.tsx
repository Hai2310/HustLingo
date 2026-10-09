import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { AppCard } from '@/components/common/AppCard';
import type { TutorScenario } from '../types';

export function ScenarioCard({ scenario, onPress }: { scenario: TutorScenario; onPress: () => void }) {
  return (
    <AppCard onPress={onPress} style={styles.card}>
      <View style={styles.iconRow}>
        <View style={styles.icon}><Ionicons name={(scenario.icon || 'chatbubbles-outline') as keyof typeof Ionicons.glyphMap} size={21} color={colors.primary} /></View>
        <View style={styles.level}><Text style={styles.levelText}>{scenario.level}</Text></View>
      </View>
      <Text style={styles.title}>{scenario.title}</Text>
      <Text style={styles.subtitle}>{scenario.subtitle}</Text>
      <View style={styles.footer}>
        <Text style={styles.tutor}>{scenario.tutor} · {scenario.topicIds?.slice(0, 2).join(' · ')}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { width: 238, minHeight: 168, padding: 15, marginRight: 11 },
  iconRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  icon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  level: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: colors.surfaceAlt },
  levelText: { fontSize: 8.5, fontWeight: '900', color: colors.textSecondary },
  title: { marginTop: 16, fontSize: 17, fontWeight: '900', color: colors.text },
  subtitle: { marginTop: 4, fontSize: 10.5, lineHeight: 16, color: colors.textSecondary },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  tutor: { flex: 1, fontSize: 9.5, fontWeight: '700', color: colors.textMuted },
});
