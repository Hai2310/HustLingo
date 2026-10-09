import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import type { TutorMessage } from '../types';

export function ChatBubble({ message }: { message: TutorMessage }) {
  const learner = message.role === 'learner';
  return (
    <View style={[styles.row, learner && styles.learnerRow]}>
      <View style={[styles.bubble, learner ? styles.learnerBubble : styles.tutorBubble]}>
        {!learner && <Text style={styles.label}>TUTOR</Text>}
        <Text style={[styles.text, learner && styles.learnerText]}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: '100%', alignItems: 'flex-start', marginBottom: 10 },
  learnerRow: { alignItems: 'flex-end' },
  bubble: { maxWidth: '86%', paddingHorizontal: 14, paddingVertical: 11, borderRadius: 17 },
  tutorBubble: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 5 },
  learnerBubble: { backgroundColor: colors.primary, borderBottomRightRadius: 5 },
  label: { marginBottom: 4, fontSize: 8, fontWeight: '900', letterSpacing: 1, color: colors.primary },
  text: { fontSize: 13, lineHeight: 20, color: colors.text },
  learnerText: { color: colors.white },
});
