import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { HustLogo } from '@/components/HustLogo';
import { AppCard } from '@/components/AppCard';
import { colors } from '@/theme/colors';

export default function About(){return <Screen contentStyle={styles.page}><PageHeader title="Giới thiệu HustLingo"/><View style={styles.brand}><HustLogo size={74}/><Text style={styles.tagline}>Learn English. Build Your Future.</Text></View><AppCard><Text style={styles.title}>HustLingo 1.0.0</Text><Text style={styles.text}>Ứng dụng học tiếng Anh đa nền tảng theo phong cách HUST đỏ–trắng. Phiên bản này chỉ có English, không có Game, Reward hay runtime AI.</Text></AppCard><AppCard style={{marginTop:10}}><Text style={styles.title}>Gia sư AI</Text><Text style={styles.text}>Mục Gia sư AI được giữ dưới dạng giao diện mẫu để có thể tích hợp sau. Hiện tại không có model, API AI, API key AI hoặc dịch vụ hội thoại AI.</Text></AppCard><Text style={styles.disclaimer}>HustLingo là dự án học tập độc lập, không mặc nhiên đại diện cho Đại học Bách khoa Hà Nội. Khi sử dụng logo/nhận diện chính thức để phát hành công khai, hãy tuân thủ quy định thương hiệu của trường.</Text></Screen>}
const styles=StyleSheet.create({page:{maxWidth:720,alignSelf:'center'},brand:{alignItems:'center',paddingVertical:25},tagline:{fontSize:14,fontWeight:'800',color:colors.primary,marginTop:13},title:{fontSize:17,fontWeight:'900',color:colors.text},text:{fontSize:13,lineHeight:21,color:colors.textSecondary,marginTop:7},disclaimer:{fontSize:10.5,lineHeight:17,color:colors.textMuted,textAlign:'center',marginTop:18}});
