import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/common/Screen';
import { FadeIn } from '@/components/motion/Motion';
import { cosmic, glassCard, moduleSpectra } from '@/theme/cosmic';
import { useTutorCatalog } from '../hooks/useTutorCatalog';
import { TutorDataState } from '../components/TutorDataState';
import { TutorAvatar } from '../components/TutorAvatar';
import { ScenarioCard } from '../components/ScenarioCard';

export function TutorScreen() {
  const [filter, setFilter] = useState('all');
  const data = useTutorCatalog();
  const { width } = useWindowDimensions();
  if (data.loading) return <TutorDataState loading />;
  if (data.error || !data.catalog?.scenarios.length) return <TutorDataState message={data.error || undefined} retry={data.retry} />;
  const { tutors, scenarios } = data.catalog;
  const visibleScenarios = filter === 'all' ? scenarios : scenarios.filter(item => item.tutorId === filter);

  return (
    <Screen contentStyle={styles.page}>
      <FadeIn>
        <Text accessibilityRole="header" aria-level={1} style={styles.title}>Chọn gia sư của bạn</Text>
        <Text style={styles.subtitle}>Thực hành hội thoại tiếng Anh qua những tình huống thực tế.</Text>
      </FadeIn>

      <View style={[styles.cast, width >= 730 && styles.castWide]}>
        {tutors.map((tutor, index) => {
          const chosen = filter === tutor.id;
          const spectrum = tutor.id === 'david' ? moduleSpectra.reading : moduleSpectra.speaking;
          return (
            <FadeIn key={tutor.id} delay={60 + index * 40} style={styles.castSlot}>
              <LinearGradient colors={spectrum.gradient} style={[styles.character, { borderColor: chosen ? spectrum.main : spectrum.edge }]}>
                <Pressable accessibilityRole="button" accessibilityState={{ selected: chosen }} aria-selected={chosen}
                  accessibilityLabel={tutor.name} nativeID={'cosmic-lift-tutor-' + tutor.id}
                  onPress={() => setFilter(tutor.id)} style={styles.selectCharacter}>
                  <TutorAvatar tutorId={tutor.id} initials={tutor.initials || tutor.name.slice(0, 2)} accent={spectrum.main} size={width >= 730 ? 94 : 74} />
                  <View style={styles.characterCopy}>
                    <Text style={[styles.name, { color: spectrum.main }]}>{tutor.name}</Text>
                    <Text style={styles.role}>{tutor.role}</Text>
                    <Text numberOfLines={2} style={styles.subtitle}>{tutor.tone || tutor.description}</Text>
                  </View>
                  <Ionicons aria-hidden name={chosen ? 'checkmark-circle' : 'chevron-forward'} size={20} color={spectrum.main} />
                </Pressable>
                <Link href={{ pathname: '/tutor/[id]', params: { id: tutor.id } }} asChild>
                  <Pressable accessibilityLabel={'Hồ sơ của ' + tutor.name} style={styles.profileLink}><Text style={styles.profileLinkText}>Xem hồ sơ</Text><Ionicons aria-hidden name="arrow-forward" size={14} color={cosmic.ice} /></Pressable>
                </Link>
              </LinearGradient>
            </FadeIn>
          );
        })}
      </View>

      <View style={styles.sectionHead}>
        <Text accessibilityRole="header" aria-level={2} style={styles.heading}>Tình huống hội thoại</Text>
        <Pressable accessibilityRole="button" accessibilityState={{ selected: filter === 'all' }} aria-selected={filter === 'all'}
          onPress={() => setFilter('all')} style={styles.profileLink}><Text style={styles.profileLinkText}>Tất cả gia sư</Text></Pressable>
      </View>
      <View style={styles.scenarios}>
        {visibleScenarios.map((scenario, index) => (
          <FadeIn key={scenario.id} delay={Math.min(index * 35, 120)} style={[styles.scenarioSlot, width >= 730 && styles.scenarioWide]}>
            <ScenarioCard illustrated scenario={scenario}
              onPress={() => router.push({ pathname: '/tutor/scenario/[id]', params: { id: scenario.id, tutorId: scenario.tutorId } })} />
          </FadeIn>
        ))}
      </View>
      {!visibleScenarios.length && <Text style={styles.subtitle}>Gia sư này chưa có tình huống được xuất bản.</Text>}
    </Screen>
  );
}

export default TutorScreen;

const styles = StyleSheet.create({
  page: { gap: 15, paddingTop: 24 },
  title: { color: cosmic.text, fontSize: 37, lineHeight: 43, fontWeight: '900', letterSpacing: -1.2 },
  subtitle: { color: cosmic.muted, fontSize: 14, lineHeight: 20 },
  cast: { gap: 10 },
  castWide: { flexDirection: 'row', flexWrap: 'wrap' },
  castSlot: { flexGrow: 1, flexBasis: '46%', minWidth: 0 },
  character: { ...glassCard, paddingHorizontal: 13, paddingTop: 10, borderRadius: 25, flex: 1, overflow: 'hidden' },
  selectCharacter: { minHeight: 97, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 15 },
  characterCopy: { flex: 1, minWidth: 0, gap: 3 },
  name: { fontSize: 25, lineHeight: 28, fontWeight: '900' },
  role: { fontSize: 13, color: cosmic.text, fontWeight: '800' },
  profileLink: { alignSelf: 'flex-end', minHeight: 44, gap: 5, paddingHorizontal: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  profileLinkText: { color: cosmic.ice, fontSize: 13, fontWeight: '800' },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 3, flexWrap: 'wrap', gap: 6 },
  heading: { color: cosmic.text, fontSize: 23, fontWeight: '900' },
  scenarios: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  scenarioSlot: { width: '100%' },
  scenarioWide: { width: '32%', minWidth: 200, flexGrow: 1, maxWidth: 420 },
});
