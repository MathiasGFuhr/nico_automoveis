-- =====================================================
-- VERIFICAR E CRIAR DADOS INICIAIS - NICO AUTOMÓVEIS
-- =====================================================
-- Este script verifica se os dados iniciais existem e os cria se necessário

-- =====================================================
-- VERIFICAR CATEGORIAS
-- =====================================================
-- Verificar se existem categorias
SELECT 'Categorias existentes:' as status, COUNT(*) as total FROM categories;

-- Se não existir nenhuma categoria, criar as básicas
INSERT INTO categories (id, name, description) 
SELECT * FROM (VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Sedan', 'Carros de 4 portas com porta-malas separado'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Hatchback', 'Carros compactos com porta traseira integrada'),
  ('550e8400-e29b-41d4-a716-446655440003', 'SUV', 'Veículos utilitários esportivos'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Pickup', 'Veículos de carga com caçamba'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Coupé', 'Carros esportivos de 2 portas'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Conversível', 'Carros com teto retrátil')
) AS v(id, name, description)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = v.name);

-- =====================================================
-- VERIFICAR MARCAS
-- =====================================================
-- Verificar se existem marcas
SELECT 'Marcas existentes:' as status, COUNT(*) as total FROM brands;

-- Se não existir nenhuma marca, criar as básicas
INSERT INTO brands (id, name, country) 
SELECT * FROM (VALUES
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
  ('660e8400-e29b-41d4-a716-446655440012', 'Renault', 'França')
) AS v(id, name, country)
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = v.name);

-- =====================================================
-- VERIFICAR USUÁRIOS
-- =====================================================
-- Verificar se existem usuários
SELECT 'Usuários existentes:' as status, COUNT(*) as total FROM users;

-- Se não existir nenhum usuário, criar o admin
INSERT INTO users (id, email, name, role, phone) 
SELECT * FROM (VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'admin@nicoautomoveis.com', 'Nico Administrador', 'admin', '(55) 9 9999-9999'),
  ('770e8400-e29b-41d4-a716-446655440002', 'lucas@nicoautomoveis.com', 'Lucas Vendedor', 'seller', '(55) 9 8888-8888'),
  ('770e8400-e29b-41d4-a716-446655440003', 'maria@nicoautomoveis.com', 'Maria Gerente', 'manager', '(55) 9 7777-7777')
) AS v(id, email, name, role, phone)
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = v.email);

-- =====================================================
-- VERIFICAR CLIENTES
-- =====================================================
-- Verificar se existem clientes
SELECT 'Clientes existentes:' as status, COUNT(*) as total FROM clients;

-- Se não existir nenhum cliente, criar alguns de exemplo
INSERT INTO clients (id, name, email, phone, cpf, city, state, client_type, status, rating) 
SELECT * FROM (VALUES
  ('880e8400-e29b-41d4-a716-446655440001', 'João Silva', 'joao.silva@email.com', '(55) 9 9999-9999', '123.456.789-00', 'Santo Cristo', 'RS', 'buyer', 'active', 5),
  ('880e8400-e29b-41d4-a716-446655440002', 'Maria Santos', 'maria.santos@email.com', '(55) 9 8888-8888', '987.654.321-00', 'Santa Rosa', 'RS', 'prospect', 'interested', 4),
  ('880e8400-e29b-41d4-a716-446655440003', 'Pedro Oliveira', 'pedro.oliveira@email.com', '(55) 9 7777-7777', '456.789.123-00', 'Santo Cristo', 'RS', 'buyer', 'active', 5),
  ('880e8400-e29b-41d4-a716-446655440004', 'Ana Costa', 'ana.costa@email.com', '(55) 9 6666-6666', '789.123.456-00', 'Ijuí', 'RS', 'seller', 'active', 5)
) AS v(id, name, email, phone, cpf, city, state, client_type, status, rating)
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE email = v.email);

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
-- Mostrar resumo dos dados
SELECT 'RESUMO DOS DADOS:' as info;
SELECT 'Categorias:' as tabela, COUNT(*) as total FROM categories
UNION ALL
SELECT 'Marcas:' as tabela, COUNT(*) as total FROM brands
UNION ALL
SELECT 'Usuários:' as tabela, COUNT(*) as total FROM users
UNION ALL
SELECT 'Clientes:' as tabela, COUNT(*) as total FROM clients;

-- Mostrar algumas marcas e categorias
SELECT 'MARCAS DISPONÍVEIS:' as info;
SELECT id, name, country FROM brands ORDER BY name LIMIT 5;

SELECT 'CATEGORIAS DISPONÍVEIS:' as info;
SELECT id, name, description FROM categories ORDER BY name LIMIT 5;
