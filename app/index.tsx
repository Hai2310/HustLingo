import React from 'react';
import { Redirect } from 'expo-router';

/**
 * Demo-first entry point.
 *
 * HustLingo opens the learning interface immediately, without requiring
 * Supabase/authentication. Login/register routes are still kept in the app
 * and can be enabled again later without changing the tab navigation.
 */
export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
