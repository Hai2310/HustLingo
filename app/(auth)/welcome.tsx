import React from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { AppButton } from '@/components/Buttons';
import { HustLogo } from '@/components/HustLogo';
import { Screen } from '@/components/Screen';
import { cosmic, glassCard } from '@/theme/cosmic';
import { orbitalLibrary } from '@/theme/cosmicArt';

export default function Welcome() {
  const { width } = useWindowDimensions();
  const wide = width >= 680;

  return (
    <Screen contentStyle={styles.page}>
      <HustLogo size={48} />
      <View style={[styles.hero, wide && styles.heroWide]}>
        <View style={styles.copy}>
          <Text accessibilityRole="header" style={styles.title}>Học tiếng Anh cùng HustLingo</Text>
          <Text style={styles.detail}>Học từ vựng theo chủ đề, xem ngữ pháp qua ví dụ và theo dõi tiến độ của bạn.</Text>
        </View>
        <Image source={orbitalLibrary} resizeMode="cover" accessible={false} style={[styles.art, wide && styles.artWide]} />
      </View>
      <View style={styles.actions}>
        <AppButton title="Vào học ngay" icon="arrow-forward" onPress={() => router.replace('/(tabs)/home')} />
        <AppButton title="Đăng nhập để đồng bộ" variant="secondary" onPress={() => router.push('/(auth)/signin')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { maxWidth: 800, paddingTop: 25, gap: 22 },
  hero: { ...glassCard, padding: 19, gap: 18, backgroundColor: cosmic.violetSurface, borderColor: cosmic.actionEdge, boxShadow: '0 16px 42px #5233ba48' },
  heroWide: { flexDirection: 'row', alignItems: 'center', padding: 25 },
  copy: { flex: 1, gap: 8, minWidth: 0 },
  title: { color: cosmic.text, fontSize: 32, lineHeight: 39, letterSpacing: -0.9, fontWeight: '700' },
  detail: { color: cosmic.text, fontSize: 15, lineHeight: 22 },
  art: { width: '100%', height: 155, backgroundColor: cosmic.glass, borderRadius: 13, borderWidth: 4, borderColor: cosmic.glass },
  artWide: { width: '45%', height: 193, transform: [{ rotate: '-3deg' }] },
  actions: { gap: 10, width: '100%', maxWidth: 380 },
});
