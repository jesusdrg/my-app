-- Nova Mundial 2026 - Migration 002: SQL Functions
-- Run this in Supabase SQL Editor after 001

-- Function: Get recommended places with safety score
CREATE OR REPLACE FUNCTION get_recommended_places(
  p_city TEXT DEFAULT NULL,
  p_categories TEXT[] DEFAULT NULL,
  p_price_max INTEGER DEFAULT NULL,
  p_mundial_only BOOLEAN DEFAULT false,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  slug TEXT,
  description TEXT,
  short_description TEXT,
  category TEXT,
  subcategory TEXT,
  city TEXT,
  neighborhood TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  price_level INTEGER,
  rating NUMERIC,
  rating_count INTEGER,
  image_url TEXT,
  opening_hours JSONB,
  tags TEXT[],
  mundial_relevant BOOLEAN,
  mundial_info JSONB,
  safety_score NUMERIC,
  safety_day NUMERIC,
  safety_night NUMERIC,
  safety_tips TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.name, p.slug, p.description, p.short_description,
    p.category, p.subcategory, p.city, p.neighborhood, p.address,
    p.latitude, p.longitude, p.price_level, p.rating, p.rating_count,
    p.image_url, p.opening_hours, p.tags, p.mundial_relevant, p.mundial_info,
    COALESCE(ns.overall_score, 5.0) AS safety_score,
    COALESCE(ns.day_score, 5.0) AS safety_day,
    COALESCE(ns.night_score, 5.0) AS safety_night,
    COALESCE(ns.tips, '{}') AS safety_tips
  FROM places p
  LEFT JOIN neighborhoods n ON LOWER(p.neighborhood) = LOWER(n.name) AND p.city = n.city
  LEFT JOIN neighborhood_safety_scores ns ON n.id = ns.neighborhood_id
  WHERE p.active = true
    AND (p_city IS NULL OR p.city = p_city)
    AND (p_categories IS NULL OR p.category = ANY(p_categories))
    AND (p_price_max IS NULL OR p.price_level <= p_price_max)
    AND (NOT p_mundial_only OR p.mundial_relevant = true)
  ORDER BY COALESCE(ns.overall_score, 5.0) DESC, p.rating DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function: Search places by text
CREATE OR REPLACE FUNCTION search_places_by_text(
  p_query TEXT,
  p_city TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  slug TEXT,
  short_description TEXT,
  category TEXT,
  city TEXT,
  neighborhood TEXT,
  price_level INTEGER,
  rating NUMERIC,
  image_url TEXT,
  tags TEXT[],
  mundial_relevant BOOLEAN,
  safety_score NUMERIC
) AS $$
DECLARE
  search_pattern TEXT;
BEGIN
  search_pattern := '%' || LOWER(p_query) || '%';

  RETURN QUERY
  SELECT
    p.id, p.name, p.slug, p.short_description,
    p.category, p.city, p.neighborhood,
    p.price_level, p.rating, p.image_url, p.tags, p.mundial_relevant,
    COALESCE(ns.overall_score, 5.0) AS safety_score
  FROM places p
  LEFT JOIN neighborhoods n ON LOWER(p.neighborhood) = LOWER(n.name) AND p.city = n.city
  LEFT JOIN neighborhood_safety_scores ns ON n.id = ns.neighborhood_id
  WHERE p.active = true
    AND (p_city IS NULL OR p.city = p_city)
    AND (
      LOWER(p.name) LIKE search_pattern
      OR LOWER(p.description) LIKE search_pattern
      OR LOWER(p.category) LIKE search_pattern
      OR LOWER(p.neighborhood) LIKE search_pattern
      OR EXISTS (SELECT 1 FROM unnest(p.tags) t WHERE LOWER(t) LIKE search_pattern)
    )
  ORDER BY
    CASE WHEN LOWER(p.name) LIKE search_pattern THEN 0 ELSE 1 END,
    p.rating DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function: Get safety score for a place
CREATE OR REPLACE FUNCTION get_safety_score_for_place(p_place_id INTEGER)
RETURNS TABLE (
  neighborhood_name TEXT,
  overall_score NUMERIC,
  day_score NUMERIC,
  night_score NUMERIC,
  tourist_score NUMERIC,
  tips TEXT[],
  confidence NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    n.name AS neighborhood_name,
    ns.overall_score, ns.day_score, ns.night_score, ns.tourist_score,
    ns.tips, ns.confidence
  FROM places p
  JOIN neighborhoods n ON LOWER(p.neighborhood) = LOWER(n.name) AND p.city = n.city
  JOIN neighborhood_safety_scores ns ON n.id = ns.neighborhood_id
  WHERE p.id = p_place_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Score a place for a user (personalized recommendation)
CREATE OR REPLACE FUNCTION score_place_for_user(p_user_id INTEGER, p_place_id INTEGER)
RETURNS NUMERIC AS $$
DECLARE
  v_score NUMERIC := 0;
  v_budget_tier TEXT;
  v_interests TEXT[];
  v_place_price INTEGER;
  v_place_tags TEXT[];
  v_place_rating NUMERIC;
  v_safety NUMERIC;
  v_interest_matches INTEGER := 0;
  v_interest_total INTEGER;
BEGIN
  -- Get user preferences
  SELECT budget_tier, interests
  INTO v_budget_tier, v_interests
  FROM user_travel_preferences
  WHERE user_id = p_user_id;

  -- Get place data
  SELECT price_level, tags, rating
  INTO v_place_price, v_place_tags, v_place_rating
  FROM places WHERE id = p_place_id;

  -- Get safety score
  SELECT COALESCE(ns.overall_score, 5.0)
  INTO v_safety
  FROM places p
  LEFT JOIN neighborhoods n ON LOWER(p.neighborhood) = LOWER(n.name) AND p.city = n.city
  LEFT JOIN neighborhood_safety_scores ns ON n.id = ns.neighborhood_id
  WHERE p.id = p_place_id;

  IF v_safety IS NULL THEN v_safety := 5.0; END IF;

  -- Budget alignment (0-25 pts)
  IF v_budget_tier IS NOT NULL AND v_place_price IS NOT NULL THEN
    CASE v_budget_tier
      WHEN 'economico' THEN
        v_score := v_score + CASE v_place_price WHEN 1 THEN 25 WHEN 2 THEN 15 WHEN 3 THEN 5 ELSE 0 END;
      WHEN 'moderado' THEN
        v_score := v_score + CASE v_place_price WHEN 2 THEN 25 WHEN 1 THEN 20 WHEN 3 THEN 15 ELSE 5 END;
      WHEN 'premium' THEN
        v_score := v_score + CASE v_place_price WHEN 3 THEN 25 WHEN 4 THEN 20 WHEN 2 THEN 15 ELSE 5 END;
      WHEN 'sin_limite' THEN
        v_score := v_score + CASE v_place_price WHEN 4 THEN 25 WHEN 3 THEN 22 WHEN 2 THEN 18 ELSE 15 END;
      ELSE
        v_score := v_score + 12;
    END CASE;
  ELSE
    v_score := v_score + 12;
  END IF;

  -- Interest match (0-40 pts)
  IF v_interests IS NOT NULL AND array_length(v_interests, 1) > 0 THEN
    v_interest_total := array_length(v_interests, 1);
    SELECT COUNT(*) INTO v_interest_matches
    FROM unnest(v_interests) ui
    WHERE EXISTS (SELECT 1 FROM unnest(v_place_tags) pt WHERE LOWER(pt) LIKE '%' || LOWER(ui) || '%');

    IF v_interest_total > 0 THEN
      v_score := v_score + (v_interest_matches::NUMERIC / v_interest_total * 40);
    END IF;
  ELSE
    v_score := v_score + 20;
  END IF;

  -- Rating bonus (0-20 pts)
  v_score := v_score + COALESCE(v_place_rating, 3.0) * 4;

  -- Safety bonus (0-15 pts)
  v_score := v_score + v_safety * 1.5;

  RETURN LEAST(v_score, 100);
END;
$$ LANGUAGE plpgsql;
