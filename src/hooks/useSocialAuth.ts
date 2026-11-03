import { useMemo } from 'react';
import { Platform } from 'react-native';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import { requireSupabaseConfig, supabase, supabaseConfigured } from '@/services/supabase';

WebBrowser.maybeCompleteAuthSession();

type Provider = 'google';

export function useSocialAuth() {
  const redirectTo = useMemo(
    () =>
      Platform.OS === 'web' && typeof window !== 'undefined'
        ? `${window.location.origin}/oauth`
        : makeRedirectUri({ scheme: 'hustlingo', path: 'oauth' }),
    []
  );

  async function createSessionFromUrl(url: string) {
    const { params, errorCode } = QueryParams.getQueryParams(url);
    if (errorCode) throw new Error(String(errorCode));

    const accessToken = typeof params.access_token === 'string' ? params.access_token : null;
    const refreshToken = typeof params.refresh_token === 'string' ? params.refresh_token : null;
    const errorDescription = typeof params.error_description === 'string' ? params.error_description : null;

    if (errorDescription) throw new Error(errorDescription);
    if (!accessToken || !refreshToken) {
      throw new Error('Supabase không trả về phiên đăng nhập. Hãy kiểm tra Redirect URLs trong Supabase Auth.');
    }

    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;
  }

  async function signIn(provider: Provider) {
    requireSupabaseConfig();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        // Supabase redirects the current web page. Native opens the OAuth
        // URL in an auth session and receives the custom-scheme callback.
        ...(Platform.OS === 'web' ? {} : { skipBrowserRedirect: true }),
        ...(provider === 'google'
          ? { queryParams: { access_type: 'offline', prompt: 'select_account' } }
          : {}),
      },
    });
    if (error) throw error;
    if (!data.url) throw new Error('Không tạo được URL đăng nhập OAuth.');

    if (Platform.OS === 'web') {
      // The callback route exchanges the PKCE code and navigates to the app.
      return false;
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success' || !result.url) return false;
    await createSessionFromUrl(result.url);
    return true;
  }

  return {
    signInWithGoogle: () => signIn('google'),
    redirectTo,
    googleReady: supabaseConfigured,
  };
}
