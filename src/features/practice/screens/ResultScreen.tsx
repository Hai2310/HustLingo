import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { colors } from '@/theme/colors';
import { PRACTICE_MODES } from '../data/practiceModes';
import { MODE_LABELS, statsByKind, suggestions } from '../engine/analytics';
import { formatClock } from '../engine/exam';
import { usePracticeData } from '../hooks/usePracticeData';
import { Card, PButton, PracticeShell, ProgressBar, StateView, Stat, ui } from '../components/PracticeUI';
import type { AnswerRecord } from '../types';

const scoreColor = (percent: number) => percent >= 70 ? colors.success : percent >= 40 ? colors.warning : colors.error;
const SECTION_LABEL: Record<string, string> = { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' };

export function ResultScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data, ready } = usePracticeData();
  const [showAll, setShowAll] = useState(false);
  const result = data.results.find(item => item.id === id);
  const kinds = useMemo(() => result ? statsByKind(result.answers.filter(answer => answer.kind !== 'writing' && answer.kind !== 'speaking')) : [], [result]);
  const tips = useMemo(() => result ? suggestions(result.answers) : [], [result]);
  const sections = useMemo(() => {
    if (!result || (result.mode !== 'toeic' && result.mode !== 'ielts')) return [];
    const map = new Map<string, { correct: number; total: number }>();
    for (const answer of result.answers) {
      const key = answer.section?.split(':')[0] ?? 'other';
      const entry = map.get(key) ?? { correct: 0, total: 0 };
      entry.total += 1; if (answer.correct) entry.correct += 1; map.set(key, entry);
    }
    return [...map.entries()];
  }, [result]);

  if (!ready) return <PracticeShell title="Kết quả"><StateView kind="loading" title="Đang mở kết quả" /></PracticeShell>;
  if (!result) return <PracticeShell title="Kết quả"><StateView kind="empty" title="Không tìm thấy kết quả" description="Kết quả có thể đã bị xóa hoặc thuộc tài khoản khác." action="Về Luyện tập" onAction={() => router.replace('/(tabs)/practice')} /></PracticeShell>;

  const scored = result.total > 0;
  const percent = scored ? Math.round(result.correct / result.total * 100) : 0;
  const wrong = result.answers.filter(answer => !answer.correct && answer.kind !== 'writing' && answer.kind !== 'speaking');
  const listed = showAll ? result.answers.filter(answer => answer.kind !== 'writing' && answer.kind !== 'speaking') : wrong;
  const modeRoute = PRACTICE_MODES.find(mode => mode.id === result.mode)?.route ?? '/(tabs)/practice';

  return <PracticeShell kicker={`KẾT QUẢ · ${MODE_LABELS[result.mode].toUpperCase()}`} title={result.title} subtitle={`${new Date(result.finishedAt).toLocaleString('vi-VN')} · ${formatClock(result.durationSeconds)}`}>
    <Card tone="dark" style={{ gap: 16 }}>
      {scored ? <>
        <View style={styles.scoreRow}>
          <Text style={[styles.percent, { color: percent >= 70 ? '#7BE0B0' : percent >= 40 ? '#FFC979' : '#FF9AA8' }]}>{percent}%</Text>
          <View style={{ flex: 1, minWidth: 160 }}><Text style={styles.scoreTitle}>{percent >= 85 ? 'Xuất sắc!' : percent >= 70 ? 'Làm tốt lắm!' : percent >= 40 ? 'Khá ổn, cố thêm chút nữa' : 'Cần ôn lại phần này'}</Text><Text style={styles.scoreSub}>{result.correct} / {result.total} câu đúng · {wrong.length} câu sai</Text></View>
        </View>
        <ProgressBar percent={percent} label={`${percent}% đúng`} color={percent >= 70 ? colors.mint : percent >= 40 ? colors.orange : colors.coral} />
      </> : <Text style={styles.scoreTitle}>Bài tự đánh giá</Text>}
      {result.estimate ? <View style={styles.estimate}><Text style={styles.estimateValue}>{result.estimate.value}</Text><Text style={styles.scoreSub}>{result.estimate.label}. Chỉ để tham khảo, không thay thế bài thi thật.</Text></View> : null}
      <View style={styles.statRow}><Stat tone="dark" value={formatClock(result.durationSeconds)} label="thời gian" />{scored ? <Stat tone="dark" value={`${Math.round(result.durationSeconds / Math.max(1, result.total))}s`} label="trung bình / câu" /> : null}</View>
    </Card>

    {result.selfAssessment?.length ? <><Text style={ui.sectionTitle}>Tự đánh giá</Text><Card style={{ gap: 12 }}>
      {result.selfAssessment.map(item => <View key={item.id} style={{ gap: 6 }}>
        <View style={styles.rowBetween}><Text style={styles.label}>{item.label}</Text><Text style={styles.value}>{item.score}/{item.max}</Text></View>
        <ProgressBar percent={item.score / item.max * 100} label={item.label} color={scoreColor(item.score / item.max * 100)} />
      </View>)}
    </Card></> : null}

    {sections.length ? <><Text style={ui.sectionTitle}>Theo phần thi</Text><Card style={{ gap: 12 }}>
      {sections.map(([key, value]) => { const p = Math.round(value.correct / value.total * 100); return <View key={key} style={{ gap: 6 }}><View style={styles.rowBetween}><Text style={styles.label}>{SECTION_LABEL[key] ?? key}</Text><Text style={styles.value}>{value.correct}/{value.total} · {p}%</Text></View><ProgressBar percent={p} label={key} color={scoreColor(p)} /></View>; })}
    </Card></> : null}

    {kinds.length > 1 ? <><Text style={ui.sectionTitle}>Theo dạng câu hỏi</Text><Card style={{ gap: 12 }}>
      {kinds.map(kind => <View key={kind.kind} style={{ gap: 6 }}><View style={styles.rowBetween}><Text style={styles.label}>{kind.label}</Text><Text style={styles.value}>{kind.correct}/{kind.total}</Text></View><ProgressBar percent={kind.percent} label={kind.label} color={scoreColor(kind.percent)} /></View>)}
    </Card></> : null}

    {tips.length ? <><Text style={ui.sectionTitle}>Gợi ý phần cần ôn</Text><View style={{ gap: 10 }}>
      {tips.map(tip => <Card key={tip.kind} tone="soft" style={styles.tip}><Ionicons name="bulb-outline" size={20} color={colors.warning} /><View style={{ flex: 1 }}><Text style={styles.label}>{tip.label} · {tip.percent}%</Text><Text style={ui.body}>{tip.advice}</Text></View></Card>)}
    </View></> : null}

    {result.response ? <><Text style={ui.sectionTitle}>Bài viết của bạn</Text><Card><Text style={styles.response}>{result.response}</Text></Card></> : null}

    {scored ? <>
      <View style={styles.sectionHead}>
        <Text style={[ui.sectionTitle, { marginTop: 0, marginBottom: 0 }]}>{showAll ? 'Tất cả câu trả lời' : `Câu sai (${wrong.length})`}</Text>
        <Pressable accessibilityRole="button" onPress={() => setShowAll(value => !value)} style={{ minHeight: 40, justifyContent: 'center' }}><Text style={styles.link}>{showAll ? 'Chỉ câu sai' : 'Xem tất cả'}</Text></Pressable>
      </View>
      {listed.length ? <View style={{ gap: 10 }}>{listed.map((answer, index) => <AnswerRow key={`${answer.questionId}-${index}`} answer={answer} />)}</View>
        : <Card><Text style={ui.body}>Không có câu sai. Tuyệt vời! 🎉</Text></Card>}
    </> : null}

    <View style={[ui.actions, { marginTop: 22 }]}>
      <PButton label="Luyện lại" icon="refresh" onPress={() => router.replace(modeRoute as Href)} />
      {wrong.some(answer => answer.wordId) ? <PButton label="Ôn từ sai" variant="secondary" icon="albums-outline" onPress={() => router.replace('/practice/review')} /> : null}
      <PButton label="Phân tích tổng" variant="secondary" icon="stats-chart-outline" onPress={() => router.push('/practice/analytics')} />
      <PButton label="Về Luyện tập" variant="ghost" onPress={() => router.replace('/(tabs)/practice')} />
    </View>
  </PracticeShell>;
}

