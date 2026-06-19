"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { defaultPerfumeId, perfumeMap, perfumes } from "@/lib/perfumes";
import type { Perfume } from "@/lib/types";

type PerfumeStore = {
  selectedId: string;
  searchQuery: string;
  savedIds: string[];
  savedDrawerOpen: boolean;
  compareOpen: boolean;
  compareA: string | null;
  compareB: string | null;
  selectPerfume: (id: string) => void;
  setSearchQuery: (query: string) => void;
  toggleSaved: (id: string) => void;
  setSavedDrawerOpen: (open: boolean) => void;
  setCompareOpen: (open: boolean) => void;
  setCompareSlot: (slot: "a" | "b", id: string) => void;
  openCompare: () => void;
  reorderSavedIds: (ids: string[]) => void;
  getSelected: () => Perfume;
};

export const usePerfumeStore = create<PerfumeStore>()(
  persist(
    (set, get) => ({
      selectedId: defaultPerfumeId,
      searchQuery: "",
      savedIds: [],
      savedDrawerOpen: false,
      compareOpen: false,
      compareA: null,
      compareB: null,

      selectPerfume: (id) => {
        if (!perfumeMap[id]) return;
        set({ selectedId: id });
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleSaved: (id) =>
        set((state) => {
          const isSaved = state.savedIds.includes(id);
          const savedIds = isSaved
            ? state.savedIds.filter((savedId) => savedId !== id)
            : [...state.savedIds, id];

          return {
            savedIds,
            compareA: state.compareA === id && isSaved ? null : state.compareA,
            compareB: state.compareB === id && isSaved ? null : state.compareB,
          };
        }),

      setSavedDrawerOpen: (open) => set({ savedDrawerOpen: open }),

      setCompareOpen: (open) => set({ compareOpen: open }),

      setCompareSlot: (slot, id) => {
        if (!perfumeMap[id]) return;
        set(slot === "a" ? { compareA: id } : { compareB: id });
      },

      openCompare: () => {
        const { savedIds } = get();
        if (savedIds.length < 2) return;
        set({
          compareOpen: true,
          compareA: savedIds[0],
          compareB: savedIds[1],
        });
      },

      reorderSavedIds: (ids) => {
        const { savedIds } = get();
        if (ids.length !== savedIds.length) return;
        if (!ids.every((id) => savedIds.includes(id))) return;
        set({ savedIds: ids });
      },

      getSelected: () => perfumeMap[get().selectedId] ?? perfumes[0],
    }),
    {
      name: "sillage-saved",
      partialize: (state) => ({ savedIds: state.savedIds }),
    },
  ),
);
