import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/admin/SignOutButton";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/encomendas", label: "Encomendas" },
];

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r bg-muted/30 p-4">
        <div className="mb-6">
          <p className="text-lg font-semibold">Neto Sabores</p>
          <p className="text-xs text-muted-foreground">Painel Admin</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b px-6 py-4">
          <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          <SignOutButton />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
