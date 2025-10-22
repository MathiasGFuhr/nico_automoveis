-- =====================================================
-- CRIAR VENDEDORES SIMPLES - NICO AUTOMÓVEIS
-- =====================================================
-- Este script cria vendedores de forma simples usando UUIDs automáticos

-- =====================================================
-- VERIFICAR VENDEDORES EXISTENTES
-- =====================================================
-- Mostrar vendedores existentes
SELECT 
    'Vendedores existentes:' as info,
    COUNT(*) as total
FROM users 
WHERE role = 'seller';

-- Mostrar lista de vendedores
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
-- CRIAR VENDEDORES
-- =====================================================
-- Inserir vendedores se não existirem
INSERT INTO users (name, email, role, phone)
SELECT 'Nico', 'nico@nicoautomoveis.com', 'seller', '(55) 9 9999-9999'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'nico@nicoautomoveis.com');

INSERT INTO users (name, email, role, phone)
SELECT 'Lucas', 'lucas@nicoautomoveis.com', 'seller', '(55) 9 8888-8888'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'lucas@nicoautomoveis.com');

INSERT INTO users (name, email, role, phone)
SELECT 'Maria', 'maria@nicoautomoveis.com', 'seller', '(55) 9 7777-7777'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'maria@nicoautomoveis.com');

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
SELECT '🎉 Vendedores criados com sucesso!' as status;
SELECT '📊 Total de vendedores:' as info, COUNT(*) as total FROM users WHERE role = 'seller';
SELECT '👥 Total de usuários:' as info, COUNT(*) as total FROM users;
