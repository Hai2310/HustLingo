import React from 'react';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { useReducedLessonMotion } from '@/features/lessons/hooks/useReducedLessonMotion';

export default function LessonLayout() {
  const reduced = useReducedLessonMotion();
  return <Stack screenOptions={{ headerShown: false, animation: reduced || Platform.OS === 'web' ? 'none' : 'slide_from_right' }} />;
}
