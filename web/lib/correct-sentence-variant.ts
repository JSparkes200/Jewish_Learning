import type { CourseSentence } from "@/data/course-sentences";

/** Which authored variant the learner’s choice matches, if any. */
export function sentenceVariant(
  cs: CourseSentence,
  lineHe: string,
): "correct" | "wrongSemantics" | "wrongGrammar" | "wrongOrder" {
  const s = lineHe.trim();
  if (s === cs.correct.trim()) return "correct";
  if (s === cs.wrongSemantics.trim()) return "wrongSemantics";
  if (s === cs.wrongGrammar.trim()) return "wrongGrammar";
  return "wrongOrder";
}

export function sentenceFeedbackWhy(
  variant: "correct" | "wrongSemantics" | "wrongGrammar" | "wrongOrder",
  isRight: boolean,
): string {
  if (isRight) {
    return "This line matches the prompt with natural word order, agreement, and meaning.";
  }
  switch (variant) {
    case "correct":
      return "";
    case "wrongSemantics":
      return "The words are real Hebrew, but the meaning is odd, funny, or off for the situation — it doesn’t say what a speaker would mean.";
    case "wrongGrammar":
      return "Word forms or extra bits don’t match (e.g. agreement, wrong verb with the subject) — a fluent speaker would fix the grammar here.";
    case "wrongOrder":
    default:
      return "The pieces are mostly valid words, but the order of information is hard to follow or not how a speaker would build this in Hebrew.";
  }
}
