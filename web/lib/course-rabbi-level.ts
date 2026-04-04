import type { RabbiLevel } from "@/lib/rabbi-types";

/** Map course numeric level (1–4) to Ask the Rabbi learner tier. */
export function courseLevelToRabbiLevel(level: number): RabbiLevel {
  if (level <= 1) return "beginner";
  if (level === 2) return "intermediate";
  return "advanced";
}
