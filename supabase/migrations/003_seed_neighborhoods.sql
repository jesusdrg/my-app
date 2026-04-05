-- Nova Mundial 2026 - Migration 003: Seed Neighborhoods + Safety Scores

-- CDMX Neighborhoods
INSERT INTO neighborhoods (name, city, description, center_latitude, center_longitude, walkability_score, transit_access_score) VALUES
('Polanco', 'CDMX', 'Zona exclusiva con museos, restaurantes de alta cocina y tiendas de lujo', 19.4336, -99.1852, 9.0, 9.0),
('Roma Norte', 'CDMX', 'Barrio bohemio con arquitectura art deco, cafes y vida nocturna', 19.4164, -99.1610, 9.5, 8.5),
('Condesa', 'CDMX', 'Colonia arbolada con parques, restaurantes y ambiente cosmopolita', 19.4121, -99.1738, 9.5, 8.5),
('Centro Historico', 'CDMX', 'Corazon de la ciudad con el Zocalo, Palacio Nacional y Templo Mayor', 19.4326, -99.1332, 8.5, 9.5),
('Coyoacan', 'CDMX', 'Pueblo magico urbano, casa de Frida Kahlo y mercados tradicionales', 19.3502, -99.1630, 8.0, 7.5),
('Santa Fe', 'CDMX', 'Zona corporativa moderna con centros comerciales y hoteles de negocios', 19.3573, -99.2750, 5.0, 6.0),
('Reforma', 'CDMX', 'Avenida principal con el Angel de la Independencia y rascacielos', 19.4270, -99.1677, 8.0, 9.0),
('Chapultepec', 'CDMX', 'Parque urbano mas grande de Latinoamerica con castillo y museos', 19.4212, -99.1859, 7.5, 8.5),
('Coapa', 'CDMX', 'Zona residencial cercana al Estadio Azteca', 19.3100, -99.1350, 6.0, 7.0),
('Tlalpan', 'CDMX', 'Centro historico al sur con bosques y zona arqueologica de Cuicuilco', 19.2900, -99.1680, 7.0, 6.5),
('Xochimilco', 'CDMX', 'Patrimonio UNESCO con canales, trajineras y chinampas', 19.2600, -99.1040, 6.5, 6.0),
('Del Valle', 'CDMX', 'Colonia residencial con restaurantes y parques familiares', 19.3870, -99.1620, 8.5, 8.0),
('Narvarte', 'CDMX', 'Colonia clasica con taquerias legendarias y vida de barrio', 19.3990, -99.1530, 8.0, 8.0),
('San Angel', 'CDMX', 'Pueblo colonial con arte, bazares sabatinos y jardines', 19.3470, -99.1920, 7.5, 7.0),
('Doctores', 'CDMX', 'Colonia popular cerca de Arena Mexico con tacos nocturnos', 19.4180, -99.1430, 6.5, 8.0),
('Juarez', 'CDMX', 'Zona Reforma con hoteles, bares de moda y arquitectura art nouveau', 19.4270, -99.1580, 8.5, 9.0),
('Santa Maria la Ribera', 'CDMX', 'Barrio con el Kiosco Morisco, museos y ambiente local', 19.4520, -99.1560, 7.5, 8.0),
('Zona Rosa', 'CDMX', 'Distrito de entretenimiento con bares, clubs y comunidad LGBTQ+', 19.4260, -99.1610, 7.5, 9.0),
('Estadio Azteca', 'CDMX', 'Zona del legendario estadio sede del Mundial 2026', 19.3029, -99.1505, 5.5, 7.0),
('Pedregal', 'CDMX', 'Zona residencial de alto nivel sobre roca volcanica', 19.3200, -99.1900, 6.0, 5.5);

