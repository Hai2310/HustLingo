import React from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { useLearning } from '@/contexts/LearningContext';
import type { CatalogLesson } from '../types';
import { lessonStats } from '../data/catalog';
import { getVocabularyArtwork } from '../data/vocabulary-artwork';
import { ProgressBar, SyncLabel } from './LessonUI';

export function VocabularyTopicCover({ topicId }: { topicId: string }) {
  const art = getVocabularyArtwork(topicId);
  return <View style={styles.topicCover}>
    <Image source={art.image} resizeMode="contain" style={styles.topicImage} accessible={false} />
    <View style={styles.coverArrow}><Ionicons name="arrow-forward" size={17} color={colors.text} /></View>
  </View>;
}

export function VocabularyLibraryHero({ lesson, onStart }: { lesson: CatalogLesson; onStart(): void }) {
  const { state, ready } = useLearning(), { width } = useWindowDimensions();
  const stats = lessonStats(lesson, state), art = getVocabularyArtwork();
  return <View style={[styles.library, width < 760 && styles.libraryMobile]}>
    <View style={styles.libraryCopy}>
      <View style={styles.eyebrowRow}><View style={styles.smallDot} /><Text style={styles.eyebrow}>WORDS FOR YOUR WORLD</Text></View>
      <Text style={styles.libraryTitle}>Small words.{ '\n' }Big possibilities.</Text>
      <Text style={styles.libraryDescription}>Discover useful English through pictures, pronunciation and everyday examples.</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`${stats.done ? 'Continue' : 'Start'} ${lesson.title}`} onPress={onStart} style={styles.continueCard}>
        <View style={styles.continueIcon}><Ionicons name="play" size={17} color={colors.primary} /></View>
        <View style={{ flex: 1 }}><Text style={styles.continueKicker}>{stats.done ? 'PICK UP WHERE YOU LEFT OFF' : 'YOUR NEXT LESSON'}</Text><Text style={styles.continueTitle}>{lesson.title}</Text><Text style={styles.continueMeta}>{lesson.level} · {lesson.vocabularyIds.length} words{stats.done ? ` · ${stats.percent}% complete` : ''}</Text></View>
        <Ionicons name="arrow-forward" size={20} color={colors.primary} />
      </Pressable>
      <View style={styles.libraryStats}><View style={styles.statItem}><Ionicons name="checkmark-circle-outline" size={16} color="#5D826C" /><Text style={styles.statText}>{ready ? state.studiedWordIds.length : '—'} words studied</Text></View><View style={styles.statItem}><Ionicons name="bookmark-outline" size={15} color={colors.primary} /><Text style={styles.statText}>{ready ? state.savedWordIds.length : '—'} saved words</Text></View></View>
    </View>
    <View style={[styles.libraryArt, width < 760 && styles.libraryArtMobile]}><Image source={art.image} resizeMode="contain" style={styles.fullImage} accessible={false} /><View style={styles.pictureNote}><Ionicons name="headset-outline" size={15} color={colors.primary} /><Text style={styles.pictureNoteText}>See it. Hear it. Remember it.</Text></View></View>
  </View>;
}

