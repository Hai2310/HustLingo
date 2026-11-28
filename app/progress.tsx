import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { RankProgress } from '@/components/common/LearnerRank';
import { HomeProgress } from '@/components/home/HomeProgress';
import { useLearning } from '@/contexts/LearningContext';
import { useAuth } from '@/contexts/AuthContext';
import { cosmic, glassCard } from '@/theme/cosmic';

export default function Progress() {
  const { state, accuracy, ready } = useLearning();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const goal = user.dailyMinutes && user.dailyMinutes > 0 ? user.dailyMinutes : 15;

  return (
    <Screen>
      <PageHeader title="Tiến độ học tập" />
      <HomeProgress state={state} accuracy={accuracy} ready={ready} dailyGoal={goal} wide={width >= 680} />
      <View style={styles.achievement}>
        {ready && <RankProgress lessons={state.completedLessonIds.length} practice={state.completedPracticeIds.length} />}
        <View style={styles.saved}>
          <Ionicons name="bookmark-outline" size={22} color={cosmic.rose} aria-hidden />
          <Text style={styles.label}>Từ đã lưu</Text>
          <Text style={styles.count}>{ready ? state.savedWordIds.length : '—'}</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  achievement: { marginTop: 17 },
  saved: { ...glassCard, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { flex: 1, fontSize: 15, fontWeight: '700', color: cosmic.text },
  count: { fontSize: 22, fontWeight: '800', color: cosmic.rose, fontVariant: ['tabular-nums'] },
});
