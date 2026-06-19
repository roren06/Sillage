"use client";

import { useCallback, useEffect, useMemo } from "react";

import { AboutSection } from "@/components/sections/AboutSection";
import { SimilarVibes } from "@/components/sections/SimilarVibes";
import { Header } from "@/components/layout/Header";
import { CompareDrawer } from "@/components/layout/CompareDrawer";
import { SavedDrawer } from "@/components/layout/SavedDrawer";
import { HeroPerfumeStage } from "@/components/hero/HeroPerfumeStage";
import { PerfumeCarousel } from "@/components/carousel/PerfumeCarousel";
import {
  useFilteredPerfumes,
  usePerfumeKeyboard,
  usePerfumePreload,
} from "@/hooks/usePerfumeSelection";
import { useAccentTheme } from "@/hooks/useAccentTheme";
import { perfumeMap } from "@/lib/perfumes";
import { scentPath } from "@/lib/routes";
import { usePerfumeStore } from "@/store/perfumeStore";

function readScentIdFromPath(pathname: string) {
  const match = pathname.match(/\/scent\/([^/]+)/);
  return match?.[1] ?? null;
}

type HeroExperienceProps = {
  perfumeId: string;
};

export function HeroExperience({ perfumeId }: HeroExperienceProps) {
  const selectedId = usePerfumeStore((state) => state.selectedId);
  const selectPerfume = usePerfumeStore((state) => state.selectPerfume);
  const selectedPerfume = usePerfumeStore((state) => state.getSelected());
  const filteredPerfumes = useFilteredPerfumes();
  const filteredIds = useMemo(
    () => filteredPerfumes.map((perfume) => perfume.id),
    [filteredPerfumes],
  );

  usePerfumePreload();

  const handleSelect = useCallback(
    (id: string) => {
      if (id === selectedId) return;

      selectPerfume(id);
      window.history.replaceState(null, "", scentPath(id));
      document.title = `${perfumeMap[id].name} | Sillage`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [selectPerfume, selectedId],
  );

  usePerfumeKeyboard(filteredIds, handleSelect);
  useAccentTheme(selectedPerfume);

  useEffect(() => {
    selectPerfume(perfumeId);
  }, [perfumeId, selectPerfume]);

  useEffect(() => {
    const syncFromUrl = () => {
      const id = readScentIdFromPath(window.location.pathname);
      if (id && perfumeMap[id] && id !== usePerfumeStore.getState().selectedId) {
        selectPerfume(id);
      }
    };

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [selectPerfume]);

  useEffect(() => {
    if (filteredIds.length > 0 && !filteredIds.includes(selectedId)) {
      const nextId = filteredIds[0];
      selectPerfume(nextId);
      window.history.replaceState(null, "", scentPath(nextId));
      document.title = `${perfumeMap[nextId].name} | Sillage`;
    }
  }, [filteredIds, selectPerfume, selectedId]);

  return (
    <div className="bg-zinc-950 text-white">
      <Header />

      <main>
        <HeroPerfumeStage
          perfume={selectedPerfume}
          carousel={
            <PerfumeCarousel
              perfumes={filteredPerfumes}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          }
        />

        <SimilarVibes perfume={selectedPerfume} onSelect={handleSelect} />
        <AboutSection />
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40 md:px-10">
        Sillage — discover fragrances that fit your mood. Fragrance names belong
        to their respective houses.
      </footer>

      <SavedDrawer onSelect={handleSelect} />
      <CompareDrawer onSelect={handleSelect} />
    </div>
  );
}
