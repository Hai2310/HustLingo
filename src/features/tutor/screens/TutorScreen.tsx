import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common/Screen';
import { SectionTitle } from '@/components/common/SectionTitle';
import { FadeIn } from '@/components/motion/Motion';
import { colors } from '@/theme/colors';
import { tutors } from '../data/tutors';
import { scenarios } from '../data/scenarios';
import { TutorCard, ScenarioCard } from '../components';

export function TutorScreen() {
  return (
    <Screen>
      <FadeIn>
        <Text style={styles.kicker}>AI CONVERSATION LAB</Text>
        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.title}>Speak with purpose.</Text>
            <Text style={styles.subtitle}>Luyện tiếng Anh qua những cuộc hội thoại gần với đời thật.</Text>
          </View>
          <View style={styles.spark}><Ionicons name="sparkles" size={20} color={colors.primary} /></View>
        </View>
      </FadeIn>

      <FadeIn delay={90}>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>YOUR PRACTICE SPACE</Text>
            <Text style={styles.heroTitle}>Một cuộc hội thoại ngắn mỗi ngày.</Text>
            <Text style={styles.heroText}>Chọn tình huống, nói theo cách của bạn và nhận phản hồi vừa đủ để tiến bộ.</Text>
          </View>
          <View style={styles.heroIcon}><Ionicons name="chatbubbles-outline" size={34} color={colors.white} /></View>
        </View>
      </FadeIn>

      <FadeIn delay={150}>
        <SectionTitle title="Choose your tutor" subtitle="Phong cách phù hợp với mục tiêu của bạn" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
          {tutors.map(tutor => (
            <TutorCard key={tutor.id} tutor={tutor} onPress={() => router.push({ pathname: '/tutor/[id]', params: { id: tutor.id } })} />
          ))}
        </ScrollView>
      </FadeIn>

      <FadeIn delay={220} style={styles.scenariosSection}>
        <SectionTitle title="Start with a scenario" subtitle="Một bối cảnh cụ thể giúp bạn nói tự nhiên hơn" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
          {scenarios.map(scenario => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onPress={() => router.push({ pathname: '/tutor/scenario/[id]', params: { id: scenario.id, tutorId: scenario.tutor.toLowerCase() } })}
            />
          ))}
        </ScrollView>
      </FadeIn>

      <FadeIn delay={280}>
        <Pressable style={styles.tip} onPress={() => router.push('/tutor/scenario/coffee')}>
          <View style={styles.tipIcon}><Ionicons name="bulb-outline" size={17} color={colors.orange} /></View>
          <View style={styles.tipCopy}><Text style={styles.tipTitle}>New here?</Text><Text style={styles.tipText}>Start with Coffee Shop. It takes about five minutes.</Text></View>
          <Ionicons name="arrow-forward" size={17} color={colors.textMuted} />
        </Pressable>
      </FadeIn>
    </Screen>
  );
}

export default TutorScreen;

const styles = StyleSheet.create({
  kicker: { marginTop: 4, fontSize: 9, fontWeight: '900', letterSpacing: 1.35, color: colors.violet },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 5, marginBottom: 18 },
  titleCopy: { flex: 1 },
  title: { fontSize: 31, lineHeight: 36, fontWeight: '900', letterSpacing: -1.1, color: colors.text },
  subtitle: { maxWidth: 520, marginTop: 6, fontSize: 12.5, lineHeight: 19, color: colors.textSecondary },
  spark: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.violetSoft },
  hero: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderRadius: 20, backgroundColor: colors.charcoal, overflow: 'hidden' },
  heroCopy: { flex: 1, paddingRight: 14 },
  heroEyebrow: { fontSize: 8, fontWeight: '900', letterSpacing: 1.1, color: '#D8C8C0' },
  heroTitle: { marginTop: 8, fontSize: 20, lineHeight: 25, fontWeight: '900', color: colors.white },
  heroText: { marginTop: 6, fontSize: 11, lineHeight: 17, color: '#D4C8C3' },
  heroIcon: { width: 64, height: 64, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  horizontal: { paddingRight: 18 },
  scenariosSection: { marginTop: 26 },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 25, padding: 13, borderRadius: 15, backgroundColor: colors.orangeSoft, borderWidth: 1, borderColor: '#F4D8AB' },
  tipIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  tipCopy: { flex: 1 },
  tipTitle: { fontSize: 11, fontWeight: '900', color: colors.text },
  tipText: { marginTop: 2, fontSize: 10.5, lineHeight: 16, color: colors.textSecondary },
});
