import { useMemo } from 'react';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import { requireSupabaseConfig, supabase, supabaseConfigured } from '@/services/supabase';

WebBrowser.maybeCompleteAuthSession();

type Provider = 'google' | 'facebook';

export function useSocialAuth() {
  const redirectTo = useMemo(
    () => makeRedirectUri({ scheme: 'hustlingo', path: 'oauth' }),
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
        skipBrowserRedirect: true,
        ...(provider === 'google'
          ? { queryParams: { access_type: 'offline', prompt: 'select_account' } }
          : {}),
      },
    });
    if (error) throw error;
    if (!data.url) throw new Error('Không tạo được URL đăng nhập OAuth.');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success' || !result.url) return false;
    await createSessionFromUrl(result.url);
    return true;
  }

  return {
    signInWithGoogle: () => signIn('google'),
    signInWithFacebook: () => signIn('facebook'),
    redirectTo,
    googleReady: supabaseConfigured,
    facebookReady: supabaseConfigured,
  };
}
