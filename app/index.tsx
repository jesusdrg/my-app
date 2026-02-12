import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function OnboardingScreen() {
  const { isSignedIn, isLoaded } = useAuth();

  // Mostrar loading mientras carga Clerk
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // Si está autenticado, mostrar loading y dejar que _layout maneje la redirección
  if (isSignedIn) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  const handleComenzar = () => {
    router.push('/cuestionario');
  };

  return (
    <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.textContainer}>
              <Text style={styles.appTitle}>Mundial 2026</Text>
              <Text style={styles.appSubtitle}>Tu experiencia futbolística comienza aquí</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.startButton} onPress={() => router.push('/login')}>
                <Text style={styles.startButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/signup')}>
                <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '80%',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingBottom: 60,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: -5,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,

    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});