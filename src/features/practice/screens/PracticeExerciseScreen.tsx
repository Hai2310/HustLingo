import { getLevelLabel } from '@/utils/levelLabels';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, Image, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { AppButton } from '@/components/common/Buttons';
import { ModuleGlyph } from '@/components/common/ModuleGlyph';
import { RewardBurst } from '@/components/common/RewardBurst';
import { Screen } from '@/components/common/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { useLearning } from '@/contexts/LearningContext';
import { useLessonSpeech } from '@/features/lessons/hooks/useLessonSpeech';
import { cosmic, gameButton, glassCard, moduleSpectra } from '@/theme/cosmic';
import { explorerBom } from '@/theme/cosmicArt';
import { useMotionPreference } from '@/theme/MotionPreference';
import { SpeakingResponse, WritingResponse } from '../components/PracticeResponses';
import { PracticeStatusBadge } from '../components/PracticeStatus';
import { PracticeNotice, practiceStyles, skillLabels } from '../components/PracticeUI';
import { grammarTopicTitle, isPracticeSkill, loadGrammarExercise, loadPracticeCatalog, practiceKey } from '../data/catalog';
import type { GrammarExercise, PracticeSkill, SkillExercise } from '../data/catalog';
import { usePracticeRequest } from '../hooks/usePracticeRequest';

export default function PracticeExerciseScreen() {
  const { exerciseId, skill: parameter, fromTopic, page, number } = useLocalSearchParams<{
    exerciseId?: string; skill?: string; fromTopic?: string; page?: string; number?: string;
  }>();
  const skill = isPracticeSkill(parameter) ? parameter : 'listening';
  const returnToTopic = skill === 'grammar' && !!fromTopic;
  return (
    <Screen contentStyle={[practiceStyles.page, styles.page]}>
      <View style={styles.back}>
        <AppButton title={returnToTopic ? 'Về danh sách câu hỏi' : 'Về Luyện tập'} icon="arrow-back" variant="secondary" onPress={() => {
          if (returnToTopic) router.dismissTo({ pathname: '/practice/grammar/[topic]', params: { topic: fromTopic, page: page ?? '1' } });
          else if (router.canGoBack()) router.back();
          else router.replace({ pathname: '/(tabs)/practice', params: { skill } });
        }} />
      </View>
      {!exerciseId ? <PracticeNotice message="Chưa tìm thấy bài luyện tập." /> : skill === 'grammar'
        ? <GrammarDetail key={exerciseId} id={exerciseId} number={returnToTopic && number && /^[1-9]\d*$/.test(number) ? number : undefined} />
        : <SkillDetail key={skill + ':' + exerciseId} id={exerciseId} skill={skill} />}
    </Screen>
  );
}

function SkillDetail({ id, skill }: { id: string; skill: Exclude<PracticeSkill, 'grammar'> }) {
  const request = usePracticeRequest(loadPracticeCatalog);
  const { user, loading: authLoading } = useAuth();
  if (request.loading) return <PracticeNotice loading message="Đang mở bài luyện tập…" />;
  if (!request.data) return <PracticeNotice message={request.error ?? 'Chưa tải được bài.'} retry={request.retry} />;
  const exercise = request.data.exercises.find(item => item.id === id && item.skill === skill);
  if (!exercise) return <PracticeNotice message="Bài luyện tập này không có trong danh sách hiện tại." retry={request.retry} />;
  return <>
    <ExerciseHeading skill={skill} label={getLevelLabel(exercise.level)} title={skill === 'speaking' ? 'Luyện nói theo mẫu' : exercise.title} />
    {request.data.source === 'local' && <Text style={practiceStyles.detail}>Bản có sẵn trên thiết bị.</Text>}
    {exercise.skill === 'writing' ? (
      authLoading ? <PracticeNotice loading message="Đang mở bản nháp…" /> :
        <WritingResponse key={user.id} exercise={exercise} storageKey={`hustlingo_practice_draft:${user.id}:${exercise.id}`} />
    ) : exercise.skill === 'speaking' ? <SpeakingResponse exercise={exercise} /> : <Comprehension exercise={exercise} />}
  </>;
}

