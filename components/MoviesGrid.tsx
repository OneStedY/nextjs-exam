import type { Movie } from "@/types/tmdb";
import { MovieCard } from "@/components/MovieCard";

export function MoviesGrid({ movies }: { movies: Movie[] }) {
  if (!movies.length) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">No movies found.</div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
}
