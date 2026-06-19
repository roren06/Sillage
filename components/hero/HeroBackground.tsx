"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { heroBackgroundVariants } from "@/lib/animations";
import type { Perfume } from "@/lib/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type HeroBackgroundProps = {
  perfume: Perfume;
};

export function HeroBackground({ perfume }: HeroBackgroundProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={perfume.id}
          variants={reducedMotion ? undefined : heroBackgroundVariants}
          initial={reducedMotion ? false : "initial"}
          animate={reducedMotion ? undefined : "animate"}
          exit={reducedMotion ? undefined : "exit"}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={perfume.hero.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className={`object-cover ${reducedMotion ? "" : "hero-ken-burns"}`}
            />
          </div>

          <div
            className="absolute inset-0 transition-[background] duration-700"
            style={{ background: perfume.hero.gradient }}
          />
          <div
            className="absolute inset-0 opacity-60 transition-opacity duration-700"
            style={{
              background: `radial-gradient(circle at 15% 25%, ${perfume.hero.accent}33, transparent 42%), radial-gradient(circle at 85% 15%, ${perfume.hero.accent}18, transparent 35%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.45), transparent 55%)`,
            }}
          />
          <div className="noise-overlay absolute inset-0 opacity-[0.18]" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
