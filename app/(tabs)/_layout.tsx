import React from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { hum } from '@/theme/hum';
import { AnimatedTabIcon } from '@/components/AnimatedTabIcon';

type IconName = keyof typeof Ionicons.glyphMap;
const iconMap: Record<string, [IconName, IconName]> = {
  home: ['home-outline', 'home'],
  lessons: ['book-outline', 'book'],
  practice: ['radio-button-on-outline', 'radio-button-on'],
  tutor: ['chatbubble-ellipses-outline', 'chatbubble-ellipses'],
  profile: ['person-outline', 'person'],
};
export default function TabsLayout() {
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: hum.ink,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: styles.tab,
      tabBarItemStyle: styles.item,
      tabBarLabelStyle: styles.label,
      tabBarIcon: ({ color, size, focused }) => (
        <AnimatedTabIcon name={iconMap[route.name]?.[focused ? 1 : 0] ?? 'ellipse-outline'} focused={focused} color={color} size={size} />
      ),
    })}>
      <Tabs.Screen name="home" options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="lessons" options={{ title: 'Bài học' }} />
      <Tabs.Screen name="practice" options={{ title: 'Luyện tập' }} />
      <Tabs.Screen name="tutor" options={{ title: 'Gia sư' }} />
      <Tabs.Screen name="profile" options={{ title: 'Hồ sơ' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tab: { height: 78, paddingTop: 6, paddingBottom: 9, borderTopWidth: 1, borderTopColor: hum.rule, backgroundColor: hum.card },
  item: { paddingTop: 2 },
  label: { fontSize: 11, fontWeight: '700' },
});
