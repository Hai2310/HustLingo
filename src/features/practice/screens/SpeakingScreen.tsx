import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/theme/colors';
import { SPEAKING_ITEMS, SPEAKING_RUBRIC, type SpeakingItem } from '../data/skillBanks';
import { makeResultId } from '../engine/analytics';
import { usePracticeData } from '../hooks/usePracticeData';
import { useSpeech } from '../hooks/useSpeech';
import { useElapsed } from '../hooks/useTimer';
import { ItemList } from '../components/ItemList';
import { Recorder } from '../components/Recorder';
import { Card, Notice, PButton, PracticeShell, ui } from '../components/PracticeUI';

const TYPE_LABEL: Record<SpeakingItem['type'], string> = { repeat: 'Nói theo mẫu', answer: 'Trả lời câu hỏi', describe: 'Mô tả' };

export function SpeakingScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [openId, setOpenId] = useState<string | null>(params.id && SPEAKING_ITEMS.some(item => item.id === params.id) ? params.id : null);
  const { data } = usePracticeData();
  const item = SPEAKING_ITEMS.find(entry => entry.id === openId);
  if (item) return <SpeakingSession key={item.id} item={item} onExit={() => setOpenId(null)} />;
  return <PracticeShell kicker="SPEAKING" title="Luyện nói" subtitle="Ghi âm → nghe lại → so với bản mẫu → tự đánh giá. Giai đoạn này chưa có chấm điểm bằng AI.">
    <ItemList mode="speaking" results={data.results} onOpen={setOpenId} items={SPEAKING_ITEMS.map(entry => ({ id: entry.id, level: entry.level, title: entry.title, subtitle: TYPE_LABEL[entry.type] }))} />
  </PracticeShell>;
}

function SpeakingSession({ item, onExit }: { item: SpeakingItem; onExit(): void }) {
  const practice = usePracticeData();
  const speech = useSpeech();
  const timer = useElapsed();
  const [takes, setTakes] = useState(0);
  const [showSample, setShowSample] = useState(item.type === 'repeat');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const rated = SPEAKING_RUBRIC.every(criterion => ratings[criterion.id]);
  const sampleId = `sample-${item.id}`;

  async function save() {
    setSaving(true);
    const now = new Date(), id = makeResultId('speaking', now);
    await practice.saveResult({
      id, mode: 'speaking', title: `Speaking · ${item.title}`, level: item.level, correct: 0, total: 0, durationSeconds: timer.read(), finishedAt: now.toISOString(),
      answers: [{ questionId: item.id, kind: 'speaking', section: item.id, correct: true, prompt: item.prompt }],
      selfAssessment: SPEAKING_RUBRIC.map(criterion => ({ id: criterion.id, label: criterion.label, score: ratings[criterion.id], max: 5 })),
    });
    router.push({ pathname: '/practice/result', params: { id } });
    setSaving(false);
  }

  return <PracticeShell kicker={`SPEAKING · ${item.level} · ${TYPE_LABEL[item.type].toUpperCase()}`} title={item.title} onBack={onExit} backLabel="Danh sách bài nói">
    <Card style={{ gap: 12 }}>
      <Text style={styles.prompt}>{item.prompt}</Text>
      {item.type === 'repeat' ? <Text style={styles.sample}>“{item.sample}”</Text> : null}
      {item.vi ? <Text style={ui.muted}>{item.vi}</Text> : null}
      <View style={styles.tips}>{item.tips.map(tip => <View key={tip} style={styles.tip}><Ionicons name="bulb-outline" size={15} color={colors.warning} /><Text style={styles.tipText}>{tip}</Text></View>)}</View>
    </Card>

    <Text style={ui.sectionTitle}>1 · Ghi âm</Text>
    <Card><Recorder maxSeconds={item.type === 'repeat' ? 30 : 150} onRecorded={() => setTakes(value => value + 1)} /></Card>

    <Text style={ui.sectionTitle}>2 · So sánh với bản mẫu</Text>
    <Card style={{ gap: 12 }}>
      {showSample ? <>
        {item.type !== 'repeat' ? <Text style={styles.sampleBody}>{item.sample}</Text> : null}
        <View style={ui.actions}><PButton label={speech.speakingId === sampleId ? 'Dừng' : 'Nghe bản mẫu'} icon={speech.speakingId === sampleId ? 'stop' : 'volume-high-outline'} variant="dark" onPress={() => speech.speakingId === sampleId ? void speech.stop() : void speech.speak(sampleId, item.sample, 0.9)} />
          <PButton label="Nghe chậm" variant="secondary" icon="speedometer-outline" onPress={() => speech.speak(sampleId, item.sample, 0.7)} /></View>
      </> : <>
        <Text style={ui.body}>Nên tự nói trước rồi mới xem bài mẫu để không bị “học thuộc”.</Text>
        <PButton label={takes ? 'Xem bài mẫu' : 'Xem bài mẫu (chưa ghi âm)'} variant="secondary" icon="eye-outline" onPress={() => setShowSample(true)} />
      </>}
      {speech.error ? <Notice tone="error" text={speech.error} /> : null}
    </Card>

    <Text style={ui.sectionTitle}>3 · Tự đánh giá</Text>
    <Card style={{ gap: 14 }}>
      <Text style={ui.muted}>1 = còn khó khăn · 3 = khá · 5 = gần như bản mẫu. Điểm chỉ để bạn theo dõi tiến bộ, không phải điểm chấm chính thức.</Text>
      {SPEAKING_RUBRIC.map(criterion => <View key={criterion.id} style={styles.rubricRow}>
        <Text style={styles.rubricLabel}>{criterion.label}</Text>
        <View style={styles.scale}>{[1, 2, 3, 4, 5].map(score => {
          const selected = ratings[criterion.id] === score;
          return <Pressable key={score} accessibilityRole="radio" accessibilityState={{ checked: selected }} accessibilityLabel={`${criterion.label} ${score} trên 5`} onPress={() => setRatings(previous => ({ ...previous, [criterion.id]: score }))} style={[styles.dot, selected && styles.dotSelected]}>
            <Text style={[styles.dotText, selected && { color: colors.white }]}>{score}</Text>
          </Pressable>;
        })}</View>
      </View>)}
      <PButton label={!takes ? 'Hãy ghi âm ít nhất 1 lần' : rated ? 'Lưu kết quả' : 'Chấm đủ 4 tiêu chí để lưu'} icon="checkmark-done" disabled={!takes || !rated || saving} onPress={() => { void save(); }} />
    </Card>
  </PracticeShell>;
}

export default SpeakingScreen;

const styles = StyleSheet.create({
  prompt: { fontSize: 16, lineHeight: 24, color: colors.text, fontWeight: '600' },
  sample: { fontSize: 22, lineHeight: 31, fontWeight: '800', color: colors.text, letterSpacing: -.3 },
  sampleBody: { fontSize: 15, lineHeight: 25, color: colors.text },
  tips: { gap: 6 },
  tip: { flexDirection: 'row', gap: 7, alignItems: 'flex-start' },
  tipText: { flex: 1, fontSize: 12.5, lineHeight: 19, color: colors.textSecondary },
  rubricRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  rubricLabel: { fontSize: 14, fontWeight: '700', color: colors.text, minWidth: 110 },
  scale: { flexDirection: 'row', gap: 6 },
  dot: { width: 40, height: 40, borderRadius: 11, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  dotSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
});
