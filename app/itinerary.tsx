import { ItineraryDay } from '@/components/ItineraryDay';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ItineraryService } from '@/lib/itineraryService';
import { ItineraryWithItems, ItineraryItem } from '@/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DayData {
  day: number;
  activities: {
    id?: number;
    hora: string;
    actividad: string;
    zona?: string;
    detalles?: string;
    placeId?: number;
  }[];
}

export default function ItineraryScreen() {
  const params = useLocalSearchParams();
  const [itinerary, setItinerary] = useState<ItineraryWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);

  const itineraryId = params.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    loadItinerary();
  }, []);

  const loadItinerary = async () => {
    setLoading(true);
    try {
      if (itineraryId) {
        const data = await ItineraryService.getItinerary(itineraryId);
        if (data) {
          setItinerary(data);
        }
      }
    } catch (error) {
      console.error('Error loading itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDays = (): DayData[] => {
    if (!itinerary || !itinerary.items || itinerary.items.length === 0) {
      return [];
    }

    const dayMap = new Map<number, ItineraryItem[]>();
    for (const item of itinerary.items) {
      const dayItems = dayMap.get(item.day_number) || [];
      dayItems.push(item);
      dayMap.set(item.day_number, dayItems);
    }

    const days: DayData[] = [];
    const sortedDayNumbers = Array.from(dayMap.keys()).sort((a, b) => a - b);

    for (const dayNumber of sortedDayNumbers) {
      const items = dayMap.get(dayNumber) || [];
      days.push({
        day: dayNumber,
        activities: items
          .sort((a, b) => a.order_index - b.order_index)
          .map(item => ({
            id: item.id,
            hora: item.time_slot || '--:--',
            actividad: item.activity_name,
            zona: item.neighborhood || item.place?.neighborhood || undefined,
            detalles: item.activity_description || item.place?.short_description || undefined,
            placeId: item.place_id || undefined,
          })),
      });
    }

    return days;
  };

  const handleActivityPress = (activity: { placeId?: number }) => {
    if (activity.placeId) {
      router.push({
        pathname: '/place-detail',
        params: { placeId: activity.placeId },
      });
    }
  };

  const handleShowMap = () => {
    if (!itinerary || !itinerary.items) return;

    const dayItems = itinerary.items.filter(item => item.day_number === selectedDay);
    const locations = dayItems
      .filter(item => item.place?.latitude && item.place?.longitude)
      .map(item => ({
        name: item.activity_name,
        latitude: item.place!.latitude!,
        longitude: item.place!.longitude!,
      }));

    if (locations.length === 0) return;

    router.push({
      pathname: '/map',
      params: {
        title: `${itinerary.title} - Dia ${selectedDay}`,
        locations: JSON.stringify(locations),
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loaderText}>Cargando itinerario...</Text>
      </SafeAreaView>
    );
  }

  const days = getDays();

  if (!itinerary || days.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Itinerario</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <IconSymbol name="calendar" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Sin actividades</Text>
          <Text style={styles.emptyDescription}>
            Este itinerario aun no tiene actividades programadas.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentDayData = days.find(d => d.day === selectedDay);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{itinerary.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Itinerary info bar */}
      <View style={styles.infoBar}>
        <View style={styles.infoItem}>
          <IconSymbol name="location.fill" size={14} color="#6B7280" />
          <Text style={styles.infoText}>{itinerary.city}</Text>
        </View>
        <View style={styles.infoItem}>
          <IconSymbol name="calendar" size={14} color="#6B7280" />
          <Text style={styles.infoText}>{itinerary.duration_days} dias</Text>
        </View>
        {itinerary.total_estimated_cost > 0 && (
          <View style={styles.infoItem}>
            <IconSymbol name="dollarsign" size={14} color="#6B7280" />
            <Text style={styles.infoText}>
              ${itinerary.total_estimated_cost.toLocaleString()} {itinerary.currency}
            </Text>
          </View>
        )}
      </View>

      {/* Day Selector */}
      <View style={styles.daySelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelector}>
          {days.map((d) => (
            <TouchableOpacity
              key={d.day}
              onPress={() => setSelectedDay(d.day)}
              style={[styles.dayTab, selectedDay === d.day && styles.dayTabActive]}
            >
              <Text style={[styles.dayTabText, selectedDay === d.day && styles.dayTabTextActive]}>
                Dia {d.day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dayTitleRow}>
          <IconSymbol name="calendar" size={20} color="#666" />
          <Text style={styles.dayTitle}>Cronograma del Dia {selectedDay}</Text>
        </View>

        {currentDayData ? (
          <ItineraryDay
            day={currentDayData.day}
            activities={currentDayData.activities}
            onActivityPress={(activity) => {
              const matched = currentDayData.activities.find(a => a.hora === activity.hora && a.actividad === activity.actividad);
              if (matched?.placeId) {
                handleActivityPress({ placeId: matched.placeId });
              }
            }}
          />
        ) : (
          <Text style={styles.emptyText}>No hay actividades programadas para este dia.</Text>
        )}
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.mapButton} onPress={handleShowMap}>
          <IconSymbol name="location.fill" size={18} color="#FFF" />
          <Text style={styles.mapButtonText}>Ver en Mapa</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    gap: 16,
  },
  loaderText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  infoBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
  },
  daySelectorContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
  },
  daySelector: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dayTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  dayTabActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  dayTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  dayTabTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 14,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  mapButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  mapButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
