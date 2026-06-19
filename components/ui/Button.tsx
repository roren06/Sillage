import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost" | "icon";
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-white px-6 py-3 text-sm text-zinc-900 shadow-lg shadow-black/20 hover:-translate-y-0.5 hover:bg-white/95",
    ghost:
      "border border-white/25 bg-white/10 px-6 py-3 text-sm text-white backdrop-blur-md hover:bg-white/15",
    icon: "size-12 border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/15",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
