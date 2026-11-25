import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { getVocabularyArtwork } from '@/features/lessons/data/vocabulary-artwork';
import { hum, humType, paperButton } from '@/theme/hum';

const slides = [
  {
    name: 'HustLingo',
    title: 'Học tiếng Anh cùng HustLingo',
    detail: 'Khám phá bài học tiếng Anh theo trình độ của bạn.',
    action: 'Xem bài học',
    href: '/(tabs)/lessons',
    paper: hum.pear,
    edge: hum.pearEdge,
    image: getVocabularyArtwork('education').image,
  },
  {
    name: 'Từ vựng',
    title: 'Từ vựng theo chủ đề',
    detail: 'Nghe cách phát âm và xem từ mới trong câu ví dụ.',
    action: 'Học từ vựng',
    href: '/vocabulary',
    paper: hum.sky,
    edge: hum.skyEdge,
    image: getVocabularyArtwork('travel').image,
  },
  {
    name: 'Ngữ pháp',
    title: 'Ngữ pháp qua ví dụ',
    detail: 'Xem công thức, ví dụ và các lỗi thường gặp.',
    action: 'Học ngữ pháp',
    href: '/grammar',
    paper: hum.mint,
    edge: hum.mintRule,
    image: null,
  },
] as const;

export function HeroSlideshow({ wide, reducedMotion }: { wide: boolean; reducedMotion: boolean }) {
  const [index, setIndex] = useState(0);
  const [artOpacity] = useState(() => new Animated.Value(1));
  const lastIndex = useRef(index);
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);
  const slide = slides[index];

  const step = (offset: number) => {
    setIndex(current => (current + offset + slides.length) % slides.length);
  };

  const startTouch = ({ nativeEvent }: GestureResponderEvent) => {
    const touch = nativeEvent.touches[0];
    touchOrigin.current = nativeEvent.touches.length === 1 ? { x: touch.pageX, y: touch.pageY } : null;
  };

  const endTouch = ({ nativeEvent }: GestureResponderEvent) => {
    const origin = touchOrigin.current;
    const touch = nativeEvent.changedTouches[0];
    touchOrigin.current = null;
    if (!origin || !touch) return;
    const dx = touch.pageX - origin.x;
    const dy = touch.pageY - origin.y;
    if (Math.abs(dx) >= 42 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  };

  useEffect(() => {
    const changed = lastIndex.current !== index;
    lastIndex.current = index;
    if (reducedMotion || !changed) {
      artOpacity.setValue(1);
      return;
    }
    artOpacity.setValue(0.72);
    const animation = Animated.timing(artOpacity, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: Platform.OS !== 'web',
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [index, artOpacity, reducedMotion]);

  return (
    <View nativeID="home-hero" style={[styles.sheet, wide && styles.sheetWide, { backgroundColor: slide.paper, borderColor: slide.edge }]}>
      <View
        nativeID="home-hero-slide"
        style={[styles.slide, wide && styles.slideWide]}
        onTouchStart={startTouch}
        onTouchEnd={endTouch}
        onTouchCancel={() => { touchOrigin.current = null; }}
      >
        <View style={styles.copy}>
          <Text
            nativeID="home-hero-title"
            accessibilityRole="header"
            aria-level={2}
            aria-live="polite"
            textBreakStrategy="balanced"
            style={[styles.title, wide && styles.titleWide]}
          >
            {slide.title}
          </Text>
          <Text style={[styles.detail, wide && styles.detailWide]}>{slide.detail}</Text>
          <Link href={slide.href} style={styles.action} asChild>
            <Pressable nativeID="home-hero-action" accessibilityLabel={slide.action}>
              <Text style={styles.actionLabel}>{slide.action}</Text>
              <Ionicons aria-hidden name="arrow-forward" size={15} color={hum.ink} />
            </Pressable>
          </Link>
        </View>
        <Animated.View style={[styles.art, wide && styles.artWide, { opacity: artOpacity }]} aria-hidden>
          {slide.image ? (
            <View style={[styles.photo, wide && styles.photoWide]}>
              <Image source={slide.image} resizeMode="cover" style={styles.image} />
              <View style={[styles.tape, wide && styles.tapeWide]} />
            </View>
          ) : (
            <View style={[styles.example, wide && styles.exampleWide]}>
              <View style={[styles.wordTile, styles.wordFirst, wide && styles.wordTileWide]}>
                <Text style={[styles.word, wide && styles.wordWide]}>I am</Text>
              </View>
              <View style={[styles.wordTile, styles.wordSecond, wide && styles.wordTileWide]}>
                <Text style={[styles.word, wide && styles.wordWide]}>You are</Text>
              </View>
            </View>
          )}
        </Animated.View>
      </View>

      <View style={[styles.controls, { borderTopColor: slide.edge }]}>
        <View style={styles.selectors}>
          {slides.map((item, position) => (
            <Pressable
              key={item.name}
              nativeID={'home-hero-select-' + position}
              accessibilityRole="button"
              accessibilityState={{ selected: index === position }}
              accessibilityLabel={(index === position ? 'Đang xem ' : 'Xem giới thiệu ') + item.name}
              onPress={() => setIndex(position)}
              style={({ pressed }) => [styles.selector, pressed && styles.pressed]}
            >
              <View style={[styles.dot, { borderColor: slide.edge }, index === position && styles.dotSelected]} />
            </Pressable>
          ))}
        </View>
        <View style={styles.arrows}>
          <Pressable
            nativeID="home-hero-prev"
            accessibilityRole="button"
            accessibilityLabel="Giới thiệu trước"
            onPress={() => step(-1)}
            style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
          >
            <Ionicons aria-hidden name="chevron-back" size={20} color={hum.ink} />
          </Pressable>
          <Pressable
            nativeID="home-hero-next"
            accessibilityRole="button"
            accessibilityLabel="Giới thiệu tiếp theo"
            onPress={() => step(1)}
            style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
          >
            <Ionicons aria-hidden name="chevron-forward" size={20} color={hum.ink} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { borderRadius: 22, borderWidth: 1, borderBottomWidth: 4, marginBottom: 20, paddingTop: 14, paddingHorizontal: 13, paddingBottom: 4 },
  sheetWide: { paddingTop: 19, paddingHorizontal: 23, paddingBottom: 6, marginBottom: 23 },
  slide: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 140, paddingBottom: 10 },
  slideWide: { gap: 28, minHeight: 187, paddingBottom: 14 },
  copy: { flex: 1, minWidth: 0, gap: 6 },
  title: { color: hum.ink, fontSize: 25, lineHeight: 28, letterSpacing: -0.8, fontWeight: humType.bold, minWidth: 0 },
  titleWide: { fontSize: 42, lineHeight: 46, letterSpacing: -1.65, maxWidth: 630 },
  detail: { color: hum.ink, fontSize: 14, lineHeight: 19, maxWidth: 380 },
  detailWide: { fontSize: 16, lineHeight: 22 },
  action: { ...paperButton, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 8, minHeight: 44, paddingHorizontal: 11, marginTop: 3, backgroundColor: hum.card, borderColor: hum.paperDeep },
  actionLabel: { color: hum.ink, fontSize: 14, fontWeight: humType.bold },
  art: { width: '31%', maxWidth: 118, marginRight: 4, flexShrink: 0, aspectRatio: 1.05, justifyContent: 'center' },
  artWide: { width: '36%', maxWidth: 365, aspectRatio: undefined, height: 162, marginRight: 7 },
  photo: { flex: 1, padding: 4, borderRadius: 11, backgroundColor: hum.card, borderWidth: 1, borderColor: hum.paperDeep, borderBottomWidth: 3, transform: [{ rotate: '-4deg' }] },
  photoWide: { padding: 6, borderRadius: 15 },
  image: { width: '100%', height: '100%', borderRadius: 7, backgroundColor: hum.paper },
  tape: { position: 'absolute', width: '37%', minWidth: 26, height: 11, top: -4, left: '31%', borderRadius: 3, backgroundColor: hum.paperDeep, transform: [{ rotate: '8deg' }] },
  tapeWide: { width: '25%', left: '38%', height: 16, top: -8 },
  example: { gap: 4, justifyContent: 'center' },
  exampleWide: { gap: 6, paddingHorizontal: 22 },
  wordTile: { ...paperButton, paddingHorizontal: 8, paddingVertical: 4, borderColor: hum.mintRule, borderRadius: 9 },
  wordTileWide: { paddingHorizontal: 22, paddingVertical: 6, borderRadius: 12 },
  wordFirst: { backgroundColor: hum.card, alignSelf: 'flex-start', transform: [{ rotate: '-6deg' }] },
  wordSecond: { backgroundColor: hum.sky, alignSelf: 'flex-end', transform: [{ rotate: '4deg' }] },
  word: { color: hum.ink, fontSize: 15, lineHeight: 21, fontWeight: humType.bold },
  wordWide: { fontSize: 25, lineHeight: 30 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 3 },
  selectors: { flexDirection: 'row' },
  selector: { width: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  dot: { width: 10, height: 10, borderRadius: 6, borderWidth: 1, backgroundColor: hum.card },
  dotSelected: { width: 22, backgroundColor: hum.ink },
  arrows: { flexDirection: 'row', gap: 4 },
  arrow: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: hum.card, borderWidth: 1, borderBottomWidth: 3, borderColor: hum.paperDeep },
  pressed: { opacity: 0.72 },
});
