import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/PageHeader';
import { AppCard } from '@/components/AppCard';
import { colors } from '@/theme/colors';
export default function Terms() {
  return (
    <Screen contentStyle={styles.page}>
      <PageHeader title="Điều khoản sử dụng" />
      <AppCard style={styles.copy}>
        <Text style={styles.p}>HustLingo là ứng dụng học tập. Nội dung luyện tập chỉ mang tính hỗ trợ học tiếng Anh và không thay thế chứng chỉ hoặc đánh giá chuyên môn. Người dùng có trách nhiệm bảo vệ tài khoản và tuân thủ quy định của các nhà cung cấp đăng nhập xã hội.</Text>
        <Text style={styles.p}>Logo và nhận diện HUST cần được sử dụng phù hợp quy định thương hiệu của Đại học Bách khoa Hà Nội khi phát hành công khai.</Text>
      </AppCard>
    </Screen>
  );
}
const styles = StyleSheet.create({
  page: { maxWidth: 760, alignSelf: 'center' },
  copy: { gap: 12, padding: 20 },
  p: { fontSize: 15, lineHeight: 23, color: colors.textSecondary },
});
