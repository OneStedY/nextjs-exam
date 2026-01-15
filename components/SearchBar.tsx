"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function useDebounce<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = searchParams.get("q") ?? "";
  const [value, setValue] = useState(initial);

  // Якщо URL змінився ззовні (клік жанрів/пагінації) — синхронізуємо інпут
  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const debounced = useDebounce(value.trim(), 400);

  const nextHref = useMemo(() => {
    const sp = new URLSearchParams(searchParams.toString());
    if (debounced.length >= 2) {
      sp.set("q", debounced);
      sp.delete("genre");
      sp.set("page", "1");
    } else {
      sp.delete("q");
      sp.set("page", "1");
    }
    const qs = sp.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [debounced, pathname, searchParams]);

  useEffect(() => {
    router.replace(nextHref);
  }, [nextHref, router]);

  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search movies..."
        className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
      />
      <button
        type="button"
        onClick={() => setValue("")}
        className="rounded-xl border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
      >
        Clear
      </button>
    </div>
  );
}
