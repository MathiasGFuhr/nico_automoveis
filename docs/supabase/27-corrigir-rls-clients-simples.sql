-- =====================================================
-- CORRIGIR RLS CLIENTS - VERSÃO SIMPLES
-- =====================================================
-- Este script corrige as políticas RLS da tabela clients de forma simples

-- =====================================================
-- REMOVER TODAS AS POLÍTICAS EXISTENTES
-- =====================================================
-- Remover todas as políticas para recriar do zero
DROP POLICY IF EXISTS "Clients - Leitura pública" ON clients;
DROP POLICY IF EXISTS "Clients - Inserção permitida" ON clients;
DROP POLICY IF EXISTS "Clients - Atualização autenticada" ON clients;
DROP POLICY IF EXISTS "Clients - Exclusão autenticada" ON clients;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar clientes" ON clients;
DROP POLICY IF EXISTS "Apenas admins podem deletar clientes" ON clients;
DROP POLICY IF EXISTS "Clientes são públicos para leitura" ON clients;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir clientes" ON clients;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar clientes" ON clients;
DROP POLICY IF EXISTS "Desenvolvimento: Clientes permitem todas as operações" ON clients;
DROP POLICY IF EXISTS "Clientes: Todas as operações permitidas" ON clients;

-- =====================================================
-- CRIAR POLÍTICAS SIMPLES
-- =====================================================

-- 1. SELECT - Todos podem ler
CREATE POLICY "Clients - Leitura pública" ON clients
FOR SELECT TO anon, authenticated, authenticator, dashboard_user, public
USING (true);

-- 2. INSERT - Todos podem inserir
CREATE POLICY "Clients - Inserção permitida" ON clients
FOR INSERT TO anon, authenticated, authenticator, dashboard_user, public
WITH CHECK (true);

-- 3. UPDATE - Apenas autenticados
CREATE POLICY "Clients - Atualização autenticada" ON clients
FOR UPDATE TO authenticated, authenticator, dashboard_user
USING (true) WITH CHECK (true);

-- 4. DELETE - Apenas autenticados
CREATE POLICY "Clients - Exclusão autenticada" ON clients
FOR DELETE TO authenticated, authenticator, dashboard_user
USING (true);

-- =====================================================
-- VERIFICAR POLÍTICAS CRIADAS
-- =====================================================
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'clients'
ORDER BY cmd, policyname;

-- =====================================================
-- TESTAR INSERÇÃO
-- =====================================================
-- Inserir cliente de teste
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
    'Cliente Teste RLS',
    'teste.rls@example.com',
    '(55) 9 9999-9999',
    '123.456.789-00',
    'Santo Cristo',
    'RS',
    'buyer',
    'active',
    5
);

-- Verificar inserção
SELECT 'Cliente inserido:' as info, COUNT(*) as total FROM clients;

-- Mostrar cliente
SELECT name, email, client_type, status FROM clients WHERE email = 'teste.rls@example.com';

-- Limpar teste
DELETE FROM clients WHERE email = 'teste.rls@example.com';

-- =====================================================
-- RESUMO
-- =====================================================
SELECT '✅ RLS para clients configurado com sucesso!' as status;
SELECT '📊 Políticas ativas:' as info, COUNT(*) as total FROM pg_policies WHERE tablename = 'clients';
