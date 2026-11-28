import { getLevelLabel } from '@/utils/levelLabels';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLearning } from '@/contexts/LearningContext';
import { getLocalCatalog, lessonStats } from '@/features/lessons/data/catalog';
import { WebMascot } from '@/components/common/WebMascot';
import { useLessonCatalog } from '@/features/lessons/hooks/useLessonCatalog';
import { cosmic, cosmicType, gameButton } from '@/theme/cosmic';
import { explorerBom, explorerBomBlink, heroCrystal } from '@/theme/cosmicArt';
import { HomePaperPressable } from './HomePaperPressable';
import { Float } from '@/components/motion/Motion';

const heroStars = [
  [28, 18, 2, .37], [38, 74, 2, .37], [52, 11, 3, .66], [56, 56, 2, .46],
  [59, 82, 4, .76], [62, 24, 2, .45], [70, 14, 4, .9], [76, 86, 2, .5],
  [82, 9, 2, .64], [91, 20, 4, .82], [96, 59, 2, .52], [92, 82, 3, .83],
] as const;

export function HomeLesson({ wide, learnerId, reducedMotion }: {
  wide: boolean;
  learnerId: string;
  reducedMotion: boolean | null;
}) {
  const { state, ready } = useLearning();
  const { catalog, loading, error } = useLessonCatalog();
  const current = useMemo(() => {
    if (!ready || !state.lessonProgress) return undefined;
    const lessons = (catalog ?? getLocalCatalog()).lessons;
    const started = Object.entries(state.lessonProgress).sort(([, left], [, right]) =>
      (right.updatedAt ?? '').localeCompare(left.updatedAt ?? '')
    );

    for (const [id] of started) {
      const lesson = lessons.find(item => item.id === id);
      if (!lesson) continue;
      const progress = lessonStats(lesson, state);
      if (progress.done > 0 && !progress.complete) return { lesson, progress };
    }
  }, [catalog, ready, state]);

  const checking = !ready || (loading && !catalog && !current && !!Object.keys(state.lessonProgress ?? {}).length);
  const actionLabel = current ? 'Tiếp tục học' : 'Chọn bài đầu tiên';
  const progressKey = learnerId + ':' + (current?.lesson.id ?? '');

  return (
    <LinearGradient nativeID="home-lesson" colors={['#161c39', '#231839', '#3a2257']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={[styles.panel, wide && styles.panelWide]}>
      <View nativeID="home-hero-light" style={styles.light} pointerEvents="none" aria-hidden>
        <View nativeID="home-hero-nebula" style={styles.nebula} />
        {heroStars.map(([x, y, size, opacity]) => (
          <View key={x} nativeID={size >= 3 ? `home-hero-star-${x}` : undefined} style={[styles.star, { left: `${x}%`, top: `${y}%`, width: size, height: size, opacity }]} />
        ))}
        <View style={[styles.art, wide && styles.artWide]}>
          <View nativeID="home-hero-floor" style={styles.floor} />
          <View nativeID="home-hero-orbit-distant" style={[styles.orbit, styles.orbitDistant]} />
          <View nativeID="home-hero-orbit" style={styles.orbit} />
          <Image nativeID="home-hero-crystal-near" source={heroCrystal} style={[styles.crystal, styles.crystalNear]} resizeMode="contain" accessible={false} />
          <Image nativeID="home-hero-crystal-far" source={heroCrystal} style={[styles.crystal, styles.crystalFar]} resizeMode="contain" accessible={false} />
          <Image nativeID="home-hero-crystal-high" source={heroCrystal} style={[styles.crystal, styles.crystalHigh]} resizeMode="contain" accessible={false} />
          {Platform.OS !== 'web' && <NativeBom animated={reducedMotion === false} />}
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.intro}>
          <View style={styles.copy}>
            <View style={styles.eyebrow}><Ionicons aria-hidden name="sparkles" size={14} color={cosmic.gold} /><Text style={styles.eyebrowText}>Bài học tiếp theo</Text></View>
            <Text nativeID="home-lesson-heading" accessibilityRole="header" aria-level={2} style={[styles.heading, wide && styles.headingWide]}>
              {current ? current.lesson.title : 'Sẵn sàng khám phá?'}
            </Text>
            {current ? (
              <Text style={styles.detail}>
                Bài đang học: {current.lesson.kind === 'grammar' ? 'Ngữ pháp' : 'Từ vựng'} {getLevelLabel(current.lesson.level)}
              </Text>
            ) : (
              <Text accessibilityLiveRegion={checking ? 'polite' : undefined} style={styles.detail}>
                {checking ? 'Đang mở tiến độ của bạn…' : 'Cùng Bờm chọn bài tiếng Anh đầu tiên.'}
              </Text>
            )}
          </View>
        </View>
        {current && (
          <View style={styles.progress}>
            <View style={styles.progressLabels}>
              <Text style={styles.detail}>
                {current.progress.done}/{current.progress.total} {current.lesson.kind === 'vocabulary' ? 'từ đã học' : 'phần đã học'}
              </Text>
              <Text style={styles.percent}>{current.progress.percent}%</Text>
            </View>
            <LessonProgress key={progressKey} progressKey={progressKey} percent={current.progress.percent} reducedMotion={reducedMotion} />
          </View>
        )}
        {catalog?.source === 'local' && <Text style={styles.offline}>Thư viện ngoại tuyến</Text>}
        {error && !catalog && <Text style={styles.offline}>Chưa tải được danh mục bài học.</Text>}
        <Link
          href={current ? { pathname: '/lessons/[lessonId]', params: { lessonId: current.lesson.id } } : '/(tabs)/lessons'}
          style={styles.action}
          asChild
        >
          <HomePaperPressable
            nativeID="home-lesson-action" accessibilityLabel={actionLabel}
            faceStyle={styles.actionFace} reducedMotion={reducedMotion !== false} primary
          >
            <Text style={styles.actionLabel}>{actionLabel}</Text>
            <Ionicons aria-hidden name="arrow-forward" size={17} color={cosmic.text} />
          </HomePaperPressable>
        </Link>
      </View>
      <WebMascot placement="hero" />
    </LinearGradient>
  );
}

