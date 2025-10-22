-- =====================================================
-- OTIMIZAÇÃO DE CARACTERÍSTICAS DE VEÍCULOS
-- =====================================================
-- Este arquivo otimiza a estrutura de características para evitar
-- duplicações e melhorar a organização dos dados.

-- =====================================================
-- CRIAR TABELA DE CARACTERÍSTICAS ÚNICAS
-- =====================================================

-- Tabela para armazenar características únicas
CREATE TABLE IF NOT EXISTS vehicle_feature_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50), -- 'Segurança', 'Conforto', 'Tecnologia', etc.
    description TEXT,
    icon VARCHAR(50), -- Nome do ícone para UI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INSERIR CARACTERÍSTICAS ÚNICAS
-- =====================================================

INSERT INTO vehicle_feature_types (id, name, category, description, icon) VALUES
-- Segurança
('feat-001', 'Freios ABS', 'Segurança', 'Sistema de freios antibloqueio', 'shield'),
('feat-002', 'Airbag', 'Segurança', 'Bolsa de ar para proteção em acidentes', 'shield'),
('feat-003', 'Controle de Estabilidade', 'Segurança', 'Sistema eletrônico de estabilidade', 'shield'),
('feat-004', 'Câmera de Ré', 'Segurança', 'Câmera para auxiliar na marcha ré', 'camera'),

-- Conforto
('feat-005', 'Ar Condicionado', 'Conforto', 'Sistema de climatização', 'thermometer'),
('feat-006', 'Direção Hidráulica', 'Conforto', 'Sistema de direção assistida', 'steering-wheel'),
('feat-007', 'Bancos de Couro', 'Conforto', 'Estofamento em couro', 'car'),
('feat-008', 'Teto Solar', 'Conforto', 'Teto retrátil ou panorâmico', 'sun'),
('feat-009', 'Bancos Elétricos', 'Conforto', 'Ajuste elétrico dos bancos', 'car'),

-- Tecnologia
('feat-010', 'GPS', 'Tecnologia', 'Sistema de navegação por satélite', 'map-pin'),
('feat-011', 'Bluetooth', 'Tecnologia', 'Conectividade sem fio', 'bluetooth'),
('feat-012', 'Som Premium', 'Tecnologia', 'Sistema de som de alta qualidade', 'music'),
('feat-013', 'CarPlay/Android Auto', 'Tecnologia', 'Integração com smartphones', 'smartphone'),
('feat-014', 'Sensores de Estacionamento', 'Tecnologia', 'Sensores para auxiliar no estacionamento', 'parking'),

-- Performance
('feat-015', 'Turbo', 'Performance', 'Motor com turbocompressor', 'zap'),
('feat-016', 'Traction Control', 'Performance', 'Controle de tração', 'car'),
('feat-017', 'Modo Sport', 'Performance', 'Configuração esportiva do motor', 'zap'),

-- Economia
('feat-018', 'Start/Stop', 'Economia', 'Sistema de parada automática do motor', 'battery'),
('feat-019', 'Eco Mode', 'Economia', 'Modo econômico de condução', 'leaf');

-- =====================================================
-- ATUALIZAR TABELA DE CARACTERÍSTICAS DOS VEÍCULOS
-- =====================================================

-- Adicionar coluna para referenciar o tipo de característica
ALTER TABLE vehicle_features 
ADD COLUMN IF NOT EXISTS feature_type_id UUID REFERENCES vehicle_feature_types(id);

-- =====================================================
-- MIGRAR DADOS EXISTENTES
-- =====================================================

-- Atualizar características existentes para usar os tipos únicos
UPDATE vehicle_features 
SET feature_type_id = 'feat-001' 
WHERE feature_name = 'Freios ABS';

UPDATE vehicle_features 
SET feature_type_id = 'feat-002' 
WHERE feature_name = 'Airbag';

UPDATE vehicle_features 
SET feature_type_id = 'feat-005' 
WHERE feature_name = 'Ar Condicionado';

UPDATE vehicle_features 
SET feature_type_id = 'feat-006' 
WHERE feature_name = 'Direção Hidráulica';

