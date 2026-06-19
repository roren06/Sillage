import rawPerfumes from "./perfumes.json";
import { LONGEVITY_LEVELS } from "./constants";
import type { Perfume } from "./types";

export const perfumes = rawPerfumes as Perfume[];

export const perfumeMap = Object.fromEntries(
  perfumes.map((perfume) => [perfume.id, perfume]),
) as Record<string, Perfume>;

export const defaultPerfumeId = perfumes[0].id;

export function filterPerfumes(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return perfumes;

  return perfumes.filter((perfume) => {
    const haystack = [
      perfume.name,
      perfume.house,
      perfume.family,
      perfume.season,
      perfume.longevity,
      LONGEVITY_LEVELS[perfume.longevity].label,
      perfume.tagline,
      perfume.card.label,
      ...perfume.vibe,
      ...perfume.notes.top,
      ...perfume.notes.heart,
      ...perfume.notes.base,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
