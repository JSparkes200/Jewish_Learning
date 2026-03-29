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
