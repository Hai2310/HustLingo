import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { AppCard } from '@/components/common/AppCard';
import type { TutorScenario } from '../types';

export function ScenarioCard({
  scenario,
  onPress,
  compact = false,
  style,
}: {
  scenario: TutorScenario;
  onPress: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <AppCard onPress={onPress} style={[styles.card, compact && styles.compact, style]}>
      <View style={styles.icon}><Ionicons name={(scenario.icon || 'chatbubbles-outline') as keyof typeof Ionicons.glyphMap} size={21} color={colors.primary} /></View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{scenario.title}</Text>
          <View style={styles.level}><Text style={styles.levelText}>{scenario.level}</Text></View>
        </View>
        <Text style={styles.subtitle}>{scenario.subtitle}</Text>
        <Text style={styles.tutor}>{scenario.tutor} · {scenario.topicIds?.slice(0, 2).join(' · ')}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { width: 238, minHeight: 126, padding: 14, marginRight: 11, flexDirection: 'column', alignItems: 'flex-start' },
  compact: { width: '100%', minHeight: 78, marginRight: 0, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11 },
  icon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  copy: { flex: 1, width: '100%' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  level: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: colors.surfaceAlt },
  levelText: { fontSize: 8.5, fontWeight: '900', color: colors.textSecondary },
  title: { flex: 1, fontSize: 15, fontWeight: '900', color: colors.text },
  subtitle: { marginTop: 4, fontSize: 10.5, lineHeight: 16, color: colors.textSecondary },
  tutor: { marginTop: 8, fontSize: 9.5, fontWeight: '700', color: colors.textMuted },
});
