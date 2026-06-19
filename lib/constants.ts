export const ANIMATION = {
  heroFade: 0.55,
  textStagger: 0.07,
  cardSpring: { type: "spring" as const, stiffness: 380, damping: 28 },
  popSpring: { type: "spring" as const, stiffness: 420, damping: 22 },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "#collection" },
  { label: "Similar Vibes", href: "#similar" },
  { label: "About", href: "#about" },
] as const;

export const FILTER_CHIPS = [
  { label: "Fresh", query: "fresh" },
  { label: "Woody", query: "woody" },
  { label: "Gourmand", query: "gourmand" },
  { label: "Beast mode", query: "beast" },
  { label: "Vanilla", query: "vanilla" },
] as const;

export const LONGEVITY_LEVELS = {
  moderate: { label: "Moderate", bars: 1 },
  long: { label: "Long-lasting", bars: 2 },
  beast: { label: "Beast mode", bars: 3 },
} as const;
