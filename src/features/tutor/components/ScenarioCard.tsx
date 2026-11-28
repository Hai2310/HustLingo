import { getLevelLabel } from '@/utils/levelLabels';
import React from 'react';
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { cosmic } from '@/theme/cosmic';
import { cosmicTopicArt, orbitalLibrary } from '@/theme/cosmicArt';
import { AppCard } from '@/components/common/AppCard';
import { getVocabularyArtwork } from '@/features/lessons/data/vocabulary-artwork';
import type { TutorScenario } from '../types';

export function ScenarioCard({
  scenario,
  onPress,
  compact = false,
  illustrated = false,
  style,
}: {
  scenario: TutorScenario;
  onPress: () => void;
  compact?: boolean;
  illustrated?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const topics: Record<string, string> = { coffee: 'food', university: 'education', travel: 'travel', interview: 'workplace', presentation: 'workplace', meeting: 'workplace' };
  const subject = topics[scenario.id] ?? scenario.topicIds?.[0];
  const art = subject ? cosmicTopicArt[subject] ?? getVocabularyArtwork(subject).image : orbitalLibrary;
  return (
    <AppCard onPress={onPress} style={[styles.card, compact && styles.compact, illustrated && styles.illustrated, style]}>
      {illustrated ? (
        <View style={styles.art}>
          <Image source={art} style={styles.image} resizeMode="cover" accessible={false} />
          <LinearGradient colors={['#0c122200', cosmic.panel]} style={StyleSheet.absoluteFill} />
          <View style={styles.artIcon}><Ionicons aria-hidden name={(scenario.icon || 'chatbubbles-outline') as keyof typeof Ionicons.glyphMap} size={20} color={cosmic.ice} /></View>
        </View>
      ) : <View style={styles.icon}><Ionicons name={(scenario.icon || 'chatbubbles-outline') as keyof typeof Ionicons.glyphMap} size={21} color={colors.primary} /></View>}
      <View style={[styles.copy, illustrated && styles.illustratedCopy]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{scenario.title}</Text>
          <View style={styles.level}><Text style={styles.levelText}>{getLevelLabel(scenario.level)}</Text></View>
        </View>
        <Text style={styles.subtitle}>{scenario.subtitle}</Text>
        <Text style={styles.tutor}>{scenario.tutor} · {scenario.topicIds?.slice(0, 2).join(' · ')}</Text>
      </View>
      {!illustrated && <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { width: 238, minHeight: 126, padding: 14, marginRight: 11, flexDirection: 'column', alignItems: 'flex-start' },
  compact: { width: '100%', minHeight: 78, marginRight: 0, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11 },
  illustrated: { width: '100%', marginRight: 0, padding: 0, overflow: 'hidden', borderRadius: 22 },
  art: { width: '100%', height: 127, backgroundColor: cosmic.panel },
  image: { width: '100%', height: '100%' },
  artIcon: { position: 'absolute', left: 12, bottom: 7, width: 36, height: 36, borderRadius: 12, borderWidth: 1, borderColor: cosmic.iceEdge, backgroundColor: cosmic.iceSurface, justifyContent: 'center', alignItems: 'center' },
  illustratedCopy: { paddingHorizontal: 13, paddingTop: 5, paddingBottom: 15, minHeight: 92 },
  icon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  copy: { flex: 1, width: '100%' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  level: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: colors.surfaceAlt },
  levelText: { fontSize: 8.5, fontWeight: '900', color: colors.textSecondary },
  title: { flex: 1, fontSize: 15, fontWeight: '900', color: colors.text },
  subtitle: { marginTop: 4, fontSize: 10.5, lineHeight: 16, color: colors.textSecondary },
  tutor: { marginTop: 8, fontSize: 9.5, fontWeight: '700', color: colors.textMuted },
});
