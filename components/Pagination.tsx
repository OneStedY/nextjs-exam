"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type SP = Record<string, string | string[] | undefined>;

function buildHref(pathname: string, sp: URLSearchParams, nextPage: number) {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(nextPage));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
}

export default function Pagination({
                                       page,
                                       totalPages,
                                   }: {
    page: number;
    totalPages: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const prevPage = Math.max(1, page - 1);
    const nextPage = Math.min(totalPages, page + 1);

    const prevHref = useMemo(() => buildHref(pathname, sp, prevPage), [pathname, sp, prevPage]);
    const nextHref = useMemo(() => buildHref(pathname, sp, nextPage), [pathname, sp, nextPage]);

    return (
        <nav aria-label="Pagination" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
                disabled={page <= 1}
                onClick={() => router.push(prevHref, { scroll: false })}
                style={{ opacity: page <= 1 ? 0.5 : 1 }}
            >
                Prev
            </button>

            <span>
        {page} / {totalPages}
      </span>

            <button
                disabled={page >= totalPages}
                onClick={() => router.push(nextHref, { scroll: false })}
                style={{ opacity: page >= totalPages ? 0.5 : 1 }}
            >
                Next
            </button>
        </nav>
    );
}
