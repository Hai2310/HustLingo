import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/theme/colors';
import { LISTENING_ITEMS, type ListeningItem } from '../data/skillBanks';
import { usePracticeData } from '../hooks/usePracticeData';
import { useQuestionSet } from '../hooks/useQuestionSet';
import { useSpeech } from '../hooks/useSpeech';
import { useElapsed } from '../hooks/useTimer';
import { ItemList } from '../components/ItemList';
import { AudioBar, Card, ChoiceQuestionView, Notice, PButton, PracticeShell, ui } from '../components/PracticeUI';

export function ListeningScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [openId, setOpenId] = useState<string | null>(params.id && LISTENING_ITEMS.some(item => item.id === params.id) ? params.id : null);
  const { data } = usePracticeData();
  const item = LISTENING_ITEMS.find(entry => entry.id === openId);
  if (item) return <ListeningSession key={item.id} item={item} onExit={() => setOpenId(null)} />;
  return <PracticeShell kicker="LISTENING" title="Luyện nghe" subtitle="Nghe đoạn hội thoại/bài nói, chỉnh tốc độ, nghe lại bao nhiêu lần tùy ý. Transcript hiện ra sau khi nộp bài.">
    <ItemList mode="listening" results={data.results} onOpen={setOpenId} items={LISTENING_ITEMS.map(entry => ({ id: entry.id, level: entry.level, title: entry.title, subtitle: `${entry.questions.length} câu · ${entry.context}` }))} />
  </PracticeShell>;
}

function ListeningSession({ item, onExit }: { item: ListeningItem; onExit(): void }) {
  const speech = useSpeech();
  const [rate, setRate] = useState(0.92);
  const set = useQuestionSet(item.questions);
  const timer = useElapsed(!set.submitted);
  const audioId = `audio-${item.id}`;
  const plays = speech.plays[audioId] ?? 0;

  return <PracticeShell kicker={`LISTENING · ${item.level}`} title={item.title} subtitle={item.context} onBack={onExit} backLabel="Danh sách bài nghe">
    <AudioBar playing={speech.speakingId === audioId} plays={plays} rate={rate} onRateChange={value => { setRate(value); if (speech.speakingId === audioId) void speech.speak(audioId, item.transcript, value); }} onPlay={() => speech.speak(audioId, item.transcript, rate)} onStop={speech.stop} error={speech.error} />
    {!plays && !set.submitted ? <View style={{ marginTop: 12 }}><Notice text="Nghe ít nhất một lần trước khi trả lời. Âm thanh dùng giọng đọc của thiết bị — hãy bật loa." /></View> : null}
    <Text style={ui.sectionTitle}>Câu hỏi</Text>
    <View style={{ gap: 14 }}>
      {item.questions.map((question, index) => <Card key={question.id}><ChoiceQuestionView question={question} number={index + 1} selected={set.selections[question.id] ?? []} onChange={value => set.select(question.id, value)} revealed={set.submitted} /></Card>)}
    </View>
    {set.submitted ? <>
      <Card tone="soft" style={{ marginTop: 16, gap: 8 }}>
        <Text style={styles.score}>{set.correctCount}/{item.questions.length} câu đúng</Text>
        <Text style={ui.fieldLabel}>TRANSCRIPT</Text>
        <Text style={styles.transcript}>{item.transcript}</Text>
      </Card>
      <View style={[ui.actions, { marginTop: 14 }]}>
        <PButton label="Xem phân tích" icon="stats-chart-outline" onPress={set.openResult} />
        <PButton label="Làm lại" variant="secondary" icon="refresh" onPress={() => { set.reset(); timer.reset(); }} />
        <PButton label="Bài khác" variant="secondary" onPress={onExit} />
      </View>
    </> : <View style={{ marginTop: 16, gap: 8 }}>
      <PButton label={set.allAnswered ? 'Nộp bài' : `Nộp bài (${set.answeredCount}/${item.questions.length} câu đã trả lời)`} icon="send" disabled={!set.answeredCount} onPress={() => { void speech.stop(); void set.submit({ mode: 'listening', title: `Listening · ${item.title}`, level: item.level, durationSeconds: timer.read(), section: item.id }); }} />
    </View>}
  </PracticeShell>;
}

export default ListeningScreen;

const styles = StyleSheet.create({
  score: { fontSize: 22, fontWeight: '800', color: colors.text },
  transcript: { fontSize: 15, lineHeight: 25, color: colors.text, marginTop: -4 },
});
