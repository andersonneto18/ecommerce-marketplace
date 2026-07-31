import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary/90 to-accent/60 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <p className="text-sm font-medium tracking-widest uppercase opacity-80">
            São Tomé e Príncipe
          </p>
          <h1 className="mt-4 max-w-2xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            O sabor das ilhas, à porta de casa
          </h1>
          <p className="mt-4 max-w-xl text-base opacity-90 sm:text-lg">
            Café, cacau, chocolate artesanal e artesanato genuíno de São Tomé
            e Príncipe, selecionados com cuidado e entregues em Portugal.
          </p>
          <Button
            render={<Link href="/loja" />}
            nativeButton={false}
            size="lg"
            variant="secondary"
            className="mt-8"
          >
            Comprar agora
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Um arquipélago de sabores e tradição
            </h2>
            <p className="text-muted-foreground">
              São Tomé e Príncipe, no coração do Golfo da Guiné, é terra de
              solos vulcânicos férteis onde nasceram alguns dos melhores
              cacaus e cafés do mundo. Durante séculos, as roças
              são-tomenses moldaram uma cultura própria — hoje viva no
              trabalho de pequenos produtores e artesãos que continuam a
              produzir de forma genuína e artesanal.
            </p>
            <p className="text-muted-foreground">
              A Neto Sabores nasce para trazer essa história até Portugal,
              apoiando diretamente quem produz e dando a conhecer o melhor
              do arquipélago.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Café", "Cacau", "Chocolate", "Artesanato"].map((label) => (
              <div
                key={label}
                className="flex aspect-square items-center justify-center rounded-xl bg-secondary/60 font-heading text-lg font-medium text-secondary-foreground"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Categorias
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Produtos em destaque
            </h2>
            <Link href="/loja" className="text-sm font-medium text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
