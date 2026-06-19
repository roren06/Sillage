import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HeroExperience } from "@/components/HeroExperience";
import { perfumeMap, perfumes } from "@/lib/perfumes";

type ScentPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return perfumes.map((perfume) => ({ id: perfume.id }));
}

export async function generateMetadata({
  params,
}: ScentPageProps): Promise<Metadata> {
  const { id } = await params;
  const perfume = perfumeMap[id];

  if (!perfume) {
    return { title: "Scent not found | Sillage" };
  }

  return {
    title: `${perfume.name} | Sillage`,
    description: perfume.tagline,
  };
}

export default async function ScentPage({ params }: ScentPageProps) {
  const { id } = await params;

  if (!perfumeMap[id]) {
    notFound();
  }

  return <HeroExperience perfumeId={id} />;
}
