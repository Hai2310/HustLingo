import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { useLearning } from '@/contexts/LearningContext';
import { vocabulary } from '../data/vocabulary';
import { buildVocabularyQuiz, isChoiceCorrect, isTemplateExample, isTypingCorrect, type VocabularyQuizMode } from '../engine/quiz';
import { makeResultId } from '../engine/analytics';
import { usePracticeData } from '../hooks/usePracticeData';
import { useSpeech } from '../hooks/useSpeech';
import { useElapsed } from '../hooks/useTimer';
import type { AnswerRecord, QuizQuestion } from '../types';
import { Card, ChoiceQuestionView, Chips, FieldLabel, Notice, PButton, PracticeShell, ProgressBar, StateView, ui } from '../components/PracticeUI';

const MODES: { value: VocabularyQuizMode; label: string }[] = [
  { value: 'mixed', label: 'Trộn các dạng' }, { value: 'en-vi', label: 'Anh → Việt' }, { value: 'vi-en', label: 'Việt → Anh' }, { value: 'fill-blank', label: 'Điền từ' },
];
const LEVELS = [{ value: 'all', label: 'Tất cả' }, ...['A1', 'A2', 'B1', 'B2', 'C1'].map(level => ({ value: level, label: level }))] as const;
const COUNTS = [{ value: 10, label: '10 câu' }, { value: 20, label: '20 câu' }] as const;
type Source = 'level' | 'mine';

