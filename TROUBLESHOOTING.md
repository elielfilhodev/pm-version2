# 🔧 Guia de Troubleshooting

## Erro 500 no Login

Se você está recebendo erro 500 ao tentar fazer login, siga estes passos:

### 1. Verificar Conexão com Banco de Dados

Acesse: `http://localhost:3000/api/admin/test`

Isso vai mostrar:
- Se o banco está conectado
- Quantos admins existem
- Lista de admins cadastrados

### 2. Verificar Variáveis de Ambiente

Certifique-se de que o arquivo `.env` contém:

```env
DATABASE_URL="sua-connection-string-do-neon"
NEXTAUTH_SECRET="uma-string-aleatoria-segura"
```

### 3. Executar Seed do Banco

Certifique-se de que o admin foi criado:

```bash
npm run db:seed
```

Isso vai criar/atualizar o admin com:
- Usuário: `adnaluana` (ou o valor de `ADMIN_USERNAME`)
- Senha: `310824` (ou o valor de `ADMIN_PASSWORD`)

### 4. Verificar Prisma Client

Certifique-se de que o Prisma Client foi gerado:

```bash
npm run db:generate
```

### 5. Verificar Logs do Servidor

No terminal onde o servidor está rodando, você verá mensagens como:
- "Admin não encontrado: [username]" - significa que o usuário não existe
- "Senha inválida para usuário: [username]" - significa que a senha está errada
- Erros do Prisma - problemas de conexão com o banco

### 6. Problemas Comuns

#### Admin não existe no banco
**Solução**: Execute `npm run db:seed`

#### DATABASE_URL incorreto
**Solução**: Verifique a connection string do Neon. Deve estar no formato:
```
postgresql://user:password@host:5432/database?sslmode=require
```

#### Prisma Client não gerado
**Solução**: Execute `npm run db:generate` e depois `npm run build`

#### Erro de conexão
**Solução**: 
- Verifique se o banco Neon está ativo
- Verifique se a connection string está correta
- Verifique se há firewall bloqueando a conexão

### 7. Resetar Admin

Se precisar resetar o admin:

```bash
# Conectar ao banco e deletar o admin (ou usar Prisma Studio)
npx prisma studio

# Depois executar o seed novamente
npm run db:seed
```

### 8. Verificar no Vercel

Se o erro está acontecendo no Vercel:

1. Verifique as variáveis de ambiente no painel do Vercel
2. Certifique-se de que `DATABASE_URL` está configurado
3. Verifique os logs de build e runtime no Vercel
4. Certifique-se de que o Prisma Client está sendo gerado (já configurado no `package.json`)

## Erro: Prisma Client não encontrado

Se você vê erro sobre Prisma Client:

```bash
npm run db:generate
npm run build
```

## Erro: Cannot find module '@prisma/client'

```bash
npm install
npm run db:generate
```

