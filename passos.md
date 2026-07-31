PASSO 1 — Criar a base do projeto Next.js + Neon + Prisma

Cria o projeto base do STP Market.

Objetivo:
Criar uma aplicação e-commerce usando Next.js 15 preparada para produção.

Stack

Usar:

Next.js 15
App Router
TypeScript
Tailwind CSS
shadcn/ui
Prisma ORM
PostgreSQL Neon
Configuração inicial

Criar:

Projeto Next.js
Estrutura de pastas organizada
Configuração ESLint
Configuração Tailwind
Configuração shadcn/ui
Instalar dependências:
Prisma
@prisma/client
Zod
React Hook Form
bcrypt
dotenv
Configurar Prisma

Criar:

/prisma/schema.prisma

Configurar ligação PostgreSQL usando:

DATABASE_URL

Criar ficheiro:

.env.example

Com:

DATABASE_URL=

Criar estrutura:

app/
components/
lib/
hooks/
prisma/
types/

Criar ligação Prisma:

lib/prisma.ts

Usar singleton para evitar múltiplas conexões em desenvolvimento.

Criar README inicial

Explicar:

Como instalar
Como configurar ambiente
Como correr localmente
Como fazer deploy na Vercel

Não criar funcionalidades ainda.

Apenas preparar a fundação do projeto.

PASSO 2 — Criar Base de Dados e Modelos

Agora cria a base de dados do STP Market usando Prisma.

Criar os seguintes modelos:

User

Para administradores.

Campos:

id
email
password
role
createdAt
Category

Categorias dos produtos.

Campos:

id
name
slug
Product

Produtos da loja.

Campos:

id
name
slug
description
price
imageUrl
stock
active
categoryId
createdAt
Customer

Clientes.

Campos:

id
name
email
phone
address
city
postalCode
country
Order

Encomendas.

Campos:

id
customerId
stripePaymentId
total
status
createdAt

Estados:

PENDING
PAID
PROCESSING
SHIPPED
DELIVERED
CANCELLED

OrderItem

Produtos dentro da encomenda.

Campos:

id
orderId
productId
quantity
price

Criar:

Relações Prisma
Migration inicial
Seed com produtos de exemplo:

Produtos:

Café de São Tomé
Chocolate artesanal
Cacau
Artesanato

Criar comandos:

prisma migrate
prisma seed

PASSO 3 — Criar Painel Admin

Criar área administrativa do STP Market.

Objetivo:

Permitir que o administrador controle a loja.

Criar:

/admin

Autenticação

Implementar login admin.

Requisitos:

Email
Password
Password hash com bcrypt
Sessão segura
Dashboard

Mostrar:

Número de produtos
Total de encomendas
Total vendido
Produtos com stock baixo
Gestão de produtos

Criar CRUD:

Listar produtos

Criar produto

Editar produto

Eliminar produto

Campos:

Nome
Descrição
Preço
Categoria
Stock
Imagem
Estado ativo
Interface

Usar:

shadcn/ui
Tables
Forms
Dialogs

Proteger todas as rotas /admin.

Criar layout próprio para administração.

PASSO 4 — Criar Loja Pública

Criar a parte pública da loja STP Market.

Criar:

Homepage

Loja

Página produto

Homepage

Adicionar:

Banner principal
Texto sobre São Tomé
Categorias
Produtos destacados
Loja

Funcionalidades:

Listar produtos
Pesquisa
Filtro categoria
Ordenação preço
Página produto

Mostrar:

Imagem
Nome
Descrição
Preço
Stock
Botão comprar

Criar componentes:

ProductCard

CategoryCard

Navbar

Footer

Criar design:

Premium
Tropical
Artesanal
Mobile first
PASSO 5 — Criar Carrinho

Criar sistema de carrinho.

Funcionalidades:

Adicionar produto

Remover produto

Alterar quantidade

Calcular subtotal

Calcular total

Guardar carrinho:

Inicialmente usar localStorage.

Criar:

/carrinho

Mostrar:

Produtos

Quantidade

Preço

Total

Adicionar botão:

"Finalizar compra"

PASSO 6 — Stripe Checkout

Adicionar pagamentos Stripe ao STP Market.

Objetivo:

Permitir pagamentos online.

Instalar:

stripe

Criar:

lib/stripe.ts

Criar endpoint:

/api/create-checkout-session

Fluxo:

Cliente adiciona produtos

↓

Checkout

↓

Stripe

↓

Pagamento

Criar webhook:

/api/stripe/webhook

Quando pagamento for confirmado:

Criar Customer
Criar Order
Criar OrderItems
Atualizar stock

Adicionar página:

/sucesso

Enviar email de confirmação.

PASSO 7 — Cloudinary + Emails

Adicionar gestão de imagens e emails.

Cloudinary

Configurar upload de imagens.

Permitir:

Admin enviar imagem do produto.

Guardar:

imageUrl

Resend

Criar emails:

Cliente:

Confirmação da compra
Atualização da encomenda

Admin:

Nova encomenda recebida

Criar templates simples e profissionais.

PASSO 8 — Deploy Vercel

Preparar o STP Market para produção.

Configurar:

Vercel

Neon PostgreSQL

Stripe

Cloudinary

Resend

Criar:

.env.production

Verificar:

Build funcionando
Migrations aplicadas
Variáveis configuradas
Webhooks Stripe funcionando

Criar guia final:

Como colocar a aplicação online.