function NativeBom({ animated }: { animated: boolean }) {
  const blink = useRef(new Animated.Value(0)).current;
  useFocusEffect(useCallback(() => {
    if (!animated) return;
    const blinkOnce = (delay: number) => [
      Animated.delay(delay),
      Animated.timing(blink, { toValue: 1, duration: 50, useNativeDriver: true, isInteraction: false }),
      Animated.delay(70),
      Animated.timing(blink, { toValue: 0, duration: 60, useNativeDriver: true, isInteraction: false }),
    ];
    const sequence = Animated.sequence([...blinkOnce(3600), ...blinkOnce(4700)]);
    sequence.start();
    return () => { sequence.stop(); blink.setValue(0); };
  }, [animated, blink]));

  if (!animated) return <Image source={explorerBom} style={styles.image} resizeMode="contain" accessible={false} />;
  return (
    <Float style={styles.image} distance={5} duration={3200} iterations={2}>
      <Image source={explorerBom} style={styles.mascotImage} resizeMode="contain" accessible={false} />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: blink }]}>
        <Image source={explorerBomBlink} style={styles.mascotImage} resizeMode="contain" accessible={false} />
      </Animated.View>
    </Float>
  );
}

// Home can remount when the lesson closes. Remember only the last displayed bar.
let lastViewedProgress: { key: string; percent: number } | undefined;

