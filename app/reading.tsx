import React from 'react';
import { Redirect } from 'expo-router';

export default function ReadingRoute() {
  return <Redirect href={{ pathname: '/(tabs)/practice', params: { skill: 'reading' } }} />;
}
