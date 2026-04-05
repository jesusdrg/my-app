-- Nova Mundial 2026 - Migration 001: Create Tables
-- Run this in Supabase SQL Editor

-- 1. Neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL CHECK (city IN ('CDMX', 'GDL', 'MTY')),
  description TEXT,
  center_latitude DOUBLE PRECISION,
  center_longitude DOUBLE PRECISION,
  walkability_score NUMERIC(3,1) DEFAULT 5.0,
  transit_access_score NUMERIC(3,1) DEFAULT 5.0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_neighborhoods_city ON neighborhoods(city);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_active ON neighborhoods(active);

-- 2. Neighborhood safety scores
CREATE TABLE IF NOT EXISTS neighborhood_safety_scores (
  id SERIAL PRIMARY KEY,
  neighborhood_id INTEGER NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  overall_score NUMERIC(3,1) NOT NULL DEFAULT 5.0,
  day_score NUMERIC(3,1) DEFAULT 5.0,
  night_score NUMERIC(3,1) DEFAULT 5.0,
  tourist_score NUMERIC(3,1) DEFAULT 5.0,
  crime_rate_weight NUMERIC(3,2) DEFAULT 0.30,
  incident_frequency_weight NUMERIC(3,2) DEFAULT 0.25,
  police_presence_weight NUMERIC(3,2) DEFAULT 0.25,
  infrastructure_weight NUMERIC(3,2) DEFAULT 0.20,
  tips TEXT[] DEFAULT '{}',
  sources TEXT[] DEFAULT '{}',
  confidence NUMERIC(3,2) DEFAULT 0.70,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(neighborhood_id)
);

CREATE INDEX IF NOT EXISTS idx_safety_neighborhood ON neighborhood_safety_scores(neighborhood_id);

-- 3. Places table (main POI table)
CREATE TABLE IF NOT EXISTS places (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT NOT NULL CHECK (category IN ('estadio', 'restaurante', 'bar', 'hotel', 'cultural', 'fan_zone', 'compras', 'transporte', 'naturaleza')),
  subcategory TEXT,
  city TEXT NOT NULL CHECK (city IN ('CDMX', 'GDL', 'MTY')),
  neighborhood TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  price_level INTEGER CHECK (price_level BETWEEN 1 AND 4),
  rating NUMERIC(2,1) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  image_url TEXT,
  opening_hours JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  mundial_relevant BOOLEAN DEFAULT false,
  mundial_info JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_places_city ON places(city);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_neighborhood ON places(neighborhood);
CREATE INDEX IF NOT EXISTS idx_places_mundial ON places(mundial_relevant);
CREATE INDEX IF NOT EXISTS idx_places_active ON places(active);
CREATE INDEX IF NOT EXISTS idx_places_tags ON places USING GIN(tags);

-- 4. Itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  city TEXT NOT NULL CHECK (city IN ('CDMX', 'GDL', 'MTY')),
  start_date DATE,
  end_date DATE,
  duration_days INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  budget_tier TEXT CHECK (budget_tier IN ('economico', 'moderado', 'premium', 'sin_limite')),
  total_estimated_cost NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'MXN',
  companions TEXT,
  preferences JSONB DEFAULT '{}',
  generated_by TEXT DEFAULT 'algorithm',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itineraries_user ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_city ON itineraries(city);
CREATE INDEX IF NOT EXISTS idx_itineraries_status ON itineraries(status);

-- 5. Itinerary items table
CREATE TABLE IF NOT EXISTS itinerary_items (
  id SERIAL PRIMARY KEY,
  itinerary_id INTEGER NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  place_id INTEGER REFERENCES places(id) ON DELETE SET NULL,
  day_number INTEGER NOT NULL DEFAULT 1,
  time_slot TIME,
  end_time TIME,
  activity_name TEXT NOT NULL,
  activity_description TEXT,
  neighborhood TEXT,
  estimated_cost NUMERIC(10,2) DEFAULT 0,
  transport_mode TEXT,
  transport_time_min INTEGER DEFAULT 0,
  notes TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itinerary_items_itinerary ON itinerary_items(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_place ON itinerary_items(place_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_day ON itinerary_items(day_number);

-- 6. User saved places (bookmarks)
CREATE TABLE IF NOT EXISTS user_saved_places (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, place_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_places_user ON user_saved_places(user_id);

-- 7. ALTER user_travel_preferences to add Mundial columns
ALTER TABLE user_travel_preferences
  ADD COLUMN IF NOT EXISTS country_origin TEXT,
  ADD COLUMN IF NOT EXISTS duration_stay TEXT,
  ADD COLUMN IF NOT EXISTS companions TEXT,
  ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS budget_tier TEXT,
  ADD COLUMN IF NOT EXISTS mundial_focus BOOLEAN DEFAULT true;
