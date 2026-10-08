import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';

export function PracticeScreen() {
  return <View style={styles.container} />;
}

export default PracticeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
