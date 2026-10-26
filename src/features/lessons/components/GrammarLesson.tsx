import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { useLearning } from '@/contexts/LearningContext';
import type { GrammarPoint } from '../data/grammar';
import type { CatalogLesson } from '../types';
import { lessonSteps } from '../data/catalog';
import { useLessonSpeech } from '../hooks/useLessonSpeech';
import { LessonButton, Notice, Reveal } from './LessonUI';

const parts = [{ id: 'rule', title: 'The rule' }, { id: 'examples', title: 'Examples' }, { id: 'mistakes', title: 'Common mistakes' }] as const;
export function GrammarLesson({ lesson, points, onSectionChange }: { lesson: CatalogLesson; points: GrammarPoint[]; onSectionChange(): void }) {
  const { state, ready, markLessonStep } = useLearning();
  const lastStep = state.lessonProgress?.[lesson.id]?.lastStepId || '';
  const [pointIndex, setPointIndex] = useState(() => Math.max(0, points.findIndex(point => lastStep.startsWith(`grammar:${point.id}:`))));
  const [partIndex, setPartIndex] = useState(0);
  const { speaking, audioError, speak } = useLessonSpeech();
  const point = points[pointIndex], part = parts[partIndex];
  if (!point) return null;
  const stepId = `grammar:${point.id}:${part.id}`;
  const done = state.completedLessonIds.includes(lesson.id) || state.lessonProgress?.[lesson.id]?.completedSteps.includes(stepId);
  const changePart = (next: number) => { setPartIndex(next); onSectionChange(); };
  return <View style={styles.wrap}>
    {points.length > 1 && <View style={styles.points}><LessonButton secondary label="Previous point" disabled={pointIndex === 0} onPress={() => { setPointIndex(value => value - 1); changePart(0); }} /><Text style={styles.counter}>Point {pointIndex + 1} / {points.length}</Text><LessonButton secondary label="Next point" disabled={pointIndex === points.length - 1} onPress={() => { setPointIndex(value => value + 1); changePart(0); }} /></View>}
    <View style={styles.tabs}>{parts.map((item, index) => {
      const read = state.completedLessonIds.includes(lesson.id) || state.lessonProgress?.[lesson.id]?.completedSteps.includes(`grammar:${point.id}:${item.id}`);
      return <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: partIndex === index }} accessibilityLabel={`${item.title}${read ? ', studied' : ''}`} onPress={() => changePart(index)} style={[styles.tab, partIndex === index && styles.activeTab]}><Ionicons name={read ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={read ? colors.success : partIndex === index ? colors.primary : colors.textMuted} /><Text style={[styles.tabText, partIndex === index && { color: colors.primary }]}>{item.title}</Text></Pressable>;
    })}</View>
    {audioError && <Notice text={audioError} />}
    <Reveal key={`${point.id}:${part.id}`}><View style={styles.paper}>
      <Text style={styles.kicker}>{point.category.toUpperCase()} · {point.level}</Text><Text style={styles.title}>{point.title}</Text>
      {part.id === 'rule' && <><Text style={styles.label}>PATTERN</Text><View style={styles.pattern}><Text style={styles.patternText}>{point.pattern}</Text></View><Text style={styles.label}>EXPLANATION</Text><Text style={styles.explanation}>{point.explanation}</Text></>}
      {part.id === 'examples' && <><Text style={styles.sectionLead}>Read the examples and listen to how the pattern is used.</Text>{point.examples.map((example, index) => <View key={`${point.id}:${index}`} style={styles.example}><View style={{ flex: 1 }}><Text style={styles.exampleText}>{example}</Text>{point.exampleTranslations[index] && <Text style={styles.translation}>{point.exampleTranslations[index]}</Text>}</View><Pressable accessibilityRole="button" accessibilityLabel={`Listen to example ${index + 1}`} onPress={() => { void speak(`${point.id}:${index}`, example); }} style={styles.listen}><Ionicons name={speaking === `${point.id}:${index}` ? 'stop-circle-outline' : 'volume-high-outline'} size={22} color={colors.primary} /></Pressable></View>)}</>}
      {part.id === 'mistakes' && <><Text style={styles.sectionLead}>Notice what changes between these two sentences.</Text><View style={[styles.mistake, { backgroundColor: colors.errorSoft }]}><Text style={[styles.mistakeLabel, { color: colors.error }]}>AVOID</Text><Text style={styles.exampleText}>{point.commonMistake.incorrect}</Text></View><View style={[styles.mistake, { backgroundColor: colors.successSoft }]}><Text style={[styles.mistakeLabel, { color: colors.success }]}>USE THIS</Text><Text style={styles.exampleText}>{point.commonMistake.correct}</Text></View><Text style={styles.explanation}>{point.commonMistake.explanation}</Text></>}
      <View style={styles.bottom}><Text style={styles.bottomHint}>Marking this section as read updates your lesson progress.</Text><LessonButton label={done ? 'Section studied' : 'Mark section as read'} secondary={!!done} disabled={!ready || !!done} icon={done ? 'checkmark-circle' : 'checkmark-outline'} onPress={() => {
        markLessonStep(lesson.id, stepId, lessonSteps(lesson));
        if (partIndex < 2) changePart(partIndex + 1);
        else if (pointIndex < points.length - 1) { setPointIndex(value => value + 1); changePart(0); }
      }} /></View>
    </View></Reveal>
  </View>;
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24 }, tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 17 }, tab: { flexDirection: 'row', gap: 7, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 11, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white }, activeTab: { backgroundColor: colors.primarySoft, borderColor: '#EAB4C0' }, tabText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  paper: { padding: 25, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white }, kicker: { color: colors.violet, fontSize: 9, lineHeight: 16, letterSpacing: .8, fontWeight: '800' }, title: { color: colors.text, fontWeight: '800', fontSize: 23, lineHeight: 32, marginTop: 7, marginBottom: 23 },
  label: { color: colors.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: .9, marginBottom: 11 }, pattern: { padding: 20, backgroundColor: colors.violetSoft, borderRadius: 13, marginBottom: 26 }, patternText: { color: '#5547A3', fontSize: 18, lineHeight: 29, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }, explanation: { color: colors.textSecondary, fontSize: 15, lineHeight: 26 }, sectionLead: { color: colors.textSecondary, fontSize: 14, lineHeight: 23, marginBottom: 17 },
  example: { borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 20, flexDirection: 'row', alignItems: 'center', gap: 13 }, exampleText: { fontSize: 17, color: colors.text, lineHeight: 27, fontWeight: '600' }, translation: { color: colors.textSecondary, fontSize: 13, lineHeight: 22, marginTop: 7 }, listen: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, mistake: { padding: 18, borderRadius: 13, marginBottom: 15 }, mistakeLabel: { fontSize: 9, letterSpacing: 1, fontWeight: '800', marginBottom: 9 },
  bottom: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 26, paddingTop: 22, gap: 13 }, bottomHint: { color: colors.textMuted, fontSize: 12, lineHeight: 19 }, points: { gap: 10, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 17 }, counter: { color: colors.textSecondary, fontSize: 12 },
});
