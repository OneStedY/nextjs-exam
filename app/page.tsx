"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MoviesGrid } from "@/components/MoviesGrid";
import Pagination from "@/components/Pagination";
import type { Movie } from "@/types/tmdb";

type TmdbListResponse<T> = {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
};

function getPage(sp: ReturnType<typeof useSearchParams>) {
    const raw = sp.get("page");
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

function getQuery(sp: ReturnType<typeof useSearchParams>) {
    return (sp.get("q") ?? "").trim();
}

export default function HomePage() {
    const sp = useSearchParams();

    const page = useMemo(() => getPage(sp), [sp]);
    const q = useMemo(() => getQuery(sp), [sp]);

    const [movies, setMovies] = useState<Movie[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            setLoading(true);
            setError(null);

            try {
                // ВАЖНО: не светим TMDB_API_KEY на клиенте.
                // Поэтому делаем запрос к своему API route:
                const url = new URL("/api/movies", window.location.origin);
                url.searchParams.set("page", String(page));
                if (q) url.searchParams.set("q", q);

                const res = await fetch(url.toString(), { signal: controller.signal });
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);

                const data = (await res.json()) as TmdbListResponse<Movie>;
                setMovies(data.results ?? []);
                setTotalPages(Math.max(1, Math.min(data.total_pages ?? 1, 500)));
            } catch (e: any) {
                if (e?.name !== "AbortError") setError(e?.message ?? "Error");
            } finally {
                setLoading(false);
            }
        }

        load();
        return () => controller.abort();
    }, [page, q]);

    return (
        <main className="space-y-6 p-4">
            {/* простой поиск через URL (GET) */}
            <form method="GET" className="flex gap-2">
                <input
                    name="q"
                    defaultValue={q}
                    placeholder="Search movies..."
                    className="flex-1 rounded border px-3 py-2"
                />
                <input type="hidden" name="page" value="1" />
                <button type="submit" className="rounded bg-black px-4 py-2 text-white">
                    Search
                </button>
            </form>

            {loading ? (
                <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">Loading...</div>
            ) : error ? (
                <div className="rounded-2xl border bg-white p-6 text-sm text-red-600">{error}</div>
            ) : (
                <MoviesGrid movies={movies} />
            )}

            <Pagination page={page} totalPages={totalPages} />
        </main>
    );
}
