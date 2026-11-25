import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppButton } from '@/components/common/Buttons';
import { Screen } from '@/components/common/Screen';
import { hum, paperCard } from '@/theme/hum';

export function PracticeScreen() {
  return (
    <Screen contentStyle={styles.page}>
      <Text accessibilityRole="header" style={styles.title}>Luyện tập</Text>
      <View style={styles.sheet}>
        <View aria-hidden style={styles.icon}><Ionicons name="pencil-outline" size={25} color={hum.blue} /></View>
        <Text style={styles.heading}>Chưa có bài luyện tập</Text>
        <Text style={styles.detail}>Bạn có thể học từ vựng và ngữ pháp trong thư viện bài học.</Text>
        <AppButton title="Mở bài học" icon="arrow-forward" onPress={() => router.push('/(tabs)/lessons')} />
      </View>
    </Screen>
  );
}

export default PracticeScreen;

const styles = StyleSheet.create({
  page: { paddingTop: 23, gap: 17 },
  title: { color: hum.ink, fontSize: 32, lineHeight: 39, fontWeight: '700', letterSpacing: -0.75 },
  sheet: { ...paperCard, backgroundColor: hum.sky, borderColor: hum.skyEdge, padding: 22, gap: 11, alignItems: 'flex-start' },
  icon: { width: 45, height: 45, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: hum.card },
  heading: { color: hum.ink, fontSize: 23, lineHeight: 29, fontWeight: '700' },
  detail: { color: hum.muted, fontSize: 15, lineHeight: 22, marginBottom: 4 },
});
