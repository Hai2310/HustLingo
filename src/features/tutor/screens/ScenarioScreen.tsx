import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/common/PageHeader';
import { AppButton } from '@/components/common/Buttons';
import { AppCard } from '@/components/common/AppCard';
import { TutorAvatar } from '../components';
import { scenarios } from '../data/scenarios';
import { tutors } from '../data/tutors';
import { colors } from '@/theme/colors';

export default function ScenarioScreen() {
  const { id, tutorId } = useLocalSearchParams<{ id: string; tutorId?: string }>();
  const scenario = scenarios.find(item => item.id === id) || scenarios[0];
  const tutor = tutors.find(item => item.id === (tutorId || scenario.tutor.toLowerCase())) || tutors[0];

  return (
    <Screen>
      <PageHeader title="Scenario" subtitle="A focused practice session" />
      <View style={styles.hero}>
        <View style={styles.icon}><Ionicons name={(scenario.icon || 'chatbubbles-outline') as keyof typeof Ionicons.glyphMap} size={30} color={colors.primary} /></View>
        <Text style={styles.title}>{scenario.title}</Text>
        <Text style={styles.subtitle}>{scenario.subtitle}</Text>
        <View style={styles.meta}><View style={styles.level}><Text style={styles.levelText}>{scenario.level}</Text></View><Text style={styles.tutor}>with {tutor.name}</Text></View>
      </View>
      <AppCard style={styles.goal}><Text style={styles.label}>TODAY'S GOAL</Text><Text style={styles.goalText}>{scenario.objective}</Text><Text style={styles.role}><Text style={styles.bold}>Your role: </Text>{scenario.learnerRole}</Text></AppCard>
      <Text style={styles.sectionTitle}>Useful phrases</Text>
      <View style={styles.phrases}>{(scenario.suggestedPhrases || []).map(phrase => <View key={phrase} style={styles.phrase}><Ionicons name="add-circle-outline" size={16} color={colors.primary} /><Text style={styles.phraseText}>{phrase}</Text></View>)}</View>
      <View style={styles.coach}><TutorAvatar initials={tutor.initials || tutor.name.slice(0, 2).toUpperCase()} accent={tutor.accent} size={42} /><View style={styles.coachCopy}><Text style={styles.coachName}>{tutor.name}</Text><Text style={styles.coachText}>I will keep the conversation natural and help when you need it.</Text></View></View>
      <AppButton title="Start practice" icon="arrow-forward" onPress={() => router.push({ pathname: '/tutor/chat', params: { scenarioId: scenario.id, tutorId: tutor.id } })} style={styles.start} />
      <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>Not ready yet</Text></Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 9 },
  icon: { width: 70, height: 70, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  title: { marginTop: 16, fontSize: 28, fontWeight: '900', color: colors.text, textAlign: 'center' },
  subtitle: { maxWidth: 400, marginTop: 6, fontSize: 12, lineHeight: 18, color: colors.textSecondary, textAlign: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 13 },
  level: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 9, backgroundColor: colors.surfaceAlt },
  levelText: { fontSize: 9, fontWeight: '900', color: colors.textSecondary },
  tutor: { fontSize: 10.5, fontWeight: '700', color: colors.textMuted },
  goal: { marginTop: 22, backgroundColor: colors.charcoal, borderColor: colors.charcoal },
  label: { fontSize: 8, fontWeight: '900', letterSpacing: 1.1, color: '#D8C8C0' },
  goalText: { marginTop: 8, fontSize: 16, lineHeight: 23, fontWeight: '900', color: colors.white },
  role: { marginTop: 13, fontSize: 11, lineHeight: 17, color: '#D4C8C3' },
  bold: { fontWeight: '900', color: colors.white },
  sectionTitle: { marginTop: 26, marginBottom: 10, fontSize: 14, fontWeight: '900', color: colors.text },
  phrases: { gap: 8 },
  phrase: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12, paddingVertical: 11, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  phraseText: { fontSize: 11.5, color: colors.textSecondary },
  coach: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 23, padding: 12, borderRadius: 14, backgroundColor: colors.primarySoft },
  coachCopy: { flex: 1 },
  coachName: { fontSize: 11, fontWeight: '900', color: colors.text },
  coachText: { marginTop: 3, fontSize: 10.5, lineHeight: 16, color: colors.textSecondary },
  start: { marginTop: 22 },
  back: { alignItems: 'center', paddingVertical: 15 },
  backText: { fontSize: 11, fontWeight: '800', color: colors.textMuted },
});
