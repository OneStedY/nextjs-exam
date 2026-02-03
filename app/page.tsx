// app/page.tsx
import { MoviesGrid } from "@/components/MoviesGrid";
import Pagination from "@/components/Pagination";
import type { Movie } from "@/types/tmdb";

type SP = Record<string, string | string[] | undefined>;

function getStr(sp: SP | undefined, key: string): string | undefined {
    const v = sp?.[key];
    return Array.isArray(v) ? v[0] : v;
}

function getInt(sp: SP | undefined, key: string, fallback: number): number {
    const raw = getStr(sp, key);
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

type TmdbListResponse<T> = {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
};

async function tmdbFetch<T>(
    path: string,
    params: Record<string, string | number | undefined>
): Promise<T> {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) throw new Error("TMDB_API_KEY is missing in .env");

    const url = new URL(`https://api.themoviedb.org/3${path}`);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("language", "en-US");

    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null || v === "") continue;
        url.searchParams.set(k, String(v));
    }

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error(`TMDB error ${res.status}`);
    return (await res.json()) as T;
}

export default async function Page({ searchParams }: { searchParams?: SP }) {
    const page = getInt(searchParams, "page", 1);
    const query = (getStr(searchParams, "q") ?? "").trim();

    const data: TmdbListResponse<Movie> = query
        ? await tmdbFetch<TmdbListResponse<Movie>>("/search/movie", {
            query,
            page,
            include_adult: "false",
        })
        : await tmdbFetch<TmdbListResponse<Movie>>("/movie/popular", {
            page,
        });

    const movies = data.results ?? [];
    const totalPages = Math.max(1, Math.min(data.total_pages ?? 1, 500));

    return (
        <main className="space-y-6 p-4">
            {/* Server-side поиск через GET */}
            <form method="GET" className="flex gap-2">
                <input
                    name="q"
                    defaultValue={query}
                    placeholder="Search movies..."
                    className="flex-1 rounded border px-3 py-2"
                />
                <input type="hidden" name="page" value="1" />
                <button type="submit" className="rounded bg-black px-4 py-2 text-white">
                    Search
                </button>
            </form>

            <MoviesGrid movies={movies} />

            <Pagination searchParams={searchParams} page={page} totalPages={totalPages} />
        </main>
    );
}
