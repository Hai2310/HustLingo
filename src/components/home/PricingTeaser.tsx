import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { formatVnd, subscriptionPlans } from '@/data/plans';
import { hum, humType, paperButton, pricingPaper } from '@/theme/hum';

const paidPlans = subscriptionPlans.filter(plan => plan.id === 'plus' || plan.id === 'pro');

export function PricingTeaser({ wide = false }: { wide?: boolean }) {
  const action = (
    <Link href="/pricing" style={styles.action} asChild>
      <Pressable nativeID="home-plans-action">
        <Text style={styles.actionLabel}>Xem gói học</Text>
        <Ionicons aria-hidden name="arrow-forward" size={17} color={hum.ink} />
      </Pressable>
    </Link>
  );

  return (
    <LinearGradient
      nativeID="home-plans"
      colors={pricingPaper.sheet}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.panel, wide && styles.panelWide]}
    >
      <View style={[styles.intro, wide && styles.introWide]}>
        <View style={styles.titleRow}>
          <View aria-hidden style={styles.seal}>
            <Ionicons aria-hidden name="sparkles" size={21} color={pricingPaper.proInk} />
          </View>
          <Text accessibilityRole="header" aria-level={2} style={[styles.title, wide && styles.titleWide]}>Gói học Plus và Pro</Text>
        </View>
        <Text style={styles.description}>Mở rộng lộ trình học, luyện thi nâng cao và đồng bộ tiến độ trên nhiều thiết bị.</Text>
        {wide && action}
      </View>
      <View style={[styles.plans, wide && styles.plansWide]}>
        {paidPlans.map(plan => {
          const pro = plan.id === 'pro';
          const accent = pro ? pricingPaper.proInk : hum.blue;
          return (
            <LinearGradient
              key={plan.id}
              nativeID={'home-plan-' + plan.id}
              colors={pro ? pricingPaper.pro : pricingPaper.plus}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={[styles.plan, wide && styles.planWide, { borderColor: pro ? pricingPaper.proEdge : hum.skyEdge }]}
            >
              <View style={styles.planHeading}>
                <Text style={[styles.planName, { color: accent }]}>{plan.name}</Text>
                <Ionicons aria-hidden name={pro ? 'diamond-outline' : 'flash-outline'} size={19} color={accent} />
              </View>
              <View style={styles.rate}>
                <Text style={[styles.price, wide && styles.priceWide]}>{formatVnd(plan.monthlyPrice)}</Text>
                <Text style={styles.unit}>/ tháng</Text>
              </View>
              <Text style={styles.benefit}>{pro ? 'Thống kê học tập chuyên sâu' : 'Ôn tập nâng cao theo tiến độ'}</Text>
            </LinearGradient>
          );
        })}
      </View>
      {!wide && action}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  panel: { padding: 15, gap: 15, borderRadius: 22, borderWidth: 1, borderBottomWidth: 4, borderColor: pricingPaper.sheetEdge },
  panelWide: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', padding: 22, gap: 24 },
  intro: { minWidth: 0, gap: 8 },
  introWide: { flexGrow: 1, flexBasis: 260 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  seal: { width: 40, height: 40, borderRadius: 11, borderWidth: 1, borderBottomWidth: 3, borderColor: pricingPaper.proEdge, alignItems: 'center', justifyContent: 'center', backgroundColor: hum.pear, transform: [{ rotate: '-7deg' }] },
  title: { flexShrink: 1, color: hum.ink, fontSize: 22, lineHeight: 27, letterSpacing: -0.45, fontWeight: humType.bold },
  titleWide: { fontSize: 28, lineHeight: 33, letterSpacing: -0.8 },
  description: { color: hum.ink, fontSize: 14, lineHeight: 21, maxWidth: 390 },
  plans: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  plansWide: { flexGrow: 1, flexBasis: 360, gap: 13 },
  plan: { flexGrow: 1, flexBasis: 112, minWidth: 0, padding: 10, borderWidth: 1, borderBottomWidth: 4, borderRadius: 16, gap: 7 },
  planWide: { padding: 15, gap: 9, borderRadius: 17 },
  planHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 5 },
  planName: { fontSize: 18, lineHeight: 23, fontWeight: humType.bold },
  rate: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 5, rowGap: 1 },
  price: { color: hum.ink, fontSize: 22, lineHeight: 26, letterSpacing: -0.5, fontWeight: humType.bold, fontVariant: ['tabular-nums'] },
  priceWide: { fontSize: 29, lineHeight: 33, letterSpacing: -0.8 },
  unit: { color: hum.muted, fontSize: 13, lineHeight: 18 },
  benefit: { color: hum.ink, fontSize: 13, lineHeight: 18 },
  action: { ...paperButton, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, minHeight: 45, paddingHorizontal: 14, backgroundColor: hum.pear, borderColor: hum.pearEdge },
  actionLabel: { color: hum.ink, fontSize: 15, fontWeight: humType.bold },
});
