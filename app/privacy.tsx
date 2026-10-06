import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { colors } from '@/theme/colors';
export default function Privacy(){return <Screen contentStyle={styles.page}><PageHeader title="Chính sách riêng tư"/><Text style={styles.h}>Dữ liệu tài khoản</Text><Text style={styles.p}>Supabase Auth quản lý tài khoản đăng nhập; Supabase Database lưu hồ sơ và tiến độ học theo Row Level Security (RLS). Ứng dụng không lưu mật khẩu thô.</Text><Text style={styles.h}>Đăng nhập Google/Facebook</Text><Text style={styles.p}>Google/Facebook OAuth được cấu hình trong Supabase Auth. Client secret nằm trong cấu hình provider phía Supabase và không được nhúng trong ứng dụng Expo. Không có Apple Login trong bản này.</Text><Text style={styles.h}>Gia sư AI</Text><Text style={styles.p}>Màn Gia sư AI chỉ là giao diện demo và không gửi nội dung đến nhà cung cấp AI.</Text></Screen>}
const styles=StyleSheet.create({page:{maxWidth:760,alignSelf:'center'},h:{fontSize:17,fontWeight:'900',color:colors.text,marginTop:15},p:{fontSize:13,lineHeight:21,color:colors.textSecondary,marginTop:6}});
