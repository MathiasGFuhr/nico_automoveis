-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS) - NICO AUTOMÓVEIS
-- =====================================================
-- Este arquivo contém as políticas de Row Level Security (RLS)
-- para proteger os dados e controlar o acesso.

-- =====================================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_interests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA CATEGORIAS
-- =====================================================
-- Todos podem ler categorias (público)
CREATE POLICY "Categorias são públicas para leitura" ON categories
    FOR SELECT USING (true);

-- Apenas admins podem modificar categorias
CREATE POLICY "Apenas admins podem modificar categorias" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'manager')
        )
    );

-- =====================================================
-- POLÍTICAS PARA MARCAS
-- =====================================================
-- Todos podem ler marcas (público)
CREATE POLICY "Marcas são públicas para leitura" ON brands
    FOR SELECT USING (true);

-- Apenas admins podem modificar marcas
CREATE POLICY "Apenas admins podem modificar marcas" ON brands
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'manager')
        )
    );

-- =====================================================
-- POLÍTICAS PARA USUÁRIOS
-- =====================================================
-- Usuários podem ver seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados" ON users
    FOR SELECT USING (auth.uid() = id);

-- Usuários podem atualizar seus próprios dados (exceto role)
CREATE POLICY "Usuários podem atualizar seus próprios dados" ON users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Apenas admins podem criar/gerenciar usuários
CREATE POLICY "Apenas admins podem gerenciar usuários" ON users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Apenas admins podem deletar usuários
CREATE POLICY "Apenas admins podem deletar usuários" ON users
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =====================================================
-- POLÍTICAS PARA CLIENTES
-- =====================================================
-- Todos podem ver clientes (público para busca)
CREATE POLICY "Clientes são públicos para leitura" ON clients
    FOR SELECT USING (true);

-- Apenas usuários autenticados podem criar clientes
CREATE POLICY "Usuários autenticados podem criar clientes" ON clients
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Apenas usuários autenticados podem atualizar clientes
CREATE POLICY "Usuários autenticados podem atualizar clientes" ON clients
    FOR UPDATE USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Apenas admins podem deletar clientes
CREATE POLICY "Apenas admins podem deletar clientes" ON clients
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'manager')
        )
    );

-- =====================================================
-- POLÍTICAS PARA VEÍCULOS
-- =====================================================
-- Todos podem ver veículos disponíveis (público)
CREATE POLICY "Veículos são públicos para leitura" ON vehicles
    FOR SELECT USING (true);

-- Apenas usuários autenticados podem criar veículos
CREATE POLICY "Usuários autenticados podem criar veículos" ON vehicles
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Apenas usuários autenticados podem atualizar veículos
CREATE POLICY "Usuários autenticados podem atualizar veículos" ON vehicles
    FOR UPDATE USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Apenas admins podem deletar veículos
CREATE POLICY "Apenas admins podem deletar veículos" ON vehicles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'manager')
        )
    );

-- =====================================================
-- POLÍTICAS PARA IMAGENS DOS VEÍCULOS
-- =====================================================
-- Todos podem ver imagens (público)
CREATE POLICY "Imagens são públicas para leitura" ON vehicle_images
    FOR SELECT USING (true);

-- Apenas usuários autenticados podem gerenciar imagens
CREATE POLICY "Usuários autenticados podem gerenciar imagens" ON vehicle_images
    FOR ALL USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- POLÍTICAS PARA CARACTERÍSTICAS DOS VEÍCULOS
-- =====================================================
-- Todos podem ver características (público)
CREATE POLICY "Características são públicas para leitura" ON vehicle_features
    FOR SELECT USING (true);

-- Apenas usuários autenticados podem gerenciar características
CREATE POLICY "Usuários autenticados podem gerenciar características" ON vehicle_features
    FOR ALL USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- POLÍTICAS PARA ESPECIFICAÇÕES TÉCNICAS
-- =====================================================
-- Todos podem ver especificações (público)
CREATE POLICY "Especificações são públicas para leitura" ON vehicle_specifications
    FOR SELECT USING (true);

-- Apenas usuários autenticados podem gerenciar especificações
CREATE POLICY "Usuários autenticados podem gerenciar especificações" ON vehicle_specifications
    FOR ALL USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- POLÍTICAS PARA VENDAS
-- =====================================================
-- Apenas usuários autenticados podem ver vendas
CREATE POLICY "Apenas usuários autenticados podem ver vendas" ON sales
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Apenas usuários autenticados podem criar vendas
CREATE POLICY "Apenas usuários autenticados podem criar vendas" ON sales
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Apenas usuários autenticados podem atualizar vendas
CREATE POLICY "Apenas usuários autenticados podem atualizar vendas" ON sales
    FOR UPDATE USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Apenas admins podem deletar vendas
CREATE POLICY "Apenas admins podem deletar vendas" ON sales
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'manager')
        )
    );

-- =====================================================
-- POLÍTICAS PARA INTERESSES DE CLIENTES
-- =====================================================
-- Apenas usuários autenticados podem ver interesses
CREATE POLICY "Apenas usuários autenticados podem ver interesses" ON client_interests
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Apenas usuários autenticados podem criar interesses
CREATE POLICY "Apenas usuários autenticados podem criar interesses" ON client_interests
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Apenas usuários autenticados podem atualizar interesses
CREATE POLICY "Apenas usuários autenticados podem atualizar interesses" ON client_interests
    FOR UPDATE USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Apenas usuários autenticados podem deletar interesses
CREATE POLICY "Apenas usuários autenticados podem deletar interesses" ON client_interests
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- =====================================================
-- FUNÇÕES AUXILIARES PARA RLS
-- =====================================================

-- Função para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se o usuário é manager ou admin
CREATE OR REPLACE FUNCTION is_manager_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'manager')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se o usuário está autenticado
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- POLÍTICAS ADICIONAIS DE SEGURANÇA
-- =====================================================

-- Política para evitar que usuários vejam dados de outros usuários
CREATE POLICY "Usuários só veem seus próprios dados" ON users
    FOR SELECT USING (auth.uid() = id OR is_manager_or_admin());

-- Política para logs de auditoria (futuro)
-- CREATE TABLE audit_logs (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     table_name VARCHAR(50) NOT NULL,
--     record_id UUID NOT NULL,
--     action VARCHAR(20) NOT NULL,
--     old_values JSONB,
--     new_values JSONB,
--     user_id UUID REFERENCES users(id),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- =====================================================
-- COMENTÁRIOS DAS POLÍTICAS
-- =====================================================

COMMENT ON POLICY "Categorias são públicas para leitura" ON categories IS 'Permite que qualquer pessoa veja as categorias de veículos';
COMMENT ON POLICY "Apenas admins podem modificar categorias" ON categories IS 'Restringe modificações em categorias apenas para administradores';
COMMENT ON POLICY "Marcas são públicas para leitura" ON brands IS 'Permite que qualquer pessoa veja as marcas de veículos';
COMMENT ON POLICY "Apenas admins podem modificar marcas" ON brands IS 'Restringe modificações em marcas apenas para administradores';
COMMENT ON POLICY "Veículos são públicos para leitura" ON vehicles IS 'Permite que qualquer pessoa veja os veículos disponíveis';
COMMENT ON POLICY "Clientes são públicos para leitura" ON clients IS 'Permite que qualquer pessoa veja os dados básicos dos clientes';
COMMENT ON POLICY "Apenas usuários autenticados podem ver vendas" ON sales IS 'Restringe visualização de vendas apenas para usuários logados';
