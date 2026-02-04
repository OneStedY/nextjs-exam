import { NextResponse } from "next/server";
import type { Movie } from "@/types/tmdb";

type TmdbListResponse<T> = {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
    const q = (searchParams.get("q") ?? "").trim();

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "TMDB_API_KEY missing" }, { status: 500 });
    }

    const path = q ? "/search/movie" : "/movie/popular";
    const url = new URL(`https://api.themoviedb.org/3${path}`);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("language", "en-US");
    url.searchParams.set("page", String(page));
    if (q) {
        url.searchParams.set("query", q);
        url.searchParams.set("include_adult", "false");
    }

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
        return NextResponse.json({ error: `TMDB error ${res.status}` }, { status: 502 });
    }

    const data = (await res.json()) as TmdbListResponse<Movie>;
    return NextResponse.json(data);
}
