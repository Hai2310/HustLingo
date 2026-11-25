import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common/Screen';
import { FadeIn } from '@/components/motion/Motion';
import { colors } from '@/theme/colors';
import { hum, paperButton, paperCard } from '@/theme/hum';
import { useTutorCatalog } from '../hooks/useTutorCatalog';
import { TutorDataState } from '../components/TutorDataState';
import { ScenarioCard } from '../components';

export function TutorScreen() {
  const [filter, setFilter] = useState('all');
  const data = useTutorCatalog();
  const tutors = data.catalog?.tutors || [];
  const scenarios = data.catalog?.scenarios || [];
  const visibleScenarios = useMemo(
    () => filter === 'all' ? scenarios : scenarios.filter(item => item.tutorId === filter),
    [filter, scenarios],
  );

  if (data.loading) return <TutorDataState loading />;
  if (data.error || !scenarios.length) return <TutorDataState message={data.error || undefined} retry={data.retry} />;
  return (
    <Screen>
      <FadeIn style={styles.intro}>
        <View style={styles.introCopy}>
          <Text accessibilityRole="header" style={styles.title}>Luyện hội thoại với gia sư</Text>
          <Text style={styles.subtitle}>Chọn một tình huống để thực hành tiếng Anh.</Text>
        </View>
        <View aria-hidden style={styles.introIcon}><Ionicons name="chatbubbles-outline" size={25} color={hum.greenInk} /></View>
      </FadeIn>

      <FadeIn delay={90}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Tutor</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            <FilterButton active={filter === 'all'} label="All" onPress={() => setFilter('all')} />
            {tutors.map(tutor => (
              <FilterButton
                key={tutor.id}
                active={filter === tutor.id}
                label={tutor.name}
                onPress={() => setFilter(tutor.id)}
              />
            ))}
          </ScrollView>
        </View>
        <View style={styles.profileLinks}>
          <Text style={styles.profileLabel}>Meet your tutors</Text>
          {tutors.map(tutor => (
            <Pressable
              key={tutor.id}
              accessibilityRole="link"
              accessibilityLabel={`View ${tutor.name}'s tutor profile`}
              onPress={() => router.push({ pathname: '/tutor/[id]', params: { id: tutor.id } })}
              style={styles.profileLink}
            >
              <Text style={styles.profileLinkText}>{tutor.name}</Text>
              <Ionicons name="arrow-forward" size={13} color={colors.primary} />
            </Pressable>
          ))}
        </View>
      </FadeIn>

      <FadeIn delay={150} style={styles.list}>
        {visibleScenarios.map(scenario => (
          <ScenarioCard
            key={scenario.id}
            compact
            scenario={scenario}
            onPress={() => router.push({ pathname: '/tutor/scenario/[id]', params: { id: scenario.id, tutorId: scenario.tutorId } })}
          />
        ))}
        {!visibleScenarios.length && <Text style={styles.subtitle}>Gia sư này chưa có tình huống được xuất bản.</Text>}
      </FadeIn>
    </Screen>
  );
}

export default TutorScreen;

function FilterButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.filter, active && styles.filterActive]}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  intro: { ...paperCard, flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: hum.mint, borderColor: hum.mintRule, padding: 21, marginTop: 7 },
  introCopy: { flex: 1, minWidth: 0 },
  introIcon: { width: 46, height: 46, backgroundColor: hum.card, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: 5, fontSize: 30, lineHeight: 35, fontWeight: '900', letterSpacing: -1, color: colors.text },
  subtitle: { maxWidth: 560, marginTop: 6, fontSize: 14, lineHeight: 21, color: colors.textSecondary },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginTop: 23, marginBottom: 14, gap: 10 },
  filterLabel: { fontSize: 10.5, fontWeight: '900', color: colors.text },
  filters: { gap: 7 },
  filter: { ...paperButton, minHeight: 44, paddingHorizontal: 12, justifyContent: 'center', borderRadius: 11, backgroundColor: colors.surface, borderColor: colors.border },
  filterActive: { backgroundColor: colors.action, borderColor: colors.actionEdge },
  filterText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  filterTextActive: { color: colors.text },
  profileLinks: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 12, rowGap: 4, marginBottom: 14 },
  profileLabel: { fontSize: 10.5, color: colors.textSecondary },
  profileLink: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 4 },
  profileLinkText: { fontSize: 11, fontWeight: '800', color: colors.primary },
  list: { gap: 10 },
});
