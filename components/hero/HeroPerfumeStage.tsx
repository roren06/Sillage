"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { HeroBackground } from "@/components/hero/HeroBackground";
import { HeroBottle } from "@/components/hero/HeroBottle";
import { HeroContent } from "@/components/hero/HeroContent";
import { SearchBar } from "@/components/layout/SearchBar";
import { LONGEVITY_LEVELS } from "@/lib/constants";
import type { Perfume } from "@/lib/types";

type HeroPerfumeStageProps = {
  perfume: Perfume;
  carousel: ReactNode;
};

export function HeroPerfumeStage({ perfume, carousel }: HeroPerfumeStageProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <HeroBackground perfume={perfume} />

      <div className="relative z-10 px-6 pt-28 md:px-10">
        <SearchBar />
      </div>

      <HeroContent perfume={perfume} onExplore={() => setDetailsOpen(true)} />
      <HeroBottle perfume={perfume} />

      <div
        id="collection"
        className="pointer-events-none relative z-20 px-6 pb-8 pt-8 lg:absolute lg:bottom-0 lg:right-0 lg:left-auto lg:px-10 lg:pb-10 lg:pt-0"
      >
        <div className="pointer-events-auto lg:ml-auto lg:w-[min(100%,42rem)]">
          {carousel}
        </div>
      </div>

      <AnimatePresence>
        {detailsOpen && (
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-6 bottom-28 z-40 mx-auto max-w-3xl rounded-[2rem] border border-white/15 bg-black/45 p-6 backdrop-blur-2xl lg:inset-x-auto lg:bottom-36 lg:left-10 lg:right-auto lg:w-[22rem]"
            style={{ borderColor: "var(--accent-glow)" }}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                  Notes pyramid
                </p>
                <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-white">
                  {perfume.name}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close details"
                onClick={() => setDetailsOpen(false)}
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

            <div className="space-y-4 text-sm text-white/80">
              {(["top", "heart", "base"] as const).map((layer) => (
                <div key={layer}>
                  <p className="mb-1 text-[11px] uppercase tracking-[0.24em] text-white/45">
                    {layer}
                  </p>
                  <p>{perfume.notes[layer].join(" · ")}</p>
                </div>
              ))}
              <div className="border-t border-white/10 pt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-white/60">Longevity</span>
                  <span className="text-white">
                    {LONGEVITY_LEVELS[perfume.longevity].label}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((bar) => (
                    <span
                      key={bar}
                      className="h-1.5 flex-1 rounded-full transition-colors duration-500"
                      style={{
                        backgroundColor:
                          bar <= LONGEVITY_LEVELS[perfume.longevity].bars
                            ? "var(--accent)"
                            : "rgba(255,255,255,0.12)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </section>
  );
}
