import RecommendationsQuestionnaire from '@/components/RecommendationsQuestionnaire';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PlacesService } from '@/lib/placesService';
import { RecommendationEngine, ScoredPlace } from '@/lib/recommendationEngine';
import { PlaceWithSafety, supabase } from '@/lib/supabase';
import { UserService } from '@/lib/userService';
import { useUser } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItemInfo, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CITY_OPTIONS = ['Todas', 'CDMX', 'GDL', 'MTY'] as const;

const CATEGORY_FILTERS = [
  { id: 'all', label: 'Todos', icon: 'location.fill' as const },
  { id: 'estadio', label: 'Estadios', icon: 'location.fill' as const },
  { id: 'restaurante', label: 'Restaurantes', icon: 'fork.knife' as const },
  { id: 'bar', label: 'Bares', icon: 'moon.stars.fill' as const },
  { id: 'hotel', label: 'Hoteles', icon: 'house.fill' as const },
  { id: 'cultural', label: 'Cultura', icon: 'building.columns' as const },
  { id: 'fan_zone', label: 'Fan Zones', icon: 'sparkles' as const },
  { id: 'compras', label: 'Compras', icon: 'bag.fill' as const },
];

const PRICE_LABELS: Record<number, string> = { 1: '$', 2: '$$', 3: '$$$', 4: '$$$$' };

function getSafetyColor(score: number): string {
  if (score >= 8.0) return '#10B981';
  if (score >= 6.5) return '#F59E0B';
  return '#EF4444';
}

