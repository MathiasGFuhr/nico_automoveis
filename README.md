# 🚗 Nico Automóveis - Sistema Completo de Gestão

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</div>

<br>

<div align="center">
  <h3>🎯 Sistema completo para concessionária de veículos usados e seminovos</h3>
  <p>Plataforma moderna com painel administrativo, catálogo de veículos, gestão de clientes e relatórios avançados</p>
</div>

---

## ✨ **DESTAQUES DO PROJETO**

### 🎨 **Interface Moderna & Responsiva**
- **Design System** completo com Tailwind CSS
- **Animações fluidas** com Framer Motion
- **100% Responsivo** - Mobile First
- **Acessibilidade** (A11y) implementada
- **SEO Otimizado** com metadados completos

### 🚀 **Performance & Tecnologia**
- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Server & Client Components** otimizados
- **Image Optimization** automática
- **Lazy Loading** inteligente

### 🔐 **Sistema de Autenticação**
- **Middleware** de proteção de rotas
- **Sessões seguras** com cookies
- **Painel administrativo** exclusivo
- **Controle de acesso** granular

---

## 🏗️ **ARQUITETURA DO SISTEMA**

### 📱 **Frontend Público**
```
🏠 Landing Page
├── 🎯 Hero Section com animações
├── 🔍 Filtro de busca avançado
├── 🚗 Catálogo de veículos em destaque
├── 📞 Seção de contato
└── ℹ️ Páginas institucionais

🚗 Catálogo de Veículos
├── 🔍 Filtros dinâmicos
├── 📋 Listagem paginada
├── 🖼️ Galeria de imagens
├── 📊 Especificações técnicas
└── 💬 Formulário de interesse
```

### 🛠️ **Painel Administrativo**
```
📊 Dashboard
├── 📈 Métricas em tempo real
├── 🎯 Ações rápidas
└── 📋 Resumo de atividades

🚗 Gestão de Veículos
├── ➕ Adicionar veículo
├── ✏️ Editar informações
├── 🏷️ Categorias
├── 🖼️ Upload de imagens
└── 📊 Status e disponibilidade

👥 Gestão de Clientes
├── 👤 Cadastro completo
├── 🎯 Clientes interessados
├── 📞 Histórico de contatos
└── 💼 Perfil detalhado

💰 Gestão de Vendas
├── 📝 Registrar venda
├── 💰 Cálculo de comissões
├── 📊 Relatórios avançados
└── 📈 Analytics de performance
```

---

## 🚀 **TECNOLOGIAS UTILIZADAS**

### **Frontend**
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações e transições
- **Lucide React** - Biblioteca de ícones

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security** - Segurança de dados
- **Real-time subscriptions** - Atualizações em tempo real

### **Ferramentas & DevOps**
- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **Git** - Controle de versão
- **Vercel** - Deploy e hosting

---

## 📦 **INSTALAÇÃO E CONFIGURAÇÃO**

### **Pré-requisitos**
```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
```

### **1. Clone o repositório**
```bash
git clone https://github.com/MathiasGFuhr/nico_automoveis.git
cd nico_automoveis
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico
```

### **4. Execute o projeto**
```bash
npm run dev
```

Acesse: `http://localhost:3000`

---

## 🎯 **FUNCIONALIDADES PRINCIPAIS**

### **🌐 Site Público**
- ✅ **Landing Page** com hero animado
- ✅ **Catálogo de veículos** com filtros avançados
- ✅ **Páginas de detalhes** com galeria de imagens
- ✅ **Formulário de contato** integrado
- ✅ **SEO otimizado** para busca orgânica
- ✅ **Performance otimizada** (Core Web Vitals)

### **🛠️ Painel Administrativo**
- ✅ **Dashboard** com métricas em tempo real
- ✅ **Gestão de veículos** (CRUD completo)
- ✅ **Gestão de clientes** e leads
- ✅ **Sistema de vendas** com cálculos automáticos
- ✅ **Relatórios avançados** e analytics
- ✅ **Upload de imagens** otimizado
- ✅ **Autenticação segura** com middleware

### **📊 Analytics & Relatórios**
- ✅ **Métricas de vendas** por período
- ✅ **Performance de vendedores**
- ✅ **Top veículos** mais vendidos
- ✅ **Análise de comissões**
- ✅ **Exportação de dados**

---

## 🎨 **DESIGN SYSTEM**

### **Paleta de Cores**
```css
Primary: #3B82F6 (Azul)
Secondary: #6B7280 (Cinza)
Success: #10B981 (Verde)
Warning: #F59E0B (Amarelo)
Error: #EF4444 (Vermelho)
```

### **Tipografia**
- **Font Family**: Geist Sans (Sistema)
- **Headings**: 2xl, 3xl, 4xl, 5xl, 6xl
- **Body**: base, lg, xl
- **Weights**: 400, 500, 600, 700, 800

### **Componentes**
- **Cards** com shadow e hover effects
- **Buttons** com estados (hover, active, disabled)
- **Forms** com validação visual
- **Modals** com animações suaves
- **Tables** responsivas e interativas

---

## 📱 **RESPONSIVIDADE**

### **Breakpoints**
```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### **Adaptações**
- **Mobile**: Menu hambúrguer, cards empilhados
- **Tablet**: Grid 2 colunas, sidebar colapsável
- **Desktop**: Layout completo, sidebar fixa

---

## 🔐 **SEGURANÇA**

### **Autenticação**
- **Middleware** de proteção de rotas
- **Sessões seguras** com cookies httpOnly
- **Validação** de credenciais no servidor
- **Logout automático** por inatividade

### **Dados**
- **Row Level Security** no Supabase
- **Validação** de inputs no frontend e backend
- **Sanitização** de dados de entrada
- **CORS** configurado adequadamente

---

## 🚀 **DEPLOY**

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Configurações de Produção**
- ✅ **Domínio personalizado**
- ✅ **SSL automático**
- ✅ **CDN global**
- ✅ **Analytics integrado**

---

## 📈 **PERFORMANCE**

### **Métricas Otimizadas**
- **Lighthouse Score**: 95+
- **Core Web Vitals**: Verde
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### **Otimizações Implementadas**
- ✅ **Image Optimization** com Next.js
- ✅ **Lazy Loading** de componentes
- ✅ **Code Splitting** automático
- ✅ **Bundle Analysis** otimizado
- ✅ **Caching** estratégico

---

## 🤝 **CONTRIBUIÇÃO**

### **Como Contribuir**
1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### **Padrões de Código**
- **ESLint** configurado
- **Prettier** para formatação
- **Conventional Commits** para mensagens
- **TypeScript** strict mode

---

## 📄 **LICENÇA**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 **EQUIPE**

<div align="center">
  <p><strong>Desenvolvido com ❤️ para Nico Automóveis</strong></p>
  <p>Transformando ideias em soluções digitais</p>
</div>

---

## 📞 **SUPORTE**

- **Email**: contato@nicoautomoveis.com
- **WhatsApp**: (55) 9 9712-1218
- **Localização**: Santo Cristo - RS

---

<div align="center">
  <p>⭐ <strong>Se este projeto te ajudou, considere dar uma estrela!</strong> ⭐</p>
  <p>Feito com ❤️ e muito ☕</p>
</div>