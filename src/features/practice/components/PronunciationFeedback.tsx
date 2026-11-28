import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cosmic, gameButton } from '@/theme/cosmic';
import type { PronunciationResult } from '../data/pronunciation';
import { practiceStyles } from './PracticeUI';

type Word = PronunciationResult['words'][number];

function wordFeedback(word: Word) {
  if (word.error === 'Omission') return 'Bỏ sót';
  if (word.error === 'Insertion') return 'Đọc thêm';
  if (word.error === 'Mispronunciation') return 'Cần luyện';
  if (word.error === 'UnexpectedBreak' || word.error === 'MissingBreak') return 'Xem lại chỗ ngắt';
  if (word.error === 'Monotone') return 'Xem lại ngữ điệu';
  if (word.accuracy === null) return 'Chưa có điểm';
  if (word.accuracy < 80) return 'Cần luyện';
  return 'Tốt';
}

export function PronunciationFeedback({ result, demo = false }: { result: PronunciationResult; demo?: boolean }) {
  const [selection, setSelection] = useState<number | null>(null);
  const selected = selection === null ? undefined : result.words[selection];
  const metrics = [
    { label: 'Độ chính xác', value: result.accuracy },
    { label: 'Độ trôi chảy', value: result.fluency },
    { label: 'Độ đầy đủ', value: result.completeness },
    { label: 'Ngữ điệu', value: result.prosody },
  ];
  return (
    <View style={styles.result}>
      <View style={styles.score} aria-live="polite" accessibilityLiveRegion="polite">
        <Text style={practiceStyles.heading}>{demo ? 'Điểm minh họa' : 'Điểm phát âm'}</Text>
        <Text style={styles.total}>{result.score}<Text style={practiceStyles.label}> / 100</Text></Text>
      </View>
      <View style={styles.row}>
        {metrics.map(({ label, value }) => value === null ? null : (
          <View key={label} style={styles.metric}>
            <Text style={practiceStyles.detail}>{label}</Text>
            <Text style={styles.wordText}>{value}</Text>
          </View>
        ))}
      </View>
      {result.words.length > 0 && <>
        <Text style={practiceStyles.detail}>Chọn một từ để xem điểm từng âm.</Text>
        <View style={styles.row}>
          {result.words.map((word, index) => {
            const feedback = wordFeedback(word);
            return (
              <Pressable key={index} accessibilityRole="button" accessibilityState={{ selected: selection === index }}
                accessibilityLabel={`${word.text}. ${feedback}${word.accuracy === null ? '' : `, ${word.accuracy} trên 100`}`}
                onPress={() => setSelection(selection === index ? null : index)}
                style={[styles.word, feedback === 'Tốt' ? styles.good : styles.review, selection === index && styles.selected]}>
                <Text style={styles.wordText}>{word.text}</Text>
                <Text style={practiceStyles.label}>{word.accuracy ?? feedback}</Text>
              </Pressable>
            );
          })}
        </View>
      </>}
      {selected && (
        <View style={styles.focus} aria-live="polite" accessibilityLiveRegion="polite">
          <Text style={styles.wordText}>{selected.text} · {wordFeedback(selected)}</Text>
          {selected.phonemes.length > 0 && (
            <View style={styles.row}>
              {selected.phonemes.map((phoneme, index) => (
                <Text key={index} style={[styles.phoneme, phoneme.accuracy < 80 && styles.review]}>
                  {phoneme.text} · {phoneme.accuracy}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  result: { gap: 10, borderTopWidth: 1, borderColor: cosmic.border, paddingTop: 14 },
  score: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  total: { color: cosmic.mint, fontSize: 30, fontWeight: '700', fontVariant: ['tabular-nums'] },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: cosmic.iceSurface, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6 },
  word: { ...gameButton, minHeight: 49, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 4 },
  good: { backgroundColor: cosmic.mintSurface, borderColor: cosmic.mintEdge },
  review: { backgroundColor: cosmic.violetSurface, borderColor: cosmic.actionEdge },
  selected: { borderColor: cosmic.ice },
  wordText: { color: cosmic.text, fontSize: 15, fontWeight: '700' },
  focus: { gap: 8, backgroundColor: cosmic.iceSurface, borderRadius: 10, padding: 10 },
  phoneme: { color: cosmic.text, backgroundColor: cosmic.glass, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5, fontSize: 15 },
});
