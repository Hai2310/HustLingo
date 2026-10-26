import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';
import { useLearning } from '@/contexts/LearningContext';
import { loadLessonContent } from '@/services/learningContent';
import { useLessonCatalog } from '../hooks/useLessonCatalog';
import { useReducedLessonMotion } from '../hooks/useReducedLessonMotion';
import { lessonStats } from '../data/catalog';
import type { LessonContent } from '../types';
import { LessonBack, LessonButton, LessonState, Notice, ProgressBar, Reveal, SyncLabel, ui } from '../components/LessonUI';
import { VocabularyLesson } from '../components/VocabularyLesson';
import { GrammarLesson } from '../components/GrammarLesson';

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { catalog, loading, error: catalogError, retry: retryCatalog } = useLessonCatalog();
  const { state, ready } = useLearning(), reduced = useReducedLessonMotion();
  const [detail, setDetail] = useState<{ id: string; content: LessonContent } | null>(null);
  const [error, setError] = useState<string | null>(null), [attempt, setAttempt] = useState(0);
  const scroll = useRef<ScrollView>(null);
  const lesson = catalog?.lessons.find(item => item.id === lessonId);
  useEffect(() => {
    let active = true;
    setDetail(null); setError(null);
    if (lesson && catalog) loadLessonContent(lesson, catalog.source, attempt > 0).then(content => { if (active) setDetail({ id: lesson.id, content }); }).catch(() => { if (active) setError('This lesson could not be loaded. Connect to the internet and try again.'); });
    return () => { active = false; };
  }, [lesson, catalog, attempt]);
  const content = detail?.id === lessonId ? detail.content : null;
  const stats = lesson ? lessonStats(lesson, state) : null;
  const next = lesson && catalog?.lessons.filter(item => item.level === lesson.level && item.kind === lesson.kind && item.id !== lesson.id).find(item => !lessonStats(item, state).complete);
  const moveToTop = () => scroll.current?.scrollTo({ y: 0, animated: !reduced });

  return <Screen ambient={false} contentStyle={ui.content} scrollRef={scroll}><Reveal><LessonBack />
    {loading && !catalog ? <LessonState kind="loading" title="Loading your lesson" description="Opening the published library." /> : catalogError ? <LessonState kind="error" title="The library could not load" description={catalogError} action="Try again" onAction={retryCatalog} /> : !lesson ? <LessonState kind="empty" title="Lesson not found" description="This lesson is unavailable or has not been published. You can return to the library and choose another lesson." action="Browse lessons" onAction={() => router.replace('/(tabs)/lessons')} /> : <>
      <View style={styles.header}><Text style={ui.kicker}>{lesson.level} · {lesson.kind.toUpperCase()} LESSON</Text><SyncLabel /></View><Text style={ui.heading}>{lesson.title}</Text><Text style={ui.description}>{lesson.kind === 'vocabulary' ? 'Listen, explore the meaning and build your word knowledge.' : 'Understand the pattern, read the examples and spot common mistakes.'}</Text>
      <View style={styles.progressCard}><View style={styles.progressTop}><Text style={styles.progressDescription}>{!ready ? 'Loading saved progress…' : stats?.complete ? 'Lesson completed' : `${stats?.done} of ${stats?.total} study steps completed`}</Text><Text style={[styles.percent, stats?.complete && { color: colors.success }]}>{stats?.percent}%</Text></View><ProgressBar percent={stats?.percent || 0} label="Lesson completion" /></View>
      {content?.notice && <Notice text={content.notice} retry={() => setAttempt(value => value + 1)} />}
      {error ? <LessonState kind="error" title="Something interrupted this lesson" description={error} action="Reload lesson" onAction={() => setAttempt(value => value + 1)} /> : !content ? <LessonState kind="loading" title="Preparing the lesson" description="Loading the words, rules and examples for this lesson." /> : !content.vocabulary.length && !content.grammar.length ? <LessonState kind="empty" title="This lesson is being prepared" description="No learning content has been published for this lesson yet. Choose another lesson for now." action="Browse lessons" onAction={() => router.replace('/(tabs)/lessons')} /> : <>
        {stats?.complete && <View style={styles.completed} accessibilityLiveRegion="polite"><View style={styles.check}><Ionicons name="checkmark-circle" size={34} color={colors.success} /></View><View style={{ flex: 1 }}><Text style={styles.completedTitle}>Well done. Lesson completed!</Text><Text style={styles.completedDescription}>You can revisit every word and section at any time.</Text></View></View>}
        {lesson.kind === 'vocabulary' ? <VocabularyLesson key={lesson.id} lesson={lesson} words={content.vocabulary} onPageChange={moveToTop} /> : <GrammarLesson key={lesson.id} lesson={lesson} points={content.grammar} onSectionChange={moveToTop} />}
        {stats?.complete && <View style={styles.nextActions}>{next && <LessonButton label="Next lesson" icon="arrow-forward" onPress={() => { router.replace({ pathname: '/lessons/[lessonId]', params: { lessonId: next.id } }); moveToTop(); }} />}<LessonButton secondary label="Back to the library" onPress={() => router.replace('/(tabs)/lessons')} /></View>}
      </>}
    </>}
  </Reveal></Screen>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  progressCard: { padding: 20, marginTop: 24, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 16 }, progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 15, marginBottom: 12 }, progressDescription: { flex: 1, color: colors.textSecondary, fontSize: 12, lineHeight: 19 }, percent: { color: colors.primary, fontSize: 23, fontWeight: '800' },
  completed: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#BBDFCF', backgroundColor: colors.successSoft, marginTop: 22 }, check: { width: 44, alignItems: 'center' }, completedTitle: { fontSize: 17, fontWeight: '700', color: '#1E6F50' }, completedDescription: { fontSize: 12, lineHeight: 19, marginTop: 5, color: '#42725E' }, nextActions: { gap: 12, marginTop: 24 },
});
