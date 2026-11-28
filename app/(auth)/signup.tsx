import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HustLogo } from '@/components/HustLogo';
import { AuthField } from '@/components/AuthField';
import { AppButton } from '@/components/Buttons';
import { useAuth } from '@/contexts/AuthContext';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { authMessage } from '@/services/authMessages';
import { colors } from '@/theme/colors';
import { gameButton, glassCard } from '@/theme/cosmic';

export default function SignUp(){
 const {signUp}=useAuth(); const social=useSocialAuth(); const[name,setName]=useState(''); const[email,setEmail]=useState(''); const[password,setPassword]=useState(''); const[confirm,setConfirm]=useState(''); const[loading,setLoading]=useState(false); const[socialLoading,setSocialLoading]=useState(false); const[socialError,setSocialError]=useState<string|null>(null);
 const [formError, setFormError] = useState('');
 const [pendingEmail, setPendingEmail] = useState('');

 async function submit() {
   if (loading || socialLoading) return;
   const address = email.trim();
   if (!name.trim() || !address || !password || !confirm) {
     setFormError('Hãy điền đầy đủ thông tin.');
     return;
   }
   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
     setFormError('Hãy kiểm tra lại địa chỉ email.');
     return;
   }
   if (password !== confirm) {
     setFormError('Mật khẩu xác nhận chưa khớp.');
     return;
   }

   setFormError('');
   setLoading(true);
   try {
     const result = await signUp(name.trim(), address, password);
     if (result.requiresEmailVerification) {
       setPassword('');
       setConfirm('');
       setPendingEmail(address);
     } else {
       router.replace('/(tabs)/home');
     }
   } catch (error) {
     setFormError(authMessage(error, 'Chưa thể đăng ký. Vui lòng thử lại.'));
   } finally {
     setLoading(false);
   }
 }
 async function signUpWithGoogle(){setSocialError(null);try{setSocialLoading(true);const completed=await social.signInWithGoogle();if(completed)router.replace('/(tabs)/home')}catch(e:any){setSocialError(e?.message||'Vui lòng thử lại.')}finally{setSocialLoading(false)}}
 return <SafeAreaView nativeID="cosmic-screen-signup" style={styles.safe} edges={['top','bottom']}><ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"><View style={styles.page}>
   <Pressable onPress={()=>router.back()} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.text}/></Pressable>
   <HustLogo size={44}/>
   {pendingEmail ? <>
     <Text style={styles.title} accessibilityRole="header">Xác nhận email</Text>
     <View style={styles.form}>
       <Text style={styles.sub} accessibilityLiveRegion="polite" aria-live="polite">Mở hộp thư {pendingEmail} và bấm liên kết xác nhận. Kiểm tra cả thư rác nếu chưa thấy email.</Text>
       <AppButton title="Về trang đăng nhập" onPress={() => router.replace('/(auth)/signin')} />
       <AppButton title="Dùng email khác" variant="secondary" onPress={() => setPendingEmail('')} />
     </View>
   </> : <>
   <Text style={styles.title}>Tạo tài khoản</Text><Text style={styles.sub}>Tài khoản giúp đồng bộ tiến độ học. Bạn cũng có thể trải nghiệm app ở chế độ khách.</Text>
   <View style={styles.form}><AuthField label="Họ và tên" value={name} onChangeText={setName}/><AuthField label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail}/><AuthField label="Mật khẩu" secureTextEntry value={password} onChangeText={setPassword}/><AuthField label="Xác nhận mật khẩu" secureTextEntry value={confirm} onChangeText={setConfirm}/>{formError ? <Text accessibilityRole="alert" style={styles.socialError}>{formError}</Text> : null}<AppButton title="Tạo tài khoản" loading={loading} disabled={socialLoading} onPress={submit}/></View>
   <View style={styles.or}><View style={styles.line}/><Text style={styles.orText}>hoặc</Text><View style={styles.line}/></View>
   <View style={styles.social}><AppButton title="Đăng ký bằng Google" variant="secondary" loading={socialLoading} disabled={loading} onPress={()=>signUpWithGoogle()}/></View>
   {socialError?<Text accessibilityRole="alert" style={styles.socialError}>{socialError}</Text>:null}
   <Pressable onPress={()=>router.replace('/(tabs)/home')}><Text style={styles.guest}>Bỏ qua, vào học ngay</Text></Pressable>
   </>}
 </View></ScrollView></SafeAreaView>
}
const styles=StyleSheet.create({safe:{flex:1},scroll:{flex:1},scrollContent:{flexGrow:1,alignItems:'center',paddingBottom:36},page:{width:'100%',maxWidth:560,alignSelf:'center',paddingHorizontal:22,paddingTop:20,paddingBottom:36},back:{...gameButton,width:44,height:44,borderColor:colors.borderStrong,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center',marginBottom:18},title:{fontSize:30,fontWeight:'900',letterSpacing:-1,color:colors.text,marginTop:23},sub:{fontSize:14,lineHeight:21,color:colors.textSecondary,marginTop:6},form:{...glassCard,gap:14,padding:18,marginTop:20},or:{flexDirection:'row',alignItems:'center',gap:10,marginVertical:20},line:{height:1,backgroundColor:colors.border,flex:1},orText:{fontSize:13,color:colors.textMuted},social:{gap:9},socialError:{fontSize:12,lineHeight:18,color:colors.error,marginTop:12},guest:{fontSize:12.5,fontWeight:'800',color:colors.primary,textAlign:'center',marginTop:20}}
);
