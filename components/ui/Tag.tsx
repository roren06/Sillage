import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  accent?: string;
};

export function Tag({ children, accent }: TagProps) {
  return (
    <span
      className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm"
      style={accent ? { borderColor: `${accent}55`, color: accent } : undefined}
    >
      {children}
    </span>
  );
}
