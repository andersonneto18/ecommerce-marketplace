import Link from "next/link";

type Category = {
  slug: string;
  name: string;
};

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/loja?categoria=${category.slug}`}
      className="group flex items-center justify-center rounded-xl border border-border/60 bg-secondary/40 px-6 py-8 text-center transition-colors hover:border-primary hover:bg-secondary"
    >
      <span className="font-heading text-base font-medium group-hover:text-primary">
        {category.name}
      </span>
    </Link>
  );
}
