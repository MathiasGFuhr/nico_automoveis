-- =====================================================
-- SCHEMA DO BANCO DE DADOS - NICO AUTOMÓVEIS
-- =====================================================
-- Este arquivo contém a estrutura completa do banco de dados
-- para o sistema de gestão de automóveis.

-- =====================================================
-- EXTENSÕES NECESSÁRIAS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- TABELA: CATEGORIAS DE VEÍCULOS
-- =====================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: MARCAS DE VEÍCULOS
-- =====================================================
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    logo_url TEXT,
    country VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: USUÁRIOS ADMINISTRATIVOS
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'seller')),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: CLIENTES
-- =====================================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    cpf VARCHAR(14),
    city VARCHAR(50),
    state VARCHAR(2),
    address TEXT,
    client_type VARCHAR(20) NOT NULL DEFAULT 'buyer' CHECK (client_type IN ('buyer', 'seller', 'prospect')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'interested')),
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: VEÍCULOS
-- =====================================================
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
    price DECIMAL(12,2) NOT NULL CHECK (price > 0),
    mileage INTEGER NOT NULL DEFAULT 0 CHECK (mileage >= 0),
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('Flex', 'Gasolina', 'Etanol', 'Diesel', 'GNV', 'Elétrico')),
    transmission VARCHAR(20) NOT NULL CHECK (transmission IN ('Manual', 'Automático', 'CVT', 'Semi-automático')),
    color VARCHAR(30) NOT NULL,
    doors INTEGER NOT NULL CHECK (doors >= 2 AND doors <= 6),
    city VARCHAR(50) NOT NULL,
    state VARCHAR(2) NOT NULL,
    plate_end VARCHAR(2),
    accepts_trade BOOLEAN DEFAULT false,
    licensed BOOLEAN DEFAULT true,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'maintenance')),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: IMAGENS DOS VEÍCULOS
-- =====================================================
CREATE TABLE vehicle_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: CARACTERÍSTICAS DOS VEÍCULOS
-- =====================================================
CREATE TABLE vehicle_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: ESPECIFICAÇÕES TÉCNICAS DOS VEÍCULOS
-- =====================================================
CREATE TABLE vehicle_specifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    motor VARCHAR(100),
    potencia VARCHAR(50),
    torque VARCHAR(50),
    combustivel VARCHAR(50),
    transmissao VARCHAR(50),
    tracao VARCHAR(50),
    consumo VARCHAR(50),
    aceleracao VARCHAR(50),
    velocidade VARCHAR(50),
    tanque VARCHAR(50),
    peso VARCHAR(50),
    comprimento VARCHAR(50),
    largura VARCHAR(50),
    altura VARCHAR(50),
    entre_eixos VARCHAR(50),
    porta_malas VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: VENDAS
-- =====================================================
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    sale_code VARCHAR(20) NOT NULL UNIQUE,
    price DECIMAL(12,2) NOT NULL CHECK (price > 0),
    commission_rate DECIMAL(5,2) DEFAULT 5.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
    commission_amount DECIMAL(12,2) GENERATED ALWAYS AS (price * commission_rate / 100) STORED,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('À vista', 'Financiamento', 'Consórcio', 'Leasing')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: INTERESSES DE CLIENTES
-- =====================================================
CREATE TABLE client_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    interest_level VARCHAR(20) NOT NULL DEFAULT 'low' CHECK (interest_level IN ('low', 'medium', 'high')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para veículos
CREATE INDEX idx_vehicles_brand_id ON vehicles(brand_id);
CREATE INDEX idx_vehicles_category_id ON vehicles(category_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_mileage ON vehicles(mileage);
CREATE INDEX idx_vehicles_city_state ON vehicles(city, state);
CREATE INDEX idx_vehicles_featured ON vehicles(featured);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at);

-- Índice de texto completo para busca
CREATE INDEX idx_vehicles_search ON vehicles USING gin(to_tsvector('portuguese', model || ' ' || color));

-- Índices para vendas
CREATE INDEX idx_sales_client_id ON sales(client_id);
CREATE INDEX idx_sales_vehicle_id ON sales(vehicle_id);
CREATE INDEX idx_sales_seller_id ON sales(seller_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);

-- Índices para clientes
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_cpf ON clients(cpf);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_type ON clients(client_type);

-- Índices para imagens
CREATE INDEX idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX idx_vehicle_images_primary ON vehicle_images(vehicle_id, is_primary);

-- Índices para características
CREATE INDEX idx_vehicle_features_vehicle_id ON vehicle_features(vehicle_id);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicle_specifications_updated_at BEFORE UPDATE ON vehicle_specifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMENTÁRIOS DAS TABELAS
-- =====================================================

COMMENT ON TABLE categories IS 'Categorias de veículos (Sedan, SUV, Hatchback, etc.)';
COMMENT ON TABLE brands IS 'Marcas de veículos (Toyota, Honda, etc.)';
COMMENT ON TABLE users IS 'Usuários administrativos do sistema';
COMMENT ON TABLE clients IS 'Clientes (compradores, vendedores, prospects)';
COMMENT ON TABLE vehicles IS 'Veículos disponíveis para venda';
COMMENT ON TABLE vehicle_images IS 'Imagens dos veículos';
COMMENT ON TABLE vehicle_features IS 'Características e opcionais dos veículos';
COMMENT ON TABLE vehicle_specifications IS 'Especificações técnicas dos veículos';
COMMENT ON TABLE sales IS 'Registro de vendas realizadas';
COMMENT ON TABLE client_interests IS 'Interesses de clientes em veículos específicos';
