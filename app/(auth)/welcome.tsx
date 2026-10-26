import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HustLogo } from '@/components/HustLogo';
import { colors } from '@/theme/colors';

export default function Welcome(){
 return <SafeAreaView style={styles.safe}>
   <View style={styles.page}>
     <HustLogo size={48}/>
     <View style={styles.hero}>
       <Text style={styles.kicker}>ENGLISH FOR HUST STUDENTS</Text>
       <Text style={styles.title}>Học tiếng Anh{`\n`}theo cách gọn hơn.</Text>
       <Text style={styles.sub}>Từ vựng, ngữ pháp, nghe, nói, đọc, viết và luyện thi. Không game hóa, không làm bạn mất tập trung.</Text>
     </View>
     <View style={styles.points}>{[['book-outline','Lộ trình CEFR rõ ràng'],['headset-outline','Luyện 4 kỹ năng'],['analytics-outline','Theo dõi tiến độ thật']].map(([icon,label])=><View key={label} style={styles.point}><View style={styles.pointIcon}><Ionicons name={icon as any} size={19} color={colors.primary}/></View><Text style={styles.pointText}>{label}</Text></View>)}</View>
     <View style={{flex:1}}/>
     <Pressable onPress={()=>router.replace('/(tabs)/home')} style={styles.primary}><Text style={styles.primaryText}>Vào học ngay</Text><Ionicons name="arrow-forward" size={17} color={colors.white}/></Pressable>
     <Pressable onPress={()=>router.push('/(auth)/signin')} style={styles.secondary}><Text style={styles.secondaryText}>Đăng nhập để đồng bộ</Text></Pressable>
   </View>
 </SafeAreaView>
}
const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:colors.background},page:{flex:1,width:'100%',maxWidth:560,alignSelf:'center',paddingHorizontal:22,paddingTop:22,paddingBottom:20},hero:{marginTop:64},kicker:{fontSize:10,fontWeight:'900',letterSpacing:1.25,color:colors.primary},title:{fontSize:40,lineHeight:46,fontWeight:'900',letterSpacing:-1.6,color:colors.text,marginTop:10},sub:{fontSize:14,lineHeight:22,color:colors.textSecondary,marginTop:13,maxWidth:500},points:{gap:10,marginTop:32},point:{flexDirection:'row',alignItems:'center',gap:11},pointIcon:{width:38,height:38,borderRadius:11,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},pointText:{fontSize:13,fontWeight:'700',color:colors.text},primary:{height:52,borderRadius:12,backgroundColor:colors.primary,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},primaryText:{fontSize:14,fontWeight:'900',color:colors.white},secondary:{height:50,alignItems:'center',justifyContent:'center'},secondaryText:{fontSize:12.5,fontWeight:'800',color:colors.primary}
});
