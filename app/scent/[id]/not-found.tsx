import Link from "next/link";

import { defaultPerfumeId } from "@/lib/perfumes";
import { scentPath } from "@/lib/routes";

export default function ScentNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
      <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">
        Not found
      </p>
      <h1 className="mt-3 font-display text-4xl uppercase tracking-[0.06em]">
        Scent not in the atlas
      </h1>
      <p className="mt-4 max-w-md text-white/60">
        That fragrance isn&apos;t in the collection yet. Browse the catalog to
        find something close.
      </p>
      <Link
        href={scentPath(defaultPerfumeId)}
        className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-white/95"
      >
        Back to collection
      </Link>
    </div>
  );
}
