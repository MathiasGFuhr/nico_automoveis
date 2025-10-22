-- =====================================================
-- LIMPAR E RECRIAR POLÍTICAS VEHICLE_IMAGES - NICO AUTOMÓVEIS
-- =====================================================
-- Este script remove TODAS as políticas existentes e cria apenas as necessárias

-- =====================================================
-- REMOVER TODAS AS POLÍTICAS EXISTENTES
-- =====================================================
-- Remover todas as políticas para recriar do zero
DROP POLICY IF EXISTS "Vehicle Images - Acesso público" ON vehicle_images;
DROP POLICY IF EXISTS "Vehicle Images - Autenticados atualizam" ON vehicle_images;
DROP POLICY IF EXISTS "Vehicle Images - Autenticados deletam" ON vehicle_images;
DROP POLICY IF EXISTS "Vehicle Images - Autenticados inserem" ON vehicle_images;
DROP POLICY IF EXISTS "Vehicle Images - Inserção autenticada" ON vehicle_images;
DROP POLICY IF EXISTS "Vehicle Images - Leitura pública" ON vehicle_images;
DROP POLICY IF EXISTS "Vehicle Images - Inserção permitida" ON vehicle_images;
DROP POLICY IF EXISTS "Vehicle Images - Atualização autenticada" ON vehicle_images;
DROP POLICY IF EXISTS "Vehicle Images - Exclusão autenticada" ON vehicle_images;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar imagens" ON vehicle_images;
DROP POLICY IF EXISTS "Imagens são públicas para leitura" ON vehicle_images;
DROP POLICY IF EXISTS "Desenvolvimento: Imagens permitem todas as operações" ON vehicle_images;
DROP POLICY IF EXISTS "Imagens: Todas as operações permitidas" ON vehicle_images;
DROP POLICY IF EXISTS "Vehicle Images - Autenticados modificam" ON vehicle_images;

-- =====================================================
-- CRIAR APENAS AS POLÍTICAS NECESSÁRIAS
-- =====================================================

-- 1. SELECT - Leitura pública (todos podem ver imagens)
CREATE POLICY "Vehicle Images - Leitura pública" ON vehicle_images
FOR SELECT TO anon, authenticated, authenticator, dashboard_user, public
USING (true);

-- 2. INSERT - Inserção permitida (todos podem inserir)
CREATE POLICY "Vehicle Images - Inserção permitida" ON vehicle_images
FOR INSERT TO anon, authenticated, authenticator, dashboard_user, public
WITH CHECK (true);

-- 3. UPDATE - Atualização para autenticados
CREATE POLICY "Vehicle Images - Atualização autenticada" ON vehicle_images
FOR UPDATE TO authenticated, authenticator, dashboard_user
USING (true) WITH CHECK (true);

-- 4. DELETE - Exclusão para autenticados
CREATE POLICY "Vehicle Images - Exclusão autenticada" ON vehicle_images
FOR DELETE TO authenticated, authenticator, dashboard_user
USING (true);

-- =====================================================
-- VERIFICAR POLÍTICAS CRIADAS
-- =====================================================
-- Mostrar apenas as políticas ativas
SELECT 
    policyname,
    cmd,
    roles,
    permissive,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'vehicle_images'
ORDER BY cmd, policyname;

-- =====================================================
-- VERIFICAR RLS ATIVO
-- =====================================================
-- Verificar se RLS está ativo na tabela
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'vehicle_images';

-- =====================================================
-- TESTE DE INSERÇÃO (APENAS SE HOUVER VEÍCULOS)
-- =====================================================
-- Verificar se existem veículos antes de testar
DO $$
DECLARE
    vehicle_count INTEGER;
    test_vehicle_id UUID;
BEGIN
    -- Contar veículos existentes
    SELECT COUNT(*) INTO vehicle_count FROM vehicles;
    
    IF vehicle_count > 0 THEN
        -- Pegar o primeiro veículo disponível
        SELECT id INTO test_vehicle_id FROM vehicles LIMIT 1;
        
        -- Testar inserção com veículo real
        INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, sort_order)
        VALUES (
            test_vehicle_id,
            'https://example.com/test-rls.jpg',
            false,
            0
        ) ON CONFLICT DO NOTHING;
        
        -- Limpar o registro de teste
        DELETE FROM vehicle_images 
        WHERE vehicle_id = test_vehicle_id 
        AND image_url = 'https://example.com/test-rls.jpg';
        
        RAISE NOTICE '✅ Teste de inserção realizado com sucesso usando veículo: %', test_vehicle_id;
    ELSE
        RAISE NOTICE '⚠️ Nenhum veículo encontrado. Teste de inserção pulado.';
    END IF;
END $$;

-- =====================================================
-- RESUMO FINAL
-- =====================================================
SELECT '🎉 Políticas RLS para vehicle_images configuradas com sucesso!' as status;
SELECT '📊 Total de políticas ativas:' as info, COUNT(*) as total FROM pg_policies WHERE tablename = 'vehicle_images';
