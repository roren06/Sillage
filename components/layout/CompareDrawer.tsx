"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo } from "react";

import { LONGEVITY_LEVELS } from "@/lib/constants";
import { isLocalAsset } from "@/lib/images";
import { perfumeMap } from "@/lib/perfumes";
import { getComparison, type NoteEntry } from "@/lib/similarity";
import type { Perfume } from "@/lib/types";
import { usePerfumeStore } from "@/store/perfumeStore";

type CompareDrawerProps = {
  onSelect: (id: string) => void;
};

function CompareSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Perfume[];
  onChange: (id: string) => void;
}) {
  return (
    <label className="block flex-1 space-y-2">
      <span className="text-[10px] uppercase tracking-[0.24em] text-white/45">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/35 focus:ring-2 focus:ring-[var(--accent-muted)]"
      >
        {options.map((perfume) => (
          <option key={perfume.id} value={perfume.id} className="bg-zinc-950">
            {perfume.name} — {perfume.house}
          </option>
        ))}
      </select>
    </label>
  );
}

function BottleThumb({ perfume }: { perfume: Perfume }) {
  const localBottle = isLocalAsset(perfume.bottle.image);
  const scale = perfume.bottle.scale ?? 1;

  return (
    <div className="relative mx-auto h-28 w-16">
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-2xl"
        style={{ background: perfume.hero.accent }}
      />
      <div
        className="relative h-full w-full"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center bottom",
        }}
      >
        <Image
          src={perfume.bottle.image}
          alt=""
          fill
          unoptimized={localBottle}
          sizes="64px"
          className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
        />
      </div>
    </div>
  );
}

function NoteList({ entries }: { entries: NoteEntry[] }) {
  if (entries.length === 0) {
    return <span className="text-sm text-white/35">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {entries.map(({ note, shared }) => (
        <span
          key={note}
          className={`rounded-full border px-2 py-0.5 text-[11px] ${
            shared
              ? "border-[var(--accent-glow)] bg-[var(--accent-muted)] text-white"
              : "border-white/12 bg-white/5 text-white/70"
          }`}
        >
          {note}
        </span>
      ))}
    </div>
  );
}

function MatchRow({
  label,
  left,
  right,
  match,
}: {
  label: string;
  left: string;
  right: string;
  match: boolean;
}) {
  return (
    <div className="grid grid-cols-[5rem_1fr_1fr] items-start gap-3 border-b border-white/8 py-3 last:border-0">
      <span className="pt-0.5 text-[10px] uppercase tracking-[0.2em] text-white/40">
        {label}
      </span>
      <span
        className={`text-sm capitalize ${match ? "text-white" : "text-white/65"}`}
      >
        {left}
      </span>
      <span
        className={`text-sm capitalize ${match ? "text-white" : "text-white/65"}`}
      >
        {right}
      </span>
    </div>
  );
}

