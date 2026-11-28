import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cosmic } from '@/theme/cosmic';
import { useMotionPreference } from '@/theme/MotionPreference';

const number = new Intl.NumberFormat('vi-VN');

export function ExperiencePill({ lessons, practice, ready = true, emphasized = false }: { lessons: number; practice: number; ready?: boolean; emphasized?: boolean }) {
  const reduced = useMotionPreference() !== false;
  const xp = lessons * 50 + practice * 20;
  const count = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!ready || reduced) { count.setValue(xp); setDisplay(xp); return; }
    const id = count.addListener(({ value }) => setDisplay(Math.round(value)));
    const animation = Animated.timing(count, { toValue: xp, duration: 470, easing: Easing.out(Easing.cubic), useNativeDriver: false, isInteraction: false });
    animation.start();
    return () => { count.removeListener(id); animation.stop(); };
  }, [count, ready, reduced, xp]);

  return (
    <View style={styles.pill}>
      <Ionicons aria-hidden name="flash" color={cosmic.gold} size={16} />
      <Text style={[styles.value, emphasized && styles.emphasized]} accessibilityLabel={ready ? `${number.format(xp)} XP` : 'Đang tải XP'}>
        {ready ? number.format(reduced ? xp : display) : '—'}{' '}
        <Text style={emphasized ? styles.unit : undefined}>XP</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: cosmic.actionEdge, borderRadius: 99, backgroundColor: cosmic.violetSurface, paddingHorizontal: 10, paddingVertical: 6, minHeight: 33 },
  value: { color: cosmic.text, fontSize: 12, fontWeight: '800', fontVariant: ['tabular-nums'] },
  emphasized: { fontSize: 24, lineHeight: 26 },
  unit: { fontSize: 12, fontWeight: '600' },
});
