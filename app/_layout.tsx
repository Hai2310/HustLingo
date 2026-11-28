import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { LearningProvider } from '@/contexts/LearningContext';
import { WebMascot } from '@/components/common/WebMascot';
import { CosmicBackground } from '@/components/common/CosmicBackground';
import { LearningCelebration } from '@/components/common/LearningCelebration';
import { cosmic } from '@/theme/cosmic';
import { MotionPreferenceProvider, useMotionPreference } from '@/theme/MotionPreference';
import '@/theme/cosmic.css';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'transparent',
    card: cosmic.panel,
    text: cosmic.text,
    primary: cosmic.ice,
    border: cosmic.border,
    notification: cosmic.rose,
  },
};

function CosmicNavigation() {
  const reduced = useMotionPreference() !== false;
  return (
    <ThemeProvider value={navigationTheme}>
      <View nativeID="hustlingo-cosmic" style={styles.shell}>
        <CosmicBackground />
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: styles.scene, animation: reduced || Platform.OS === 'web' ? 'none' : 'fade_from_bottom' }} />
        <WebMascot />
        <LearningCelebration />
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MotionPreferenceProvider>
        <AuthProvider>
          <LearningProvider>
            <CosmicNavigation />
          </LearningProvider>
        </AuthProvider>
      </MotionPreferenceProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: cosmic.canvas },
  scene: { backgroundColor: 'transparent' },
});