-- GDL Neighborhoods
INSERT INTO neighborhoods (name, city, description, center_latitude, center_longitude, walkability_score, transit_access_score) VALUES
('Zapopan Centro', 'GDL', 'Centro de Zapopan con basilica y plazas coloniales', 20.7213, -103.3860, 8.0, 7.5),
('Chapultepec GDL', 'GDL', 'Avenida con bares, restaurantes y vida nocturna de Guadalajara', 20.6740, -103.3800, 9.0, 8.0),
('Centro Historico GDL', 'GDL', 'Catedral, Hospicio Cabanas y mercados tradicionales', 20.6772, -103.3477, 9.0, 9.0),
('Tlaquepaque', 'GDL', 'Pueblo magico con artesanias, galerias y mariachi', 20.6400, -103.3100, 8.5, 7.0),
('Providencia', 'GDL', 'Zona residencial de lujo con restaurantes gourmet', 20.6940, -103.4020, 8.0, 7.0),
('Americana', 'GDL', 'Barrio con glorietas, cafes artesanales y cultura alternativa', 20.6730, -103.3660, 9.0, 8.0),
('Chapalita', 'GDL', 'Colonia familiar con parque central y comercios locales', 20.6620, -103.4020, 8.5, 7.0),
('Estadio Akron', 'GDL', 'Zona del estadio de Chivas, sede del Mundial 2026', 20.6810, -103.4630, 5.0, 6.0),
('Santa Tere', 'GDL', 'Barrio bohemio con murales, mercados y artesanos', 20.6650, -103.3550, 8.5, 7.5),
('Colonia Lafayette', 'GDL', 'Zona trendy con gastronomia de autor y galerias de arte', 20.6760, -103.3720, 8.5, 7.5);

-- MTY Neighborhoods
INSERT INTO neighborhoods (name, city, description, center_latitude, center_longitude, walkability_score, transit_access_score) VALUES
('San Pedro', 'MTY', 'Municipio exclusivo con restaurantes, plazas y vida nocturna premium', 25.6580, -100.3520, 7.5, 7.0),
('Barrio Antiguo', 'MTY', 'Centro historico con bares, museos y arquitectura colonial', 25.6700, -100.3080, 9.0, 8.5),
('Centro MTY', 'MTY', 'Macroplaza, Museo MARCO y Palacio de Gobierno', 25.6714, -100.3094, 8.5, 9.0),
('Valle Oriente', 'MTY', 'Zona moderna con centros comerciales y restaurantes de autor', 25.6400, -100.3200, 6.5, 7.0),
('Guadalupe', 'MTY', 'Municipio con parques y zona residencial accesible', 25.6780, -100.2570, 6.0, 7.0),
('Cumbres', 'MTY', 'Zona residencial familiar al norte de la ciudad', 25.7520, -100.3700, 6.5, 6.0),
('Del Valle MTY', 'MTY', 'Colonia con restaurantes, cafes y universidad cercana', 25.6500, -100.3350, 8.0, 7.5),
('Estadio BBVA', 'MTY', 'Zona del estadio de Rayados, sede del Mundial 2026', 25.6698, -100.2437, 5.0, 6.5),
('Fundidora', 'MTY', 'Parque Fundidora con museos, arena y espacios culturales', 25.6780, -100.2840, 7.5, 8.0),
('Obispado', 'MTY', 'Zona historica con mirador y Obispado colonial', 25.6750, -100.3300, 7.0, 7.0);

