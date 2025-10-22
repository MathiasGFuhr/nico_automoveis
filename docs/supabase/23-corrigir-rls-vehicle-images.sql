-- =====================================================
-- CORRIGIR RLS PARA VEHICLE_IMAGES - NICO AUTOMÓVEIS
-- =====================================================
-- Este script corrige as políticas RLS da tabela vehicle_images
-- para permitir upload de imagens sem problemas de autenticação

-- =====================================================
-- REMOVER POLÍTICAS EXISTENTES
-- =====================================================
-- Remover todas as políticas existentes para recriar
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar imagens" ON vehicle_images;
DROP POLICY IF EXISTS "Imagens são públicas para leitura" ON vehicle_images;
DROP POLICY IF EXISTS "Desenvolvimento: Imagens permitem todas as operações" ON vehicle_images;
DROP POLICY IF EXISTS "Imagens: Todas as operações permitidas" ON vehicle_images;
DROP POLICY IF EXISTS "Vehicle Images - Acesso público" ON vehicle_images;
DROP POLICY IF EXISTS "Vehicle Images - Autenticados modificam" ON vehicle_images;

-- =====================================================
-- CRIAR POLÍTICAS CORRIGIDAS
-- =====================================================

-- Política para SELECT (leitura pública)
DROP POLICY IF EXISTS "Vehicle Images - Leitura pública" ON vehicle_images;
CREATE POLICY "Vehicle Images - Leitura pública" ON vehicle_images
FOR SELECT TO anon, authenticated, authenticator, dashboard_user
USING (true);

-- Política para INSERT (inserção para usuários autenticados ou anônimos)
DROP POLICY IF EXISTS "Vehicle Images - Inserção permitida" ON vehicle_images;
CREATE POLICY "Vehicle Images - Inserção permitida" ON vehicle_images
FOR INSERT TO anon, authenticated, authenticator, dashboard_user
WITH CHECK (true);

-- Política para UPDATE (atualização para usuários autenticados)
DROP POLICY IF EXISTS "Vehicle Images - Atualização autenticada" ON vehicle_images;
CREATE POLICY "Vehicle Images - Atualização autenticada" ON vehicle_images
FOR UPDATE TO authenticated, authenticator, dashboard_user
USING (true) WITH CHECK (true);

-- Política para DELETE (exclusão para usuários autenticados)
DROP POLICY IF EXISTS "Vehicle Images - Exclusão autenticada" ON vehicle_images;
CREATE POLICY "Vehicle Images - Exclusão autenticada" ON vehicle_images
FOR DELETE TO authenticated, authenticator, dashboard_user
USING (true);

-- =====================================================
-- VERIFICAR POLÍTICAS CRIADAS
-- =====================================================
-- Mostrar políticas ativas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'vehicle_images'
ORDER BY policyname;

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
            'https://example.com/test.jpg',
            false,
            0
        ) ON CONFLICT DO NOTHING;
        
        -- Limpar o registro de teste
        DELETE FROM vehicle_images 
        WHERE vehicle_id = test_vehicle_id 
        AND image_url = 'https://example.com/test.jpg';
        
        RAISE NOTICE 'Teste de inserção realizado com sucesso usando veículo: %', test_vehicle_id;
    ELSE
        RAISE NOTICE 'Nenhum veículo encontrado. Teste de inserção pulado.';
    END IF;
END $$;

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
-- RESUMO
-- =====================================================
SELECT 'Políticas RLS para vehicle_images configuradas com sucesso!' as status;