function GrammarDetail({ id, number }: { id: string; number?: string }) {
  const load = useCallback((signal: AbortSignal) => loadGrammarExercise(id, signal), [id]);
  const request = usePracticeRequest(load);
  if (request.loading) return <PracticeNotice loading message="Đang tải câu hỏi…" />;
  if (request.error) return <PracticeNotice message={request.error} retry={request.retry} />;
  if (!request.data) return <PracticeNotice message="Chưa tìm thấy câu hỏi Ngữ pháp." />;
  return <GrammarQuestion exercise={request.data} number={number} />;
}

function GrammarQuestion({ exercise, number }: { exercise: GrammarExercise; number?: string }) {
  const [options] = useState(() => {
    const values = [...new Set([exercise.solution, ...exercise.distractors])];
    for (let end = values.length - 1; end > 0; end--) {
      const next = Math.floor(Math.random() * (end + 1));
      [values[end], values[next]] = [values[next], values[end]];
    }
    return values;
  });
  const [sourceError, setSourceError] = useState(false);
  return <>
    <ExerciseHeading skill="grammar" label={grammarTopicTitle(exercise.grammar_topic)} title={number ? `Câu ${number}` : 'Điền chỗ trống'} />
    <ChoiceExercise practiceId={practiceKey('grammar', exercise.id)} question={exercise.gapped_text} options={options} answer={options.indexOf(exercise.solution)} review={exercise.filled_text} />
    <View style={styles.source}>
      <Text style={practiceStyles.detail}>{exercise.source_license}</Text>
      {exercise.source_url.startsWith('https://') && (
        <Pressable accessibilityRole="link" onPress={() => {
          setSourceError(false);
          void Linking.openURL(exercise.source_url).catch(() => setSourceError(true));
        }}>
          <Text style={styles.sourceLink}>Nguồn Zanichelli</Text>
        </Pressable>
      )}
      {sourceError && <Text accessibilityLiveRegion="polite" style={practiceStyles.detail}>Không mở được đường dẫn nguồn.</Text>}
    </View>
  </>;
}

function Comprehension({ exercise }: { exercise: Extract<SkillExercise, { skill: 'listening' | 'reading' }> }) {
  const speech = useLessonSpeech();
  return <>
    {exercise.skill === 'reading' ? (
      <View style={[practiceStyles.sheet, styles.reading, { backgroundColor: moduleSpectra.reading.surface, borderColor: moduleSpectra.reading.edge }]}><Text style={styles.passage}>{exercise.text}</Text></View>
    ) : (
      <View style={[practiceStyles.sheet, styles.reading]}>
        <AppButton title={speech.speaking ? 'Dừng phát' : 'Nghe đoạn hội thoại'} icon="volume-high-outline" onPress={() => { void speech.speak(exercise.id, exercise.transcript); }} />
        <Text style={practiceStyles.detail}>{speech.audioError ? 'Thiết bị chưa phát được âm thanh. Bạn có thể đọc lời thoại bên dưới.' : 'Nghe đoạn hội thoại rồi chọn đáp án bên dưới.'}</Text>
        {speech.audioError && <Text style={styles.passage}>{exercise.transcript}</Text>}
      </View>
    )}
    <ChoiceExercise practiceId={practiceKey(exercise.skill, exercise.id)} question={exercise.question} options={exercise.options} answer={exercise.answer} review={exercise.skill === 'listening' ? exercise.transcript : undefined} />
  </>;
}

function ExerciseHeading({ skill, label, title }: { skill: PracticeSkill; label: string; title: string }) {
  const spectrum = moduleSpectra[skill];
  return (
    <View style={[styles.heading, { backgroundColor: spectrum.surface, borderColor: spectrum.edge }]}>
      <ModuleGlyph module={skill} size={47} />
      <View style={styles.headingCopy}>
        <Text style={[practiceStyles.label, { color: spectrum.main }]}>{skillLabels[skill].label} / {label}</Text>
        <Text accessibilityRole="header" aria-level={1} style={practiceStyles.title}>{title}</Text>
      </View>
    </View>
  );
}

