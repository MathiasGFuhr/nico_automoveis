-- =====================================================
-- CONFIGURAÇÃO DO SUPABASE STORAGE
-- =====================================================
-- Este arquivo configura o bucket de storage para imagens de veículos

-- =====================================================
-- CRIAR BUCKET PARA IMAGENS DE VEÍCULOS
-- =====================================================

-- Criar bucket para imagens de veículos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'vehicle-images',
    'vehicle-images',
    true, -- Público para permitir acesso direto às imagens
    10485760, -- 10MB limite por arquivo
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- =====================================================
-- POLÍTICAS DE STORAGE
-- =====================================================

-- Política para permitir upload de imagens (desenvolvimento)
CREATE POLICY "Desenvolvimento: Permitir upload de imagens" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'vehicle-images');

-- Política para permitir visualização de imagens (público)
CREATE POLICY "Imagens são públicas para visualização" ON storage.objects
    FOR SELECT USING (bucket_id = 'vehicle-images');

-- Política para permitir atualização de imagens (desenvolvimento)
CREATE POLICY "Desenvolvimento: Permitir atualização de imagens" ON storage.objects
    FOR UPDATE USING (bucket_id = 'vehicle-images')
    WITH CHECK (bucket_id = 'vehicle-images');

-- Política para permitir exclusão de imagens (desenvolvimento)
CREATE POLICY "Desenvolvimento: Permitir exclusão de imagens" ON storage.objects
    FOR DELETE USING (bucket_id = 'vehicle-images');

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

-- Bucket 'vehicle-images' criado para armazenar imagens dos veículos

-- =====================================================
-- NOTA IMPORTANTE
-- =====================================================
-- 
-- ⚠️  ATENÇÃO: Estas políticas são para DESENVOLVIMENTO apenas!
-- 
-- Para PRODUÇÃO, você deve:
-- 1. Restringir upload apenas para usuários autenticados
-- 2. Implementar validação de tipos de arquivo
-- 3. Configurar CDN para otimização
-- 4. Implementar compressão automática de imagens
--
-- =====================================================