-- Safety Scores for ALL neighborhoods
-- CDMX
INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 9.2, 9.5, 8.8, 9.5, ARRAY['Zona muy segura con presencia policial constante', 'Ideal para caminar de dia y noche', 'Cajeros seguros dentro de plazas']
FROM neighborhoods WHERE name = 'Polanco' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.3, 9.0, 7.5, 8.5, ARRAY['Segura de dia, precaucion en calles oscuras de noche', 'Usa taxis de app', 'Evita mostrar objetos de valor']
FROM neighborhoods WHERE name = 'Roma Norte' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.5, 9.0, 8.0, 8.8, ARRAY['Zona muy caminable y segura', 'Parques iluminados en la noche', 'Buena presencia policial']
FROM neighborhoods WHERE name = 'Condesa' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.5, 8.5, 6.0, 7.5, ARRAY['Mucha presencia policial de dia', 'Evita calles secundarias de noche', 'Cuida pertenencias en multitudes']
FROM neighborhoods WHERE name = 'Centro Historico' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.7, 9.2, 8.0, 9.0, ARRAY['Zona turistica muy tranquila', 'Mercados seguros de dia', 'Uber para regresar de noche']
FROM neighborhoods WHERE name = 'Coyoacan' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.8, 8.5, 7.0, 7.5, ARRAY['Zona corporativa segura de dia', 'Poco transito peatonal de noche', 'Usa transporte privado']
FROM neighborhoods WHERE name = 'Santa Fe' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.0, 8.8, 7.2, 8.0, ARRAY['Avenida principal bien vigilada', 'Precaucion en calles laterales', 'Ciclovia segura de dia']
FROM neighborhoods WHERE name = 'Reforma' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 9.0, 9.5, 8.0, 9.2, ARRAY['Parque muy seguro durante horario', 'Evita zonas boscosas al anochecer', 'Guardias en museos y entradas']
FROM neighborhoods WHERE name = 'Chapultepec' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.0, 7.5, 6.0, 6.8, ARRAY['Zona residencial tranquila', 'Precaucion cerca del estadio en dias de partido', 'Usa transporte oficial']
FROM neighborhoods WHERE name = 'Coapa' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.2, 8.0, 6.0, 7.0, ARRAY['Centro de Tlalpan seguro de dia', 'Bosques solo con guia', 'Transporte publico funcional']
FROM neighborhoods WHERE name = 'Tlalpan' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 6.5, 7.5, 5.0, 7.0, ARRAY['Zona de trajineras segura de dia', 'Evita embarcaderos no oficiales', 'No regreses muy tarde']
FROM neighborhoods WHERE name = 'Xochimilco' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.0, 8.5, 7.5, 8.0, ARRAY['Zona residencial tranquila', 'Parques seguros', 'Buena conectividad en metro']
FROM neighborhoods WHERE name = 'Del Valle' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.5, 8.0, 7.0, 7.5, ARRAY['Barrio clasico y seguro', 'Taquerias nocturnas concurridas', 'Metro cercano']
FROM neighborhoods WHERE name = 'Narvarte' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.5, 9.0, 7.5, 8.8, ARRAY['Zona turistica muy segura', 'Bazar del Sabado bien vigilado', 'Camina con tranquilidad']
FROM neighborhoods WHERE name = 'San Angel' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 6.0, 7.0, 4.5, 5.5, ARRAY['Precaucion general recomendada', 'Evita caminar solo de noche', 'Usa taxi de aplicacion']
FROM neighborhoods WHERE name = 'Doctores' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.3, 8.8, 7.5, 8.5, ARRAY['Zona de hoteles y negocios muy segura', 'Vida nocturna vigilada', 'Buena iluminacion']
FROM neighborhoods WHERE name = 'Juarez' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.3, 8.0, 6.5, 7.0, ARRAY['Barrio en proceso de renovacion', 'Kiosco Morisco seguro de dia', 'Precaucion en calles alejadas']
FROM neighborhoods WHERE name = 'Santa Maria la Ribera' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.5, 8.0, 7.0, 7.8, ARRAY['Zona de entretenimiento vigilada', 'Precaucion al salir de bares', 'Usa taxi de app de noche']
FROM neighborhoods WHERE name = 'Zona Rosa' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 6.8, 7.5, 5.5, 6.5, ARRAY['Seguridad reforzada en dias de partido', 'Usa transporte oficial del estadio', 'No camines solo por la zona']
FROM neighborhoods WHERE name = 'Estadio Azteca' AND city = 'CDMX';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.5, 8.8, 8.0, 8.5, ARRAY['Zona residencial muy tranquila', 'Calles bien iluminadas', 'Poco transito peatonal']
FROM neighborhoods WHERE name = 'Pedregal' AND city = 'CDMX';

