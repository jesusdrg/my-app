import { PlaceWithSafety } from './supabase';

// Interest-to-tags mapping
const INTEREST_TAG_MAP: Record<string, string[]> = {
  'Partidos y fan zones': ['mundial', 'futbol', 'fan_zone', 'estadio'],
  'Gastronomia': ['mexicana', 'tacos', 'alta_cocina', 'street_food', 'mezcal', 'birria', 'mariscos'],
  'Gastronomia local': ['mexicana', 'tacos', 'alta_cocina', 'street_food', 'mezcal', 'birria'],
  'Cultura e historia': ['museo', 'historico', 'cultural', 'arte', 'prehispanico', 'patrimonio', 'arqueologico'],
  'Vida nocturna': ['bar', 'club', 'terraza', 'mezcaleria', 'cerveza_artesanal', 'cocteleria', 'nocturno'],
  'Compras y mercados': ['mercado', 'artesanias', 'compras', 'souvenir', 'bazar'],
  'Compras': ['mercado', 'artesanias', 'compras', 'souvenir', 'bazar', 'shopping'],
  'Naturaleza y tours': ['naturaleza', 'parque', 'tour', 'aventura', 'senderismo', 'montaña'],
  'Playas y naturaleza': ['naturaleza', 'parque', 'tour', 'aventura', 'senderismo'],
  'Solo futbol': ['mundial', 'futbol', 'fan_zone', 'estadio'],
};

// Budget tier to price level mapping
const BUDGET_PRICE_MAP: Record<string, number[]> = {
  'economico': [1],
  'Viajero economico / mochilero': [1],
  'moderado': [1, 2],
  'Comodidad a buen precio': [1, 2],
  'premium': [2, 3, 4],
  'Experiencias premium': [2, 3, 4],
  'sin_limite': [1, 2, 3, 4],
  'Lo mejor sin limites': [1, 2, 3, 4],
};

export interface UserPreferences {
  interests: string[];
  budgetTier: string;
  safetyPriority?: string;
  companions?: string;
}

export interface ScoredPlace extends PlaceWithSafety {
  score: number;
  scoreBreakdown: {
    budget: number;
    interest: number;
    rating: number;
    safety: number;
  };
}

interface DayPlan {
  dayNumber: number;
  activities: DayActivity[];
  totalCost: number;
}

interface DayActivity {
  timeSlot: string;
  endTime: string;
  place: PlaceWithSafety;
  type: 'breakfast' | 'morning' | 'lunch' | 'afternoon' | 'dinner' | 'nightlife';
  estimatedCost: number;
  transportTimeMin: number;
}

