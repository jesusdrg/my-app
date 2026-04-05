import { IconSymbol } from '@/components/ui/IconSymbol';
import { PlacesService } from '@/lib/placesService';
import { PlaceWithSafety, SafetyInfo } from '@/lib/supabase';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PRICE_LABELS: Record<number, string> = { 1: '$', 2: '$$', 3: '$$$', 4: '$$$$' };
const PRICE_DESCRIPTIONS: Record<number, string> = {
  1: 'Economico',
  2: 'Moderado',
  3: 'Premium',
  4: 'Lujo',
};

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

export default function PlaceDetailScreen() {
  const params = useLocalSearchParams();
  const [place, setPlace] = useState<PlaceWithSafety | null>(null);
  const [safetyInfo, setSafetyInfo] = useState<SafetyInfo | null>(null);

  useEffect(() => {
    const placeDataParam = params.placeData as string;
    if (placeDataParam) {
      try {
        const parsed = JSON.parse(placeDataParam);
        setPlace(parsed);
      } catch (e) {
        console.error('Error parsing place data:', e);
      }
    }

    const placeId = params.placeId ? parseInt(params.placeId as string) : null;
    if (placeId) {
      loadSafetyInfo(placeId);
      if (!placeDataParam) {
        loadPlace(placeId);
      }
    }
  }, []);

  const loadPlace = async (id: number) => {
    const data = await PlacesService.getPlaceById(id);
    if (data) {
      setPlace(data as PlaceWithSafety);
    }
  };

  const loadSafetyInfo = async (id: number) => {
    const data = await PlacesService.getSafetyScore(id);
    if (data) {
      setSafetyInfo(data);
    }
  };

  const handleNavigate = () => {
    if (place?.latitude && place?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
      Linking.openURL(url);
    }
  };

  const handleShowMap = () => {
    if (place?.latitude && place?.longitude) {
      router.push({
        pathname: '/map',
        params: {
          title: place.name,
          locations: JSON.stringify([{
            name: place.name,
            latitude: place.latitude,
            longitude: place.longitude,
          }]),
        },
      });
    }
  };

  if (!place) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loaderText}>Cargando...</Text>
      </View>
    );
  }

  const safetyScore = safetyInfo?.overall_score || place.safety_score || 0;
  const safetyColor = getSafetyColor(safetyScore);

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: place.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80' }}
          style={styles.heroImage}
          contentFit="cover"
        />
        <View style={styles.headerOverlay}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <IconSymbol name="share" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {place.mundial_relevant && (
          <View style={styles.mundialBadge}>
            <Text style={styles.mundialBadgeText}>Mundial 2026</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Title and basic info */}
        <Text style={styles.title}>{place.name}</Text>

        <View style={styles.infoRow}>
          <IconSymbol name="location.fill" size={14} color="#6B7280" />
          <Text style={styles.infoText}>
            {place.neighborhood ? `${place.neighborhood}, ${place.city}` : place.city}
          </Text>
        </View>

        {/* Tags row */}
        <View style={styles.tagsRow}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{place.category}</Text>
          </View>
          {place.price_level && (
            <View style={styles.priceTag}>
              <Text style={styles.priceTagText}>
                {PRICE_LABELS[place.price_level]} {PRICE_DESCRIPTIONS[place.price_level]}
              </Text>
            </View>
          )}
          <View style={styles.ratingTag}>
            <IconSymbol name="star.fill" size={12} color="#F59E0B" />
            <Text style={styles.ratingTagText}>{place.rating?.toFixed(1)}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>{place.description}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShowMap}>
            <IconSymbol name="location.fill" size={16} color="#000" />
            <Text style={styles.actionButtonText}>Mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.navigateButton]} onPress={handleNavigate}>
            <IconSymbol name="location.fill" size={16} color="#FFF" />
            <Text style={styles.navigateButtonText}>Navegar</Text>
          </TouchableOpacity>
        </View>

        {/* Safety Section */}
        <View style={styles.safetySection}>
          <Text style={styles.sectionTitle}>Seguridad</Text>
          <View style={[styles.safetyCard, { borderColor: safetyColor + '40' }]}>
            <View style={styles.safetyHeader}>
              <IconSymbol name="shield.fill" size={20} color={safetyColor} />
              <Text style={[styles.safetyScore, { color: safetyColor }]}>
                {safetyScore.toFixed(1)}/10 - {getSafetyLabel(safetyScore)}
              </Text>
            </View>

            {safetyInfo && (
              <View style={styles.safetyDetails}>
                <View style={styles.safetyDetailRow}>
                  <Text style={styles.safetyDetailLabel}>De dia</Text>
                  <Text style={styles.safetyDetailValue}>{safetyInfo.day_score.toFixed(1)}</Text>
                </View>
                <View style={styles.safetyDetailRow}>
                  <Text style={styles.safetyDetailLabel}>De noche</Text>
                  <Text style={styles.safetyDetailValue}>{safetyInfo.night_score.toFixed(1)}</Text>
                </View>
                <View style={styles.safetyDetailRow}>
                  <Text style={styles.safetyDetailLabel}>Para turistas</Text>
                  <Text style={styles.safetyDetailValue}>{safetyInfo.tourist_score.toFixed(1)}</Text>
                </View>
              </View>
            )}

            {safetyInfo?.tips && safetyInfo.tips.length > 0 && (
              <View style={styles.tipsContainer}>
                {safetyInfo.tips.map((tip, idx) => (
                  <View key={idx} style={styles.tipRow}>
                    <Text style={styles.tipBullet}>-</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Mundial Info */}
        {place.mundial_relevant && place.mundial_info && Object.keys(place.mundial_info).length > 0 && (
          <View style={styles.mundialSection}>
            <Text style={styles.sectionTitle}>Info Mundial 2026</Text>
            <View style={styles.mundialCard}>
              {(() => {
                const info = place.mundial_info as Record<string, string | number>;
                return (
                  <>
                    {info.capacity && (
                      <View style={styles.mundialRow}>
                        <Text style={styles.mundialLabel}>Capacidad</Text>
                        <Text style={styles.mundialValue}>
                          {Number(info.capacity).toLocaleString()} personas
                        </Text>
                      </View>
                    )}
                    {info.matches && (
                      <View style={styles.mundialRow}>
                        <Text style={styles.mundialLabel}>Partidos</Text>
                        <Text style={styles.mundialValue}>{String(info.matches)}</Text>
                      </View>
                    )}
                    {info.transport && (
                      <View style={styles.mundialRow}>
                        <Text style={styles.mundialLabel}>Transporte</Text>
                        <Text style={styles.mundialValue}>{String(info.transport)}</Text>
                      </View>
                    )}
                    {info.tips && (
                      <View style={styles.mundialRow}>
                        <Text style={styles.mundialLabel}>Tips</Text>
                        <Text style={styles.mundialValue}>{String(info.tips)}</Text>
                      </View>
                    )}
                  </>
                );
              })()}
            </View>
          </View>
        )}

        {/* Address */}
        {place.address && (
          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>Direccion</Text>
            <Text style={styles.addressText}>{place.address}</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  mundialBadge: {
    position: 'absolute', bottom: 16, left: 16,
    backgroundColor: '#D4AF37', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
  },
  mundialBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  infoText: { fontSize: 15, color: '#6B7280' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  categoryTag: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  categoryTagText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  priceTag: { backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  priceTagText: { fontSize: 13, fontWeight: '600', color: '#059669' },
  ratingTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, gap: 4 },
  ratingTagText: { fontSize: 13, fontWeight: '600', color: '#92400E' },
  descriptionSection: { marginBottom: 20 },
  description: { fontSize: 16, color: '#374151', lineHeight: 24 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 12, backgroundColor: '#F3F4F6', paddingVertical: 14, gap: 8,
  },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: '#000000' },
  navigateButton: { backgroundColor: '#000000' },
  navigateButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  safetySection: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  safetyCard: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, borderWidth: 1 },
  safetyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  safetyScore: { fontSize: 18, fontWeight: 'bold' },
  safetyDetails: { gap: 8, marginBottom: 12 },
  safetyDetailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  safetyDetailLabel: { fontSize: 14, color: '#6B7280' },
  safetyDetailValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  tipsContainer: { gap: 6, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12 },
  tipRow: { flexDirection: 'row', gap: 8 },
  tipBullet: { fontSize: 14, color: '#6B7280' },
  tipText: { fontSize: 14, color: '#374151', flex: 1, lineHeight: 20 },
  mundialSection: { marginBottom: 24 },
  mundialCard: { backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FDE68A', gap: 12 },
  mundialRow: { gap: 4 },
  mundialLabel: { fontSize: 13, fontWeight: '600', color: '#92400E' },
  mundialValue: { fontSize: 14, color: '#78350F', lineHeight: 20 },
  addressSection: { marginBottom: 24 },
  addressText: { fontSize: 15, color: '#374151', lineHeight: 22 },
});
