import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { AppButton } from '@/components/common/Buttons';
import { Screen } from '@/components/common/Screen';
import { hum, paperButton, paperCard } from '@/theme/hum';
import { PracticeNotice, practiceStyles, skillLabels } from '../components/PracticeUI';
import { grammarTopicLabel, isPracticeSkill, loadGrammarPage, loadPracticeCatalog, skills } from '../data/catalog';
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
        {skill === 'grammar' ? 'Điền chỗ trống' : 'Bài luyện ' + skillLabels[skill].label.toLowerCase()}
      </Text>
      {skill === 'grammar' ? <GrammarList wide={wide} /> : <SkillList skill={skill} wide={wide} />}
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

function GrammarList({ wide }: { wide: boolean }) {
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const load = useCallback((signal: AbortSignal) => loadGrammarPage(page, filter, signal), [page, filter]);
  const request = usePracticeRequest(load);
  const applyFilter = () => { setPage(0); setFilter(draft.trim()); };

  return <>
    <Text style={practiceStyles.detail}>Kho câu hỏi demo phi thương mại. Tìm theo nhóm ngữ pháp bằng tên tiếng Anh.</Text>
    <View style={styles.search}>
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={applyFilter}
        placeholder="Ví dụ: past simple"
        placeholderTextColor={hum.muted}
        accessibilityLabel="Tìm chủ đề ngữ pháp"
        maxLength={60}
        style={[practiceStyles.input, styles.searchInput]}
      />
      <AppButton title="Tìm" variant="secondary" icon="search-outline" onPress={applyFilter} />
    </View>
    {request.loading ? <PracticeNotice loading message="Đang tải câu hỏi…" /> : request.error ? (
      <PracticeNotice message={request.error} retry={request.retry} />
    ) : request.data && <>
      {request.data.rows.length ? (
        <View style={styles.grid}>
          {request.data.rows.map(item => (
            <ExerciseCard key={item.id} id={item.id} skill="grammar" label={grammarTopicLabel(item.grammar_topic)} title={item.gapped_text} wide={wide} />
          ))}
        </View>
      ) : <PracticeNotice message="Chưa tìm thấy câu hỏi cho chủ đề này." />}
      {(page > 0 || request.data.hasNext) && (
        <View style={styles.pagination}>
          <AppButton title="Trang trước" variant="secondary" disabled={page === 0} onPress={() => setPage(value => value - 1)} />
          <Text accessibilityLiveRegion="polite" style={practiceStyles.label}>Trang {page + 1}</Text>
          <AppButton title="Trang sau" variant="secondary" disabled={!request.data.hasNext} onPress={() => setPage(value => value + 1)} />
        </View>
      )}
    </>}
  </>;
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
  search: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchInput: { flex: 1, minWidth: 0 },
  pagination: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, justifyContent: 'space-between' },
});
