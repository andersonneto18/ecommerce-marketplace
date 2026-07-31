# STP Market

Loja online de produtos de São Tomé e Príncipe para clientes em Portugal.

Especificação completa do produto em [`lojastp.md`](../lojastp.md) e plano de execução em [`passos.md`](../passos.md) (na raiz do repositório, um nível acima desta pasta).

## Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, React, Tailwind CSS, shadcn/ui
- **Backend**: Server Actions, Route Handlers e API Routes do Next.js
- **Base de dados**: PostgreSQL (Neon) + Prisma ORM (com `@prisma/adapter-pg`, ligação TCP standard — compatível com Neon e com Postgres local)
- **Autenticação admin**: Auth.js v5 (`next-auth`), provider Credentials, sessão JWT
- **Validação**: Zod
- **Pagamentos**: Stripe Checkout (adicionado no Passo 6)
- **Imagens**: Cloudinary (adicionado no Passo 7)
- **Emails**: Resend (adicionado no Passo 7)
- **Deploy**: Vercel

> Este projeto está atualmente no **Passo 3** do plano (`passos.md`): painel admin (login, dashboard, CRUD de produtos). Ainda sem loja pública, carrinho ou pagamentos.

## Como instalar

```bash
npm install
```

O `postinstall` corre automaticamente `prisma generate`.

## Como configurar o ambiente

1. Copiar o ficheiro de exemplo:

   ```bash
   cp .env.example .env
   ```

2. Preencher `DATABASE_URL` com a connection string do teu projeto [Neon](https://neon.tech) (formato `postgresql://...`).

   Para desenvolvimento local sem Neon, também podes usar `npx prisma dev` (Postgres local do próprio Prisma, sem Docker) e copiar a `DATABASE_URL` que o comando imprime.

3. Gerar `AUTH_SECRET`:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

4. Definir `ADMIN_EMAIL` e `ADMIN_PASSWORD` — são usados pelo seed (`npx prisma db seed`) para criar o utilizador administrador com password já cifrada (bcryptjs). É essa a conta usada para entrar em `/admin/login`.

## Como correr localmente

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Outros comandos úteis:

```bash
npm run build   # build de produção
npm run start   # correr a build de produção
npm run lint    # linting
```

Comandos Prisma:

```bash
npx prisma migrate dev   # criar/aplicar migrations em desenvolvimento
npx prisma db seed       # popular a base de dados com produtos de exemplo
npx prisma studio        # explorar a base de dados
```

## Painel Admin

Aceder a [http://localhost:3000/admin](http://localhost:3000/admin) — redireciona para `/admin/login`. Usa as credenciais definidas em `ADMIN_EMAIL`/`ADMIN_PASSWORD` (criadas pelo seed).

Depois de autenticado:

- `/admin/dashboard` — número de produtos, encomendas, total vendido, stock baixo
- `/admin/produtos` — listar, criar, editar e eliminar produtos

## Estrutura do projeto

```text
app/            rotas (App Router)
components/     componentes React (inclui components/ui do shadcn)
lib/            utilitários e clientes (prisma.ts, generated/)
hooks/          hooks React
types/          tipos TypeScript partilhados
prisma/         schema.prisma e migrations
```

## Como fazer deploy na Vercel

1. Criar um projeto na [Vercel](https://vercel.com) apontado para este repositório (definir a *root directory* como `stp-market/`, se o repositório incluir a documentação na raiz).
2. Configurar as variáveis de ambiente do projeto na Vercel (as mesmas do `.env`, começando por `DATABASE_URL`; mais variáveis serão adicionadas nos passos seguintes — Stripe, Cloudinary, Resend).
3. A Vercel corre `npm install` (que gera o Prisma Client via `postinstall`) e depois `npm run build` automaticamente.
4. Garantir que as migrations da base de dados Neon estão aplicadas antes ou durante o deploy (`npx prisma migrate deploy`).

Guia detalhado de deploy será expandido no Passo 8.
