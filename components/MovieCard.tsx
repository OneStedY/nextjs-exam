import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/tmdb";
import { getPosterUrl } from "@/lib/tmdb";

export function MovieCard({ movie }: { movie: Movie }) {
  const poster = getPosterUrl(movie.poster_path, "w342");

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[2/3] bg-slate-100">
        {poster ? (
          <Image
            src={poster}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">No poster</div>
        )}
      </div>

      <div className="space-y-2 p-3">
        <div className="truncate font-medium text-slate-900 group-hover:underline" title={movie.title}>
          {movie.title}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>{movie.release_date || "—"}</span>
          <span>{movie.vote_average.toFixed(1)} / 10</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {movie.overview || "—"}
        </p>
      </div>
    </Link>
  );
}
