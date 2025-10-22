-- ========================================
-- 🔐 CRIAR USUÁRIO ADMIN NO SUPABASE
-- ========================================
-- 
-- Este script cria o usuário administrador no Supabase Auth
-- para resolver o problema de autenticação RLS
--
-- EXECUTAR NO SUPABASE DASHBOARD > SQL EDITOR
-- ========================================

-- 1. Criar usuário admin no Supabase Auth
-- (Este comando deve ser executado via Supabase Dashboard > Authentication > Users)
-- Ou via API do Supabase Auth

-- 2. Verificar se o usuário existe
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@nicoautomoveis.com';

-- 3. Se não existir, criar via SQL (alternativa)
-- ATENÇÃO: Este método pode não funcionar em todos os casos
-- O ideal é criar via Dashboard > Authentication > Users

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@nicoautomoveis.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- 4. Verificar se foi criado
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@nicoautomoveis.com';

-- ========================================
-- ALTERNATIVA: CRIAR VIA DASHBOARD
-- ========================================
-- 
-- 1. Acesse Supabase Dashboard
-- 2. Vá em Authentication > Users
-- 3. Clique em "Add user"
-- 4. Preencha:
--    - Email: admin@nicoautomoveis.com
--    - Password: admin123
--    - Auto Confirm User: ✅
-- 5. Clique em "Create user"
--
-- ========================================

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================

-- Verificar usuários criados
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users 
WHERE email LIKE '%admin%'
ORDER BY created_at DESC;

-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'vehicles'
ORDER BY policyname;