UPDATE vehicle_features 
SET feature_type_id = 'feat-010' 
WHERE feature_name = 'GPS';

UPDATE vehicle_features 
SET feature_type_id = 'feat-011' 
WHERE feature_name = 'Bluetooth';

UPDATE vehicle_features 
SET feature_type_id = 'feat-012' 
WHERE feature_name = 'Som';

UPDATE vehicle_features 
SET feature_type_id = 'feat-008' 
WHERE feature_name = 'Teto Solar';

UPDATE vehicle_features 
SET feature_type_id = 'feat-007' 
WHERE feature_name = 'Bancos de Couro';

-- =====================================================
-- CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_vehicle_feature_types_name ON vehicle_feature_types(name);
CREATE INDEX IF NOT EXISTS idx_vehicle_feature_types_category ON vehicle_feature_types(category);
CREATE INDEX IF NOT EXISTS idx_vehicle_features_feature_type_id ON vehicle_features(feature_type_id);

-- =====================================================
-- CRIAR VIEW PARA CONSULTAS OTIMIZADAS
-- =====================================================

-- View para listar características de um veículo com informações completas
CREATE OR REPLACE VIEW vehicle_features_complete AS
SELECT 
    vf.id,
    vf.vehicle_id,
    vf.feature_name,
    vft.name as feature_type_name,
    vft.category as feature_category,
    vft.description as feature_description,
    vft.icon as feature_icon,
    vf.created_at
FROM vehicle_features vf
LEFT JOIN vehicle_feature_types vft ON vf.feature_type_id = vft.id;

-- =====================================================
-- FUNÇÕES AUXILIARES
-- =====================================================

-- Função para adicionar característica a um veículo
CREATE OR REPLACE FUNCTION add_vehicle_feature(
    p_vehicle_id UUID,
    p_feature_type_id UUID
) RETURNS UUID AS $$
DECLARE
    feature_id UUID;
    feature_name VARCHAR(100);
BEGIN
    -- Buscar nome da característica
    SELECT name INTO feature_name 
    FROM vehicle_feature_types 
    WHERE id = p_feature_type_id;
    
    -- Inserir característica se não existir
    INSERT INTO vehicle_features (vehicle_id, feature_name, feature_type_id)
    VALUES (p_vehicle_id, feature_name, p_feature_type_id)
    ON CONFLICT (vehicle_id, feature_name) DO NOTHING
    RETURNING id INTO feature_id;
    
    RETURN feature_id;
END;
$$ LANGUAGE plpgsql;

-- Função para remover característica de um veículo
CREATE OR REPLACE FUNCTION remove_vehicle_feature(
    p_vehicle_id UUID,
    p_feature_type_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    feature_name VARCHAR(100);
BEGIN
    -- Buscar nome da característica
    SELECT name INTO feature_name 
    FROM vehicle_feature_types 
    WHERE id = p_feature_type_id;
    
    -- Remover característica
    DELETE FROM vehicle_features 
    WHERE vehicle_id = p_vehicle_id 
    AND feature_name = feature_name;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ATUALIZAR POLÍTICAS RLS
-- =====================================================

-- Habilitar RLS na nova tabela
ALTER TABLE vehicle_feature_types ENABLE ROW LEVEL SECURITY;

-- Políticas para vehicle_feature_types
CREATE POLICY "Tipos de características são públicos para leitura" ON vehicle_feature_types
    FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem gerenciar tipos de características" ON vehicle_feature_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'manager')
        )
    );

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE vehicle_feature_types IS 'Tipos únicos de características de veículos para evitar duplicações';
COMMENT ON COLUMN vehicle_feature_types.category IS 'Categoria da característica (Segurança, Conforto, Tecnologia, etc.)';
COMMENT ON COLUMN vehicle_feature_types.icon IS 'Nome do ícone para usar na interface';
COMMENT ON FUNCTION add_vehicle_feature IS 'Adiciona uma característica a um veículo usando o tipo único';
COMMENT ON FUNCTION remove_vehicle_feature IS 'Remove uma característica de um veículo';
COMMENT ON VIEW vehicle_features_complete IS 'View que combina características com seus tipos para consultas otimizadas';
