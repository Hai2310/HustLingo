import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/theme/colors';
import { EXAM_BANK, EXAM_SECTIONS } from '../data/examBank';
import { EXAM_MODES, buildExamSession, estimateScore, formatClock, itemState, scoreExam, type ExamSession } from '../engine/exam';
import { countWords, makeResultId } from '../engine/analytics';
import { usePracticeData } from '../hooks/usePracticeData';
import { useSpeech } from '../hooks/useSpeech';
import { useElapsed } from '../hooks/useTimer';
import { Recorder } from '../components/Recorder';
import { AudioBar, Card, ChoiceQuestionView, ConfirmPanel, FieldLabel, Notice, PButton, PracticeShell, ui } from '../components/PracticeUI';
import type { ExamId, ExamModeConfig, ExamResponse, ExamSectionId } from '../types';

const TITLES: Record<ExamId, string> = { toeic: 'TOEIC', ielts: 'IELTS' };

export function ExamScreen() {
  const params = useLocalSearchParams<{ exam?: string }>();
  const exam: ExamId = params.exam === 'ielts' ? 'ielts' : 'toeic';
  const [session, setSession] = useState<ExamSession | null>(null);
  if (session) return <ExamRunner key={`${session.exam}-${session.items.length}-${session.items[0]?.item.id}`} session={session} onExit={() => setSession(null)} />;
  return <ExamSetup key={exam} exam={exam} onStart={setSession} />;
}

function ExamSetup({ exam, onStart }: { exam: ExamId; onStart(session: ExamSession): void }) {
  const sections = EXAM_SECTIONS[exam];
  const [chosen, setChosen] = useState<ExamSectionId[]>(sections.slice(0, exam === 'toeic' ? 2 : 1).map(section => section.id));
  const [mode, setMode] = useState<ExamModeConfig>(EXAM_MODES[0]);
  const available = EXAM_BANK.filter(group => group.exam === exam && chosen.includes(group.section)).reduce((sum, group) => sum + group.items.length, 0);
  const toggle = (id: ExamSectionId) => setChosen(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]);
  const preview = useMemo(() => chosen.length ? buildExamSession(EXAM_BANK, exam, chosen, mode, { seed: 1 }) : null, [exam, chosen, mode]);

  return <PracticeShell kicker={`${TITLES[exam]} PRACTICE`} title={`Luyện thi ${TITLES[exam]}`} subtitle={exam === 'toeic' ? 'Câu hỏi luyện tập theo định dạng Listening & Reading. Kết quả quy đổi chỉ mang tính ước lượng.' : 'Bốn kỹ năng trên cùng một engine. Reading/Listening tự chấm; Writing/Speaking tự đánh giá band.'}>
    <Card>
      <FieldLabel>CHỌN PHẦN THI</FieldLabel>
      <View style={{ gap: 8 }}>
        {sections.map(section => {
          const on = chosen.includes(section.id);
          return <Pressable key={section.id} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={`${section.title}: ${section.description}`} onPress={() => toggle(section.id)} style={[styles.section, on && styles.sectionOn]}>
            <Ionicons name={on ? 'checkbox' : 'square-outline'} size={22} color={on ? colors.primary : colors.textMuted} />
            <View style={{ flex: 1 }}><Text style={ui.cardTitle}>{section.title}</Text><Text style={ui.muted}>{section.description}</Text></View>
          </Pressable>;
        })}
      </View>
      <FieldLabel>CHẾ ĐỘ</FieldLabel>
      <View style={styles.modes}>
        {EXAM_MODES.map(option => {
          const on = option.id === mode.id;
          return <Pressable key={option.id} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => setMode(option)} style={[styles.mode, on && styles.sectionOn]}>
            <Text style={[ui.cardTitle, on && { color: colors.primary }]}>{option.title}</Text><Text style={ui.muted}>{option.description}</Text>
          </Pressable>;
        })}
      </View>
      <View style={styles.summary}>
        <Text style={ui.body}>{preview ? `${preview.items.length} câu${preview.timeLimitSeconds ? ` · ${Math.round(preview.timeLimitSeconds / 60)} phút` : ' · không giới hạn thời gian'}` : 'Chọn ít nhất một phần thi.'}{preview && mode.questionCount && available < mode.questionCount ? ` (ngân hàng hiện có ${available} câu)` : ''}</Text>
        <PButton label="Bắt đầu" icon="play" disabled={!preview?.items.length} onPress={() => onStart(buildExamSession(EXAM_BANK, exam, chosen, mode))} />
      </View>
    </Card>
    {chosen.includes('listening') ? <View style={{ marginTop: 14 }}><Notice text="Phần Listening dùng giọng đọc của thiết bị. Hãy bật loa hoặc đeo tai nghe." /></View> : null}
  </PracticeShell>;
}

