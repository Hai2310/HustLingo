import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionTitle } from '@/components/common/SectionTitle';
import { AppCard } from '@/components/common/AppCard';
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
      <AppCard style={styles.persona}><View style={styles.personaHeader}><Ionicons name="heart-outline" size={18} color={colors.primary} /><Text style={styles.personaTitle}>How {tutor.name} teaches</Text></View><Text style={styles.personaText}>{tutor.description}. {tutor.tone}</Text></AppCard>
      <View style={styles.section}><SectionTitle title="Practice with this tutor" subtitle="Chọn một bối cảnh để bắt đầu" /><ScrollView horizontal showsHorizontalScrollIndicator={false}>{tutorScenarios.map(scenario => <ScenarioCard key={scenario.id} scenario={scenario} onPress={() => router.push({ pathname: '/tutor/scenario/[id]', params: { id: scenario.id, tutorId: tutor.id } })} />)}</ScrollView></View>
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
  persona: { marginTop: 20 },
  personaHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  personaTitle: { fontSize: 13, fontWeight: '900', color: colors.text },
  personaText: { marginTop: 8, fontSize: 11.5, lineHeight: 18, color: colors.textSecondary },
  section: { marginTop: 27 },
});
