import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { maxContentWidth } from '@/theme/layout';
import { AmbientBackground } from './AmbientBackground';

export function Screen({ children, scroll = true, contentStyle, ambient = true }: { children: React.ReactNode; scroll?: boolean; contentStyle?: StyleProp<ViewStyle>; ambient?: boolean }) {
  const body = <View style={[styles.content, contentStyle]}>{children}</View>;
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      {ambient && <AmbientBackground />}
      {scroll ? <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>{body}</ScrollView> : body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, alignItems: 'center', paddingBottom: 108 },
  content: { width: '100%', maxWidth: maxContentWidth, paddingHorizontal: 18, paddingTop: 14 },
});
