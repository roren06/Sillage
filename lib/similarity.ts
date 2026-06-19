import type { Perfume } from "@/lib/types";

export type SimilarityInsight = {
  score: number;
  sharedNotes: string[];
  sharedVibes: string[];
  matchLine: string;
};

export type ScentSimilarity = {
  score: number;
  sharedNotes: string[];
  summary: string;
};

const LAYERS = ["top", "heart", "base"] as const;

function normalizeNote(note: string) {
  return note.toLowerCase().replace(/\s+/g, " ").trim();
}

function collectNotes(perfume: Perfume) {
  return [
    ...perfume.notes.top,
    ...perfume.notes.heart,
    ...perfume.notes.base,
  ];
}

function findSharedNotes(a: Perfume, b: Perfume) {
  const notesB = new Set(collectNotes(b).map(normalizeNote));
  const shared: string[] = [];

  for (const note of collectNotes(a)) {
    const normalized = normalizeNote(note);
    if (notesB.has(normalized)) {
      shared.push(note);
    }
  }

  return shared;
}

function countSameLayerMatches(a: Perfume, b: Perfume) {
  let matches = 0;

  for (const layer of LAYERS) {
    const bSet = new Set(b.notes[layer].map(normalizeNote));
    for (const note of a.notes[layer]) {
      if (bSet.has(normalizeNote(note))) {
        matches += 1;
      }
    }
  }

  return matches;
}

function countLayersWithMatch(a: Perfume, b: Perfume) {
  return LAYERS.filter((layer) => {
    const bSet = new Set(b.notes[layer].map(normalizeNote));
    return a.notes[layer].some((note) => bSet.has(normalizeNote(note)));
  }).length;
}

function buildMoodMatchLine(
  source: Perfume,
  target: Perfume,
  sharedVibes: string[],
) {
  if (sharedVibes.length > 0) {
    return `Shared ${sharedVibes.slice(0, 2).join(" · ").toLowerCase()} energy`;
  }

  if (source.family === target.family) {
    return `Both sit in the ${target.family} family`;
  }

  if (source.season === target.season) {
    return `Same season pick — ${target.season.toLowerCase()}`;
  }

  return `Different moods — ${source.card.label.toLowerCase()} vs ${target.card.label.toLowerCase()}`;
}

function buildScentSummary(sharedNotes: string[], score: number) {
  if (sharedNotes.length === 0) {
    return "No shared notes in the pyramid — they likely smell quite different on skin.";
  }

  if (score >= 80) {
    return "Very close on paper — shared DNA across the pyramid, similar wearing experience.";
  }

  if (score >= 50) {
    return "Noticeable overlap in the note pyramid — some shared facets, but distinct overall.";
  }

  if (score >= 20) {
    return "A few shared notes, but different structures — expect separate identities.";
  }

  return "Minimal note overlap — these read as different scents, not variations.";
}

export function getMoodOverlap(a: Perfume, b: Perfume): SimilarityInsight {
  const sharedNotes = findSharedNotes(a, b);
  const sharedVibes = a.vibe.filter((vibe) => b.vibe.includes(vibe));

  const familyMatch = a.family === b.family ? 1 : 0;
  const seasonMatch = a.season === b.season ? 1 : 0;
  const longevityMatch = a.longevity === b.longevity ? 1 : 0;

  const score = Math.min(
    98,
    Math.round(
      sharedVibes.length * 18 +
        familyMatch * 22 +
        seasonMatch * 18 +
        longevityMatch * 8,
    ),
  );

  return {
    score,
    sharedNotes,
    sharedVibes,
    matchLine: buildMoodMatchLine(a, b, sharedVibes),
  };
}

export function getScentSimilarity(a: Perfume, b: Perfume): ScentSimilarity {
  const sharedNotes = findSharedNotes(a, b);

  if (sharedNotes.length === 0) {
    return {
      score: 0,
      sharedNotes,
      summary: buildScentSummary(sharedNotes, 0),
    };
  }

  const notesA = collectNotes(a);
  const notesB = collectNotes(b);
  const overlapRatio = sharedNotes.length / Math.min(notesA.length, notesB.length);
  const sameLayerMatches = countSameLayerMatches(a, b);
  const layersWithMatch = countLayersWithMatch(a, b);

  let score = Math.round(
    overlapRatio * 72 +
      (layersWithMatch / LAYERS.length) * 12 +
      (sameLayerMatches / Math.min(notesA.length, notesB.length)) * 10,
  );

  if (
    sharedNotes.length >= 4 &&
    a.family === b.family &&
    layersWithMatch === LAYERS.length
  ) {
    score += 25;
  }

  score = Math.min(98, Math.max(0, score));

  return {
    score,
    sharedNotes,
    summary: buildScentSummary(sharedNotes, score),
  };
}

/** @deprecated Use getMoodOverlap — kept for Similar Vibes section */
export function getSimilarityInsight(
  source: Perfume,
  target: Perfume,
): SimilarityInsight {
  return getMoodOverlap(source, target);
}

export type NoteEntry = {
  note: string;
  shared: boolean;
};

export type ComparisonResult = {
  mood: SimilarityInsight;
  scent: ScentSimilarity;
  familyMatch: boolean;
  seasonMatch: boolean;
  longevityMatch: boolean;
  layers: {
    top: { a: NoteEntry[]; b: NoteEntry[] };
    heart: { a: NoteEntry[]; b: NoteEntry[] };
    base: { a: NoteEntry[]; b: NoteEntry[] };
  };
};

function markSharedNotes(notes: string[], sharedSet: Set<string>): NoteEntry[] {
  return notes.map((note) => ({
    note,
    shared: sharedSet.has(normalizeNote(note)),
  }));
}

export function getComparison(a: Perfume, b: Perfume): ComparisonResult {
  const mood = getMoodOverlap(a, b);
  const scent = getScentSimilarity(a, b);
  const sharedSet = new Set(scent.sharedNotes.map(normalizeNote));

  return {
    mood,
    scent,
    familyMatch: a.family === b.family,
    seasonMatch: a.season === b.season,
    longevityMatch: a.longevity === b.longevity,
    layers: {
      top: {
        a: markSharedNotes(a.notes.top, sharedSet),
        b: markSharedNotes(b.notes.top, sharedSet),
      },
      heart: {
        a: markSharedNotes(a.notes.heart, sharedSet),
        b: markSharedNotes(b.notes.heart, sharedSet),
      },
      base: {
        a: markSharedNotes(a.notes.base, sharedSet),
        b: markSharedNotes(b.notes.base, sharedSet),
      },
    },
  };
}
