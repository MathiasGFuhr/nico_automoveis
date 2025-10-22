-- =====================================================
-- CORRIGIR RLS PARA USERS - NICO AUTOMÓVEIS
-- =====================================================
-- Este script corrige as políticas RLS da tabela users

-- =====================================================
-- VERIFICAR POLÍTICAS EXISTENTES
-- =====================================================
-- Mostrar políticas atuais da tabela users
SELECT 
    policyname,
    cmd,
    roles,
    permissive,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users'
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
WHERE tablename = 'users';

-- =====================================================
-- REMOVER POLÍTICAS PROBLEMÁTICAS
-- =====================================================
-- Remover políticas que podem estar causando problemas
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar usuários" ON users;
DROP POLICY IF EXISTS "Apenas admins podem deletar usuários" ON users;
DROP POLICY IF EXISTS "Usuários são públicos para leitura" ON users;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir usuários" ON users;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar usuários" ON users;
DROP POLICY IF EXISTS "Desenvolvimento: Usuários permitem todas as operações" ON users;
DROP POLICY IF EXISTS "Users: Todas as operações permitidas" ON users;
DROP POLICY IF EXISTS "Users - Leitura pública" ON users;
DROP POLICY IF EXISTS "Users - Inserção permitida" ON users;
DROP POLICY IF EXISTS "Users - Atualização autenticada" ON users;
DROP POLICY IF EXISTS "Users - Exclusão autenticada" ON users;

-- =====================================================
-- CRIAR POLÍTICAS CORRIGIDAS
-- =====================================================

-- 1. SELECT - Leitura pública (todos podem ver usuários)
CREATE POLICY "Users - Leitura pública" ON users
FOR SELECT TO anon, authenticated, authenticator, dashboard_user, public
USING (true);

-- 2. INSERT - Inserção permitida (todos podem inserir)
CREATE POLICY "Users - Inserção permitida" ON users
FOR INSERT TO anon, authenticated, authenticator, dashboard_user, public
WITH CHECK (true);

-- 3. UPDATE - Atualização para autenticados
CREATE POLICY "Users - Atualização autenticada" ON users
FOR UPDATE TO authenticated, authenticator, dashboard_user
USING (true) WITH CHECK (true);

-- 4. DELETE - Exclusão para autenticados
CREATE POLICY "Users - Exclusão autenticada" ON users
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
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- =====================================================
-- TESTAR BUSCA DE VENDEDORES
-- =====================================================
-- Testar a query que o SellerService usa
SELECT 
    id,
    name,
    email,
    role
FROM users
WHERE role = 'seller'
ORDER BY name;

-- =====================================================
-- VERIFICAR DADOS
-- =====================================================
-- Contar usuários por role
SELECT 
    role,
    COUNT(*) as total
FROM users 
GROUP BY role
ORDER BY role;

-- Mostrar vendedores
SELECT 
    id,
    name,
    email,
    role,
    created_at
FROM users 
WHERE role = 'seller'
ORDER BY name;

-- =====================================================
-- RESUMO
-- =====================================================
SELECT '✅ RLS para users configurado com sucesso!' as status;
SELECT '📊 Políticas ativas:' as info, COUNT(*) as total FROM pg_policies WHERE tablename = 'users';
SELECT '👥 Total de vendedores:' as info, COUNT(*) as total FROM users WHERE role = 'seller';