export class RecommendationEngine {
  /**
   * Score places based on user preferences (0-100 scale, no LLM)
   */
  static rankPlaces(
    places: PlaceWithSafety[],
    preferences: UserPreferences
  ): ScoredPlace[] {
    return places
      .map(place => {
        const breakdown = {
          budget: this.scoreBudget(place.price_level, preferences.budgetTier),
          interest: this.scoreInterest(place.tags, preferences.interests),
          rating: this.scoreRating(place.rating),
          safety: this.scoreSafety(place.safety_score, preferences.safetyPriority),
        };

        const score = breakdown.budget + breakdown.interest + breakdown.rating + breakdown.safety;

        return { ...place, score: Math.min(score, 100), scoreBreakdown: breakdown };
      })
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Budget alignment scoring (0-25 pts)
   */
  private static scoreBudget(priceLevel: number | undefined, budgetTier: string): number {
    if (!priceLevel) return 12;

    const preferredLevels = BUDGET_PRICE_MAP[budgetTier] || [1, 2, 3];

    if (preferredLevels.includes(priceLevel)) {
      return 25;
    }

    // Partial score for adjacent levels
    const minPreferred = Math.min(...preferredLevels);
    const maxPreferred = Math.max(...preferredLevels);
    const distance = Math.min(
      Math.abs(priceLevel - minPreferred),
      Math.abs(priceLevel - maxPreferred)
    );

    return Math.max(25 - distance * 10, 0);
  }

  /**
   * Interest match scoring (0-40 pts)
   */
  private static scoreInterest(placeTags: string[], userInterests: string[]): number {
    if (!userInterests || userInterests.length === 0) return 20;
    if (!placeTags || placeTags.length === 0) return 10;

    // Expand user interests to tags
    const expandedTags = new Set<string>();
    for (const interest of userInterests) {
      const mapped = INTEREST_TAG_MAP[interest];
      if (mapped) {
        mapped.forEach(t => expandedTags.add(t.toLowerCase()));
      } else {
        expandedTags.add(interest.toLowerCase());
      }
    }

    // Count matches
    const placeTagsLower = placeTags.map(t => t.toLowerCase());
    let matches = 0;
    for (const tag of placeTagsLower) {
      for (const userTag of expandedTags) {
        if (tag.includes(userTag) || userTag.includes(tag)) {
          matches++;
          break;
        }
      }
    }

    const matchRatio = matches / Math.max(expandedTags.size, 1);
    return Math.round(matchRatio * 40);
  }

  /**
   * Rating bonus (0-20 pts)
   */
  private static scoreRating(rating: number): number {
    return Math.round((rating || 3.0) * 4);
  }

  /**
   * Safety bonus (0-15 pts), weighted by user priority
   */
  private static scoreSafety(safetyScore: number, priority?: string): number {
    const base = (safetyScore || 5.0) * 1.5;

    if (priority === 'Maxima') {
      return Math.round(base); // Full weight
    }
    if (priority === 'Basica') {
      return Math.round(base * 0.5); // Half weight
    }
    return Math.round(base * 0.75); // Default: Important
  }

  /**
   * Generate a multi-day itinerary plan from scored places
   */
  static generateDayPlans(
    scoredPlaces: ScoredPlace[],
    durationDays: number,
    companions?: string
  ): DayPlan[] {
    const plans: DayPlan[] = [];
    const usedPlaceIds = new Set<number>();

    // Time slots for each activity type
    const timeSlots: { type: DayActivity['type']; start: string; end: string }[] = [
      { type: 'breakfast', start: '09:00', end: '10:00' },
      { type: 'morning', start: '10:30', end: '12:30' },
      { type: 'lunch', start: '13:00', end: '14:30' },
      { type: 'afternoon', start: '15:00', end: '17:30' },
      { type: 'dinner', start: '19:00', end: '21:00' },
      { type: 'nightlife', start: '21:30', end: '23:30' },
    ];

    // Category preferences per time slot
    const slotCategories: Record<DayActivity['type'], string[]> = {
      breakfast: ['restaurante', 'hotel'],
      morning: ['cultural', 'fan_zone', 'estadio', 'compras', 'naturaleza'],
      lunch: ['restaurante'],
      afternoon: ['cultural', 'fan_zone', 'compras', 'naturaleza', 'estadio'],
      dinner: ['restaurante'],
      nightlife: ['bar', 'fan_zone'],
    };

    // Skip nightlife for families
    const skipNightlife = companions === 'Familia con ninos';

    for (let day = 1; day <= durationDays; day++) {
      const dayActivities: DayActivity[] = [];
      let totalCost = 0;

      for (const slot of timeSlots) {
        if (skipNightlife && slot.type === 'nightlife') continue;

        const preferredCategories = slotCategories[slot.type];
        const candidate = scoredPlaces.find(
          p => !usedPlaceIds.has(p.id) && preferredCategories.includes(p.category)
        );

        if (candidate) {
          usedPlaceIds.add(candidate.id);
          const cost = this.estimateCost(candidate.price_level);
          totalCost += cost;

          dayActivities.push({
            timeSlot: slot.start,
            endTime: slot.end,
            place: candidate,
            type: slot.type,
            estimatedCost: cost,
            transportTimeMin: 15,
          });
        }
      }

      // Optimize route for the day
      if (dayActivities.length > 1) {
        const optimized = this.optimizeRoute(dayActivities);
        plans.push({ dayNumber: day, activities: optimized, totalCost });
      } else {
        plans.push({ dayNumber: day, activities: dayActivities, totalCost });
      }
    }

    return plans;
  }

  /**
   * Estimate cost based on price level (in MXN)
   */
  private static estimateCost(priceLevel: number | undefined): number {
    switch (priceLevel) {
      case 1: return 150;
      case 2: return 400;
      case 3: return 800;
      case 4: return 1500;
      default: return 300;
    }
  }

  /**
   * Optimize route using nearest-neighbor heuristic + 2-opt improvement
   */
  static optimizeRoute(activities: DayActivity[]): DayActivity[] {
    if (activities.length <= 2) return activities;

    // Extract coordinates
    const coords = activities.map(a => ({
      lat: a.place.latitude || 0,
      lng: a.place.longitude || 0,
    }));

    // Nearest-neighbor starting from first activity
    const visited = new Set<number>([0]);
    const order = [0];

    while (order.length < activities.length) {
      const current = order[order.length - 1];
      let bestNext = -1;
      let bestDist = Infinity;

      for (let i = 0; i < activities.length; i++) {
        if (visited.has(i)) continue;
        const dist = haversineDistance(
          coords[current].lat, coords[current].lng,
          coords[i].lat, coords[i].lng
        );
        if (dist < bestDist) {
          bestDist = dist;
          bestNext = i;
        }
      }

      if (bestNext >= 0) {
        visited.add(bestNext);
        order.push(bestNext);
      }
    }

    // 2-opt improvement
    let improved = true;
    while (improved) {
      improved = false;
      for (let i = 1; i < order.length - 1; i++) {
        for (let j = i + 1; j < order.length; j++) {
          const currentDist =
            haversineDistance(coords[order[i - 1]].lat, coords[order[i - 1]].lng, coords[order[i]].lat, coords[order[i]].lng) +
            haversineDistance(coords[order[j]].lat, coords[order[j]].lng, coords[order[Math.min(j + 1, order.length - 1)]].lat, coords[order[Math.min(j + 1, order.length - 1)]].lng);

          const newDist =
            haversineDistance(coords[order[i - 1]].lat, coords[order[i - 1]].lng, coords[order[j]].lat, coords[order[j]].lng) +
            haversineDistance(coords[order[i]].lat, coords[order[i]].lng, coords[order[Math.min(j + 1, order.length - 1)]].lat, coords[order[Math.min(j + 1, order.length - 1)]].lng);

          if (newDist < currentDist) {
            // Reverse the segment between i and j
            const segment = order.slice(i, j + 1).reverse();
            order.splice(i, j - i + 1, ...segment);
            improved = true;
          }
        }
      }
    }

    // Reorder activities maintaining original time slots
    const originalTimeSlots = activities.map(a => a.timeSlot);
    return order.map((idx, newIdx) => ({
      ...activities[idx],
      timeSlot: originalTimeSlots[newIdx],
      endTime: activities[newIdx]?.endTime || activities[idx].endTime,
      transportTimeMin: newIdx > 0
        ? Math.round(haversineDistance(
            coords[order[newIdx - 1]].lat, coords[order[newIdx - 1]].lng,
            coords[idx].lat, coords[idx].lng
          ) * 4) // ~4 min per km in city
        : 0,
    }));
  }
}

/**
 * Haversine distance between two points in km
 */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