export function VocabularyLessonHeader({ lesson }: { lesson: CatalogLesson }) {
  const { state, ready } = useLearning(), { width } = useWindowDimensions();
  const art = getVocabularyArtwork(lesson.topicId), stats = lessonStats(lesson, state), compact = width < 760;
  return <View>
    <View style={styles.headerTop}><Text style={styles.eyebrow}>YOUR VOCABULARY JOURNEY</Text><SyncLabel /></View>
    <View style={[styles.lessonHero, compact && styles.lessonHeroMobile]}>
      <View style={[styles.lessonArt, compact && styles.lessonArtMobile]}><Image source={art.image} resizeMode="contain" style={styles.fullImage} accessible={false} /></View>
      <View style={[styles.lessonCopy, compact && { padding: 22 }]}>
        <View style={styles.badges}><View style={[styles.badge, { backgroundColor: art.wash }]}><Text style={[styles.badgeText, { color: art.color }]}>{art.label}</Text></View><View style={styles.levelBadge}><Text style={styles.levelText}>{lesson.level}</Text></View><Text style={styles.wordCount}>{lesson.vocabularyIds.length} words</Text></View>
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
  topicCover: { height: 150, backgroundColor: '#FFF4E6', overflow: 'hidden' }, topicImage: { width: '100%', height: '100%' }, coverArrow: { position: 'absolute', right: 14, top: 14, width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFFE8', alignItems: 'center', justifyContent: 'center' },
  library: { marginTop: 25, borderRadius: 24, borderWidth: 1, borderColor: '#EFDCCD', backgroundColor: '#FFF1E3', flexDirection: 'row', overflow: 'hidden' }, libraryMobile: { flexDirection: 'column-reverse' },
  libraryCopy: { flex: 1, padding: 28 }, eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 7 }, smallDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }, eyebrow: { color: colors.primary, fontSize: 9, fontWeight: '800', letterSpacing: 1.3 },
  libraryTitle: { color: colors.text, fontSize: 37, lineHeight: 44, fontWeight: '800', letterSpacing: -1.2, marginTop: 14 }, libraryDescription: { color: colors.textSecondary, fontSize: 13, lineHeight: 21, maxWidth: 350, marginTop: 11 },
  continueCard: { backgroundColor: '#FFFFFFD9', flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderWidth: 1, borderColor: '#F0DDD0', borderRadius: 16, marginTop: 23 }, continueIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }, continueKicker: { fontSize: 8, fontWeight: '800', letterSpacing: .8, color: colors.textMuted }, continueTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 5, lineHeight: 20 }, continueMeta: { fontSize: 10, color: colors.textMuted, marginTop: 4 },
  libraryStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 18 }, statItem: { flexDirection: 'row', alignItems: 'center', gap: 5 }, statText: { fontSize: 11, color: colors.textSecondary }, libraryArt: { width: '43%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF4E6', minHeight: 280 }, libraryArtMobile: { width: '100%', height: 195, minHeight: 0 }, fullImage: { width: '100%', height: '100%', position: 'absolute' },
  pictureNote: { position: 'absolute', bottom: 20, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: '#FFFFFFEA', borderRadius: 99, borderWidth: 1, borderColor: '#F0E0D2' }, pictureNoteText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 13 }, lessonHero: { borderRadius: 24, borderWidth: 1, borderColor: '#EEDDCF', backgroundColor: colors.white, flexDirection: 'row', overflow: 'hidden' }, lessonHeroMobile: { flexDirection: 'column' },
  lessonArt: { width: '39%', minHeight: 270, backgroundColor: '#FFF4E6' }, lessonArtMobile: { width: '100%', minHeight: 0, height: 170 }, lessonCopy: { flex: 1, padding: 30 }, badges: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 15 }, badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 7 }, badgeText: { fontSize: 10, fontWeight: '700' }, levelBadge: { backgroundColor: colors.charcoal, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 7 }, levelText: { color: colors.white, fontSize: 10, fontWeight: '800' }, wordCount: { fontSize: 11, color: colors.textMuted, marginLeft: 3 },
  lessonTitle: { color: colors.text, fontSize: 32, lineHeight: 40, fontWeight: '800', letterSpacing: -.9 }, lessonDescription: { fontSize: 12, lineHeight: 20, color: colors.textSecondary, marginTop: 8 }, progressLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 24, marginBottom: 9 }, progressText: { color: colors.textSecondary, fontSize: 11, flex: 1, lineHeight: 18 }, percent: { fontSize: 17, fontWeight: '800', color: colors.primary }, studySteps: { flexDirection: 'row', flexWrap: 'wrap', gap: 13, marginTop: 16 }, studyStep: { flexDirection: 'row', alignItems: 'center', gap: 5 }, studyStepText: { color: colors.textMuted, fontSize: 10 },
});