-- GDL Safety Scores
INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.5, 8.0, 6.8, 7.5, ARRAY['Centro religioso muy visitado', 'Precaucion en calles laterales', 'Buena presencia policial']
FROM neighborhoods WHERE name = 'Zapopan Centro' AND city = 'GDL';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.0, 8.5, 7.5, 8.5, ARRAY['Zona de bares bien vigilada', 'Caminar es seguro de dia', 'Usa app de taxi de noche']
FROM neighborhoods WHERE name = 'Chapultepec GDL' AND city = 'GDL';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.5, 8.5, 6.5, 7.8, ARRAY['Zona turistica con vigilancia', 'Mercados seguros de dia', 'Precaucion en la noche']
FROM neighborhoods WHERE name = 'Centro Historico GDL' AND city = 'GDL';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.0, 8.8, 7.0, 8.5, ARRAY['Pueblo Magico muy seguro', 'Perfecto para caminar de dia', 'Eventos nocturnos vigilados']
FROM neighborhoods WHERE name = 'Tlaquepaque' AND city = 'GDL';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.5, 9.0, 8.0, 8.5, ARRAY['Zona exclusiva muy segura', 'Vigilancia privada', 'Excelente para familias']
FROM neighborhoods WHERE name = 'Providencia' AND city = 'GDL';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.0, 8.5, 7.5, 8.0, ARRAY['Barrio cultural muy caminable', 'Cafes abiertos hasta tarde', 'Zona bien iluminada']
FROM neighborhoods WHERE name = 'Americana' AND city = 'GDL';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.2, 8.5, 7.8, 8.0, ARRAY['Colonia familiar muy segura', 'Parque central vigilado', 'Ideal para caminar']
FROM neighborhoods WHERE name = 'Chapalita' AND city = 'GDL';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.0, 7.5, 6.0, 7.0, ARRAY['Seguridad reforzada en eventos', 'Usa transporte oficial', 'Zona con poco caminar']
FROM neighborhoods WHERE name = 'Estadio Akron' AND city = 'GDL';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.8, 8.5, 7.0, 8.0, ARRAY['Barrio bohemio en crecimiento', 'Mercados diurnos seguros', 'Murales accesibles']
FROM neighborhoods WHERE name = 'Santa Tere' AND city = 'GDL';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.0, 8.5, 7.5, 8.0, ARRAY['Zona trendy y segura', 'Restaurantes abiertos tarde', 'Buena iluminacion']
FROM neighborhoods WHERE name = 'Colonia Lafayette' AND city = 'GDL';

-- MTY Safety Scores
INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 9.0, 9.5, 8.5, 9.2, ARRAY['Municipio mas seguro de la zona metropolitana', 'Vigilancia privada extensa', 'Excelente para familias y turistas']
FROM neighborhoods WHERE name = 'San Pedro' AND city = 'MTY';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.5, 8.0, 7.0, 7.8, ARRAY['Zona de bares con vigilancia', 'Mas activo los fines de semana', 'Usa taxi de app al salir']
FROM neighborhoods WHERE name = 'Barrio Antiguo' AND city = 'MTY';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.0, 8.0, 6.0, 7.0, ARRAY['Macroplaza bien vigilada', 'Precaucion en zonas alejadas', 'Metro cercano y funcional']
FROM neighborhoods WHERE name = 'Centro MTY' AND city = 'MTY';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.5, 9.0, 8.0, 8.5, ARRAY['Zona moderna y segura', 'Centros comerciales vigilados', 'Transporte privado recomendado']
FROM neighborhoods WHERE name = 'Valle Oriente' AND city = 'MTY';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 6.8, 7.5, 6.0, 6.5, ARRAY['Zona residencial tranquila', 'Precaucion general de noche', 'Usa transporte privado']
FROM neighborhoods WHERE name = 'Guadalupe' AND city = 'MTY';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.0, 8.5, 7.5, 7.8, ARRAY['Zona familiar y segura', 'Plazas comerciales vigiladas', 'Calles residenciales tranquilas']
FROM neighborhoods WHERE name = 'Cumbres' AND city = 'MTY';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.2, 8.5, 7.8, 8.0, ARRAY['Colonia universitaria segura', 'Buen ambiente de dia y noche', 'Restaurantes abiertos tarde']
FROM neighborhoods WHERE name = 'Del Valle MTY' AND city = 'MTY';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.2, 7.5, 6.5, 7.0, ARRAY['Seguridad reforzada en partidos', 'Usa transporte oficial', 'Zona industrial en transicion']
FROM neighborhoods WHERE name = 'Estadio BBVA' AND city = 'MTY';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 8.0, 8.5, 7.5, 8.2, ARRAY['Parque recreativo bien vigilado', 'Eventos con seguridad', 'Zona peatonal amplia']
FROM neighborhoods WHERE name = 'Fundidora' AND city = 'MTY';

INSERT INTO neighborhood_safety_scores (neighborhood_id, overall_score, day_score, night_score, tourist_score, tips)
SELECT id, 7.5, 8.0, 7.0, 7.5, ARRAY['Zona historica tranquila', 'Mirador seguro de dia', 'Precaucion en calles secundarias']
FROM neighborhoods WHERE name = 'Obispado' AND city = 'MTY';
