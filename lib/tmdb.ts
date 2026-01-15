import type { Genre, Movie, MovieDetails } from "@/types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3";

type Paginated<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

function apiKey(): string {
  const key = process.env.TMDB_API_KEY;

  return key;
}

async function tmdbFetch<T>(path: string, params: Record<string, string | number | boolean | undefined> = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", apiKey());
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString(), {
    // Кеш на сервері. Можеш змінити за потреби.
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDB request failed (${res.status}): ${text || res.statusText}`);
  }

  return (await res.json()) as T;
}

export const tmdb = {
  getMovies(page = 1) {
    return tmdbFetch<Paginated<Movie>>("/discover/movie", { page });
  },

  async getGenres() {
    const data = await tmdbFetch<{ genres: Genre[] }>("/genre/movie/list");
    return data.genres;
  },

  getMoviesByGenre(genreId: number, page = 1) {
    return tmdbFetch<Paginated<Movie>>("/discover/movie", { with_genres: genreId, page });
  },

  searchMovies(query: string, page = 1) {
    return tmdbFetch<Paginated<Movie>>("/search/movie", {
      query,
      page,
      include_adult: false,
    });
  },

  getMovieById(id: number) {
    return tmdbFetch<MovieDetails>(`/movie/${id}`);
  },
};

export function getPosterUrl(path: string | null, size: "w342" | "w500" | "original" = "w342") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
