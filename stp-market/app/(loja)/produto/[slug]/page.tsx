import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.active) return null;
  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "Produto não encontrado — STP Market" };

  return {
    title: `${product.name} — STP Market`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const outOfStock = product.stock <= 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/loja" className="hover:text-primary">
          Loja
        </Link>
        <span className="mx-2">/</span>
        <span>{product.category.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 sm:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- imagens externas, sem Cloudinary ainda (Passo 7) */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium tracking-wide text-primary uppercase">
              {product.category.name}
            </p>
            <h1 className="mt-1 font-heading text-3xl font-semibold">
              {product.name}
            </h1>
          </div>

          <p className="text-2xl font-semibold text-primary">
            €{product.price.toFixed(2)}
          </p>

          <p className="whitespace-pre-line text-muted-foreground">
            {product.description}
          </p>

          <p className="text-sm text-muted-foreground">
            {outOfStock ? "Esgotado" : `${product.stock} unidades disponíveis`}
          </p>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={Math.max(product.stock, 1)}
              defaultValue={1}
              disabled={outOfStock}
              className="h-9 w-20 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
              aria-label="Quantidade"
            />
            <Button disabled={outOfStock} size="lg">
              {outOfStock ? "Esgotado" : "Adicionar ao carrinho"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
