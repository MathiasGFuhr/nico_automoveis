-- =====================================================
-- VERIFICAR E CORRIGIR RLS PARA CLIENTS - NICO AUTOMÓVEIS
-- =====================================================
-- Este script verifica e corrige as políticas RLS da tabela clients

-- =====================================================
-- VERIFICAR POLÍTICAS EXISTENTES
-- =====================================================
-- Mostrar políticas atuais da tabela clients
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
-- Verificar se RLS está ativo na tabela
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'clients';

-- =====================================================
-- VERIFICAR DADOS EXISTENTES
-- =====================================================
-- Contar clientes existentes
SELECT 'Total de clientes:' as info, COUNT(*) as total FROM clients;

-- Mostrar alguns clientes
SELECT id, name, email, client_type, status, created_at 
FROM clients 
ORDER BY created_at DESC 
LIMIT 5;

-- =====================================================
-- REMOVER POLÍTICAS PROBLEMÁTICAS
-- =====================================================
-- Remover políticas que podem estar causando problemas
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar clientes" ON clients;
DROP POLICY IF EXISTS "Apenas admins podem deletar clientes" ON clients;
DROP POLICY IF EXISTS "Clientes são públicos para leitura" ON clients;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir clientes" ON clients;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar clientes" ON clients;
DROP POLICY IF EXISTS "Desenvolvimento: Clientes permitem todas as operações" ON clients;
DROP POLICY IF EXISTS "Clientes: Todas as operações permitidas" ON clients;

-- =====================================================
-- CRIAR POLÍTICAS CORRIGIDAS
-- =====================================================

-- 1. SELECT - Leitura pública (todos podem ver clientes)
CREATE POLICY "Clients - Leitura pública" ON clients
FOR SELECT TO anon, authenticated, authenticator, dashboard_user, public
USING (true);

-- 2. INSERT - Inserção permitida (todos podem inserir)
CREATE POLICY "Clients - Inserção permitida" ON clients
FOR INSERT TO anon, authenticated, authenticator, dashboard_user, public
WITH CHECK (true);

-- 3. UPDATE - Atualização para autenticados
CREATE POLICY "Clients - Atualização autenticada" ON clients
FOR UPDATE TO authenticated, authenticator, dashboard_user
USING (true) WITH CHECK (true);

-- 4. DELETE - Exclusão para autenticados
CREATE POLICY "Clients - Exclusão autenticada" ON clients
FOR DELETE TO authenticated, authenticator, dashboard_user
USING (true);

-- =====================================================
-- VERIFICAR POLÍTICAS CRIADAS
-- =====================================================
-- Mostrar políticas ativas
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
-- TESTE DE INSERÇÃO
-- =====================================================
-- Testar inserção de cliente de teste
INSERT INTO clients (name, email, phone, cpf, city, state, client_type, status, rating)
VALUES (
    'Cliente Teste RLS',
    'teste@example.com',
    '(55) 9 9999-9999',
    '123.456.789-00',
    'Santo Cristo',
    'RS',
    'buyer',
    'active',
    5
);

-- Verificar se foi inserido
SELECT 'Cliente de teste inserido:' as info, COUNT(*) as total 
FROM clients 
WHERE email = 'teste@example.com';

-- Limpar cliente de teste
DELETE FROM clients WHERE email = 'teste@example.com';

-- =====================================================
-- RESUMO FINAL
-- =====================================================
SELECT '🎉 Políticas RLS para clients configuradas com sucesso!' as status;
SELECT '📊 Total de políticas ativas:' as info, COUNT(*) as total FROM pg_policies WHERE tablename = 'clients';
SELECT '👥 Total de clientes:' as info, COUNT(*) as total FROM clients;
