import Link from "next/link";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { ROUTES } from "@/constants/routes";

export function Header() {
  return (
    <header className="glass sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={ROUTES.HOME}
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Sirat
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <Link href={ROUTES.QURAN} className="hover:text-foreground">
            Quran
          </Link>
          <Link href={ROUTES.HADITH} className="hover:text-foreground">
            Hadith
          </Link>
          <Link href={ROUTES.PRAYER_TIMES} className="hover:text-foreground">
            Prayer
          </Link>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
