import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { StoreFilters } from "@/components/StoreFilters";

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string; sort?: string }>;
}) {
  const { q, categoria, sort } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        active: true,
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        ...(categoria ? { category: { slug: categoria } } : {}),
      },
      orderBy:
        sort === "price-asc"
          ? { price: "asc" }
          : sort === "price-desc"
            ? { price: "desc" }
            : { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-semibold">Loja</h1>
      <p className="mt-2 text-muted-foreground">
        Produtos genuínos de São Tomé e Príncipe.
      </p>

      <div className="mt-8">
        <StoreFilters
          categories={categories}
          defaultValues={{ q: q ?? "", categoria: categoria ?? "", sort: sort ?? "" }}
        />
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Nenhum produto encontrado.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
