import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

export function TutorAvatar({
  initials,
  accent = colors.primarySoft,
  size = 54,
}: {
  initials: string;
  accent?: string;
  size?: number;
}) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size * 0.32, backgroundColor: accent }]}>
      <Text style={[styles.initials, { fontSize: size * 0.31 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,.85)' },
  initials: { fontWeight: '900', color: colors.primaryDeep },
});
