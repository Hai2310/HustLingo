import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/layout';

export function AuthField({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={styles.wrap}><Text style={styles.label}>{label}</Text><TextInput placeholderTextColor={colors.textMuted} {...props} style={[styles.input, props.style]} /></View>;
}

const styles=StyleSheet.create({
  wrap:{gap:7},
  label:{fontSize:12.5,fontWeight:'800',color:colors.text},
  input:{height:52,borderRadius:radius.md,borderWidth:1,borderColor:colors.borderStrong,backgroundColor:colors.surface,paddingHorizontal:14,fontSize:14.5,color:colors.text}
});