function ChoiceExercise({ practiceId, question, options, answer, review }: {
  practiceId: string; question: string; options: string[]; answer: number; review?: string;
}) {
  const { state, ready, recordAnswer } = useLearning();
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const motion = useMotionPreference() === false;
  const [feedback] = useState(() => new Animated.Value(0));
  const recorded = useRef(false);
  const correct = selected === answer;
  const previousResult = ready ? state.practiceResults[practiceId] : undefined;

  return (
    <View style={practiceStyles.sheet}>
      <Text style={practiceStyles.heading}>{question}</Text>
      {!checked && previousResult && (
        <View style={styles.previousResult}>
          <Text style={practiceStyles.detail}>Lần làm gần nhất</Text>
          <PracticeStatusBadge status={previousResult.correct ? 'correct' : 'incorrect'} />
        </View>
      )}
      {options.map((option, index) => (
        <Pressable
          key={index}
          accessibilityRole="radio"
          aria-checked={index === selected}
          disabled={checked}
          onPress={() => setSelected(index)}
          style={[styles.option, index === selected && styles.selected, checked && index === answer && styles.correct, checked && index === selected && !correct && styles.incorrect]}
        >
          <Ionicons aria-hidden name={checked && index === answer ? 'checkmark-circle' : index === selected ? 'radio-button-on' : 'radio-button-off'} size={19} color={cosmic.text} />
          <Text style={styles.optionText}>{option}</Text>
        </Pressable>
      ))}
      {checked ? (
        <Animated.View aria-live="polite" accessibilityLiveRegion="polite" style={[styles.result, correct ? styles.correct : styles.incorrect, { transform: [{ translateX: feedback }] }]}>
          <View style={styles.resultRow}>
            <View style={styles.headingCopy}>
              <Text style={practiceStyles.heading}>{correct ? 'Chính xác!' : 'Chưa đúng.'}</Text>
              <Text style={styles.passage}>Đáp án đúng: {options[answer]}</Text>
              {review && <Text style={practiceStyles.detail}>{review}</Text>}
            </View>
            <Image nativeID={correct ? 'cosmic-bom-celebrate' : undefined} source={explorerBom} style={styles.feedbackArt} resizeMode="contain" accessible={false} />
          </View>
          {correct && <RewardBurst />}
        </Animated.View>
      ) : (
        <AppButton title="Kiểm tra đáp án" icon="checkmark-outline" disabled={selected === null || !ready} onPress={() => {
          if (selected === null || !ready || recorded.current) return;
          recorded.current = true;
          recordAnswer(correct, practiceId);
          setChecked(true);
          if (!correct && motion) {
            Animated.sequence([-5, 4, -2, 0].map(toValue => Animated.timing(feedback, {
              toValue, duration: 45, useNativeDriver: Platform.OS !== 'web', isInteraction: false,
            }))).start();
          }
        }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { maxWidth: 800 },
  back: { alignSelf: 'flex-start' },
  heading: { ...glassCard, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15 },
  headingCopy: { gap: 4, flex: 1, minWidth: 0 },
  reading: { backgroundColor: cosmic.iceSurface, borderColor: cosmic.iceEdge },
  passage: { color: cosmic.text, fontSize: 16, lineHeight: 25 },
  previousResult: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 7 },
  option: { ...gameButton, flexDirection: 'row', alignItems: 'center', backgroundColor: cosmic.glass, borderColor: cosmic.border, gap: 10, padding: 11, minHeight: 46 },
  optionText: { flex: 1, color: cosmic.text, fontSize: 15, lineHeight: 21 },
  selected: { backgroundColor: cosmic.violetSurface, borderColor: cosmic.actionEdge },
  correct: { backgroundColor: cosmic.mintSurface, borderColor: cosmic.mintEdge },
  incorrect: { backgroundColor: cosmic.dangerSurface, borderColor: cosmic.dangerEdge },
  result: { borderRadius: 12, borderWidth: 1, padding: 13, gap: 4 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  feedbackArt: { width: 64, height: 64 },
  source: { gap: 4 },
  sourceLink: { color: cosmic.ice, fontSize: 14, fontWeight: '700', textDecorationLine: 'underline', paddingVertical: 8 },
});
