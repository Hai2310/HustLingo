import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { FadeIn, Float } from '../motion/Motion';

export function PricingTeaser() {
  return (
    <FadeIn delay={470}>
      <LinearGradient colors={['#FFF1E4', '#FFE7ED', '#EEF2FF']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.wrap}>
        <View style={styles.glow} />
        <View style={styles.copy}>
          <View style={styles.eyebrow}><Ionicons name="diamond-outline" size={13} color={colors.primary}/><Text style={styles.eyebrowText}>HUSTLINGO PREMIUM</Text></View>
          <Text style={styles.title}>Học sâu hơn với Plus & Pro.</Text>
          <Text style={styles.sub}>Lộ trình mở rộng, luyện thi nâng cao và đồng bộ tiến độ nhiều thiết bị.</Text>
          <Pressable onPress={()=>router.push('/pricing')} style={({pressed})=>[styles.cta,pressed&&{transform:[{scale:.98}]}]}>
            <Text style={styles.ctaText}>Xem gói học</Text><Ionicons name="arrow-forward" size={15} color={colors.white}/>
          </Pressable>
        </View>
        <Float distance={6} duration={2400} style={styles.visual}>
          <View style={styles.plus}><Text style={styles.plusTag}>PLUS</Text><Text style={styles.plusPrice}>49K</Text><Text style={styles.plusMini}>/ tháng</Text></View>
          <View style={styles.pro}><Text style={styles.proTag}>PRO</Text><Ionicons name="sparkles" size={18} color="#FFE0A8"/></View>
        </Float>
      </LinearGradient>
    </FadeIn>
  );
}

const styles=StyleSheet.create({
  wrap:{borderRadius:22,padding:18,minHeight:176,flexDirection:'row',alignItems:'center',overflow:'hidden',borderWidth:1,borderColor:'#F3DAD5',shadowColor:'#B44A55',shadowOpacity:.08,shadowRadius:24,shadowOffset:{width:0,height:10},elevation:3},
  glow:{position:'absolute',width:190,height:190,borderRadius:95,backgroundColor:'rgba(255,255,255,.52)',right:-55,top:-80},
  copy:{flex:1,paddingRight:12,zIndex:2},
  eyebrow:{flexDirection:'row',alignItems:'center',gap:6},
  title:{fontSize:21,lineHeight:26,fontWeight:'900',color:colors.text,letterSpacing:-.5,marginTop:7},
  sub:{fontSize:10.5,lineHeight:16,color:colors.textSecondary,marginTop:5,maxWidth:560},
  cta:{alignSelf:'flex-start',marginTop:13,borderRadius:11,backgroundColor:colors.primary,minHeight:38,paddingHorizontal:13,flexDirection:'row',gap:7,alignItems:'center'},
  ctaText:{fontSize:10.5,fontWeight:'900',color:colors.white},
  visual:{width:126,height:128,justifyContent:'center',alignItems:'center'},
  plus:{width:88,height:102,borderRadius:18,backgroundColor:colors.white,borderWidth:1,borderColor:'#FFD5D7',alignItems:'center',justifyContent:'center',transform:[{rotate:'-6deg'}],shadowColor:'#B23B50',shadowOpacity:.12,shadowRadius:16,shadowOffset:{width:0,height:8},elevation:3},
  plusTag:{fontSize:8,fontWeight:'900',letterSpacing:1,color:colors.primary},
  plusPrice:{fontSize:24,fontWeight:'900',color:colors.text,marginTop:4},
  plusMini:{fontSize:8,color:colors.textMuted},
  pro:{position:'absolute',right:0,bottom:5,width:62,height:54,borderRadius:15,backgroundColor:colors.charcoal,alignItems:'center',justifyContent:'center',gap:2,transform:[{rotate:'7deg'}]},
  proTag:{fontSize:8,fontWeight:'900',color:colors.white,letterSpacing:1},
  eyebrowText:{fontSize:8,fontWeight:'900',color:colors.primary},
});
