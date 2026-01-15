import { tmdb } from "@/lib/tmdb";
import { ErrorBox } from "@/components/ErrorBox";
import { GenreBar } from "@/components/GenreBar";
import { MoviesGrid } from "@/components/MoviesGrid";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";

function toInt(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : fallback;
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const page = Array.isArray(searchParams.page)
    ? toInt(searchParams.page[0], 1)
    : toInt(searchParams.page, 1);

  const genre = Array.isArray(searchParams.genre)
    ? toInt(searchParams.genre[0], 0)
    : toInt(searchParams.genre, 0);

  const q = Array.isArray(searchParams.q) ? (searchParams.q[0] ?? "") : (searchParams.q ?? "");
  const query = q.trim();

  try {
    const [genres, moviesData] = await Promise.all([
      tmdb.getGenres(),
      query.length >= 2
        ? tmdb.searchMovies(query, page)
        : genre
          ? tmdb.getMoviesByGenre(genre, page)
          : tmdb.getMovies(page),
    ]);

    const sp = new URLSearchParams();
    if (query.length >= 2) sp.set("q", query);
    if (!query && genre) sp.set("genre", String(genre));
    sp.set("page", String(page));

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-xl font-semibold tracking-tight">Movies</h1>
            <div className="w-full lg:max-w-md">
              <SearchBar />
              <div className="mt-1 text-xs text-slate-500">Tip: type at least 2 characters to search</div>
            </div>
          </div>

          <GenreBar genres={genres} activeGenreId={genre || null} query={query} />
        </div>

        <MoviesGrid movies={moviesData.results} />

        <Pagination page={moviesData.page} totalPages={moviesData.total_pages} searchParams={sp} />
      </div>
    );
  } catch (e: any) {
    return <ErrorBox message={e?.message ?? "Failed to load movies"} />;
  }
}
