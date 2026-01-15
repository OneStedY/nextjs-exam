import Link from "next/link";

function hrefWithPage(searchParams: URLSearchParams, page: number) {
  const sp = new URLSearchParams(searchParams.toString());
  sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `/?${qs}` : "/";
}

export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: URLSearchParams;
}) {
  if (totalPages <= 1) return null;

  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  const btn = (disabled: boolean) =>
    `rounded-xl border bg-white px-3 py-2 text-sm ${disabled ? "opacity-50 pointer-events-none" : "hover:bg-slate-100"}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-slate-600">
        Page <span className="font-medium text-slate-900">{page}</span> of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <Link className={btn(page <= 1)} href={hrefWithPage(searchParams, prev)} aria-disabled={page <= 1}>
          ← Prev
        </Link>
        <Link className={btn(page >= totalPages)} href={hrefWithPage(searchParams, next)} aria-disabled={page >= totalPages}>
          Next →
        </Link>
      </div>
    </div>
  );
}
