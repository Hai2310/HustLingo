import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { learningTopics } from '@/data/content';
import { cosmic, glassCard } from '@/theme/cosmic';
import { getLevelLabel } from '@/utils/levelLabels';

type TopicLook = { image: ImageSourcePropType; accent: string; edge: string; surface: string };
const topicLooks: Partial<Record<(typeof learningTopics)[number]['id'], TopicLook>> = {
  'daily-life': { image: require('../../../assets/illustrations/cosmic/destinations/daily-life.webp'), accent: '#ffd2bb', edge: '#a57588', surface: '#2a203d' },
  technology: { image: require('../../../assets/illustrations/cosmic/destinations/technology.webp'), accent: cosmic.violet, edge: '#8176bd', surface: '#251f45' },
  travel: { image: require('../../../assets/illustrations/cosmic/destinations/travel.webp'), accent: cosmic.ice, edge: '#548da4', surface: '#182d43' },
};

export function HomeTopics({ wide, width }: { wide: boolean; width: number }) {
  return (
    <View nativeID="home-destinations" style={styles.section}>
      <View style={styles.headingRow}>
        <Text accessibilityRole="header" aria-level={2} style={styles.heading}>Chủ đề đề xuất</Text>
        <Link href="/(tabs)/lessons" style={styles.libraryLink} asChild>
          <Pressable accessibilityRole="link">
            <Text style={styles.libraryLabel}>Xem tất cả</Text>
            <Ionicons aria-hidden name="arrow-forward" size={16} color={cosmic.ice} />
          </Pressable>
        </Link>
      </View>

      <View style={[styles.grid, wide && styles.gridWide]}>
        {learningTopics.map(topic => {
          const look = topicLooks[topic.id];
          if (!look) return null;
          const level = getLevelLabel(topic.level);

          return (
            <Link key={topic.id} href={{ pathname: '/vocabulary', params: { topic: topic.title } }}
              style={[styles.card, wide ? styles.cardWide : styles.cardStacked, { borderColor: look.edge }]} asChild>
              <Pressable nativeID={`home-topic-${topic.id}`} accessibilityRole="link" accessibilityLabel={`Khám phá ${topic.title}, ${level}. ${topic.subtitle}`}>
                <View nativeID={`topic-destination-cover-${topic.id}`} style={styles.cover} pointerEvents="none" aria-hidden>
                  <Image nativeID={`topic-destination-art-${topic.id}`} source={look.image} style={styles.art} resizeMode="cover" accessible={false} />
                  <LinearGradient colors={['transparent', `${look.surface}40`, look.surface]} style={styles.artShade} />
                </View>
                <LinearGradient colors={[look.surface, cosmic.panel]} style={[styles.details, wide && width < 970 && styles.detailsCompact, !wide && width >= 420 && styles.detailsRoomy]}>
                  <View style={styles.copy}>
                    <Text style={[styles.level, { color: look.accent }]}>{level}</Text>
                    <Text style={styles.title}>{topic.title}</Text>
                    <Text style={styles.description}>{topic.subtitle}</Text>
                  </View>
                  <View aria-hidden style={[styles.arrow, { borderColor: `${look.accent}62`, backgroundColor: `${look.accent}19` }]}>
                    <Ionicons name="arrow-forward" size={18} color={look.accent} />
                  </View>
                </LinearGradient>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 11 },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  heading: { color: cosmic.text, fontSize: 23, lineHeight: 29, fontWeight: '700', letterSpacing: -0.35 },
  libraryLink: { flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 44, paddingHorizontal: 8, borderRadius: 10 },
  libraryLabel: { color: cosmic.ice, fontSize: 14, fontWeight: '600' },
  grid: { gap: 14 },
  gridWide: { flexDirection: 'row', alignItems: 'stretch' },
  card: { ...glassCard, overflow: 'hidden' },
  cardStacked: { maxWidth: 455, width: '100%', alignSelf: 'center' },
  cardWide: { flex: 1, minWidth: 0 },
  cover: { width: '100%', aspectRatio: 16 / 9, overflow: 'hidden', backgroundColor: cosmic.violetSurface },
  art: { width: '100%', height: '100%' },
  artShade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '36%' },
  details: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, minHeight: 110 },
  detailsCompact: { paddingVertical: 9, paddingHorizontal: 11, minHeight: 96 },
  detailsRoomy: { minHeight: 140 },
  copy: { flex: 1, minWidth: 0, gap: 3 },
  level: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  title: { color: cosmic.text, fontSize: 18, fontWeight: '700', lineHeight: 23 },
  description: { color: cosmic.muted, fontSize: 13, lineHeight: 18 },
  arrow: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
