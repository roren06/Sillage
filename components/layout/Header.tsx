"use client";

import { useState } from "react";

import { NAV_LINKS } from "@/lib/constants";
import { usePerfumeStore } from "@/store/perfumeStore";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const savedIds = usePerfumeStore((state) => state.savedIds);
  const setSavedDrawerOpen = usePerfumeStore((state) => state.setSavedDrawerOpen);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-6 py-5 md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <a href="/" className="group flex items-center gap-3 text-white">
          <span className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition group-hover:bg-white/15">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="size-5"
            >
              <path
                d="M12 3c2.8 3.5 4 6.2 4 9a4 4 0 1 1-8 0c0-2.8 1.2-5.5 4-9Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8.5 18.5c1.2 1.1 2.3 1.5 3.5 1.5s2.3-.4 3.5-1.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div>
            <p className="font-display text-xl tracking-[0.18em]">SILLAGE</p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/60">
              Scent atlas
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-white/75 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#about"
            className="hidden rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-md transition hover:bg-white/15 sm:inline-flex"
          >
            About Sillage
          </a>
          <button
            type="button"
            onClick={() => setSavedDrawerOpen(true)}
            className="relative rounded-full bg-[#6b4423] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:bg-[#7a4f2a]"
          >
            Saved
            {savedIds.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-zinc-900">
                {savedIds.length}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/15 md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5">
              {mobileOpen ? (
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="mx-auto mt-4 max-w-7xl rounded-[1.5rem] border border-white/15 bg-black/50 p-4 backdrop-blur-xl md:hidden">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
