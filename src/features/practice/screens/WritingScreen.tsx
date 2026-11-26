import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/theme/colors';
import { WRITING_ITEMS, type WritingItem } from '../data/skillBanks';
import { countWords, makeResultId, usedPhrases } from '../engine/analytics';
import { formatClock } from '../engine/exam';
import { usePracticeData } from '../hooks/usePracticeData';
import { useElapsed } from '../hooks/useTimer';
import { ItemList } from '../components/ItemList';
import { Card, Notice, PButton, PracticeShell, ui } from '../components/PracticeUI';

export function WritingScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [openId, setOpenId] = useState<string | null>(params.id && WRITING_ITEMS.some(item => item.id === params.id) ? params.id : null);
  const { data } = usePracticeData();
  const item = WRITING_ITEMS.find(entry => entry.id === openId);
  if (item) return <WritingSession key={item.id} item={item} onExit={() => setOpenId(null)} />;
  return <PracticeShell kicker="WRITING" title="Luyện viết" subtitle="Viết theo đề, đếm từ tự động, bản nháp được lưu trên thiết bị. Bài mẫu hiện ra sau khi nộp.">
    <ItemList mode="writing" results={data.results} onOpen={setOpenId} items={WRITING_ITEMS.map(entry => ({ id: entry.id, level: entry.level, title: entry.title, subtitle: `${entry.minWords}${entry.maxWords ? `–${entry.maxWords}` : '+'} từ · ${entry.minutes} phút${data.drafts[entry.id] ? ' · có bản nháp' : ''}` }))} />
  </PracticeShell>;
}

