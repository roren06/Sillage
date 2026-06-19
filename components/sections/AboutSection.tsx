export function AboutSection() {
  return (
    <section
      id="about"
      className="border-t border-white/10 bg-[#120f0d] px-6 py-20 md:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">
            About Sillage
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.06em] text-white md:text-6xl">
            A scent atlas for enthusiasts
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
            Sillage helps you explore fragrances by mood, notes, and personality
            — not just brand names. Every scent opens with its atmosphere, note
            pyramid, and vibe tags so you can find what fits your rotation, save
            favourites, and discover close matches worth trying next.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            ["01", "Browse by mood, notes, and vibe"],
            ["02", "Save scents to your collection"],
            ["03", "Discover similar fragrances"],
          ].map(([step, label]) => (
            <div
              key={step}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                {step}
              </p>
              <p className="mt-2 text-white/80">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
