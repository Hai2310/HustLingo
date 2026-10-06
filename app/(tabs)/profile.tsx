import React,{useState} from 'react';
import {Alert,Pressable,StyleSheet,Text,View} from 'react-native';
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {Screen} from '@/components/Screen';
import {AppCard} from '@/components/AppCard';
import {AppButton} from '@/components/Buttons';
import {FadeIn,ScaleIn} from '@/components/Motion';
import {useAuth} from '@/contexts/AuthContext';
import {useLearning} from '@/contexts/LearningContext';
import {colors} from '@/theme/colors';

const items=[
  ['Gói Plus & Pro','pricing','diamond-outline'],
  ['Tiến độ học tập','progress','analytics-outline'],
  ['Từ đã lưu','vocabulary','bookmark-outline'],
  ['Cài đặt','settings','settings-outline'],
  ['Phản hồi','feedback','chatbox-ellipses-outline'],
  ['Giới thiệu HustLingo','about','information-circle-outline'],
] as const;

export default function Profile(){
  const {user,signOut,isGuest}=useAuth();
  const {state,accuracy,syncNow}=useLearning();
  const [syncing,setSyncing]=useState(false);
  async function sync(){try{setSyncing(true);await syncNow();Alert.alert('Đã đồng bộ','Tiến độ đã được lưu lên Supabase.')}catch(e:any){Alert.alert('Chưa đồng bộ được',e?.message||'Kiểm tra kết nối Supabase.')}finally{setSyncing(false)}}
  async function logout(){await signOut();router.replace('/(tabs)/home')}
  return <Screen>
    <FadeIn><Text style={styles.kicker}>YOUR LEARNING SPACE</Text><Text style={styles.title}>Hồ sơ</Text><Text style={styles.sub}>Tiến độ, gói học và cài đặt của bạn.</Text></FadeIn>

    <FadeIn delay={70}><LinearGradient colors={[colors.primary,colors.coral,colors.orange]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.identity}><View style={styles.glow}/><View style={styles.avatar}><Text style={styles.avatarText}>{(isGuest?'H':user.displayName||'H').slice(0,1).toUpperCase()}</Text></View><View style={{flex:1,zIndex:2}}><Text style={styles.identityKicker}>HỌC VIÊN HUSTLINGO</Text><Text style={styles.name}>{isGuest?'Học viên HustLingo':user.displayName}</Text><Text style={styles.email}>{isGuest?'Chế độ khách • dữ liệu lưu trên thiết bị':user.email||'Tài khoản mạng xã hội'}</Text><View style={styles.meta}><Text style={styles.tagOn}>{user.englishLevel||'A1'}</Text><Text style={styles.tag}>{user.learningGoal||'Giao tiếp'}</Text><Pressable onPress={()=>router.push('/pricing')}><Text style={styles.premiumTag}>FREE · NÂNG CẤP</Text></Pressable></View></View></LinearGradient></FadeIn>

    <View style={styles.stats}>{[[state.studiedWordIds.length,'Từ đã học',colors.orangeSoft],[`${accuracy}%`,'Chính xác',colors.mintSoft],[state.reviewWordIds.length,'Cần ôn',colors.violetSoft]].map(([n,l,bg],i)=><ScaleIn key={String(l)} delay={120+i*55} style={{flex:1}}><AppCard style={[styles.stat,{backgroundColor:String(bg)}]}><Text style={styles.num}>{n}</Text><Text style={styles.label}>{l}</Text></AppCard></ScaleIn>)}</View>

    <FadeIn delay={235}><Pressable onPress={()=>router.push('/pricing')} style={styles.upgrade}><View style={styles.upgradeIcon}><Ionicons name="diamond" size={20} color={colors.primary}/></View><View style={{flex:1}}><Text style={styles.upgradeKicker}>PLUS · PRO</Text><Text style={styles.upgradeTitle}>Mở rộng lộ trình học của bạn</Text><Text style={styles.upgradeSub}>Từ 49.000đ/tháng · xem chi tiết gói</Text></View><Ionicons name="arrow-forward" size={18} color={colors.primary}/></Pressable></FadeIn>

    {isGuest?<FadeIn delay={270}><View style={styles.guestBox}><View style={{flex:1}}><Text style={styles.guestKicker}>ĐỒNG BỘ TIẾN ĐỘ</Text><Text style={styles.guestTitle}>Đăng nhập khi bạn sẵn sàng</Text><Text style={styles.guestSub}>Google hoặc Facebook • hoàn toàn không bắt buộc.</Text></View><Pressable onPress={()=>router.push('/(auth)/signin')} style={styles.guestArrow}><Ionicons name="arrow-forward" size={17} color={colors.white}/></Pressable></View></FadeIn>:<AppButton title="Đồng bộ tiến độ" variant="secondary" icon="cloud-upload-outline" loading={syncing} onPress={sync}/>} 

    <FadeIn delay={310}><View style={styles.menu}>{items.map(([title,path,icon],i)=><Pressable key={title} style={[styles.item,i>0&&styles.itemBorder]} onPress={()=>router.push(`/${path}` as any)}><View style={[styles.itemIcon,title==='Gói Plus & Pro'&&styles.itemIconPremium]}><Ionicons name={icon} size={20} color={title==='Gói Plus & Pro'?colors.orange:colors.primary}/></View><Text style={styles.itemText}>{title}</Text>{title==='Gói Plus & Pro'&&<Text style={styles.newBadge}>MỚI</Text>}<Ionicons name="arrow-forward" size={17} color={colors.textMuted}/></Pressable>)}</View></FadeIn>

    {!isGuest&&<AppButton title="Đăng xuất" variant="ghost" icon="log-out-outline" onPress={logout}/>}<Text style={styles.version}>HustLingo • English only • Motion UI v1.4</Text>
  </Screen>
}

