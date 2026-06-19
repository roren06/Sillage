"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { bottlePopVariants } from "@/lib/animations";
import { isLocalAsset } from "@/lib/images";
import type { Perfume } from "@/lib/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type HeroBottleProps = {
  perfume: Perfume;
};

export function HeroBottle({ perfume }: HeroBottleProps) {
  const reducedMotion = useReducedMotion();
  const localBottle = isLocalAsset(perfume.bottle.image);
  const scale = perfume.bottle.scale ?? 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={perfume.id}
        variants={reducedMotion ? undefined : bottlePopVariants}
        initial={reducedMotion ? false : "initial"}
        animate={reducedMotion ? undefined : "animate"}
        exit={reducedMotion ? undefined : "exit"}
        className="pointer-events-none absolute right-3 top-[30%] z-10 -translate-y-1/2 sm:right-5 sm:top-[32%] lg:right-6 lg:top-[34%] xl:right-[18%] xl:top-[38%]"
      >
        <div
          className="relative isolate h-[12rem] w-[4.5rem] sm:h-[16rem] sm:w-28 lg:h-[22rem] lg:w-36 xl:h-[30rem] xl:w-48"
          style={{ transform: `scale(${scale})`, transformOrigin: "center bottom" }}
        >
          <div
            className="absolute -inset-10 -z-10 rounded-full opacity-40 blur-3xl"
            style={{ background: perfume.hero.accent }}
          />
          <Image
            src={perfume.bottle.image}
            alt=""
            fill
            priority
            unoptimized={localBottle}
            sizes="(min-width: 1280px) 192px, (min-width: 1024px) 144px, 112px"
            className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
