import React, { useEffect, useId, useRef } from 'react';
import { Animated, Image, Platform, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';
import { cosmic } from '@/theme/cosmic';
import { tutorPortraits } from '@/theme/cosmicArt';
import { useMotionPreference } from '@/theme/MotionPreference';

export type TutorAvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';

export function TutorAvatar({
  initials,
  tutorId,
  accent = colors.primarySoft,
  size = 54,
  state = 'idle',
}: {
  initials: string;
  tutorId?: string;
  accent?: string;
  size?: number;
  state?: TutorAvatarState;
}) {
  const id = useId();
  const scale = useRef(new Animated.Value(1)).current;
  const motion = useMotionPreference() === false;
  useEffect(() => {
    if (!motion || state === 'idle') { scale.setValue(1); return; }
    scale.setValue(.93);
    const animation = Animated.spring(scale, { toValue: 1, stiffness: 180, damping: 13, useNativeDriver: Platform.OS !== 'web', isInteraction: false });
    animation.start();
    return () => animation.stop();
  }, [motion, scale, state]);
  const image = tutorId && Object.hasOwn(tutorPortraits, tutorId) ? tutorPortraits[tutorId] : undefined;
  return (
    <Animated.View aria-hidden nativeID={`cosmic-tutor-avatar-${state}-${id}`} style={[styles.avatar, { width: size, height: size, borderRadius: size * 0.32, borderColor: accent, transform: [{ scale }] }]}>
      {image ? <Image source={image} style={styles.image} resizeMode="contain" accessible={false} /> : <Text style={[styles.initials, { fontSize: size * 0.31 }]}>{initials}</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, backgroundColor: cosmic.iceSurface, overflow: 'hidden', flexShrink: 0 },
  image: { width: '100%', height: '100%' },
  initials: { fontWeight: '900', color: colors.primaryDeep },
});
