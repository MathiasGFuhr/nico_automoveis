-- =====================================================
-- VERIFICAR E CRIAR VENDEDORES - NICO AUTOMÓVEIS
-- =====================================================
-- Este script verifica e cria vendedores na tabela users

-- =====================================================
-- VERIFICAR USUÁRIOS EXISTENTES
-- =====================================================
-- Mostrar todos os usuários
SELECT 
    id,
    name,
    email,
    role,
    created_at
FROM users 
ORDER BY role, name;

-- Contar usuários por role
SELECT 
    role,
    COUNT(*) as total
FROM users 
GROUP BY role
ORDER BY role;

-- =====================================================
-- VERIFICAR VENDEDORES ESPECÍFICOS
-- =====================================================
-- Verificar se existem vendedores
SELECT 
    'Vendedores existentes:' as info,
    COUNT(*) as total
FROM users 
WHERE role = 'seller';

-- Mostrar vendedores
SELECT 
    id,
    name,
    email,
    role,
    created_at
FROM users 
WHERE role = 'seller'
ORDER BY name;

-- =====================================================
-- CRIAR VENDEDORES SE NÃO EXISTIREM
-- =====================================================
-- Inserir vendedores se não existirem
INSERT INTO users (id, name, email, role, phone)
SELECT * FROM (VALUES
  ('770e8400-e29b-41d4-a716-446655440001'::uuid, 'Nico', 'nico@nicoautomoveis.com', 'seller', '(55) 9 9999-9999'),
  ('770e8400-e29b-41d4-a716-446655440002'::uuid, 'Lucas', 'lucas@nicoautomoveis.com', 'seller', '(55) 9 8888-8888'),
  ('770e8400-e29b-41d4-a716-446655440003'::uuid, 'Maria', 'maria@nicoautomoveis.com', 'seller', '(55) 9 7777-7777')
) AS v(id, name, email, role, phone)
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = v.email);

-- =====================================================
-- VERIFICAR VENDEDORES CRIADOS
-- =====================================================
-- Mostrar vendedores após inserção
SELECT 
    'Vendedores após inserção:' as info,
    COUNT(*) as total
FROM users 
WHERE role = 'seller';

-- Mostrar lista de vendedores
SELECT 
    id,
    name,
    email,
    phone,
    role,
    created_at
FROM users 
WHERE role = 'seller'
ORDER BY name;

-- =====================================================
-- TESTAR BUSCA DE VENDEDORES
-- =====================================================
-- Simular a query do SellerService
SELECT 
    id,
    name,
    email,
    role
FROM users
WHERE role = 'seller'
ORDER BY name;

-- =====================================================
-- VERIFICAR RLS PARA USERS
-- =====================================================
-- Verificar políticas RLS da tabela users
SELECT 
    policyname,
    cmd,
    roles,
    permissive,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- =====================================================
-- RESUMO
-- =====================================================
SELECT '🎉 Vendedores configurados com sucesso!' as status;
SELECT '📊 Total de vendedores:' as info, COUNT(*) as total FROM users WHERE role = 'seller';
SELECT '👥 Total de usuários:' as info, COUNT(*) as total FROM users;
