import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { PaidPlanEmblem, paidPlanAppearance, usePaidPlanReveal } from '@/components/common/PaidPlanAppearance';
import { formatVnd, subscriptionPlans } from '@/data/plans';
import { cosmic, glassCard } from '@/theme/cosmic';

export function PricingTeaser({ wide = false }: { wide?: boolean }) {
  usePaidPlanReveal('home-plans');
  const action = (
    <Link href="/pricing" style={styles.action} asChild>
      <Pressable accessibilityRole="link" nativeID="home-plans-action">
        <Text style={styles.actionLabel}>Xem gói học</Text>
        <Ionicons aria-hidden name="arrow-forward" size={16} color={cosmic.ice} />
      </Pressable>
    </Link>
  );

  return (
    <View nativeID="home-plans" style={[styles.panel, wide && styles.panelWide]}>
      <View style={[styles.headingRow, wide && styles.headingWide]}>
        <Text accessibilityRole="header" aria-level={2} style={styles.title}>Gói học Plus và Pro</Text>
        {!wide && action}
      </View>
      <View style={[styles.plans, wide && styles.plansWide]}>
        {subscriptionPlans.map(plan => {
          if (plan.id === 'free') return null;
          const tone = paidPlanAppearance[plan.id];
          return (
            <LinearGradient
              key={plan.id}
              nativeID={'home-plan-' + plan.id}
              colors={tone.paper}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={[styles.plan, { borderColor: tone.edge }]}
            >
              <PaidPlanEmblem plan={plan.id} size={wide ? 42 : 34} />
              <View style={styles.planCopy}>
                <Text style={[styles.planName, { color: tone.ink }]}>{plan.name}</Text>
                <View style={styles.rate}>
                  <Text style={styles.price}>{formatVnd(plan.monthlyPrice)}</Text>
                  <Text style={styles.unit}>/ tháng</Text>
                </View>
              </View>
            </LinearGradient>
          );
        })}
      </View>
      {wide && action}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { ...glassCard, borderRadius: 18, borderBottomWidth: 1, padding: 11, gap: 8, backgroundColor: cosmic.panel },
  panelWide: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, minWidth: 0 },
  headingWide: { flexShrink: 0 },
  title: { color: cosmic.text, fontSize: 16, lineHeight: 21, fontWeight: '700', flexShrink: 1 },
  plans: { flexDirection: 'row', gap: 8 },
  plansWide: { flex: 1, minWidth: 0 },
  plan: { flex: 1, minWidth: 0, minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 7, padding: 8, borderWidth: 1, borderRadius: 13, overflow: 'hidden' },
  planCopy: { flex: 1, minWidth: 0, gap: 2 },
  planName: { fontSize: 16, lineHeight: 20, fontWeight: '700' },
  rate: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 4, rowGap: 0 },
  price: { color: cosmic.text, fontSize: 13, lineHeight: 17, fontWeight: '600', fontVariant: ['tabular-nums'] },
  unit: { color: cosmic.muted, fontSize: 12, lineHeight: 16 },
  action: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44, paddingHorizontal: 6, borderRadius: 9 },
  actionLabel: { color: cosmic.ice, fontSize: 13, fontWeight: '600' },
});
