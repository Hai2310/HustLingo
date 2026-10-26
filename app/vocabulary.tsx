import React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { normaliseLessonTopic } from '@/features/lessons/data/catalog';

export default function VocabularyEntryRoute() {
  const { topic } = useLocalSearchParams<{ topic?: string }>();
  return topic ? <Redirect href={{ pathname: '/lessons/topics/[topicId]', params: { topicId: normaliseLessonTopic(topic), type: 'vocabulary' } }} /> : <Redirect href={{ pathname: '/(tabs)/lessons', params: { type: 'vocabulary' } }} />;
}
