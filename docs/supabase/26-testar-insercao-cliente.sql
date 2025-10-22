-- =====================================================
-- TESTAR INSERÇÃO DE CLIENTE - NICO AUTOMÓVEIS
-- =====================================================
-- Este script testa a inserção de um cliente para verificar se RLS está funcionando

-- =====================================================
-- VERIFICAR POLÍTICAS ATIVAS
-- =====================================================
-- Mostrar políticas atuais
SELECT 
    policyname,
    cmd,
    roles,
    permissive,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'clients'
ORDER BY cmd, policyname;

-- =====================================================
-- VERIFICAR RLS ATIVO
-- =====================================================
-- Verificar se RLS está ativo
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'clients';

-- =====================================================
-- TESTAR INSERÇÃO DIRETA
-- =====================================================
-- Tentar inserir um cliente de teste
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
    'João Silva Teste',
    'joao.teste@example.com',
    '(55) 9 9999-9999',
    '123.456.789-00',
    'Santo Cristo',
    'RS',
    'buyer',
    'active',
    5
);

-- =====================================================
-- VERIFICAR SE FOI INSERIDO
-- =====================================================
-- Contar clientes
SELECT 'Total de clientes após inserção:' as info, COUNT(*) as total FROM clients;

-- Mostrar cliente inserido
SELECT 
    id,
    name,
    email,
    phone,
    client_type,
    status,
    created_at
FROM clients 
WHERE email = 'joao.teste@example.com';

-- =====================================================
-- TESTAR BUSCA
-- =====================================================
-- Testar se consegue buscar clientes
SELECT 
    'Teste de busca:' as info,
    COUNT(*) as total,
    STRING_AGG(name, ', ') as nomes
FROM clients;

-- =====================================================
-- LIMPAR DADOS DE TESTE
-- =====================================================
-- Remover cliente de teste
DELETE FROM clients WHERE email = 'joao.teste@example.com';

-- Verificar limpeza
SELECT 'Clientes após limpeza:' as info, COUNT(*) as total FROM clients;

-- =====================================================
-- RESUMO
-- =====================================================
SELECT '🎉 Teste de inserção de cliente concluído!' as status;
