import { getLevelLabel } from '@/utils/levelLabels';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { cosmic, gameButton, glassCard, moduleSpectra } from '@/theme/cosmic';
import { cosmicTopicArt, orbitalLibrary } from '@/theme/cosmicArt';
import { useLearning } from '@/contexts/LearningContext';
import type { CatalogLesson } from '../types';
import { lessonStats } from '../data/catalog';
import { getVocabularyArtwork } from '../data/vocabulary-artwork';
import { ProgressBar, SyncLabel } from './LessonUI';

export function VocabularyTopicCover({ topicId }: { topicId: string }) {
  const art = getVocabularyArtwork(topicId);
  return <View style={styles.topicCover}>
    <Image source={cosmicTopicArt[topicId] ?? art.image} resizeMode="cover" style={styles.topicImage} accessible={false} />
    <LinearGradient colors={['#080a1700', '#131a2faa']} style={StyleSheet.absoluteFill} pointerEvents="none" />
    <View style={styles.coverArrow}><Ionicons name="arrow-forward" size={17} color={colors.text} /></View>
  </View>;
}

export function VocabularyLibraryHero({ lesson, onStart }: { lesson: CatalogLesson; onStart(): void }) {
  const { state, ready } = useLearning(), { width } = useWindowDimensions();
  const stats = lessonStats(lesson, state);
  const compact = width < 760;
  return <LinearGradient nativeID="cosmic-module-vocabulary" colors={moduleSpectra.vocabulary.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    style={[styles.library, compact && styles.libraryMobile]}>
    <View accessible={false} aria-hidden pointerEvents="none" style={[styles.libraryArt, compact && styles.libraryArtMobile]}>
      <Image nativeID="cosmic-vocabulary-art" source={orbitalLibrary} resizeMode="cover" style={styles.fullImage} />
      <LinearGradient colors={['#16383e', '#162b3b9c', '#0c1a2b18']} locations={[0, .47, 1]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
    </View>
    <View style={styles.libraryCopy}>
      <Text style={[styles.libraryTitle, compact && styles.libraryTitleMobile]}>Small words.{ '\n' }Big possibilities.</Text>
      <Text style={styles.libraryDescription}>Discover useful English through pictures, pronunciation and everyday examples.</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`${stats.done ? 'Continue' : 'Start'} ${lesson.title}`} onPress={onStart} style={styles.continueCard}>
        <View style={styles.continueIcon}><Ionicons name="play" size={17} color={colors.primary} /></View>
        <View style={{ flex: 1 }}><Text style={styles.continueKicker}>{stats.done ? 'PICK UP WHERE YOU LEFT OFF' : 'YOUR NEXT LESSON'}</Text><Text style={styles.continueTitle}>{lesson.title}</Text><Text style={styles.continueMeta}>{getLevelLabel(lesson.level)} · {lesson.vocabularyIds.length} words{stats.done ? ` · ${stats.percent}% complete` : ''}</Text></View>
        <Ionicons name="arrow-forward" size={20} color={colors.primary} />
      </Pressable>
      <View style={styles.libraryStats}><View style={styles.statItem}><Ionicons name="checkmark-circle-outline" size={16} color={cosmic.mint} /><Text style={styles.statText}>{ready ? state.studiedWordIds.length : '—'} words studied</Text></View><View style={styles.statItem}><Ionicons name="bookmark-outline" size={15} color={colors.primary} /><Text style={styles.statText}>{ready ? state.savedWordIds.length : '—'} saved words</Text></View></View>
    </View>
  </LinearGradient>;
}

export function VocabularyLessonHeader({ lesson }: { lesson: CatalogLesson }) {
  const { state, ready } = useLearning(), { width } = useWindowDimensions();
  const art = getVocabularyArtwork(lesson.topicId), stats = lessonStats(lesson, state), compact = width < 760;
  return <View>
    <View style={styles.headerTop}><Text style={styles.eyebrow}>YOUR VOCABULARY JOURNEY</Text><SyncLabel /></View>
    <View style={[styles.lessonHero, compact && styles.lessonHeroMobile]}>
      <View style={[styles.lessonArt, compact && styles.lessonArtMobile]}><Image source={art.image} resizeMode="contain" style={styles.fullImage} accessible={false} /></View>
      <View style={[styles.lessonCopy, compact && { padding: 22 }]}>
        <View style={styles.badges}><View style={styles.badge}><Text style={styles.badgeText}>{art.label}</Text></View><View style={styles.levelBadge}><Text style={styles.levelText}>{getLevelLabel(lesson.level)}</Text></View><Text style={styles.wordCount}>{lesson.vocabularyIds.length} words</Text></View>
        <Text style={[styles.lessonTitle, compact && { fontSize: 28, lineHeight: 35 }]}>{lesson.title}</Text>
        <Text style={styles.lessonDescription}>A little practice today. More confidence tomorrow.</Text>
        <View style={styles.progressLabel}><Text style={styles.progressText}>{!ready ? 'Loading saved progress…' : stats.complete ? 'Lesson completed' : `${stats.done} of ${stats.total} study steps completed`}</Text><Text style={[styles.percent, stats.complete && { color: colors.success }]}>{stats.percent}%</Text></View>
        <ProgressBar percent={stats.percent} label="Lesson completion" />
        <View style={styles.studySteps}>{([['eye-outline', 'Explore'], ['volume-high-outline', 'Listen'], ['checkmark-circle-outline', 'Mark as studied']] as const).map(([icon, label]) => <View key={label} style={styles.studyStep}><Ionicons name={icon} size={14} color={colors.textMuted} /><Text style={styles.studyStepText}>{label}</Text></View>)}</View>
      </View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  topicCover: { height: 141, backgroundColor: cosmic.canvas, overflow: 'hidden' }, topicImage: { width: '100%', height: '100%' }, coverArrow: { position: 'absolute', right: 14, top: 14, width: 30, height: 30, borderRadius: 15, backgroundColor: cosmic.glass, alignItems: 'center', justifyContent: 'center' },
  library: { ...glassCard, marginTop: 17, borderRadius: 26, borderWidth: 1, borderColor: cosmic.mintEdge, overflow: 'hidden' }, libraryMobile: { marginTop: 13 },
  libraryCopy: { padding: 20, maxWidth: 475, width: '100%' }, eyebrow: { color: cosmic.mint, fontSize: 12, fontWeight: '800' },
  libraryTitleMobile: { fontSize: 29, lineHeight: 34 },
  libraryTitle: { color: colors.text, fontSize: 37, lineHeight: 44, fontWeight: '800', letterSpacing: -1.2 }, libraryDescription: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, maxWidth: 350, marginTop: 11 },
  continueCard: { ...gameButton, backgroundColor: cosmic.glass, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderWidth: 1, borderColor: cosmic.border, borderRadius: 16, marginTop: 23 }, continueIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }, continueKicker: { fontSize: 8, fontWeight: '800', letterSpacing: .8, color: colors.textMuted }, continueTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 5, lineHeight: 20 }, continueMeta: { fontSize: 10, color: colors.textMuted, marginTop: 4 },
  libraryStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 13, marginTop: 12 }, statItem: { flexDirection: 'row', alignItems: 'center', gap: 5 }, statText: { fontSize: 11, color: colors.textSecondary }, libraryArt: { position: 'absolute', inset: 0, left: '27%' }, libraryArtMobile: { left: '10%', opacity: .57 }, fullImage: { width: '100%', height: '100%', position: 'absolute' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 13 }, lessonHero: { ...glassCard, borderRadius: 24, borderWidth: 1, borderColor: cosmic.iceEdge, backgroundColor: cosmic.glass, flexDirection: 'row', overflow: 'hidden' }, lessonHeroMobile: { flexDirection: 'column' },
  lessonArt: { width: '39%', minHeight: 270, backgroundColor: cosmic.canvas }, lessonArtMobile: { width: '100%', minHeight: 0, height: 170 }, lessonCopy: { flex: 1, padding: 30 }, badges: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 15 }, badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 7, backgroundColor: cosmic.roseSurface }, badgeText: { color: cosmic.rose, fontSize: 12, fontWeight: '700' }, levelBadge: { backgroundColor: cosmic.iceSurface, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 7 }, levelText: { color: colors.text, fontSize: 11, fontWeight: '800' }, wordCount: { fontSize: 11, color: colors.textMuted, marginLeft: 3 },
  lessonTitle: { color: colors.text, fontSize: 32, lineHeight: 40, fontWeight: '800', letterSpacing: -.9 }, lessonDescription: { fontSize: 12, lineHeight: 20, color: colors.textSecondary, marginTop: 8 }, progressLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 24, marginBottom: 9 }, progressText: { color: colors.textSecondary, fontSize: 11, flex: 1, lineHeight: 18 }, percent: { fontSize: 17, fontWeight: '800', color: colors.primary }, studySteps: { flexDirection: 'row', flexWrap: 'wrap', gap: 13, marginTop: 16 }, studyStep: { flexDirection: 'row', alignItems: 'center', gap: 5 }, studyStepText: { color: colors.textMuted, fontSize: 10 },
});
