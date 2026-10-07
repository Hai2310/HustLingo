import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { Float, Shimmer } from '../motion/Motion';

type Slide = {
  kicker: string;
  title: string;
  subtitle: string;
  action: string;
  path: string;
  icon: keyof typeof Ionicons.glyphMap;
  stat: string;
  statLabel: string;
  colors: readonly [string, string, ...string[]];
  accent: string;
};

const baseSlides: Slide[] = [
  {
    kicker: 'LỘ TRÌNH HÔM NAY',
    title: '15 phút để\nkhông mất nhịp.',
    subtitle: 'Tiếp tục University Life và giữ nhịp học đều mỗi ngày.',
    action: 'Tiếp tục học',
    path: '/flashcards',
    icon: 'flash-outline',
    stat: '15',
    statLabel: 'phút',
    colors: ['#D10A34', '#8A0625'],
    accent: '#FFD6DF',
  },
  {
    kicker: '10.000 TỪ TIẾNG ANH',
    title: 'Học theo ngữ cảnh,\nnhớ lâu hơn.',
    subtitle: 'Từ vựng được chia theo cấp độ, chủ đề và tình huống thực tế.',
    action: 'Khám phá từ vựng',
    path: '/vocabulary',
    icon: 'text-outline',
    stat: '10K',
    statLabel: 'từ',
    colors: ['#FF6A4D', '#E93B54'],
    accent: '#FFE8D5',
  },
  {
    kicker: 'TOEIC · IELTS',
    title: 'Biết mình yếu đâu,\nluyện đúng chỗ đó.',
    subtitle: 'Mini test, kỹ năng riêng lẻ và lộ trình luyện thi rõ ràng.',
    action: 'Vào luyện thi',
    path: '/exam',
    icon: 'school-outline',
    stat: '4',
    statLabel: 'kỹ năng',
    colors: ['#3478F6', '#6558F5'],
    accent: '#DBE8FF',
  },
  {
    kicker: 'LUYỆN 4 KỸ NĂNG',
    title: 'Nghe · Nói · Đọc · Viết\ntrong một nhịp học.',
    subtitle: 'Chuyển kỹ năng nhanh, giao diện sáng và tập trung vào tiến bộ.',
    action: 'Bắt đầu luyện',
    path: '/(tabs)/practice',
    icon: 'sparkles-outline',
    stat: '4',
    statLabel: 'kỹ năng',
    colors: ['#12B8C4', '#3478F6'],
    accent: '#D8FBFF',
  },
];

