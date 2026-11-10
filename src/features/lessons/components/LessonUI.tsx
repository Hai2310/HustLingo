import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { useLearning } from '@/contexts/LearningContext';
import { lessonStats } from '../data/catalog';
import { useReducedLessonMotion } from '../hooks/useReducedLessonMotion';
import type { CatalogLesson, LessonKind, LessonLevel, LessonTopic } from '../types';
import { LESSON_LEVELS } from '../data/catalog';

export function Reveal({ children }: { children: React.ReactNode }) {
  const reduced = useReducedLessonMotion(), opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reduced) { opacity.setValue(1); return; }
    opacity.setValue(0.4);
    const animation = Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true });
    animation.start(); return () => animation.stop();
  }, [opacity, reduced]);
  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}

export function ProgressBar({ percent, label }: { percent: number; label: string }) {
  return <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: 100, now: percent }} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} style={ui.track}><View style={[ui.fill, { width: `${Math.max(0, Math.min(100, percent))}%` }, percent === 100 && { backgroundColor: colors.success }]} /></View>;
}

export function LessonButton({ label, onPress, secondary = false, disabled = false, icon }: { label: string; onPress(): void; secondary?: boolean; disabled?: boolean; icon?: keyof typeof Ionicons.glyphMap }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress} style={({ pressed }) => [ui.button, secondary && ui.buttonSecondary, disabled && { opacity: .45 }, pressed && !disabled && { opacity: .8 }]}>{icon && <Ionicons name={icon} size={18} color={secondary ? colors.text : colors.white} />}<Text style={[ui.buttonText, secondary && { color: colors.text }]}>{label}</Text></Pressable>;
}

export function LessonState({ kind, title, description, action, onAction }: { kind: 'loading' | 'empty' | 'error'; title: string; description: string; action?: string; onAction?: () => void }) {
  return <View style={ui.state} accessibilityLiveRegion="polite">{kind === 'loading' ? <ActivityIndicator color={colors.primary} size="large" /> : <View style={ui.stateIcon}><Ionicons name={kind === 'error' ? 'cloud-offline-outline' : 'book-outline'} size={32} color={colors.primary} /></View>}<Text style={ui.stateTitle}>{title}</Text><Text style={ui.stateDescription}>{description}</Text>{action && onAction && <LessonButton label={action} onPress={onAction} />}</View>;
}

export function Notice({ text, retry, busy }: { text: string; retry?: () => void; busy?: boolean }) {
  return <View style={ui.notice}><Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} /><Text style={ui.noticeText}>{text}</Text>{retry && <Pressable accessibilityRole="button" disabled={busy} onPress={retry} style={ui.retry}><Text style={ui.retryText}>{busy ? 'Loading…' : 'Retry'}</Text></Pressable>}</View>;
}

export function SyncLabel() {
  const { syncStatus, syncNow, ready } = useLearning();
  const labels = { loading: 'Loading progress', local: 'Saved on this device', syncing: 'Syncing progress', synced: 'Progress synced', error: 'Save needs attention' };
  return <Pressable accessibilityRole="button" accessibilityLabel={`${labels[syncStatus]}. Retry saving progress`} disabled={!ready || syncStatus === 'syncing'} onPress={() => { void syncNow().catch(() => {}); }} style={ui.sync}><Ionicons name={syncStatus === 'error' ? 'alert-circle-outline' : syncStatus === 'local' ? 'phone-portrait-outline' : 'cloud-outline'} size={15} color={syncStatus === 'error' ? colors.error : colors.textSecondary} /><Text style={[ui.syncText, syncStatus === 'error' && { color: colors.error }]}>{labels[syncStatus]}{syncStatus === 'error' ? ' · Retry' : ''}</Text></Pressable>;
}

