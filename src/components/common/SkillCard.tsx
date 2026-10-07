import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from './AppCard';
import { colors } from '@/theme/colors';
import { FadeIn } from '../motion/Motion';

export function SkillCard({ title, subtitle, icon, onPress, accent = colors.primarySoft, delay=0 }: { title:string; subtitle:string; icon:keyof typeof Ionicons.glyphMap; onPress:()=>void; accent?:string; delay?:number }) {
  return <FadeIn delay={delay} style={styles.motion}><AppCard onPress={onPress} style={styles.card}><View style={styles.top}><View style={[styles.icon,{backgroundColor:accent}]}><Ionicons name={icon} size={22} color={colors.primary} /></View><Ionicons name="arrow-forward" size={17} color={colors.textMuted} /></View><Text style={styles.title}>{title}</Text><Text style={styles.sub}>{subtitle}</Text></AppCard></FadeIn>;
}
const styles=StyleSheet.create({motion:{width:'48.6%'},card:{minHeight:138,justifyContent:'space-between'},top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10},icon:{width:42,height:42,borderRadius:12,alignItems:'center',justifyContent:'center'},title:{fontSize:15.5,fontWeight:'900',color:colors.text,letterSpacing:-0.2},sub:{fontSize:12,lineHeight:17,color:colors.textSecondary,marginTop:4}});
