import { z } from "zod";

/** POST /api/mcq-choices */
export const mcqChoicesBodySchema = z.object({
  item: z
    .object({
      id: z.string().max(200),
      promptHe: z.string().max(800),
      correctEn: z.string().max(800),
      distractorsEn: z.array(z.string().max(800)).max(24),
    })
    .passthrough(),
  corpusMaxLevel: z.number().int().min(1).max(4),
});

/** POST /api/validate-hebrew-passage */
export const validateHebrewPassageBodySchema = z.object({
  text: z.string().max(48_000),
  maxLevel: z.number().int().min(1).max(4).optional(),
});

/** PUT /api/progress — nested learner state */
export const progressPutBodySchema = z.object({
  progress: z.record(z.string(), z.any()),
});

/** POST /api/rabbi */
export const rabbiBodySchema = z.object({
  targetHe: z.string().min(1).max(500),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  translit: z.string().max(500).optional(),
  meaningEn: z.string().max(2000).optional(),
  /** Optional pre-fetched LightRAG text (e.g. from CLI); skips server-side Python */
  ragContext: z.string().max(120_000).optional(),
  /** Learner follow-up (legacy quick-asks / free text), appended to the user message. */
  learnerQuestion: z.string().max(4000).optional(),
});