const styles=StyleSheet.create({
  kicker:{fontSize:9,fontWeight:'900',letterSpacing:1.2,color:colors.primary,marginTop:4},title:{fontSize:31,fontWeight:'900',color:colors.text,letterSpacing:-1.1,marginTop:5},sub:{fontSize:12.5,lineHeight:19,color:colors.textSecondary,marginTop:5,marginBottom:16},
  identity:{borderRadius:22,padding:16,flexDirection:'row',alignItems:'center',gap:14,marginBottom:10,overflow:'hidden',shadowColor:'#B51B3D',shadowOpacity:.16,shadowRadius:24,shadowOffset:{width:0,height:12},elevation:5},glow:{position:'absolute',width:180,height:180,borderRadius:90,backgroundColor:'rgba(255,255,255,.16)',right:-60,top:-85},avatar:{width:64,height:64,borderRadius:20,backgroundColor:'rgba(255,255,255,.18)',borderWidth:1,borderColor:'rgba(255,255,255,.28)',alignItems:'center',justifyContent:'center',zIndex:2},avatarText:{fontSize:24,fontWeight:'900',color:colors.white},identityKicker:{fontSize:7.5,fontWeight:'900',letterSpacing:1.1,color:'#FFF0E8'},name:{fontSize:17,fontWeight:'900',color:colors.white,marginTop:3},email:{fontSize:9.5,color:'rgba(255,255,255,.82)',marginTop:3},meta:{flexDirection:'row',gap:6,marginTop:8,flexWrap:'wrap'},tag:{fontSize:9,fontWeight:'800',color:colors.white,backgroundColor:'rgba(255,255,255,.16)',paddingHorizontal:8,paddingVertical:5,borderRadius:99},tagOn:{fontSize:9,fontWeight:'900',color:colors.primary,backgroundColor:colors.white,paddingHorizontal:8,paddingVertical:5,borderRadius:99},premiumTag:{fontSize:8.5,fontWeight:'900',color:'#5C240D',backgroundColor:'#FFE1AD',paddingHorizontal:8,paddingVertical:5,borderRadius:99},
  stats:{flexDirection:'row',gap:8,marginBottom:14},stat:{padding:11,borderColor:'rgba(120,80,70,.08)'},num:{fontSize:18,fontWeight:'900',color:colors.text},label:{fontSize:9,color:colors.textSecondary,marginTop:3},
  upgrade:{backgroundColor:colors.surface,borderRadius:17,padding:13,marginBottom:14,flexDirection:'row',alignItems:'center',gap:11,borderWidth:1,borderColor:'#FFD4D9',shadowColor:'#A93247',shadowOpacity:.07,shadowRadius:18,shadowOffset:{width:0,height:8},elevation:2},upgradeIcon:{width:42,height:42,borderRadius:13,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},upgradeKicker:{fontSize:7.5,fontWeight:'900',letterSpacing:1,color:colors.primary},upgradeTitle:{fontSize:12.5,fontWeight:'900',color:colors.text,marginTop:2},upgradeSub:{fontSize:9.5,color:colors.textSecondary,marginTop:3},
  guestBox:{backgroundColor:colors.blueSoft,borderRadius:16,padding:14,marginBottom:18,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:'#D8E7FF'},guestKicker:{fontSize:7.5,fontWeight:'900',letterSpacing:1.1,color:colors.blue},guestTitle:{fontSize:12.5,fontWeight:'900',color:colors.text,marginTop:3},guestSub:{fontSize:9.5,color:colors.textSecondary,marginTop:3},guestArrow:{width:36,height:36,borderRadius:11,backgroundColor:colors.blue,alignItems:'center',justifyContent:'center'},
  menu:{backgroundColor:colors.surface,borderRadius:16,borderWidth:1,borderColor:colors.border,overflow:'hidden',marginBottom:16},item:{minHeight:58,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:13},itemBorder:{borderTopWidth:1,borderTopColor:colors.border},itemIcon:{width:36,height:36,borderRadius:11,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},itemIconPremium:{backgroundColor:colors.orangeSoft},itemText:{fontSize:13,fontWeight:'700',color:colors.text,flex:1},newBadge:{fontSize:7.5,fontWeight:'900',color:colors.orange,backgroundColor:colors.orangeSoft,paddingHorizontal:6,paddingVertical:4,borderRadius:99},version:{fontSize:9.5,color:colors.textMuted,textAlign:'center',marginTop:14},
})
