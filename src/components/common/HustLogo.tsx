import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

const OFFICIAL_HUST_LOGO = 'https://hust.edu.vn/uploads/sys/logo-dhbk-1-02_130_191.png';

export function HustLogo({ size = 54, inverted = false, showWordmark = true }: { size?: number; inverted?: boolean; showWordmark?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <View style={styles.row}>
      {!failed ? (
        <View style={[styles.logoShell, { width: size, height: size }]}>
          <Image source={{ uri: OFFICIAL_HUST_LOGO }} resizeMode="contain" style={{ width: size * 0.84, height: size * 0.84 }} onError={() => setFailed(true)} accessibilityLabel="Logo Đại học Bách khoa Hà Nội" />
        </View>
      ) : (
        <View style={[styles.fallback, { width: size, height: size, backgroundColor: inverted ? colors.white : colors.primary }]}>
          <Text style={[styles.fallbackText, { color: inverted ? colors.primary : colors.white, fontSize: Math.max(13, size * 0.25) }]}>H</Text>
        </View>
      )}
      {showWordmark ? (
        <View>
          <Text style={[styles.brand, { color: inverted ? colors.white : colors.text }]}>HustLingo</Text>
          <Text style={[styles.sub, { color: inverted ? '#F5D9DE' : colors.primary }]}>HUST ENGLISH</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoShell: { borderRadius: 11, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: colors.white },
  fallback: { borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  fallbackText: { fontWeight: '900' },
  brand: { fontSize: 20, fontWeight: '900', letterSpacing: -0.7 },
  sub: { fontSize: 8, fontWeight: '900', letterSpacing: 1.2, marginTop: 1 },
});
