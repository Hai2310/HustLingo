import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { useLearning } from '@/contexts/LearningContext';
import type { LocalVocabularyRecord } from '@/data/vocabulary-en';
import type { CatalogLesson } from '../types';
import { lessonSteps } from '../data/catalog';
import { useLessonSpeech } from '../hooks/useLessonSpeech';
import { LessonButton, Notice, Reveal } from './LessonUI';
import { VocabularyWordCard } from './VocabularyWordCard';

const PAGE_SIZE = 12;
export function VocabularyLesson({ lesson, words, onPageChange }: { lesson: CatalogLesson; words: LocalVocabularyRecord[]; onPageChange(): void }) {
  const { state, ready, markLessonStep, toggleSaved } = useLearning(), { width } = useWindowDimensions();
  const lastId = state.lessonProgress?.[lesson.id]?.lastStepId?.replace(/^word:/, '');
  const [page, setPage] = useState(() => Math.floor(Math.max(0, words.findIndex(word => word.id === lastId)) / PAGE_SIZE));
  const { speaking, audioError, speak } = useLessonSpeech();
  const required = lessonSteps(lesson), completed = state.lessonProgress?.[lesson.id]?.completedSteps || [];
  const complete = state.completedLessonIds.includes(lesson.id);
  const studied = words.filter(word => complete || completed.includes(`word:${word.id}`)).length;
  const pages = Math.ceil(words.length / PAGE_SIZE), cardWidth = width >= 900 ? (Math.min(width, 1120) - 52) / 2 : Math.min(width, 1120) - 36;
  useEffect(() => { setPage(value => Math.min(value, Math.max(0, pages - 1))); }, [pages]);
  function changePage(next: number) { setPage(Math.max(0, Math.min(pages - 1, next))); onPageChange(); }
  const pagination = <View style={styles.pagination}><LessonButton secondary label="Previous" disabled={page === 0} onPress={() => changePage(page - 1)} /><View style={styles.page}><Text style={styles.pageText}>Page {page + 1} of {pages}</Text><Text style={styles.pageHint}>12 words per page</Text></View><LessonButton secondary label="Next" disabled={page >= pages - 1} onPress={() => changePage(page + 1)} /></View>;

  return <View>{audioError && <Notice text={audioError} />}
    <View style={styles.collectionHeading}><View><Text style={styles.collectionKicker}>ONE WORD AT A TIME</Text><Text style={styles.collectionTitle}>Your word collection</Text></View><View style={styles.countBadge}><Ionicons name="checkmark-circle" size={15} color={colors.success} /><Text style={styles.countText}>{studied} / {words.length} studied</Text></View></View>
    <View style={styles.listHeading}><Text style={styles.wordRange}>WORDS {page * PAGE_SIZE + 1}–{Math.min(words.length, (page + 1) * PAGE_SIZE)} OF {words.length}</Text><Text style={styles.hint}>Read, listen, then mark each word as studied.</Text></View>
    {pages > 1 && pagination}
    <View style={styles.grid}>{words.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((word, index) => <View key={word.id} style={{ width: cardWidth }}><Reveal><VocabularyWordCard word={word} number={page * PAGE_SIZE + index + 1} studied={complete || completed.includes(`word:${word.id}`)} saved={state.savedWordIds.includes(word.id)} ready={ready} speaking={speaking === word.id} onSave={() => toggleSaved(word.id)} onSpeak={() => { void speak(word.id, word.term); }} onStudy={() => markLessonStep(lesson.id, `word:${word.id}`, required, word.id)} /></Reveal></View>)}</View>
    {pages > 1 && pagination}
    <View style={styles.tip}><Ionicons name="bulb-outline" size={19} color="#AC7D35" /><Text style={styles.tipText}><Text style={{ fontWeight: '700' }}>Make it stick. </Text>Say a new sentence aloud using one of these words.</Text></View>
  </View>;
}

const styles = StyleSheet.create({
  collectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 32 }, collectionKicker: { fontSize: 8, letterSpacing: 1.2, color: colors.textMuted, fontWeight: '800', marginBottom: 7 }, collectionTitle: { fontSize: 23, lineHeight: 31, fontWeight: '800', letterSpacing: -.5, color: colors.text }, countBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: '#ECF5EE', borderRadius: 99 }, countText: { color: '#557A62', fontSize: 10, fontWeight: '700' },
  listHeading: { marginTop: 16, marginBottom: 17, gap: 7 }, wordRange: { fontSize: 9, fontWeight: '800', color: colors.textSecondary, letterSpacing: .8 }, hint: { fontSize: 12, lineHeight: 19, color: colors.textMuted }, grid: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 16 },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 4, marginBottom: 20, paddingTop: 14 }, page: { alignItems: 'center', gap: 4 }, pageText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary }, pageHint: { fontSize: 8, color: colors.textMuted }, tip: { marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 17, backgroundColor: '#FFF0D9', borderRadius: 13 }, tipText: { flex: 1, fontSize: 12, lineHeight: 20, color: '#866836' },
});
