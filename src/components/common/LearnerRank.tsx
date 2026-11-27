import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hum, paperCard } from '@/theme/hum';
import { getLearnerRank, learnerRanks } from '@/utils/learnerRank';
import type { LearnerRank } from '@/utils/learnerRank';
import './LearnerRank.css';

type RankLook = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  paper: string;
  edge: string;
  glow: string;
  sparkles: number;
};

const looks: Record<LearnerRank['id'], RankLook> = {
  newbie: { icon: 'leaf-outline', color: '#48566E', paper: '#F4F1E9', edge: '#B7BCCA', glow: 'transparent', sparkles: 0 },
  active: { icon: 'flash', color: '#12634E', paper: '#DDF2E8', edge: '#92BFAE', glow: '#A3E5D0', sparkles: 0 },
  star: { icon: 'star', color: '#80510A', paper: '#FFF0BF', edge: '#C99839', glow: '#F8D47C', sparkles: 1 },
  solar: { icon: 'sunny', color: '#963714', paper: '#FFE2BC', edge: '#E39546', glow: '#FFB875', sparkles: 2 },
  galactus: { icon: 'planet', color: '#582A88', paper: '#EADCFB', edge: '#A17ACB', glow: '#C89AF5', sparkles: 3 },
};

const sparklePositions = [{ top: -3, right: -3 }, { bottom: -2, left: -3 }, { top: 3, left: -3 }] as const;

export function RankedName({ rank, name, placement, style }: {
  rank: LearnerRank; name: string; placement: 'home' | 'profile'; style?: StyleProp<TextStyle>;
}) {
  const look = looks[rank.id];
  const glowRadius = rank.id === 'active' ? 1 : look.sparkles * 2;
  return (
    <Text nativeID={`learner-name-${rank.id}-${placement}`}
      style={[style, { color: look.color, textShadowColor: look.glow, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: glowRadius }]}>
      {name}
    </Text>
  );
}

export function RankBadge({ rank, placement, decorative = false }: {
  rank: LearnerRank; placement: 'home' | 'profile' | 'ladder'; decorative?: boolean;
}) {
  const look = looks[rank.id];
  return (
    <View
      nativeID={`learner-badge-${rank.id}-${placement}`}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : rank.title}
      aria-hidden={decorative || undefined}
      style={[styles.badge, { backgroundColor: look.paper, borderColor: look.edge }]}
    >
      <Ionicons aria-hidden name={look.icon} size={19} color={look.color} />
      {placement !== 'ladder' && sparklePositions.slice(0, look.sparkles).map((position, index) => (
        <View key={index} aria-hidden style={[styles.sparkle, position]}>
          <Ionicons aria-hidden name="sparkles" size={index === 0 ? 12 : 9} color={look.color} />
        </View>
      ))}
    </View>
  );
}

export function RankProgress({ lessons, practice }: { lessons: number; practice: number }) {
  const { rank, next } = getLearnerRank(lessons, practice);
  const look = looks[(next ?? rank).id];
  const counts = [
    { label: 'Bài học hoàn thành', value: lessons, goal: next?.lessons },
    { label: 'Bài luyện đã làm', value: practice, goal: next?.practice },
  ];
  return (
    <View style={styles.progress}>
      <Text accessibilityRole="header" aria-level={2} style={styles.heading}>Danh hiệu học tập</Text>
      <Text style={styles.caption}>{next ? `Bậc tiếp theo · ${next.title}` : 'Bạn đã đạt danh hiệu cao nhất.'}</Text>
      {counts.map(({ label, value, goal }) => (
        <View key={label} style={styles.metric}>
          <View style={styles.metricLabel}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.count}>{goal ? `${value} / ${goal}` : value}</Text>
          </View>
          {goal && (
            <View accessibilityRole="progressbar" accessibilityLabel={label}
              accessibilityValue={{ min: 0, max: goal, now: Math.min(goal, value) }} style={styles.track}>
              <View style={[styles.fill, { width: `${Math.min(100, value / goal * 100)}%`, backgroundColor: look.color }]} />
            </View>
          )}
        </View>
      ))}
      <Text style={styles.caption}>Mốc theo số bài học · bài luyện</Text>
      <View style={styles.ladder}>
        {learnerRanks.map(item => (
          <View key={item.id} accessible
            accessibilityLabel={`${item.title}, ${item.lessons} bài học và ${item.practice} bài luyện${item.id === rank.id ? ', danh hiệu hiện tại' : ''}`}
            style={[styles.milestone, item.id === rank.id && styles.current]}>
            <RankBadge rank={item} placement="ladder" decorative />
            <Text style={styles.milestoneTitle}>{item.title.replace(' Learner', '')}</Text>
            <Text style={styles.milestoneCounts}>{item.lessons} · {item.practice}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 32, height: 32, flexShrink: 0, alignItems: 'center', justifyContent: 'center',
    borderRadius: 12, borderWidth: 1, borderBottomWidth: 2,
  },
  sparkle: { position: 'absolute' },
  progress: { ...paperCard, gap: 8, padding: 13, marginBottom: 14 },
  heading: { color: hum.ink, fontSize: 20, fontWeight: '700' },
  caption: { color: hum.muted, fontSize: 12, fontWeight: '600' },
  metric: { gap: 4 },
  metricLabel: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 4 },
  label: { color: hum.ink, fontSize: 14 },
  count: { color: hum.ink, fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  track: { height: 7, borderRadius: 5, backgroundColor: hum.paperDeep, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
  ladder: { flexDirection: 'row', gap: 4 },
  milestone: { flex: 1, minWidth: 0, alignItems: 'center', gap: 3, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: 'transparent' },
  current: { backgroundColor: hum.pearSoft, borderColor: hum.pearEdge },
  milestoneTitle: { color: hum.ink, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  milestoneCounts: { color: hum.muted, fontSize: 10, textAlign: 'center', fontVariant: ['tabular-nums'] },
});
