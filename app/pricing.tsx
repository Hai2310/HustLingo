import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { FadeIn, MotionPressable, ScaleIn } from '@/components/Motion';
import { BillingCycle, formatVnd, subscriptionPlans } from '@/data/plans';
import { colors } from '@/theme/colors';

const planPalette = {
  free: { border: colors.border, soft: colors.surface, accent: colors.text, gradient: ['#FFFFFF', '#FFF8F2'] as const },
  plus: { border: '#FFC7CF', soft: '#FFF1F4', accent: colors.primary, gradient: ['#FFF4EA', '#FFE5EC', '#F2F0FF'] as const },
  pro: { border: '#292932', soft: colors.charcoal, accent: '#FFE0A8', gradient: ['#24242B', '#5B1025'] as const },
};

export default function PricingScreen() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const choose = (name: string) => Alert.alert(`${name} đã sẵn sàng về giao diện`, 'Bản v1.4 chưa kết nối cổng thanh toán. Bạn có thể tích hợp Google Play Billing / App Store / Stripe sau mà không cần đổi màn hình này.');

  return <Screen>
    <FadeIn><View style={styles.topbar}>
      <Pressable onPress={()=>router.back()} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.text}/></Pressable>
      <View style={styles.topCopy}><Text style={styles.topKicker}>HUSTLINGO PREMIUM</Text><Text style={styles.topTitle}>Chọn nhịp học phù hợp.</Text></View>
      <View style={{width:40}} />
    </View></FadeIn>

    <FadeIn delay={60}>
      <LinearGradient colors={['#D10A34','#FF5B62','#FF9D42']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.hero}>
        <View style={styles.heroBlob}/><View style={styles.heroBlob2}/>
        <View style={{flex:1,zIndex:2}}><Text style={styles.heroKicker}>PLUS · PRO</Text><Text style={styles.heroTitle}>Đầu tư vào thói quen học{`\n`}thay vì học theo cảm hứng.</Text><Text style={styles.heroSub}>Giữ trải nghiệm Free để bắt đầu. Nâng cấp khi bạn cần lộ trình sâu và bộ luyện mở rộng.</Text></View>
        <View style={styles.heroIcon}><Ionicons name="diamond" size={30} color={colors.white}/></View>
      </LinearGradient>
    </FadeIn>

    <FadeIn delay={100}>
      <View style={styles.toggle}>
        <Pressable onPress={()=>setCycle('monthly')} style={[styles.toggleItem,cycle==='monthly'&&styles.toggleOn]}><Text style={[styles.toggleText,cycle==='monthly'&&styles.toggleTextOn]}>Theo tháng</Text></Pressable>
        <Pressable onPress={()=>setCycle('yearly')} style={[styles.toggleItem,cycle==='yearly'&&styles.toggleOn]}><Text style={[styles.toggleText,cycle==='yearly'&&styles.toggleTextOn]}>Theo năm</Text><View style={styles.save}><Text style={styles.saveText}>Tiết kiệm ~20%</Text></View></Pressable>
      </View>
    </FadeIn>

    <View style={styles.plans}>
      {subscriptionPlans.map((plan,i)=>{
        const palette=planPalette[plan.id];
        const dark=plan.id==='pro';
        const price=cycle==='monthly'?plan.monthlyPrice:plan.yearlyPrice;
        return <ScaleIn key={plan.id} delay={140+i*70} style={styles.planWrap}>
          <LinearGradient colors={palette.gradient as any} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.plan,{borderColor:palette.border}]}>
            {plan.highlight&&<View style={[styles.ribbon,{backgroundColor:plan.id==='plus'?colors.primary:'#F0B756'}]}><Text style={styles.ribbonText}>{plan.highlight}</Text></View>}
            <Text style={[styles.eyebrow,{color:dark?'#F5C875':palette.accent}]}>{plan.eyebrow}</Text>
            <Text style={[styles.planName,dark&&styles.lightText]}>{plan.name}</Text>
            <Text style={[styles.description,dark&&styles.darkMuted]}>{plan.description}</Text>
            <View style={styles.priceRow}><Text style={[styles.price,dark&&styles.lightText]}>{formatVnd(price)}</Text>{price>0&&<Text style={[styles.period,dark&&styles.darkMuted]}>/{cycle==='monthly'?'tháng':'năm'}</Text>}</View>
            {cycle==='yearly'&&price>0&&<Text style={[styles.equivalent,dark&&styles.darkMuted]}>Tương đương khoảng {formatVnd(Math.round(price/12))}/tháng</Text>}
            <View style={styles.divider}/>
            <View style={styles.features}>{plan.features.map(f=><View key={f} style={styles.feature}><View style={[styles.check,{backgroundColor:dark?'rgba(255,255,255,.12)':palette.soft}]}><Ionicons name="checkmark" size={13} color={dark?'#FFE0A8':palette.accent}/></View><Text style={[styles.featureText,dark&&styles.darkFeature]}>{f}</Text></View>)}</View>
            <MotionPressable onPress={()=>choose(plan.name)} style={[styles.cta,plan.id==='free'?styles.freeCta:plan.id==='plus'?styles.plusCta:styles.proCta]}>
              <Text style={[styles.ctaText,plan.id==='free'&&{color:colors.text},plan.id==='pro'&&{color:colors.charcoal}]}>{plan.id==='free'?'Đang dùng Free':`Chọn ${plan.name}`}</Text>
              {plan.id!=='free'&&<Ionicons name="arrow-forward" size={15} color={plan.id==='pro'?colors.charcoal:colors.white}/>} 
            </MotionPressable>
          </LinearGradient>
        </ScaleIn>
      })}
    </View>

    <FadeIn delay={390}><View style={styles.note}><Ionicons name="shield-checkmark-outline" size={18} color={colors.success}/><View style={{flex:1}}><Text style={styles.noteTitle}>Không khóa trải nghiệm học cơ bản.</Text><Text style={styles.noteText}>Free vẫn dùng được các chức năng học cốt lõi. Plus/Pro là lớp nâng cấp. Thanh toán chưa được kết nối trong bản này.</Text></View></View></FadeIn>
  </Screen>;
}