function WritingSession({ item, onExit }: { item: WritingItem; onExit(): void }) {
  const practice = usePracticeData();
  const [text, setText] = useState(() => practice.data.drafts[item.id] ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const timer = useElapsed(!submitted);
  const words = countWords(text);
  const used = usedPhrases(text, item.usefulPhrases);
  const remaining = item.minutes * 60 - timer.seconds;
  const restored = useRef(!!practice.data.drafts[item.id]);

  // Load a draft that arrives after the first render (storage is async on first open).
  useEffect(() => { if (!text && practice.data.drafts[item.id]) { setText(practice.data.drafts[item.id]); restored.current = true; } }, [practice.ready]); // eslint-disable-line react-hooks/exhaustive-deps
  // Autosave the draft locally while typing.
  useEffect(() => {
    if (submitted) return;
    const id = setTimeout(() => { if (text !== (practice.data.drafts[item.id] ?? '')) void practice.saveDraft(item.id, text).then(() => setSavedAt(new Date())); }, 800);
    return () => clearTimeout(id);
  }, [text, submitted]); // eslint-disable-line react-hooks/exhaustive-deps

  const counterColor = words < item.minWords ? colors.warning : item.maxWords && words > item.maxWords ? colors.error : colors.success;

  async function save() {
    const now = new Date(), id = makeResultId('writing', now);
    await practice.saveResult({
      id, mode: 'writing', title: `Writing · ${item.title}`, level: item.level, correct: 0, total: 0, durationSeconds: timer.read(), finishedAt: now.toISOString(),
      answers: [{ questionId: item.id, kind: 'writing', section: item.id, correct: words >= item.minWords, prompt: item.prompt }],
      selfAssessment: [
        { id: 'length', label: `Độ dài (${words}/${item.minWords} từ)`, score: Math.min(words, item.minWords), max: item.minWords },
        { id: 'phrases', label: 'Cụm từ gợi ý đã dùng', score: used.length, max: item.usefulPhrases.length },
        { id: 'checklist', label: 'Checklist tự kiểm tra', score: item.checklist.filter((_, index) => checks[index]).length, max: item.checklist.length },
      ],
      response: text,
    });
    await practice.saveDraft(item.id, '');
    router.push({ pathname: '/practice/result', params: { id } });
  }

  return <PracticeShell kicker={`WRITING · ${item.level}`} title={item.title} onBack={onExit} backLabel="Danh sách đề viết"
    right={!submitted ? <View style={styles.clock}><Ionicons name="time-outline" size={16} color={remaining < 0 ? colors.error : colors.textSecondary} /><Text style={[styles.clockText, remaining < 0 && { color: colors.error }]}>{remaining >= 0 ? `Còn ${formatClock(remaining)}` : `Quá ${formatClock(-remaining)}`}</Text></View> : undefined}>
    <Card style={{ gap: 10 }}>
      <Text style={styles.prompt}>{item.prompt}</Text>
      <Text style={ui.muted}>Yêu cầu: {item.minWords}{item.maxWords ? `–${item.maxWords}` : '+'} từ · gợi ý {item.minutes} phút</Text>
      <View style={styles.phrases}>{item.usefulPhrases.map(phrase => {
        const on = used.includes(phrase);
        return <View key={phrase} style={[styles.phrase, on && styles.phraseOn]}>{on ? <Ionicons name="checkmark" size={12} color={colors.success} /> : null}<Text style={[styles.phraseText, on && { color: colors.success }]}>{phrase}</Text></View>;
      })}</View>
    </Card>
    {restored.current && !submitted ? <View style={{ marginTop: 12 }}><Notice text="Đã mở lại bản nháp bạn viết lần trước." /></View> : null}
    <TextInput accessibilityLabel="Bài viết của bạn" value={text} onChangeText={setText} editable={!submitted} multiline textAlignVertical="top" placeholder="Bắt đầu viết bằng tiếng Anh…" placeholderTextColor={colors.textMuted} style={[styles.editor, submitted && { backgroundColor: colors.surfaceAlt }]} />
    <View style={styles.counterRow}>
      <Text style={[styles.counter, { color: counterColor }]}>{words} từ{words < item.minWords ? ` · cần thêm ${item.minWords - words}` : item.maxWords && words > item.maxWords ? ` · vượt ${words - item.maxWords}` : ' · đạt yêu cầu'}</Text>
      <Text style={ui.muted}>{submitted ? 'Đã nộp' : savedAt ? `Đã lưu nháp ${savedAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'Tự lưu nháp khi gõ'}</Text>
    </View>

    {!submitted ? <View style={ui.actions}>
      <PButton label="Nộp bài" icon="send" disabled={!words} onPress={() => setSubmitted(true)} />
      {text ? <PButton label="Xóa nháp" variant="secondary" icon="trash-outline" onPress={() => { setText(''); void practice.saveDraft(item.id, ''); }} /> : null}
    </View> : <>
      <Text style={ui.sectionTitle}>Tự kiểm tra</Text>
      <Card style={{ gap: 10 }}>
        {item.checklist.map((line, index) => <Pressable key={line} accessibilityRole="checkbox" accessibilityState={{ checked: !!checks[index] }} onPress={() => setChecks(previous => ({ ...previous, [index]: !previous[index] }))} style={styles.check}>
          <Ionicons name={checks[index] ? 'checkbox' : 'square-outline'} size={22} color={checks[index] ? colors.success : colors.textMuted} /><Text style={styles.checkText}>{line}</Text>
        </Pressable>)}
      </Card>
      <Text style={ui.sectionTitle}>Bài mẫu tham khảo</Text>
      <Card tone="soft"><Text style={styles.sampleText}>{item.sampleAnswer}</Text><Text style={[ui.muted, { marginTop: 10 }]}>{countWords(item.sampleAnswer)} từ · đây là một cách viết, không phải đáp án duy nhất.</Text></Card>
      <View style={[ui.actions, { marginTop: 14 }]}>
        <PButton label="Lưu kết quả" icon="checkmark-done" onPress={() => { void save(); }} />
        <PButton label="Sửa tiếp" variant="secondary" icon="create-outline" onPress={() => setSubmitted(false)} />
      </View>
    </>}
  </PracticeShell>;
}

export default WritingScreen;

const styles = StyleSheet.create({
  clock: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clockText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, fontVariant: ['tabular-nums'] },
  prompt: { fontSize: 16, lineHeight: 24, color: colors.text, fontWeight: '600' },
  phrases: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  phrase: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  phraseOn: { backgroundColor: colors.successSoft, borderColor: '#BFE8D4' },
  phraseText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  editor: { marginTop: 14, minHeight: 260, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 16, padding: 16, fontSize: 15.5, lineHeight: 25, color: colors.text },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 8, marginBottom: 14 },
  counter: { fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums'] },
  check: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, minHeight: 32 },
  checkText: { flex: 1, fontSize: 14, lineHeight: 21, color: colors.text },
  sampleText: { fontSize: 15, lineHeight: 25, color: colors.text },
});
