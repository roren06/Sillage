"use client";

import { useEffect } from "react";

import type { Perfume } from "@/lib/types";

export function useAccentTheme(perfume: Perfume) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", perfume.hero.accent);
    root.style.setProperty("--accent-muted", `${perfume.hero.accent}33`);
    root.style.setProperty("--accent-glow", `${perfume.hero.accent}55`);
  }, [perfume.hero.accent]);
}
