import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export function AnimatedTabIcon({ name, focused, color, size }: { name:keyof typeof Ionicons.glyphMap; focused:boolean; color:string; size:number }) {
  const v=useRef(new Animated.Value(focused?1:0)).current;
  useEffect(()=>{Animated.spring(v,{toValue:focused?1:0,speed:22,bounciness:4,useNativeDriver:true}).start()},[focused,v]);
  return <Animated.View style={[styles.wrap,{transform:[{translateY:v.interpolate({inputRange:[0,1],outputRange:[0,-3]})},{scale:v.interpolate({inputRange:[0,1],outputRange:[1,1.1]})}]}]}><View style={[styles.bg,focused&&styles.bgOn]}>{focused&&<View style={styles.spark}/>}<Ionicons name={name} color={color} size={focused?size+1:size}/></View></Animated.View>
}
const styles=StyleSheet.create({wrap:{width:38,height:35,alignItems:'center',justifyContent:'center'},bg:{width:34,height:31,borderRadius:11,alignItems:'center',justifyContent:'center'},bgOn:{backgroundColor:colors.primarySoft,borderWidth:1,borderColor:'#FFD5DE'},spark:{position:'absolute',top:4,right:5,width:4,height:4,borderRadius:2,backgroundColor:colors.orange}});
