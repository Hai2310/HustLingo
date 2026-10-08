import React from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { AnimatedTabIcon } from '@/components/AnimatedTabIcon';

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: 'home-outline', lessons: 'book-outline', practice: 'radio-button-on-outline', tutor: 'chatbubble-ellipses-outline', profile: 'person-outline',
};
export default function TabsLayout(){return <Tabs screenOptions={({route})=>({headerShown:false,tabBarActiveTintColor:colors.primary,tabBarInactiveTintColor:colors.textMuted,tabBarStyle:styles.tab,tabBarItemStyle:styles.item,tabBarLabelStyle:styles.label,tabBarIcon:({color,size,focused})=><AnimatedTabIcon name={focused?(iconMap[route.name]?.replace('-outline','') as any):iconMap[route.name]||'ellipse-outline'} focused={focused} color={color} size={size}/>})}>
<Tabs.Screen name="home" options={{title:'Trang chủ'}}/><Tabs.Screen name="lessons" options={{title:'Bài học'}}/><Tabs.Screen name="practice" options={{title:'Luyện tập'}}/><Tabs.Screen name="tutor" options={{title:'Gia sư'}}/><Tabs.Screen name="profile" options={{title:'Hồ sơ'}}/></Tabs>}
const styles=StyleSheet.create({tab:{height:78,paddingTop:7,paddingBottom:10,borderTopWidth:1,borderTopColor:'#F1DBD3',backgroundColor:'rgba(255,255,255,.98)',shadowColor:'#8B3543',shadowOpacity:.09,shadowRadius:22,shadowOffset:{width:0,height:-8},elevation:9},item:{paddingTop:2},label:{fontSize:9.5,fontWeight:'800'}})
