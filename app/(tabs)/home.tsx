import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { HustLogo } from '@/components/HustLogo';
import { AppCard } from '@/components/AppCard';
import { SectionTitle } from '@/components/SectionTitle';
import { FadeIn, ScaleIn } from '@/components/Motion';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import { PricingTeaser } from '@/components/PricingTeaser';
import { useAuth } from '@/contexts/AuthContext';
import { useLearning } from '@/contexts/LearningContext';
import { learningTopics } from '@/data/content';
import { colors } from '@/theme/colors';

const quick = [
  ['Từ vựng', 'text-outline', '/vocabulary', colors.primarySoft, colors.primary],
  ['Nghe', 'headset-outline', '/listening', colors.cyanSoft, colors.cyan],
  ['Đọc', 'reader-outline', '/reading', colors.blueSoft, colors.blue],
  ['Ngữ pháp', 'library-outline', '/grammar', colors.violetSoft, colors.violet],
] as const;

export default function Home() {
  const { user } = useAuth();
  const { state, accuracy } = useLearning();
  const goal = user?.dailyMinutes || 15;
  const firstName = (user?.displayName || 'Hải').trim().split(/\s+/).slice(-1)[0];

  return <Screen>
    <FadeIn><View style={styles.topbar}><HustLogo size={40}/><View style={styles.topActions}><Pressable onPress={()=>router.push('/pricing')} style={styles.premiumMini}><Ionicons name="diamond-outline" size={15} color={colors.primary}/><Text style={styles.premiumMiniText}>PLUS</Text></Pressable><Pressable onPress={()=>router.push('/settings')} style={styles.iconBtn}><Ionicons name="notifications-outline" size={20} color={colors.text}/></Pressable></View></View></FadeIn>

    <FadeIn delay={70}><View style={styles.heading}><Text style={styles.kicker}>HÔM NAY · GIỮ NHỊP HỌC</Text><Text style={styles.title}>Chào {firstName},{`\n`}bắt đầu nhé.</Text><Text style={styles.date}>Mỗi ngày tiến một chút, tiếng Anh sẽ thành phản xạ.</Text></View></FadeIn>

    <FadeIn delay={110}><HeroSlideshow goal={goal} minutesToday={state.minutesToday}/></FadeIn>

    <View style={styles.stats}>
      {[
        ['Từ đã học', state.studiedWordIds.length, 'book-outline', colors.orangeSoft, colors.orange],
        ['Chính xác', `${accuracy}%`, 'checkmark-circle-outline', colors.mintSoft, colors.mint],
        ['Cần ôn', state.reviewWordIds.length, 'refresh-outline', colors.violetSoft, colors.violet],
      ].map(([label,value,icon,bg,fg],i)=><ScaleIn key={String(label)} delay={160+i*55} style={{flex:1}}><AppCard style={[styles.statCard,{backgroundColor:String(bg)}]}><View style={[styles.statIcon,{backgroundColor:colors.white}]}><Ionicons name={icon as any} size={16} color={String(fg)}/></View><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></AppCard></ScaleIn>)}
    </View>

    <FadeIn delay={250}><SectionTitle title="Học nhanh" subtitle="Vào học ngay, không vòng vo"/></FadeIn>
    <View style={styles.quickRow}>{quick.map(([label,icon,path,bg,fg],i)=><FadeIn key={label} delay={280+i*55} style={{flex:1}}><Pressable onPress={()=>router.push(path as any)} style={({pressed})=>[styles.quickItem,{backgroundColor:bg},pressed&&styles.quickPressed]}><View style={[styles.quickIcon,{backgroundColor:colors.white}]}><Ionicons name={icon} size={20} color={fg}/></View><Text style={styles.quickText}>{label}</Text><Ionicons name="arrow-forward" size={13} color={fg}/></Pressable></FadeIn>)}</View>

    <View style={{height:24}}/>
    <FadeIn delay={410}><SectionTitle title="Bài đang học" subtitle="Tiếp tục đúng chỗ bạn dừng lại"/><AppCard onPress={()=>router.push({pathname:'/vocabulary',params:{topic:'University'}})} style={styles.currentCard}><View style={styles.currentGlow}/><View style={styles.currentRow}><View style={styles.topicMark}><Text style={styles.topicMarkText}>UL</Text></View><View style={{flex:1}}><Text style={styles.currentKicker}>ENGLISH FOUNDATION · A1</Text><Text style={styles.currentTitle}>University Life</Text><Text style={styles.currentSub}>12/20 từ đã học · tiếp tục khoảng 4 phút</Text></View><View style={styles.arrow}><Ionicons name="arrow-forward" size={17} color={colors.white}/></View></View><View style={styles.track}><View style={[styles.fill,{width:'58%'}]}/></View></AppCard></FadeIn>

    <View style={{height:24}}/>
    <PricingTeaser />

    <View style={{height:26}}/>
    <SectionTitle title="Chủ đề đề xuất" subtitle="Học theo ngữ cảnh thực tế" action={<Pressable onPress={()=>router.push('/(tabs)/lessons')}><Text style={styles.more}>Xem tất cả</Text></Pressable>}/>
    <View style={{gap:9}}>{learningTopics.slice(0,3).map((t,i)=>{
      const palette=[
        [colors.coralSoft,colors.coral],
        [colors.blueSoft,colors.blue],
        [colors.orangeSoft,colors.orange],
      ][i%3];
      return <FadeIn key={t.id} delay={520+i*60}><AppCard onPress={()=>router.push({pathname:'/vocabulary',params:{topic:t.title}})} style={styles.topicCard}><View style={styles.topicRow}><View style={[styles.topicIcon,{backgroundColor:palette[0]}]}><Ionicons name={t.icon} size={20} color={palette[1]}/></View><View style={{flex:1}}><Text style={styles.topicTitle}>{t.title}</Text><Text style={styles.topicSub}>{t.subtitle}</Text></View><Text style={[styles.level,{backgroundColor:palette[0],color:palette[1]}]}>{t.level}</Text><Ionicons name="chevron-forward" size={15} color={colors.textMuted}/></View></AppCard></FadeIn>})}</View>
  </Screen>;
}

