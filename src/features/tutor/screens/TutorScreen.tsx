import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';

export function TutorScreen() {
  return <View style={styles.container} />;
}

export default TutorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
