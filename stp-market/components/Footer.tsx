import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-2">
            <p className="font-heading text-lg font-semibold">
              <span className="text-primary">Neto</span> Sabores
            </p>
            <p className="text-sm text-muted-foreground">
              Café, cacau, chocolate e artesanato de São Tomé e Príncipe,
              entregues em Portugal com o sabor e a cultura das ilhas.
            </p>
          </div>

          <nav className="flex gap-8 text-sm">
            <div className="space-y-2">
              <p className="font-medium">Loja</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <Link href="/loja" className="hover:text-primary">
                    Todos os produtos
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          © {year} Neto Sabores. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
