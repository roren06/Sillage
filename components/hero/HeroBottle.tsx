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
        className="pointer-events-none absolute right-6 top-[34%] z-10 hidden -translate-y-1/2 lg:block xl:right-[18%] xl:top-[38%]"
      >
        <div
          className="relative isolate h-[22rem] w-36 xl:h-[30rem] xl:w-48"
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
            sizes="(min-width: 1280px) 192px, 144px"
            className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
