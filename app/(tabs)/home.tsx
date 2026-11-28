import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeLesson } from '@/components/home/HomeLesson';
import { HomeAurora, useHomeLighting } from '@/components/home/HomeLighting';
import { HomeProgress } from '@/components/home/HomeProgress';
import { HomeSkills } from '@/components/home/HomeSkills';
import { HomeTopics } from '@/components/home/HomeTopics';
import { PricingTeaser } from '@/components/home/PricingTeaser';
import { RankBadge, RankedName } from '@/components/common/LearnerRank';
import { ExperiencePill } from '@/components/common/ExperiencePill';
import { CosmicMeter } from '@/components/common/CosmicMeter';
import { FadeIn } from '@/components/motion/Motion';
import { cosmic, glassCard } from '@/theme/cosmic';
import { useAuth } from '@/contexts/AuthContext';
import { useLearning } from '@/contexts/LearningContext';
import { maxContentWidth } from '@/theme/layout';
import { useMotionPreference } from '@/theme/MotionPreference';
import { getLearnerRank } from '@/utils/learnerRank';

export default function Home() {
  const { user, isGuest } = useAuth();
  const { state, accuracy, ready } = useLearning();
  const reducedMotion = useMotionPreference();
  useHomeLighting();
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const name = isGuest ? 'bạn' : user.displayName.trim().split(/\s+/).pop() || 'bạn';
  const lessons = state.completedLessonIds.length;
  const practice = state.completedPracticeIds.length;
  const { rank, next } = getLearnerRank(lessons, practice);
  const dailyGoal = user.dailyMinutes && user.dailyMinutes > 0 ? user.dailyMinutes : 15;

  return (
    <View nativeID="hustlingo-home" style={styles.canvas}>
      <HomeAurora />
      <SafeAreaView edges={['top']} style={styles.canvas}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={[styles.page, wide && styles.pageWide]}>
            <View style={styles.topbar}>
              <Text accessibilityRole="header" style={styles.greeting}>
                Chào {ready ? <RankedName rank={rank} name={name} placement="home" /> : name}!
              </Text>
              <View style={styles.actions}>
                <View nativeID="home-xp" style={styles.xpGlow}><ExperiencePill lessons={lessons} practice={practice} ready={ready} emphasized /></View>
                <Link href="/pricing" asChild><Pressable style={styles.tool}><Text style={styles.link}>Plus</Text></Pressable></Link>
                <Link href="/settings" asChild><Pressable accessibilityLabel="Cài đặt" style={styles.tool}><Ionicons aria-hidden name="settings-outline" size={19} color={cosmic.text} /></Pressable></Link>
              </View>
            </View>

            <View nativeID="home-bento" style={[styles.bento, wide && styles.bentoWide]}>
              <FadeIn style={wide ? styles.heroWide : undefined}>
                <HomeLesson wide={wide} learnerId={user.id} reducedMotion={reducedMotion} />
              </FadeIn>
              <FadeIn delay={65} style={wide ? styles.rankWide : undefined}>
                <LinearGradient nativeID="home-rank" colors={['#18384a', '#15243e', '#1a1a36']} style={styles.rankCard}>
                  <View style={styles.rankTop}>
                    <RankBadge rank={rank} placement="home" />
                    <View style={styles.rankCopy}>
                      <Text style={styles.kicker}>Hạng hiện tại</Text>
                      <Text style={styles.rankTitle}>{ready ? rank.title : '—'}</Text>
                    </View>
                    <Link href="/progress" asChild><Pressable accessibilityLabel="Xem hành trình học" style={styles.tool}><Ionicons aria-hidden name="arrow-forward" size={18} color={cosmic.ice} /></Pressable></Link>
                  </View>
                  {ready && next && <>
                    <Text style={styles.rankNext}>Tiến tới {next.title}</Text>
                    <View style={styles.meter}>
                      <Text style={styles.caption}>Bài học {lessons}/{next.lessons}</Text>
                      <CosmicMeter label="Bài học để thăng hạng" value={lessons} max={next.lessons} color={cosmic.ice} />
                    </View>
                    <View style={styles.meter}>
                      <Text style={styles.caption}>Bài luyện {practice}/{next.practice}</Text>
                      <CosmicMeter label="Bài luyện để thăng hạng" value={practice} max={next.practice} color={cosmic.mint} />
                    </View>
                  </>}
                  {ready && !next && <Text style={styles.rankNext}>Bạn đã đạt hạng cao nhất.</Text>}
                </LinearGradient>
              </FadeIn>
            </View>

            <View style={styles.section}><HomeSkills compact={width < 680} /></View>

            <HomeProgress state={state} accuracy={accuracy} ready={ready} dailyGoal={dailyGoal} wide={wide} />

            <View style={styles.section}><HomeTopics wide={wide} width={width} /></View>

            <View style={styles.section}><PricingTeaser wide={wide} /></View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { flex: 1 },
  scroll: { alignItems: 'center', paddingBottom: 34 },
  page: { width: '100%', maxWidth: maxContentWidth, paddingHorizontal: 16, paddingTop: 15 },
  pageWide: { paddingHorizontal: 24, paddingTop: 26 },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  greeting: { color: cosmic.text, fontSize: 30, letterSpacing: -0.65, lineHeight: 36, fontWeight: '700', flexShrink: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  xpGlow: { borderRadius: 99, boxShadow: '0 0 18px #b28bfa42' },
  tool: { minHeight: 44, minWidth: 44, borderRadius: 14, paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center' },
  link: { color: cosmic.ice, fontSize: 14, fontWeight: '600' },
  bento: { gap: 12 },
  bentoWide: { flexDirection: 'row', alignItems: 'stretch' },
  heroWide: { flex: 1.9, minWidth: 0 },
  rankWide: { flex: 1, minWidth: 0 },
  rankCard: { ...glassCard, borderColor: cosmic.iceEdge, borderRadius: 26, padding: 17, gap: 13, flex: 1, justifyContent: 'center' },
  rankTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankCopy: { flex: 1, minWidth: 0, gap: 4 },
  kicker: { color: cosmic.muted, fontSize: 12 },
  rankTitle: { fontWeight: '700', fontSize: 18, color: cosmic.text },
  rankNext: { color: cosmic.ice, fontSize: 14, fontWeight: '600' },
  meter: { gap: 5 },
  caption: { color: cosmic.muted, fontSize: 12, lineHeight: 17 },
  section: { marginTop: 19, gap: 10 },
});
