-- Nova Mundial 2026 - Migration 005: Seed Curated Trips + Categories

-- New categories
INSERT INTO categories (name, slug, description, icon, color, active) VALUES
('Mundial 2026', 'mundial-2026', 'Experiencias relacionadas al Mundial FIFA 2026 en Mexico', 'trophy.fill', '#D4AF37', true),
('Gastronomia', 'gastronomia', 'Tours y experiencias gastronomicas por Mexico', 'fork.knife', '#EF4444', true),
('Cultural', 'cultural', 'Museos, historia y patrimonio cultural', 'building.columns', '#8B5CF6', true),
('Aventura', 'aventura', 'Naturaleza, senderismo y experiencias al aire libre', 'figure.hiking', '#10B981', true),
('Vida Nocturna', 'vida-nocturna', 'Bares, clubs y experiencias nocturnas', 'moon.stars.fill', '#6366F1', true)
ON CONFLICT (slug) DO NOTHING;

-- Curated trip packages
INSERT INTO trips (title, slug, description, duration_days, meals_included, price_from, currency_id, category_id, difficulty_level_id, min_group_size, max_group_size, image_url, featured, active) VALUES
(
  'CDMX Mundial Experience',
  'cdmx-mundial-experience',
  'Vive el Mundial 2026 en la Ciudad de Mexico. 5 dias de futbol, gastronomia y cultura en la capital. Incluye acceso a fan zones, tour del Estadio Azteca, recorrido gastronomico por la Roma y Condesa, y visita al Museo de Antropologia.',
  5, 8,
  15000,
  (SELECT id FROM currencies WHERE code = 'MXN' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'mundial-2026' LIMIT 1),
  (SELECT id FROM difficulty_levels ORDER BY level_order LIMIT 1),
  1, 12,
  'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&q=80',
  true, true
),
(
  'Guadalajara Tequila y Futbol',
  'guadalajara-tequila-futbol',
  'Combina la pasion del futbol con la ruta del tequila en Jalisco. 4 dias visitando el Estadio Akron, destilerias de tequila en Pueblo Magico, birria autentica y vida nocturna en Chapultepec.',
  4, 6,
  12000,
  (SELECT id FROM currencies WHERE code = 'MXN' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'mundial-2026' LIMIT 1),
  (SELECT id FROM difficulty_levels ORDER BY level_order LIMIT 1),
  1, 10,
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
  true, true
),
(
  'Monterrey Industrial y Cervecero',
  'monterrey-industrial-cervecero',
  '3 dias descubriendo el Monterrey moderno. Tour del Estadio BBVA, carne asada regiomontana, cervecerias artesanales, Parque Fundidora y senderismo al Cerro de la Silla.',
  3, 4,
  10000,
  (SELECT id FROM currencies WHERE code = 'MXN' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'mundial-2026' LIMIT 1),
  (SELECT id FROM difficulty_levels ORDER BY level_order LIMIT 1),
  1, 10,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  true, true
),
(
  'Ruta Tri-Ciudad Mundial',
  'ruta-tri-ciudad-mundial',
  'El viaje definitivo del Mundial 2026. 10 dias recorriendo las 3 sedes mexicanas: CDMX, Guadalajara y Monterrey. Estadios, fan zones, gastronomia regional y cultura en cada ciudad.',
  10, 18,
  35000,
  (SELECT id FROM currencies WHERE code = 'MXN' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'mundial-2026' LIMIT 1),
  (SELECT id FROM difficulty_levels ORDER BY level_order LIMIT 1),
  1, 8,
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80',
  true, true
),
(
  'Foodie Tour CDMX',
  'foodie-tour-cdmx',
  '3 dias de inmersion gastronomica en CDMX. Desde tacos callejeros con estrella Michelin hasta alta cocina en Pujol. Mercados, mezcalerias y chocolate en El Moro.',
  3, 10,
  8000,
  (SELECT id FROM currencies WHERE code = 'MXN' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'gastronomia' LIMIT 1),
  (SELECT id FROM difficulty_levels ORDER BY level_order LIMIT 1),
  2, 8,
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
  true, true
),
(
  'Cultura Prehispanica',
  'cultura-prehispanica',
  '4 dias explorando el Mexico antiguo. Teotihuacan, Templo Mayor, Museo de Antropologia, Xochimilco y Coyoacan. Un viaje al corazon de la civilizacion mesoamericana.',
  4, 6,
  10000,
  (SELECT id FROM currencies WHERE code = 'MXN' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'cultural' LIMIT 1),
  (SELECT id FROM difficulty_levels ORDER BY level_order LIMIT 1),
  2, 15,
  'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80',
  true, true
),
(
  'Noche Capitalina',
  'noche-capitalina',
  '3 noches descubriendo la vida nocturna de CDMX. Mezcalerias en el Centro, cocteleria de autor en la Roma, speakeasies secretos, cantinas clasicas y clubes en la Condesa.',
  3, 4,
  7000,
  (SELECT id FROM currencies WHERE code = 'MXN' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'vida-nocturna' LIMIT 1),
  (SELECT id FROM difficulty_levels ORDER BY level_order LIMIT 1),
  2, 8,
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
  false, true
),
(
  'CDMX Express Mundial',
  'cdmx-express-mundial',
  'Fin de semana mundialista en CDMX. Fan zone en Chapultepec, tacos al pastor, Estadio Azteca y mezcal en la Roma. Todo en 2 dias intensos.',
  2, 3,
  5000,
  (SELECT id FROM currencies WHERE code = 'MXN' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'mundial-2026' LIMIT 1),
  (SELECT id FROM difficulty_levels ORDER BY level_order LIMIT 1),
  1, 15,
  'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
  false, true
),
(
  'Jalisco Artesanal',
  'jalisco-artesanal',
  '3 dias explorando la artesania y cultura de Jalisco. Tlaquepaque, tequila, mariachi en vivo, mercados y la magia del pueblo magico.',
  3, 5,
  9000,
  (SELECT id FROM currencies WHERE code = 'MXN' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'cultural' LIMIT 1),
  (SELECT id FROM difficulty_levels ORDER BY level_order LIMIT 1),
  2, 10,
  'https://images.unsplash.com/photo-1555529771-835f59fc5efa?w=800&q=80',
  false, true
),
(
  'MTY Aventura y Montaña',
  'mty-aventura-montana',
  '3 dias de aventura en Monterrey. Senderismo en Cerro de la Silla, rapel en Matacanes, Parque Fundidora y carne asada con vista a las montanas.',
  3, 4,
  11000,
  (SELECT id FROM currencies WHERE code = 'MXN' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'aventura' LIMIT 1),
  (SELECT id FROM difficulty_levels ORDER BY level_order LIMIT 1),
  2, 8,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  false, true
),
(
  'Mexico Premium Mundial VIP',
  'mexico-premium-mundial-vip',
  '7 dias de experiencia VIP del Mundial. Boletos premium, hoteles 5 estrellas, restaurantes exclusivos, transporte privado y concierge dedicado en CDMX y GDL.',
  7, 14,
  85000,
  (SELECT id FROM currencies WHERE code = 'MXN' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'mundial-2026' LIMIT 1),
  (SELECT id FROM difficulty_levels ORDER BY level_order LIMIT 1),
  1, 6,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  true, true
),
(
  'Backpacker Mundial',
  'backpacker-mundial',
  '7 dias viviendo el Mundial al estilo mochilero. Hostales con terraza, street food, fan zones gratuitas, transporte publico y la mejor vibra del mundial sin gastar de mas.',
  7, 4,
  4500,
  (SELECT id FROM currencies WHERE code = 'MXN' LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'mundial-2026' LIMIT 1),
  (SELECT id FROM difficulty_levels ORDER BY level_order LIMIT 1),
  1, 20,
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
  false, true
);
