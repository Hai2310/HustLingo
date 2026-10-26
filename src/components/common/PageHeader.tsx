import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable onPress={()=>router.back()} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.text}/></Pressable>
        <View style={{flex:1}}>
          <Text style={styles.title}>{title}</Text>
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
  back:{width:40,height:40,borderRadius:12,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,alignItems:'center',justifyContent:'center'},
  title:{fontSize:24,fontWeight:'900',color:colors.text,letterSpacing:-.65},
  sub:{fontSize:12,color:colors.textSecondary,marginTop:3,lineHeight:17}
});
