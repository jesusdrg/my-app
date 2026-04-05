import { supabase, Itinerary, ItineraryItem, ItineraryWithItems } from './supabase';

export interface CreateItineraryParams {
  userId: number;
  title: string;
  city: 'CDMX' | 'GDL' | 'MTY';
  startDate?: string;
  endDate?: string;
  durationDays: number;
  budgetTier?: string;
  companions?: string;
  preferences?: Record<string, unknown>;
}

export interface AddItemParams {
  itineraryId: number;
  placeId?: number;
  dayNumber: number;
  timeSlot?: string;
  endTime?: string;
  activityName: string;
  activityDescription?: string;
  neighborhood?: string;
  estimatedCost?: number;
  transportMode?: string;
  transportTimeMin?: number;
  notes?: string;
  orderIndex: number;
}

export class ItineraryService {
  static async createItinerary(params: CreateItineraryParams): Promise<Itinerary | null> {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .insert({
          user_id: params.userId,
          title: params.title,
          city: params.city,
          start_date: params.startDate || null,
          end_date: params.endDate || null,
          duration_days: params.durationDays,
          status: 'draft',
          budget_tier: params.budgetTier || null,
          companions: params.companions || null,
          preferences: params.preferences || {},
          generated_by: 'algorithm',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating itinerary:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  }

  static async addItineraryItem(params: AddItemParams): Promise<ItineraryItem | null> {
    try {
      const { data, error } = await supabase
        .from('itinerary_items')
        .insert({
          itinerary_id: params.itineraryId,
          place_id: params.placeId || null,
          day_number: params.dayNumber,
          time_slot: params.timeSlot || null,
          end_time: params.endTime || null,
          activity_name: params.activityName,
          activity_description: params.activityDescription || null,
          neighborhood: params.neighborhood || null,
          estimated_cost: params.estimatedCost || 0,
          transport_mode: params.transportMode || null,
          transport_time_min: params.transportTimeMin || 0,
          notes: params.notes || null,
          order_index: params.orderIndex,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding itinerary item:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  }

  static async addBulkItems(items: AddItemParams[]): Promise<boolean> {
    try {
      const rows = items.map(params => ({
        itinerary_id: params.itineraryId,
        place_id: params.placeId || null,
        day_number: params.dayNumber,
        time_slot: params.timeSlot || null,
        end_time: params.endTime || null,
        activity_name: params.activityName,
        activity_description: params.activityDescription || null,
        neighborhood: params.neighborhood || null,
        estimated_cost: params.estimatedCost || 0,
        transport_mode: params.transportMode || null,
        transport_time_min: params.transportTimeMin || 0,
        notes: params.notes || null,
        order_index: params.orderIndex,
      }));

      const { error } = await supabase
        .from('itinerary_items')
        .insert(rows);

      if (error) {
        console.error('Error adding bulk items:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  }

  static async getItinerary(itineraryId: number): Promise<ItineraryWithItems | null> {
    try {
      const { data: itinerary, error: itError } = await supabase
        .from('itineraries')
        .select('*')
        .eq('id', itineraryId)
        .single();

      if (itError || !itinerary) {
        console.error('Error fetching itinerary:', itError);
        return null;
      }

      const { data: items, error: itemsError } = await supabase
        .from('itinerary_items')
        .select('*, place:places(*)')
        .eq('itinerary_id', itineraryId)
        .order('day_number', { ascending: true })
        .order('order_index', { ascending: true });

      if (itemsError) {
        console.error('Error fetching itinerary items:', itemsError);
        return { ...itinerary, items: [] };
      }

      return { ...itinerary, items: items || [] };
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  }

  static async getUserItineraries(userId: number): Promise<Itinerary[]> {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user itineraries:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error:', error);
      return [];
    }
  }

  static async updateItineraryStatus(
    itineraryId: number,
    status: 'draft' | 'active' | 'completed'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('itineraries')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', itineraryId);

      if (error) {
        console.error('Error updating itinerary status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  }

  static async deleteItinerary(itineraryId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', itineraryId);

      if (error) {
        console.error('Error deleting itinerary:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  }
}
