import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { supabase, supabaseConfigured } from '@/services/supabase';
import { colors } from '@/theme/colors';

WebBrowser.maybeCompleteAuthSession();

export default function OAuthComplete() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    if (Platform.OS !== 'web') {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted && session) router.replace('/(tabs)/home');
      });
      unsubscribe = () => data.subscription.unsubscribe();
    }

    const finish = async () => {
      if (!supabaseConfigured) {
        throw new Error('Supabase chưa được cấu hình trong ứng dụng.');
      }

      if (Platform.OS === 'web') {
        if (typeof window === 'undefined') return;

        const callbackUrl = new URL(window.location.href);
        const hashParams = new URLSearchParams(callbackUrl.hash.replace(/^#/, ''));
        const providerError =
          callbackUrl.searchParams.get('error_description') ||
          callbackUrl.searchParams.get('error') ||
          hashParams.get('error_description') ||
          hashParams.get('error_code') ||
          hashParams.get('error');
        if (providerError) throw new Error(providerError);

        const code = callbackUrl.searchParams.get('code');
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          if (!data.session) throw new Error('Không tạo được phiên đăng nhập.');
          if (mounted) router.replace('/(tabs)/home');
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data.session) {
          if (mounted) router.replace('/(tabs)/home');
          return;
        }

        throw new Error('Không tìm thấy mã xác thực Google trong đường dẫn trả về.');
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (data.session && mounted) router.replace('/(tabs)/home');
    };

    void finish().catch((error: unknown) => {
      if (mounted) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Không thể hoàn tất đăng nhập Google.'
        );
      }
    });

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  return (
    <View style={styles.page}>
      {!errorMessage ? <ActivityIndicator size="large" color={colors.primary} /> : null}
      <Text style={styles.title}>
        {errorMessage ? 'Đăng nhập chưa hoàn tất' : 'Đang hoàn tất đăng nhập…'}
      </Text>
      <Text style={styles.sub}>
        {errorMessage || 'Bạn sẽ được chuyển về HustLingo sau khi xác thực xong.'}
      </Text>
      {errorMessage ? (
        <Pressable onPress={() => router.replace('/(auth)/signin')}>
          <Text style={styles.link}>Quay lại đăng nhập</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 24 },
  title: { marginTop: 16, fontSize: 18, fontWeight: '900', color: colors.text },
  sub: { marginTop: 7, fontSize: 12.5, lineHeight: 19, textAlign: 'center', color: colors.textSecondary },
  link: { marginTop: 18, color: colors.primary, fontSize: 13, fontWeight: '800' },
});
