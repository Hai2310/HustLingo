import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { hum, humType, paperCard } from '@/theme/hum';
import type { LearningState } from '@/types';

const formatNumber = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 });
const tones = {
  lesson: { surface: hum.sky, edge: hum.skyEdge, ink: hum.blue, sticker: hum.card },
  practice: { surface: hum.pearSoft, edge: hum.pearEdge, ink: hum.pearInk, sticker: hum.pear },
};

type Metric = { label: string; value: string };

type ProgressCardProps = {
  tone: keyof typeof tones;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  headline: Metric;
  details: Metric[];
  href: '/(tabs)/lessons' | '/(tabs)/practice';
  linkLabel: string;
};

function ProgressCard({ tone, title, icon, headline, details, href, linkLabel }: ProgressCardProps) {
  const { surface, edge, ink, sticker } = tones[tone];

  return (
    <View
      nativeID={'home-progress-' + tone}
      style={[styles.card, { backgroundColor: surface, borderColor: edge }]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.sticker, { backgroundColor: sticker, borderColor: edge }]}>
          <Ionicons aria-hidden name={icon} size={23} color={ink} />
        </View>
        <Text accessibilityRole="header" aria-level={3} style={styles.cardTitle}>{title}</Text>
        <Link href={href} style={[styles.cardLink, { borderColor: edge }]} asChild>
          <Pressable accessibilityLabel={linkLabel}>
            <Ionicons aria-hidden name="arrow-forward" size={20} color={ink} />
          </Pressable>
        </Link>
      </View>

      <View style={styles.headline}>
        <Text style={[styles.headlineValue, { color: ink }]}>{headline.value}</Text>
        <Text style={styles.headlineLabel}>{headline.label}</Text>
      </View>

      <View style={[styles.details, { borderColor: edge }]}>
        {details.map(item => (
          <View key={item.label} style={styles.metric}>
            <Text style={styles.metricValue}>{item.value}</Text>
            <Text style={styles.metricLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

type HomeProgressProps = {
  state: LearningState;
  ready: boolean;
  accuracy: number;
  dailyGoal: number;
  wide: boolean;
};

export function HomeProgress({ state, ready, accuracy, dailyGoal, wide }: HomeProgressProps) {
  const finishedLessons = new Set(state.completedLessonIds);
  const ongoingLessons = Object.entries(state.lessonProgress ?? {})
    .filter(([id, progress]) => progress.completedSteps.length > 0 && !finishedLessons.has(id)).length;
  const metric = (value: number) => ready ? formatNumber.format(value) : '—';
  const accuracyLabel = ready && state.totalAnswers > 0 ? formatNumber.format(accuracy) + '%' : '—';
  const dailyProgress = Math.min(100, Math.max(0, state.minutesToday / dailyGoal * 100));
  const goalReached = ready && dailyProgress === 100;

  return (
    <View nativeID="home-stats" style={styles.section}>
      <Text accessibilityRole="header" aria-level={2} style={styles.title}>Tiến độ của bạn</Text>
      <View style={[styles.cards, wide && styles.cardsWide]}>
        <ProgressCard
          tone="lesson"
          title="Bài học"
          icon="book-outline"
          headline={{ value: metric(finishedLessons.size), label: 'bài đã hoàn thành' }}
          details={[
            { value: metric(ongoingLessons), label: 'Đang học' },
            { value: metric(state.studiedWordIds.length), label: 'Từ đã học' },
            { value: metric(state.reviewWordIds.length), label: 'Từ cần ôn' },
          ]}
          href="/(tabs)/lessons"
          linkLabel="Mở bài học"
        />
        <ProgressCard
          tone="practice"
          title="Luyện tập"
          icon="flash-outline"
          headline={{ value: metric(state.completedPracticeIds.length), label: 'bài đã luyện' }}
          details={[
            { value: metric(state.totalAnswers), label: 'Câu đã chấm' },
            { value: metric(state.correctAnswers), label: 'Câu đúng' },
            { value: accuracyLabel, label: 'Tỉ lệ đúng' },
          ]}
          href="/(tabs)/practice"
          linkLabel="Mở luyện tập"
        />
      </View>

      <View nativeID="home-progress-goal" style={[styles.goal, wide && styles.goalWide]}>
        <View style={styles.goalHeading}>
          <View style={[styles.goalIcon, goalReached && styles.goalIconReached]}>
            <Ionicons aria-hidden name={goalReached ? 'checkmark' : 'time-outline'} size={21} color={goalReached ? hum.greenInk : hum.pearInk} />
          </View>
          <View style={styles.goalCopy}>
            <Text accessibilityRole="header" aria-level={3} style={styles.goalTitle}>Mục tiêu hôm nay</Text>
            {goalReached && <Text style={styles.goalReached}>Đã đạt mục tiêu</Text>}
          </View>
        </View>
        <View style={styles.goalMeter}>
          <View
            accessible={ready}
            accessibilityRole={ready ? 'progressbar' : undefined}
            accessibilityLabel="Mục tiêu học hôm nay"
            aria-valuemin={ready ? 0 : undefined}
            aria-valuemax={ready ? 100 : undefined}
            aria-valuenow={ready ? Math.round(dailyProgress) : undefined}
            style={styles.goalTrack}
          >
            <View style={[styles.goalFill, { width: `${dailyProgress}%` }, goalReached && styles.goalFillReached]} />
          </View>
          <Text style={styles.goalValue}>
            {metric(state.minutesToday)} / {formatNumber.format(dailyGoal)} <Text style={styles.goalUnit}>phút</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12, marginTop: 23 },
  title: { color: hum.ink, fontSize: 23, lineHeight: 29, letterSpacing: -0.45, fontWeight: humType.bold },
  cards: { gap: 12 },
  cardsWide: { flexDirection: 'row' },
  card: { ...paperCard, flex: 1, minWidth: 0, padding: 17, borderBottomWidth: 4, gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  sticker: { width: 42, height: 42, borderWidth: 1, borderBottomWidth: 3, borderRadius: 12, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-6deg' }] },
  cardTitle: { flex: 1, minWidth: 0, color: hum.ink, fontSize: 19, lineHeight: 24, fontWeight: humType.bold },
  cardLink: { width: 44, height: 44, borderRadius: 22, backgroundColor: hum.card, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headline: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 10 },
  headlineValue: { fontSize: 49, lineHeight: 55, fontWeight: '800', fontVariant: ['tabular-nums'], letterSpacing: -1.5 },
  headlineLabel: { flexShrink: 1, color: hum.ink, fontSize: 15, lineHeight: 20, fontWeight: humType.bold },
  details: { flexDirection: 'row', gap: 8, marginTop: 'auto', borderTopWidth: 1, paddingTop: 11 },
  metric: { flex: 1, minWidth: 0, gap: 2 },
  metricValue: { color: hum.ink, fontSize: 21, lineHeight: 25, fontWeight: humType.bold, fontVariant: ['tabular-nums'] },
  metricLabel: { color: hum.muted, fontSize: 13, lineHeight: 18 },
  goal: { ...paperCard, padding: 13, gap: 12 },
  goalWide: { flexDirection: 'row', alignItems: 'center', gap: 25, paddingHorizontal: 17 },
  goalHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  goalIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: hum.pearSoft },
  goalIconReached: { backgroundColor: hum.mint },
  goalCopy: { flexShrink: 1, minWidth: 0 },
  goalTitle: { color: hum.ink, fontSize: 16, lineHeight: 21, fontWeight: humType.bold },
  goalReached: { color: hum.greenInk, fontSize: 13, lineHeight: 18 },
  goalMeter: { flexGrow: 1, flexShrink: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12 },
  goalTrack: { flex: 1, height: 9, borderRadius: 5, backgroundColor: hum.paperDeep, overflow: 'hidden' },
  goalFill: { height: '100%', borderRadius: 5, backgroundColor: hum.pearEdge },
  goalFillReached: { backgroundColor: hum.greenInk },
  goalValue: { color: hum.ink, fontSize: 16, lineHeight: 21, fontWeight: humType.bold, fontVariant: ['tabular-nums'] },
  goalUnit: { color: hum.muted, fontSize: 13 },
});
