import React from 'react';
import { Redirect } from 'expo-router';

export default function GrammarEntryRoute() {
  return <Redirect href={{ pathname: '/(tabs)/lessons', params: { type: 'grammar' } }} />;
}
