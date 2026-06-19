"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { ANIMATION } from "@/lib/constants";
import type { Perfume } from "@/lib/types";

type PerfumeCardProps = {
  perfume: Perfume;
  isActive: boolean;
  onSelect: (id: string) => void;
  layout?: "carousel" | "grid";
};

export function PerfumeCard({
  perfume,
  isActive,
  onSelect,
  layout = "carousel",
}: PerfumeCardProps) {
  const isCarousel = layout === "carousel";

  return (
    <motion.button
      type="button"
      layout
      onClick={() => onSelect(perfume.id)}
      whileHover={{ y: isActive ? -8 : -4 }}
      animate={{
        scale: isActive ? 1.04 : 1,
        y: isActive ? -8 : 0,
      }}
      transition={ANIMATION.cardSpring}
      className={`group relative overflow-hidden rounded-[1.75rem] border text-left shadow-2xl shadow-black/30 ${
        isCarousel ? "h-[17rem] w-[10.5rem] shrink-0 sm:h-[19rem] sm:w-[11.5rem]" : "min-h-[18rem]"
      } ${
        isActive
          ? "border-white/70 ring-2 ring-[var(--accent-glow)]"
          : "border-white/15 hover:border-white/35"
      }`}
      style={
        isActive
          ? { boxShadow: `0 24px 60px var(--accent-muted), 0 8px 24px rgba(0,0,0,0.4)` }
          : undefined
      }
      aria-pressed={isActive}
      aria-label={`View ${perfume.name} by ${perfume.house}`}
    >
      <Image
        src={perfume.card.image}
        alt=""
        fill
        sizes={isCarousel ? "160px" : "320px"}
        className="object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-65"
      />

      <div
        className="absolute inset-0 transition duration-500"
        style={{
          background: `linear-gradient(180deg, ${perfume.hero.accent}30 0%, ${perfume.hero.accent}10 35%, rgba(0,0,0,0.82) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${perfume.hero.accent}25, transparent 55%)`,
        }}
      />

      <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-4 pt-10">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/55">
          {perfume.card.label}
        </p>
        <p className="font-display text-lg uppercase leading-tight tracking-[0.08em] text-white">
          {perfume.name}
        </p>
        <p className="text-xs text-white/65">{perfume.house}</p>
      </div>

      {isActive && (
        <motion.span
          layoutId="active-card-glow"
          className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/30"
          transition={ANIMATION.cardSpring}
        />
      )}
    </motion.button>
  );
}