export function CompareDrawer({ onSelect }: CompareDrawerProps) {
  const open = usePerfumeStore((state) => state.compareOpen);
  const setOpen = usePerfumeStore((state) => state.setCompareOpen);
  const compareA = usePerfumeStore((state) => state.compareA);
  const compareB = usePerfumeStore((state) => state.compareB);
  const setCompareSlot = usePerfumeStore((state) => state.setCompareSlot);
  const savedIds = usePerfumeStore((state) => state.savedIds);

  const savedPerfumes = useMemo(
    () => savedIds.map((id) => perfumeMap[id]).filter(Boolean),
    [savedIds],
  );

  const perfumeA = compareA ? perfumeMap[compareA] : null;
  const perfumeB = compareB ? perfumeMap[compareB] : null;
  const sameScent = compareA && compareB && compareA === compareB;

  const comparison =
    perfumeA && perfumeB && !sameScent
      ? getComparison(perfumeA, perfumeB)
      : null;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open || savedPerfumes.length < 2) return;

    if (!compareA || !perfumeMap[compareA]) {
      setCompareSlot("a", savedPerfumes[0].id);
    }
    if (!compareB || !perfumeMap[compareB]) {
      setCompareSlot("b", savedPerfumes[1]?.id ?? savedPerfumes[0].id);
    }
  }, [compareA, compareB, open, savedPerfumes, setCompareSlot]);

  const handleView = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close compare"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-x-4 top-[4.5rem] z-[60] mx-auto flex max-h-[calc(100vh-6rem)] max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-2xl sm:inset-x-6"
            role="dialog"
            aria-modal="true"
            aria-label="Compare scents"
          >
            <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">
                  Side by side
                </p>
                <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-white">
                  Compare scents
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/15 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" className="size-4">
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {savedPerfumes.length < 2 ? (
                <p className="text-center text-sm text-white/55">
                  Save at least two scents to compare them.
                </p>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-end gap-3">
                    <CompareSelect
                      label="Scent A"
                      value={compareA ?? savedPerfumes[0].id}
                      options={savedPerfumes}
                      onChange={(id) => setCompareSlot("a", id)}
                    />
                    <span className="pb-2.5 font-display text-lg text-white/30">
                      vs
                    </span>
                    <CompareSelect
                      label="Scent B"
                      value={compareB ?? savedPerfumes[1].id}
                      options={savedPerfumes}
                      onChange={(id) => setCompareSlot("b", id)}
                    />
                  </div>

                  {sameScent ? (
                    <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                      Pick two different scents to see how they stack up.
                    </p>
                  ) : perfumeA && perfumeB && comparison ? (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[perfumeA, perfumeB].map((perfume) => (
                          <div
                            key={perfume.id}
                            className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4 text-center"
                          >
                            <BottleThumb perfume={perfume} />
                            <p className="mt-3 font-display text-lg uppercase tracking-[0.06em] text-white">
                              {perfume.name}
                            </p>
                            <p className="text-xs text-white/55">{perfume.house}</p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-[1.25rem] border border-white/10 bg-black/30 p-5">
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <span className="text-[10px] uppercase tracking-[0.22em] text-white/45">
                            Mood overlap
                          </span>
                          <span className="font-display text-3xl text-[var(--accent)]">
                            {comparison.mood.score}%
                          </span>
                        </div>
                        <p className="text-sm text-white/65">
                          {comparison.mood.matchLine}
                        </p>
                        {comparison.mood.sharedVibes.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {comparison.mood.sharedVibes.map((vibe) => (
                              <span
                                key={vibe}
                                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white/75"
                              >
                                {vibe}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-[1.25rem] border border-white/10 bg-black/30 p-5">
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <span className="text-[10px] uppercase tracking-[0.22em] text-white/45">
                            Scent similarity
                          </span>
                          <span className="font-display text-3xl text-[var(--accent)]">
                            {comparison.scent.score}%
                          </span>
                        </div>
                        <p className="text-sm text-white/65">
                          {comparison.scent.summary}
                        </p>
                        {comparison.scent.sharedNotes.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {comparison.scent.sharedNotes.map((note) => (
                              <span
                                key={note}
                                className="rounded-full border border-[var(--accent-glow)] bg-[var(--accent-muted)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white"
                              >
                                {note}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.02] px-4">
                        <div className="grid grid-cols-[5rem_1fr_1fr] gap-3 border-b border-white/8 py-3 text-[10px] uppercase tracking-[0.18em] text-white/35">
                          <span />
                          <span>A</span>
                          <span>B</span>
                        </div>
                        <MatchRow
                          label="Family"
                          left={perfumeA.family}
                          right={perfumeB.family}
                          match={comparison.familyMatch}
                        />
                        <MatchRow
                          label="Season"
                          left={perfumeA.season}
                          right={perfumeB.season}
                          match={comparison.seasonMatch}
                        />
                        <MatchRow
                          label="Longevity"
                          left={LONGEVITY_LEVELS[perfumeA.longevity].label}
                          right={LONGEVITY_LEVELS[perfumeB.longevity].label}
                          match={comparison.longevityMatch}
                        />
                      </div>

                      {(["top", "heart", "base"] as const).map((layer) => (
                        <div
                          key={layer}
                          className="rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4"
                        >
                          <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-white/40">
                            {layer}
                          </p>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <NoteList entries={comparison.layers[layer].a} />
                            <NoteList entries={comparison.layers[layer].b} />
                          </div>
                        </div>
                      ))}

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleView(perfumeA.id)}
                          className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white transition hover:bg-white/15"
                        >
                          View {perfumeA.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleView(perfumeB.id)}
                          className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white transition hover:bg-white/15"
                        >
                          View {perfumeB.name}
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
