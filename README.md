# Proenca's Moda - Catálogo de Roupas Femininas

Site moderno e responsivo para catálogo de roupas femininas desenvolvido com Next.js, PostgreSQL (Neon) e Tailwind CSS.

## 🚀 Funcionalidades

- **Catálogo Público**: Visualização de produtos com design moderno e responsivo
- **Painel Administrativo**: Sistema completo de gerenciamento de produtos
- **Autenticação**: Login seguro para administradores
- **CRUD de Produtos**: Criar, editar, visualizar e excluir produtos
- **Gerenciamento de Categorias**: Organize produtos por categorias (Plus Size, Vestidos, etc.)
- **Integração WhatsApp**: Botão de encomenda que redireciona para WhatsApp
- **Controle de Estoque**: Marque produtos como disponíveis ou esgotados
- **Produtos Novos**: Destaque para produtos recém-lançados

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Neon (PostgreSQL) ou outro banco PostgreSQL
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório e instale as dependências:**

```bash
npm install
```

2. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-key-aqui-mude-em-producao

# Admin Credentials (default)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# WhatsApp (número com código do país, sem + e sem espaços)
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

3. **Configure o banco de dados:**

```bash
# Gerar o Prisma Client
npm run db:generate

# Criar as tabelas no banco
npm run db:push

# Popular com dados iniciais (admin e categorias)
npm run db:seed
```

4. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

5. **Acesse a aplicação:**

- Site público: http://localhost:3000
- Painel admin: http://localhost:3000/admin
  - Usuário padrão: `admin`
  - Senha padrão: `admin123`

## 📁 Estrutura do Projeto

```
proencasmodav2/
├── app/
│   ├── api/
│   │   └── admin/          # Rotas da API para admin
│   ├── admin/              # Página do painel admin
│   ├── globals.css         # Estilos globais
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página inicial (catálogo)
├── components/
│   ├── admin/              # Componentes do painel admin
│   └── ProductCard.tsx     # Card de produto
├── lib/
│   ├── auth.ts             # Funções de autenticação
│   ├── prisma.ts           # Cliente Prisma
│   └── utils.ts            # Funções utilitárias
├── prisma/
│   ├── schema.prisma       # Schema do banco de dados
│   └── seed.ts             # Script de seed
└── package.json
```

## 🎨 Tecnologias Utilizadas

- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização moderna e responsiva
- **Prisma**: ORM para PostgreSQL
- **Neon**: Banco de dados PostgreSQL serverless
- **bcryptjs**: Hash de senhas
- **jsonwebtoken**: Autenticação JWT
- **Lucide React**: Ícones modernos

## 🔐 Segurança

- Senhas são hasheadas com bcrypt
- Autenticação via JWT
- Rotas da API protegidas
- Validação de dados no servidor

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:
- 📱 Dispositivos móveis
- 💻 Tablets
- 🖥️ Desktops

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outros provedores

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- AWS
- DigitalOcean

## 📝 Notas Importantes

- **Imagens**: Atualmente, o sistema aceita URLs de imagens. Para upload de arquivos, você precisará integrar com um serviço como Cloudinary, AWS S3 ou similar.
- **WhatsApp**: Configure o número do WhatsApp no arquivo `.env` com o formato: código do país + DDD + número (sem espaços ou caracteres especiais).
- **Admin Padrão**: Altere as credenciais padrão do admin em produção!

## 🤝 Contribuindo

Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto é privado e pertence à Proenca's Moda.

---

Desenvolvido com ❤️ para Proenca's Moda

