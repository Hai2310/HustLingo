import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, type Href } from 'expo-router';
import { cosmic, moduleSpectra } from '@/theme/cosmic';

const skills: ReadonlyArray<{
  module: keyof typeof moduleSpectra;
  label: string;
  path: Href;
  art: ImageSourcePropType;
}> = [
  { module: 'vocabulary', label: 'Từ vựng', path: '/vocabulary', art: require('../../../assets/illustrations/cosmic/skills/vocabulary.webp') },
  { module: 'grammar', label: 'Ngữ pháp', path: '/grammar', art: require('../../../assets/illustrations/cosmic/skills/grammar.webp') },
  { module: 'listening', label: 'Luyện nghe', path: '/listening', art: require('../../../assets/illustrations/cosmic/skills/listening.webp') },
  { module: 'speaking', label: 'Luyện nói', path: '/speaking', art: require('../../../assets/illustrations/cosmic/skills/speaking.webp') },
  { module: 'reading', label: 'Luyện đọc', path: '/reading', art: require('../../../assets/illustrations/cosmic/skills/reading.webp') },
  { module: 'writing', label: 'Luyện viết', path: '/writing', art: require('../../../assets/illustrations/cosmic/skills/writing.webp') },
];

export function HomeSkills({ compact }: { compact: boolean }) {
  return (
    <View nativeID="home-skills" style={styles.section}>
      <View style={styles.header}>
        <Text accessibilityRole="header" aria-level={2} style={styles.heading}>Khám phá kỹ năng</Text>
        <Ionicons aria-hidden name="sparkles" size={19} color={cosmic.ice} />
      </View>
      <View style={[styles.grid, compact && styles.gridCompact]}>
        {skills.map(({ module, label, path, art }) => {
          const spectrum = moduleSpectra[module];
          return (
            <Link key={module} href={path} style={[styles.card, compact && styles.cardCompact, { borderColor: spectrum.edge }]} asChild>
              <Pressable accessibilityRole="link" accessibilityLabel={label} nativeID={`home-skill-card-${module}`}>
                {({ pressed }) => (
                  <LinearGradient
                    colors={spectrum.gradient}
                    start={{ x: 0.82, y: 0 }} end={{ x: 0.25, y: 1 }}
                    style={[styles.face, compact && styles.faceCompact, pressed && styles.pressed]}
                  >
                    <View pointerEvents="none" aria-hidden nativeID={`home-skill-light-${module}`} style={[StyleSheet.absoluteFill, Platform.OS === 'web'
                      ? { backgroundColor: spectrum.main }
                      : { experimental_backgroundImage: `radial-gradient(ellipse farthest-corner at 80% 26%, ${spectrum.main}53 0%, ${spectrum.main}23 31%, transparent 70%)` }]}
                    />
                    <View pointerEvents="none" aria-hidden style={[styles.decor, compact && styles.decorCompact]}>
                      <View nativeID={`home-skill-orbit-${module}`} style={[styles.orbit, { borderColor: `${spectrum.main}45`, backgroundColor: `${spectrum.main}14` }]}>
                        <View style={[styles.innerOrbit, { borderColor: `${spectrum.main}37` }]} />
                      </View>
                      <Image nativeID={`home-skill-art-${module}`} source={art} resizeMode="contain" accessible={false} style={styles.art} />
                    </View>
                    <Ionicons aria-hidden name="sparkles-outline" size={16} color={spectrum.main} style={styles.star} />
                    <View style={styles.footer}>
                      <View style={styles.copy}>
                        <Text aria-hidden style={[styles.english, { color: spectrum.main }]}>{module.toUpperCase()}</Text>
                        <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
                      </View>
                      <Ionicons aria-hidden name="arrow-up-outline" size={18} color={spectrum.main} style={styles.arrow} />
                    </View>
                  </LinearGradient>
                )}
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 13 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  heading: { color: cosmic.text, fontSize: 23, lineHeight: 29, fontWeight: '700', letterSpacing: -0.35, flexShrink: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  gridCompact: { gap: 10 },
  card: { flexBasis: '31%', flexGrow: 1, minWidth: 0, borderWidth: 1, borderBottomWidth: 4, borderRadius: 21, overflow: 'hidden', backgroundColor: cosmic.panel },
  cardCompact: { flexBasis: '45%', borderRadius: 17 },
  face: { flex: 1, minHeight: 178, paddingTop: 109, paddingHorizontal: 17, paddingBottom: 15, justifyContent: 'flex-end' },
  faceCompact: { minHeight: 138, paddingTop: 78, paddingHorizontal: 11, paddingBottom: 11 },
  pressed: { opacity: 0.82 },
  decor: { position: 'absolute', width: 176, height: 176, top: -38, right: -17, alignItems: 'center', justifyContent: 'center' },
  decorCompact: { width: 114, height: 114, top: -20, right: -10 },
  orbit: { ...StyleSheet.absoluteFillObject, borderWidth: 2, borderRadius: 300 },
  innerOrbit: { ...StyleSheet.absoluteFillObject, margin: '11%', borderRadius: 300, borderWidth: 1 },
  art: { width: '69%', height: '69%', marginTop: '22%', marginRight: '12%' },
  star: { position: 'absolute', top: 13, left: 13 },
  footer: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  copy: { flex: 1, minWidth: 0, gap: 4 },
  english: { fontSize: 12, fontWeight: '500', letterSpacing: .65 },
  label: { color: cosmic.text, fontSize: 18, lineHeight: 24, fontWeight: '700', letterSpacing: -0.15 },
  labelCompact: { fontSize: 16, lineHeight: 20, letterSpacing: -0.2 },
  arrow: { marginBottom: 2, transform: [{ rotate: '45deg' }] },
});
