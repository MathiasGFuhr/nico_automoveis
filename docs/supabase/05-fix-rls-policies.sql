-- =====================================================
-- CORREÇÃO DAS POLÍTICAS RLS - DESENVOLVIMENTO
-- =====================================================
-- Este arquivo corrige as políticas RLS para permitir
-- desenvolvimento sem autenticação obrigatória

-- =====================================================
-- REMOVER POLÍTICAS RESTRITIVAS TEMPORARIAMENTE
-- =====================================================

-- Remover políticas restritivas de veículos
DROP POLICY IF EXISTS "Usuários autenticados podem criar veículos" ON vehicles;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar veículos" ON vehicles;

-- Remover políticas restritivas de clientes
DROP POLICY IF EXISTS "Usuários autenticados podem criar clientes" ON clients;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar clientes" ON clients;

-- Remover políticas restritivas de vendas
DROP POLICY IF EXISTS "Apenas usuários autenticados podem ver vendas" ON sales;
DROP POLICY IF EXISTS "Apenas usuários autenticados podem criar vendas" ON sales;
DROP POLICY IF EXISTS "Apenas usuários autenticados podem atualizar vendas" ON sales;

-- =====================================================
-- POLÍTICAS PERMISSIVAS PARA DESENVOLVIMENTO
-- =====================================================

-- Veículos: Permitir todas as operações (desenvolvimento)
CREATE POLICY "Desenvolvimento: Veículos permitem todas as operações" ON vehicles
    FOR ALL USING (true)
    WITH CHECK (true);

-- Clientes: Permitir todas as operações (desenvolvimento)
CREATE POLICY "Desenvolvimento: Clientes permitem todas as operações" ON clients
    FOR ALL USING (true)
    WITH CHECK (true);

-- Vendas: Permitir todas as operações (desenvolvimento)
CREATE POLICY "Desenvolvimento: Vendas permitem todas as operações" ON sales
    FOR ALL USING (true)
    WITH CHECK (true);

-- Imagens de veículos: Permitir todas as operações
CREATE POLICY "Desenvolvimento: Imagens permitem todas as operações" ON vehicle_images
    FOR ALL USING (true)
    WITH CHECK (true);

-- Características de veículos: Permitir todas as operações
CREATE POLICY "Desenvolvimento: Características permitem todas as operações" ON vehicle_features
    FOR ALL USING (true)
    WITH CHECK (true);

-- Especificações de veículos: Permitir todas as operações
CREATE POLICY "Desenvolvimento: Especificações permitem todas as operações" ON vehicle_specifications
    FOR ALL USING (true)
    WITH CHECK (true);

-- Interesses de clientes: Permitir todas as operações
CREATE POLICY "Desenvolvimento: Interesses permitem todas as operações" ON client_interests
    FOR ALL USING (true)
    WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA TABELAS DE REFERÊNCIA
-- =====================================================

-- Manter políticas públicas para tabelas de referência
-- (brands, categories, vehicle_feature_types)

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON POLICY "Desenvolvimento: Veículos permitem todas as operações" ON vehicles IS 
'Política temporária para desenvolvimento - permite todas as operações CRUD';

COMMENT ON POLICY "Desenvolvimento: Clientes permitem todas as operações" ON clients IS 
'Política temporária para desenvolvimento - permite todas as operações CRUD';

COMMENT ON POLICY "Desenvolvimento: Vendas permitem todas as operações" ON sales IS 
'Política temporária para desenvolvimento - permite todas as operações CRUD';

-- =====================================================
-- NOTA IMPORTANTE
-- =====================================================
-- 
-- ⚠️  ATENÇÃO: Estas políticas são para DESENVOLVIMENTO apenas!
-- 
-- Para PRODUÇÃO, você deve:
-- 1. Implementar autenticação adequada
-- 2. Restaurar as políticas RLS restritivas
-- 3. Configurar usuários e roles corretamente
-- 4. Testar todas as operações com usuários autenticados
--
-- =====================================================