function LessonProgress({ progressKey, percent, reducedMotion }: {
  progressKey: string;
  percent: number;
  reducedMotion: boolean | null;
}) {
  const [fill] = useState(() => new Animated.Value(
    (lastViewedProgress?.key === progressKey ? lastViewedProgress.percent : percent) / 100
  ));

  useFocusEffect(useCallback(() => {
    if (reducedMotion === null) return;
    const previous = lastViewedProgress?.key === progressKey ? lastViewedProgress.percent : percent;
    if (reducedMotion || percent <= previous) {
      lastViewedProgress = { key: progressKey, percent };
      fill.setValue(percent / 100);
      return;
    }

    const animation = Animated.timing(fill, {
      toValue: percent / 100,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      isInteraction: false,
      useNativeDriver: Platform.OS !== 'web',
    });
    const firstFrame = requestAnimationFrame(() => {
      lastViewedProgress = { key: progressKey, percent };
      animation.start();
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      animation.stop();
    };
  }, [fill, percent, progressKey, reducedMotion]));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Tiến độ bài học"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      style={styles.track}
    >
      <Animated.View nativeID="home-lesson-progress-fill" style={[styles.fill, { transform: [{ scaleX: fill }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { paddingHorizontal: 17, paddingVertical: 20, paddingRight: '37%', minHeight: 225, borderRadius: 26, borderWidth: 1, borderColor: cosmic.actionEdge, justifyContent: 'center', boxShadow: '0 12px 32px #4822695c' },
  panelWide: { paddingHorizontal: 26, paddingRight: '37%', minHeight: 263 },
  light: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 25,
  },
  nebula: { ...StyleSheet.absoluteFillObject, ...(Platform.OS !== 'web' && { experimental_backgroundImage: 'radial-gradient(ellipse farthest-corner at 84% 40%, #aa6def69 0%, #4c41995c 35%, transparent 72%), radial-gradient(ellipse farthest-corner at 56% 100%, #4673c142 0%, transparent 66%)' }) },
  star: { position: 'absolute', backgroundColor: '#f9ecff', borderRadius: 9 },
  content: { flex: 1, minWidth: 0, gap: 11 },
  intro: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  copy: { flex: 1, minWidth: 0, gap: 5 },
  heading: { color: cosmic.text, fontSize: 36, lineHeight: 40, letterSpacing: -0.95, fontWeight: '800', minWidth: 0 },
  headingWide: { fontSize: 42, lineHeight: 46, letterSpacing: -1.45 },
  detail: { color: cosmic.text, fontSize: 14, lineHeight: 20 },
  offline: { color: cosmic.muted, fontSize: 11, lineHeight: 16 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  eyebrowText: { color: cosmic.gold, fontSize: 12, fontWeight: '600' },
  art: { position: 'absolute', top: 7, bottom: 5, right: 4, width: '43%', justifyContent: 'center', alignItems: 'center' },
  artWide: { width: '49%', right: 2 },
  image: { width: '83%', height: '83%', marginTop: '11%', marginLeft: '9%' },
  mascotImage: { width: '100%', height: '100%' },
  orbit: { position: 'absolute', top: '47%', width: '105%', aspectRatio: 2.65, borderRadius: 999, borderWidth: 1, borderColor: '#b59aff75', borderBottomColor: '#ead4ffe3', transform: [{ rotate: '-24deg' }] },
  orbitDistant: { top: '32%', width: '98%', aspectRatio: 2.9, borderColor: '#9789eb38', borderBottomColor: '#9aa4ff7d', transform: [{ rotate: '-33deg' }] },
  floor: { position: 'absolute', bottom: '3%', width: '109%', height: '27%', borderRadius: 999, ...(Platform.OS !== 'web' && { experimental_backgroundImage: 'radial-gradient(ellipse closest-side at center, #ffe5d340 0%, #c86ffe33 30%, transparent 100%)' }) },
  crystal: { position: 'absolute', width: '16%', height: '31%' },
  crystalNear: { left: '11%', bottom: '22%', transform: [{ rotate: '-17deg' }] },
  crystalFar: { right: '2%', top: '22%', width: '13%', height: '23%', opacity: 0.78, transform: [{ rotate: '20deg' }] },
  crystalHigh: { left: '29%', top: '5%', width: '11%', height: '18%', opacity: 0.7, transform: [{ rotate: '-29deg' }] },
  action: { alignSelf: 'flex-start', minHeight: 49, backgroundColor: cosmic.actionEdge },
  actionFace: {
    ...gameButton, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 14, backgroundColor: cosmic.action, borderColor: cosmic.actionEdge,
    ...(Platform.OS !== 'web' && { experimental_backgroundImage: 'linear-gradient(168deg, #b590ff 0%, #7950d9 21%, #643bbf 56%, #4e2f9d 100%)' }),
  },
  actionLabel: { color: cosmic.text, fontSize: 16, lineHeight: 21, fontWeight: cosmicType.bold },
  progress: { gap: 5 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  percent: { fontSize: 15, fontWeight: cosmicType.bold, color: cosmic.mint, fontVariant: ['tabular-nums'] },
  track: { height: 7, borderRadius: 4, backgroundColor: cosmic.mintTrack, overflow: 'hidden' },
  fill: { height: 7, borderRadius: 4, backgroundColor: cosmic.mint, transformOrigin: 'left center' },
});
