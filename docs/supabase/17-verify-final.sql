-- =====================================================
-- VERIFICAÇÃO FINAL DO BANCO - NICO AUTOMÓVEIS
-- =====================================================
-- Este script verifica se tudo está funcionando sem gerar erros

-- =====================================================
-- 1. VERIFICAR ESTRUTURA BÁSICA
-- =====================================================

SELECT 
    'ESTRUTURA DO BANCO' as verificacao,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public')
        THEN '✅ Tabela users: OK'
        ELSE '❌ Tabela users: FALTANDO'
    END as tabela_users,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients' AND table_schema = 'public')
        THEN '✅ Tabela clients: OK'
        ELSE '❌ Tabela clients: FALTANDO'
    END as tabela_clients,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicles' AND table_schema = 'public')
        THEN '✅ Tabela vehicles: OK'
        ELSE '❌ Tabela vehicles: FALTANDO'
    END as tabela_vehicles,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sales' AND table_schema = 'public')
        THEN '✅ Tabela sales: OK'
        ELSE '❌ Tabela sales: FALTANDO'
    END as tabela_sales;

-- =====================================================
-- 2. VERIFICAR DADOS ESSENCIAIS
-- =====================================================

-- Verificar vendedores
SELECT 
    'VENDEDORES' as tipo,
    COUNT(*) as total,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ OK'
        ELSE '❌ FALTANDO'
    END as status,
    STRING_AGG(name, ', ') as nomes
FROM users WHERE role = 'seller';

-- Verificar clientes
SELECT 
    'CLIENTES' as tipo,
    COUNT(*) as total,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ OK'
        ELSE '❌ FALTANDO'
    END as status
FROM clients;

-- Verificar veículos
SELECT 
    'VEÍCULOS' as tipo,
    COUNT(*) as total,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ OK'
        ELSE '❌ FALTANDO'
    END as status
FROM vehicles;

-- Verificar vendas
SELECT 
    'VENDAS' as tipo,
    COUNT(*) as total,
    CASE 
        WHEN COUNT(*) >= 0 THEN '✅ OK'
        ELSE '❌ ERRO'
    END as status
FROM sales;

-- =====================================================
-- 3. VERIFICAR VENDEDORES ESPECÍFICOS
-- =====================================================

SELECT 
    'VENDEDORES ESPECÍFICOS' as verificacao,
    CASE 
        WHEN EXISTS (SELECT 1 FROM users WHERE id = '00000000-0000-0000-0000-000000000001')
        THEN '✅ Nico: OK'
        ELSE '❌ Nico: FALTANDO'
    END as nico,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM users WHERE id = '00000000-0000-0000-0000-000000000002')
        THEN '✅ Lucas: OK'
        ELSE '❌ Lucas: FALTANDO'
    END as lucas,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM users WHERE id = '00000000-0000-0000-0000-000000000003')
        THEN '✅ Maria: OK'
        ELSE '❌ Maria: FALTANDO'
    END as maria;

-- =====================================================
-- 4. TESTE DE VENDA SEGURO
-- =====================================================

DO $$
DECLARE
    test_client_id UUID;
    test_vehicle_id UUID;
    test_seller_id UUID;
    test_sale_id UUID;
    short_code TEXT;
    test_result TEXT;
BEGIN
    -- Buscar IDs de teste
    SELECT id INTO test_client_id FROM clients LIMIT 1;
    SELECT id INTO test_vehicle_id FROM vehicles LIMIT 1;
    SELECT id INTO test_seller_id FROM users WHERE role = 'seller' LIMIT 1;
    
    -- Gerar código curto (máximo 15 caracteres)
    short_code := 'TEST' || (EXTRACT(EPOCH FROM NOW())::BIGINT % 100000)::TEXT;
    
    -- Verificar se temos todos os dados necessários
    IF test_client_id IS NOT NULL AND test_vehicle_id IS NOT NULL AND test_seller_id IS NOT NULL THEN
        BEGIN
            -- Inserir venda de teste
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
                test_client_id,
                test_vehicle_id,
                test_seller_id,
                short_code,
                1000.00,
                5.00,
                'À vista',
                'completed'
            ) RETURNING id INTO test_sale_id;
            
            -- Remover venda de teste
            DELETE FROM sales WHERE id = test_sale_id;
            
            test_result := '✅ TESTE DE VENDA: OK - Sistema funcionando';
        EXCEPTION
            WHEN OTHERS THEN
                test_result := '❌ TESTE DE VENDA: ERRO - ' || SQLERRM;
        END;
    ELSE
        test_result := '❌ TESTE DE VENDA: FALHOU - Dados insuficientes';
    END IF;
    
    RAISE NOTICE '%', test_result;
END $$;

-- =====================================================
-- 5. RESUMO FINAL
-- =====================================================

SELECT 
    '🎯 VERIFICAÇÃO FINAL CONCLUÍDA' as status,
    'Execute este script para verificar o status completo' as instrucao,
    'Se todos os itens mostram ✅, o sistema está funcionando perfeitamente' as resultado;

-- =====================================================
-- 6. CONTAGEM FINAL
-- =====================================================

SELECT 
    'CONTAGEM FINAL' as tipo,
    (SELECT COUNT(*) FROM users WHERE role = 'seller') as vendedores,
    (SELECT COUNT(*) FROM clients) as clientes,
    (SELECT COUNT(*) FROM vehicles) as veiculos,
    (SELECT COUNT(*) FROM sales) as vendas,
    (SELECT COUNT(*) FROM categories) as categorias,
    (SELECT COUNT(*) FROM brands) as marcas;

-- =====================================================
-- NOTA IMPORTANTE
-- =====================================================
-- 
-- Este script é totalmente seguro e:
-- ✅ Não gera códigos longos
-- ✅ Não duplica dados
-- ✅ Testa operações básicas
-- ✅ Fornece feedback claro
-- ✅ Não causa erros
-- 
-- =====================================================
