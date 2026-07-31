# STP Market — Guia de Instruções do Projeto

Este ficheiro é o guia de trabalho para desenvolver o **STP Market**, uma loja online de produtos de São Tomé e Príncipe para clientes em Portugal. Especificação completa em [lojastp.md](lojastp.md), plano de execução passo a passo em [passos.md](passos.md).

## Como trabalhar neste projeto

- Seguir os passos de `passos.md` **pela ordem definida** (Passo 1 → Passo 8). Não avançar passos sem confirmação do utilizador.
- Em cada passo, implementar **apenas** o que esse passo pede. O Passo 1, por exemplo, é só fundação — não criar funcionalidades de loja, carrinho ou pagamentos antes de tempo.
- Antes de avançar para o próximo passo, confirmar com o utilizador que o atual está concluído e testado.
- Atualizar a secção "Progresso" abaixo à medida que os passos forem concluídos.

## Stack obrigatória

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, React, Tailwind CSS, shadcn/ui |
| Backend | Server Actions, Route Handlers, API Routes do próprio Next.js |
| Base de dados | PostgreSQL (Neon) + Prisma ORM |
| Pagamentos | Stripe Checkout |
| Imagens | Cloudinary |
| Emails | Resend |
| Validação | Zod |
| Deploy | Vercel |

## Convenções e decisões técnicas

- **Hashing de password**: usar `bcryptjs` (não `bcrypt`) — evita problemas de build/native bindings em ambiente serverless/edge da Vercel.
- **Autenticação admin**: Auth.js v5 (`next-auth@beta`) com provider Credentials (email/password, bcryptjs), sessão JWT. Config dividida em `auth.config.ts` (edge-safe, usado pelo `middleware.ts`) e `auth.ts` (config completa com Prisma/bcrypt, usado no route handler e nas Server Components/Actions) — evita bundlar Prisma/bcrypt no runtime edge do middleware. Rotas `/admin/*` protegidas pelo `middleware.ts`; `/admin/login` fica fora do route group `(painel)` para não herdar o layout com sidebar.
- **shadcn/ui**: este projeto usa o estilo `base-nova` (assente em `@base-ui/react`, não Radix). Para renderizar outro elemento dentro de `Button`/`AlertDialogTrigger`/etc. usar a prop `render={<Link ... />}` (+ `nativeButton={false}` quando o alvo não é um `<button>`), **não** `asChild` (isso é Radix).
- **Prisma**: ligação sempre via singleton em `lib/prisma.ts` para evitar múltiplas conexões em desenvolvimento. Usa Prisma 7 com o driver adapter `@prisma/adapter-pg` (ligação TCP standard) — funciona com a connection string direta da Neon e com Postgres local; evitar `@prisma/adapter-neon` (driver websocket) a menos que se corra em runtime edge.
- **Validação**: todos os inputs (formulários, API routes, server actions) devem passar por schemas Zod.
- **Segurança**: nunca expor chaves privadas no cliente; variáveis sensíveis só em `.env` (nunca commitadas); rotas `/admin` sempre protegidas por middleware/verificação de sessão.
- **Carrinho**: estado inicial em `localStorage` (sem backend), preparado para evoluir depois.

## Estrutura de pastas alvo

```text
stp-market/
├── app/
│   ├── page.tsx
│   ├── loja/page.tsx
│   ├── produto/[slug]/page.tsx
│   ├── carrinho/page.tsx
│   ├── checkout/page.tsx
│   ├── sucesso/page.tsx
│   ├── admin/
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── produtos/
│   │   └── encomendas/
│   └── api/
│       └── stripe/webhook/
├── components/
│   ├── ProductCard.tsx
│   ├── CategoryCard.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── Cart.tsx
├── lib/
│   ├── prisma.ts
│   ├── stripe.ts
│   └── cloudinary.ts
├── hooks/
├── types/
└── prisma/
    └── schema.prisma
```

## Modelos Prisma (resumo)

`User` (admin) · `Category` · `Product` · `Customer` · `Order` (status: PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED) · `OrderItem`

Detalhes completos dos campos e relações em [lojastp.md](lojastp.md#base-de-dados-prisma).

## Progresso

- [x] Passo 1 — Base do projeto (Next.js + Neon + Prisma)
- [x] Passo 2 — Base de dados e modelos
- [x] Passo 3 — Painel Admin
- [ ] Passo 4 — Loja pública
- [ ] Passo 5 — Carrinho
- [ ] Passo 6 — Stripe Checkout
- [ ] Passo 7 — Cloudinary + Emails
- [ ] Passo 8 — Deploy Vercel
