import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { paperButton } from '@/theme/hum';

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" onPress={()=>router.back()} style={styles.back}><Ionicons aria-hidden name="arrow-back" size={20} color={colors.text}/></Pressable>
        <View style={styles.copy}>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          {subtitle?<Text style={styles.sub}>{subtitle}</Text>:null}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
  wrap:{marginBottom:18},
  row:{flexDirection:'row',alignItems:'center',gap:12},
  back:{...paperButton,width:44,height:44,backgroundColor:colors.surface,borderColor:colors.borderStrong,alignItems:'center',justifyContent:'center'},
  copy:{flex:1,minWidth:0},
  title:{fontSize:27,lineHeight:34,fontWeight:'700',color:colors.text,letterSpacing:-.65},
  sub:{fontSize:14,color:colors.textSecondary,marginTop:3,lineHeight:20}
});
