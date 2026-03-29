import { notFound } from "next/navigation";
import { getSectionsForLevel } from "@/data/course";
import { LearnSectionClient } from "./LearnSectionClient";

type Props = {
  params: Promise<{ level: string; sectionId: string }>;
};

export default async function LearnSectionPage({ params }: Props) {
  const { level: raw, sectionId: rawSid } = await params;
  const level = parseInt(raw, 10);
  const sectionId = decodeURIComponent(rawSid);
  if (Number.isNaN(level) || level < 1 || level > 4) notFound();
  const sections = getSectionsForLevel(level);
  if (!sections.some((s) => s.id === sectionId)) notFound();
  return <LearnSectionClient level={level} sectionId={sectionId} />;
}
