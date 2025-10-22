-- =====================================================
-- DADOS INICIAIS - NICO AUTOMÓVEIS
-- =====================================================
-- Este arquivo contém os dados iniciais para popular o banco
-- com informações básicas e dados de exemplo.

-- =====================================================
-- CATEGORIAS DE VEÍCULOS
-- =====================================================
INSERT INTO categories (id, name, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sedan', 'Carros de 4 portas com porta-malas separado'),
('550e8400-e29b-41d4-a716-446655440002', 'Hatchback', 'Carros compactos com porta traseira integrada'),
('550e8400-e29b-41d4-a716-446655440003', 'SUV', 'Veículos utilitários esportivos'),
('550e8400-e29b-41d4-a716-446655440004', 'Pickup', 'Veículos de carga com caçamba'),
('550e8400-e29b-41d4-a716-446655440005', 'Coupé', 'Carros esportivos de 2 portas'),
('550e8400-e29b-41d4-a716-446655440006', 'Conversível', 'Carros com teto retrátil');

-- =====================================================
-- MARCAS DE VEÍCULOS
-- =====================================================
INSERT INTO brands (id, name, country) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Toyota', 'Japão'),
('660e8400-e29b-41d4-a716-446655440002', 'Honda', 'Japão'),
('660e8400-e29b-41d4-a716-446655440003', 'Volkswagen', 'Alemanha'),
('660e8400-e29b-41d4-a716-446655440004', 'Ford', 'Estados Unidos'),
('660e8400-e29b-41d4-a716-446655440005', 'Chevrolet', 'Estados Unidos'),
('660e8400-e29b-41d4-a716-446655440006', 'Fiat', 'Itália'),
('660e8400-e29b-41d4-a716-446655440007', 'BMW', 'Alemanha'),
('660e8400-e29b-41d4-a716-446655440008', 'Mercedes-Benz', 'Alemanha'),
('660e8400-e29b-41d4-a716-446655440009', 'Audi', 'Alemanha'),
('660e8400-e29b-41d4-a716-446655440010', 'Hyundai', 'Coreia do Sul'),
('660e8400-e29b-41d4-a716-446655440011', 'Nissan', 'Japão'),
('660e8400-e29b-41d4-a716-446655440012', 'Renault', 'França');

-- =====================================================
-- USUÁRIOS ADMINISTRATIVOS
-- =====================================================
INSERT INTO users (id, email, name, role, phone) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'admin@nicoautomoveis.com', 'Nico Administrador', 'admin', '(55) 9 9999-9999'),
('770e8400-e29b-41d4-a716-446655440002', 'lucas@nicoautomoveis.com', 'Lucas Vendedor', 'seller', '(55) 9 8888-8888'),
('770e8400-e29b-41d4-a716-446655440003', 'maria@nicoautomoveis.com', 'Maria Gerente', 'manager', '(55) 9 7777-7777');

-- =====================================================
-- CLIENTES DE EXEMPLO
-- =====================================================
INSERT INTO clients (id, name, email, phone, cpf, city, state, client_type, status, rating) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'João Silva', 'joao.silva@email.com', '(55) 9 9999-9999', '123.456.789-00', 'Santo Cristo', 'RS', 'buyer', 'active', 5),
('880e8400-e29b-41d4-a716-446655440002', 'Maria Santos', 'maria.santos@email.com', '(55) 9 8888-8888', '987.654.321-00', 'Santa Rosa', 'RS', 'prospect', 'interested', 4),
('880e8400-e29b-41d4-a716-446655440003', 'Pedro Oliveira', 'pedro.oliveira@email.com', '(55) 9 7777-7777', '456.789.123-00', 'Santo Cristo', 'RS', 'buyer', 'active', 5),
('880e8400-e29b-41d4-a716-446655440004', 'Ana Costa', 'ana.costa@email.com', '(55) 9 6666-6666', '789.123.456-00', 'Ijuí', 'RS', 'seller', 'active', 5);

