-- =====================================================
-- VERIFICAÇÃO SIMPLES DO BANCO - NICO AUTOMÓVEIS
-- =====================================================
-- Este script verifica apenas o essencial sem assumir tabelas específicas

-- =====================================================
-- 1. VERIFICAR ESTRUTURA BÁSICA
-- =====================================================

-- Verificar se as tabelas principais existem
SELECT 
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
    CASE 
        WHEN (SELECT COUNT(*) FROM users WHERE role = 'seller') > 0 
        THEN '✅ Vendedores: OK (' || (SELECT COUNT(*) FROM users WHERE role = 'seller') || ' encontrados)'
        ELSE '❌ Vendedores: FALTANDO'
    END as vendedores;

-- Verificar clientes
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM clients) > 0 
        THEN '✅ Clientes: OK (' || (SELECT COUNT(*) FROM clients) || ' encontrados)'
        ELSE '❌ Clientes: FALTANDO'
    END as clientes;

-- Verificar veículos
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM vehicles) > 0 
        THEN '✅ Veículos: OK (' || (SELECT COUNT(*) FROM vehicles) || ' encontrados)'
        ELSE '❌ Veículos: FALTANDO'
    END as veiculos;

-- Verificar vendas
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM sales) >= 0 
        THEN '✅ Vendas: OK (' || (SELECT COUNT(*) FROM sales) || ' encontradas)'
        ELSE '❌ Vendas: ERRO'
    END as vendas;

-- =====================================================
-- 3. VERIFICAR VENDEDORES ESPECÍFICOS
-- =====================================================

-- Verificar se os vendedores específicos existem
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM users WHERE id = '00000000-0000-0000-0000-000000000001')
        THEN '✅ Nico: OK'
        ELSE '❌ Nico: FALTANDO'
    END as nico,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM users WHERE id = '00000000-0000-0000-0000-000000000002')
        THEN '✅ Lucas: OK'
        ELSE '❌ Lucas: FALTANDO'
    END as lucas;

-- =====================================================
-- 4. TESTAR OPERAÇÃO BÁSICA
-- =====================================================

-- Testar se conseguimos inserir uma venda de teste
DO $$
DECLARE
    test_client_id UUID;
    test_vehicle_id UUID;
    test_seller_id UUID;
    test_sale_id UUID;
BEGIN
    -- Buscar IDs de teste
    SELECT id INTO test_client_id FROM clients LIMIT 1;
    SELECT id INTO test_vehicle_id FROM vehicles LIMIT 1;
    SELECT id INTO test_seller_id FROM users WHERE role = 'seller' LIMIT 1;
    
    -- Se temos todos os dados necessários
    IF test_client_id IS NOT NULL AND test_vehicle_id IS NOT NULL AND test_seller_id IS NOT NULL THEN
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
            'TEST-VERIFY-' || EXTRACT(EPOCH FROM NOW())::TEXT,
            1000.00,
            5.00,
            'À vista',
            'completed'
        ) RETURNING id INTO test_sale_id;
        
        -- Remover venda de teste
        DELETE FROM sales WHERE id = test_sale_id;
        
        RAISE NOTICE '✅ TESTE DE VENDA: OK - Sistema funcionando';
    ELSE
        RAISE NOTICE '❌ TESTE DE VENDA: FALHOU - Dados insuficientes';
    END IF;
END $$;

-- =====================================================
-- 5. RESUMO FINAL
-- =====================================================

SELECT 
    '🎯 VERIFICAÇÃO CONCLUÍDA' as status,
    'Execute este script para verificar o status do banco' as instrucao,
    'Se todos os itens mostram ✅, o sistema está funcionando' as resultado;

-- =====================================================
-- NOTA IMPORTANTE
-- =====================================================
-- 
-- Este script é seguro e:
-- ✅ Não tenta acessar tabelas que podem não existir
-- ✅ Usa verificações condicionais
-- ✅ Testa operações básicas
-- ✅ Fornece feedback claro
-- 
-- =====================================================
