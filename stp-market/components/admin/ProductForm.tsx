"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productSchema, type ProductInput } from "@/lib/validations/product";

type Category = { id: string; name: string };

export function ProductForm({
  categories,
  defaultValues,
  onSubmit,
  submitLabel,
}: {
  categories: Category[];
  defaultValues?: Partial<ProductInput>;
  onSubmit: (data: ProductInput) => Promise<void>;
  submitLabel: string;
}) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      stock: 0,
      active: true,
      categoryId: "",
      ...defaultValues,
    },
  });

  async function submit(data: ProductInput) {
    setFormError(null);
    try {
      await onSubmit(data);
    } catch {
      setFormError("Não foi possível guardar o produto.");
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Preço (€)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL da imagem</Label>
        <Input id="imageUrl" {...register("imageUrl")} />
        {errors.imageUrl && (
          <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Categoria</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="categoryId" className="w-full">
                <SelectValue placeholder="Selecionar categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && (
          <p className="text-sm text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <Switch id="active" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="active">Produto ativo</Label>
      </div>

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "A guardar..." : submitLabel}
      </Button>
    </form>
  );
}
