"use client";

import { motion } from "framer-motion";

import { ANIMATION } from "@/lib/constants";
import { getSimilarityInsight } from "@/lib/similarity";
import type { Perfume } from "@/lib/types";

type SimilarMatchCardProps = {
  source: Perfume;
  perfume: Perfume;
  onSelect: (id: string) => void;
};

export function SimilarMatchCard({
  source,
  perfume,
  onSelect,
}: SimilarMatchCardProps) {
  const insight = getSimilarityInsight(source, perfume);
  const chips = [
    ...insight.sharedNotes.slice(0, 3),
    ...insight.sharedVibes.slice(0, 2),
  ].slice(0, 4);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(perfume.id)}
      whileHover={{ y: -6 }}
      transition={ANIMATION.cardSpring}
      className="group relative flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/12 bg-zinc-950 text-left shadow-2xl shadow-black/40 transition hover:border-white/30"
      aria-label={`Explore ${perfume.name} — ${insight.score}% mood match`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-30 blur-3xl transition duration-700 group-hover:opacity-45"
        style={{ background: perfume.hero.accent }}
      />

      <div className="relative space-y-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/70">
            Mood match
          </span>
          <span
            className="font-display text-3xl leading-none tracking-[0.04em]"
            style={{ color: perfume.hero.accent }}
          >
            {insight.score}%
          </span>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]"
                style={{
                  borderColor: `${perfume.hero.accent}44`,
                  background: `${perfume.hero.accent}12`,
                  color: perfume.hero.accent,
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">
            {perfume.card.label}
          </p>
          <p className="font-display text-2xl uppercase leading-tight tracking-[0.06em] text-white">
            {perfume.name}
          </p>
          <p className="mt-1 text-sm text-white/55">{perfume.house}</p>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/40 px-6 py-4">
        <p className="text-sm leading-relaxed text-white/60">{insight.matchLine}</p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-white/35 transition group-hover:text-white/65">
          View in collection →
        </p>
      </div>
    </motion.button>
  );
}
