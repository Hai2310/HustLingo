import React from 'react';
import { Redirect } from 'expo-router';

export default function ListeningRoute() {
  return <Redirect href={{ pathname: '/(tabs)/practice', params: { skill: 'listening' } }} />;
}
