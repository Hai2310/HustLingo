import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { formatVnd, subscriptionPlans } from '@/data/plans';
import { hum, humType, paperButton } from './homeHum';

const paidPlans = subscriptionPlans.filter(plan => plan.id === 'plus' || plan.id === 'pro');

export function PricingTeaser({ wide = false }: { wide?: boolean }) {
  return (
    <View nativeID="home-plans" style={[styles.panel, wide && styles.panelWide]}>
      <View style={[styles.intro, wide && styles.introWide]}>
        <Text accessibilityRole="header" aria-level={2} style={styles.title}>Gói học Plus và Pro</Text>
        <Text style={styles.description}>Lộ trình mở rộng, luyện thi nâng cao và đồng bộ tiến độ nhiều thiết bị.</Text>
      </View>
      <View style={styles.prices}>
        {paidPlans.map(plan => (
          <View key={plan.id} style={styles.plan}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.description}>{formatVnd(plan.monthlyPrice)} / tháng</Text>
          </View>
        ))}
      </View>
      <Link href="/pricing" style={styles.action} asChild>
        <Pressable>
          <Text style={styles.actionLabel}>Xem gói học</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { paddingHorizontal: 17, paddingVertical: 18, gap: 14, borderRadius: 20, backgroundColor: hum.ink },
  panelWide: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', paddingHorizontal: 20, gap: 20 },
  intro: { minWidth: 0, gap: 5 },
  introWide: { flexGrow: 1, flexShrink: 1, flexBasis: 252 },
  title: { color: hum.card, fontSize: 21, lineHeight: 27, fontWeight: humType.bold },
  description: { color: hum.paperDeep, fontSize: 14, lineHeight: 20 },
  prices: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 19, rowGap: 6 },
  plan: { gap: 2 },
  planName: { color: hum.card, fontSize: 15, lineHeight: 20, fontWeight: humType.bold },
  action: { ...paperButton, alignSelf: 'flex-start', justifyContent: 'center', minHeight: 44, paddingHorizontal: 13, backgroundColor: hum.paper, borderColor: hum.paperDeep },
  actionLabel: { color: hum.ink, fontSize: 15, fontWeight: humType.bold },
});
