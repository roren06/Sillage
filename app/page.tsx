import { redirect } from "next/navigation";

import { defaultPerfumeId } from "@/lib/perfumes";
import { scentPath } from "@/lib/routes";

export default function Home() {
  redirect(scentPath(defaultPerfumeId));
}
