# 🚗 Documentação do Supabase - Nico Automóveis

Esta documentação contém todos os arquivos SQL necessários para configurar o banco de dados do sistema Nico Automóveis.

## 📁 Estrutura dos Arquivos

### 1. `01-database-schema.sql`
**Schema completo do banco de dados**
- Criação de todas as tabelas
- Relacionamentos entre entidades
- Índices para performance
- Triggers para updated_at
- Constraints e validações

### 2. `02-initial-data.sql`
**Dados iniciais para popular o banco**
- Categorias de veículos
- Marcas de veículos
- Usuários administrativos
- Clientes de exemplo
- Veículos de exemplo
- Imagens dos veículos
- Características e especificações
- Vendas de exemplo
- Interesses de clientes

### 3. `03-rls-policies.sql`
**Políticas de segurança (Row Level Security)**
- Habilitar RLS em todas as tabelas
- Políticas de acesso por tipo de usuário
- Funções auxiliares para RLS
- Comentários explicativos

### 4. `04-optimize-vehicle-features.sql`
**Otimização de características de veículos**
- Tabela de características únicas para evitar duplicações
- Categorização de características (Segurança, Conforto, Tecnologia)
- Funções auxiliares para gerenciar características
- View otimizada para consultas

## 🚀 Como Executar

### 1. Configurar Variáveis de Ambiente
Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
DATABASE_URL=your_database_url_here
```

### 2. Executar no Supabase Dashboard
1. Acesse o Supabase Dashboard
2. Vá para SQL Editor
3. Execute os arquivos na seguinte ordem:
   - `01-database-schema.sql`
   - `04-optimize-vehicle-features.sql` (executar antes dos dados iniciais)
   - `02-initial-data.sql`
   - `03-rls-policies.sql`

### 3. Verificar Configuração
Após executar os scripts, verifique se:
- Todas as tabelas foram criadas
- Os dados iniciais foram inseridos
- As políticas RLS estão ativas
- Os usuários administrativos foram criados

## 📊 Estrutura do Banco

### Tabelas Principais
- **categories** - Categorias de veículos (Sedan, SUV, etc.)
- **brands** - Marcas de veículos (Toyota, Honda, etc.)
- **users** - Usuários administrativos
- **clients** - Clientes (compradores, vendedores, prospects)
- **vehicles** - Veículos disponíveis
- **sales** - Registro de vendas
- **client_interests** - Interesses de clientes

### Tabelas de Suporte
- **vehicle_images** - Imagens dos veículos
- **vehicle_features** - Características dos veículos
- **vehicle_feature_types** - Tipos únicos de características (evita duplicações)
- **vehicle_specifications** - Especificações técnicas

## 🔐 Segurança

### Políticas RLS Implementadas
- **Público**: Categorias, marcas, veículos, clientes (leitura)
- **Autenticado**: Criação e edição de registros
- **Admin/Manager**: Exclusão e gerenciamento completo

### Níveis de Acesso
- **Admin**: Acesso total ao sistema
- **Manager**: Gerenciamento de vendas e clientes
- **Seller**: Operações de venda

## 📈 Performance

### Índices Criados
- Busca por marca, categoria, status
- Filtros por preço, ano, quilometragem
- Busca de texto completo
- Relacionamentos entre tabelas

### Otimizações
- Triggers automáticos para updated_at
- Índices compostos para consultas complexas
- Validações no nível de banco

## 🔄 Migração de Dados

### Dados Mock → Supabase
Os dados estáticos do projeto foram migrados para:
- 8 veículos de exemplo
- 4 clientes de exemplo
- 4 vendas de exemplo
- Categorias e marcas populares
- Especificações técnicas completas

## 📝 Próximos Passos

1. **Configurar autenticação** no frontend
2. **Implementar hooks** para consultas
3. **Criar serviços** para operações CRUD
4. **Implementar upload** de imagens
5. **Configurar notificações** em tempo real

## 🆘 Suporte

Em caso de problemas:
1. Verifique as variáveis de ambiente
2. Confirme se o Supabase está ativo
3. Execute os scripts na ordem correta
4. Verifique os logs do Supabase Dashboard