function ExamRunner({ session, onExit }: { session: ExamSession; onExit(): void }) {
  const practice = usePracticeData();
  const speech = useSpeech();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ExamResponse>>({});
  const [confirming, setConfirming] = useState(false);
  const [rate, setRate] = useState(0.92);
  const submitted = useRef(false);
  const timer = useElapsed();
  const remaining = session.timeLimitSeconds === null ? null : session.timeLimitSeconds - timer.seconds;
  const current = session.items[index];
  const unanswered = session.items.filter(entry => itemState(entry.item, responses[entry.item.id]) === 'empty').length;
  const flagged = session.items.filter(entry => responses[entry.item.id]?.flagged).length;

  const respond = (id: string, change: Partial<ExamResponse>) => setResponses(previous => ({ ...previous, [id]: { ...previous[id], ...change } }));
  const go = (next: number) => { void speech.stop(); setIndex(Math.max(0, Math.min(session.items.length - 1, next))); setConfirming(false); };

  async function submit() {
    if (submitted.current) return;
    submitted.current = true;
    void speech.stop();
    const score = scoreExam(session, responses);
    const estimate = estimateScore(session.exam, score);
    const now = new Date(), id = makeResultId(session.exam, now);
    const productive = session.items.filter(entry => entry.item.type !== 'choice' && responses[entry.item.id]?.selfBand);
    const writing = session.items.filter(entry => entry.item.type === 'writing').map(entry => responses[entry.item.id]?.text?.trim()).filter(Boolean).join('\n\n———\n\n');
    await practice.saveResult({
      id, mode: session.exam, title: `${TITLES[session.exam]} · ${EXAM_MODES.find(mode => mode.id === session.modeId)!.title} · ${session.sections.map(s => s[0].toUpperCase() + s.slice(1)).join(' + ')}`,
      correct: score.correct, total: score.total, durationSeconds: timer.read(), finishedAt: now.toISOString(), answers: score.answers,
      estimate: estimate ?? undefined,
      selfAssessment: productive.length ? productive.map(entry => ({ id: entry.item.id, label: `${entry.group.part}: ${entry.item.prompt.slice(0, 60)}${entry.item.prompt.length > 60 ? '…' : ''}`, score: responses[entry.item.id]!.selfBand!, max: 9 })) : undefined,
      response: writing || undefined,
    }, { countAnswers: true });
    router.replace({ pathname: '/practice/result', params: { id } });
  }

  // Time is up → submit automatically.
  useEffect(() => { if (remaining !== null && remaining <= 0) void submit(); }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!current) return null;
  const { group, item, number } = current;
  const response = responses[item.id] ?? {};
  const audioId = `exam-${group.id}`;
  const navSize = width >= 700 ? 40 : 36;
  const lowTime = remaining !== null && remaining <= 60;

  return <PracticeShell kicker={`${TITLES[session.exam]} · ${group.section.toUpperCase()} · ${group.part.toUpperCase()}`} title={`Câu ${number} / ${session.items.length}`} onBack={onExit} backLabel="Thoát (không lưu)"
    right={<View style={[styles.clock, lowTime && { backgroundColor: colors.errorSoft }]}><Ionicons name="time-outline" size={16} color={lowTime ? colors.error : colors.text} /><Text style={[styles.clockText, lowTime && { color: colors.error }]}>{remaining === null ? formatClock(timer.seconds) : formatClock(remaining)}</Text></View>}>

    {group.audioText ? <AudioBar playing={speech.speakingId === audioId} plays={speech.plays[audioId] ?? 0} rate={rate} onRateChange={setRate} onPlay={() => speech.speak(audioId, group.audioText!, rate)} onStop={speech.stop} error={speech.error} /> : null}
    {group.passage ? <Card style={[styles.passage, group.audioText ? { marginTop: 12 } : null]}>{group.title ? <Text style={ui.fieldLabel}>{group.title.toUpperCase()}</Text> : null}<Text style={styles.passageText}>{group.passage}</Text></Card> : null}

    <Card style={{ marginTop: 12, gap: 12 }}>
      {item.type === 'choice' ? <ChoiceQuestionView question={item} selected={response.selected ?? []} onChange={selected => respond(item.id, { selected })} />
        : <>
          <Text style={styles.prompt}>{item.prompt}</Text>
          {item.type === 'writing' ? <>
            <TextInput accessibilityLabel="Bài viết" value={response.text ?? ''} onChangeText={text => respond(item.id, { text })} multiline textAlignVertical="top" placeholder="Viết câu trả lời…" placeholderTextColor={colors.textMuted} style={styles.editor} />
            <Text style={[styles.words, { color: countWords(response.text ?? '') >= item.minWords ? colors.success : colors.warning }]}>{countWords(response.text ?? '')} / {item.minWords} từ tối thiểu</Text>
          </> : <Recorder key={item.id} maxSeconds={item.prepSeconds ? 150 : 60} />}
          {item.sampleAnswer && (response.text?.trim() || response.selfBand) ? <View style={styles.sample}><Text style={ui.fieldLabel}>BÀI MẪU THAM KHẢO</Text><Text style={ui.body}>{item.sampleAnswer}</Text></View> : null}
          <Text style={ui.fieldLabel}>TỰ ĐÁNH GIÁ BAND (1–9)</Text>
          <View style={styles.bands}>{[4, 5, 6, 7, 8, 9].map(band => <Pressable key={band} accessibilityRole="radio" accessibilityState={{ checked: response.selfBand === band }} accessibilityLabel={`Band ${band}`} onPress={() => respond(item.id, { selfBand: band })} style={[styles.band, response.selfBand === band && styles.bandOn]}><Text style={[styles.bandText, response.selfBand === band && { color: colors.white }]}>{band}</Text></Pressable>)}</View>
        </>}
      <Pressable accessibilityRole="button" accessibilityState={{ selected: !!response.flagged }} onPress={() => respond(item.id, { flagged: !response.flagged })} style={styles.flag}>
        <Ionicons name={response.flagged ? 'flag' : 'flag-outline'} size={16} color={response.flagged ? colors.warning : colors.textMuted} /><Text style={[ui.muted, response.flagged && { color: colors.warning, fontWeight: '700' }]}>{response.flagged ? 'Đã đánh dấu để xem lại' : 'Đánh dấu xem lại'}</Text>
      </Pressable>
    </Card>

    <View style={[ui.actions, { marginTop: 12, justifyContent: 'space-between' }]}>
      <PButton label="Câu trước" variant="secondary" icon="arrow-back" disabled={index === 0} onPress={() => go(index - 1)} />
      {index < session.items.length - 1 ? <PButton label="Câu tiếp" icon="arrow-forward" onPress={() => go(index + 1)} /> : <PButton label="Nộp bài" icon="send" onPress={() => unanswered ? setConfirming(true) : void submit()} />}
    </View>
    {confirming ? <View style={{ marginTop: 12 }}><ConfirmPanel title={`Còn ${unanswered} câu chưa trả lời`} description="Câu bỏ trống được tính là sai. Bạn vẫn muốn nộp bài?" confirmLabel="Nộp bài" onCancel={() => setConfirming(false)} onConfirm={() => { void submit(); }} /></View> : null}

    <Text style={ui.sectionTitle}>Danh sách câu</Text>
    <Card style={{ gap: 12 }}>
      <View style={styles.nav}>
        {session.items.map((entry, position) => {
          const state = itemState(entry.item, responses[entry.item.id]);
          const isFlagged = responses[entry.item.id]?.flagged;
          return <Pressable key={entry.item.id} accessibilityRole="button" accessibilityLabel={`Câu ${entry.number}${state === 'answered' ? ', đã trả lời' : ', chưa trả lời'}${isFlagged ? ', đã đánh dấu' : ''}`} onPress={() => go(position)}
            style={[styles.navItem, { width: navSize, height: navSize }, state === 'answered' && styles.navAnswered, position === index && styles.navCurrent]}>
            <Text style={[styles.navText, state === 'answered' && { color: colors.white }]}>{entry.number}</Text>
            {isFlagged ? <View style={styles.navFlag} /> : null}
          </Pressable>;
        })}
      </View>
      <Text style={ui.muted}>{session.items.length - unanswered} đã trả lời · {unanswered} chưa trả lời · {flagged} đánh dấu</Text>
      {!confirming ? <PButton label="Nộp bài" variant="dark" icon="send" onPress={() => unanswered ? setConfirming(true) : void submit()} /> : null}
    </Card>
  </PracticeShell>;
}

