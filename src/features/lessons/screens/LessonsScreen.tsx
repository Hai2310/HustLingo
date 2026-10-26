import React from "react";
import { StyleSheet, View } from "react-native";
import { Screen } from "@/components/Screen";

export function LessonsScreen() {
  return (
    <Screen
      scroll={false}
      ambient={false}
      contentStyle={styles.content}
    >
      <View style={styles.blank} />
    </Screen>
  );
}

export default LessonsScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  blank: {
    flex: 1,
  },
});
