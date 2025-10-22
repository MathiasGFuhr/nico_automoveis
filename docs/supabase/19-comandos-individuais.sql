-- =====================================================
-- COMANDOS SQL INDIVIDUAIS - NICO AUTOMÓVEIS
-- =====================================================
-- Execute um comando por vez no SQL Editor do Supabase

-- =====================================================
-- COMANDO 1: Corrigir ID do administrador
-- =====================================================
UPDATE users 
SET id = '00000000-0000-0000-0000-000000000000'
WHERE email = 'admin@nicoautomoveis.com' 
AND id = '770e8400-e29b-41d4-a716-446655440000';

-- =====================================================
-- COMANDO 2: Corrigir ID do Lucas
-- =====================================================
UPDATE users 
SET id = '00000000-0000-0000-0000-000000000001'
WHERE email = 'lucas@nicoautomoveis.com' 
AND id = '770e8400-e29b-41d4-a716-446655440000';

-- =====================================================
-- COMANDO 3: Criar vendedor Nico
-- =====================================================
INSERT INTO users (id, name, email, role, phone, is_active, created_at, updated_at) VALUES
(
    '00000000-0000-0000-0000-000000000002',
    'Nico',
    'nico@nicoautomoveis.com',
    'seller',
    '(55) 9 9999-9999',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- =====================================================
-- COMANDO 4: Criar categorias básicas
-- =====================================================
INSERT INTO categories (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Não informado', 'Categoria padrão'),
('22222222-2222-2222-2222-222222222222', 'Sedan', 'Carros de 4 portas'),
('33333333-3333-3333-3333-333333333333', 'Hatchback', 'Carros compactos'),
('44444444-4444-4444-4444-444444444444', 'SUV', 'Veículos utilitários')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COMANDO 5: Criar marcas básicas
-- =====================================================
INSERT INTO brands (id, name, country) VALUES
('11111111-1111-1111-1111-111111111111', 'Não informado', 'Brasil'),
('22222222-2222-2222-2222-222222222222', 'Toyota', 'Japão'),
('33333333-3333-3333-3333-333333333333', 'Honda', 'Japão'),
('44444444-4444-4444-4444-444444444444', 'Volkswagen', 'Alemanha'),
('55555555-5555-5555-5555-555555555555', 'Ford', 'Estados Unidos'),
('66666666-6666-6666-6666-666666666666', 'Chevrolet', 'Estados Unidos')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COMANDO 6: Criar cliente João Silva
-- =====================================================
INSERT INTO clients (id, name, email, phone, cpf, city, state, client_type, status, rating) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'João Silva',
    'joao.silva@email.com',
    '(55) 9 9999-9999',
    '123.456.789-00',
    'Santo Cristo',
    'RS',
    'buyer',
    'active',
    5
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    cpf = EXCLUDED.cpf,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    client_type = EXCLUDED.client_type,
    status = EXCLUDED.status,
    rating = EXCLUDED.rating;

-- =====================================================
-- COMANDO 7: Criar cliente Maria Santos
-- =====================================================
INSERT INTO clients (id, name, email, phone, cpf, city, state, client_type, status, rating) VALUES
(
    '22222222-2222-2222-2222-222222222222',
    'Maria Santos',
    'maria.santos@email.com',
    '(55) 9 8888-8888',
    '987.654.321-00',
    'Santa Rosa',
    'RS',
    'buyer',
    'active',
    4
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    cpf = EXCLUDED.cpf,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    client_type = EXCLUDED.client_type,
    status = EXCLUDED.status,
    rating = EXCLUDED.rating;

-- =====================================================
-- COMANDO 8: Criar cliente Pedro Oliveira
-- =====================================================
INSERT INTO clients (id, name, email, phone, cpf, city, state, client_type, status, rating) VALUES
(
    '33333333-3333-3333-3333-333333333333',
    'Pedro Oliveira',
    'pedro.oliveira@email.com',
    '(55) 9 7777-7777',
    '456.789.123-00',
    'Santo Cristo',
    'RS',
    'buyer',
    'active',
    5
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    cpf = EXCLUDED.cpf,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    client_type = EXCLUDED.client_type,
    status = EXCLUDED.status,
    rating = EXCLUDED.rating;

-- =====================================================
-- COMANDO 9: Criar veículo Toyota Corolla
-- =====================================================
INSERT INTO vehicles (
    id, brand_id, category_id, model, year, price, mileage, fuel_type, 
    transmission, color, doors, city, state, plate_end, accepts_trade, 
    licensed, description, status, featured
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222', -- Toyota
    '22222222-2222-2222-2222-222222222222', -- Sedan
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
    'available',
    true
)
ON CONFLICT (id) DO UPDATE SET
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
-- COMANDO 10: Criar veículo Honda Civic
-- =====================================================
INSERT INTO vehicles (
    id, brand_id, category_id, model, year, price, mileage, fuel_type, 
    transmission, color, doors, city, state, plate_end, accepts_trade, 
    licensed, description, status, featured
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333', -- Honda
    '22222222-2222-2222-2222-222222222222', -- Sedan
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
    'available',
    true
)
ON CONFLICT (id) DO UPDATE SET
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
-- COMANDO 11: Criar veículo Volkswagen Golf
-- =====================================================
INSERT INTO vehicles (
    id, brand_id, category_id, model, year, price, mileage, fuel_type, 
    transmission, color, doors, city, state, plate_end, accepts_trade, 
    licensed, description, status, featured
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444', -- Volkswagen
    '33333333-3333-3333-3333-333333333333', -- Hatchback
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
    'available',
    false
)
ON CONFLICT (id) DO UPDATE SET
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
-- COMANDO 12: Criar imagem do Toyota Corolla
-- =====================================================
INSERT INTO vehicle_images (vehicle_id, image_url, alt_text, is_primary, sort_order) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
    'Toyota Corolla 2022 Branco',
    true,
    1
)
ON CONFLICT (vehicle_id, sort_order) DO UPDATE SET
    image_url = EXCLUDED.image_url,
    alt_text = EXCLUDED.alt_text,
    is_primary = EXCLUDED.is_primary;

-- =====================================================
-- COMANDO 13: Criar imagem do Honda Civic
-- =====================================================
INSERT INTO vehicle_images (vehicle_id, image_url, alt_text, is_primary, sort_order) VALUES
(
    '22222222-2222-2222-2222-222222222222',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    'Honda Civic 2021 Preto',
    true,
    1
)
ON CONFLICT (vehicle_id, sort_order) DO UPDATE SET
    image_url = EXCLUDED.image_url,
    alt_text = EXCLUDED.alt_text,
    is_primary = EXCLUDED.is_primary;

-- =====================================================
-- COMANDO 14: Criar imagem do Volkswagen Golf
-- =====================================================
INSERT INTO vehicle_images (vehicle_id, image_url, alt_text, is_primary, sort_order) VALUES
(
    '33333333-3333-3333-3333-333333333333',
    'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop',
    'Volkswagen Golf 2020 Prata',
    true,
    1
)
ON CONFLICT (vehicle_id, sort_order) DO UPDATE SET
    image_url = EXCLUDED.image_url,
    alt_text = EXCLUDED.alt_text,
    is_primary = EXCLUDED.is_primary;

-- =====================================================
-- COMANDO 15: Criar venda 1 (Nico vendeu Corolla para João)
-- =====================================================
INSERT INTO sales (
    id, client_id, vehicle_id, seller_id, sale_code, price, commission_rate, 
    payment_method, status, sale_date, notes
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111', -- João Silva
    '11111111-1111-1111-1111-111111111111', -- Toyota Corolla
    '00000000-0000-0000-0000-000000000002', -- Nico
    'VND-001',
    85000.00,
    5.00,
    'À vista',
    'completed',
    '2024-01-15',
    'Venda realizada com sucesso, cliente muito satisfeito.'
)
ON CONFLICT (id) DO UPDATE SET
    client_id = EXCLUDED.client_id,
    vehicle_id = EXCLUDED.vehicle_id,
    seller_id = EXCLUDED.seller_id,
    sale_code = EXCLUDED.sale_code,
    price = EXCLUDED.price,
    commission_rate = EXCLUDED.commission_rate,
    payment_method = EXCLUDED.payment_method,
    status = EXCLUDED.status,
    sale_date = EXCLUDED.sale_date,
    notes = EXCLUDED.notes;

-- =====================================================
-- COMANDO 16: Criar venda 2 (Lucas vendeu Civic para Maria)
-- =====================================================
INSERT INTO sales (
    id, client_id, vehicle_id, seller_id, sale_code, price, commission_rate, 
    payment_method, status, sale_date, notes
) VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222', -- Maria Santos
    '22222222-2222-2222-2222-222222222222', -- Honda Civic
    '00000000-0000-0000-0000-000000000001', -- Lucas
    'VND-002',
    92000.00,
    5.00,
    'Financiamento',
    'completed',
    '2024-01-12',
    'Venda financiada, cliente aprovado.'
)
ON CONFLICT (id) DO UPDATE SET
    client_id = EXCLUDED.client_id,
    vehicle_id = EXCLUDED.vehicle_id,
    seller_id = EXCLUDED.seller_id,
    sale_code = EXCLUDED.sale_code,
    price = EXCLUDED.price,
    commission_rate = EXCLUDED.commission_rate,
    payment_method = EXCLUDED.payment_method,
    status = EXCLUDED.status,
    sale_date = EXCLUDED.sale_date,
    notes = EXCLUDED.notes;

-- =====================================================
-- COMANDO 17: Criar venda 3 (Nico vendeu Golf para Pedro)
-- =====================================================
INSERT INTO sales (
    id, client_id, vehicle_id, seller_id, sale_code, price, commission_rate, 
    payment_method, status, sale_date, notes
) VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '33333333-3333-3333-3333-333333333333', -- Pedro Oliveira
    '33333333-3333-3333-3333-333333333333', -- Volkswagen Golf
    '00000000-0000-0000-0000-000000000002', -- Nico
    'VND-003',
    78000.00,
    5.00,
    'À vista',
    'pending',
    '2024-01-10',
    'Aguardando documentação para finalizar.'
)
ON CONFLICT (id) DO UPDATE SET
    client_id = EXCLUDED.client_id,
    vehicle_id = EXCLUDED.vehicle_id,
    seller_id = EXCLUDED.seller_id,
    sale_code = EXCLUDED.sale_code,
    price = EXCLUDED.price,
    commission_rate = EXCLUDED.commission_rate,
    payment_method = EXCLUDED.payment_method,
    status = EXCLUDED.status,
    sale_date = EXCLUDED.sale_date,
    notes = EXCLUDED.notes;

-- =====================================================
-- COMANDO 18: Verificar se tudo funcionou
-- =====================================================
SELECT 
    'VERIFICAÇÃO FINAL' as status,
    (SELECT COUNT(*) FROM users WHERE role = 'seller') as vendedores,
    (SELECT COUNT(*) FROM clients) as clientes,
    (SELECT COUNT(*) FROM vehicles) as veiculos,
    (SELECT COUNT(*) FROM sales) as vendas;

-- =====================================================
-- INSTRUÇÕES DE USO
-- =====================================================
-- 
-- 1. Execute os comandos na ordem (1, 2, 3, 4, 5...)
-- 2. Execute um comando por vez no SQL Editor
-- 3. Verifique se não há erros após cada comando
-- 4. O comando 18 mostra o resultado final
-- 
-- =====================================================
