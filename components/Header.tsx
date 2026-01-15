"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isActive = pathname === href;
    return `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`;
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          Movies App <span className="text-slate-500">(TMDB)</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/" className={linkClass("/")}
          >
            Movies
          </Link>
          <Link href="/about" className={linkClass("/about")}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
