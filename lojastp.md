# Projeto: STP Market — Loja Online de Produtos de São Tomé e Príncipe

## Contexto

Criar uma plataforma de e-commerce chamada **STP Market**, uma loja online especializada em produtos de São Tomé e Príncipe para clientes em Portugal.

A primeira versão será um MVP com um único administrador que gere os produtos, stock e encomendas.

O objetivo futuro é evoluir para um marketplace onde produtores e vendedores santomenses possam criar as suas próprias lojas.

---

# Stack obrigatória

## Frontend

* Next.js 15
* App Router
* TypeScript
* React
* Tailwind CSS
* shadcn/ui
* Responsive design mobile-first

## Backend

Usar o próprio Next.js:

* Server Actions
* Route Handlers
* API Routes quando necessário

## Base de dados

Usar:

* PostgreSQL Neon
* Prisma ORM

Configuração:

```
Next.js
   |
Prisma
   |
Neon PostgreSQL
```

## Deploy

Preparar para:

* Vercel

## Serviços externos

Pagamentos:

* Stripe Checkout

Imagens:

* Cloudinary

Emails:

* Resend

Validação:

* Zod

---

# Objetivo da aplicação

Permitir:

1. Administrador publicar produtos
2. Cliente navegar pela loja
3. Cliente adicionar produtos ao carrinho
4. Cliente preencher morada
5. Cliente pagar com Stripe
6. Sistema criar encomenda
7. Administrador gerir envio

---

# Identidade visual

Criar uma interface premium inspirada em São Tomé:

Características:

* Tropical
* Artesanal
* Africana
* Elegante
* Produtos naturais

Categorias principais:

* Café
* Cacau
* Chocolate
* Produtos da roça
* Artesanato
* Cultura
* Presentes

---

# Estrutura do projeto

Criar:

```
stp-market/

app/

 ├── page.tsx

 ├── loja/
 │    └── page.tsx

 ├── produto/
 │    └── [slug]/
 │          └── page.tsx

 ├── carrinho/
 │    └── page.tsx

 ├── checkout/
 │    └── page.tsx

 ├── sucesso/
 │    └── page.tsx


 ├── admin/

 │    ├── login/
 │    ├── dashboard/
 │    ├── produtos/
 │    ├── encomendas/


components/

 ├── ProductCard.tsx
 ├── Navbar.tsx
 ├── Footer.tsx
 ├── Cart.tsx


lib/

 ├── prisma.ts
 ├── stripe.ts
 ├── cloudinary.ts


prisma/

 └── schema.prisma
```

---

# Base de dados Prisma

Criar os seguintes modelos:

## Admin/User

```prisma
model User {
 id String @id @default(cuid())
 email String @unique
 password String
 role String
 createdAt DateTime @default(now())
}
```

---

## Produto

```prisma
model Product {

id String @id @default(cuid())

name String

slug String @unique

description String

price Float

imageUrl String

stock Int

active Boolean @default(true)

categoryId String

category Category @relation(fields:[categoryId], references:[id])

createdAt DateTime @default(now())

}
```

---

## Categoria

```prisma
model Category {

id String @id @default(cuid())

name String

products Product[]

}
```

---

## Cliente

```prisma
model Customer {

id String @id @default(cuid())

name String

email String

phone String

address String

city String

postalCode String

country String

orders Order[]

}
```

---

## Encomenda

```prisma
model Order {

id String @id @default(cuid())

customerId String

customer Customer @relation(fields:[customerId], references:[id])

stripePaymentId String?

total Float

status String

items OrderItem[]

createdAt DateTime @default(now())

}
```

---

## Produtos da encomenda

```prisma
model OrderItem {

id String @id @default(cuid())

orderId String

order Order @relation(fields:[orderId], references:[id])

productId String

product Product @relation(fields:[productId], references:[id])

quantity Int

price Float

}
```

---

# Área pública

## Homepage

Criar:

* Hero banner
* Produtos destacados
* Categorias
* História dos produtos de STP
* Botão "Comprar agora"

---

## Loja

Funcionalidades:

* Listar produtos
* Pesquisa
* Filtro por categoria
* Ordenação por preço

Cada produto:

* Foto
* Nome
* Preço
* Stock
* Botão adicionar

---

## Página produto

Mostrar:

* Imagem grande
* Descrição completa
* Informação cultural do produto
* Preço
* Quantidade
* Adicionar ao carrinho

---

# Carrinho

Guardar produtos:

* LocalStorage inicialmente

Mostrar:

* Produtos
* Quantidade
* Subtotal
* Total

Botão:

"Finalizar compra"

---

# Checkout

Campos:

Nome completo

Email

Telefone

Morada:

* Rua
* Número
* Código postal
* Cidade
* País

Depois criar Stripe Checkout.

---

# Integração Stripe

Fluxo:

Cliente

↓

Checkout

↓

Stripe Payment

↓

Pagamento confirmado

↓

Webhook Stripe

↓

Criar Order na base de dados

↓

Enviar email

---

Criar:

```
/api/stripe/webhook
```

Validar assinatura Stripe.

---

# Painel Admin

Criar autenticação.

## Dashboard

Mostrar:

* Total vendas
* Total encomendas
* Produtos vendidos
* Produtos com pouco stock

---

# Gestão de produtos

CRUD completo:

Criar:

* Nome
* Descrição
* Categoria
* Preço
* Stock
* Upload imagem Cloudinary

Editar:

* Produto
* Preço
* Stock

Eliminar:

* Produto

---

# Gestão encomendas

Tabela:

Mostrar:

* Cliente
* Produtos
* Total
* Data
* Estado

Estados:

```
PENDING
PAID
PROCESSING
SHIPPED
DELIVERED
CANCELLED
```

---

# Emails

Usar Resend.

Enviar:

## Cliente

Confirmação de compra.

## Admin

Nova encomenda recebida.

---

# Segurança

Implementar:

* Password hashing
* Proteção rotas admin
* Validação Zod
* Sanitização inputs
* Environment variables
* Nunca expor chaves privadas

Criar:

```
.env.example
```

Com:

```
DATABASE_URL=

STRIPE_SECRET_KEY=

NEXT_PUBLIC_STRIPE_KEY=

CLOUDINARY_NAME=

CLOUDINARY_KEY=

CLOUDINARY_SECRET=

RESEND_API_KEY=
```

---

# Melhorias futuras deixar preparado

Arquitetura preparada para:

* Multi vendedores
* Comissão por venda
* Reviews
* Wishlist
* Cupões
* Tracking de entrega
* Área do cliente
* Aplicação mobile React Native

---

# Entregar

Gerar:

1. Projeto Next.js completo
2. Prisma schema
3. Migrations
4. Seed com produtos exemplo
5. Componentes UI
6. Integração Stripe
7. Upload Cloudinary
8. Sistema admin
9. README completo
10. Guia deploy Vercel + Neon PostgreSQL
