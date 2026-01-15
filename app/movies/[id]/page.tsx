import Image from "next/image";
import Link from "next/link";
import { tmdb, getPosterUrl } from "@/lib/tmdb";
import { ErrorBox } from "@/components/ErrorBox";
import { RatingStars } from "@/components/RatingStars";

function toInt(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : NaN;
}

export default async function MovieDetailsPage({ params }: { params: { id: string } }) {
  const movieId = toInt(params.id);
  if (!Number.isFinite(movieId)) {
    return <ErrorBox message="Invalid movie id" />;
  }

  try {
    const movie = await tmdb.getMovieById(movieId);

    const poster = getPosterUrl(movie.poster_path, "w500");
    const backdrop = getPosterUrl(movie.backdrop_path, "original");

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-700 hover:underline">
            ← Back to movies
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {backdrop ? (
            <div className="relative h-56 w-full bg-slate-100 sm:h-72">
              <Image src={backdrop} alt="" fill className="object-cover" priority={false} />
            </div>
          ) : null}

          <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[220px_1fr]">
            <div className="mx-auto w-full max-w-[260px]">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-slate-100">
                {poster ? (
                  <Image src={poster} alt={movie.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">No poster</div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight">{movie.title}</h1>
              {movie.tagline ? <div className="text-sm italic text-slate-600">“{movie.tagline}”</div> : null}

              <div className="flex flex-wrap items-center gap-3">
                <RatingStars rating10={movie.vote_average} name={`rating-details-${movie.id}`} />
                <div className="text-sm text-slate-600">
                  {movie.vote_average.toFixed(1)} / 10 • {movie.vote_count} votes
                </div>
                <div className="text-sm text-slate-600">{movie.release_date ? movie.release_date : "—"}</div>
                {movie.runtime ? <div className="text-sm text-slate-600">{movie.runtime} min</div> : null}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {movie.genres?.map((g) => (
                  <span key={g.id} className="rounded-full border px-3 py-1 text-xs text-slate-700">
                    {g.name}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <h2 className="text-sm font-semibold text-slate-900">Overview</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{movie.overview || "—"}</p>
              </div>

              {movie.homepage ? (
                <div className="pt-2">
                  <a href={movie.homepage} target="_blank" rel="noreferrer" className="text-sm text-slate-900 underline">
                    Official website
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (e: any) {
    return <ErrorBox message={e?.message ?? "Failed to load movie"} />;
  }
}
