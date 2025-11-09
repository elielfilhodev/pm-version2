# 🚀 Configuração no Vercel

## Passos para Deploy no Vercel

### 1. Variáveis de Ambiente

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

#### Obrigatórias:

- `DATABASE_URL` - Connection string do Neon PostgreSQL
  - Exemplo: `postgresql://user:password@host:5432/database?sslmode=require`
- `NEXTAUTH_SECRET` - String aleatória segura para JWT

  - Gere com: `openssl rand -base64 32`
  - Ou use: https://generate-secret.vercel.app/32

- `NEXTAUTH_URL` - URL da sua aplicação

  - Exemplo: `https://pm-version2.vercel.app`

- `SETUP_SECRET` - Chave secreta para criar admin via API (opcional, mas recomendado)
  - Gere uma string aleatória
  - Use esta chave na rota `/api/admin/setup` para criar o admin

#### Opcionais (com valores padrão):

- `ADMIN_USERNAME` - Usuário do admin (padrão: `adnaluana`)
- `ADMIN_PASSWORD` - Senha do admin (padrão: `310824`)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - Número do WhatsApp (padrão: `5511999999999`)

### 2. Configurar o Banco de Dados

Após o primeiro deploy, você precisa:

1. **Criar as tabelas no banco:**

   - Conecte-se ao banco Neon via terminal ou use Prisma Studio localmente
   - Execute: `npx prisma db push` (localmente com DATABASE_URL do Neon)
   - Ou use o Prisma Studio: `npx prisma studio`

2. **Criar o admin inicial:**

   **Opção A - Via API (Recomendado):**

   Faça uma requisição POST para criar o admin:

   ```bash
   curl -X POST https://seu-app.vercel.app/api/admin/setup \
     -H "Content-Type: application/json" \
     -d '{
       "username": "adnaluana",
       "password": "310824",
       "secret": "setup-secret-change-in-production"
     }'
   ```

   Ou use o Postman/Insomnia:

   - URL: `https://seu-app.vercel.app/api/admin/setup`
   - Method: POST
   - Body (JSON):
     ```json
     {
       "username": "adnaluana",
       "password": "310824",
       "secret": "setup-secret-change-in-production"
     }
     ```

   **Opção B - Localmente:**

   Execute localmente: `npm run db:seed` (com DATABASE_URL do Neon configurado)

   **Opção C - Prisma Studio:**

   Crie manualmente no banco usando Prisma Studio: `npx prisma studio`

### 3. Verificar Build

O build já está configurado para:

- Gerar Prisma Client automaticamente (`postinstall` script)
- Executar `prisma generate` antes do build

### 4. Testar a Aplicação

Após o deploy:

1. **Testar conexão com banco:**

   - Acesse: `https://seu-app.vercel.app/api/admin/test`
   - Deve retornar informações sobre o banco e admins

2. **Fazer login:**
   - Acesse: `https://seu-app.vercel.app/admin`
   - Use as credenciais configuradas

### 5. Troubleshooting

#### Erro 500 no Login

1. **Verifique as variáveis de ambiente no Vercel**

   - Certifique-se de que `DATABASE_URL` está configurada
   - Verifique se `NEXTAUTH_SECRET` está configurado

2. **Verifique se o admin existe:**

   - Acesse `/api/admin/test` para ver se há admins no banco
   - Se não houver, execute o seed localmente apontando para o banco do Neon

3. **Verifique os logs do Vercel:**
   - Vá em **Deployments > [seu deploy] > Runtime Logs**
   - Procure por erros relacionados ao Prisma ou banco de dados

#### Erro: Prisma Client não encontrado

O `package.json` já está configurado com:

- `postinstall: prisma generate` - Gera o client após instalação
- `build: prisma generate && next build` - Gera antes do build

Se ainda assim der erro, verifique se o Prisma está nas dependências.

#### Admin não existe

Execute localmente (com DATABASE_URL do Neon):

```bash
# Configure a DATABASE_URL do Neon no .env local
DATABASE_URL="postgresql://..."

# Execute o seed
npm run db:seed
```

### 6. Atualizar Admin Existente

Se precisar atualizar a senha do admin:

```bash
# Localmente, com DATABASE_URL do Neon
npm run db:seed
```

Isso vai atualizar a senha do admin existente.

## Checklist de Deploy

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] DATABASE_URL apontando para o banco Neon
- [ ] NEXTAUTH_SECRET configurado
- [ ] NEXTAUTH_URL configurado com a URL do Vercel
- [ ] Tabelas criadas no banco (db:push)
- [ ] Admin criado no banco (db:seed)
- [ ] Build passou com sucesso
- [ ] Teste de conexão funcionando (/api/admin/test)
- [ ] Login funcionando

## Comandos Úteis

```bash
# Gerar Prisma Client
npm run db:generate

# Criar/atualizar tabelas
npx prisma db push

# Popular banco com dados iniciais
npm run db:seed

# Abrir Prisma Studio (interface visual)
npx prisma studio
```
