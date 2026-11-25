import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HustLogo } from '@/components/HustLogo';
import { HeroSlideshow } from '@/components/home/HeroSlideshow';
import { HomeLesson } from '@/components/home/HomeLesson';
import { HomePaperPressable } from '@/components/home/HomePaperPressable';
import { PricingTeaser } from '@/components/home/PricingTeaser';
import { hum, humType, paperButton } from '@/theme/hum';
import { useAuth } from '@/contexts/AuthContext';
import { useLearning } from '@/contexts/LearningContext';
import { learningTopics } from '@/data/content';
import { getVocabularyArtwork } from '@/features/lessons/data/vocabulary-artwork';
import { maxContentWidth } from '@/theme/layout';
import { useMotionPreference } from '@/theme/MotionPreference';

const libraryShortcuts = [
  { label: 'Nghe', icon: 'headset-outline', path: '/listening' },
  { label: 'Đọc', icon: 'reader-outline', path: '/reading' },
] as const;

export default function Home() {
  const { user, isGuest } = useAuth();
  const { state, accuracy, ready } = useLearning();
  const reducedMotion = useMotionPreference();
  const { width } = useWindowDimensions();
  const desktop = width >= 1000;
  const wide = width >= 680;
  const firstName = user?.displayName?.trim().split(/\s+/).pop();
  const greeting = isGuest || !firstName ? 'Chào bạn!' : 'Chào ' + firstName + '!';
  const dailyGoal = user?.dailyMinutes || 15;
  const dailyProgress = Math.min(100, Math.max(0, state.minutesToday / dailyGoal * 100));
  const stats = [
    { label: 'Từ đã học', value: state.studiedWordIds.length },
    { label: 'Cần ôn', value: state.reviewWordIds.length },
    { label: 'Chính xác', value: state.totalAnswers > 0 ? accuracy + '%' : '—' },
    { label: 'Phút hôm nay', value: state.minutesToday + ' / ' + dailyGoal },
  ];

  return (
    <View nativeID="hustlingo-home" style={styles.canvas}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={[styles.page, wide && styles.pageWide]}>
            <View style={styles.topbar}>
              <View style={styles.brand}>
                <HustLogo size={36} showWordmark={false} />
                <Text style={styles.wordmark}>HustLingo</Text>
              </View>
              <View style={styles.topActions}>
                <Link href="/pricing" style={styles.plusLink} asChild>
                  <Pressable>
                    <Text style={styles.linkText}>Plus</Text>
                  </Pressable>
                </Link>
                <Link href="/settings" style={styles.settings} asChild>
                  <Pressable accessibilityLabel="Cài đặt">
                    <Ionicons aria-hidden name="settings-outline" size={19} color={hum.ink} />
                  </Pressable>
                </Link>
              </View>
            </View>

            <Text accessibilityRole="header" aria-level={1} style={[styles.greeting, wide && styles.greetingWide]}>
              {greeting}
            </Text>
            <HeroSlideshow wide={wide} reducedMotion={reducedMotion !== false} />
            <View style={[styles.study, desktop && styles.studyDesktop]}>
              <HomeLesson wide={wide} learnerId={user.id} reducedMotion={reducedMotion} />
              <View style={[styles.quick, desktop && styles.quickDesktop]}>
                <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>Học nhanh</Text>
                <View style={styles.quickCards}>
                  <Link href="/vocabulary" style={styles.quickFeature} asChild>
                    <HomePaperPressable
                      nativeID="home-vocabulary" accessibilityLabel="Từ vựng"
                      faceStyle={styles.vocabularyFace} reducedMotion={reducedMotion !== false}
                    >
                      <Text style={styles.quickLabel}>Từ vựng</Text>
                      <Text nativeID="home-vocabulary-sample" accessible={false} aria-hidden style={styles.wordSample}>Aa</Text>
                    </HomePaperPressable>
                  </Link>
                  <Link href="/grammar" style={styles.quickGrammar} asChild>
                    <HomePaperPressable
                      nativeID="home-grammar" accessibilityLabel="Ngữ pháp"
                      faceStyle={styles.grammarFace} reducedMotion={reducedMotion !== false}
                    >
                      <View nativeID="home-grammar-icon" style={styles.grammarIcon} aria-hidden>
                        <Ionicons aria-hidden name="library-outline" size={24} color={hum.blue} />
                      </View>
                      <Text style={styles.quickLabel}>Ngữ pháp</Text>
                    </HomePaperPressable>
                  </Link>
                </View>
                <View style={styles.libraryRail}>
                  {libraryShortcuts.map(item => (
                    <Link key={item.path} href={item.path} style={styles.libraryLink} asChild>
                      <Pressable accessibilityLabel={'Luyện ' + item.label.toLowerCase()}>
                        <Ionicons aria-hidden name={item.icon} size={19} color={hum.blue} />
                        <Text style={styles.linkText}>{item.label}</Text>
                        <Ionicons aria-hidden name="chevron-forward" size={14} color={hum.blue} style={styles.chevron} />
                      </Pressable>
                    </Link>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>Tiến độ của bạn</Text>
              <View nativeID="home-stats" style={styles.stats}>
                {stats.map((item, index) => (
                  <View
                    key={item.label}
                    style={[
                      styles.stat,
                      !wide && styles.statCompact,
                      (wide ? index > 0 : index % 2 === 1) && styles.statDivider,
                      !wide && index > 1 && styles.statLower,
                    ]}
                  >
                    <Text style={styles.statValue}>{ready ? item.value : '—'}</Text>
                    <Text style={styles.statLabel}>{item.label}</Text>
                    {index === 3 && ready && (
                      <View
                        accessibilityRole="progressbar"
                        accessibilityLabel="Mục tiêu học hôm nay"
                        accessibilityValue={{ min: 0, max: 100, now: Math.round(dailyProgress) }}
                        style={styles.goalTrack}
                      >
                        <View style={[styles.goalFill, { width: `${dailyProgress}%` }]} />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <Text accessibilityRole="header" aria-level={2} style={[styles.sectionTitle, styles.headingText]}>
                  Chủ đề đề xuất
                </Text>
                <Link href="/(tabs)/lessons" style={styles.moreLink} asChild>
                  <Pressable>
                    <Text style={styles.linkText}>Xem tất cả</Text>
                  </Pressable>
                </Link>
              </View>
              <View style={[styles.topics, wide && styles.topicsWide]}>
                {learningTopics.slice(0, 3).map((topic, index) => (
                  <Link
                    key={topic.id}
                    href={{ pathname: '/vocabulary', params: { topic: topic.title } }}
                    style={[styles.topic, wide && styles.topicWide, (wide || index === 0) && styles.topicTopRule]}
                    asChild
                  >
                    <Pressable>
                      <Image
                        accessible={false}
                        source={getVocabularyArtwork(topic.id).image}
                        resizeMode="cover"
                        style={styles.topicImage}
                      />
                      <View style={styles.topicCopy}>
                        <Text style={styles.topicTitle}>{topic.title}</Text>
                        <Text style={styles.topicDescription}>{topic.subtitle}</Text>
                      </View>
                      <Text style={styles.topicLevel}>{topic.level}</Text>
                    </Pressable>
                  </Link>
                ))}
              </View>
            </View>

            <View style={styles.section}><PricingTeaser wide={wide} /></View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { flex: 1, backgroundColor: hum.paper },
  safeArea: { flex: 1 },
  scroll: { alignItems: 'center', paddingBottom: 34 },
  page: { width: '100%', maxWidth: maxContentWidth, paddingHorizontal: 18, paddingTop: 14 },
  pageWide: { paddingHorizontal: 26, paddingTop: 20 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: hum.rule },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  wordmark: { color: hum.ink, fontWeight: humType.bold, fontSize: 21, letterSpacing: -0.5 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  plusLink: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 12 },
  linkText: { color: hum.blue, fontSize: 15, fontWeight: humType.bold, flexShrink: 1 },
  settings: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: hum.card, borderWidth: 1, borderColor: hum.rule },
  greeting: { color: hum.ink, fontSize: 29, lineHeight: 35, letterSpacing: -0.8, fontWeight: humType.bold, marginTop: 13, marginBottom: 11, minWidth: 0 },
  greetingWide: { fontSize: 34, lineHeight: 41, marginTop: 19, marginBottom: 13 },
  study: { gap: 25, paddingBottom: 2 },
  studyDesktop: { flexDirection: 'row', alignItems: 'stretch', gap: 25 },
  quick: { gap: 11, minWidth: 0 },
  quickDesktop: { flex: 1, justifyContent: 'center', paddingVertical: 4 },
  sectionTitle: { color: hum.ink, fontSize: 23, lineHeight: 29, letterSpacing: -0.45, fontWeight: humType.bold },
  quickCards: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  quickFeature: { flex: 1.2, minWidth: 0, minHeight: 100, backgroundColor: hum.coralEdge },
  quickGrammar: { flex: 1, minWidth: 0, alignSelf: 'flex-end', minHeight: 81, backgroundColor: hum.skyEdge },
  vocabularyFace: { ...paperButton, justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: hum.coral, borderColor: hum.coralEdge },
  grammarFace: { ...paperButton, justifyContent: 'space-between', paddingVertical: 9, paddingHorizontal: 13, backgroundColor: hum.sky, borderColor: hum.skyEdge },
  grammarIcon: { alignSelf: 'flex-start' },
  quickLabel: { color: hum.ink, fontSize: 16, lineHeight: 21, fontWeight: humType.bold },
  wordSample: { alignSelf: 'flex-end', color: hum.ink, fontWeight: humType.bold, fontSize: 40, lineHeight: 44, letterSpacing: -2.5 },
  libraryRail: { flexDirection: 'row', gap: 10, marginTop: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: hum.rule },
  libraryLink: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 45, paddingHorizontal: 8, borderRadius: 9 },
  chevron: { marginLeft: 'auto' },
  section: { gap: 10, marginTop: 20 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', borderRadius: 19, backgroundColor: hum.mint, borderWidth: 1, borderColor: hum.mintRule, overflow: 'hidden' },
  stat: { flex: 1, minWidth: 0, gap: 3, paddingHorizontal: 16, paddingVertical: 11 },
  statCompact: { flexBasis: '50%', flexGrow: 0 },
  statDivider: { borderLeftWidth: 1, borderLeftColor: hum.mintRule },
  statLower: { borderTopWidth: 1, borderTopColor: hum.mintRule },
  statValue: { color: hum.ink, fontSize: 24, lineHeight: 28, fontWeight: humType.bold, fontVariant: ['tabular-nums'] },
  statLabel: { color: hum.greenInk, fontSize: 14, lineHeight: 19 },
  goalTrack: { height: 5, borderRadius: 3, backgroundColor: hum.mintTrack, marginTop: 2, maxWidth: 180 },
  goalFill: { height: 5, borderRadius: 3, backgroundColor: hum.greenInk },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  headingText: { flexShrink: 1 },
  moreLink: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 7, borderRadius: 9 },
  topics: { gap: 0 },
  topicsWide: { flexDirection: 'row', alignItems: 'stretch', gap: 14 },
  topic: { flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: 1, borderColor: hum.rule, paddingVertical: 9, paddingHorizontal: 4, minHeight: 67 },
  topicTopRule: { borderTopWidth: 1 },
  topicWide: { flex: 1, minWidth: 0 },
  topicImage: { width: 52, height: 44, borderRadius: 10, backgroundColor: hum.paperDeep },
  topicCopy: { flex: 1, minWidth: 0, gap: 2 },
  topicTitle: { color: hum.ink, fontSize: 16, lineHeight: 21, fontWeight: humType.bold },
  topicDescription: { color: hum.muted, fontSize: 13, lineHeight: 18 },
  topicLevel: { color: hum.blue, fontSize: 13, fontWeight: humType.bold, fontVariant: ['tabular-nums'] },
});
