"use client";

import { useEffect, useMemo } from "react";

import { filterPerfumes, perfumes } from "@/lib/perfumes";
import { usePerfumeStore } from "@/store/perfumeStore";

export function usePerfumePreload() {
  const selectedId = usePerfumeStore((state) => state.selectedId);

  useEffect(() => {
    const currentIndex = perfumes.findIndex((perfume) => perfume.id === selectedId);
    const neighborIndexes = [currentIndex - 1, currentIndex, currentIndex + 1].filter(
      (index) => index >= 0 && index < perfumes.length,
    );

    neighborIndexes.forEach((index) => {
      const perfume = perfumes[index];
      [perfume.hero.image, perfume.bottle.image].forEach((image) => {
        const preload = new window.Image();
        preload.src = image;
      });
    });
  }, [selectedId]);
}

export function usePerfumeKeyboard(
  filteredIds: string[],
  onSelect?: (id: string) => void,
) {
  const selectedId = usePerfumeStore((state) => state.selectedId);
  const selectPerfume = usePerfumeStore((state) => state.selectPerfume);
  const navigate = onSelect ?? selectPerfume;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;

      const currentIndex = filteredIds.indexOf(selectedId);
      if (currentIndex === -1) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % filteredIds.length;
        navigate(filteredIds[nextIndex]);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const prevIndex =
          (currentIndex - 1 + filteredIds.length) % filteredIds.length;
        navigate(filteredIds[prevIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredIds, navigate, selectedId]);
}

export function useFilteredPerfumes() {
  const searchQuery = usePerfumeStore((state) => state.searchQuery);

  return useMemo(() => filterPerfumes(searchQuery), [searchQuery]);
}
