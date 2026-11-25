import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { AppButton } from '@/components/Buttons';
import { formatVnd, subscriptionPlans } from '@/data/plans';
import type { BillingCycle } from '@/data/plans';
import { hum, paperButton, paperCard, pricingPaper } from '@/theme/hum';

const palette = {
  free: { paper: [hum.card, hum.paper] as const, edge: hum.rule, ink: hum.muted, icon: 'book-outline' },
  plus: { paper: pricingPaper.plus, edge: hum.skyEdge, ink: hum.blue, icon: 'flash-outline' },
  pro: { paper: pricingPaper.pro, edge: pricingPaper.proEdge, ink: pricingPaper.proInk, icon: 'diamond-outline' },
} as const;

export default function PricingScreen() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const choose = (name: string) => Alert.alert(
    'Gói ' + name,
    'Thanh toán chưa được kết nối trong phiên bản này.',
  );

  return (
    <Screen>
      <PageHeader title="Gói học" />
      <LinearGradient colors={pricingPaper.sheet} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.heroCopy}>
          <Text accessibilityRole="header" style={styles.heroTitle}>Chọn gói học phù hợp</Text>
          <Text style={styles.description}>Bắt đầu với Free hoặc nâng cấp để mở rộng lộ trình học và luyện thi.</Text>
        </View>
        <View aria-hidden style={styles.seal}>
          <Ionicons name="diamond-outline" size={wide ? 32 : 25} color={hum.pearInk} />
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

      <View style={[styles.plans, wide && styles.plansWide]}>
        {subscriptionPlans.map(plan => {
          const tone = palette[plan.id];
          const price = cycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          return (
            <LinearGradient
              key={plan.id}
              colors={tone.paper}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.plan, wide && styles.planWide, { borderColor: tone.edge }]}
            >
              <View style={styles.planHeader}>
                <Text accessibilityRole="header" style={[styles.planName, { color: tone.ink }]}>{plan.name}</Text>
                <Ionicons aria-hidden name={tone.icon} size={23} color={tone.ink} />
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
                icon={plan.id === 'free' ? undefined : 'arrow-forward'}
                onPress={() => choose(plan.name)}
              />
            </LinearGradient>
          );
        })}
      </View>

      <View style={styles.note}>
        <Ionicons aria-hidden name="information-circle-outline" size={20} color={hum.greenInk} />
        <Text style={styles.noteText}>Free vẫn dùng được các chức năng học cốt lõi. Thanh toán Plus và Pro chưa được kết nối trong phiên bản này.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { ...paperCard, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 21, borderColor: pricingPaper.sheetEdge, marginBottom: 19 },
  heroCopy: { flex: 1, minWidth: 0, gap: 7 },
  heroTitle: { color: hum.ink, fontSize: 29, lineHeight: 35, letterSpacing: -0.7, fontWeight: '700' },
  description: { color: hum.muted, fontSize: 14, lineHeight: 21 },
  seal: { ...paperButton, width: 51, height: 51, alignItems: 'center', justifyContent: 'center', backgroundColor: hum.pear, borderColor: hum.pearEdge, transform: [{ rotate: '-7deg' }] },
  toggle: { flexDirection: 'row', alignSelf: 'flex-start', padding: 4, gap: 4, marginBottom: 16, borderRadius: 15, borderWidth: 1, borderColor: hum.rule, backgroundColor: hum.card },
  toggleItem: { minHeight: 44, paddingHorizontal: 15, justifyContent: 'center', borderRadius: 11 },
  toggleSelected: { backgroundColor: hum.pear },
  toggleText: { color: hum.ink, fontSize: 14, fontWeight: '700' },
  plans: { gap: 14 },
  plansWide: { flexDirection: 'row', alignItems: 'stretch' },
  plan: { ...paperCard, padding: 17, gap: 10 },
  planWide: { flex: 1, minWidth: 0 },
  planHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  planName: { fontSize: 23, lineHeight: 29, fontWeight: '700' },
  rate: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 6, rowGap: 2 },
  price: { color: hum.ink, fontSize: 30, lineHeight: 36, fontWeight: '700', letterSpacing: -0.6, fontVariant: ['tabular-nums'] },
  unit: { color: hum.muted, fontSize: 13, lineHeight: 18 },
  features: { flexGrow: 1, gap: 8, marginTop: 4, marginBottom: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: hum.rule },
  feature: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  featureText: { color: hum.ink, fontSize: 13, lineHeight: 18, flex: 1 },
  note: { flexDirection: 'row', gap: 9, alignItems: 'flex-start', borderRadius: 15, backgroundColor: hum.mint, padding: 14, marginTop: 16 },
  noteText: { flex: 1, color: hum.greenInk, fontSize: 13, lineHeight: 19 },
});
