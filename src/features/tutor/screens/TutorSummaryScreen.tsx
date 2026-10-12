import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common/Screen';
import { AppButton } from '@/components/common/Buttons';
import { loadTutorSummary } from '../services/tutorSessionStore';
import { scenarios } from '../data/scenarios';
import { colors } from '@/theme/colors';
import type { TutorSessionSummary } from '../types';

export default function TutorSummaryScreen() {
  const [summary, setSummary] = useState<TutorSessionSummary | null>(null);
  useEffect(() => { loadTutorSummary().then(setSummary); }, []);

  if (!summary) {
    return <Screen><View style={styles.loading}><ActivityIndicator color={colors.primary} /></View></Screen>;
  }

  const scenario = scenarios.find(item => item.id === summary.scenarioId) || scenarios[0];
  return (
    <Screen>
      <View style={styles.header}><View style={styles.check}><Ionicons name="checkmark" size={31} color={colors.white} /></View><Text style={styles.kicker}>SESSION COMPLETE</Text><Text style={styles.title}>Nice work.</Text><Text style={styles.subtitle}>Bạn đã hoàn thành {scenario.title} và có thêm một bước tiến nhỏ.</Text></View>
      <View style={styles.stats}><View><Text style={styles.statValue}>{summary.messageCount}</Text><Text style={styles.statLabel}>turns</Text></View><View><Text style={styles.statValue}>{summary.durationMinutes}</Text><Text style={styles.statLabel}>min</Text></View><View><Text style={styles.statValue}>{summary.corrections.length}</Text><Text style={styles.statLabel}>notes</Text></View></View>
      <Text style={styles.sectionTitle}>What went well</Text>
      <View style={styles.list}>{summary.highlights.map(item => <View key={item} style={styles.row}><Ionicons name="checkmark-circle" size={17} color={colors.success} /><Text style={styles.rowText}>{item}</Text></View>)}</View>
      {summary.corrections.length > 0 && <><Text style={styles.sectionTitle}>Keep in mind</Text><View style={styles.corrections}>{summary.corrections.map(item => <View key={`${item.original}-${item.corrected}`} style={styles.correction}><Text style={styles.old}>{item.original}</Text><Text style={styles.newText}>{item.corrected}</Text><Text style={styles.explain}>{item.explanation}</Text></View>)}</View></>}
      {summary.newVocabulary.length > 0 && <><Text style={styles.sectionTitle}>New vocabulary</Text><View style={styles.vocab}>{summary.newVocabulary.map(item => <View key={item.term} style={styles.vocabRow}><Text style={styles.term}>{item.term}</Text><Text style={styles.meaning}>{item.meaning}</Text></View>)}</View></>}
      <View style={styles.next}><Ionicons name="arrow-forward-circle-outline" size={19} color={colors.primary} /><Text style={styles.nextText}>{summary.nextStep}</Text></View>
      <AppButton title="Practise another scenario" icon="chatbubbles-outline" onPress={() => router.replace('/(tabs)/tutor')} style={styles.button} />
      <Pressable onPress={() => router.replace('/(tabs)/home')} style={styles.home}><Text style={styles.homeText}>Back to home</Text></Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { alignItems: 'center', paddingTop: 18 },
  check: { width: 66, height: 66, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.success },
  kicker: { marginTop: 17, fontSize: 8.5, fontWeight: '900', letterSpacing: 1.2, color: colors.success },
  title: { marginTop: 6, fontSize: 32, fontWeight: '900', color: colors.text },
  subtitle: { maxWidth: 440, marginTop: 7, fontSize: 12, lineHeight: 19, color: colors.textSecondary, textAlign: 'center' },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 25, padding: 17, borderRadius: 17, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  statValue: { fontSize: 23, fontWeight: '900', color: colors.text, textAlign: 'center' },
  statLabel: { marginTop: 2, fontSize: 9, fontWeight: '800', color: colors.textMuted, textAlign: 'center' },
  sectionTitle: { marginTop: 25, marginBottom: 10, fontSize: 14, fontWeight: '900', color: colors.text },
  list: { gap: 9 },
  row: { flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  rowText: { flex: 1, fontSize: 11.5, lineHeight: 18, color: colors.textSecondary },
  corrections: { gap: 8 },
  correction: { padding: 12, borderRadius: 13, backgroundColor: colors.violetSoft },
  old: { fontSize: 11, color: colors.textMuted, textDecorationLine: 'line-through' },
  newText: { marginTop: 3, fontSize: 12, fontWeight: '900', color: colors.text },
  explain: { marginTop: 5, fontSize: 10.5, lineHeight: 16, color: colors.textSecondary },
  vocab: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  vocabRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, padding: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  term: { fontSize: 11.5, fontWeight: '900', color: colors.text },
  meaning: { flex: 1, fontSize: 11, textAlign: 'right', color: colors.textSecondary },
  next: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 23, padding: 12, borderRadius: 13, backgroundColor: colors.primarySoft },
  nextText: { flex: 1, fontSize: 11, lineHeight: 17, fontWeight: '700', color: colors.primaryDeep },
  button: { marginTop: 22 },
  home: { alignItems: 'center', paddingVertical: 15 },
  homeText: { fontSize: 11, fontWeight: '800', color: colors.textMuted },
});
