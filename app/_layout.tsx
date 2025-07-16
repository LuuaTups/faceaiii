debugger;
console.log("Loaded up to the very top of app/_layout.tsx");

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';

export default function RootLayout() {
  useFrameworkReady();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Only redirect after auth state is determined (not loading)
    if (!loading) {
      const currentPath = window?.location?.pathname || '/';
      
      // If user is not logged in and not on auth page, redirect to auth
      if (!user && currentPath !== '/auth') {
        router.replace('/auth');
      }
      // If user is logged in and on auth page, redirect to home
      else if (user && currentPath === '/auth') {
        router.replace('/(tabs)');
      }
    }
  }, [user, loading]);

  // Show loading screen while determining auth state
  if (loading) {
    return null; // or a loading component
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
