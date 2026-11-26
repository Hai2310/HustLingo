import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { useLearning } from '@/contexts/LearningContext';
import { vocabulary } from '../data/vocabulary';
import { buildReviewQueue, describeInterval, reviewWord, statusCounts } from '../engine/srs';
import { isTemplateExample } from '../engine/quiz';
import { makeResultId } from '../engine/analytics';
import { usePracticeData } from '../hooks/usePracticeData';
import { useSpeech } from '../hooks/useSpeech';
import { useElapsed } from '../hooks/useTimer';
import type { AnswerRecord, ReviewGrade } from '../types';
import { Card, Chips, FieldLabel, PButton, PracticeShell, ProgressBar, StateView, Stat, ui } from '../components/PracticeUI';

const GRADES: { grade: ReviewGrade; label: string; color: string; background: string }[] = [
  { grade: 'again', label: 'Quên', color: colors.error, background: colors.errorSoft },
  { grade: 'hard', label: 'Khó', color: colors.warning, background: colors.warningSoft },
  { grade: 'good', label: 'Nhớ', color: colors.blue, background: colors.blueSoft },
  { grade: 'easy', label: 'Dễ', color: colors.success, background: colors.successSoft },
];
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'].map(level => ({ value: level, label: level }));

export function ReviewScreen() {
  const { state } = useLearning();
  const practice = usePracticeData();
  const speech = useSpeech();
  const [level, setLevel] = useState('A1');
  const [queue, setQueue] = useState<string[] | null>(null);
  const [position, setPosition] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const answers = useRef<AnswerRecord[]>([]);
  const requeued = useRef(new Set<string>());
  const timer = useElapsed(!!queue);
  const byId = useMemo(() => new Map(vocabulary.map(word => [word.id, word])), []);
  const now = new Date();
  const counts = statusCounts(practice.data, now);

  const candidates = useMemo(() => {
    const flagged = [...state.reviewWordIds, ...state.savedWordIds].filter(id => byId.has(id));
    // Then the most frequent words of the chosen level the learner has not met yet.
    const fresh = vocabulary.filter(word => (word.cefrLevel ?? word.difficulty) === level && !practice.data.srs[word.id]).sort((a, b) => (a.frequencyRank ?? 1e9) - (b.frequencyRank ?? 1e9)).slice(0, 40).map(word => word.id);
    return [...new Set([...flagged, ...fresh])];
  }, [state.reviewWordIds, state.savedWordIds, level, practice.data.srs, byId]);
  const preview = useMemo(() => buildReviewQueue(practice.data, candidates, new Date()), [practice.data, candidates]);

  function start() {
    answers.current = []; requeued.current = new Set();
    setQueue(preview); setPosition(0); setFlipped(false); timer.reset();
  }

  async function finish(finalAnswers: AnswerRecord[]) {
    const now = new Date(), id = makeResultId('review', now);
    await practice.saveResult({ id, mode: 'review', title: `Ôn tập flashcard · ${finalAnswers.length} lượt`, correct: finalAnswers.filter(a => a.correct).length, total: finalAnswers.length, durationSeconds: timer.read(), finishedAt: now.toISOString(), answers: finalAnswers });
    router.replace({ pathname: '/practice/result', params: { id } });
  }

  function grade(value: ReviewGrade) {
    if (!queue) return;
    const wordId = queue[position], word = byId.get(wordId)!;
    practice.reviewWord(wordId, value);
    answers.current.push({ questionId: `${wordId}:review:${answers.current.length}`, kind: 'meaning', wordId, correct: value !== 'again', prompt: word.term, given: GRADES.find(g => g.grade === value)!.label, expected: word.translation });
    let nextQueue = queue;
    // A forgotten card comes back once at the end of this session.
    if (value === 'again' && !requeued.current.has(wordId)) { requeued.current.add(wordId); nextQueue = [...queue, wordId]; setQueue(nextQueue); }
    if (position + 1 >= nextQueue.length) { void finish([...answers.current]); return; }
    setPosition(position + 1); setFlipped(false);
  }

  if (!queue) {
    return <PracticeShell kicker="SPACED REPETITION" title="Ôn tập" subtitle="Lật thẻ, tự nhớ nghĩa rồi chấm mức độ. Từ quên sẽ quay lại sau 10 phút; từ nhớ tốt sẽ giãn dần 1 → 3 → 8 ngày…">
      <Card style={{ gap: 16 }}>
        <View style={styles.statRow}>
          <Stat value={practice.ready ? preview.length : '—'} label="thẻ trong phiên này" />
          <Stat value={counts.learning} label="đang học" />
          <Stat value={counts.review} label="cần ôn" />
          <Stat value={counts.mastered} label="đã nhớ (≥ 21 ngày)" />
        </View>
        <View>
          <FieldLabel>TỪ MỚI LẤY THEO TRÌNH ĐỘ</FieldLabel>
          <Chips options={LEVELS} value={level} onChange={setLevel} label="Trình độ từ mới" />
          <Text style={[ui.muted, { marginTop: 10 }]}>Thứ tự: từ đến hạn → từ bạn đã lưu/đánh dấu trong Bài học → từ mới thông dụng nhất (tối đa 8 từ mới mỗi phiên).</Text>
        </View>
        <PButton label={preview.length ? `Bắt đầu ôn ${preview.length} thẻ` : 'Không có thẻ'} icon="play" disabled={!preview.length || !practice.ready} onPress={start} />
      </Card>
    </PracticeShell>;
  }

  const wordId = queue[position];
  const word = byId.get(wordId);
  if (!word) return <PracticeShell title="Ôn tập"><StateView kind="error" title="Không tìm thấy thẻ" action="Quay lại" onAction={() => setQueue(null)} /></PracticeShell>;
  const record = practice.data.srs[wordId];
  const at = new Date();

  return <PracticeShell kicker={`THẺ ${position + 1} / ${queue.length}`} title="Ôn tập" onBack={() => setQueue(null)} backLabel="Dừng phiên">
    <ProgressBar percent={position / queue.length * 100} label="Tiến độ phiên ôn" />
    {/* The card is a View; only the word area flips it, so the speaker is not a button inside a button on web. */}
    <View style={[styles.card, flipped && styles.cardBack]}>
      <View style={styles.cardTop}>
        <Text style={styles.tag}>{record ? (record.wrongCount ? `Đã quên ${record.wrongCount} lần` : `Đã nhớ ${record.correctCount} lần`) : 'TỪ MỚI'}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Nghe phát âm" onPress={() => speech.speak(word.id, word.term, 0.85)} style={styles.speak}><Ionicons name={speech.speakingId === word.id ? 'volume-high' : 'volume-high-outline'} size={20} color={colors.primary} /></Pressable>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={flipped ? `${word.term}: ${word.translation}` : 'Lật thẻ để xem nghĩa'} onPress={() => setFlipped(true)} disabled={flipped} style={styles.face}>
      <Text style={styles.term}>{word.term}</Text>
      <Text style={styles.meta}>{[word.ipa || word.pronunciation, word.partOfSpeech, word.cefrLevel].filter(Boolean).join(' · ')}</Text>
      {flipped ? <View style={styles.back}>
        <Text style={styles.translation}>{word.translation}</Text>
        {word.exampleSentence && !isTemplateExample(word.exampleSentence) ? <><Text style={styles.example}>“{word.exampleSentence}”</Text>{word.exampleTranslation ? <Text style={ui.muted}>{word.exampleTranslation}</Text> : null}</> : null}
      </View> : <Text style={styles.flipHint}>Nghĩ nghĩa của từ, rồi chạm để lật thẻ</Text>}
      </Pressable>
    </View>
    {flipped ? <View style={styles.grades}>
      {GRADES.map(item => <Pressable key={item.grade} accessibilityRole="button" accessibilityLabel={`${item.label}, ôn lại sau ${describeInterval(reviewWord(record, wordId, item.grade, at), at)}`} onPress={() => grade(item.grade)} style={({ pressed }) => [styles.grade, { backgroundColor: item.background }, pressed && { opacity: .8 }]}>
        <Text style={[styles.gradeLabel, { color: item.color }]}>{item.label}</Text>
        <Text style={styles.gradeNext}>{describeInterval(reviewWord(record, wordId, item.grade, at), at)}</Text>
      </Pressable>)}
    </View> : <PButton label="Lật thẻ" icon="swap-horizontal" style={{ marginTop: 14 }} onPress={() => setFlipped(true)} />}
  </PracticeShell>;
}

