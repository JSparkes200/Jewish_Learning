import { notFound } from "next/navigation";
import { getStoryForLevel } from "@/data/course-stories";
import { getCurriculumStory } from "@/data/learn-stories";
import { LearnStoryClient } from "./LearnStoryClient";

type Props = { params: Promise<{ level: string }> };

export default async function LearnLevelStoryPage({ params }: Props) {
  const { level: raw } = await params;
  const level = parseInt(raw, 10);
  if (Number.isNaN(level) || level < 1 || level > 4) notFound();

  const story = getStoryForLevel(level);
  if (!story) notFound();

  const meta = getCurriculumStory(level);

  return (
    <LearnStoryClient
      level={level}
      he={story.he}
      en={story.en}
      syntaxNotes={meta?.syntaxNotes ?? []}
      storyTitle={meta?.title}
      gradeBand={meta?.gradeBand}
    />
  );
}
