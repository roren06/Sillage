"use client";

import { AnimatePresence, motion } from "framer-motion";

import { SimilarMatchCard } from "@/components/sections/SimilarMatchCard";
import { perfumeMap } from "@/lib/perfumes";
import type { Perfume } from "@/lib/types";

type SimilarVibesProps = {
  perfume: Perfume;
  onSelect: (id: string) => void;
};

export function SimilarVibes({ perfume, onSelect }: SimilarVibesProps) {
  const similarPerfumes =
    perfume.similar?.map((id) => perfumeMap[id]).filter(Boolean) ?? [];

  if (similarPerfumes.length === 0) return null;

  return (
    <section
      id="similar"
      className="border-t border-white/10 bg-zinc-950 px-6 py-20 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={perfume.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 max-w-2xl"
          >
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">
              Similar vibes
            </p>
            <h2 className="font-display text-4xl uppercase tracking-[0.06em] text-white md:text-5xl">
              If you like {perfume.name}
            </h2>
            <p className="mt-4 text-white/60">
              Community-style recommendations based on mood, season, and note
              overlap. Not dupes — just scents in the same orbit.
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="grid gap-5 sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-2">
          {similarPerfumes.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <SimilarMatchCard
                source={perfume}
                perfume={item}
                onSelect={onSelect}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
