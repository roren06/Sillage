"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  heroTextContainerVariants,
  heroTextItemVariants,
} from "@/lib/animations";
import { scentUrl } from "@/lib/routes";
import type { Perfume } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePerfumeStore } from "@/store/perfumeStore";

type HeroContentProps = {
  perfume: Perfume;
  onExplore: () => void;
};

export function HeroContent({ perfume, onExplore }: HeroContentProps) {
  const reducedMotion = useReducedMotion();
  const savedIds = usePerfumeStore((state) => state.savedIds);
  const toggleSaved = usePerfumeStore((state) => state.toggleSaved);
  const isSaved = savedIds.includes(perfume.id);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(scentUrl(perfume.id));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative z-30 flex min-h-[72vh] flex-col justify-end px-6 pb-72 pt-40 md:px-10 md:pb-80 lg:max-w-3xl lg:pb-44 lg:pt-48">
      <AnimatePresence mode="wait">
        <motion.div
          key={perfume.id}
          variants={reducedMotion ? undefined : heroTextContainerVariants}
          initial={reducedMotion ? false : "initial"}
          animate={reducedMotion ? undefined : "animate"}
          exit={reducedMotion ? undefined : "exit"}
          className="space-y-6"
        >
          <motion.div
            variants={reducedMotion ? undefined : heroTextItemVariants}
            className="flex items-center gap-2 text-sm text-white/80"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-4">
              <path
                d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>{perfume.house}</span>
            <span className="text-white/40">/</span>
            <span>{perfume.season}</span>
          </motion.div>

          <motion.h1
            variants={reducedMotion ? undefined : heroTextItemVariants}
            className="font-display text-5xl uppercase leading-[0.92] tracking-[0.06em] text-white md:text-7xl lg:text-8xl"
          >
            {perfume.name}
          </motion.h1>

          <motion.p
            variants={reducedMotion ? undefined : heroTextItemVariants}
            className="max-w-xl text-base leading-7 text-white/78 md:text-lg"
          >
            {perfume.tagline}
          </motion.p>

          <motion.div
            variants={reducedMotion ? undefined : heroTextItemVariants}
            className="flex flex-wrap gap-2"
          >
            <Tag accent={perfume.hero.accent}>{perfume.family}</Tag>
            {perfume.vibe.slice(0, 2).map((label) => (
              <Tag key={label}>{label}</Tag>
            ))}
          </motion.div>

          <motion.div
            variants={reducedMotion ? undefined : heroTextItemVariants}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <Button onClick={onExplore}>Explore notes</Button>
            <Button
              variant="icon"
              aria-label={copied ? "Link copied" : "Copy link to this scent"}
              onClick={handleCopyLink}
              className={copied ? "border-white bg-white text-zinc-900" : ""}
            >
              {copied ? (
                <svg viewBox="0 0 24 24" fill="none" className="size-5">
                  <path
                    d="M5 12l5 5L20 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="size-5">
                  <path
                    d="M10 13a5 5 0 0 1 7-7l1 1a5 5 0 0 1-7 7l-.5-.5M14 11a5 5 0 0 1-7 7l-1-1a5 5 0 0 1 7-7l.5.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </Button>
            <Button
              variant="icon"
              aria-label={isSaved ? "Remove from collection" : "Save scent"}
              aria-pressed={isSaved}
              onClick={() => toggleSaved(perfume.id)}
              className={isSaved ? "border-white bg-white text-zinc-900" : ""}
            >
              <svg viewBox="0 0 24 24" fill="none" className="size-5">
                <path
                  d="M7 4h10a2 2 0 0 1 2 2v14l-7-4-7 4V6a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill={isSaved ? "currentColor" : "none"}
                />
              </svg>
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
