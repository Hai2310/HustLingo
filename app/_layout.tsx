import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { LearningProvider } from '@/contexts/LearningContext';
import { colors } from '@/theme/colors';
import { MotionPreferenceProvider } from '@/theme/MotionPreference';
import '@/theme/hum.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MotionPreferenceProvider>
        <AuthProvider>
          <LearningProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
          </LearningProvider>
        </AuthProvider>
      </MotionPreferenceProvider>
    </SafeAreaProvider>
  );
}
