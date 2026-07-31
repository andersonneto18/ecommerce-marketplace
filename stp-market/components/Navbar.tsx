import Link from "next/link";
import { CartLink } from "@/components/CartLink";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="text-lg font-heading font-semibold tracking-tight text-primary">
            STP
          </span>
          <span className="text-lg font-heading font-semibold tracking-tight">
            Market
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-primary">
            Início
          </Link>
          <Link href="/loja" className="hover:text-primary">
            Loja
          </Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
