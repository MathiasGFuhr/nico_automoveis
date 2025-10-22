-- =====================================================
-- VERIFICAR CONSTRAINT CLIENT_TYPE - NICO AUTOMÓVEIS
-- =====================================================
-- Este script verifica os valores válidos para client_type

-- =====================================================
-- VERIFICAR CONSTRAINT
-- =====================================================
-- Mostrar constraints da tabela clients
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'clients'
    AND tc.constraint_type = 'CHECK';

-- =====================================================
-- VERIFICAR VALORES VÁLIDOS
-- =====================================================
-- Mostrar valores únicos de client_type existentes
SELECT DISTINCT client_type, COUNT(*) as total
FROM clients 
GROUP BY client_type
ORDER BY client_type;

-- =====================================================
-- TESTAR VALORES VÁLIDOS
-- =====================================================
-- Testar inserção com valores válidos
INSERT INTO clients (
    name, 
    email, 
    phone, 
    cpf, 
    city, 
    state, 
    client_type, 
    status, 
    rating
) VALUES (
    'Teste Buyer',
    'buyer@test.com',
    '(55) 9 1111-1111',
    '111.111.111-11',
    'Santo Cristo',
    'RS',
    'buyer',
    'active',
    5
);

INSERT INTO clients (
    name, 
    email, 
    phone, 
    cpf, 
    city, 
    state, 
    client_type, 
    status, 
    rating
) VALUES (
    'Teste Seller',
    'seller@test.com',
    '(55) 9 2222-2222',
    '222.222.222-22',
    'Santo Cristo',
    'RS',
    'seller',
    'active',
    5
);

INSERT INTO clients (
    name, 
    email, 
    phone, 
    cpf, 
    city, 
    state, 
    client_type, 
    status, 
    rating
) VALUES (
    'Teste Prospect',
    'prospect@test.com',
    '(55) 9 3333-3333',
    '333.333.333-33',
    'Santo Cristo',
    'RS',
    'prospect',
    'active',
    5
);

-- =====================================================
-- VERIFICAR INSERÇÕES
-- =====================================================
-- Mostrar clientes inseridos
SELECT 
    name,
    email,
    client_type,
    status,
    created_at
FROM clients 
WHERE email LIKE '%@test.com'
ORDER BY created_at DESC;

-- =====================================================
-- LIMPAR DADOS DE TESTE
-- =====================================================
-- Remover clientes de teste
DELETE FROM clients WHERE email LIKE '%@test.com';

-- =====================================================
-- RESUMO
-- =====================================================
SELECT '✅ Valores válidos para client_type: buyer, seller, prospect' as info;
SELECT '📊 Total de clientes após teste:' as info, COUNT(*) as total FROM clients;
