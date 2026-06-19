export type NoteFamily =
  | "fresh"
  | "woody"
  | "floral"
  | "oriental"
  | "gourmand";

export type Longevity = "moderate" | "long" | "beast";

export type Perfume = {
  id: string;
  name: string;
  house: string;
  tagline: string;
  family: NoteFamily;
  season: string;
  longevity: Longevity;
  vibe: string[];
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  hero: {
    image: string;
    gradient: string;
    accent: string;
  };
  card: {
    image: string;
    label: string;
  };
  bottle: {
    image: string;
    scale?: number;
  };
  similar?: string[];
};
