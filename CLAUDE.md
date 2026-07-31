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
| Emails | Brevo |
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
- **Route groups**: a loja pública vive em `app/(loja)/` (layout com Navbar+Footer) e o admin autenticado em `app/admin/(painel)/` (layout com sidebar); `admin/login` fica fora do grupo `(painel)`. Os parênteses não afetam os URLs finais (`/`, `/loja`, `/admin/dashboard`, etc.). `checkout` e `sucesso` também vivem em `app/(loja)/` porque precisam do `CartProvider` montado nesse layout.
- **Stripe**: cliente criado de forma preguiçosa em `lib/stripe.ts` (`getStripe()`, não uma instância a nível de módulo) — instanciar `new Stripe(...)` no topo do módulo falha o build (`next build` importa as rotas para recolher metadados) sempre que `STRIPE_SECRET_KEY` estiver vazio, como acontece em desenvolvimento sem conta Stripe configurada. Preços dos line items do Checkout Session são sempre recalculados a partir da BD no servidor (nunca confiar no preço que vem do carrinho/cliente). `Order.stripePaymentId` tem constraint `@unique` para o webhook ser idempotente em reentregas do mesmo evento.
- **Páginas públicas com dados da BD**: usar `export const dynamic = "force-dynamic"` (ex: homepage) em vez de deixar o Next pré-renderizar estaticamente no build — evita falhas de build se a BD estiver indisponível nesse momento e garante stock/preços sempre atuais. Páginas com `searchParams` (ex: `/loja`) já são dinâmicas automaticamente.
- **Emails**: usar **Brevo** (pedido explícito do utilizador no Passo 7, substitui o Resend previsto em `lojastp.md`/`passos.md`). Chamada direta à REST API da Brevo (`lib/email/brevo.ts`, `fetch` para `api.brevo.com`) em vez de instalar o SDK — evita mais um cliente instanciado a nível de módulo (o mesmo problema que já aconteceu com o Stripe) e mantém a dependência mínima. Variável de ambiente: `BREVO_API_KEY`. Templates em `lib/email/templates.ts`, funções de envio em `lib/email/send.ts`; confirmação de compra e aviso ao admin (com morada completa, para preparar o envio) disparados no webhook Stripe após criar a `Order`; email de atualização de estado disparado em `admin/encomendas/[id]` ao mudar o estado.
- **Cloudinary**: `lib/cloudinary.ts` configura o SDK a nível de módulo (ao contrário do Stripe, `cloudinary.config()` não lança erro com credenciais vazias, só falha quando se tenta mesmo fazer upload — por isso não precisa do padrão "lazy client"). Upload feito no servidor (`uploadProductImage` em `app/admin/(painel)/produtos/actions.ts`, via data URI base64) nunca no cliente, para não expor `CLOUDINARY_SECRET`. O campo de imagem no `ProductForm` mantém sempre um input de URL manual como alternativa ao upload.
- **Base UI `Select` + label não-óbvia**: quando o `value` de um `SelectItem` não é já um texto legível (ex: um enum como `PAID`), passar a função de formatação a `<SelectValue>{(value) => label[value]}</SelectValue>` — a resolução automática da label a partir do texto do `SelectItem` nem sempre acontece antes do primeiro render (ver `components/admin/OrderStatusSelect.tsx`).
- **Gestão de encomendas**: `admin/encomendas` (lista) e `admin/encomendas/[id]` (detalhe: dados completos do cliente + mudar estado) foram adicionados fora da sequência de passos, a pedido direto do utilizador — não estavam em nenhum passo do plano até aqui, mas fecham o ciclo de "admin recebe morada completa e prepara o envio" e dão finalmente um trigger ao email de atualização de estado.

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
- [x] Passo 4 — Loja pública
- [x] Passo 5 — Carrinho
- [x] Passo 6 — Stripe Checkout
- [x] Passo 7 — Cloudinary + Emails
- [ ] Passo 8 — Deploy Vercel
