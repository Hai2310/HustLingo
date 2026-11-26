import React, { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/theme/colors';
import { READING_ITEMS, type ReadingItem } from '../data/skillBanks';
import { countWords } from '../engine/analytics';
import { usePracticeData } from '../hooks/usePracticeData';
import { useQuestionSet } from '../hooks/useQuestionSet';
import { useElapsed } from '../hooks/useTimer';
import { ItemList } from '../components/ItemList';
import { Card, ChoiceQuestionView, PButton, PracticeShell, ui } from '../components/PracticeUI';

export function ReadingScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [openId, setOpenId] = useState<string | null>(params.id && READING_ITEMS.some(item => item.id === params.id) ? params.id : null);
  const { data } = usePracticeData();
  const item = READING_ITEMS.find(entry => entry.id === openId);
  if (item) return <ReadingSession key={item.id} item={item} onExit={() => setOpenId(null)} />;
  return <PracticeShell kicker="READING" title="Luyện đọc" subtitle="Đọc đoạn văn, trả lời câu hỏi chi tiết, ý chính và suy luận. Bài cấp cao có câu chọn nhiều đáp án.">
    <ItemList mode="reading" results={data.results} onOpen={setOpenId} items={READING_ITEMS.map(entry => ({ id: entry.id, level: entry.level, title: entry.title, subtitle: `${countWords(entry.passage)} từ · ${entry.questions.length} câu${entry.questions.some(q => q.answers.length > 1) ? ' · có câu chọn nhiều đáp án' : ''}` }))} />
  </PracticeShell>;
}

function ReadingSession({ item, onExit }: { item: ReadingItem; onExit(): void }) {
  const set = useQuestionSet(item.questions);
  const timer = useElapsed(!set.submitted);
  const { width } = useWindowDimensions();
  const split = width >= 900;
  return <PracticeShell kicker={`READING · ${item.level}`} title={item.title} subtitle={`${countWords(item.passage)} từ · ${item.questions.length} câu hỏi`} onBack={onExit} backLabel="Danh sách bài đọc">
    <View style={[styles.layout, split && { flexDirection: 'row', alignItems: 'flex-start' }]}>
      <Card style={[styles.passage, split && { flex: 1 }]}><Text style={styles.passageText}>{item.passage}</Text></Card>
      <View style={[{ gap: 14 }, split && { flex: 1 }]}>
        {item.questions.map((question, index) => <Card key={question.id}><ChoiceQuestionView question={question} number={index + 1} selected={set.selections[question.id] ?? []} onChange={value => set.select(question.id, value)} revealed={set.submitted} /></Card>)}
        {set.submitted ? <Card tone="soft" style={{ gap: 12 }}>
          <Text style={styles.score}>{set.correctCount}/{item.questions.length} câu đúng</Text>
          <View style={ui.actions}>
            <PButton label="Xem phân tích" icon="stats-chart-outline" onPress={set.openResult} />
            <PButton label="Làm lại" variant="secondary" icon="refresh" onPress={() => { set.reset(); timer.reset(); }} />
            <PButton label="Bài khác" variant="secondary" onPress={onExit} />
          </View>
        </Card> : <PButton label={set.allAnswered ? 'Nộp bài' : `Nộp bài (${set.answeredCount}/${item.questions.length} câu đã trả lời)`} icon="send" disabled={!set.answeredCount} onPress={() => { void set.submit({ mode: 'reading', title: `Reading · ${item.title}`, level: item.level, durationSeconds: timer.read(), section: item.id }); }} />}
      </View>
    </View>
  </PracticeShell>;
}

export default ReadingScreen;

const styles = StyleSheet.create({
  layout: { gap: 14 },
  passage: { backgroundColor: '#FFFCF8' },
  passageText: { fontSize: 15.5, lineHeight: 27, color: colors.text },
  score: { fontSize: 22, fontWeight: '800', color: colors.text },
});
