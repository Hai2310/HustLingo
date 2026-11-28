import React, { useEffect, useId } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { cosmic } from '@/theme/cosmic';
import './PaidPlanAppearance.css';

export const paidPlanAppearance = {
  plus: {
    paper: ['#153d57', '#152641', '#0f192c'], edge: '#548ba9', ink: '#a0efff',
    art: require('../../../assets/illustrations/cosmic/plans/plus-crystal.webp'),
  },
  pro: {
    paper: ['#462860', '#2f1d4c', '#1b1b35'], edge: '#ac86b9', ink: cosmic.gold,
    art: require('../../../assets/illustrations/cosmic/plans/pro-crown.webp'),
  },
} as const;

export function PaidPlanEmblem({ plan, size }: { plan: keyof typeof paidPlanAppearance; size: number }) {
  const tone = paidPlanAppearance[plan];
  const emblemId = useId();
  return (
    <View nativeID={plan === 'pro' ? `paid-pro-emblem-${emblemId}` : undefined}
      style={[styles.halo, { width: size, height: size, borderRadius: size / 2, backgroundColor: `${tone.ink}16` }]} pointerEvents="none" aria-hidden>
      <Image source={tone.art} style={styles.art} resizeMode="contain" accessible={false} />
    </View>
  );
}

export function usePaidPlanReveal(containerId: string) {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof IntersectionObserver === 'undefined') return;
    const pro = document.getElementById(containerId)?.querySelector<HTMLElement>('[id$="-plan-pro"]');
    if (!pro) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || entry.intersectionRatio < 0.55) return;
      pro.dataset.planRevealed = 'true';
      observer.disconnect();
    }, { threshold: 0.55 });
    observer.observe(pro);
    return () => observer.disconnect();
  }, [containerId]);
}

const styles = StyleSheet.create({
  halo: { alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  art: { width: '85%', height: '88%' },
});
