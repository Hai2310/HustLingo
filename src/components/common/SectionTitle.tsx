import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <View style={styles.wrap}><View style={styles.copy}><View style={styles.bar}/><View><Text style={styles.title}>{title}</Text>{subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}</View></View>{action}</View>;
}
const styles=StyleSheet.create({wrap:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginBottom:11},copy:{flexDirection:'row',gap:9,alignItems:'flex-start',flex:1},bar:{width:3,height:28,borderRadius:4,backgroundColor:colors.primary,marginTop:2},title:{fontSize:17,fontWeight:'900',color:colors.text,letterSpacing:-.35},sub:{fontSize:10.5,color:colors.textSecondary,marginTop:2}});
