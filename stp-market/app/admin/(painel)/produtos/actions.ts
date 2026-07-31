"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { cloudinary } from "@/lib/cloudinary";
import { productSchema, type ProductInput } from "@/lib/validations/product";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadProductImage(formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Ficheiro inválido.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("O ficheiro tem de ser uma imagem.");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("A imagem não pode exceder 5MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "stp-market/produtos",
    });
    return { url: result.secure_url };
  } catch (error) {
    console.error("Falha no upload para o Cloudinary:", error);
    throw new Error(
      "Não foi possível enviar a imagem. Verifica se o Cloudinary está configurado (CLOUDINARY_NAME/KEY/SECRET) ou cola a URL manualmente."
    );
  }
}

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