export default ReviewScreen;

const styles = StyleSheet.create({
  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  card: { marginTop: 16, minHeight: 300, backgroundColor: colors.white, borderRadius: 22, borderWidth: 1, borderColor: colors.border, padding: 24, alignItems: 'center' },
  cardBack: { borderColor: colors.primaryWash },
  face: { flex: 1, alignSelf: 'stretch', alignItems: 'center' },
  cardTop: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { fontSize: 10.5, fontWeight: '800', letterSpacing: .8, color: colors.textMuted },
  speak: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  term: { fontSize: 40, fontWeight: '800', color: colors.text, letterSpacing: -1, marginTop: 26, textAlign: 'center' },
  meta: { fontSize: 13, color: colors.textSecondary, marginTop: 6 },
  flipHint: { fontSize: 13, color: colors.textMuted, marginTop: 'auto', paddingTop: 30 },
  back: { alignSelf: 'stretch', borderTopWidth: 1, borderTopColor: colors.border, marginTop: 22, paddingTop: 18, gap: 8, alignItems: 'center' },
  translation: { fontSize: 19, lineHeight: 27, fontWeight: '700', color: colors.primaryDark, textAlign: 'center' },
  example: { fontSize: 14, lineHeight: 21, color: colors.text, textAlign: 'center', fontStyle: 'italic' },
  grades: { flexDirection: 'row', gap: 8, marginTop: 14 },
  grade: { flex: 1, minHeight: 62, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  gradeLabel: { fontSize: 15, fontWeight: '800' },
  gradeNext: { fontSize: 11, color: colors.textSecondary, marginTop: 3 },
});
