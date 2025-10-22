-- Criar vendedores na tabela users
-- Este script cria vendedores básicos para o sistema de vendas

-- Inserir vendedores na tabela users
INSERT INTO users (id, name, email, role, created_at, updated_at) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'Nico',
  'nico@nicoautomoveis.com',
  'seller',
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000002',
  'Lucas',
  'lucas@nicoautomoveis.com',
  'seller',
  NOW(),
  NOW()
);

-- Verificar se os vendedores foram criados
SELECT id, name, email, role FROM users WHERE role = 'seller';
