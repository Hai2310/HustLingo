import { getLevelLabel } from '@/utils/levelLabels';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';
import { cosmic, glassCard } from '@/theme/cosmic';
import { useLearning } from '@/contexts/LearningContext';
import { useLessonCatalog } from '../hooks/useLessonCatalog';
import { isLessonLevel, lessonStats, topicStats } from '../data/catalog';
import type { LessonKind, LessonLevel } from '../types';
import { KindFilter, LessonButton, LessonCard, LessonSearch, LessonState, LevelFilter, Notice, ProgressBar, Reveal, SyncLabel, ui } from '../components/LessonUI';
import { VocabularyLibraryHero, VocabularyTopicCover } from '../components/VocabularyPresentation';

export function LessonsScreen() {
  const params = useLocalSearchParams<{ level?: string; type?: string }>();
  const [level, setLevel] = useState<LessonLevel | 'all'>(isLessonLevel(params.level) ? params.level : 'all');
  const kind: LessonKind = params.type === 'grammar' ? 'grammar' : 'vocabulary';
  const [search, setSearch] = useState(''), [showTopics, setShowTopics] = useState(false), [visible, setVisible] = useState(18);
  const { catalog, loading, error, retry } = useLessonCatalog();
  const { state, ready } = useLearning();
  const { width } = useWindowDimensions(), wide = width >= 760;
  const searchQuery = search.trim().toLowerCase();
  useEffect(() => { if (isLessonLevel(params.level)) setLevel(params.level); }, [params.level]);
  useEffect(() => { setVisible(18); }, [level, kind, search]);

  const topics = useMemo(() => new Map(catalog?.topics.map(topic => [topic.id, topic]) || []), [catalog]);
  const filtered = useMemo(() => (catalog?.lessons || []).filter(lesson => (level === 'all' || lesson.level === level) && lesson.kind === kind && (!searchQuery || `${lesson.title} ${topics.get(lesson.topicId)?.title || ''}`.toLowerCase().includes(searchQuery))), [catalog, level, kind, searchQuery, topics]);
  const recommended = useMemo(() => [...filtered].sort((a, b) => (state.lessonProgress?.[b.id]?.updatedAt || '').localeCompare(state.lessonProgress?.[a.id]?.updatedAt || '')).find(lesson => !lessonStats(lesson, state).complete) || filtered[0], [filtered, state]);
  const overall = topicStats(catalog?.lessons || [], state);
  const recommendedStats = recommended ? lessonStats(recommended, state) : null;
  const featuredIds = ['education', 'family', 'travel', 'technology', 'workplace', 'grammar', 'food'];
  const orderedTopics = (catalog?.topics || []).filter(topic => catalog?.lessons.some(lesson => lesson.topicId === topic.id && lesson.kind === 'vocabulary')).sort((a, b) => {
    const left = featuredIds.indexOf(a.id), right = featuredIds.indexOf(b.id);
    return (left < 0 ? 99 : left) - (right < 0 ? 99 : right) || a.title.localeCompare(b.title);
  });
  const topicWidth = wide ? '32%' : width >= 560 ? '48%' : '100%';

  return <Screen ambient={false} contentStyle={ui.content}><Reveal>
    <View style={styles.top}><Text accessibilityRole="header" style={ui.heading}>{kind === 'vocabulary' ? 'Vocabulary' : 'Grammar'}</Text><SyncLabel /></View>
    <Text style={ui.description}>{kind === 'vocabulary' ? 'Explore words by level and topic, with audio and examples.' : 'Study rules, examples and common mistakes at your level.'}</Text>

    {catalog && recommended && !searchQuery && (kind === 'vocabulary' ? <VocabularyLibraryHero lesson={recommended} onStart={() => router.push({ pathname: '/lessons/[lessonId]', params: { lessonId: recommended.id } })} /> : <View style={[styles.grammarHero, !wide && { flexDirection: 'column' }]}>
      <View style={{ flex: 1 }}><Text style={styles.heroKicker}>{recommendedStats?.done ? 'PICK UP WHERE YOU LEFT OFF' : 'A GOOD PLACE TO START'}</Text><Text style={styles.heroTitle}>{recommended.title}</Text><Text style={styles.heroDescription}>A clear rule, useful examples and a common mistake to avoid.</Text><View style={styles.heroAction}><LessonButton label={recommendedStats?.done ? 'Continue lesson' : 'Start lesson'} icon="arrow-forward" onPress={() => router.push({ pathname: '/lessons/[lessonId]', params: { lessonId: recommended.id } })} /><Text style={styles.heroLevel}>{getLevelLabel(recommended.level)} · Grammar</Text></View></View>
      <View style={[styles.heroSummary, !wide && { width: '100%' }]}><Text style={styles.summaryNumber}>{ready ? overall.complete : '—'}</Text><Text style={styles.summaryLabel}>lessons completed</Text><View style={styles.summaryRule} /><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Words studied</Text><Text style={styles.summaryValue}>{ready ? state.studiedWordIds.length : '—'}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Saved words</Text><Text style={styles.summaryValue}>{ready ? state.savedWordIds.length : '—'}</Text></View></View>
    </View>)}

    {catalog?.notice && <Notice text={catalog.notice} retry={retry} busy={loading} />}
    <View style={styles.filters}><KindFilter options={['vocabulary', 'grammar']} value={kind} onChange={value => router.setParams({ type: value })} /><LessonSearch value={search} onChange={setSearch} /><Text style={styles.filterLabel}>Choose your level</Text><LevelFilter value={level} onChange={setLevel} /></View>

    {loading && !catalog ? <LessonState kind="loading" title="Opening your library" description="Loading published lessons and your learning options." /> : error ? <LessonState kind="error" title="The library could not load" description={error} action="Try again" onAction={retry} /> : catalog && <>
      {kind === 'vocabulary' && !searchQuery && orderedTopics.length > 0 && <><View style={ui.sectionHeader}><Text style={ui.sectionHeading}>Explore by topic</Text><Pressable accessibilityRole="button" onPress={() => setShowTopics(value => !value)} style={styles.textButton}><Text style={styles.textButtonLabel}>{showTopics ? 'Show less' : 'See all topics'}</Text><Ionicons name={showTopics ? 'chevron-up' : 'arrow-forward'} size={15} color={colors.primary} /></Pressable></View>
        <View style={styles.topicGrid}>{(showTopics ? orderedTopics : orderedTopics.slice(0, 6)).map(topic => {
          const selected = catalog.lessons.filter(lesson => lesson.topicId === topic.id && (level === 'all' || lesson.level === level) && lesson.kind === 'vocabulary');
          const stats = topicStats(selected, state);
          const illustrated = topic.id !== 'grammar';
          return <Pressable key={topic.id} nativeID={'cosmic-lift-topic-' + topic.id} accessibilityRole="button" accessibilityLabel={`${topic.title}, ${stats.count} lessons, ${stats.percent}% complete`} onPress={() => router.push({ pathname: '/lessons/topics/[topicId]', params: { topicId: topic.id, level, type: kind } })} style={({ pressed }) => [styles.topicCard, { width: topicWidth }, illustrated && styles.illustratedTopicCard, pressed && { opacity: .8 }]}>
            {illustrated ? <VocabularyTopicCover topicId={topic.id} /> : <View style={styles.topicTop}><View style={[styles.topicIcon, { backgroundColor: cosmic.iceSurface }]}><Ionicons name={topic.icon} color={cosmic.ice} size={24} /></View><Ionicons name="arrow-forward" size={18} color={colors.textMuted} /></View>}
            <View style={illustrated ? styles.topicBody : undefined}><Text style={[styles.topicTitle, illustrated && { marginTop: 0 }]}>{topic.title}</Text><Text style={styles.topicDescription} numberOfLines={2}>{topic.description}</Text><View style={styles.topicProgress}><Text style={styles.topicMeta}>{stats.count ? `${stats.complete} / ${stats.count} lessons completed` : 'No lessons at this level'}</Text><Text style={styles.topicMeta}>{stats.percent}%</Text></View><ProgressBar percent={stats.percent} label={`${topic.title} progress`} /></View>
          </Pressable>;
        })}</View></>}
      {(kind === 'grammar' || searchQuery !== '') && <>
        <View style={ui.sectionHeader}><Text style={ui.sectionHeading}>{searchQuery ? 'Search results' : 'Grammar lessons'}</Text><Text style={styles.count}>{filtered.length} lessons</Text></View>
        {filtered.length ? <><View style={styles.lessonList}>{filtered.slice(0, visible).map(lesson => <LessonCard key={lesson.id} lesson={lesson} topic={topics.get(lesson.topicId)} />)}</View>{filtered.length > visible && <View style={styles.loadMore}><LessonButton secondary label={`Show more (${filtered.length - visible} remaining)`} onPress={() => setVisible(value => value + 18)} /></View>}</> : <LessonState kind="empty" title="No lessons found" description="Try another level or search term." action="Clear filters" onAction={() => { setLevel('all'); setSearch(''); }} />}
      </>}
      {kind === 'vocabulary' && !searchQuery && orderedTopics.length === 0 && <LessonState kind="empty" title="No vocabulary topics yet" description="Vocabulary topics will appear here when lessons are available." />}
    </>}
  </Reveal></Screen>;
}
export default LessonsScreen;

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' },
  grammarHero: { ...glassCard, backgroundColor: cosmic.iceSurface, borderColor: cosmic.iceEdge, borderRadius: 23, padding: 23, marginTop: 22, flexDirection: 'row', gap: 20 },
  heroKicker: { color: colors.textSecondary, fontSize: 10, fontWeight: '700', marginBottom: 9 },
  heroTitle: { color: colors.text, fontSize: 29, fontWeight: '800', lineHeight: 37, letterSpacing: -.7 },
  heroDescription: { color: colors.textSecondary, fontSize: 13, lineHeight: 21, marginTop: 10, maxWidth: 530 },
  heroAction: { flexDirection: 'row', alignItems: 'center', gap: 15, flexWrap: 'wrap', marginTop: 22 }, heroLevel: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },
  heroSummary: { width: 220, backgroundColor: cosmic.glass, padding: 21, borderRadius: 16 }, summaryNumber: { color: colors.text, fontSize: 40, fontWeight: '800', lineHeight: 46 }, summaryLabel: { color: colors.textSecondary, fontSize: 12, lineHeight: 19 },
  summaryRule: { height: 1, backgroundColor: cosmic.border, marginVertical: 13 }, summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }, summaryValue: { color: colors.text, fontSize: 13, fontWeight: '700' },
  filters: { marginTop: 13 }, filterLabel: { marginBottom: 7, color: colors.textSecondary, fontSize: 12, fontWeight: '800' },
  textButton: { minHeight: 40, flexDirection: 'row', gap: 6, alignItems: 'center' }, textButtonLabel: { fontSize: 12, color: colors.primary, fontWeight: '700' },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, topicCard: { ...glassCard, padding: 19 },
  illustratedTopicCard: { padding: 0, overflow: 'hidden' }, topicBody: { padding: 19 },
  topicTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, topicIcon: { width: 47, height: 47, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  topicTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 17 }, topicDescription: { fontSize: 12, lineHeight: 19, color: colors.textSecondary, marginTop: 6, minHeight: 38 },
  topicProgress: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, marginBottom: 8, gap: 5 }, topicMeta: { color: colors.textMuted, fontSize: 10 }, count: { color: colors.textMuted, fontSize: 12 },
  lessonList: { gap: 12 }, loadMore: { alignItems: 'center', paddingVertical: 24 },
});
