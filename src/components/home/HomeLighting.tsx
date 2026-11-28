import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import './HomeLighting.css';

export function HomeAurora() {
  return <View nativeID="home-aurora" style={styles.aurora} pointerEvents="none" aria-hidden />;
}

export function useHomeLighting() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const home = document.getElementById('hustlingo-home');
    if (!home) return;
    const animatedPointer = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let point: { card: HTMLElement; x: number; y: number } | undefined;

    function aim(event: PointerEvent) {
      if (!animatedPointer.matches || event.pointerType === 'touch' || !(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>('[id^="home-skill-card-"], [id^="home-topic-"]');
      if (!card) return;
      point = { card, x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (!point?.card.matches(':hover')) return;
        const { card, x, y } = point;
        const rect = card.getBoundingClientRect();
        const percent = (distance: number, size: number) => Math.min(100, Math.max(0, 100 * distance / size)).toFixed(1);
        card.style.setProperty('--home-light-x', percent(x - rect.left, rect.width));
        card.style.setProperty('--home-light-y', percent(y - rect.top, rect.height));
      });
    }

    home.addEventListener('pointermove', aim, { passive: true });
    return () => {
      home.removeEventListener('pointermove', aim);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}

const styles = StyleSheet.create({
  aurora: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    ...(Platform.OS !== 'web' && {
      experimental_backgroundImage: 'radial-gradient(ellipse farthest-corner at 82% 8%, #733b8f39 0%, #10122c12 42%, transparent 75%)',
    }),
  },
});
