import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { AppButton } from '@/components/Buttons';
import { supabaseData } from '@/services/supabaseData';
import { colors } from '@/theme/colors';

export default function Feedback() {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  async function send() {
    if (text.trim().length < 5) return Alert.alert('Phản hồi quá ngắn', 'Hãy nhập ít nhất 5 ký tự.');
    try {
      setSending(true);
      await supabaseData.sendFeedback(text.trim());
      setText('');
      Alert.alert('Đã gửi', 'Cảm ơn bạn đã góp ý cho HustLingo. Phản hồi đã được lưu trên Supabase.');
    } catch (error: any) {
      Alert.alert('Chưa gửi được', error?.message || 'Kiểm tra kết nối Supabase.');
    } finally { setSending(false); }
  }
  return (
    <Screen contentStyle={styles.page}>
      <PageHeader title="Phản hồi" subtitle="Giúp HustLingo tốt hơn" />
      <Text style={styles.label}>Nội dung</Text>
      <TextInput multiline value={text} onChangeText={setText} textAlignVertical="top" placeholder="Bạn muốn góp ý điều gì?" placeholderTextColor={colors.textMuted} style={styles.input} maxLength={2000} />
      <AppButton title="Gửi phản hồi" onPress={send} loading={sending} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  page: { maxWidth: 700, alignSelf: 'center' },
  label: { fontSize: 13, fontWeight: '800', color: colors.text, marginBottom: 8 },
  input: { minHeight: 220, borderRadius: 18, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.white, padding: 15, fontSize: 14, lineHeight: 22, color: colors.text, marginBottom: 14 },
});
