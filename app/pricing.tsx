import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { AppButton } from '@/components/Buttons';
import { PaidPlanEmblem, paidPlanAppearance, usePaidPlanReveal } from '@/components/common/PaidPlanAppearance';
import { formatVnd, subscriptionPlans } from '@/data/plans';
import type { BillingCycle } from '@/data/plans';
import { cosmic, gameButton, glassCard, pricingSpectrum } from '@/theme/cosmic';

const freeAppearance = { paper: [cosmic.glass, cosmic.canvas] as const, edge: cosmic.border, ink: cosmic.muted };

export default function PricingScreen() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  usePaidPlanReveal('pricing-plans');
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const choose = (name: string) => Alert.alert(
    'Gói ' + name,
    'Thanh toán chưa được kết nối trong phiên bản này.',
  );

  return (
    <Screen>
      <PageHeader title="Gói học" />
      <LinearGradient colors={pricingSpectrum.sheet} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.heroCopy}>
          <Text accessibilityRole="header" style={styles.heroTitle}>Chọn gói học phù hợp</Text>
          <Text style={styles.description}>Bắt đầu với Free hoặc nâng cấp để mở rộng lộ trình học và luyện thi.</Text>
        </View>
        <View aria-hidden style={styles.seal}>
          <Ionicons name="diamond-outline" size={wide ? 32 : 25} color={cosmic.violet} />
        </View>
      </LinearGradient>

      <View style={styles.toggle} accessibilityLabel="Chu kỳ thanh toán">
        {(['monthly', 'yearly'] as const).map(option => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: cycle === option }}
            onPress={() => setCycle(option)}
            style={[styles.toggleItem, cycle === option && styles.toggleSelected]}
          >
            <Text style={styles.toggleText}>{option === 'monthly' ? 'Theo tháng' : 'Theo năm'}</Text>
          </Pressable>
        ))}
      </View>

      <View nativeID="pricing-plans" style={[styles.plans, wide && styles.plansWide]}>
        {subscriptionPlans.map(plan => {
          const tone = plan.id === 'free' ? freeAppearance : paidPlanAppearance[plan.id];
          const price = cycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          return (
            <LinearGradient
              key={plan.id}
              nativeID={'pricing-plan-' + plan.id}
              colors={tone.paper}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.plan, wide && styles.planWide, { borderColor: tone.edge }]}
            >
              <View style={styles.planHeader}>
                <Text accessibilityRole="header" style={[styles.planName, { color: tone.ink }]}>{plan.name}</Text>
                {plan.id === 'free'
                  ? <View style={styles.freeEmblem}><Ionicons aria-hidden name="book-outline" size={25} color={tone.ink} /></View>
                  : <PaidPlanEmblem plan={plan.id} size={68} />}
              </View>
              <Text style={styles.description}>{plan.description}</Text>
              <View style={styles.rate}>
                <Text style={styles.price}>{formatVnd(price)}</Text>
                {price > 0 && <Text style={styles.unit}>/ {cycle === 'monthly' ? 'tháng' : 'năm'}</Text>}
              </View>
              {cycle === 'yearly' && price > 0 && (
                <Text style={styles.unit}>Khoảng {formatVnd(Math.round(price / 12))} mỗi tháng</Text>
              )}
              <View style={styles.features}>
                {plan.features.map(feature => (
                  <View key={feature} style={styles.feature}>
                    <Ionicons aria-hidden name="checkmark-circle-outline" size={17} color={tone.ink} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              <AppButton
                title={plan.id === 'free' ? 'Đang dùng Free' : 'Chọn ' + plan.name}
                variant={plan.id === 'pro' ? 'primary' : 'secondary'}
                style={plan.id === 'free' ? undefined : { borderColor: tone.edge }}
                icon={plan.id === 'free' ? undefined : 'arrow-forward'}
                onPress={() => choose(plan.name)}
              />
            </LinearGradient>
          );
        })}
      </View>

      <View style={styles.note}>
        <Ionicons aria-hidden name="information-circle-outline" size={20} color={cosmic.mint} />
        <Text style={styles.noteText}>Free vẫn dùng được các chức năng học cốt lõi. Thanh toán Plus và Pro chưa được kết nối trong phiên bản này.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { ...glassCard, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 21, borderColor: pricingSpectrum.sheetEdge, marginBottom: 19 },
  heroCopy: { flex: 1, minWidth: 0, gap: 7 },
  heroTitle: { color: cosmic.text, fontSize: 29, lineHeight: 35, letterSpacing: -0.7, fontWeight: '700' },
  description: { color: cosmic.muted, fontSize: 14, lineHeight: 21 },
  seal: { ...gameButton, width: 51, height: 51, alignItems: 'center', justifyContent: 'center', backgroundColor: cosmic.action, borderColor: cosmic.actionEdge, transform: [{ rotate: '-7deg' }] },
  toggle: { flexDirection: 'row', alignSelf: 'flex-start', padding: 4, gap: 4, marginBottom: 16, borderRadius: 15, borderWidth: 1, borderColor: cosmic.border, backgroundColor: cosmic.glass },
  toggleItem: { minHeight: 44, paddingHorizontal: 15, justifyContent: 'center', borderRadius: 11 },
  toggleSelected: { backgroundColor: cosmic.action },
  toggleText: { color: cosmic.text, fontSize: 14, fontWeight: '700' },
  plans: { gap: 14 },
  plansWide: { flexDirection: 'row', alignItems: 'stretch' },
  plan: { ...glassCard, padding: 17, gap: 10, overflow: 'hidden' },
  planWide: { flex: 1, minWidth: 0 },
  planHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  freeEmblem: { width: 68, height: 68, alignItems: 'center', justifyContent: 'center' },
  planName: { fontSize: 23, lineHeight: 29, fontWeight: '700' },
  rate: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 6, rowGap: 2 },
  price: { color: cosmic.text, fontSize: 30, lineHeight: 36, fontWeight: '700', letterSpacing: -0.6, fontVariant: ['tabular-nums'] },
  unit: { color: cosmic.muted, fontSize: 13, lineHeight: 18 },
  features: { flexGrow: 1, gap: 8, marginTop: 4, marginBottom: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: cosmic.border },
  feature: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  featureText: { color: cosmic.text, fontSize: 13, lineHeight: 18, flex: 1 },
  note: { flexDirection: 'row', gap: 9, alignItems: 'flex-start', borderRadius: 15, backgroundColor: cosmic.mintSurface, padding: 14, marginTop: 16 },
  noteText: { flex: 1, color: cosmic.mint, fontSize: 13, lineHeight: 19 },
});
