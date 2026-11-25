import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/common/Screen';
import { hum, paperButton, paperCard } from '@/theme/hum';
import { PracticeNotice, practiceStyles, skillLabels } from '../components/PracticeUI';
import { grammarTopicLabel, grammarTopicTitle, isPracticeSkill, loadGrammarTopics, loadPracticeCatalog, skills } from '../data/catalog';
import type { PracticeSkill } from '../data/catalog';
import { usePracticeRequest } from '../hooks/usePracticeRequest';

export function PracticeScreen() {
  const { skill: parameter } = useLocalSearchParams<{ skill?: string }>();
  const skill = isPracticeSkill(parameter) ? parameter : 'listening';
  const { width } = useWindowDimensions();
  const wide = width >= 740;

  return (
    <Screen contentStyle={practiceStyles.page}>
      <View style={styles.hero}>
        <View style={styles.copy}>
          <Text accessibilityRole="header" aria-level={1} style={practiceStyles.title}>Luyện tập</Text>
          <Text style={practiceStyles.detail}>Chọn kỹ năng và bắt đầu với một bài ngắn.</Text>
        </View>
        <View aria-hidden style={styles.seal}><Ionicons name="pencil-outline" size={24} color={hum.pearInk} /></View>
      </View>
      <View style={styles.filters} accessibilityLabel="Kỹ năng luyện tập">
        {skills.map(item => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityLabel={skillLabels[item].label}
            aria-selected={item === skill}
            onPress={() => router.setParams({ skill: item })}
            style={({ pressed }) => [styles.filter, item === skill && styles.selected, pressed && styles.pressed]}
          >
            <Ionicons aria-hidden name={skillLabels[item].icon} color={hum.ink} size={17} />
            <Text style={styles.filterText}>{skillLabels[item].label}</Text>
          </Pressable>
        ))}
      </View>
      <Text accessibilityRole="header" aria-level={2} style={practiceStyles.heading}>
        {skill === 'grammar' ? 'Nhóm ngữ pháp' : 'Bài luyện ' + skillLabels[skill].label.toLowerCase()}
      </Text>
      {skill === 'grammar' ? <GrammarTopics wide={wide} /> : <SkillList skill={skill} wide={wide} />}
    </Screen>
  );
}

export default PracticeScreen;

function SkillList({ skill, wide }: { skill: Exclude<PracticeSkill, 'grammar'>; wide: boolean }) {
  const request = usePracticeRequest(loadPracticeCatalog);
  if (request.loading) return <PracticeNotice loading message="Đang tải bài luyện tập…" />;
  if (!request.data) return <PracticeNotice message={request.error ?? 'Chưa tải được danh sách.'} retry={request.retry} />;
  const exercises = request.data.exercises.filter(exercise => exercise.skill === skill);
  return <>
    {request.data.source === 'local' && <PracticeNotice message="Đang dùng bộ bài có sẵn trên thiết bị." retry={request.retry} />}
    {exercises.length === 0 && <PracticeNotice message="Chưa có bài đã xuất bản cho kỹ năng này." />}
    <View style={styles.grid}>
      {exercises.map(exercise => (
        <ExerciseCard key={exercise.id} id={exercise.id} skill={skill} title={exercise.title || exercise.id} label={exercise.level} wide={wide} />
      ))}
    </View>
  </>;
}

function GrammarTopics({ wide }: { wide: boolean }) {
  const request = usePracticeRequest(loadGrammarTopics);
  if (request.loading) return <PracticeNotice loading message="Đang tải các nhóm Ngữ pháp…" />;
  if (request.error) return <PracticeNotice message={request.error} retry={request.retry} />;
  if (!request.data?.length) return <PracticeNotice message="Chưa có nhóm Ngữ pháp đã xuất bản." />;
  return (
    <View style={styles.grid}>
      {request.data.map(topic => {
        const englishTitle = grammarTopicLabel(topic);
        const title = grammarTopicTitle(topic);
        return (
          <Link key={topic} href={{ pathname: '/practice/grammar/[topic]', params: { topic } }} style={[styles.card, wide && styles.cardWide]} asChild>
            <Pressable accessibilityRole="link">
              <View aria-hidden style={styles.topicIcon}><Ionicons name="book-outline" size={19} color={hum.blue} /></View>
              <View style={styles.copy}>
                <Text style={styles.cardTitle}>{title}</Text>
                {englishTitle !== title && <Text style={practiceStyles.detail}>{englishTitle}</Text>}
              </View>
              <Ionicons aria-hidden name="chevron-forward" size={18} color={hum.blue} />
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

function ExerciseCard({ id, skill, label, title, wide }: {
  id: string;
  skill: PracticeSkill;
  label: string;
  title: string;
  wide: boolean;
}) {
  return (
    <Link href={{ pathname: '/practice/[exerciseId]', params: { exerciseId: id, skill } }} style={[styles.card, wide && styles.cardWide]} asChild>
      <Pressable>
        <View style={styles.copy}>
          <Text style={practiceStyles.label}>{label}</Text>
          <Text numberOfLines={2} style={styles.cardTitle}>{title}</Text>
        </View>
        <Ionicons aria-hidden name="arrow-forward" size={18} color={hum.blue} />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  hero: { ...paperCard, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, backgroundColor: hum.pearSoft, borderColor: hum.pearEdge },
  seal: { ...paperButton, width: 46, height: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: hum.pear, borderColor: hum.pearEdge, transform: [{ rotate: '-6deg' }] },
  copy: { flex: 1, minWidth: 0, gap: 4 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filter: { ...paperButton, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, backgroundColor: hum.card, borderColor: hum.rule },
  selected: { backgroundColor: hum.pear, borderColor: hum.pearEdge },
  filterText: { color: hum.ink, fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.78 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  card: { ...paperCard, width: '100%', minHeight: 75, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  cardWide: { width: '49%' },
  cardTitle: { color: hum.ink, fontSize: 16, lineHeight: 22, fontWeight: '700' },
  topicIcon: { borderWidth: 1, borderColor: hum.skyEdge, borderRadius: 12, backgroundColor: hum.sky, width: 39, height: 39, alignItems: 'center', justifyContent: 'center' },
});