-- =====================================================
-- VEÍCULOS DE EXEMPLO
-- =====================================================
INSERT INTO vehicles (
    id, brand_id, category_id, model, year, price, mileage, fuel_type, transmission, 
    color, doors, city, state, plate_end, accepts_trade, licensed, description, status
) VALUES
(
    '990e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001', -- Toyota
    '550e8400-e29b-41d4-a716-446655440001', -- Sedan
    'Corolla',
    2022,
    85000.00,
    15000,
    'Flex',
    'Automático',
    'Branco',
    4,
    'Santo Cristo',
    'RS',
    'AB',
    true,
    true,
    'Veículo em excelente estado, único dono, revisões em dia.',
    'available'
),
(
    '990e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440002', -- Honda
    '550e8400-e29b-41d4-a716-446655440001', -- Sedan
    'Civic',
    2021,
    92000.00,
    22000,
    'Flex',
    'Automático',
    'Preto',
    4,
    'Santo Cristo',
    'RS',
    'CD',
    true,
    true,
    'Honda Civic em perfeito estado, com todos os opcionais.',
    'sold'
),
(
    '990e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440003', -- Volkswagen
    '550e8400-e29b-41d4-a716-446655440002', -- Hatchback
    'Golf',
    2020,
    78000.00,
    35000,
    'Flex',
    'Manual',
    'Prata',
    5,
    'Santo Cristo',
    'RS',
    'EF',
    false,
    true,
    'Volkswagen Golf bem conservado, ideal para cidade.',
    'reserved'
),
(
    '990e8400-e29b-41d4-a716-446655440004',
    '660e8400-e29b-41d4-a716-446655440004', -- Ford
    '550e8400-e29b-41d4-a716-446655440001', -- Sedan
    'Focus',
    2021,
    65000.00,
    28000,
    'Flex',
    'Automático',
    'Azul',
    4,
    'Santo Cristo',
    'RS',
    'GH',
    true,
    true,
    'Ford Focus com excelente custo-benefício.',
    'available'
),
(
    '990e8400-e29b-41d4-a716-446655440005',
    '660e8400-e29b-41d4-a716-446655440005', -- Chevrolet
    '550e8400-e29b-41d4-a716-446655440002', -- Hatchback
    'Onix',
    2023,
    72000.00,
    12000,
    'Flex',
    'Automático',
    'Branco',
    4,
    'Santo Cristo',
    'RS',
    'IJ',
    true,
    true,
    'Chevrolet Onix seminovo, quase zero quilômetro.',
    'available'
),
(
    '990e8400-e29b-41d4-a716-446655440006',
    '660e8400-e29b-41d4-a716-446655440006', -- Fiat
    '550e8400-e29b-41d4-a716-446655440002', -- Hatchback
    'Argo',
    2022,
    68000.00,
    18000,
    'Flex',
    'Manual',
    'Vermelho',
    5,
    'Santo Cristo',
    'RS',
    'KL',
    false,
    true,
    'Fiat Argo com design moderno e economia de combustível.',
    'available'
),
(
    '990e8400-e29b-41d4-a716-446655440007',
    '660e8400-e29b-41d4-a716-446655440007', -- BMW
    '550e8400-e29b-41d4-a716-446655440001', -- Sedan
    'Série 3',
    2023,
    180000.00,
    8000,
    'Gasolina',
    'Automático',
    'Preto',
    4,
    'Santo Cristo',
    'RS',
    'MN',
    true,
    true,
    'BMW Série 3 de luxo, com todos os opcionais e tecnologia de ponta.',
    'available'
),
(
    '990e8400-e29b-41d4-a716-446655440008',
    '660e8400-e29b-41d4-a716-446655440003', -- Volkswagen
    '550e8400-e29b-41d4-a716-446655440003', -- SUV
    'Tiguan',
    2022,
    120000.00,
    25000,
    'Flex',
    'Automático',
    'Cinza',
    5,
    'Santo Cristo',
    'RS',
    'OP',
    true,
    true,
    'Volkswagen Tiguan SUV espaçoso e confortável para família.',
    'available'
);

