import { notFound } from "next/navigation";
import { YIDDISH_SECTION_IDS } from "@/data/yiddish-course";
import { YiddishSectionClient } from "./YiddishSectionClient";

type Props = {
  params: Promise<{ sectionId: string }>;
};

export default async function YiddishSectionPage({ params }: Props) {
  const { sectionId: raw } = await params;
  const sectionId = decodeURIComponent(raw);
  if (!(YIDDISH_SECTION_IDS as readonly string[]).includes(sectionId))
    notFound();
  return <YiddishSectionClient sectionId={sectionId} />;
}
