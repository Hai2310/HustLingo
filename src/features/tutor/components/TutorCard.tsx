import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { AppCard } from '@/components/common/AppCard';
import { TutorAvatar } from './TutorAvatar';
import type { TutorProfile } from '../types';

export function TutorCard({ tutor, onPress }: { tutor: TutorProfile; onPress: () => void }) {
  return (
    <AppCard onPress={onPress} style={styles.card}>
      <View style={styles.top}>
        <TutorAvatar initials={tutor.initials || tutor.name.slice(0, 2).toUpperCase()} accent={tutor.accent} />
        <View style={styles.copy}>
          <Text style={styles.name}>{tutor.name}</Text>
          <Text style={styles.role}>{tutor.role}</Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color={colors.primary} />
      </View>
      <Text style={styles.description}>{tutor.tone || tutor.description}</Text>
      <View style={styles.tags}>
        {(tutor.specialties || []).slice(0, 3).map(tag => (
          <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
        ))}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 250, padding: 15 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  copy: { flex: 1 },
  name: { fontSize: 17, fontWeight: '900', color: colors.text },
  role: { marginTop: 2, fontSize: 10.5, color: colors.textSecondary },
  description: { minHeight: 38, marginTop: 13, fontSize: 11.5, lineHeight: 18, color: colors.textSecondary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: colors.surfaceAlt },
  tagText: { fontSize: 9, fontWeight: '800', color: colors.textSecondary },
});
