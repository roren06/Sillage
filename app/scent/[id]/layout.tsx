import { notFound } from "next/navigation";

import { HeroExperience } from "@/components/HeroExperience";
import { perfumeMap } from "@/lib/perfumes";

type ScentLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function ScentLayout({ children, params }: ScentLayoutProps) {
  const { id } = await params;

  if (!perfumeMap[id]) {
    notFound();
  }

  return (
    <>
      <HeroExperience perfumeId={id} />
      {children}
    </>
  );
}
