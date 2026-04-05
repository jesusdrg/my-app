import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  category?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  estadio: '#EF4444',
  restaurante: '#F59E0B',
  bar: '#8B5CF6',
  hotel: '#3B82F6',
  cultural: '#10B981',
  fan_zone: '#EC4899',
  compras: '#F97316',
  transporte: '#6B7280',
  naturaleza: '#22C55E',
};

const DEFAULT_REGION = {
  latitude: 19.4326,
  longitude: -99.1332,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function MapScreen() {
  const params = useLocalSearchParams();
  const title = (params.title as string) || 'Mapa del Viaje';

  const locations: LocationData[] = useMemo(() => {
    try {
      if (params.locations) {
        return JSON.parse(params.locations as string);
      }
    } catch (e) {
      console.error('Error parsing locations:', e);
    }
    return [];
  }, [params.locations]);

  const markers = useMemo(() => {
    return locations
      .filter(loc => loc.latitude && loc.longitude)
      .map((loc, idx) => ({
        id: idx,
        title: loc.name,
        coordinate: {
          latitude: loc.latitude,
          longitude: loc.longitude,
        },
        color: CATEGORY_COLORS[loc.category || ''] || '#000000',
      }));
  }, [locations]);

  const initialRegion = useMemo(() => {
    if (markers.length === 0) return DEFAULT_REGION;

    if (markers.length === 1) {
      return {
        latitude: markers[0].coordinate.latitude,
        longitude: markers[0].coordinate.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }

    const lats = markers.map(m => m.coordinate.latitude);
    const lngs = markers.map(m => m.coordinate.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latDelta = Math.max((maxLat - minLat) * 1.5, 0.02);
    const lngDelta = Math.max((maxLng - minLng) * 1.5, 0.02);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  }, [markers]);

  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            pinColor={marker.color}
          />
        ))}
        {markers.length > 1 && (
          <Polyline
            coordinates={markers.map(m => m.coordinate)}
            strokeColor="#000"
            strokeWidth={3}
          />
        )}
      </MapView>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {markers.length > 0 && (
            <Text style={styles.subtitle}>{markers.length} ubicaciones</Text>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2.84,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