-- =====================================================
-- IMAGENS DOS VEÍCULOS
-- =====================================================
INSERT INTO vehicle_images (vehicle_id, image_url, alt_text, is_primary, sort_order) VALUES
-- Toyota Corolla
('990e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', 'Toyota Corolla 2022 Branco', true, 1),
('990e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'Toyota Corolla 2022 Interior', false, 2),

-- Honda Civic
('990e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'Honda Civic 2021 Preto', true, 1),

-- Volkswagen Golf
('990e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800', 'Volkswagen Golf 2020 Prata', true, 1),

-- Ford Focus
('990e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 'Ford Focus 2021 Azul', true, 1),

-- Chevrolet Onix
('990e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'Chevrolet Onix 2023 Branco', true, 1),

-- Fiat Argo
('990e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', 'Fiat Argo 2022 Vermelho', true, 1),

-- BMW Série 3
('990e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'BMW Série 3 2023 Preto', true, 1),

-- Volkswagen Tiguan
('990e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800', 'Volkswagen Tiguan 2022 Cinza', true, 1);

-- =====================================================
-- CARACTERÍSTICAS DOS VEÍCULOS (OTIMIZADO)
-- =====================================================
-- Usando a função add_vehicle_feature para evitar duplicações

-- Toyota Corolla
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440001', 'feat-005'); -- Ar Condicionado
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440001', 'feat-006'); -- Direção Hidráulica
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440001', 'feat-001'); -- Freios ABS
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440001', 'feat-002'); -- Airbag

-- Honda Civic
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440002', 'feat-005'); -- Ar Condicionado
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440002', 'feat-006'); -- Direção Hidráulica
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440002', 'feat-001'); -- Freios ABS
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440002', 'feat-002'); -- Airbag
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440002', 'feat-010'); -- GPS

-- Volkswagen Golf
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440003', 'feat-005'); -- Ar Condicionado
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440003', 'feat-006'); -- Direção Hidráulica
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440003', 'feat-001'); -- Freios ABS

-- Ford Focus
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440004', 'feat-005'); -- Ar Condicionado
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440004', 'feat-006'); -- Direção Hidráulica
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440004', 'feat-001'); -- Freios ABS
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440004', 'feat-002'); -- Airbag
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440004', 'feat-012'); -- Som Premium

-- Chevrolet Onix
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440005', 'feat-005'); -- Ar Condicionado
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440005', 'feat-006'); -- Direção Hidráulica
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440005', 'feat-001'); -- Freios ABS
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440005', 'feat-002'); -- Airbag
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440005', 'feat-010'); -- GPS
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440005', 'feat-011'); -- Bluetooth

-- Fiat Argo
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440006', 'feat-005'); -- Ar Condicionado
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440006', 'feat-006'); -- Direção Hidráulica
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440006', 'feat-001'); -- Freios ABS

-- BMW Série 3
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440007', 'feat-005'); -- Ar Condicionado
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440007', 'feat-006'); -- Direção Hidráulica
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440007', 'feat-001'); -- Freios ABS
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440007', 'feat-002'); -- Airbag
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440007', 'feat-010'); -- GPS
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440007', 'feat-011'); -- Bluetooth
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440007', 'feat-008'); -- Teto Solar
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440007', 'feat-007'); -- Bancos de Couro

-- Volkswagen Tiguan
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440008', 'feat-005'); -- Ar Condicionado
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440008', 'feat-006'); -- Direção Hidráulica
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440008', 'feat-001'); -- Freios ABS
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440008', 'feat-002'); -- Airbag
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440008', 'feat-010'); -- GPS
SELECT add_vehicle_feature('990e8400-e29b-41d4-a716-446655440008', 'feat-004'); -- Câmera de Ré

-- =====================================================
-- ESPECIFICAÇÕES TÉCNICAS
-- =====================================================
INSERT INTO vehicle_specifications (
    vehicle_id, motor, potencia, torque, combustivel, transmissao, tracao, 
    consumo, aceleracao, velocidade, tanque, peso, comprimento, largura, 
    altura, entre_eixos, porta_malas
) VALUES
-- Toyota Corolla
('990e8400-e29b-41d4-a716-446655440001', '1.8L Flex', '139 cv', '17,9 kgfm', 'Flex', 'CVT', 'Dianteira', '14,2 km/l', '10,2s', '180 km/h', '50L', '1.320 kg', '4.630 mm', '1.780 mm', '1.435 mm', '2.700 mm', '470L'),

-- Honda Civic
('990e8400-e29b-41d4-a716-446655440002', '1.5L Turbo', '173 cv', '22,4 kgfm', 'Flex', 'CVT', 'Dianteira', '13,8 km/l', '8,5s', '200 km/h', '47L', '1.350 kg', '4.650 mm', '1.800 mm', '1.415 mm', '2.700 mm', '420L'),

-- Volkswagen Golf
('990e8400-e29b-41d4-a716-446655440003', '1.4L TSI', '150 cv', '25,5 kgfm', 'Flex', 'Manual', 'Dianteira', '12,5 km/l', '9,2s', '210 km/h', '50L', '1.280 kg', '4.255 mm', '1.790 mm', '1.456 mm', '2.620 mm', '380L'),

-- Ford Focus
('990e8400-e29b-41d4-a716-446655440004', '2.0L Flex', '170 cv', '20,4 kgfm', 'Flex', 'Automático', 'Dianteira', '11,8 km/l', '9,8s', '195 km/h', '55L', '1.340 kg', '4.538 mm', '1.823 mm', '1.484 mm', '2.648 mm', '440L'),

-- Chevrolet Onix
('990e8400-e29b-41d4-a716-446655440005', '1.0L Turbo', '116 cv', '16,3 kgfm', 'Flex', 'Automático', 'Dianteira', '15,2 km/l', '11,2s', '175 km/h', '45L', '1.100 kg', '3.998 mm', '1.735 mm', '1.450 mm', '2.520 mm', '320L'),

-- Fiat Argo
('990e8400-e29b-41d4-a716-446655440006', '1.3L Flex', '109 cv', '14,2 kgfm', 'Flex', 'Manual', 'Dianteira', '14,8 km/l', '11,8s', '170 km/h', '48L', '1.080 kg', '3.999 mm', '1.740 mm', '1.500 mm', '2.520 mm', '300L'),

-- BMW Série 3
('990e8400-e29b-41d4-a716-446655440007', '2.0L Turbo', '258 cv', '40,8 kgfm', 'Gasolina', 'Automático', 'Traseira', '9,8 km/l', '5,8s', '250 km/h', '59L', '1.620 kg', '4.709 mm', '1.827 mm', '1.442 mm', '2.851 mm', '480L'),

-- Volkswagen Tiguan
('990e8400-e29b-41d4-a716-446655440008', '2.0L TSI', '220 cv', '35,7 kgfm', 'Flex', 'Automático', 'Integral', '10,5 km/l', '7,2s', '220 km/h', '58L', '1.750 kg', '4.509 mm', '1.839 mm', '1.673 mm', '2.680 mm', '615L');

-- =====================================================
-- VENDAS DE EXEMPLO
-- =====================================================
INSERT INTO sales (
    id, client_id, vehicle_id, seller_id, sale_code, price, commission_rate, 
    payment_method, status, sale_date, notes
) VALUES
(
    'aa0e8400-e29b-41d4-a716-446655440001',
    '880e8400-e29b-41d4-a716-446655440001', -- João Silva
    '990e8400-e29b-41d4-a716-446655440001', -- Toyota Corolla
    '770e8400-e29b-41d4-a716-446655440001', -- Nico
    'V001',
    85000.00,
    5.00,
    'Financiamento',
    'completed',
    '2024-01-15',
    'Venda realizada com sucesso, cliente muito satisfeito.'
),
(
    'aa0e8400-e29b-41d4-a716-446655440002',
    '880e8400-e29b-41d4-a716-446655440002', -- Maria Santos
    '990e8400-e29b-41d4-a716-446655440002', -- Honda Civic
    '770e8400-e29b-41d4-a716-446655440002', -- Lucas
    'V002',
    92000.00,
    5.00,
    'À vista',
    'pending',
    '2024-01-12',
    'Aguardando documentação para finalizar.'
),
(
    'aa0e8400-e29b-41d4-a716-446655440003',
    '880e8400-e29b-41d4-a716-446655440003', -- Pedro Oliveira
    '990e8400-e29b-41d4-a716-446655440003', -- Volkswagen Golf
    '770e8400-e29b-41d4-a716-446655440001', -- Nico
    'V003',
    78000.00,
    5.00,
    'Financiamento',
    'cancelled',
    '2024-01-08',
    'Cliente desistiu da compra por questões financeiras.'
),
(
    'aa0e8400-e29b-41d4-a716-446655440004',
    '880e8400-e29b-41d4-a716-446655440004', -- Ana Costa
    '990e8400-e29b-41d4-a716-446655440004', -- Ford Focus
    '770e8400-e29b-41d4-a716-446655440002', -- Lucas
    'V004',
    65000.00,
    5.00,
    'À vista',
    'completed',
    '2024-01-05',
    'Venda rápida, cliente já conhecia o veículo.'
);

-- =====================================================
-- INTERESSES DE CLIENTES
-- =====================================================
INSERT INTO client_interests (client_id, vehicle_id, interest_level, notes) VALUES
('880e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440005', 'high', 'Cliente muito interessado no Chevrolet Onix'),
('880e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440007', 'medium', 'Interessado em veículos de luxo'),
('880e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440008', 'high', 'Procurando SUV para família');