export function LessonBack({ fallback = '/(tabs)/lessons', label = 'Lessons' }: { fallback?: '/(tabs)/lessons'; label?: string }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Back to ${label}`} onPress={() => { if (router.canGoBack()) router.back(); else router.replace(fallback); }} style={ui.back}><Ionicons name="arrow-back" color={colors.text} size={19} /><Text style={ui.backText}>{label}</Text></Pressable>;
}

export function LevelFilter({ value, onChange }: { value: LessonLevel | 'all'; onChange(value: LessonLevel | 'all'): void }) {
  return <View style={ui.chips} accessibilityLabel="Filter by CEFR level">{(['all', ...LESSON_LEVELS] as const).map(level => <Pressable key={level} accessibilityRole="button" accessibilityLabel={level === 'all' ? 'All levels' : `Level ${level}`} accessibilityState={{ selected: value === level }} onPress={() => onChange(level)} style={[ui.chip, value === level && ui.selectedChip]}><Text style={[ui.chipText, value === level && ui.selectedChipText]}>{level === 'all' ? 'All levels' : level}</Text></Pressable>)}</View>;
}

export function KindFilter({ value, onChange }: { value: LessonKind | 'all'; onChange(value: LessonKind | 'all'): void }) {
  return <View style={ui.kindRow}>{(['all', 'vocabulary', 'grammar'] as const).map(kind => <Pressable key={kind} accessibilityRole="button" accessibilityLabel={kind === 'all' ? 'All lesson types' : `${kind} lessons`} accessibilityState={{ selected: kind === value }} onPress={() => onChange(kind)} style={[ui.kind, value === kind && ui.kindSelected]}><Text style={[ui.kindText, value === kind && { color: colors.primary }]}>{kind === 'all' ? 'All lessons' : kind === 'vocabulary' ? 'Vocabulary' : 'Grammar'}</Text></Pressable>)}</View>;
}

export function LessonSearch({ value, onChange }: { value: string; onChange(value: string): void }) {
  return <View style={ui.search}><Ionicons name="search-outline" size={20} color={colors.textMuted} /><TextInput accessibilityLabel="Search lessons" value={value} onChangeText={onChange} placeholder="Search lessons or topics" placeholderTextColor={colors.textMuted} autoCapitalize="none" style={ui.searchInput} />{value.length > 0 && <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => onChange('')}><Ionicons name="close-circle" size={20} color={colors.textMuted} /></Pressable>}</View>;
}

export function LessonCard({ lesson, topic }: { lesson: CatalogLesson; topic?: LessonTopic }) {
  const { state, ready } = useLearning(), stats = lessonStats(lesson, state);
  return <Pressable accessibilityRole="button" accessibilityLabel={`${lesson.title}, ${lesson.level}, ${stats.percent}% complete`} onPress={() => router.push({ pathname: '/lessons/[lessonId]', params: { lessonId: lesson.id } })} style={({ pressed }) => [ui.lessonCard, pressed && { opacity: .85 }]}><View style={ui.lessonTop}><View style={[ui.lessonIcon, { backgroundColor: lesson.kind === 'grammar' ? colors.violetSoft : colors.blueSoft }]}><Ionicons name={lesson.kind === 'grammar' ? 'library-outline' : 'text-outline'} size={22} color={lesson.kind === 'grammar' ? colors.violet : colors.blue} /></View><View style={{ flex: 1 }}><Text style={ui.lessonKicker}>{lesson.kind === 'grammar' ? 'GRAMMAR' : topic?.title.toUpperCase() || 'VOCABULARY'} · {lesson.level}</Text><Text style={ui.lessonTitle}>{lesson.title}</Text></View><Ionicons name={stats.complete ? 'checkmark-circle' : 'arrow-forward'} size={23} color={stats.complete ? colors.success : colors.textMuted} /></View><Text style={ui.lessonMeta}>{lesson.kind === 'grammar' ? `${lesson.grammarIds.length} grammar point${lesson.grammarIds.length === 1 ? '' : 's'} · rule, examples & common mistakes` : `${lesson.vocabularyIds.length} words · pronunciation & examples`}</Text><View style={ui.progressLabel}><Text style={[ui.progressText, stats.complete && { color: colors.success }]}>{!ready ? 'Loading progress…' : stats.complete ? 'Completed' : stats.done ? 'In progress' : 'Not started'}</Text><Text style={ui.progressText}>{stats.percent}%</Text></View><ProgressBar percent={stats.percent} label={`${lesson.title} progress`} /></Pressable>;
}

export const ui = StyleSheet.create({
  content: { paddingTop: 24, paddingBottom: 20 },
  kicker: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.6, marginBottom: 9 },
  heading: { fontSize: 34, lineHeight: 42, fontWeight: '800', color: colors.text, letterSpacing: -1.1 },
  description: { color: colors.textSecondary, fontSize: 14, lineHeight: 22, marginTop: 7 },
  sectionHeading: { fontSize: 21, fontWeight: '800', color: colors.text, letterSpacing: -.45 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 28, marginBottom: 16 },
  track: { height: 5, backgroundColor: '#EEE8E4', borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99, backgroundColor: colors.primary },
  button: { minHeight: 46, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonSecondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderStrong },
  buttonText: { fontSize: 14, fontWeight: '700', color: colors.white, textAlign: 'center' },
  state: { minHeight: 230, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 14, backgroundColor: colors.white, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginTop: 20 },
  stateIcon: { width: 62, height: 62, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  stateTitle: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center' },
  stateDescription: { fontSize: 14, lineHeight: 22, color: colors.textSecondary, maxWidth: 430, textAlign: 'center' },
  notice: { backgroundColor: '#FFF3DF', padding: 13, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 16 },
  noticeText: { flex: 1, color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  retry: { padding: 8 }, retryText: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  sync: { flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 36 }, syncText: { fontSize: 11, color: colors.textSecondary },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', minHeight: 44, marginBottom: 18 },
  backText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minWidth: 45, minHeight: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 9, backgroundColor: colors.white, borderRadius: 11, borderWidth: 1, borderColor: colors.border },
  selectedChip: { backgroundColor: colors.primary, borderColor: colors.primary }, chipText: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' }, selectedChipText: { color: colors.white },
  kindRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 22, borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: 20 },
  kind: { paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' }, kindSelected: { borderBottomColor: colors.primary }, kindText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, minHeight: 46, marginBottom: 17 },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, minHeight: 46, paddingVertical: 10 },
  lessonCard: { backgroundColor: colors.white, borderRadius: 17, borderWidth: 1, borderColor: colors.border, padding: 20 },
  lessonTop: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  lessonIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  lessonKicker: { color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: .7, marginBottom: 5 },
  lessonTitle: { fontSize: 17, fontWeight: '700', color: colors.text, lineHeight: 24 },
  lessonMeta: { color: colors.textSecondary, fontSize: 12, lineHeight: 19, marginTop: 15, marginBottom: 15 },
  progressLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }, progressText: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
});
