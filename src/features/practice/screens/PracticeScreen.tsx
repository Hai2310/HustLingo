import { getLevelLabel, LEARNING_LEVELS } from '@/utils/levelLabels';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/common/Screen';
import { ModuleGlyph } from '@/components/common/ModuleGlyph';
import { FadeIn } from '@/components/motion/Motion';
import { colors } from '@/theme/colors';
import { cosmic, gameButton, glassCard, moduleSpectra } from '@/theme/cosmic';
import { signalStudio } from '@/theme/cosmicArt';
import { PracticeNotice, practiceStyles, skillLabels } from '../components/PracticeUI';
import { practiceStatus, PracticeStatusBadge, usePracticeStatus, type PracticeStatus } from '../components/PracticeStatus';
import { grammarTopicLabel, grammarTopicTitle, isPracticeSkill, loadGrammarTopics, loadPracticeCatalog, skills } from '../data/catalog';
import type { PracticeSkill } from '../data/catalog';
import { usePracticeRequest } from '../hooks/usePracticeRequest';

const difficultyOptions = ['all', ...LEARNING_LEVELS] as const;
type Difficulty = typeof difficultyOptions[number];
const skillDescriptions: Record<PracticeSkill, string> = {
  listening: 'Nghe đoạn hội thoại rồi chọn đáp án.',
  speaking: 'Đọc câu mẫu, ghi âm và luyện phát âm.',
  reading: 'Đọc đoạn văn và trả lời câu hỏi.',
  writing: 'Viết theo đề và lưu bài của bạn.',
  grammar: 'Ôn cấu trúc tiếng Anh qua từng câu hỏi.',
};

