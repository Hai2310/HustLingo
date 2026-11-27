import { getLevelLabel } from '@/utils/levelLabels';
import React,{useState} from 'react';
import {Alert,Pressable,StyleSheet,Text,View} from 'react-native';
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Screen} from '@/components/Screen';
import {AppCard} from '@/components/AppCard';
import {AppButton} from '@/components/Buttons';
import { RankBadge, RankedName, RankProgress } from '@/components/common/LearnerRank';
import {FadeIn,ScaleIn} from '@/components/Motion';
import {useAuth} from '@/contexts/AuthContext';
import {useLearning} from '@/contexts/LearningContext';
import {colors} from '@/theme/colors';
import { hum, paperCard } from '@/theme/hum';
import { getLearnerRank } from '@/utils/learnerRank';

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
  const {state,accuracy,syncNow,ready}=useLearning();
  const lessons = state.completedLessonIds.length;
  const practice = state.completedPracticeIds.length;
  const { rank } = getLearnerRank(lessons, practice);
  const displayName = isGuest ? 'Học viên HustLingo' : user.displayName;
  const [syncing,setSyncing]=useState(false);
  async function sync(){try{setSyncing(true);await syncNow();Alert.alert('Đã đồng bộ','Tiến độ đã được lưu lên Supabase.')}catch(e:any){Alert.alert('Chưa đồng bộ được',e?.message||'Kiểm tra kết nối Supabase.')}finally{setSyncing(false)}}
  async function logout(){await signOut();router.replace('/(tabs)/home')}
  return <Screen>
    <FadeIn><Text style={styles.title}>Hồ sơ</Text><Text style={styles.sub}>Tiến độ, gói học và cài đặt của bạn.</Text></FadeIn>

    <FadeIn delay={70}>
      <View style={styles.identity}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{(displayName || 'H').slice(0, 1).toUpperCase()}</Text></View>
        <View style={styles.identityCopy}>
          {ready ? <RankedName key={rank.id} rank={rank} name={displayName} placement="profile" style={styles.name} />
            : <Text style={styles.name}>{displayName}</Text>}
          {ready && (
            <View style={styles.rankLine}>
              <RankBadge key={rank.id} rank={rank} placement="profile" decorative />
              <Text style={styles.rankTitle}>{rank.title}</Text>
            </View>
          )}
          <Text style={styles.email}>{isGuest ? 'Chế độ khách • dữ liệu lưu trên thiết bị' : user.email || 'Tài khoản mạng xã hội'}</Text>
          <View style={styles.meta}>
            <Text style={styles.tagOn}>{getLevelLabel(user.englishLevel || 'A1')}</Text>
            <Text style={styles.tag}>{user.learningGoal || 'Giao tiếp'}</Text>
            <Pressable onPress={() => router.push('/pricing')}><Text style={styles.premiumTag}>FREE · NÂNG CẤP</Text></Pressable>
          </View>
        </View>
      </View>
    </FadeIn>

    {ready && <RankProgress lessons={lessons} practice={practice} />}

    <View style={styles.stats}>{[[state.studiedWordIds.length,'Từ đã học',colors.orangeSoft],[`${accuracy}%`,'Chính xác',colors.mintSoft],[state.reviewWordIds.length,'Cần ôn',colors.violetSoft]].map(([n,l,bg],i)=><ScaleIn key={String(l)} delay={120+i*55} style={{flex:1}}><AppCard style={[styles.stat,{backgroundColor:String(bg)}]}><Text style={styles.num}>{n}</Text><Text style={styles.label}>{l}</Text></AppCard></ScaleIn>)}</View>

    <FadeIn delay={235}><Pressable onPress={()=>router.push('/pricing')} style={styles.upgrade}><View style={styles.upgradeIcon}><Ionicons name="diamond" size={20} color={colors.primary}/></View><View style={{flex:1}}><Text style={styles.upgradeKicker}>PLUS · PRO</Text><Text style={styles.upgradeTitle}>Mở rộng lộ trình học của bạn</Text><Text style={styles.upgradeSub}>Từ 49.000đ/tháng · xem chi tiết gói</Text></View><Ionicons name="arrow-forward" size={18} color={colors.primary}/></Pressable></FadeIn>

    {isGuest?<FadeIn delay={270}><View style={styles.guestBox}><View style={{flex:1}}><Text style={styles.guestKicker}>ĐỒNG BỘ TIẾN ĐỘ</Text><Text style={styles.guestTitle}>Đăng nhập khi bạn sẵn sàng</Text><Text style={styles.guestSub}>Google • hoàn toàn không bắt buộc.</Text></View><Pressable onPress={()=>router.push('/(auth)/signin')} style={styles.guestArrow}><Ionicons name="arrow-forward" size={17} color={colors.text}/></Pressable></View></FadeIn>:<AppButton title="Đồng bộ tiến độ" variant="secondary" icon="cloud-upload-outline" loading={syncing} onPress={sync}/>}

    <FadeIn delay={310}><View style={styles.menu}>{items.map(([title,path,icon],i)=><Pressable key={title} style={[styles.item,i>0&&styles.itemBorder]} onPress={()=>router.push(`/${path}` as any)}><View style={[styles.itemIcon,title==='Gói Plus & Pro'&&styles.itemIconPremium]}><Ionicons name={icon} size={20} color={title==='Gói Plus & Pro'?colors.orange:colors.primary}/></View><Text style={styles.itemText}>{title}</Text>{title==='Gói Plus & Pro'&&<Text style={styles.newBadge}>MỚI</Text>}<Ionicons name="arrow-forward" size={17} color={colors.textMuted}/></Pressable>)}</View></FadeIn>

    {!isGuest&&<AppButton title="Đăng xuất" variant="ghost" icon="log-out-outline" onPress={logout}/>}<Text style={styles.version}>HustLingo • English only • Motion UI v1.4</Text>
  </Screen>
}

