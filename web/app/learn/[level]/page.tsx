import { notFound } from "next/navigation";
import { LearnLevelClient } from "./LearnLevelClient";

type Props = { params: Promise<{ level: string }> };

export default async function LearnLevelPage({ params }: Props) {
  const { level: raw } = await params;
  const level = parseInt(raw, 10);
  if (Number.isNaN(level) || level < 1 || level > 4) notFound();
  return <LearnLevelClient level={level} />;
}
