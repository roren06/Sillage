# Sillage — Scent Atlas

Explore fragrances by mood, notes, and vibe. Sillage is an immersive discovery experience: each scent opens with its atmosphere, note pyramid, and personality — save favourites, rank your rotation, and find similar scents worth trying next.

**Live demo:** _Add your Vercel URL after deploy_

## Features

- **Immersive hero** — mood backgrounds, bottle imagery, and copy animate together as you browse
- **28-scent catalog** — designer and Middle Eastern fragrances with unique mood photos
- **Search & filters** — find scents by name, note, family, or vibe tag
- **Shareable URLs** — every scent has its own page (`/scent/sauvage-elixir`, etc.)
- **My rotation** — save scents, drag to rank your daily picks, compare side-by-side
- **Similar Vibes** — mood-matched recommendations with overlap scores
- **Scent comparison** — mood overlap + note-based scent similarity

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://zustand.docs.pmnd.rs) (persisted saves)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on the default scent and can browse from there.

### Other commands

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint
```

## Project structure

```
app/              Next.js routes (/ redirects to default scent, /scent/[id] per perfume)
components/       UI — hero, carousel, saved drawer, compare, sections
hooks/            Selection, accent theme, reduced motion
lib/              Perfume catalog (perfumes.json), similarity, routes
public/bottles/   Local bottle PNG assets
store/            Zustand state (selection, search, saved rotation)
```

## Adding a perfume

1. Add bottle PNG to `public/bottles/`
2. Add an entry to `lib/perfumes.json` (hero/card images, notes, vibes, similar links)
3. Assign a unique Unsplash mood photo — run `node scripts/assign-backgrounds.cjs` if updating backgrounds in bulk

## Deploy on Vercel

1. Push this repo to GitHub (or GitLab / Bitbucket)
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Next.js** — no extra env vars required
4. Deploy

Unsplash images load from `images.unsplash.com` (already configured in `next.config.ts`).

```bash
# Optional: deploy from CLI
npx vercel
```

## Notes

Fragrance names and bottle imagery belong to their respective houses. Sillage is a discovery tool, not affiliated with any brand.
