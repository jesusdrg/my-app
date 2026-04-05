import { IconSymbol } from '@/components/ui/IconSymbol';
import { PlacesService } from '@/lib/placesService';
import { LegacyTrip, SafetyInfo } from '@/lib/supabase';
import { TripsService } from '@/lib/tripsService';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function getSafetyColor(score: number): string {
  if (score >= 8.0) return '#10B981';
  if (score >= 6.5) return '#F59E0B';
  return '#EF4444';
}

function getSafetyLabel(score: number): string {
  if (score >= 8.5) return 'Muy seguro';
  if (score >= 7.0) return 'Seguro';
  if (score >= 5.5) return 'Precaucion moderada';
  return 'Precaucion alta';
}

export default function TripDetailScreen() {
  const params = useLocalSearchParams();
  const [trip, setTrip] = useState<LegacyTrip | null>(null);
  const [loading, setLoading] = useState(true);

  const tripId = params.tripId ? parseInt(params.tripId as string) : null;

  useEffect(() => {
    loadTrip();
  }, []);

  const loadTrip = async () => {
    setLoading(true);
    try {
      // Try to parse trip data from params first
      const tripDataParam = params.tripData as string;
      if (tripDataParam) {
        const parsed = JSON.parse(tripDataParam);
        setTrip(parsed);
      } else if (tripId) {
        // Fallback: load from DB
        const allTrips = await TripsService.getAllTrips();
        const found = allTrips.find(t => t.id === tripId);
        if (found) setTrip(found);
      }
    } catch (e) {
      console.error('Error loading trip:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => router.back();

  const handleShowMap = () => {
    if (!trip) return;
    router.push({
      pathname: '/map',
      params: {
        title: trip.title,
        locations: JSON.stringify(
          (trip.destinations || []).map(dest => ({
            name: dest,
            latitude: getCityCenter(dest).latitude,
            longitude: getCityCenter(dest).longitude,
          }))
        ),
      },
    });
  };

  const handleViewItinerary = () => {
    // Navigate to itinerary creation/view
    router.push({
      pathname: '/itinerary',
      params: { tripId: trip?.id },
    });
  };

  if (loading || !trip) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loaderText}>Cargando...</Text>
      </View>
    );
  }

  const displayPrice = `$${trip.price_from.toLocaleString()} ${trip.currency}`;

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: trip.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80' }}
          style={styles.heroImage}
          contentFit="cover"
        />
        <View style={styles.headerOverlay}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <IconSymbol name="share" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>Desde {displayPrice}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{trip.title}</Text>

        <View style={styles.infoRow}>
          <IconSymbol name="location.fill" size={14} color="#6B7280" />
          <Text style={styles.infoText}>
            {trip.destinations?.join(', ') || 'Mexico'}
          </Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          <View style={styles.durationTag}>
            <IconSymbol name="calendar" size={12} color="#374151" />
            <Text style={styles.tagText}>{trip.duration_days} dias</Text>
          </View>
          {trip.category && (
            <View style={styles.categoryTag}>
              <Text style={styles.tagText}>{trip.category}</Text>
            </View>
          )}
          {trip.difficulty_level && (
            <View style={styles.difficultyTag}>
              <Text style={styles.tagText}>{trip.difficulty_level}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>{trip.description}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShowMap}>
            <IconSymbol name="location.fill" size={16} color="#000" />
            <Text style={styles.actionButtonText}>Mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleViewItinerary}>
            <IconSymbol name="calendar" size={16} color="#FFF" />
            <Text style={styles.primaryButtonText}>Ver Itinerario</Text>
          </TouchableOpacity>
        </View>

        {/* Trip Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Detalles del Paquete</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duracion</Text>
              <Text style={styles.detailValue}>{trip.duration_days} dias</Text>
            </View>
            {trip.meals_included > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Comidas incluidas</Text>
                <Text style={styles.detailValue}>{trip.meals_included}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Destinos</Text>
              <Text style={styles.detailValue}>{trip.destinations?.join(', ') || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Precio desde</Text>
              <Text style={styles.detailValue}>{displayPrice}</Text>
            </View>
          </View>
        </View>

        {/* Tags */}
        {trip.tags && trip.tags.length > 0 && (
          <View style={styles.tripTagsSection}>
            <Text style={styles.sectionTitle}>Etiquetas</Text>
            <View style={styles.tripTagsRow}>
              {trip.tags.map((tag, idx) => (
                <View key={idx} style={styles.tripTag}>
                  <Text style={styles.tripTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Reserve button */}
        <TouchableOpacity style={styles.reserveButton}>
          <Text style={styles.reserveButtonText}>Reservar Experiencia</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

function getCityCenter(cityName: string): { latitude: number; longitude: number } {
  const name = cityName.toLowerCase();
  if (name.includes('cdmx') || name.includes('ciudad de mexico') || name.includes('mexico city')) {
    return { latitude: 19.4326, longitude: -99.1332 };
  }
  if (name.includes('guadalajara') || name.includes('gdl')) {
    return { latitude: 20.6597, longitude: -103.3496 };
  }
  if (name.includes('monterrey') || name.includes('mty')) {
    return { latitude: 25.6866, longitude: -100.3161 };
  }
  return { latitude: 19.4326, longitude: -99.1332 };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', gap: 16 },
  loaderText: { fontSize: 16, color: '#6B7280' },
  imageContainer: { position: 'relative', height: 350 },
  heroImage: { width: '100%', height: '100%' },
  headerOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: 20,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  shareButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  priceBadge: {
    position: 'absolute', bottom: 16, left: 16,
    backgroundColor: '#000000', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
  },
  priceBadgeText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  infoText: { fontSize: 15, color: '#6B7280' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  durationTag: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 4,
  },
  categoryTag: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  difficultyTag: { backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  descriptionSection: { marginBottom: 20 },
  description: { fontSize: 16, color: '#374151', lineHeight: 24 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 12, backgroundColor: '#F3F4F6', paddingVertical: 14, gap: 8,
  },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: '#000000' },
  primaryButton: { backgroundColor: '#000000' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  detailsSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  detailsCard: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', gap: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 14, color: '#6B7280' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  tripTagsSection: { marginBottom: 24 },
  tripTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tripTag: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tripTagText: { fontSize: 13, color: '#374151' },
  reserveButton: { backgroundColor: '#000000', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  reserveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});
