import React from 'react';
import { Redirect } from 'expo-router';

export default function WritingRoute() {
  return <Redirect href={{ pathname: '/(tabs)/practice', params: { skill: 'writing' } }} />;
}
