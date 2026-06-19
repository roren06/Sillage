"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { PointerEvent } from "react";

import { isLocalAsset } from "@/lib/images";
import type { Perfume } from "@/lib/types";

type SavedScentCardProps = {
  perfume: Perfume;
  rank?: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDragHandlePointerDown?: (event: PointerEvent<HTMLButtonElement>) => void;
};

export function SavedScentCard({
  perfume,
  rank,
  isActive,
  onSelect,
  onRemove,
  onDragHandlePointerDown,
}: SavedScentCardProps) {
  const localBottle = isLocalAsset(perfume.bottle.image);
  const scale = perfume.bottle.scale ?? 1;

  return (
    <motion.div
      layout
      className={`group relative min-h-[18rem] overflow-hidden rounded-[1.75rem] border shadow-2xl shadow-black/30 ${
        isActive
          ? "border-white/70 ring-2 ring-[var(--accent-glow)]"
          : "border-white/15 hover:border-white/35"
      }`}
      style={
        isActive
          ? {
              boxShadow:
                "0 24px 60px var(--accent-muted), 0 8px 24px rgba(0,0,0,0.4)",
            }
          : undefined
      }
    >
      {rank !== undefined && (
        <span
          className="absolute left-3 top-3 z-10 flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/55 font-display text-sm text-white backdrop-blur-md"
          style={{
            boxShadow: rank === 1 ? "0 0 16px var(--accent-glow)" : undefined,
            color: rank === 1 ? "var(--accent)" : undefined,
          }}
        >
          {rank}
        </span>
      )}

      <button
        type="button"
        onClick={() => onSelect(perfume.id)}
        className="relative block h-full w-full overflow-hidden text-left"
        aria-pressed={isActive}
        aria-label={`View ${perfume.name} by ${perfume.house}`}
      >
        <Image
          src={perfume.card.image}
          alt=""
          fill
          sizes="240px"
          className="object-cover opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-55"
        />

        <div
          className="absolute inset-0 transition duration-500"
          style={{
            background: `linear-gradient(180deg, ${perfume.hero.accent}28 0%, ${perfume.hero.accent}08 40%, rgba(0,0,0,0.88) 100%)`,
          }}
        />

        <div className="relative flex h-full min-h-[18rem] flex-col">
          <div className="relative flex flex-1 items-end justify-center px-4 pb-2 pt-10">
            <div
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-2xl"
              style={{ background: perfume.hero.accent }}
            />
            <div
              className="relative h-[7.5rem] w-[4.5rem]"
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
                sizes="72px"
                className="object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>

          <div className="space-y-2 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 pt-6">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/55">
              {perfume.card.label}
            </p>
            <p className="font-display text-lg uppercase leading-tight tracking-[0.08em] text-white">
              {perfume.name}
            </p>
            <p className="text-xs text-white/65">{perfume.house}</p>
          </div>
        </div>

        {isActive && (
          <span className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/30" />
        )}
      </button>

      {onDragHandlePointerDown && (
        <button
          type="button"
          aria-label={`Drag to reorder ${perfume.name}`}
          onPointerDown={onDragHandlePointerDown}
          className="absolute bottom-3 left-3 z-10 flex size-8 cursor-grab items-center justify-center rounded-full border border-white/20 bg-black/55 text-white/75 backdrop-blur-md transition hover:border-white/40 hover:bg-black/75 hover:text-white active:cursor-grabbing"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-4">
            <path
              d="M9 6h10M9 12h10M9 18h10M5 6h.01M5 12h.01M5 18h.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      <button
        type="button"
        aria-label={`Remove ${perfume.name} from saved`}
        onClick={() => onRemove(perfume.id)}
        className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white/75 backdrop-blur-md transition hover:border-white/40 hover:bg-black/75 hover:text-white"
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
    </motion.div>
  );
}
