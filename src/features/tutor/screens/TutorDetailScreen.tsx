import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/common/PageHeader';
import { TutorAvatar, ScenarioCard } from '../components';
import { tutors } from '../data/tutors';
import { scenarios } from '../data/scenarios';
import { colors } from '@/theme/colors';

export default function TutorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tutor = tutors.find(item => item.id === id) || tutors[0];
  const tutorScenarios = scenarios.filter(item => item.tutor.toLowerCase() === tutor.id);

  return (
    <Screen>
      <PageHeader title={tutor.name} subtitle="Tutor profile" />
      <View style={styles.profile}>
        <TutorAvatar initials={tutor.initials || tutor.name.slice(0, 2).toUpperCase()} accent={tutor.accent} size={74} />
        <View style={styles.profileCopy}><Text style={styles.name}>{tutor.name}</Text><Text style={styles.role}>{tutor.role}</Text><Text style={styles.tone}>{tutor.tone}</Text></View>
      </View>
      <View style={styles.tags}>{(tutor.specialties || []).map(item => <View key={item} style={styles.tag}><Text style={styles.tagText}>{item}</Text></View>)}</View>
      <Text style={styles.sectionTitle}>Practice with {tutor.name}</Text>
      <View style={styles.scenarios}>{tutorScenarios.map(scenario => <ScenarioCard key={scenario.id} compact scenario={scenario} onPress={() => router.push({ pathname: '/tutor/scenario/[id]', params: { id: scenario.id, tutorId: tutor.id } })} />)}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 8 },
  profileCopy: { flex: 1 },
  name: { fontSize: 26, fontWeight: '900', color: colors.text },
  role: { marginTop: 3, fontSize: 11, fontWeight: '800', color: colors.primary },
  tone: { marginTop: 8, fontSize: 12, lineHeight: 18, color: colors.textSecondary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 14 },
  tag: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 9, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  tagText: { fontSize: 9.5, fontWeight: '800', color: colors.textSecondary },
  sectionTitle: { marginTop: 28, marginBottom: 11, fontSize: 15, fontWeight: '900', color: colors.text },
  scenarios: { gap: 10 },
});