const styles=StyleSheet.create({
  topbar:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:18},back:{width:40,height:40,borderRadius:12,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,alignItems:'center',justifyContent:'center'},topCopy:{flex:1,alignItems:'center'},topKicker:{fontSize:8,fontWeight:'900',letterSpacing:1.2,color:colors.primary},topTitle:{fontSize:20,fontWeight:'900',color:colors.text,letterSpacing:-.5,marginTop:2},
  hero:{borderRadius:24,padding:22,minHeight:185,flexDirection:'row',alignItems:'center',overflow:'hidden',marginBottom:16,shadowColor:'#A31736',shadowOpacity:.18,shadowRadius:26,shadowOffset:{width:0,height:12},elevation:5},heroBlob:{position:'absolute',width:200,height:200,borderRadius:100,backgroundColor:'rgba(255,255,255,.12)',right:-50,top:-80},heroBlob2:{position:'absolute',width:120,height:120,borderRadius:60,backgroundColor:'rgba(255,255,255,.09)',left:'45%',bottom:-75},heroKicker:{fontSize:9,fontWeight:'900',letterSpacing:1.2,color:'#FFE9D8'},heroTitle:{fontSize:25,lineHeight:30,fontWeight:'900',color:colors.white,letterSpacing:-.7,marginTop:7},heroSub:{fontSize:10.5,lineHeight:16,color:'rgba(255,255,255,.84)',marginTop:8,maxWidth:620},heroIcon:{width:78,height:78,borderRadius:24,backgroundColor:'rgba(255,255,255,.14)',borderWidth:1,borderColor:'rgba(255,255,255,.24)',alignItems:'center',justifyContent:'center',marginLeft:18,zIndex:2},
  toggle:{alignSelf:'center',backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:14,padding:4,flexDirection:'row',gap:4,marginBottom:16},toggleItem:{minHeight:38,paddingHorizontal:15,borderRadius:10,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:7},toggleOn:{backgroundColor:colors.charcoal},toggleText:{fontSize:10.5,fontWeight:'800',color:colors.textSecondary},toggleTextOn:{color:colors.white},save:{backgroundColor:'#FFF1D5',paddingHorizontal:6,paddingVertical:3,borderRadius:99},saveText:{fontSize:7.5,fontWeight:'900',color:'#9A6412'},
  plans:{flexDirection:'row',flexWrap:'wrap',gap:12,alignItems:'stretch'},planWrap:{flexGrow:1,flexBasis:300,minWidth:260},plan:{borderRadius:22,borderWidth:1,padding:18,minHeight:430,overflow:'hidden'},ribbon:{position:'absolute',top:14,right:-34,transform:[{rotate:'38deg'}],paddingVertical:6,width:130,alignItems:'center'},ribbonText:{fontSize:7.5,fontWeight:'900',color:colors.white},eyebrow:{fontSize:8.5,fontWeight:'900',letterSpacing:1.2},planName:{fontSize:26,fontWeight:'900',color:colors.text,letterSpacing:-.8,marginTop:5},description:{fontSize:10.5,lineHeight:16,color:colors.textSecondary,marginTop:5,minHeight:48,maxWidth:300},lightText:{color:colors.white},darkMuted:{color:'#CBC7C1'},priceRow:{flexDirection:'row',alignItems:'flex-end',gap:4,marginTop:15},price:{fontSize:28,fontWeight:'900',color:colors.text,letterSpacing:-.7},period:{fontSize:9.5,color:colors.textMuted,marginBottom:5},equivalent:{fontSize:8.5,color:colors.textMuted,marginTop:2},divider:{height:1,backgroundColor:'rgba(120,90,80,.15)',marginVertical:16},features:{gap:10,flex:1},feature:{flexDirection:'row',alignItems:'center',gap:9},check:{width:25,height:25,borderRadius:8,alignItems:'center',justifyContent:'center'},featureText:{fontSize:10.5,lineHeight:15,color:colors.text,flex:1},darkFeature:{color:'#F5F1EC'},cta:{minHeight:45,borderRadius:12,marginTop:18,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8},freeCta:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.borderStrong},plusCta:{backgroundColor:colors.primary},proCta:{backgroundColor:'#FFE0A8'},ctaText:{fontSize:11.5,fontWeight:'900',color:colors.white},
  note:{marginTop:18,backgroundColor:colors.successSoft,borderRadius:16,padding:14,flexDirection:'row',gap:10,alignItems:'flex-start'},noteTitle:{fontSize:11.5,fontWeight:'900',color:colors.text},noteText:{fontSize:9.5,lineHeight:14,color:colors.textSecondary,marginTop:3},
});
