import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HustLogo } from '@/components/HustLogo';
import { AuthField } from '@/components/AuthField';
import { AppButton } from '@/components/Buttons';
import { useAuth } from '@/contexts/AuthContext';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { colors } from '@/theme/colors';

export default function SignIn(){
 const {signIn}=useAuth(); const social=useSocialAuth(); const[email,setEmail]=useState(''); const[password,setPassword]=useState(''); const[loading,setLoading]=useState(false);
 async function submit(){try{setLoading(true);await signIn(email.trim(),password);router.replace('/(tabs)/home')}catch(e:any){Alert.alert('Không thể đăng nhập',e?.message||'Kiểm tra thông tin tài khoản.')}finally{setLoading(false)}}
 return <SafeAreaView style={styles.safe} edges={['top','bottom']}><ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"><View style={styles.page}>
   <Pressable onPress={()=>router.back()} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.text}/></Pressable>
   <HustLogo size={44}/>
   <Text style={styles.title}>Đăng nhập HustLingo</Text><Text style={styles.sub}>Đồng bộ tiến độ trên nhiều thiết bị. Bạn vẫn có thể học ở chế độ khách.</Text>
   <View style={styles.form}><AuthField label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail}/><AuthField label="Mật khẩu" secureTextEntry value={password} onChangeText={setPassword}/><AppButton title="Đăng nhập" loading={loading} onPress={submit}/></View>
   <View style={styles.or}><View style={styles.line}/><Text style={styles.orText}>hoặc</Text><View style={styles.line}/></View>
   <View style={styles.social}><AppButton title="Tiếp tục với Google" variant="secondary" onPress={()=>social.signInWithGoogle()}/><AppButton title="Tiếp tục với Facebook" variant="secondary" onPress={()=>social.signInWithFacebook()}/></View>
   <Pressable onPress={()=>router.replace('/(tabs)/home')}><Text style={styles.guest}>Bỏ qua, vào học ngay</Text></Pressable>
   <Pressable onPress={()=>router.push('/(auth)/signup')}><Text style={styles.link}>Chưa có tài khoản? <Text style={{fontWeight:'900'}}>Đăng ký</Text></Text></Pressable>
 </View></ScrollView></SafeAreaView>
}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},scroll:{flex:1},scrollContent:{flexGrow:1,alignItems:'center',paddingBottom:36},page:{width:'100%',maxWidth:560,alignSelf:'center',paddingHorizontal:22,paddingTop:20,paddingBottom:36},back:{width:40,height:40,borderRadius:12,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center',marginBottom:22},title:{fontSize:30,fontWeight:'900',letterSpacing:-1,color:colors.text,marginTop:34},sub:{fontSize:12.5,lineHeight:19,color:colors.textSecondary,marginTop:6},form:{gap:13,marginTop:24},or:{flexDirection:'row',alignItems:'center',gap:10,marginVertical:20},line:{height:1,backgroundColor:colors.border,flex:1},orText:{fontSize:10,color:colors.textMuted,textTransform:'uppercase'},social:{gap:9},guest:{fontSize:12.5,fontWeight:'800',color:colors.primary,textAlign:'center',marginTop:20},link:{fontSize:12,color:colors.textSecondary,textAlign:'center',marginTop:16}}
);
