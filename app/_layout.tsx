import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';

import { AlertProvider } from '@/contexts/AlertContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserService } from '@/lib/userService';
import { useSupabaseAuth } from '@/lib/useSupabaseAuth';

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const hasCheckedOnboarding = useRef(false);
  const currentUserId = useRef<string | null>(null);

  // Sincronizar tokens de Clerk con Supabase
  useSupabaseAuth();

  // Protección de rutas y verificación de onboarding
  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === undefined || segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'forgot-password' || segments[0] === 'reset-password';

    // Si cambió el usuario, resetear la verificación
    if (user?.id !== currentUserId.current) {
      hasCheckedOnboarding.current = false;
      currentUserId.current = user?.id || null;
    }

    // Usuario NO autenticado
    if (!isSignedIn) {
      hasCheckedOnboarding.current = false;
      currentUserId.current = null;

      if (!inAuthGroup) {
        router.replace('/');
      }
      return;
    }

    // Usuario autenticado - verificar onboarding solo UNA VEZ
    if (isSignedIn && user?.id && !hasCheckedOnboarding.current) {
      hasCheckedOnboarding.current = true;

      const checkOnboarding = async () => {
        // Sincronizar usuario con Supabase
        const email = user.primaryEmailAddress?.emailAddress;
        if (email) {
          await UserService.syncClerkUser(user.id, email, user.fullName || undefined);
        }

        // Verificar estado de onboarding
        const { hasCompletedOnboarding } = await UserService.getUserWithOnboardingStatus(user.id);

        if (!hasCompletedOnboarding) {
          // No completó onboarding -> enviar a cuestionario
          if (segments[0] !== 'cuestionario') {
            router.replace('/cuestionario');
          }
        } else {
          // Completó onboarding -> enviar a la app si está en pantallas de auth
          if (inAuthGroup) {
            router.replace('/(tabs)');
          }
        }
      };

      checkOnboarding();
    }
  }, [isSignedIn, isLoaded, segments, user?.id]);

  return (
    <AlertProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="reset-password" options={{ headerShown: false }} />
          <Stack.Screen name="cuestionario" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="trip-detail" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="personal-info" options={{ headerShown: false }} />
          <Stack.Screen name="help-center" options={{ headerShown: false }} />
          <Stack.Screen name="terms" options={{ headerShown: false }} />
          <Stack.Screen name="privacy" options={{ headerShown: false }} />
          <Stack.Screen name="astral-profile" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AlertProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootLayoutNav />
    </ClerkProvider>
  );
}
