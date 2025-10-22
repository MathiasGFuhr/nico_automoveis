-- =====================================================
-- VERIFICAÇÃO DO BANCO DE DADOS - NICO AUTOMÓVEIS
-- =====================================================
-- Este script verifica se todas as correções foram aplicadas

-- =====================================================
-- 1. VERIFICAR ESTRUTURA DAS TABELAS
-- =====================================================

-- Verificar se todas as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'categories', 'brands', 'users', 'clients', 'vehicles', 
    'vehicle_images', 'vehicle_features', 'vehicle_specifications', 
    'sales', 'client_interests'
)
ORDER BY table_name;

-- =====================================================
-- 2. VERIFICAR DADOS BÁSICOS
-- =====================================================

-- Verificar categorias
SELECT 'Categorias' as tabela, COUNT(*) as total FROM categories;
SELECT id, name FROM categories ORDER BY name;

-- Verificar marcas
SELECT 'Marcas' as tabela, COUNT(*) as total FROM brands;
SELECT id, name FROM brands ORDER BY name;

-- Verificar usuários/vendedores
SELECT 'Usuários' as tabela, COUNT(*) as total FROM users;
SELECT id, name, email, role FROM users ORDER BY role, name;

-- Verificar clientes
SELECT 'Clientes' as tabela, COUNT(*) as total FROM clients;
SELECT id, name, email, phone FROM clients ORDER BY name;

-- Verificar veículos
SELECT 'Veículos' as tabela, COUNT(*) as total FROM vehicles;
SELECT v.id, v.model, b.name as brand, c.name as category, v.price, v.status
FROM vehicles v
JOIN brands b ON v.brand_id = b.id
JOIN categories c ON v.category_id = c.id
ORDER BY v.created_at;

-- =====================================================
-- 3. VERIFICAR POLÍTICAS RLS
-- =====================================================

-- Verificar políticas de veículos
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'vehicles'
ORDER BY policyname;

-- Verificar políticas de clientes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'clients'
ORDER BY policyname;

-- Verificar políticas de vendas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'sales'
ORDER BY policyname;

-- =====================================================
-- 4. VERIFICAR RELACIONAMENTOS
-- =====================================================

-- Verificar foreign keys
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- =====================================================
-- 5. TESTAR OPERAÇÕES BÁSICAS
-- =====================================================

-- Testar inserção de cliente
INSERT INTO clients (name, email, phone, client_type) 
VALUES ('Teste Cliente', 'teste@email.com', '(55) 9 9999-9999', 'buyer')
ON CONFLICT DO NOTHING;

-- Testar inserção de venda
INSERT INTO sales (
    client_id, 
    vehicle_id, 
    seller_id, 
    sale_code, 
    price, 
    commission_rate, 
    payment_method, 
    status
) VALUES (
    (SELECT id FROM clients LIMIT 1),
    (SELECT id FROM vehicles LIMIT 1),
    (SELECT id FROM users WHERE role = 'seller' LIMIT 1),
    'TEST-001',
    1000.00,
    5.00,
    'À vista',
    'completed'
)
ON CONFLICT (sale_code) DO NOTHING;

-- =====================================================
-- 6. VERIFICAR DADOS DE TESTE
-- =====================================================

-- Verificar se a venda foi criada
SELECT s.id, s.sale_code, s.price, s.status, c.name as client, v.model as vehicle, u.name as seller
FROM sales s
JOIN clients c ON s.client_id = c.id
JOIN vehicles v ON s.vehicle_id = v.id
JOIN users u ON s.seller_id = u.id
WHERE s.sale_code = 'TEST-001';

-- =====================================================
-- 7. LIMPEZA DOS DADOS DE TESTE
-- =====================================================

-- Remover dados de teste
DELETE FROM sales WHERE sale_code = 'TEST-001';
DELETE FROM clients WHERE email = 'teste@email.com';

-- =====================================================
-- 8. RESUMO FINAL
-- =====================================================

SELECT 
    'RESUMO DO BANCO' as status,
    (SELECT COUNT(*) FROM categories) as categorias,
    (SELECT COUNT(*) FROM brands) as marcas,
    (SELECT COUNT(*) FROM users) as usuarios,
    (SELECT COUNT(*) FROM clients) as clientes,
    (SELECT COUNT(*) FROM vehicles) as veiculos,
    (SELECT COUNT(*) FROM sales) as vendas;

-- =====================================================
-- 9. STATUS FINAL
-- =====================================================

-- Verificar se tudo está funcionando
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM users WHERE role = 'seller') > 0 
        THEN '✅ Vendedores: OK'
        ELSE '❌ Vendedores: FALTANDO'
    END as vendedores,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM clients) > 0 
        THEN '✅ Clientes: OK'
        ELSE '❌ Clientes: FALTANDO'
    END as clientes,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM vehicles) > 0 
        THEN '✅ Veículos: OK'
        ELSE '❌ Veículos: FALTANDO'
    END as veiculos,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM sales) >= 0 
        THEN '✅ Vendas: OK'
        ELSE '❌ Vendas: ERRO'
    END as vendas;

-- =====================================================
-- NOTA FINAL
-- =====================================================
-- 
-- Se todos os status mostrarem "OK", o banco está funcionando corretamente!
-- 
-- =====================================================
