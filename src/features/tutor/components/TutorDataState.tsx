import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/common/Screen';
import { AppButton } from '@/components/common/Buttons';
import { colors } from '@/theme/colors';

export function TutorDataState({ loading, message, retry }: { loading?: boolean; message?: string; retry?: () => void }) {
  return (
    <Screen>
      <View style={styles.content}>
        {loading ? <ActivityIndicator color={colors.primary} /> : <>
          <Text style={styles.title}>Gia sư AI</Text>
          <Text style={styles.message}>{message || 'Chưa có nội dung Gia sư được xuất bản.'}</Text>
          {retry && <AppButton title="Thử lại" onPress={retry} />}
          <AppButton title="Về danh sách tình huống" onPress={() => router.replace('/(tabs)/tutor')} />
        </>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical: 40, gap: 16, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: colors.text },
  message: { fontSize: 13, lineHeight: 20, color: colors.textSecondary, textAlign: 'center', maxWidth: 440 },
});
