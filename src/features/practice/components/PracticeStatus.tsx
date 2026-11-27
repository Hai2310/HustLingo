import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLearning } from '@/contexts/LearningContext';
import { colors } from '@/theme/colors';
import { hum } from '@/theme/hum';
import { practiceKey, type PracticeSkill } from '../data/catalog';

export const practiceStatus = {
  correct: { label: 'Đúng', icon: 'checkmark', ink: colors.success, fill: hum.mint, edge: hum.mintRule },
  incorrect: { label: 'Sai', icon: 'close', ink: colors.error, fill: hum.coralSoft, edge: hum.coralEdge },
  unanswered: { label: 'Chưa làm', icon: 'ellipse-outline', ink: colors.textMuted, fill: colors.white, edge: hum.rule },
  completed: { label: 'Đã làm', icon: 'checkmark-done', ink: hum.blue, fill: hum.sky, edge: hum.skyEdge },
} as const;

export type PracticeStatus = keyof typeof practiceStatus;

export function usePracticeStatus() {
  const { state, ready } = useLearning();
  const completed = useMemo(() => new Set(state.completedPracticeIds), [state.completedPracticeIds]);

  return (skill: PracticeSkill, id: string): PracticeStatus | undefined => {
    if (!ready) return undefined;
    const key = practiceKey(skill, id);
    const result = state.practiceResults[key];
    if (result) return result.correct ? 'correct' : 'incorrect';
    return completed.has(key) ? 'completed' : 'unanswered';
  };
}

export function PracticeStatusBadge({ status, compact = false }: { status: PracticeStatus; compact?: boolean }) {
  const { label, icon, ink, fill, edge } = practiceStatus[status];
  return (
    <View aria-hidden={compact} style={[styles.badge, compact && styles.compact, { backgroundColor: fill, borderColor: edge }]}>
      <Ionicons aria-hidden name={icon} size={13} color={ink} />
      {!compact && <Text style={[styles.label, { color: ink }]}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 3 },
  compact: { width: 20, height: 20, padding: 0, paddingHorizontal: 0, paddingVertical: 0, justifyContent: 'center', alignSelf: 'center' },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '700' },
});
