import type { Variants } from "framer-motion";

import { ANIMATION } from "./constants";

export const heroBackgroundVariants: Variants = {
  initial: { opacity: 0, scale: 1.06 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: ANIMATION.heroFade, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: { duration: ANIMATION.heroFade * 0.85, ease: [0.4, 0, 1, 1] },
  },
};

export const heroTextContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: ANIMATION.textStagger, delayChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

export const heroTextItemVariants: Variants = {
  initial: { opacity: 0, y: 28, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: "blur(4px)",
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  },
};

export const bottlePopVariants: Variants = {
  initial: { opacity: 0, scale: 0.82, y: 40 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...ANIMATION.popSpring, delay: 0.12 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    transition: { duration: 0.25 },
  },
};

export const cardListVariants: Variants = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
};

export const cardItemVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};
