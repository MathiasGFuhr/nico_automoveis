-- =====================================================
-- DADOS DE EXEMPLO PARA VEÍCULOS
-- =====================================================

-- Inserir dados de exemplo para testar descrição e características
-- Este script adiciona um veículo completo com descrição e características

-- =====================================================
-- INSERIR VEÍCULO DE EXEMPLO
-- =====================================================

-- Primeiro, vamos inserir um veículo com descrição e características
INSERT INTO vehicles (
  id,
  model,
  brand_id,
  category_id,
  year,
  price,
  mileage,
  fuel_type,
  transmission,
  color,
  doors,
  city,
  state,
  plate_end,
  accepts_trade,
  licensed,
  description,
  status,
  featured
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Corolla',
  (SELECT id FROM brands WHERE name = 'Toyota' LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Sedan' LIMIT 1),
  2022,
  85000,
  15000,
  'Flex',
  'Automático',
  'Prata',
  4,
  'Santo Cristo',
  'RS',
  '8',
  true,
  true,
  'Veículo em excelente estado de conservação, único dono, revisões em dia. Carro seminovo com poucos quilômetros rodados, ideal para quem busca conforto e economia. Motor 1.8 16V com excelente performance e baixo consumo de combustível.',
  'available',
  true
) ON CONFLICT (id) DO UPDATE SET
  model = EXCLUDED.model,
  brand_id = EXCLUDED.brand_id,
  category_id = EXCLUDED.category_id,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  mileage = EXCLUDED.mileage,
  fuel_type = EXCLUDED.fuel_type,
  transmission = EXCLUDED.transmission,
  color = EXCLUDED.color,
  doors = EXCLUDED.doors,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  plate_end = EXCLUDED.plate_end,
  accepts_trade = EXCLUDED.accepts_trade,
  licensed = EXCLUDED.licensed,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

-- =====================================================
-- INSERIR CARACTERÍSTICAS DO VEÍCULO
-- =====================================================

-- Inserir características para o veículo
INSERT INTO vehicle_features (vehicle_id, feature_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ar Condicionado'),
  ('11111111-1111-1111-1111-111111111111', 'Direção Hidráulica'),
  ('11111111-1111-1111-1111-111111111111', 'Vidros Elétricos'),
  ('11111111-1111-1111-1111-111111111111', 'Trava Elétrica'),
  ('11111111-1111-1111-1111-111111111111', 'Airbag Duplo'),
  ('11111111-1111-1111-1111-111111111111', 'ABS'),
  ('11111111-1111-1111-1111-111111111111', 'Freio a Disco'),
  ('11111111-1111-1111-1111-111111111111', 'Rádio CD/MP3'),
  ('11111111-1111-1111-1111-111111111111', 'Bluetooth'),
  ('11111111-1111-1111-1111-111111111111', 'Sensor de Estacionamento'),
  ('11111111-1111-1111-1111-111111111111', 'Ar Quente'),
  ('11111111-1111-1111-1111-111111111111', 'Desembaçador Traseiro'),
  ('11111111-1111-1111-1111-111111111111', 'Bancos de Couro'),
  ('11111111-1111-1111-1111-111111111111', 'Volante Multifuncional'),
  ('11111111-1111-1111-1111-111111111111', 'Controle de Estabilidade')
ON CONFLICT (vehicle_id, feature_name) DO NOTHING;

-- =====================================================
-- INSERIR ESPECIFICAÇÕES DO VEÍCULO
-- =====================================================

-- Inserir especificações técnicas
INSERT INTO vehicle_specifications (
  vehicle_id,
  motor,
  potencia,
  torque,
  combustivel,
  transmissao,
  tracao,
  consumo,
  aceleracao,
  velocidade,
  tanque,
  peso,
  comprimento,
  largura,
  altura,
  entre_eixos,
  porta_malas
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '1.8 16V',
  '132 cv',
  '17,5 kgfm',
  'Flex',
  'Automático CVT',
  'Dianteira',
  '14,2 km/l (etanol) / 16,8 km/l (gasolina)',
  '10,2 segundos (0-100 km/h)',
  '180 km/h',
  '55 litros',
  '1.320 kg',
  '4.630 mm',
  '1.780 mm',
  '1.435 mm',
  '2.700 mm',
  '470 litros'
) ON CONFLICT (vehicle_id) DO UPDATE SET
  motor = EXCLUDED.motor,
  potencia = EXCLUDED.potencia,
  torque = EXCLUDED.torque,
  combustivel = EXCLUDED.combustivel,
  transmissao = EXCLUDED.transmissao,
  tracao = EXCLUDED.tracao,
  consumo = EXCLUDED.consumo,
  aceleracao = EXCLUDED.aceleracao,
  velocidade = EXCLUDED.velocidade,
  tanque = EXCLUDED.tanque,
  peso = EXCLUDED.peso,
  comprimento = EXCLUDED.comprimento,
  largura = EXCLUDED.largura,
  altura = EXCLUDED.altura,
  entre_eixos = EXCLUDED.entre_eixos,
  porta_malas = EXCLUDED.porta_malas;

-- =====================================================
-- INSERIR IMAGEM DE EXEMPLO
-- =====================================================

-- Inserir uma imagem de exemplo (usando URL pública)
INSERT INTO vehicle_images (
  vehicle_id,
  image_url,
  alt_text,
  is_primary,
  sort_order
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
  'Toyota Corolla 2022 Prata',
  true,
  1
) ON CONFLICT (vehicle_id, sort_order) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  alt_text = EXCLUDED.alt_text,
  is_primary = EXCLUDED.is_primary;

-- Adicionar mais imagens
INSERT INTO vehicle_images (
  vehicle_id,
  image_url,
  alt_text,
  is_primary,
  sort_order
) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', 'Toyota Corolla - Vista Lateral', false, 2),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop', 'Toyota Corolla - Interior', false, 3),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', 'Toyota Corolla - Motor', false, 4)
ON CONFLICT (vehicle_id, sort_order) DO NOTHING;

-- =====================================================
-- VERIFICAR DADOS INSERIDOS
-- =====================================================

-- Verificar se o veículo foi inserido corretamente
SELECT 
  v.id,
  v.model,
  b.name as brand,
  c.name as category,
  v.year,
  v.price,
  v.description,
  v.status
FROM vehicles v
JOIN brands b ON v.brand_id = b.id
JOIN categories c ON v.category_id = c.id
WHERE v.id = '11111111-1111-1111-1111-111111111111';

-- Verificar características
SELECT 
  vf.feature_name,
  vf.created_at
FROM vehicle_features vf
WHERE vf.vehicle_id = '11111111-1111-1111-1111-111111111111'
ORDER BY vf.feature_name;

-- Verificar especificações
SELECT 
  vs.motor,
  vs.potencia,
  vs.torque,
  vs.combustivel,
  vs.transmissao
FROM vehicle_specifications vs
WHERE vs.vehicle_id = '11111111-1111-1111-1111-111111111111';

-- Verificar imagens
SELECT 
  vi.image_url,
  vi.alt_text,
  vi.is_primary,
  vi.sort_order
FROM vehicle_images vi
WHERE vi.vehicle_id = '11111111-1111-1111-1111-111111111111'
ORDER BY vi.sort_order;

-- =====================================================
-- NOTA IMPORTANTE
-- =====================================================
-- 
-- Este script cria um veículo de exemplo completo com:
-- ✅ Descrição detalhada
-- ✅ Características (features)
-- ✅ Especificações técnicas
-- ✅ Imagens de exemplo
-- 
-- Após executar este script, acesse:
-- http://localhost:3000/veiculos/11111111-1111-1111-1111-111111111111
-- 
-- Para ver o veículo com todos os dados preenchidos.
