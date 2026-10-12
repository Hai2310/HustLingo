import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/common/Screen';
import { FadeIn } from '@/components/motion/Motion';
import { colors } from '@/theme/colors';
import { tutors } from '../data/tutors';
import { scenarios } from '../data/scenarios';
import { ScenarioCard } from '../components';

export function TutorScreen() {
  const [filter, setFilter] = useState<'all' | 'emma' | 'david'>('all');
  const visibleScenarios = useMemo(
    () => filter === 'all' ? scenarios : scenarios.filter(item => item.tutor.toLowerCase() === filter),
    [filter],
  );

  return (
    <Screen>
      <FadeIn>
        <Text style={styles.kicker}>PRACTICE</Text>
        <Text style={styles.title}>Choose a situation.</Text>
        <Text style={styles.subtitle}>Luyện tiếng Anh qua những cuộc hội thoại gần với đời thật.</Text>
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
                onPress={() => setFilter(tutor.id as 'emma' | 'david')}
              />
            ))}
          </ScrollView>
        </View>
      </FadeIn>

      <FadeIn delay={150} style={styles.list}>
        {visibleScenarios.map(scenario => (
          <ScenarioCard
            key={scenario.id}
            compact
            scenario={scenario}
            onPress={() => router.push({ pathname: '/tutor/scenario/[id]', params: { id: scenario.id, tutorId: scenario.tutor.toLowerCase() } })}
          />
        ))}
      </FadeIn>
    </Screen>
  );
}

export default TutorScreen;

function FilterButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.filter, active && styles.filterActive]}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kicker: { marginTop: 4, fontSize: 9, fontWeight: '900', letterSpacing: 1.25, color: colors.violet },
  title: { marginTop: 5, fontSize: 30, lineHeight: 35, fontWeight: '900', letterSpacing: -1, color: colors.text },
  subtitle: { maxWidth: 560, marginTop: 6, fontSize: 12.5, lineHeight: 19, color: colors.textSecondary },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginTop: 23, marginBottom: 14, gap: 10 },
  filterLabel: { fontSize: 10.5, fontWeight: '900', color: colors.text },
  filters: { gap: 7 },
  filter: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterActive: { backgroundColor: colors.charcoal, borderColor: colors.charcoal },
  filterText: { fontSize: 10, fontWeight: '800', color: colors.textSecondary },
  filterTextActive: { color: colors.white },
  list: { gap: 10 },
});
