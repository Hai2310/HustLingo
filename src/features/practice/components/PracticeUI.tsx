import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Screen } from '@/components/common/Screen';
import { colors } from '@/theme/colors';
import type { ChoiceQuestion } from '../types';
import { SPEECH_RATES } from '../hooks/useSpeech';

type IconName = keyof typeof Ionicons.glyphMap;

export function goBackToPractice() {
  if (router.canGoBack()) router.back(); else router.replace('/(tabs)/practice');
}

export function PracticeShell({ kicker, title, subtitle, onBack, backLabel = 'Luyện tập', right, children }: { kicker?: string; title: string; subtitle?: string; onBack?: () => void; backLabel?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return <Screen ambient={false} contentStyle={ui.content}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Quay lại ${backLabel}`} onPress={onBack ?? goBackToPractice} style={ui.back}>
      <Ionicons name="arrow-back" size={19} color={colors.text} /><Text style={ui.backText}>{backLabel}</Text>
    </Pressable>
    <View style={ui.headerRow}>
      <View style={{ flex: 1, minWidth: 220 }}>
        {kicker ? <Text style={ui.kicker}>{kicker}</Text> : null}
        <Text style={ui.title}>{title}</Text>
        {subtitle ? <Text style={ui.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
    {children}
  </Screen>;
}

export function PButton({ label, onPress, variant = 'primary', icon, disabled, style }: { label: string; onPress(): void; variant?: 'primary' | 'secondary' | 'dark' | 'ghost'; icon?: IconName; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const light = variant === 'primary' || variant === 'dark';
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [ui.button, variant === 'secondary' && ui.buttonSecondary, variant === 'dark' && ui.buttonDark, variant === 'ghost' && ui.buttonGhost, disabled && { opacity: .4 }, pressed && !disabled && { opacity: .82 }, style]}>
    {icon ? <Ionicons name={icon} size={18} color={light ? colors.white : colors.text} /> : null}
    <Text style={[ui.buttonText, !light && { color: colors.text }]}>{label}</Text>
  </Pressable>;
}

export function Chips<T extends string | number>({ options, value, onChange, label }: { options: readonly { value: NoInfer<T>; label: string }[]; value: T; onChange: (value: NoInfer<T>) => void; label?: string }) {
  return <View accessibilityLabel={label} style={ui.chips}>
    {options.map(option => {
      const selected = option.value === value;
      return <Pressable key={String(option.value)} accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={option.label} onPress={() => onChange(option.value)} style={[ui.chip, selected && ui.chipSelected]}>
        <Text style={[ui.chipText, selected && { color: colors.white }]}>{option.label}</Text>
      </Pressable>;
    })}
  </View>;
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Text style={ui.fieldLabel}>{children}</Text>;
}

export function Card({ children, style, tone = 'plain' }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: 'plain' | 'dark' | 'soft' }) {
  return <View style={[ui.card, tone === 'dark' && ui.cardDark, tone === 'soft' && ui.cardSoft, style]}>{children}</View>;
}

export function ProgressBar({ percent, label, color = colors.primary }: { percent: number; label: string; color?: string }) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  return <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: 100, now: value }} style={ui.track}>
    <View style={[ui.fill, { width: `${value}%`, backgroundColor: color }]} />
  </View>;
}

export function Stat({ value, label, tone = 'light' }: { value: string | number; label: string; tone?: 'light' | 'dark' }) {
  return <View style={ui.stat}><Text style={[ui.statValue, tone === 'dark' && { color: colors.white }]}>{value}</Text><Text style={[ui.statLabel, tone === 'dark' && { color: '#BDB7BD' }]}>{label}</Text></View>;
}

export function StateView({ kind, title, description, action, onAction }: { kind: 'loading' | 'empty' | 'error' | 'done'; title: string; description?: string; action?: string; onAction?: () => void }) {
  const icon: IconName = kind === 'error' ? 'alert-circle-outline' : kind === 'done' ? 'checkmark-done-outline' : 'sparkles-outline';
  return <View style={ui.state} accessibilityLiveRegion="polite">
    {kind === 'loading' ? <ActivityIndicator size="large" color={colors.primary} /> : <View style={ui.stateIcon}><Ionicons name={icon} size={30} color={colors.primary} /></View>}
    <Text style={ui.stateTitle}>{title}</Text>
    {description ? <Text style={ui.stateText}>{description}</Text> : null}
    {action && onAction ? <PButton label={action} onPress={onAction} /> : null}
  </View>;
}

export function Notice({ text, tone = 'info' }: { text: string; tone?: 'info' | 'warning' | 'error' }) {
  const color = tone === 'error' ? colors.error : tone === 'warning' ? colors.warning : colors.info;
  return <View style={[ui.notice, { backgroundColor: tone === 'error' ? colors.errorSoft : tone === 'warning' ? colors.warningSoft : colors.infoSoft }]}>
    <Ionicons name={tone === 'info' ? 'information-circle-outline' : 'alert-circle-outline'} size={18} color={color} />
    <Text style={ui.noticeText}>{text}</Text>
  </View>;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * One multiple-choice question. Supports multi-answer questions ("Chọn 2") and a reveal
 * state that marks correct, wrong and missed options after submit.
 */
export function ChoiceQuestionView({ question, number, selected, onChange, revealed = false, showExplanation = true }: { question: ChoiceQuestion; number?: number; selected: number[]; onChange(selected: number[]): void; revealed?: boolean; showExplanation?: boolean }) {
  const multi = question.answers.length > 1;
  const toggle = (index: number) => {
    if (revealed) return;
    if (!multi) { onChange([index]); return; }
    if (selected.includes(index)) onChange(selected.filter(item => item !== index));
    else if (selected.length < question.answers.length) onChange([...selected, index].sort((a, b) => a - b));
    else onChange([...selected.slice(1), index].sort((a, b) => a - b));
  };
  const correct = revealed && question.answers.length === selected.length && selected.every(index => question.answers.includes(index));
  return <View style={ui.question}>
    {question.prompt ? <Text style={ui.questionPrompt}>{number ? `${number}. ` : ''}{question.prompt}</Text> : null}
    {multi ? <Text style={ui.multiHint}>Chọn {question.answers.length} đáp án{!revealed ? ` · đã chọn ${selected.length}/${question.answers.length}` : ''}</Text> : null}
    <View style={{ gap: 8 }}>
      {question.options.map((option, index) => {
        const isSelected = selected.includes(index), isAnswer = question.answers.includes(index);
        const state = !revealed ? (isSelected ? 'selected' : 'idle') : isAnswer ? (isSelected ? 'correct' : 'missed') : isSelected ? 'wrong' : 'idle';
        return <Pressable key={index} accessibilityRole={multi ? 'checkbox' : 'radio'} accessibilityState={{ checked: isSelected, disabled: revealed }} accessibilityLabel={`${LETTERS[index]}. ${option}${revealed && isAnswer ? ', đáp án đúng' : ''}`} onPress={() => toggle(index)}
          style={({ pressed }) => [ui.option, state === 'selected' && ui.optionSelected, state === 'correct' && ui.optionCorrect, state === 'missed' && ui.optionMissed, state === 'wrong' && ui.optionWrong, pressed && !revealed && { opacity: .8 }]}>
          <View style={[ui.letter, (state === 'selected') && { backgroundColor: colors.primary, borderColor: colors.primary }, state === 'correct' && { backgroundColor: colors.success, borderColor: colors.success }, state === 'wrong' && { backgroundColor: colors.error, borderColor: colors.error }]}>
            {state === 'correct' ? <Ionicons name="checkmark" size={14} color={colors.white} /> : state === 'wrong' ? <Ionicons name="close" size={14} color={colors.white} /> : <Text style={[ui.letterText, state === 'selected' && { color: colors.white }]}>{LETTERS[index]}</Text>}
          </View>
          <Text style={ui.optionText}>{option}</Text>
          {state === 'missed' ? <Text style={ui.missed}>Đáp án đúng</Text> : null}
        </Pressable>;
      })}
    </View>
    {revealed && showExplanation ? <View style={[ui.feedback, { backgroundColor: correct ? colors.successSoft : colors.errorSoft }]}>
      <Text style={[ui.feedbackTitle, { color: correct ? colors.success : colors.error }]}>{correct ? 'Chính xác!' : selected.length ? 'Chưa đúng' : 'Bạn bỏ trống câu này'}</Text>
      {question.explanation ? <Text style={ui.feedbackText}>{question.explanation}</Text> : null}
    </View> : null}
  </View>;
}

/** Play / replay / speed for text-to-speech audio. Hides the text until the caller reveals it. */
export function AudioBar({ playing, plays, rate, onRateChange, onPlay, onStop, error }: { playing: boolean; plays: number; rate: number; onRateChange(rate: number): void; onPlay(): void; onStop(): void; error?: string | null }) {
  return <Card tone="dark" style={{ gap: 14 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Dừng phát' : plays ? 'Nghe lại' : 'Phát audio'} onPress={playing ? onStop : onPlay} style={ui.play}>
        <Ionicons name={playing ? 'stop' : plays ? 'refresh' : 'play'} size={26} color={colors.white} />
      </Pressable>
      <View style={{ flex: 1, minWidth: 150 }}>
        <Text style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>{playing ? 'Đang phát…' : plays ? 'Nghe lại' : 'Bấm để nghe'}</Text>
        <Text style={{ color: '#BDB7BD', fontSize: 12, marginTop: 3 }}>Đã nghe {plays} lần</Text>
      </View>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <Text style={{ color: '#BDB7BD', fontSize: 11, fontWeight: '800', letterSpacing: .8 }}>TỐC ĐỘ</Text>
      {SPEECH_RATES.map(option => <Pressable key={option.label} accessibilityRole="button" accessibilityState={{ selected: rate === option.value }} accessibilityLabel={`Tốc độ ${option.label}`} onPress={() => onRateChange(option.value)} style={[ui.rate, rate === option.value && ui.rateSelected]}>
        <Text style={[ui.rateText, rate === option.value && { color: colors.charcoal }]}>{option.label}</Text>
      </Pressable>)}
    </View>
    {error ? <Text style={{ color: '#FFB4C0', fontSize: 12 }}>{error}</Text> : null}
  </Card>;
}

/** Inline confirmation (web has no native confirm dialog inside the app). */
export function ConfirmPanel({ title, description, confirmLabel, onConfirm, onCancel }: { title: string; description?: string; confirmLabel: string; onConfirm(): void; onCancel(): void }) {
  return <Card style={{ borderColor: colors.primary, gap: 10 }}>
    <Text style={ui.cardTitle}>{title}</Text>
    {description ? <Text style={ui.body}>{description}</Text> : null}
    <View style={ui.actions}><PButton label="Tiếp tục làm" variant="secondary" onPress={onCancel} /><PButton label={confirmLabel} onPress={onConfirm} /></View>
  </Card>;
}

export function LevelBadge({ level }: { level: string }) {
  return <View style={ui.badge}><Text style={ui.badgeText}>{level}</Text></View>;
}

export const ui = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 24 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', minHeight: 44, marginBottom: 10 },
  backText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 20 },
  kicker: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  title: { fontSize: 30, lineHeight: 38, fontWeight: '800', color: colors.text, letterSpacing: -1 },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, marginTop: 6 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: colors.text, letterSpacing: -.4, marginTop: 26, marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text, lineHeight: 24 },
  body: { fontSize: 14, lineHeight: 22, color: colors.textSecondary },
  muted: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  fieldLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '800', letterSpacing: .9, marginTop: 18, marginBottom: 10 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  button: { minHeight: 46, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 11, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonSecondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderStrong },
  buttonDark: { backgroundColor: colors.charcoal },
  buttonGhost: { backgroundColor: 'transparent' },
  buttonText: { fontSize: 14, fontWeight: '700', color: colors.white },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 40, paddingHorizontal: 14, justifyContent: 'center', backgroundColor: colors.white, borderRadius: 11, borderWidth: 1, borderColor: colors.border },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },
  card: { backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 18 },
  cardDark: { backgroundColor: colors.charcoal, borderColor: colors.charcoal },
  cardSoft: { backgroundColor: colors.surfaceAlt },
  track: { height: 6, backgroundColor: '#EEE8E4', borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
  stat: { minWidth: 90 },
  statValue: { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -.6 },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  state: { minHeight: 220, alignItems: 'center', justifyContent: 'center', padding: 26, gap: 12, backgroundColor: colors.white, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  stateIcon: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  stateTitle: { fontSize: 19, fontWeight: '700', color: colors.text, textAlign: 'center' },
  stateText: { fontSize: 14, lineHeight: 21, color: colors.textSecondary, textAlign: 'center', maxWidth: 420 },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 12, borderRadius: 12, marginBottom: 14 },
  noticeText: { flex: 1, color: colors.textSecondary, fontSize: 12.5, lineHeight: 18 },
  question: { gap: 12 },
  questionPrompt: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: colors.text },
  multiHint: { fontSize: 12, color: colors.primary, fontWeight: '700', marginTop: -6 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingVertical: 11, paddingHorizontal: 13, backgroundColor: colors.white, borderRadius: 13, borderWidth: 1.2, borderColor: colors.border },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.successSoft },
  optionMissed: { borderColor: colors.success, borderStyle: 'dashed' },
  optionWrong: { borderColor: colors.error, backgroundColor: colors.errorSoft },
  letter: { width: 28, height: 28, borderRadius: 9, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  letterText: { fontSize: 12, fontWeight: '800', color: colors.textSecondary },
  optionText: { flex: 1, fontSize: 14.5, lineHeight: 21, color: colors.text },
  missed: { fontSize: 11, fontWeight: '700', color: colors.success },
  feedback: { borderRadius: 12, padding: 13, gap: 4 },
  feedbackTitle: { fontSize: 14, fontWeight: '800' },
  feedbackText: { fontSize: 13, lineHeight: 20, color: colors.textSecondary },
  play: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  rate: { minHeight: 34, paddingHorizontal: 12, borderRadius: 9, borderWidth: 1, borderColor: '#46464E', justifyContent: 'center' },
  rateSelected: { backgroundColor: colors.white, borderColor: colors.white },
  rateText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7, backgroundColor: colors.primarySoft },
  badgeText: { fontSize: 10.5, fontWeight: '800', color: colors.primary, letterSpacing: .4 },
  listCard: { backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 8 },
});
