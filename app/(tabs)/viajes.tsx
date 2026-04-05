import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ItineraryService } from '@/lib/itineraryService';
import { TripsService } from '@/lib/tripsService';
import { UserService } from '@/lib/userService';
import { Itinerary, LegacyTrip } from '@/lib/supabase';

export default function ViajesScreen() {
  const { user } = useUser();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [trips, setTrips] = useState<LegacyTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load user itineraries
      if (user) {
        const supabaseUser = await UserService.getUserByClerkId(user.id);
        if (supabaseUser) {
          const userItineraries = await ItineraryService.getUserItineraries(supabaseUser.id);
          setItineraries(userItineraries);
        }
      }

      // Load curated trip packages
      const allTrips = await TripsService.getAllTrips();
      setTrips(allTrips);
    } catch (error) {
      console.error('Error loading viajes data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewItinerary = () => {
    router.push('/(tabs)/recommendations');
  };

  const handleItineraryPress = (itinerary: Itinerary) => {
    router.push({
      pathname: '/itinerary',
      params: { id: itinerary.id },
    });
  };

  const handleTripPress = (trip: LegacyTrip) => {
    router.push({
      pathname: '/trip-detail',
      params: { tripId: trip.id, tripData: JSON.stringify(trip) },
    });
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'completed': return 'Completado';
      default: return 'Borrador';
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'completed': return '#6B7280';
      default: return '#F59E0B';
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loaderText}>Cargando tus viajes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Text style={styles.title}>Mis Viajes</Text>
        <Text style={styles.subtitle}>Planifica tu experiencia Mundial 2026</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Itineraries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis Itinerarios</Text>

          {itineraries.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="calendar" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Aun no tienes itinerarios</Text>
              <Text style={styles.emptyDescription}>
                Crea tu primer itinerario personalizado para el Mundial 2026
              </Text>
              <TouchableOpacity style={styles.createButton} onPress={handleNewItinerary}>
                <IconSymbol name="plus" size={20} color="#FFFFFF" />
                <Text style={styles.createButtonText}>Crear Itinerario</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.itinerariesContainer}>
              {itineraries.map(itinerary => (
                <TouchableOpacity
                  key={itinerary.id}
                  style={styles.itineraryCard}
                  onPress={() => handleItineraryPress(itinerary)}
                >
                  <View style={styles.itineraryHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor(itinerary.status) }]}>
                      <Text style={styles.statusText}>{statusLabel(itinerary.status)}</Text>
                    </View>
                    <Text style={styles.itineraryCity}>{itinerary.city}</Text>
                  </View>
                  <Text style={styles.itineraryTitle}>{itinerary.title}</Text>
                  <View style={styles.itineraryInfo}>
                    <View style={styles.itineraryInfoItem}>
                      <IconSymbol name="calendar" size={14} color="#6B7280" />
                      <Text style={styles.itineraryInfoText}>{itinerary.duration_days} dias</Text>
                    </View>
                    {itinerary.total_estimated_cost > 0 && (
                      <View style={styles.itineraryInfoItem}>
                        <IconSymbol name="dollarsign" size={14} color="#6B7280" />
                        <Text style={styles.itineraryInfoText}>
                          ${itinerary.total_estimated_cost.toLocaleString()} {itinerary.currency}
                        </Text>
                      </View>
                    )}
                  </View>
                  <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.addButton} onPress={handleNewItinerary}>
                <IconSymbol name="plus" size={20} color="#000000" />
                <Text style={styles.addButtonText}>Nuevo Itinerario</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Curated Trip Packages */}
        {trips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Paquetes Disponibles</Text>
            <Text style={styles.sectionSubtitle}>Experiencias curadas para el Mundial</Text>

            <View style={styles.tripsContainer}>
              {trips.map(trip => (
                <TouchableOpacity
                  key={trip.id}
                  style={styles.tripCard}
                  onPress={() => handleTripPress(trip)}
                >
                  <ImageBackground
                    source={{ uri: trip.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80' }}
                    style={styles.tripCardBackground}
                    imageStyle={styles.tripCardImage}
                  >
                    <View style={styles.tripCardOverlay}>
                      <View style={styles.tripCardTop}>
                        <View style={styles.tripDurationBadge}>
                          <Text style={styles.tripDurationText}>{trip.duration_days} dias</Text>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
                      </View>
                      <View>
                        <Text style={styles.tripTitle}>{trip.title}</Text>
                        <View style={styles.tripPriceRow}>
                          <Text style={styles.tripPrice}>
                            Desde ${trip.price_from.toLocaleString()} {trip.currency}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', gap: 16 },
  loaderText: { fontSize: 16, color: '#6B7280' },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  content: { flex: 1, paddingHorizontal: 24 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  emptyState: {
    alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20,
    backgroundColor: '#F9FAFB', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', marginTop: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginTop: 16, marginBottom: 8 },
  emptyDescription: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  createButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#000000',
    paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, gap: 8,
  },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  itinerariesContainer: { gap: 12, marginTop: 12 },
  itineraryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  itineraryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  itineraryCity: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  itineraryTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  itineraryInfo: { flexDirection: 'row', gap: 16, marginBottom: 4 },
  itineraryInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  itineraryInfoText: { fontSize: 13, color: '#6B7280' },
  addButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed',
    paddingVertical: 14, borderRadius: 12, gap: 8,
  },
  addButtonText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  tripsContainer: { gap: 16, marginTop: 4 },
  tripCard: { borderRadius: 12, overflow: 'hidden' },
  tripCardBackground: { width: '100%', minHeight: 180 },
  tripCardImage: { borderRadius: 12 },
  tripCardOverlay: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20, justifyContent: 'space-between',
  },
  tripCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tripDurationBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tripDurationText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  tripTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  tripPriceRow: { flexDirection: 'row', alignItems: 'center' },
  tripPrice: { fontSize: 15, color: '#E5E7EB', fontWeight: '500' },
});
