// components/Pagination.tsx
import Link from "next/link";

type SP = Record<string, string | string[] | undefined>;

function buildHref(searchParams: SP | undefined, nextPage: number) {
  const params = new URLSearchParams();

  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v == null) continue;

      if (Array.isArray(v)) {
        // сохраняем мульти-параметры, если есть
        params.delete(k);
        v.forEach((vv) => params.append(k, vv));
      } else {
        params.set(k, v);
      }
    }
  }

  params.set("page", String(nextPage));
  return `?${params.toString()}`;
}

export default function Pagination({
                                     searchParams,
                                     page,
                                     totalPages,
                                   }: {
  searchParams?: SP;
  page: number;
  totalPages: number;
}) {
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
      <nav aria-label="Pagination" style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {page > 1 ? (
            <Link href={buildHref(searchParams, prevPage)}>Prev</Link>
        ) : (
            <span style={{ opacity: 0.5 }}>Prev</span>
        )}

        <span>
        {page} / {totalPages}
      </span>

        {page < totalPages ? (
            <Link href={buildHref(searchParams, nextPage)}>Next</Link>
        ) : (
            <span style={{ opacity: 0.5 }}>Next</span>
        )}
      </nav>
  );
}
