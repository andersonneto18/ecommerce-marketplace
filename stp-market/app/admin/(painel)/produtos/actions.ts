"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { productSchema, type ProductInput } from "@/lib/validations/product";

async function uniqueSlug(name: string, ignoreId?: string) {
  const base = slugify(name);
  let slug = base;
  let counter = 1;

  while (
    await prisma.product.findFirst({
      where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
    })
  ) {
    counter += 1;
    slug = `${base}-${counter}`;
  }

  return slug;
}

export async function createProduct(input: ProductInput) {
  const data = productSchema.parse(input);
  const slug = await uniqueSlug(data.name);

  await prisma.product.create({
    data: { ...data, slug },
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/");
  revalidatePath("/loja");
  redirect("/admin/produtos");
}

export async function updateProduct(id: string, input: ProductInput) {
  const data = productSchema.parse(input);
  const existing = await prisma.product.findUniqueOrThrow({ where: { id } });

  const slug =
    slugify(data.name) === slugify(existing.name)
      ? existing.slug
      : await uniqueSlug(data.name, id);

  await prisma.product.update({
    where: { id },
    data: { ...data, slug },
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/");
  revalidatePath("/loja");
  revalidatePath(`/produto/${existing.slug}`);
  if (slug !== existing.slug) revalidatePath(`/produto/${slug}`);
  redirect("/admin/produtos");
}

export async function deleteProduct(id: string) {
  const deleted = await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/produtos");
  revalidatePath("/");
  revalidatePath("/loja");
  revalidatePath(`/produto/${deleted.slug}`);
}
