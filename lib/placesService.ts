import { supabase, Place, PlaceWithSafety, SafetyInfo, UserSavedPlace } from './supabase';

export class PlacesService {
  static async getPlaces(
    city?: string,
    categories?: string[],
    priceMax?: number,
    mundialOnly?: boolean,
    limit: number = 50
  ): Promise<PlaceWithSafety[]> {
    try {
      const { data, error } = await supabase.rpc('get_recommended_places', {
        p_city: city || null,
        p_categories: categories || null,
        p_price_max: priceMax || null,
        p_mundial_only: mundialOnly || false,
        p_limit: limit,
      });

      if (error) {
        console.error('Error fetching places:', error);
        return [];
      }

      return (data || []) as PlaceWithSafety[];
    } catch (error) {
      console.error('Unexpected error fetching places:', error);
      return [];
    }
  }

  static async searchPlaces(query: string, city?: string, limit: number = 20): Promise<PlaceWithSafety[]> {
    try {
      const { data, error } = await supabase.rpc('search_places_by_text', {
        p_query: query,
        p_city: city || null,
        p_limit: limit,
      });

      if (error) {
        console.error('Error searching places:', error);
        return [];
      }

      return (data || []) as PlaceWithSafety[];
    } catch (error) {
      console.error('Unexpected error searching places:', error);
      return [];
    }
  }

  static async getPlaceById(id: number): Promise<Place | null> {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching place:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  }

  static async getSafetyScore(placeId: number): Promise<SafetyInfo | null> {
    try {
      const { data, error } = await supabase.rpc('get_safety_score_for_place', {
        p_place_id: placeId,
      });

      if (error || !data || data.length === 0) {
        return null;
      }

      return data[0] as SafetyInfo;
    } catch (error) {
      console.error('Error fetching safety score:', error);
      return null;
    }
  }

  static async getNearbyPlaces(
    lat: number,
    lng: number,
    radiusKm: number = 2,
    limit: number = 10
  ): Promise<Place[]> {
    // Approximate degree conversion: 1 degree ~ 111km
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('active', true)
        .gte('latitude', lat - latDelta)
        .lte('latitude', lat + latDelta)
        .gte('longitude', lng - lngDelta)
        .lte('longitude', lng + lngDelta)
        .limit(limit);

      if (error) {
        console.error('Error fetching nearby places:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error:', error);
      return [];
    }
  }

  static async toggleSavedPlace(userId: number, placeId: number): Promise<boolean> {
    try {
      const { data: existing } = await supabase
        .from('user_saved_places')
        .select('id')
        .eq('user_id', userId)
        .eq('place_id', placeId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_saved_places')
          .delete()
          .eq('id', existing.id);
        return false; // unsaved
      } else {
        await supabase
          .from('user_saved_places')
          .insert({ user_id: userId, place_id: placeId });
        return true; // saved
      }
    } catch (error) {
      console.error('Error toggling saved place:', error);
      return false;
    }
  }

  static async getSavedPlaces(userId: number): Promise<UserSavedPlace[]> {
    try {
      const { data, error } = await supabase
        .from('user_saved_places')
        .select('*, place:places(*)')
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved places:', error);
        return [];
      }

      return (data || []) as UserSavedPlace[];
    } catch (error) {
      console.error('Unexpected error:', error);
      return [];
    }
  }

  static async isPlaceSaved(userId: number, placeId: number): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('user_saved_places')
        .select('id')
        .eq('user_id', userId)
        .eq('place_id', placeId)
        .maybeSingle();

      return !!data;
    } catch {
      return false;
    }
  }
}
