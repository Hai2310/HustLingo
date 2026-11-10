import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { useLearning } from '@/contexts/LearningContext';
import { colors } from '@/theme/colors';
import { useLessonCatalog } from '../hooks/useLessonCatalog';
import { isLessonLevel, normaliseLessonTopic, topicStats } from '../data/catalog';
import type { LessonKind, LessonLevel } from '../types';
import { KindFilter, LessonBack, LessonButton, LessonCard, LessonState, LevelFilter, Notice, ProgressBar, Reveal, SyncLabel, ui } from '../components/LessonUI';

export default function TopicDetailScreen() {
  const params = useLocalSearchParams<{ topicId: string; level?: string; type?: string }>();
  const [level, setLevel] = useState<LessonLevel | 'all'>(isLessonLevel(params.level) ? params.level : 'all');
  const [kind, setKind] = useState<LessonKind | 'all'>(params.type === 'grammar' || params.type === 'vocabulary' ? params.type : 'all');
  const [visible, setVisible] = useState(18);
  const { catalog, loading, error, retry } = useLessonCatalog(), { state } = useLearning();
  const topicId = normaliseLessonTopic(params.topicId || '');
  const topic = catalog?.topics.find(item => item.id === topicId);
  const lessons = useMemo(() => (catalog?.lessons || []).filter(lesson => lesson.topicId === topicId && (level === 'all' || lesson.level === level) && (kind === 'all' || lesson.kind === kind)), [catalog, topicId, level, kind]);
  const stats = topicStats(lessons, state);
  return <Screen ambient={false} contentStyle={ui.content}><Reveal><LessonBack />
    {loading && !catalog ? <LessonState kind="loading" title="Loading topic" description="Finding lessons for this topic." /> : error ? <LessonState kind="error" title="Topic could not load" description={error} action="Try again" onAction={retry} /> : !topic ? <LessonState kind="empty" title="Topic not found" description="This topic may have moved or is not published yet. Go back to choose another topic." action="Reload library" onAction={retry} /> : <>
      <View style={styles.header}><View style={[styles.icon, { backgroundColor: topic.background }]}><Ionicons name={topic.icon} size={28} color={topic.color} /></View><SyncLabel /></View>
      <Text style={ui.kicker}>EXPLORE A TOPIC</Text><Text style={ui.heading}>{topic.title}</Text><Text style={ui.description}>{topic.description}</Text>
      <View style={styles.topicProgress}><View style={styles.progressLabel}><Text style={styles.progressTitle}>{stats.complete} of {stats.count} lessons completed</Text><Text style={styles.percent}>{stats.percent}%</Text></View><ProgressBar percent={stats.percent} label={`${topic.title} progress`} /></View>
      {catalog?.notice && <Notice text={catalog.notice} retry={retry} busy={loading} />}
      <View style={{ marginTop: 24 }}><LevelFilter value={level} onChange={value => { setLevel(value); setVisible(18); }} /><KindFilter value={kind} onChange={value => { setKind(value); setVisible(18); }} /></View>
      <View style={ui.sectionHeader}><Text style={ui.sectionHeading}>Your lessons</Text><Text style={styles.count}>{lessons.length} available</Text></View>
      {lessons.length ? <View style={{ gap: 12 }}>{lessons.slice(0, visible).map(lesson => <LessonCard key={lesson.id} lesson={lesson} topic={topic} />)}{lessons.length > visible && <LessonButton secondary label="Show more lessons" onPress={() => setVisible(value => value + 18)} />}</View> : <LessonState kind="empty" title="No lessons at this level yet" description="Choose another CEFR level or lesson type. Your topic progress is kept separately." action="Show all lessons in this topic" onAction={() => { setLevel('all'); setKind('all'); }} />}
    </>}
  </Reveal></Screen>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  icon: { width: 62, height: 62, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  topicProgress: { padding: 21, marginTop: 24, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 16 },
  progressLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13, gap: 10 },
  progressTitle: { color: colors.textSecondary, fontSize: 13, flex: 1 }, percent: { fontSize: 20, fontWeight: '800', color: colors.primary }, count: { fontSize: 12, color: colors.textMuted },
});