const styles=StyleSheet.create({
  title:{fontSize:32,fontWeight:'700',color:colors.text,letterSpacing:-1.1,marginTop:5},sub:{fontSize:14,lineHeight:21,color:colors.textSecondary,marginTop:5,marginBottom:16},
  identity:{...paperCard,backgroundColor:hum.sky,borderColor:hum.skyEdge,borderRadius:22,padding:18,flexDirection:'row',alignItems:'center',gap:14,marginBottom:12},avatar:{width:64,height:64,borderRadius:20,backgroundColor:hum.card,borderWidth:1,borderColor:hum.skyEdge,alignItems:'center',justifyContent:'center',zIndex:2},avatarText:{fontSize:24,fontWeight:'700',color:hum.blue},name:{fontSize:21,fontWeight:'700',color:hum.ink,marginTop:3},email:{fontSize:13,lineHeight:18,color:hum.muted,marginTop:3},meta:{flexDirection:'row',gap:6,marginTop:8,flexWrap:'wrap'},tag:{fontSize:12,fontWeight:'700',color:hum.ink,backgroundColor:hum.card,paddingHorizontal:8,paddingVertical:5,borderRadius:99},tagOn:{fontSize:12,fontWeight:'700',color:hum.blue,backgroundColor:hum.card,paddingHorizontal:8,paddingVertical:5,borderRadius:99},premiumTag:{fontSize:12,fontWeight:'700',color:hum.ink,backgroundColor:hum.pear,paddingHorizontal:8,paddingVertical:5,borderRadius:99},
  identityCopy:{flex:1,minWidth:0,zIndex:2},rankLine:{flexDirection:'row',alignItems:'center',gap:8,marginVertical:4},rankTitle:{color:hum.ink,fontSize:14,fontWeight:'700',flexShrink:1},
  stats:{flexDirection:'row',gap:8,marginBottom:14},stat:{padding:11,borderColor:hum.rule},num:{fontSize:18,fontWeight:'900',color:colors.text},label:{fontSize:12,color:colors.textSecondary,marginTop:3},
  upgrade:{...paperCard,backgroundColor:hum.pearSoft,borderColor:hum.pearEdge,padding:14,marginBottom:15,flexDirection:'row',alignItems:'center',gap:11},upgradeIcon:{width:42,height:42,borderRadius:13,backgroundColor:hum.pear,alignItems:'center',justifyContent:'center'},upgradeKicker:{fontSize:7.5,fontWeight:'900',letterSpacing:1,color:colors.primary},upgradeTitle:{fontSize:15,fontWeight:'700',color:colors.text,marginTop:2},upgradeSub:{fontSize:13,color:colors.textSecondary,marginTop:3},
  guestBox:{backgroundColor:colors.blueSoft,borderRadius:16,padding:14,marginBottom:18,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:hum.skyEdge},guestKicker:{fontSize:7.5,fontWeight:'900',letterSpacing:1.1,color:colors.blue},guestTitle:{fontSize:15,fontWeight:'700',color:colors.text,marginTop:3},guestSub:{fontSize:13,color:colors.textSecondary,marginTop:3},guestArrow:{width:44,height:44,borderRadius:11,backgroundColor:hum.card,alignItems:'center',justifyContent:'center'},
  menu:{...paperCard,overflow:'hidden',marginBottom:16},item:{minHeight:58,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:13},itemBorder:{borderTopWidth:1,borderTopColor:colors.border},itemIcon:{width:36,height:36,borderRadius:11,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},itemIconPremium:{backgroundColor:colors.orangeSoft},itemText:{fontSize:15,fontWeight:'700',color:colors.text,flex:1},newBadge:{fontSize:7.5,fontWeight:'900',color:colors.orange,backgroundColor:colors.orangeSoft,paddingHorizontal:6,paddingVertical:4,borderRadius:99},version:{fontSize:9.5,color:colors.textMuted,textAlign:'center',marginTop:14},
})
