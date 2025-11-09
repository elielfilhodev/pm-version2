# 🚀 Guia Rápido de Início

## Passo a Passo para Começar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados

1. Crie uma conta no [Neon](https://neon.tech) (gratuito)
2. Crie um novo projeto PostgreSQL
3. Copie a connection string fornecida

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="sua-connection-string-do-neon"
NEXTAUTH_SECRET="gere-uma-string-aleatoria-aqui"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
NEXT_PUBLIC_WHATSAPP_NUMBER="5511999999999"
```

**Dica**: Para gerar um NEXTAUTH_SECRET seguro, use:
```bash
openssl rand -base64 32
```

### 4. Configurar o Banco de Dados

```bash
# Gerar Prisma Client
npm run db:generate

# Criar tabelas no banco
npm run db:push

# Popular com dados iniciais
npm run db:seed
```

### 5. Iniciar o Servidor

```bash
npm run dev
```

### 6. Acessar a Aplicação

- **Site Público**: http://localhost:3000
- **Painel Admin**: http://localhost:3000/admin
  - Usuário: `admin`
  - Senha: `admin123`

## 📝 Próximos Passos

1. **Altere as credenciais do admin** após o primeiro login
2. **Configure o número do WhatsApp** no arquivo `.env`
3. **Adicione categorias** no painel admin
4. **Cadastre seus produtos** com imagens (URLs)
5. **Personalize** cores e textos conforme necessário

## 🎨 Adicionar Produtos

1. Acesse o painel admin
2. Vá em "Categorias" e crie as categorias necessárias
3. Vá em "Novo Produto" e preencha:
   - Nome do produto
   - Descrição
   - Preço
   - Categoria
   - URLs das imagens (você pode usar serviços como Imgur, Cloudinary, etc.)
   - Marque como "Novo" se for um lançamento
   - Marque "Em Estoque" se estiver disponível

## 💡 Dicas

- **Imagens**: Use URLs de imagens hospedadas (Imgur, Google Drive, Cloudinary, etc.)
- **WhatsApp**: O número deve estar no formato: código do país + DDD + número (sem espaços)
- **Produção**: Altere todas as credenciais padrão antes de fazer deploy!

