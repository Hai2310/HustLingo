import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/common/Buttons';
import { cosmic, glassCard } from '@/theme/cosmic';

export const skillLabels = {
  listening: { label: 'Nghe', icon: 'headset-outline' },
  reading: { label: 'Đọc', icon: 'reader-outline' },
  writing: { label: 'Viết', icon: 'create-outline' },
  speaking: { label: 'Nói', icon: 'mic-outline' },
  grammar: { label: 'Ngữ pháp', icon: 'book-outline' },
} as const;

export function PracticeNotice({ loading, message, retry }: {
  loading?: boolean;
  message: string;
  retry?: () => void;
}) {
  return (
    <View accessibilityLiveRegion="polite" style={[practiceStyles.sheet, styles.notice]}>
      {loading && <ActivityIndicator color={cosmic.ice} />}
      <Text style={practiceStyles.detail}>{message}</Text>
      {retry && <AppButton title="Thử lại" variant="secondary" onPress={retry} />}
    </View>
  );
}

export const practiceStyles = StyleSheet.create({
  page: { paddingTop: 23, gap: 18 },
  title: { color: cosmic.text, fontSize: 30, lineHeight: 36, fontWeight: '700', letterSpacing: -0.7 },
  heading: { color: cosmic.text, fontSize: 21, lineHeight: 28, fontWeight: '700' },
  detail: { color: cosmic.muted, fontSize: 15, lineHeight: 22 },
  label: { color: cosmic.ice, fontSize: 13, fontWeight: '700', lineHeight: 18 },
  sheet: { ...glassCard, padding: 17, gap: 13 },
  input: { backgroundColor: cosmic.glass, color: cosmic.text, borderWidth: 1, borderColor: cosmic.border, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 10, minHeight: 46, fontSize: 15, lineHeight: 22 },
});
const styles = StyleSheet.create({ notice: { alignItems: 'flex-start' } });
