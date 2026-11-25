import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLearning } from '@/contexts/LearningContext';
import { getLocalCatalog, lessonStats } from '@/features/lessons/data/catalog';
import { getVocabularyArtwork } from '@/features/lessons/data/vocabulary-artwork';
import { useLessonCatalog } from '@/features/lessons/hooks/useLessonCatalog';
import { hum, humType, paperButton } from './homeHum';
import { HomePaperPressable } from './HomePaperPressable';

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
  const art = getVocabularyArtwork(current?.lesson.topicId);
  const actionLabel = current ? 'Tiếp tục học' : 'Chọn bài đầu tiên';
  const letterMotion = usePaperLetterMotion(reducedMotion !== false);
  const progressKey = learnerId + ':' + (current?.lesson.id ?? '');
  const illustration = (
    <View style={[styles.art, wide && styles.artWide]}>
      <Image
        source={art.image}
        style={[styles.image, wide && styles.imageWide]}
        resizeMode="cover"
        accessible={false}
        importantForAccessibility="no"
      />
      <Animated.View
        nativeID="home-paper-letter"
        aria-hidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.paperLetter, wide && styles.paperLetterWide, letterMotion]}
      >
        <Text style={[styles.letter, wide && styles.letterWide]}>A</Text>
      </Animated.View>
    </View>
  );

  return (
    <View nativeID="home-lesson" style={[styles.panel, wide && styles.panelWide]}>
      <View style={styles.content}>
        <View style={styles.intro}>
          <View style={styles.copy}>
            <Text accessibilityRole="header" aria-level={2} style={[styles.heading, wide && styles.headingWide]}>
              {current ? current.lesson.title : 'Bắt đầu học'}
            </Text>
            {current ? (
              <Text style={styles.detail}>
                Bài đang học: {current.lesson.kind === 'grammar' ? 'Ngữ pháp' : 'Từ vựng'} {current.lesson.level}
              </Text>
            ) : (
              <Text accessibilityLiveRegion={checking ? 'polite' : undefined} style={styles.detail}>
                {checking ? 'Đang mở tiến độ của bạn…' : 'Chọn bài từ vựng hoặc ngữ pháp theo trình độ của bạn.'}
              </Text>
            )}
          </View>
          {!wide && illustration}
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
            <Ionicons aria-hidden name="arrow-forward" size={17} color={hum.ink} />
          </HomePaperPressable>
        </Link>
      </View>
      {wide && illustration}
    </View>
  );
}

let paperLetterPlayed = false;

function usePaperLetterMotion(reducedMotion: boolean) {
  const [position] = useState(() => new Animated.Value(0));
  const pose = useMemo(() => ({
    transform: [
      { translateY: position.interpolate({ inputRange: [0, 0.46, 0.74, 1], outputRange: [0, -8, -2, 0] }) },
      { rotate: position.interpolate({ inputRange: [0, 0.46, 0.74, 1], outputRange: ['-8deg', '-14deg', '-5deg', '-8deg'] }) },
    ],
  }), [position]);

  useEffect(() => {
    if (reducedMotion || paperLetterPlayed) return;
    const timing = { isInteraction: false, useNativeDriver: Platform.OS !== 'web' };
    const animation = Animated.sequence([
      Animated.timing(position, { ...timing, toValue: 0.46, duration: 200, easing: Easing.out(Easing.quad) }),
      Animated.timing(position, { ...timing, toValue: 1, duration: 250, easing: Easing.out(Easing.cubic) }),
    ]);
    const firstFrame = requestAnimationFrame(() => {
      paperLetterPlayed = true;
      animation.start();
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      animation.stop();
      position.setValue(0);
    };
  }, [position, reducedMotion]);

  return pose;
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
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={styles.track}
    >
      <Animated.View nativeID="home-lesson-progress-fill" style={[styles.fill, { transform: [{ scaleX: fill }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { paddingHorizontal: 16, paddingVertical: 16, borderRadius: 21, backgroundColor: hum.card, borderWidth: 1, borderColor: hum.rule, boxShadow: '1px 4px 0 ' + hum.paperDeep },
  panelWide: { flex: 1.6, minWidth: 0, minHeight: 257, flexDirection: 'row', alignItems: 'center', gap: 17, paddingHorizontal: 23, paddingVertical: 21 },
  content: { flex: 1, minWidth: 0, gap: 11 },
  intro: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  copy: { flex: 1, minWidth: 0, gap: 5 },
  heading: { color: hum.ink, fontSize: 27, lineHeight: 33, letterSpacing: -0.7, fontWeight: humType.bold, minWidth: 0 },
  headingWide: { fontSize: 39, lineHeight: 44, letterSpacing: -1.45 },
  detail: { color: hum.ink, fontSize: 15, lineHeight: 21 },
  offline: { color: hum.muted, fontSize: 13, lineHeight: 18 },
  art: { flexShrink: 0, width: '33%', padding: 4, backgroundColor: hum.sky, borderRadius: 13, transform: [{ rotate: '2deg' }] },
  artWide: { width: '43%', maxWidth: 275, padding: 7, borderRadius: 17 },
  image: { width: '100%', height: 76, borderRadius: 10, backgroundColor: hum.paperDeep },
  imageWide: { height: 174, borderRadius: 12 },
  paperLetter: { position: 'absolute', pointerEvents: 'none', top: -3, right: -3, width: 27, height: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderBottomWidth: 3, borderColor: hum.rule, borderRadius: 7, backgroundColor: hum.card },
  paperLetterWide: { top: -5, right: -6, width: 40, height: 44, borderRadius: 10 },
  letter: { color: hum.ink, fontSize: 19, lineHeight: 23, fontWeight: humType.bold },
  letterWide: { fontSize: 27, lineHeight: 32 },
  action: { alignSelf: 'flex-start', minHeight: 49, backgroundColor: hum.pearEdge },
  actionFace: { ...paperButton, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 14, backgroundColor: hum.pear, borderColor: hum.pearEdge },
  actionLabel: { color: hum.ink, fontSize: 16, lineHeight: 21, fontWeight: humType.bold },
  progress: { gap: 5 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  percent: { fontSize: 15, fontWeight: humType.bold, color: hum.greenInk, fontVariant: ['tabular-nums'] },
  track: { height: 7, borderRadius: 4, backgroundColor: hum.mintTrack, overflow: 'hidden' },
  fill: { height: 7, borderRadius: 4, backgroundColor: hum.greenInk, transformOrigin: 'left center' },
});
