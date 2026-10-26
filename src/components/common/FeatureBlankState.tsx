import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FadeIn } from '../motion/Motion';
import { colors } from '@/theme/colors';

type Props = {
  kicker: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  accentSoft: string;
  codeHint: string;
};

export function FeatureBlankState({
  kicker,
  title,
  description,
  icon,
  accent,
  accentSoft,
  codeHint,
}: Props) {
  return (
    <>
      <FadeIn>
        <Text style={[styles.kicker, { color: accent }]}>{kicker}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </FadeIn>

      <FadeIn delay={90}>
        <View style={styles.workspace}>
          <View style={[styles.iconWrap, { backgroundColor: accentSoft }]}> 
            <Ionicons name={icon} size={30} color={accent} />
          </View>
          <Text style={styles.emptyTitle}>Khu vực chức năng đang để trống</Text>
          <Text style={styles.emptyText}>
            Bản H.1 chỉ giữ khung giao diện của tab này. Bạn có thể tự code toàn bộ chức năng tại đây mà không ảnh hưởng Trang chủ, Hồ sơ, Cài đặt hay backend Supabase.
          </Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>FILE CHÍNH</Text>
            <Text selectable style={styles.code}>{codeHint}</Text>
          </View>
        </View>
      </FadeIn>
    </>
  );
}

const styles = StyleSheet.create({
  kicker: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  title: {
    marginTop: 5,
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -1.1,
    color: colors.text,
  },
  description: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  workspace: {
    minHeight: 360,
    paddingHorizontal: 24,
    paddingVertical: 34,
    borderRadius: 26,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    backgroundColor: 'rgba(255,255,255,.78)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B3B32',
    shadowOpacity: 0.04,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  iconWrap: {
    width: 66,
    height: 66,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    maxWidth: 560,
    marginTop: 8,
    fontSize: 11.5,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  codeBox: {
    width: '100%',
    maxWidth: 520,
    marginTop: 24,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.charcoal,
  },
  codeLabel: {
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 1.1,
    color: '#BDB7B0',
  },
  code: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
  },
});
