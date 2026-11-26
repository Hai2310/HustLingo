import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import type { PracticeModeId, PracticeResultRecord } from '../types';
import { Chips, LevelBadge, ui } from './PracticeUI';

type Item = { id: string; level: string; title: string; subtitle: string };

/** Level filter + responsive list of practice items, with the learner's best score on each. */
export function ItemList({ items, results, mode, onOpen }: { items: Item[]; results: PracticeResultRecord[]; mode: PracticeModeId; onOpen(id: string): void }) {
  const [level, setLevel] = useState('all');
  const { width } = useWindowDimensions();
  const levels = useMemo(() => [{ value: 'all', label: 'Tất cả' }, ...[...new Set(items.map(item => item.level))].sort().map(value => ({ value, label: value }))], [items]);
  const visible = items.filter(item => level === 'all' || item.level === level);
  const half = width >= 720;
  const best = (id: string) => results.filter(result => result.mode === mode && result.answers.some(answer => answer.section === id)).sort((a, b) => b.correct / Math.max(1, b.total) - a.correct / Math.max(1, a.total))[0];
  return <View style={{ gap: 14 }}>
    <Chips options={levels} value={level} onChange={setLevel} label="Lọc theo trình độ" />
    <View style={styles.grid}>
      {visible.map(item => {
        const result = best(item.id);
        return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`${item.title}, ${item.level}`} onPress={() => onOpen(item.id)} style={({ pressed }) => [ui.listCard, { width: half ? '49%' : '100%' }, pressed && { opacity: .85 }]}>
          <View style={styles.top}><LevelBadge level={item.level} />{result ? <Text style={styles.done}><Ionicons name="checkmark-circle" size={13} color={colors.success} /> {result.total ? `${result.correct}/${result.total}` : 'Đã làm'}</Text> : null}</View>
          <Text style={ui.cardTitle}>{item.title}</Text>
          <Text style={ui.muted} numberOfLines={2}>{item.subtitle}</Text>
        </Pressable>;
      })}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  done: { fontSize: 11.5, color: colors.success, fontWeight: '700' },
});
