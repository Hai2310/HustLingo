import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useLearning } from '@/contexts/LearningContext';
import { cosmic, pricingSpectrum } from '@/theme/cosmic';
import { explorerBom } from '@/theme/cosmicArt';
import { getLearnerRank, learnerRanks, type LearnerRank } from '@/utils/learnerRank';
import { RankBadge } from './LearnerRank';
import { RewardBurst } from './RewardBurst';
import { FadeIn } from '../motion/Motion';

export function LearningCelebration() {
  const { user } = useAuth();
  const { ready, state } = useLearning();
  const { top } = useSafeAreaInsets();
  const { rank } = getLearnerRank(state.completedLessonIds.length, state.completedPracticeIds.length);
  const previous = useRef<{ userId: string; rank: LearnerRank } | null>(null);
  const [promotion, setPromotion] = useState<{ userId: string; rank: LearnerRank } | null>(null);

  useEffect(() => {
    if (!ready) { previous.current = null; return; }
    const old = previous.current;
    previous.current = { userId: user.id, rank };
    if (old?.userId === user.id && learnerRanks.indexOf(rank) > learnerRanks.indexOf(old.rank)) {
      setPromotion({ userId: user.id, rank });
    }
  }, [rank, ready, user.id]);

  useEffect(() => {
    if (!promotion) return;
    const timer = setTimeout(() => setPromotion(null), 3800);
    return () => clearTimeout(timer);
  }, [promotion]);

  if (!ready || promotion?.userId !== user.id) return null;
  return (
    <View pointerEvents="none" style={[styles.layer, { top: top + (Platform.OS === 'web' ? 14 : 8) }]}>
      <FadeIn key={promotion.rank.id} distance={-13} style={styles.toast}>
        <LinearGradient colors={pricingSpectrum.pro} style={styles.card}>
          <RankBadge rank={promotion.rank} placement="ladder" decorative />
          <View style={styles.copy} accessibilityLiveRegion="polite" aria-live="polite">
            <Text style={styles.label}>Thăng hạng!</Text>
            <Text style={styles.rank}>{promotion.rank.title}</Text>
          </View>
          <Image nativeID="cosmic-bom-celebrate-rank" source={explorerBom} style={styles.mascot} resizeMode="contain" accessible={false} />
          <RewardBurst />
        </LinearGradient>
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', left: 16, right: 16, zIndex: 30, alignItems: 'center' },
  toast: { maxWidth: 340, width: '100%' },
  card: { borderWidth: 1, borderColor: cosmic.actionEdge, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 12, boxShadow: '0 9px 30px #060818c0' },
  copy: { flex: 1, gap: 3 },
  label: { color: cosmic.gold, fontSize: 12, fontWeight: '700' },
  rank: { color: cosmic.text, fontSize: 18, fontWeight: '800' },
  mascot: { width: 54, height: 54 },
});
