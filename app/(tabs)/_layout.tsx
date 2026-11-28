import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { cosmic } from '@/theme/cosmic';
import { AnimatedTabIcon } from '@/components/AnimatedTabIcon';
import { useMotionPreference } from '@/theme/MotionPreference';
import { HustLogo } from '@/components/HustLogo';

type IconName = keyof typeof Ionicons.glyphMap;
const iconMap: Record<string, [IconName, IconName]> = {
  home: ['home-outline', 'home'],
  lessons: ['book-outline', 'book'],
  practice: ['radio-button-on-outline', 'radio-button-on'],
  tutor: ['chatbubble-ellipses-outline', 'chatbubble-ellipses'],
  profile: ['person-outline', 'person'],
};

function WebTabScene({ children }: React.PropsWithChildren) {
  const focused = useIsFocused();
  // Web can keep inactive tabs attached, so hide their content without resetting tab state.
  return <View style={[styles.sceneFrame, !focused && styles.inactiveScene]}>{children}</View>;
}

export default function TabsLayout() {
  const reduced = useMotionPreference() !== false;
  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 1050;
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Tabs
      screenLayout={Platform.OS === 'web' ? ({ children }) => <WebTabScene>{children}</WebTabScene> : undefined}
      tabBar={props => desktop ? (
        <View nativeID="cosmic-sidebar" style={[styles.sidebar, collapsed && styles.sidebarCollapsed]}>
          <View style={[styles.sidebarHeader, collapsed && styles.sidebarHeaderCollapsed]}>
            {!collapsed && <View style={styles.brand}><HustLogo size={31} showWordmark={false} /><Text style={styles.brandText}>HustLingo</Text></View>}
            <Pressable accessibilityRole="button" accessibilityLabel={collapsed ? 'Mở rộng điều hướng' : 'Thu gọn điều hướng'} accessibilityState={{ expanded: !collapsed }}
              onPress={() => setCollapsed(value => !value)} style={styles.collapse}>
              <Ionicons aria-hidden name={collapsed ? 'chevron-forward' : 'chevron-back'} size={21} color={cosmic.ice} />
            </Pressable>
          </View>
          <BottomTabBar {...props} />
        </View>
      ) : <BottomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: styles.scene,
        animation: reduced || Platform.OS === 'web' ? 'none' : 'fade',
        tabBarActiveTintColor: cosmic.ice,
        tabBarActiveBackgroundColor: desktop ? cosmic.iceSurface : undefined,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarPosition: desktop ? 'left' : 'bottom',
        tabBarShowLabel: !desktop || !collapsed,
        tabBarLabelPosition: desktop ? 'beside-icon' : 'below-icon',
        tabBarStyle: desktop ? styles.sidebarTabs : styles.dock,
        tabBarItemStyle: desktop ? styles.sidebarItem : styles.dockItem,
        tabBarLabelStyle: desktop ? styles.sidebarLabel : styles.label,
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
  scene: { backgroundColor: 'transparent' },
  sceneFrame: { flex: 1 },
  inactiveScene: { display: 'none' },
  dock: { minHeight: 60, marginHorizontal: 12, marginBottom: 7, paddingTop: 3, borderWidth: 1, borderColor: cosmic.border, borderTopColor: cosmic.iceEdge, borderRadius: 22, backgroundColor: cosmic.glass },
  dockItem: { paddingTop: 2, minWidth: 44 },
  label: { fontSize: 11, fontWeight: '700' },
  sidebar: { width: 204, backgroundColor: cosmic.glass, borderRightWidth: 1, borderRightColor: cosmic.border, alignSelf: 'stretch' },
  sidebarCollapsed: { width: 74 },
  sidebarHeader: { paddingHorizontal: 11, minHeight: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  sidebarHeaderCollapsed: { justifyContent: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', minWidth: 0, gap: 7 },
  brandText: { color: cosmic.text, fontSize: 16, fontWeight: '900' },
  collapse: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  sidebarTabs: { backgroundColor: 'transparent', borderWidth: 0, borderRightWidth: 0, paddingHorizontal: 5, minWidth: 0 },
  sidebarItem: { minHeight: 50, borderRadius: 13, marginBottom: 4 },
  sidebarLabel: { fontSize: 13, fontWeight: '800' },
});