const styles=StyleSheet.create({
  topbar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:22},topActions:{flexDirection:'row',alignItems:'center',gap:8},iconBtn:{width:40,height:40,borderRadius:12,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,alignItems:'center',justifyContent:'center'},premiumMini:{height:40,paddingHorizontal:11,borderRadius:12,backgroundColor:colors.primarySoft,borderWidth:1,borderColor:'#FFD0D8',flexDirection:'row',alignItems:'center',gap:5},premiumMiniText:{fontSize:8.5,fontWeight:'900',color:colors.primary,letterSpacing:.7},
  heading:{marginBottom:16},kicker:{fontSize:9,fontWeight:'900',letterSpacing:1.1,color:colors.primary},title:{fontSize:31,lineHeight:34,fontWeight:'900',color:colors.text,letterSpacing:-1.2,marginTop:5},date:{fontSize:12.5,color:colors.textSecondary,marginTop:7},
  stats:{flexDirection:'row',gap:9,marginBottom:26},statCard:{padding:12,borderColor:'rgba(130,90,80,.08)'},statIcon:{width:30,height:30,borderRadius:10,alignItems:'center',justifyContent:'center',marginBottom:9},statValue:{fontSize:20,fontWeight:'900',color:colors.text},statLabel:{fontSize:9.5,color:colors.textSecondary,marginTop:2},
  quickRow:{flexDirection:'row',gap:8},quickItem:{borderWidth:1,borderColor:'rgba(130,90,80,.08)',borderRadius:16,paddingVertical:12,alignItems:'center',gap:7,shadowColor:'#7B3B32',shadowOpacity:.04,shadowRadius:12,shadowOffset:{width:0,height:6}},quickPressed:{transform:[{translateY:1},{scale:.985}],opacity:.92},quickIcon:{width:39,height:39,borderRadius:12,alignItems:'center',justifyContent:'center'},quickText:{fontSize:10.5,fontWeight:'800',color:colors.text,textAlign:'center'},
  currentCard:{padding:15,backgroundColor:colors.charcoal,borderColor:'#24242A',overflow:'hidden'},currentGlow:{position:'absolute',width:160,height:160,borderRadius:80,backgroundColor:'rgba(209,10,52,.22)',right:-55,top:-75},currentRow:{flexDirection:'row',alignItems:'center',gap:12,zIndex:2},topicMark:{width:46,height:46,borderRadius:13,backgroundColor:'#FFE7A7',alignItems:'center',justifyContent:'center'},topicMarkText:{fontSize:11,fontWeight:'900',color:'#93691A'},currentKicker:{fontSize:7.5,fontWeight:'900',letterSpacing:.9,color:'#C9C3BC'},currentTitle:{fontSize:15,fontWeight:'900',color:colors.white,marginTop:2},currentSub:{fontSize:10,color:'#BCB7AF',marginTop:3},arrow:{width:36,height:36,borderRadius:11,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center'},track:{height:5,borderRadius:99,backgroundColor:'#3D3E41',overflow:'hidden',marginTop:13},fill:{height:'100%',backgroundColor:colors.coral,borderRadius:99},
  more:{fontSize:11.5,fontWeight:'800',color:colors.primary},topicCard:{padding:13},topicRow:{flexDirection:'row',alignItems:'center',gap:11},topicIcon:{width:43,height:43,borderRadius:13,alignItems:'center',justifyContent:'center'},topicTitle:{fontSize:14,fontWeight:'800',color:colors.text},topicSub:{fontSize:11,color:colors.textSecondary,marginTop:3},level:{fontSize:9.5,fontWeight:'900',paddingHorizontal:7,paddingVertical:5,borderRadius:99},
});
