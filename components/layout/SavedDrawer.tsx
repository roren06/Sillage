"use client";

import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion";
import { useEffect } from "react";

import { SavedScentCard } from "@/components/layout/SavedScentCard";
import { perfumeMap } from "@/lib/perfumes";
import { usePerfumeStore } from "@/store/perfumeStore";

type SavedDrawerProps = {
  onSelect: (id: string) => void;
};

type SavedScentReorderItemProps = {
  perfumeId: string;
  rank: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
};

function SavedScentReorderItem({
  perfumeId,
  rank,
  isActive,
  onSelect,
  onRemove,
}: SavedScentReorderItemProps) {
  const perfume = perfumeMap[perfumeId];
  const dragControls = useDragControls();

  if (!perfume) return null;

  return (
    <Reorder.Item
      value={perfumeId}
      dragListener={false}
      dragControls={dragControls}
      className="relative"
    >
      <SavedScentCard
        perfume={perfume}
        rank={rank}
        isActive={isActive}
        onSelect={onSelect}
        onRemove={onRemove}
        onDragHandlePointerDown={(event) => dragControls.start(event)}
      />
    </Reorder.Item>
  );
}

export function SavedDrawer({ onSelect }: SavedDrawerProps) {
  const open = usePerfumeStore((state) => state.savedDrawerOpen);
  const setOpen = usePerfumeStore((state) => state.setSavedDrawerOpen);
  const openCompare = usePerfumeStore((state) => state.openCompare);
  const toggleSaved = usePerfumeStore((state) => state.toggleSaved);
  const reorderSavedIds = usePerfumeStore((state) => state.reorderSavedIds);
  const savedIds = usePerfumeStore((state) => state.savedIds);
  const selectedId = usePerfumeStore((state) => state.selectedId);

  const handleSelect = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close saved collection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="My rotation"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">
                  Your collection
                </p>
                <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-white">
                  My rotation
                </h2>
                <p className="mt-1 text-xs text-white/45">
                  Drag to rank your daily picks — #1 first
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/15 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" className="size-4">
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {savedIds.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/15 px-6 py-12 text-center">
                  <p className="font-display text-xl uppercase tracking-[0.08em] text-white/80">
                    No saves yet
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/50">
                    Tap the bookmark on any scent to build your rotation while
                    you browse.
                  </p>
                </div>
              ) : (
                <Reorder.Group
                  axis="y"
                  values={savedIds}
                  onReorder={reorderSavedIds}
                  className="flex flex-col gap-4"
                >
                  {savedIds.map((id, index) => (
                    <SavedScentReorderItem
                      key={id}
                      perfumeId={id}
                      rank={index + 1}
                      isActive={id === selectedId}
                      onSelect={handleSelect}
                      onRemove={toggleSaved}
                    />
                  ))}
                </Reorder.Group>
              )}
            </div>

            {savedIds.length >= 2 && (
              <div className="border-t border-white/10 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openCompare();
                  }}
                  className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
                >
                  Compare saved scents
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