export function HeroSlideshow({ goal = 15, minutesToday = 0 }: { goal?: number; minutesToday?: number }) {
  const [index, setIndex] = useState(0);
  const entrance = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const compact = width < 620;

  const slides = useMemo(() => baseSlides.map((s, i) => i === 0 ? { ...s, stat: String(goal), statLabel: 'phút' } : s), [goal]);
  const slide = slides[index];
  const pct = Math.min(100, Math.round((minutesToday / Math.max(1, goal)) * 100));

  useEffect(() => {
    entrance.setValue(0);
    Animated.timing(entrance, { toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [entrance, index]);

  useEffect(() => {
    const timer = setInterval(() => setIndex((v) => (v + 1) % slides.length), 4700);
    return () => clearInterval(timer);
  }, [slides.length]);

  const go = (next: number) => setIndex((next + slides.length) % slides.length);

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={slide.colors as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, compact && styles.heroCompact]}>
        <Shimmer style={styles.shimmer} />
        <View style={styles.blurOne} />
        <View style={styles.blurTwo} />

        <Animated.View style={[styles.copy, { opacity: entrance, transform: [{ translateX: entrance.interpolate({ inputRange: [0, 1], outputRange: [-18, 0] }) }] }]}>
          <View style={styles.kickerRow}>
            <View style={[styles.spark, { backgroundColor: slide.accent }]}><Ionicons name={slide.icon} size={14} color={slide.colors[0]} /></View>
            <Text style={styles.kicker}>{slide.kicker}</Text>
          </View>
          <Text style={[styles.title, compact && styles.titleCompact]}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
          <Pressable onPress={() => router.push(slide.path as any)} style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
            <Text style={[styles.actionText, { color: slide.colors[0] }]}>{slide.action}</Text>
            <Ionicons name="arrow-forward" size={16} color={slide.colors[0]} />
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.visual, compact && styles.visualCompact, { opacity: entrance, transform: [{ translateX: entrance.interpolate({ inputRange: [0, 1], outputRange: [22, 0] }) }, { scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }]}>
          <Float distance={7} duration={2300}>
            <View style={styles.metricOuter}>
              <View style={styles.metricInner}>
                {index === 0 ? <>
                  <Text style={styles.metricBig}>{pct}%</Text>
                  <Text style={styles.metricSmall}>{minutesToday}/{goal}</Text>
                </> : <>
                  <Text style={styles.metricBig}>{slide.stat}</Text>
                  <Text style={styles.metricSmall}>{slide.statLabel}</Text>
                </>}
              </View>
            </View>
          </Float>
        </Animated.View>
      </LinearGradient>

      <View style={styles.controls}>
        <View style={styles.dots}>
          {slides.map((_, i) => <Pressable key={i} accessibilityLabel={`Slide ${i + 1}`} onPress={() => setIndex(i)} style={[styles.dot, i === index && styles.dotOn]} />)}
        </View>
        <View style={styles.arrows}>
          <Pressable onPress={() => go(index - 1)} style={styles.arrow}><Ionicons name="arrow-back" size={15} color={colors.text}/></Pressable>
          <Pressable onPress={() => go(index + 1)} style={styles.arrow}><Ionicons name="arrow-forward" size={15} color={colors.text}/></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  hero: { minHeight: 230, borderRadius: 26, paddingHorizontal: 24, paddingVertical: 24, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', shadowColor: '#8E1530', shadowOpacity: 0.22, shadowRadius: 30, shadowOffset: { width: 0, height: 16 }, elevation: 7 },
  heroCompact: { minHeight: 285, padding: 20 },
  shimmer: { position: 'absolute', width: 120, height: 390, backgroundColor: colors.white, top: -70, left: -190 },
  blurOne: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,.12)', right: -65, top: -95 },
  blurTwo: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,.08)', left: '44%', bottom: -100 },
  copy: { flex: 1, zIndex: 2, paddingRight: 14 },
  kickerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  spark: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  kicker: { fontSize: 9.5, fontWeight: '900', letterSpacing: 1.15, color: '#FFF5F6' },
  title: { fontSize: 29, lineHeight: 34, fontWeight: '900', color: colors.white, letterSpacing: -1, marginTop: 12, maxWidth: 560 },
  titleCompact: { fontSize: 24, lineHeight: 29 },
  subtitle: { fontSize: 12, lineHeight: 18, color: 'rgba(255,255,255,.86)', marginTop: 8, maxWidth: 540 },
  action: { alignSelf: 'flex-start', marginTop: 16, minHeight: 40, paddingHorizontal: 14, borderRadius: 12, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionPressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
  actionText: { fontSize: 11.5, fontWeight: '900' },
  visual: { width: 148, minHeight: 170, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  visualCompact: { width: 96 },
  metricOuter: { width: 112, height: 112, borderRadius: 56, borderWidth: 2, borderColor: 'rgba(255,255,255,.58)', backgroundColor: 'rgba(255,255,255,.12)', padding: 9, alignItems: 'center', justifyContent: 'center' },
  metricInner: { width: '100%', height: '100%', borderRadius: 999, backgroundColor: 'rgba(255,255,255,.13)', alignItems: 'center', justifyContent: 'center' },
  metricBig: { fontSize: 26, fontWeight: '900', color: colors.white, letterSpacing: -0.7 },
  metricSmall: { fontSize: 9.5, color: 'rgba(255,255,255,.82)', marginTop: 1, fontWeight: '700' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 3 },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 99, backgroundColor: colors.borderStrong },
  dotOn: { width: 26, backgroundColor: colors.primary },
  arrows: { flexDirection: 'row', gap: 7 },
  arrow: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
});
