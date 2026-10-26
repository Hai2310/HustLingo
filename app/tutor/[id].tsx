import React from 'react';
import { Redirect } from 'expo-router';

export default function EmptyTutorRoute() {
  return <Redirect href="/(tabs)/tutor" />;
}
