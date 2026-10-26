import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { useLearning } from '@/contexts/LearningContext';
import type { LocalVocabularyRecord } from '@/data/vocabulary-en';
import type { CatalogLesson } from '../types';
import { lessonSteps } from '../data/catalog';
import { useLessonSpeech } from '../hooks/useLessonSpeech';
import { LessonButton, Notice, Reveal } from './LessonUI';

const PAGE_SIZE = 12;
export function VocabularyLesson({ lesson, words, onPageChange }: { lesson: CatalogLesson; words: LocalVocabularyRecord[]; onPageChange(): void }) {
  const { state, ready, markLessonStep, toggleSaved } = useLearning();
  const lastId = state.lessonProgress?.[lesson.id]?.lastStepId?.replace(/^word:/, '');
  const [page, setPage] = useState(() => Math.floor(Math.max(0, words.findIndex(word => word.id === lastId)) / PAGE_SIZE));
  const [translations, setTranslations] = useState<string[]>([]);
  const { speaking, audioError, speak } = useLessonSpeech();
  const required = lessonSteps(lesson), completed = state.lessonProgress?.[lesson.id]?.completedSteps || [];
  const pages = Math.ceil(words.length / PAGE_SIZE);
  useEffect(() => { setPage(value => Math.min(value, Math.max(0, pages - 1))); }, [pages]);
  function changePage(next: number) { setPage(Math.max(0, Math.min(pages - 1, next))); onPageChange(); }
  const pagination = <View style={styles.pagination}><LessonButton secondary label="Previous" disabled={page === 0} onPress={() => changePage(page - 1)} /><Text style={styles.pageText}>Page {page + 1} of {pages}</Text><LessonButton secondary label="Next" disabled={page >= pages - 1} onPress={() => changePage(page + 1)} /></View>;
  return <View>{audioError && <Notice text={audioError} />}
    <View style={styles.listHeading}><Text style={styles.wordRange}>WORDS {page * PAGE_SIZE + 1}–{Math.min(words.length, (page + 1) * PAGE_SIZE)} OF {words.length}</Text><Text style={styles.hint}>Read, listen, then mark each word as studied.</Text></View>
    {pages > 1 && pagination}
    <View style={{ gap: 16 }}>{words.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((word, index) => {
      const done = state.completedLessonIds.includes(lesson.id) || completed.includes(`word:${word.id}`), saved = state.savedWordIds.includes(word.id);
      return <Reveal key={word.id}><View style={[styles.wordCard, done && styles.studiedCard]}>
        <View style={styles.wordTop}><Text style={styles.wordNumber}>{String(page * PAGE_SIZE + index + 1).padStart(2, '0')}</Text><View style={{ flex: 1 }}><Text style={styles.term}>{word.term}</Text><Text style={styles.ipa}>{word.ipa || word.pronunciation || 'Pronunciation not available'}{word.partOfSpeech ? `  ·  ${word.partOfSpeech}` : ''}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={saved ? `Unsave ${word.term}` : `Save ${word.term}`} accessibilityState={{ selected: saved }} disabled={!ready} onPress={() => toggleSaved(word.id)} style={styles.iconButton}><Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} color={saved ? colors.primary : colors.textMuted} size={21} /></Pressable></View>
        <Text style={styles.meaningLabel}>MEANING</Text><Text style={styles.meaning}>{word.translation}</Text>
        <View style={styles.example}><Text style={styles.exampleLabel}>Example</Text><Text style={styles.exampleText}>{word.exampleSentence || 'An example has not been published for this word yet.'}</Text>{word.exampleTranslation && <><Pressable accessibilityRole="button" accessibilityLabel={`${translations.includes(word.id) ? 'Hide' : 'Show'} example translation for ${word.term}`} onPress={() => setTranslations(values => values.includes(word.id) ? values.filter(id => id !== word.id) : [...values, word.id])} style={styles.translationButton}><Text style={styles.translationButtonText}>{translations.includes(word.id) ? 'Hide translation' : 'Show translation'}</Text></Pressable>{translations.includes(word.id) && <Text style={styles.translation}>{word.exampleTranslation}</Text>}</>}</View>
        <View style={styles.actions}><Pressable accessibilityRole="button" accessibilityLabel={`Listen to ${word.term}`} onPress={() => { void speak(word.id, word.term); }} style={styles.audioButton}><Ionicons name={speaking === word.id ? 'stop-circle-outline' : 'volume-high-outline'} size={19} color={colors.primary} /><Text style={styles.audioLabel}>{speaking === word.id ? 'Stop audio' : 'Listen'}</Text></Pressable><LessonButton secondary={done} label={done ? 'Studied' : 'Mark as studied'} icon={done ? 'checkmark-circle' : 'checkmark-outline'} disabled={!ready || done} onPress={() => markLessonStep(lesson.id, `word:${word.id}`, required, word.id)} /></View>
      </View></Reveal>;
    })}</View>
    {pages > 1 && pagination}
  </View>;
}

const styles = StyleSheet.create({
  listHeading: { marginTop: 26, marginBottom: 17, gap: 7 }, wordRange: { fontSize: 10, fontWeight: '800', color: colors.textSecondary, letterSpacing: 1 }, hint: { fontSize: 12, lineHeight: 19, color: colors.textMuted },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginVertical: 18 }, pageText: { fontSize: 11, color: colors.textSecondary },
  wordCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 22 }, studiedCard: { borderColor: '#B9DBCD' },
  wordTop: { flexDirection: 'row', alignItems: 'center', gap: 13 }, wordNumber: { fontSize: 11, fontWeight: '800', color: colors.textMuted, alignSelf: 'flex-start', marginTop: 7 },
  term: { color: colors.text, fontSize: 27, lineHeight: 35, fontWeight: '800', letterSpacing: -.6 }, ipa: { fontSize: 12, lineHeight: 20, color: colors.textSecondary, marginTop: 3 },
  iconButton: { width: 42, height: 44, alignItems: 'center', justifyContent: 'center' }, meaningLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: colors.textMuted, marginTop: 22, marginBottom: 7 }, meaning: { fontSize: 16, lineHeight: 25, fontWeight: '600', color: colors.text },
  example: { backgroundColor: colors.surfaceAlt, padding: 17, borderRadius: 13, marginTop: 17 }, exampleLabel: { fontSize: 10, fontWeight: '800', color: colors.textMuted, marginBottom: 8 }, exampleText: { fontSize: 15, lineHeight: 24, color: colors.text },
  translationButton: { alignSelf: 'flex-start', minHeight: 36, justifyContent: 'center', marginTop: 3 }, translationButtonText: { fontSize: 11, fontWeight: '700', color: colors.primary }, translation: { fontSize: 13, lineHeight: 21, color: colors.textSecondary, marginTop: 3 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 19 }, audioButton: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 10, paddingRight: 15, minHeight: 44 }, audioLabel: { color: colors.primary, fontSize: 13, fontWeight: '700' },
});
