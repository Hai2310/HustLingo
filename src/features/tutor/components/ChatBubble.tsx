import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors } from '@/theme/colors';
import type { TutorMessage } from '../types';

export function ChatBubble({ message }: { message: TutorMessage }) {
  const learner = message.role === 'learner';
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 700;
  return (
    <View style={[styles.row, learner && styles.learnerRow]}>
      <View style={[styles.bubble, isDesktop && styles.desktopBubble, isMobile && styles.mobileBubble, learner ? styles.learnerBubble : styles.tutorBubble]}>
        {!learner && <Text style={styles.label}>TUTOR</Text>}
        <Text style={[styles.text, isMobile && styles.mobileText, learner && styles.learnerText]}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: '100%', alignItems: 'flex-start', marginBottom: 10 },
  learnerRow: { alignItems: 'flex-end' },
  bubble: { maxWidth: '86%', paddingHorizontal: 14, paddingVertical: 11, borderRadius: 17 },
  desktopBubble: { maxWidth: 650 },
  mobileBubble: { maxWidth: '90%', paddingHorizontal: 13, paddingVertical: 11 },
  tutorBubble: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 5 },
  learnerBubble: { backgroundColor: colors.primary, borderBottomRightRadius: 5 },
  label: { marginBottom: 4, fontSize: 8, fontWeight: '900', letterSpacing: 1, color: colors.primary },
  text: { fontSize: 13, lineHeight: 20, color: colors.text },
  mobileText: { fontSize: 14, lineHeight: 21 },
  learnerText: { color: colors.white },
});
