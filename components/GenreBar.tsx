import Link from "next/link";
import type { Genre } from "@/types/tmdb";

function buildHref(params: Record<string, string | number | null | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `/?${qs}` : "/";
}

export function GenreBar({
  genres,
  activeGenreId,
  query,
}: {
  genres: Genre[];
  activeGenreId: number | null;
  query: string;
}) {
  // Якщо є search query, жанр не активний (пріоритет пошуку)
  const isSearching = query.trim().length >= 2;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={buildHref({ q: query || null, genre: null, page: 1 })}
        className={`rounded-full border px-3 py-1 text-xs ${!activeGenreId && !isSearching ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}
      >
        All
      </Link>

      {genres.map((g) => {
        const active = !isSearching && activeGenreId === g.id;
        return (
          <Link
            key={g.id}
            href={buildHref({ q: null, genre: g.id, page: 1 })}
            className={`rounded-full border px-3 py-1 text-xs ${active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}
          >
            {g.name}
          </Link>
        );
      })}
    </div>
  );
}
