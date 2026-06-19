"use client";

import { motion } from "framer-motion";

import { PerfumeCard } from "@/components/carousel/PerfumeCard";
import { useCarouselScroll } from "@/hooks/useCarouselScroll";
import { cardListVariants } from "@/lib/animations";
import type { Perfume } from "@/lib/types";

type PerfumeCarouselProps = {
  perfumes: Perfume[];
  selectedId: string;
  onSelect: (id: string) => void;
};

function CarouselNavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous scent" : "Next scent"}
      disabled={disabled}
      onClick={onClick}
      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white/80 backdrop-blur-md transition hover:border-white/40 hover:bg-black/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-4">
        <path
          d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function PerfumeCarousel({
  perfumes,
  selectedId,
  onSelect,
}: PerfumeCarouselProps) {
  const { containerRef, registerCard } = useCarouselScroll(selectedId);

  const activeIndex = perfumes.findIndex((perfume) => perfume.id === selectedId);
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  const goTo = (offset: number) => {
    if (perfumes.length === 0) return;
    const nextIndex = (safeIndex + offset + perfumes.length) % perfumes.length;
    onSelect(perfumes[nextIndex].id);
  };

  if (perfumes.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/15 bg-black/35 px-6 py-8 text-center text-white/70 backdrop-blur-xl">
        No scents matched your search. Try a note like vanilla, mint, or oud.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-3 flex items-end justify-between gap-4 px-1">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/50">
            Collection
          </p>
          <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-white">
            Pick your sillage
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs tabular-nums text-white/45 sm:block">
            {String(safeIndex + 1).padStart(2, "0")} /{" "}
            {String(perfumes.length).padStart(2, "0")}
          </span>
          <CarouselNavButton
            direction="prev"
            onClick={() => goTo(-1)}
            disabled={perfumes.length <= 1}
          />
          <CarouselNavButton
            direction="next"
            onClick={() => goTo(1)}
            disabled={perfumes.length <= 1}
          />
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-zinc-950/80 via-zinc-950/40 to-transparent lg:from-black/60" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-black/40 to-transparent lg:hidden" />

        <motion.div
          ref={containerRef}
          variants={cardListVariants}
          initial="initial"
          animate="animate"
          className="carousel-snap overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-4">
            {perfumes.map((perfume) => (
              <div
                key={perfume.id}
                ref={(node) => registerCard(perfume.id, node)}
                className="shrink-0"
              >
                <PerfumeCard
                  perfume={perfume}
                  isActive={perfume.id === selectedId}
                  onSelect={onSelect}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-3 flex items-center gap-2 px-1">
        {perfumes.map((perfume, index) => (
          <button
            key={perfume.id}
            type="button"
            aria-label={`Go to ${perfume.name}`}
            aria-current={perfume.id === selectedId ? "true" : undefined}
            onClick={() => onSelect(perfume.id)}
            className="group flex flex-1 items-center py-1"
          >
            <span
              className={`block h-0.5 w-full rounded-full transition-all duration-500 ${
                perfume.id === selectedId
                  ? "bg-[var(--accent)]"
                  : "bg-white/15 group-hover:bg-white/30"
              }`}
              style={
                perfume.id === selectedId
                  ? { boxShadow: "0 0 12px var(--accent-glow)" }
                  : undefined
              }
            />
            <span className="sr-only">
              {index + 1}. {perfume.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