// PlaceCard component
const PlaceCard = React.memo(({
  place,
  onPress,
  onSave,
  isSaved,
}: {
  place: PlaceWithSafety & { score?: number };
  onPress: () => void;
  onSave: () => void;
  isSaved: boolean;
}) => {
  const safetyScore = place.safety_score || 0;
  const safetyColor = getSafetyColor(safetyScore);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: place.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80' }}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          style={styles.cardImage}
        />
        {place.mundial_relevant && (
          <View style={styles.mundialBadge}>
            <Text style={styles.mundialBadgeText}>Mundial 2026</Text>
          </View>
        )}
        <View style={[styles.safetyBadge, { backgroundColor: safetyColor }]}>
          <IconSymbol name="shield.fill" size={10} color="#FFFFFF" />
          <Text style={styles.safetyBadgeText}>{safetyScore.toFixed(1)}</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={onSave} activeOpacity={0.7}>
          <IconSymbol name="heart" size={22} color={isSaved ? '#EF4444' : '#FFFFFF'} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>{place.name}</Text>
          {place.price_level && (
            <Text style={styles.priceLabel}>{PRICE_LABELS[place.price_level]}</Text>
          )}
        </View>
        <Text style={styles.cardNeighborhood} numberOfLines={1}>
          {place.neighborhood ? `${place.neighborhood}, ${place.city}` : place.city}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{place.short_description || place.description}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>{place.rating?.toFixed(1) || '---'}</Text>
            {place.rating_count > 0 && (
              <Text style={styles.ratingCount}>({place.rating_count > 999 ? `${(place.rating_count / 1000).toFixed(1)}k` : place.rating_count})</Text>
            )}
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{place.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function RecommendationsScreen() {
  const { user } = useUser();
  const [places, setPlaces] = useState<PlaceWithSafety[]>([]);
  const [scoredPlaces, setScoredPlaces] = useState<ScoredPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('Todas');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);

  useEffect(() => {
    loadPlaces();
    loadSavedPlaces();
    checkPreferences();
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [selectedCity]);

  const checkPreferences = async () => {
    if (!user) return;
    try {
      const supabaseUser = await UserService.getUserByClerkId(user.id);
      if (supabaseUser) {
        const prefs = await UserService.getTravelPreferences(supabaseUser.id);
        setHasPreferences(prefs?.completed || false);
      }
    } catch (e) {
      console.error('Error checking preferences:', e);
    }
  };

  const loadPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const city = selectedCity === 'Todas' ? undefined : selectedCity;
      const data = await PlacesService.getPlaces(city, undefined, undefined, false, 100);
      setPlaces(data);
    } catch (err) {
      setError('Error cargando lugares');
      console.error('Error loading places:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedPlaces = async () => {
    if (!user) return;
    try {
      const supabaseUser = await UserService.getUserByClerkId(user.id);
      if (supabaseUser) {
        const saved = await PlacesService.getSavedPlaces(supabaseUser.id);
        setSavedPlaceIds(new Set(saved.map(s => s.place_id)));
      }
    } catch (e) {
      console.error('Error loading saved places:', e);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPlaces();
      return;
    }
    setLoading(true);
    try {
      const city = selectedCity === 'Todas' ? undefined : selectedCity;
      const results = await PlacesService.searchPlaces(searchQuery, city);
      setPlaces(results as PlaceWithSafety[]);
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionnaireComplete = async (answers: {
    cities: string[];
    interests: string[];
    budgetTier: string;
    safetyPriority: string;
    accommodation: string;
    specialWish: string;
  }) => {
    setShowQuestionnaire(false);
    setHasPreferences(true);

    // Score places with the new preferences
    const scored = RecommendationEngine.rankPlaces(places, {
      interests: answers.interests,
      budgetTier: answers.budgetTier,
      safetyPriority: answers.safetyPriority,
    });
    setScoredPlaces(scored);
  };

  const handleSavePlace = useCallback(async (placeId: number) => {
    if (!user) return;
    try {
      const supabaseUser = await UserService.getUserByClerkId(user.id);
      if (!supabaseUser) return;
      const saved = await PlacesService.toggleSavedPlace(supabaseUser.id, placeId);
      setSavedPlaceIds(prev => {
        const next = new Set(prev);
        if (saved) next.add(placeId);
        else next.delete(placeId);
        return next;
      });
    } catch (e) {
      console.error('Error toggling save:', e);
    }
  }, [user]);

  const handlePlacePress = useCallback((place: PlaceWithSafety) => {
    router.push({
      pathname: '/place-detail',
      params: { placeId: place.id, placeData: JSON.stringify(place) },
    });
  }, []);

  // Filter and sort places
  const filteredPlaces = useMemo(() => {
    let result = scoredPlaces.length > 0 ? scoredPlaces : places;

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery && !loading) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.neighborhood || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [places, scoredPlaces, selectedCategory, searchQuery, loading]);

  const renderPlaceCard = useCallback(({ item }: ListRenderItemInfo<PlaceWithSafety>) => (
    <PlaceCard
      place={item}
      onPress={() => handlePlacePress(item)}
      onSave={() => handleSavePlace(item.id)}
      isSaved={savedPlaceIds.has(item.id)}
    />
  ), [savedPlaceIds, handlePlacePress, handleSavePlace]);

  const keyExtractor = useCallback((item: PlaceWithSafety) => item.id.toString(), []);

  if (showQuestionnaire) {
    return <RecommendationsQuestionnaire onComplete={handleQuestionnaireComplete} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Explora</Text>
          <Text style={styles.subtitle}>Descubre Mexico - Mundial 2026</Text>
        </View>
        <TouchableOpacity style={styles.aiIconButton} onPress={() => setShowQuestionnaire(true)}>
          <IconSymbol name="sparkles" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* City Selector */}
      <View style={styles.citySelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.citySelectorContent}>
          {CITY_OPTIONS.map(city => (
            <TouchableOpacity
              key={city}
              style={[styles.cityChip, selectedCity === city && styles.cityChipActive]}
              onPress={() => setSelectedCity(city)}
            >
              <Text style={[styles.cityChipText, selectedCity === city && styles.cityChipTextActive]}>
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Busca restaurantes, bares, estadios..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => { setSearchQuery(''); loadPlaces(); }}>
            <IconSymbol name="xmark.circle.fill" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filters */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer} contentContainerStyle={styles.categoriesContent}>
          {CATEGORY_FILTERS.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat.id && styles.categoryTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Personalization prompt */}
      {!hasPreferences && !loading && (
        <TouchableOpacity style={styles.personalizeBar} onPress={() => setShowQuestionnaire(true)}>
          <IconSymbol name="sparkles" size={16} color="#000" />
          <Text style={styles.personalizeText}>Personaliza tus recomendaciones</Text>
          <IconSymbol name="chevron.right" size={14} color="#6B7280" />
        </TouchableOpacity>
      )}

      {/* Results count */}
      <Text style={styles.resultsText}>
        {filteredPlaces.length} lugares encontrados
      </Text>

      {/* Places list */}
      <FlatList
        data={filteredPlaces}
        renderItem={renderPlaceCard}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={4}
        initialNumToRender={4}
        windowSize={5}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#000000" />
              <Text style={styles.loaderText}>Cargando lugares...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadPlaces}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <IconSymbol name="magnifyingglass" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No se encontraron lugares</Text>
              <TouchableOpacity style={styles.clearButton} onPress={() => { setSearchQuery(''); setSelectedCategory('all'); loadPlaces(); }}>
                <Text style={styles.clearButtonText}>Limpiar filtros</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 12,
  },
  title: { fontSize: 36, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#9CA3AF' },
  aiIconButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#000000',
    justifyContent: 'center', alignItems: 'center',
  },
  citySelectorContainer: { paddingHorizontal: 24, marginBottom: 12 },
  citySelectorContent: { gap: 8 },
  cityChip: {
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB',
  },
  cityChipActive: { backgroundColor: '#000000', borderColor: '#000000' },
  cityChipText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  cityChipTextActive: { color: '#FFFFFF' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
    marginHorizontal: 24, paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 25, gap: 12, marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#111827', paddingVertical: 0 },
  categoriesWrapper: { paddingLeft: 24, paddingRight: 24, marginBottom: 8 },
  categoriesContainer: { maxHeight: 40 },
  categoriesContent: { gap: 8, flexDirection: 'row', alignItems: 'center' },
  categoryChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6',
  },
  categoryChipActive: { backgroundColor: '#000000' },
  categoryText: { fontSize: 13, fontWeight: '500', color: '#374151' },
  categoryTextActive: { color: '#FFFFFF' },
  personalizeBar: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 24,
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12,
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB',
    gap: 8, marginBottom: 12,
  },
  personalizeText: { flex: 1, fontSize: 14, fontWeight: '500', color: '#374151' },
  resultsText: { fontSize: 13, color: '#9CA3AF', paddingHorizontal: 24, marginBottom: 8 },
  flatListContent: { paddingHorizontal: 24, paddingBottom: 100 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 20,
    overflow: 'hidden', borderWidth: 1, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  imageContainer: { position: 'relative' },
  cardImage: { width: '100%', height: 180 },
  mundialBadge: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: '#D4AF37', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  mundialBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  safetyBadge: {
    position: 'absolute', bottom: 12, left: 12,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4,
  },
  safetyBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  saveButton: {
    position: 'absolute', top: 12, right: 12,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'center', alignItems: 'center',
  },
  cardContent: { padding: 16 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', flex: 1 },
  priceLabel: { fontSize: 14, fontWeight: '700', color: '#10B981', marginLeft: 8 },
  cardNeighborhood: { fontSize: 13, color: '#6B7280', marginBottom: 6 },
  cardDescription: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '600', color: '#111827' },
  ratingCount: { fontSize: 12, color: '#9CA3AF' },
  categoryBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  categoryBadgeText: { fontSize: 12, color: '#374151', fontWeight: '500' },
  loaderContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  loaderText: { marginTop: 16, fontSize: 16, color: '#6B7280' },
  emptyContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: 60, gap: 16 },
  emptyText: { fontSize: 16, color: '#6B7280', textAlign: 'center', paddingHorizontal: 40 },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#000000', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  clearButton: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#111827', borderRadius: 12 },
  clearButtonText: { fontSize: 15, color: '#FFFFFF', fontWeight: '600' },
});