export function PracticeScreen() {
  const { skill: parameter, level: levelParameter } = useLocalSearchParams<{ skill?: string; level?: string }>();
  const skill = isPracticeSkill(parameter) ? parameter : 'listening';
  const difficulty = difficultyOptions.find(option => option === levelParameter) ?? 'all';
  const { width } = useWindowDimensions();
  const wide = width >= 740;
  const spectrum = moduleSpectra[skill];
  const showSignalArt = skill === 'listening' || skill === 'speaking';

  return (
    <Screen contentStyle={practiceStyles.page}>
      <LinearGradient nativeID="cosmic-practice-stage" colors={spectrum.gradient} start={{ x: 0, y: 0.25 }} end={{ x: 1, y: 1 }}
        style={[styles.hero, wide && styles.heroWide, { borderColor: spectrum.edge }]}>
        {showSignalArt && <>
          <Image source={signalStudio} resizeMode="cover" style={styles.heroArt} accessible={false} aria-hidden />
          <LinearGradient colors={[spectrum.surface, '#080a17bc', cosmic.clear]} locations={[0, 0.52, 1]}
            start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
        </>}
        <View style={styles.copy}>
          <Text style={[styles.heroLabel, { color: spectrum.main }]}>Đấu trường luyện tập</Text>
          <Text accessibilityRole="header" aria-level={1} style={[styles.heroTitle, wide && styles.heroTitleWide]}>
            Luyện {skillLabels[skill].label.toLowerCase()}
          </Text>
          <Text style={styles.heroDetail}>{skillDescriptions[skill]}</Text>
        </View>
        {!showSignalArt && <View aria-hidden style={[styles.seal, { borderColor: spectrum.edge }]}>
          <ModuleGlyph module={skill} size={wide ? 82 : 52} />
        </View>}
      </LinearGradient>
      <View style={styles.arena} accessibilityLabel="Kỹ năng luyện tập">
        {skills.map((item, index) => {
          const itemSpectrum = moduleSpectra[item];
          const selected = item === skill;
          return (
          <FadeIn key={item} delay={index * 24} style={[styles.skillSlot, wide && styles.skillSlotWide]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={skillLabels[item].label}
            aria-selected={selected}
            onPress={() => router.setParams({ skill: item })}
            nativeID={'cosmic-lift-arena-' + item}
            style={({ pressed }) => [styles.skillFilter, { borderColor: selected ? itemSpectrum.main : itemSpectrum.edge }, pressed && styles.pressed]}
          >
            <LinearGradient colors={itemSpectrum.gradient} style={styles.skillFace}>
              <ModuleGlyph module={item} size={35} />
              <Text style={[styles.filterText, selected && { color: itemSpectrum.main }]}>{skillLabels[item].label}</Text>
              {selected && <Ionicons aria-hidden name="checkmark-circle" color={itemSpectrum.main} size={14} style={styles.selectedMark} />}
            </LinearGradient>
          </Pressable>
          </FadeIn>
          );
        })}
      </View>
      {skill !== 'grammar' && <DifficultyFilter value={difficulty} />}
      <Text accessibilityRole="header" aria-level={2} style={practiceStyles.heading}>
        {skill === 'grammar' ? 'Nhóm ngữ pháp' : 'Bài luyện ' + skillLabels[skill].label.toLowerCase()}
      </Text>
      {skill === 'grammar' ? <GrammarTopics wide={wide} /> : <SkillList skill={skill} difficulty={difficulty} wide={wide} />}
    </Screen>
  );
}

export default PracticeScreen;

function DifficultyFilter({ value }: { value: Difficulty }) {
  return (
    <View style={styles.difficulty}>
      <Text style={practiceStyles.label}>Độ khó</Text>
      <View style={styles.filters} accessibilityLabel="Lọc theo độ khó">
        {difficultyOptions.map(option => {
          const label = option === 'all' ? 'Tất cả' : getLevelLabel(option);
          const selected = option === value;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityLabel={label}
              aria-selected={selected}
              onPress={() => router.setParams({ level: option })}
              style={({ pressed }) => [styles.filter, styles.difficultyOption, selected && styles.difficultySelected, pressed && styles.pressed]}
            >
              <Text style={styles.filterText}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SkillList({ skill, difficulty, wide }: { skill: Exclude<PracticeSkill, 'grammar'>; difficulty: Difficulty; wide: boolean }) {
  const request = usePracticeRequest(loadPracticeCatalog);
  const statusFor = usePracticeStatus();
  if (request.loading) return <PracticeNotice loading message="Đang tải bài luyện tập…" />;
  if (!request.data) return <PracticeNotice message={request.error ?? 'Chưa tải được danh sách.'} retry={request.retry} />;
  const exercises = request.data.exercises.filter(exercise => exercise.skill === skill);
  const levelLabel = difficulty === 'all' ? null : getLevelLabel(difficulty);
  const matches = levelLabel ? exercises.filter(exercise => getLevelLabel(exercise.level) === levelLabel) : exercises;
  return <>
    {request.data.source === 'local' && <PracticeNotice message="Đang dùng bộ bài có sẵn trên thiết bị." retry={request.retry} />}
    {matches.length > 0 ? (
      <View style={styles.grid}>
        {matches.map(exercise => (
          <ExerciseCard key={exercise.id} id={exercise.id} skill={skill} title={exercise.title || exercise.id} label={getLevelLabel(exercise.level)} status={statusFor(skill, exercise.id)} wide={wide} />
        ))}
      </View>
    ) : (
      <PracticeNotice message={exercises.length > 0 ? `Chưa có bài mức ${levelLabel} cho kỹ năng này.` : 'Chưa có bài đã xuất bản cho kỹ năng này.'} />
    )}
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
        const type = topic.includes('present') || topic.includes('past') || topic.includes('future') ? 'time' :
          topic.includes('question') ? 'question' : topic.includes('conditional') || topic.includes('modal') ? 'choice' :
          topic.includes('compar') || topic.includes('quant') ? 'scale' : 'parts';
        const art = grammarMarks[type];
        return (
          <Link key={topic} href={{ pathname: '/practice/grammar/[topic]', params: { topic } }} style={[styles.card, styles.grammarCard, wide && styles.cardWide, { borderColor: art.edge }]} asChild>
            <Pressable accessibilityRole="link" nativeID={'cosmic-lift-grammar-' + topic}>
              <LinearGradient colors={art.gradient} style={[styles.topicIcon, { borderColor: art.edge }]}><Ionicons aria-hidden name={art.icon} size={27} color={art.ink} /></LinearGradient>
              <View style={styles.copy}>
                <Text style={styles.cardTitle}>{title}</Text>
                {englishTitle !== title && <Text style={practiceStyles.detail}>{englishTitle}</Text>}
              </View>
              <Ionicons aria-hidden name="chevron-forward" size={18} color={cosmic.ice} />
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const grammarMarks = {
  time: { icon: 'time-outline', ink: cosmic.violet, edge: cosmic.actionEdge, gradient: moduleSpectra.grammar.gradient },
  question: { icon: 'help-circle-outline', ink: cosmic.ice, edge: cosmic.iceEdge, gradient: moduleSpectra.reading.gradient },
  choice: { icon: 'git-branch-outline', ink: cosmic.rose, edge: cosmic.roseEdge, gradient: moduleSpectra.speaking.gradient },
  scale: { icon: 'scale-outline', ink: cosmic.orange, edge: cosmic.orangeEdge, gradient: moduleSpectra.writing.gradient },
  parts: { icon: 'extension-puzzle-outline', ink: cosmic.mint, edge: cosmic.mintEdge, gradient: moduleSpectra.vocabulary.gradient },
} as const;

function ExerciseCard({ id, skill, label, title, status, wide }: {
  id: string;
  skill: PracticeSkill;
  label: string;
  title: string;
  status?: PracticeStatus;
  wide: boolean;
}) {
  const result = status ? practiceStatus[status] : undefined;
  const spectrum = moduleSpectra[skill];
  return (
    <Link href={{ pathname: '/practice/[exerciseId]', params: { exerciseId: id, skill } }} style={[styles.card, styles.exerciseCard, wide && styles.cardWide, { borderColor: status && status !== 'unanswered' ? result?.edge : spectrum.edge }]} asChild>
      <Pressable accessibilityLabel={result ? `${title}, ${label}, ${result.label}` : undefined}>
        <ModuleGlyph module={skill} size={40} />
        <View style={styles.copy}>
          <View style={styles.cardMeta}>
            <Text style={practiceStyles.label}>{label}</Text>
            {status && <PracticeStatusBadge status={status} />}
          </View>
          <Text numberOfLines={2} style={styles.cardTitle}>{title}</Text>
        </View>
        <Ionicons aria-hidden name="arrow-forward" size={18} color={spectrum.main} />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  hero: { ...glassCard, minHeight: 155, flexDirection: 'row', alignItems: 'center', gap: 15, padding: 19, overflow: 'hidden' },
  heroWide: { minHeight: 205, paddingHorizontal: 31 },
  heroArt: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  heroLabel: { fontSize: 13, fontWeight: '800' },
  heroTitle: { fontSize: 29, lineHeight: 35, fontWeight: '900', letterSpacing: -0.9, color: cosmic.text },
  heroTitleWide: { fontSize: 47, lineHeight: 52, letterSpacing: -1.6 },
  heroDetail: { fontSize: 14, lineHeight: 20, color: cosmic.text, maxWidth: 280 },
  seal: { borderWidth: 1, borderRadius: 90, alignItems: 'center', justifyContent: 'center', padding: 12, transform: [{ rotate: '-9deg' }] },
  copy: { flex: 1, minWidth: 0, gap: 4 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  arena: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillSlot: { flexGrow: 1, flexBasis: '28%', minWidth: 90 },
  skillSlotWide: { flexBasis: '16%' },
  difficulty: { gap: 7 },
  difficultyOption: { borderRadius: 12, borderBottomWidth: 2 },
  difficultySelected: { backgroundColor: cosmic.iceSurface, borderColor: cosmic.ice },
  filter: { ...gameButton, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, backgroundColor: cosmic.glass, borderColor: cosmic.border },
  skillFilter: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  skillFace: { minHeight: 80, padding: 9, gap: 7, justifyContent: 'center' },
  selectedMark: { position: 'absolute', top: 7, right: 7 },
  filterText: { color: cosmic.text, fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.78 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  card: { ...glassCard, width: '100%', minHeight: 75, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  exerciseCard: { backgroundColor: colors.surface },
  cardMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 9, rowGap: 4 },
  cardWide: { width: '49%' },
  cardTitle: { color: cosmic.text, fontSize: 16, lineHeight: 22, fontWeight: '700' },
  grammarCard: { paddingVertical: 16, minHeight: 86 },
  topicIcon: { borderWidth: 1, borderRadius: 17, width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
});
