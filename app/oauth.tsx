import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { colors } from '@/theme/colors';

WebBrowser.maybeCompleteAuthSession();

export default function OAuthComplete() {
  return (
    <View style={styles.page}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.title}>Đang hoàn tất đăng nhập…</Text>
      <Text style={styles.sub}>Bạn có thể quay lại HustLingo nếu cửa sổ này không tự đóng.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 24 },
  title: { marginTop: 16, fontSize: 18, fontWeight: '900', color: colors.text },
  sub: { marginTop: 7, fontSize: 12.5, lineHeight: 19, textAlign: 'center', color: colors.textSecondary },
});
