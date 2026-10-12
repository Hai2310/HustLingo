import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/common/PageHeader';
import { AppButton } from '@/components/common/Buttons';
import { AppCard } from '@/components/common/AppCard';
import { scenarios } from '../data/scenarios';
import { tutors } from '../data/tutors';
import { colors } from '@/theme/colors';

export default function ScenarioScreen() {
  const { id, tutorId } = useLocalSearchParams<{ id: string; tutorId?: string }>();
  const scenario = scenarios.find(item => item.id === id) || scenarios[0];
  const tutor = tutors.find(item => item.id === (tutorId || scenario.tutor.toLowerCase())) || tutors[0];

  return (
    <Screen>
      <PageHeader title="Scenario" subtitle={`${tutor.name} · ${scenario.level}`} />
      <View style={styles.hero}>
        <View style={styles.icon}><Ionicons name={(scenario.icon || 'chatbubbles-outline') as keyof typeof Ionicons.glyphMap} size={30} color={colors.primary} /></View>
        <Text style={styles.title}>{scenario.title}</Text>
        <Text style={styles.subtitle}>{scenario.subtitle}</Text>
      </View>
      <AppCard style={styles.goal}><Text style={styles.goalText}>{scenario.objective}</Text><Text style={styles.role}><Text style={styles.bold}>Your role: </Text>{scenario.learnerRole}</Text></AppCard>
      <Text style={styles.sectionTitle}>Useful phrases</Text>
      <View style={styles.phrases}>{(scenario.suggestedPhrases || []).map(phrase => <View key={phrase} style={styles.phrase}><Ionicons name="add-circle-outline" size={16} color={colors.primary} /><Text style={styles.phraseText}>{phrase}</Text></View>)}</View>
      <AppButton title="Start practice" icon="arrow-forward" onPress={() => router.push({ pathname: '/tutor/chat', params: { scenarioId: scenario.id, tutorId: tutor.id } })} style={styles.start} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 5 },
  icon: { width: 70, height: 70, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  title: { marginTop: 16, fontSize: 28, fontWeight: '900', color: colors.text, textAlign: 'center' },
  subtitle: { maxWidth: 400, marginTop: 6, fontSize: 12, lineHeight: 18, color: colors.textSecondary, textAlign: 'center' },
  goal: { marginTop: 22, backgroundColor: colors.surface, borderColor: colors.border },
  goalText: { fontSize: 15, lineHeight: 22, fontWeight: '900', color: colors.text },
  role: { marginTop: 12, fontSize: 11, lineHeight: 17, color: colors.textSecondary },
  bold: { fontWeight: '900', color: colors.text },
  sectionTitle: { marginTop: 25, marginBottom: 10, fontSize: 14, fontWeight: '900', color: colors.text },
  phrases: { gap: 8 },
  phrase: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12, paddingVertical: 11, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  phraseText: { fontSize: 11.5, color: colors.textSecondary },
  start: { marginTop: 22 },
});
