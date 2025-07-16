import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      
      if (!user && currentPath !== '/auth') {
        router.replace('/auth');
      } else if (user && currentPath === '/auth') {
        router.replace('/(tabs)');
      }
    }
  }, [user, loading]);

  if (loading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="results" options={{ headerShown: false }} />
        <Stack.Screen name="detailed-analysis" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}