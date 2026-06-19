"use client";

import { FILTER_CHIPS } from "@/lib/constants";
import { filterPerfumes, perfumes } from "@/lib/perfumes";
import { usePerfumeStore } from "@/store/perfumeStore";

export function SearchBar() {
  const searchQuery = usePerfumeStore((state) => state.searchQuery);
  const setSearchQuery = usePerfumeStore((state) => state.setSearchQuery);
  const filteredCount = filterPerfumes(searchQuery).length;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      <label className="relative block">
        <span className="sr-only">Search perfumes</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-zinc-500"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="m20 20-3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search perfumes, notes, or vibe..."
          className={`w-full rounded-full border border-white/20 bg-white/92 py-4 pl-14 text-sm text-zinc-800 shadow-2xl shadow-black/20 outline-none transition placeholder:text-zinc-400 focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-muted)] ${
            searchQuery ? "pr-36" : "pr-24"
          }`}
        />
        {searchQuery ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setSearchQuery("")}
            className="absolute right-[7.5rem] top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-3.5">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}
        <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
          {filteredCount} scents
        </span>
      </label>

      <p className="text-center text-xs leading-5 text-white/50">
        Explore {perfumes.length} fragrances by mood, notes, and vibe — bookmark
        to build your rotation.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {FILTER_CHIPS.map((chip) => {
          const isActive = searchQuery.toLowerCase() === chip.query;
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => setSearchQuery(isActive ? "" : chip.query)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] backdrop-blur-md transition ${
                isActive
                  ? "border-[var(--accent-glow)] bg-[var(--accent-muted)] text-white"
                  : "border-white/15 bg-black/25 text-white/65 hover:border-white/30 hover:text-white"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
