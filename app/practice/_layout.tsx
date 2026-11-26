import React from 'react';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function PracticeLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: Platform.OS === 'web' ? 'none' : 'slide_from_right' }} />;
}