export default ExamScreen;

const styles = StyleSheet.create({
  section: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderRadius: 13, borderWidth: 1.2, borderColor: colors.border, backgroundColor: colors.white },
  sectionOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  modes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mode: { flexGrow: 1, flexBasis: 180, padding: 13, borderRadius: 13, borderWidth: 1.2, borderColor: colors.border, gap: 3, backgroundColor: colors.white },
  summary: { marginTop: 20, gap: 12 },
  clock: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, minHeight: 38, borderRadius: 10, backgroundColor: colors.surfaceAlt },
  clockText: { fontSize: 16, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'] },
  passage: { backgroundColor: '#FFFCF8' },
  passageText: { fontSize: 15, lineHeight: 25, color: colors.text },
  prompt: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: colors.text },
  editor: { minHeight: 220, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 14, padding: 14, fontSize: 15, lineHeight: 24, color: colors.text, backgroundColor: colors.white },
  words: { fontSize: 12.5, fontWeight: '700' },
  sample: { backgroundColor: colors.surfaceAlt, borderRadius: 12, padding: 12 },
  bands: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: -4 },
  band: { width: 42, height: 40, borderRadius: 10, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  bandOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  bandText: { fontWeight: '700', color: colors.textSecondary },
  flag: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', minHeight: 36 },
  nav: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  navItem: { borderRadius: 10, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  navAnswered: { backgroundColor: colors.charcoal, borderColor: colors.charcoal },
  navCurrent: { borderColor: colors.primary, borderWidth: 2.5 },
  navText: { fontSize: 13, fontWeight: '700', color: colors.text },
  navFlag: { position: 'absolute', top: 3, right: 3, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.warning },
});
