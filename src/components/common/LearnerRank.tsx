import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { cosmic, glassCard } from '@/theme/cosmic';
import { getLearnerRank, learnerRanks } from '@/utils/learnerRank';
import type { LearnerRank } from '@/utils/learnerRank';
import { CosmicMeter } from './CosmicMeter';
import { ExperiencePill } from './ExperiencePill';
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
  newbie: { icon: 'leaf-outline', color: cosmic.ice, paper: cosmic.iceSurface, edge: cosmic.iceEdge, glow: 'transparent', sparkles: 0 },
  active: { icon: 'flash', color: cosmic.mint, paper: cosmic.mintSurface, edge: cosmic.mintEdge, glow: cosmic.mint, sparkles: 0 },
  star: { icon: 'star', color: cosmic.gold, paper: cosmic.goldSurface, edge: cosmic.actionEdge, glow: cosmic.gold, sparkles: 1 },
  solar: { icon: 'sunny', color: cosmic.orange, paper: cosmic.orangeSurface, edge: cosmic.orangeEdge, glow: cosmic.orange, sparkles: 2 },
  galactus: { icon: 'planet', color: cosmic.violet, paper: cosmic.violetSurface, edge: cosmic.actionEdge, glow: cosmic.violet, sparkles: 3 },
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

export function RankBadge({ rank, placement, decorative = false, size = 34 }: {
  rank: LearnerRank; placement: 'home' | 'profile' | 'ladder'; decorative?: boolean; size?: number;
}) {
  const look = looks[rank.id];
  return (
    <LinearGradient colors={[look.edge, look.paper, cosmic.panel]} start={{ x: .05, y: 0 }} end={{ x: .9, y: 1 }}
      nativeID={`learner-badge-${rank.id}-${placement}`}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : rank.title}
      aria-hidden={decorative || undefined}
      style={[styles.badge, { width: size, height: size, borderRadius: rank.id === 'solar' || rank.id === 'galactus' ? size / 2 : size * .32, borderColor: look.color }]}
    >
      <View aria-hidden style={[styles.emblemRing, { borderColor: look.color, borderRadius: size * .32 }]} />
      <Ionicons aria-hidden name={look.icon} size={Math.round(size * .53)} color={look.color} />
      {placement !== 'ladder' && sparklePositions.slice(0, look.sparkles).map((position, index) => (
        <View key={index} aria-hidden style={[styles.sparkle, position]}>
          <Ionicons aria-hidden name="sparkles" size={index === 0 ? 12 : 9} color={look.color} />
        </View>
      ))}
    </LinearGradient>
  );
}

export function RankProgress({ lessons, practice }: { lessons: number; practice: number }) {
  const { rank, next } = getLearnerRank(lessons, practice);
  const look = looks[(next ?? rank).id];
  const currentIndex = learnerRanks.indexOf(rank);
  const counts = [
    { label: 'Bài học hoàn thành', value: lessons, goal: next?.lessons },
    { label: 'Bài luyện đã làm', value: practice, goal: next?.practice },
  ];
  return (
    <View style={styles.progress}>
      <View style={styles.progressHeading}>
        <Text accessibilityRole="header" aria-level={2} style={styles.heading}>Hành trình thăng hạng</Text>
        <ExperiencePill lessons={lessons} practice={practice} />
      </View>
      <Text style={styles.caption}>{next ? `Bậc tiếp theo là ${next.title}` : 'Bạn đã đạt danh hiệu cao nhất.'}</Text>
      {counts.map(({ label, value, goal }) => (
        <View key={label} style={styles.metric}>
          <View style={styles.metricLabel}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.count}>{goal ? `${value} / ${goal}` : value}</Text>
          </View>
          {goal && <CosmicMeter value={value} max={goal} label={label} color={look.color} />}
        </View>
      ))}
      <View style={styles.ladder}>
        {learnerRanks.map((item, index) => (
          <View key={item.id} accessible
            accessibilityLabel={`${item.title}, ${item.lessons} bài học và ${item.practice} bài luyện${index === currentIndex ? ', danh hiệu hiện tại' : index > currentIndex ? ', chưa mở khóa' : ', đã mở khóa'}`}
            style={[styles.milestone, item.id === rank.id && styles.current]}>
            {index < learnerRanks.length - 1 && <View aria-hidden style={[styles.connector, index < currentIndex && styles.connectorDone]} />}
            <View style={index > currentIndex ? styles.locked : undefined}><RankBadge rank={item} placement="ladder" size={42} decorative /></View>
            <Text style={styles.milestoneTitle}>{item.title.replace(' Learner', '')}</Text>
            <View style={styles.nodeCaption}>
              {index > currentIndex && <Ionicons aria-hidden name="lock-closed-outline" color={cosmic.muted} size={9} />}
              <Text style={styles.milestoneCounts}>{item.lessons} / {item.practice}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderBottomWidth: 2,
  },
  emblemRing: { position: 'absolute', top: 3, bottom: 3, left: 3, right: 3, borderWidth: 1, opacity: .45 },
  sparkle: { position: 'absolute' },
  progress: { ...glassCard, gap: 12, padding: 15, marginBottom: 14 },
  progressHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 9 },
  heading: { color: cosmic.text, fontSize: 20, fontWeight: '700' },
  caption: { color: cosmic.muted, fontSize: 12, fontWeight: '600' },
  metric: { gap: 4 },
  metricLabel: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 4 },
  label: { color: cosmic.text, fontSize: 14 },
  count: { color: cosmic.text, fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  ladder: { flexDirection: 'row', marginTop: 4 },
  milestone: { flex: 1, minWidth: 0, alignItems: 'center', gap: 4, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: 'transparent' },
  connector: { position: 'absolute', height: 2, width: '60%', top: 25, left: '72%', backgroundColor: cosmic.border },
  connectorDone: { backgroundColor: cosmic.mint },
  locked: { opacity: .58 },
  nodeCaption: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  current: { backgroundColor: cosmic.violetSurface, borderColor: cosmic.actionEdge },
  milestoneTitle: { color: cosmic.text, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  milestoneCounts: { color: cosmic.muted, fontSize: 10, textAlign: 'center', fontVariant: ['tabular-nums'] },
});