function AnswerRow({ answer }: { answer: AnswerRecord }) {
  return <Card style={{ gap: 6 }}>
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
      <Ionicons name={answer.correct ? 'checkmark-circle' : 'close-circle'} size={20} color={answer.correct ? colors.success : colors.error} />
      <Text style={[styles.label, { flex: 1 }]}>{answer.prompt}</Text>
    </View>
    {!answer.correct ? <Text style={styles.given}>Bạn chọn: {answer.given}</Text> : null}
    <Text style={styles.expected}>Đáp án: {answer.expected}</Text>
    {answer.explanation ? <Text style={ui.muted}>{answer.explanation}</Text> : null}
  </Card>;
}

export default ResultScreen;

const styles = StyleSheet.create({
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 18, flexWrap: 'wrap' },
  percent: { fontSize: 52, fontWeight: '800', letterSpacing: -2 },
  scoreTitle: { color: colors.white, fontSize: 20, fontWeight: '800' },
  scoreSub: { color: '#C4BEC1', fontSize: 13, marginTop: 4, lineHeight: 19 },
  estimate: { backgroundColor: '#2B2B32', borderRadius: 14, padding: 14 },
  estimateValue: { color: colors.white, fontSize: 30, fontWeight: '800' },
  statRow: { flexDirection: 'row', gap: 24, flexWrap: 'wrap' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 20 },
  value: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, fontVariant: ['tabular-nums'] },
  tip: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  response: { fontSize: 15, lineHeight: 25, color: colors.text },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, marginBottom: 12 },
  link: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  given: { fontSize: 13, color: colors.error, lineHeight: 19 },
  expected: { fontSize: 13, color: colors.success, fontWeight: '700', lineHeight: 19 },
});