export function VocabularyQuizScreen() {
  const { state } = useLearning();
  const practice = usePracticeData();
  const [mode, setMode] = useState<VocabularyQuizMode>('mixed');
  const [level, setLevel] = useState<string>('all');
  const [count, setCount] = useState<number>(10);
  const [source, setSource] = useState<Source>('level');
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [typed, setTyped] = useState('');
  const [revealed, setRevealed] = useState(false);
  const answers = useRef<AnswerRecord[]>([]);
  const timer = useElapsed(!!questions);
  const speech = useSpeech();

  const myWordIds = useMemo(() => [...new Set([...state.reviewWordIds, ...state.savedWordIds])], [state.reviewWordIds, state.savedWordIds]);
  const byId = useMemo(() => new Map(vocabulary.map(word => [word.id, word])), []);
  const myWords = useMemo(() => myWordIds.map(id => byId.get(id)).filter((word): word is NonNullable<typeof word> => !!word), [myWordIds, byId]);

  function start() {
    const targets = source === 'mine' && myWords.length >= 4 ? myWords : level === 'all' ? vocabulary : vocabulary.filter(word => (word.cefrLevel ?? word.difficulty) === level);
    answers.current = [];
    setQuestions(buildVocabularyQuiz(targets, vocabulary, { count, mode }));
    setIndex(0); setSelected([]); setTyped(''); setRevealed(false);
    timer.reset();
  }

  const question = questions?.[index];

  function check() {
    if (!question || revealed) return;
    const correct = question.type === 'choice' ? isChoiceCorrect(question.answers, selected) : isTypingCorrect(question.accepted, typed);
    const word = question.wordId ? byId.get(question.wordId) : undefined;
    answers.current.push({
      questionId: question.id, kind: question.kind, correct, wordId: question.wordId,
      prompt: question.prompt,
      given: question.type === 'choice' ? selected.map(i => question.options[i]).join(', ') : typed.trim() || '(bỏ trống)',
      expected: question.type === 'choice' ? question.answers.map(i => question.options[i]).join(', ') : question.accepted[0],
      explanation: word ? `${word.term} — ${word.translation}` : question.explanation,
    });
    practice.recordQuizAnswer(correct, question.wordId);
    setRevealed(true);
  }

  async function next() {
    if (!questions) return;
    if (index + 1 < questions.length) { setIndex(index + 1); setSelected([]); setTyped(''); setRevealed(false); return; }
    const now = new Date();
    const correct = answers.current.filter(answer => answer.correct).length;
    const id = makeResultId('vocabulary', now);
    await practice.saveResult({
      id, mode: 'vocabulary', title: `Vocabulary Quiz · ${MODES.find(item => item.value === mode)!.label}${source === 'mine' ? ' · từ của tôi' : level !== 'all' ? ` · ${level}` : ''}`,
      level: level === 'all' ? undefined : level, correct, total: answers.current.length, durationSeconds: timer.read(), finishedAt: now.toISOString(), answers: [...answers.current],
    });
    router.replace({ pathname: '/practice/result', params: { id } });
  }

  if (!questions) {
    return <PracticeShell kicker="VOCABULARY QUIZ" title="Kiểm tra từ vựng" subtitle={`Ngân hàng ${vocabulary.length.toLocaleString('vi-VN')} từ đã kiểm duyệt. Mỗi câu trả lời cập nhật lịch ôn tập của từ đó.`}>
      <Card>
        <FieldLabel>DẠNG CÂU HỎI</FieldLabel>
        <Chips options={MODES} value={mode} onChange={setMode} label="Dạng câu hỏi" />
        <FieldLabel>NGUỒN TỪ</FieldLabel>
        <Chips options={[{ value: 'level' as Source, label: 'Theo trình độ' }, { value: 'mine' as Source, label: `Từ đã lưu / cần ôn (${myWords.length})` }]} value={source} onChange={setSource} label="Nguồn từ" />
        {source === 'mine' && myWords.length < 4 ? <View style={{ marginTop: 12 }}><Notice tone="warning" text="Cần ít nhất 4 từ đã lưu hoặc cần ôn. Hãy lưu từ trong Bài học — tạm thời quiz sẽ dùng ngân hàng chung." /></View> : null}
        {source === 'level' ? <><FieldLabel>TRÌNH ĐỘ CEFR</FieldLabel><Chips options={LEVELS} value={level} onChange={setLevel} label="Trình độ" /></> : null}
        <FieldLabel>SỐ CÂU</FieldLabel>
        <Chips options={COUNTS} value={count} onChange={setCount} label="Số câu" />
        <View style={{ marginTop: 22 }}><PButton label="Bắt đầu" icon="play" onPress={start} /></View>
      </Card>
    </PracticeShell>;
  }

  if (!question) return <PracticeShell title="Vocabulary Quiz"><StateView kind="empty" title="Không đủ từ cho bộ lọc này" description="Hãy chọn trình độ khác." action="Chọn lại" onAction={() => setQuestions(null)} /></PracticeShell>;

  const word = question.wordId ? byId.get(question.wordId) : undefined;
  const typedCorrect = question.type === 'typing' && revealed && isTypingCorrect(question.accepted, typed);
  return <PracticeShell kicker={`CÂU ${index + 1} / ${questions.length}`} title="Vocabulary Quiz" onBack={() => setQuestions(null)} backLabel="Thoát bài"
    right={<Text style={styles.timer}>{Math.floor(timer.seconds / 60)}:{String(timer.seconds % 60).padStart(2, '0')}</Text>}>
    <ProgressBar percent={(index + (revealed ? 1 : 0)) / questions.length * 100} label="Tiến độ bài" />
    <Card style={{ marginTop: 16, gap: 14 }}>
      <Text style={ui.muted}>{question.kind === 'meaning' ? 'Chọn nghĩa tiếng Việt đúng' : question.kind === 'translation' ? 'Chọn từ tiếng Anh đúng' : 'Điền từ còn thiếu'}</Text>
      {question.type === 'choice' ? <>
        <View style={styles.promptRow}>
          <Text style={[styles.prompt, question.kind === 'translation' && styles.promptVi]}>{question.prompt}</Text>
          {question.kind === 'meaning' ? <Pressable accessibilityRole="button" accessibilityLabel="Nghe phát âm" onPress={() => speech.speak(question.id, question.prompt, 0.85)} style={styles.speak}><Ionicons name="volume-high-outline" size={20} color={colors.primary} /></Pressable> : null}
        </View>
        <ChoiceQuestionView question={{ ...question, prompt: '' }} selected={selected} onChange={setSelected} revealed={revealed} showExplanation={false} />
      </> : <>
        <Text style={styles.sentence}>{question.prompt}</Text>
        {question.hint ? <Text style={ui.muted}>Gợi ý: {question.hint}</Text> : null}
        <TextInput accessibilityLabel="Từ cần điền" value={typed} onChangeText={setTyped} editable={!revealed} autoCapitalize="none" autoCorrect={false} placeholder="Gõ từ tiếng Anh…" placeholderTextColor={colors.textMuted} onSubmitEditing={check} returnKeyType="done"
          style={[styles.input, revealed && { borderColor: typedCorrect ? colors.success : colors.error, backgroundColor: typedCorrect ? colors.successSoft : colors.errorSoft }]} />
      </>}
      {revealed ? <View style={[styles.feedback, { backgroundColor: answers.current[answers.current.length - 1]?.correct ? colors.successSoft : colors.errorSoft }]}>
        <Text style={[styles.feedbackTitle, { color: answers.current[answers.current.length - 1]?.correct ? colors.success : colors.error }]}>{answers.current[answers.current.length - 1]?.correct ? 'Chính xác!' : `Đáp án: ${answers.current[answers.current.length - 1]?.expected}`}</Text>
        {word ? <Text style={styles.feedbackText}><Text style={{ fontWeight: '700', color: colors.text }}>{word.term}</Text>{word.ipa ? ` ${word.ipa}` : ''}{word.partOfSpeech ? ` · ${word.partOfSpeech}` : ''} — {word.translation}</Text> : null}
        {word?.exampleSentence && !isTemplateExample(word.exampleSentence) ? <Text style={styles.feedbackText}>“{word.exampleSentence}”</Text> : null}
      </View> : null}
      <View style={ui.actions}>
        {revealed ? <PButton label={index + 1 < questions.length ? 'Câu tiếp theo' : 'Xem kết quả'} icon="arrow-forward" onPress={() => { void next(); }} />
          : <PButton label="Kiểm tra" icon="checkmark" disabled={question.type === 'choice' ? !selected.length : !typed.trim()} onPress={check} />}
      </View>
    </Card>
  </PracticeShell>;
}

export default VocabularyQuizScreen;

const styles = StyleSheet.create({
  timer: { fontSize: 15, fontWeight: '700', color: colors.textSecondary, fontVariant: ['tabular-nums'] },
  promptRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  prompt: { flex: 1, fontSize: 30, fontWeight: '800', color: colors.text, letterSpacing: -.6 },
  promptVi: { fontSize: 20, lineHeight: 28, fontWeight: '700' },
  speak: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  sentence: { fontSize: 19, lineHeight: 29, color: colors.text, fontWeight: '600' },
  input: { minHeight: 50, borderWidth: 1.2, borderColor: colors.borderStrong, borderRadius: 12, paddingHorizontal: 14, fontSize: 17, color: colors.text, backgroundColor: colors.white },
  feedback: { borderRadius: 12, padding: 13, gap: 5 },
  feedbackTitle: { fontSize: 14, fontWeight: '800' },
  feedbackText: { fontSize: 13, lineHeight: 20, color: colors.textSecondary },
});
