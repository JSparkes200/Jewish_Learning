/**
 * Passage authoring pipeline: tokenization, corpus overlap, and register hints
 * for generated / curated Hebrew (modern media vs literary vs rabbinic).
 *
 * Pair with `tools/hebrew-content-pipeline/` (Python + Stanza) for morphology,
 * and `scripts/validate-hebrew-passage.ts` for CLI checks against `corpus-d`.
 */

import { LEGACY_CORPUS_D } from "@/data/corpus-d";
import { stripNikkud } from "@/lib/hebrew-nikkud";

/** Target register for prompts and future generation constraints. */
export type HebrewPassageRegister = "media" | "literary" | "rabbinic";

/** Iteration order for UI and “next up” style lists. */
export const HEBREW_PASSAGE_REGISTERS: readonly HebrewPassageRegister[] = [
  "media",
  "literary",
  "rabbinic",
] as const;

/** Short English hints for LLM system prompts (expand over time). */
export const REGISTER_PROMPT_HINTS: Record<
  HebrewPassageRegister,
  { label: string; constraints: string[] }
> = {
  media: {
    label: "Modern Israeli media (news, interview, colloquial)",
    constraints: [
      "Prefer spoken-neutral and journalistic register; short–medium sentences.",
      "Avoid biblical-only archaisms unless quoted; match TV/print/web tone.",
      "Use vocabulary learners meet in Israeli public discourse.",
    ],
  },
  literary: {
    label: "Modern Hebrew literary / essay prose",
    constraints: [
      "Allow richer imagery and longer sentences than news copy.",
      "Still use contemporary norms (not biblical tense unless stylistic).",
    ],
  },
  rabbinic: {
    label: "Rabbinic / textual Hebrew (Mishnah–Talmud register)",
    constraints: [
      "Use attested connectives and citation habits; not street slang.",
      "May overlap with Aramaic particles in mixed passages — label clearly.",
    ],
  },
};

export type LLMAuthoringPromptOptions = {
  /** Prefer lemmas at or below this course level (1–4) in wording. */
  maxCorpusLevel?: number;
  /** Freeform note passed to the model (topic, audience). */
  sourceNote?: string;
  /** Rough length target for generated passages. */
  passageLength?: "paragraph" | "short_multi" | "long";
};

/**
 * Single block to paste as a system or user message when asking an LLM to draft
 * Hebrew passages for this app (then run corpus validation on the result).
 */
export function buildLLMAuthoringPrompt(
  register: HebrewPassageRegister,
  options?: LLMAuthoringPromptOptions,
): string {
  const meta = REGISTER_PROMPT_HINTS[register];
  const lines: string[] = [
    "You are helping author Hebrew learning content for this app (Ivrit: modern and traditional registers).",
    "Write the passage in Hebrew unless the editor explicitly asks for English.",
    "",
    `REGISTER: ${meta.label}`,
    "Constraints:",
    ...meta.constraints.map((c) => `- ${c}`),
  ];
  const lvl = options?.maxCorpusLevel;
  if (
    typeof lvl === "number" &&
    Number.isInteger(lvl) &&
    lvl >= 1 &&
    lvl <= 4
  ) {
    lines.push(
      "",
      `Vocabulary preference: where possible, favor wording consistent with a leveled foundation course (rough ceiling: corpus level ${lvl}). Natural, contemporary Hebrew still comes first.`,
    );
  }
  const note = options?.sourceNote?.trim();
  if (note) {
    lines.push("", `Editor context: ${note}`);
  }
  const plen = options?.passageLength;
  if (plen) {
    const lengthLine: Record<
      NonNullable<LLMAuthoringPromptOptions["passageLength"]>,
      string
    > = {
      paragraph: "Length: one short paragraph (about 3–6 sentences).",
      short_multi:
        "Length: about two short paragraphs or equivalent (reading-homework size).",
      long: "Length: multiple paragraphs (longer reading assignment).",
    };
    lines.push("", lengthLine[plen]);
  }
  lines.push(
    "",
    "Output format:",
    "- Hebrew passage first (nikkud optional unless the editor requests unvocalized text).",
    "- If asked, add English MCQ stems and answer choices after the Hebrew.",
  );
  return lines.join("\n");
}

const HEBREW_TOKEN = /[\u0590-\u05FF]+/g;

/** Extract contiguous Hebrew script tokens (includes niqqud). */
export function tokenizeHebrewWords(text: string): string[] {
  return text.match(HEBREW_TOKEN) ?? [];
}

/** Lowercase not applicable; strip niqqud and trim for dictionary lookup. */
export function normalizeHebrewToken(token: string): string {
  return stripNikkud(token).replace(/^\s+|\s+$/g, "");
}

function splitCorpusHeadword(h: string): string[] {
  const bare = stripNikkud(h);
  return bare.split(/[\s\u00A0]+/).filter(Boolean);
}

let corpusFormSetCache: ReadonlySet<string> | null = null;
let corpusFormMinLevelCache: Map<string, number> | null = null;

/**
 * Minimum `l` among headwords that contain this normalized form (lemma snapshot).
 */
export function getCorpusFormMinLevelMap(): Map<string, number> {
  if (corpusFormMinLevelCache) return corpusFormMinLevelCache;
  const m = new Map<string, number>();
  for (const e of LEGACY_CORPUS_D) {
    for (const w of splitCorpusHeadword(e.h)) {
      const n = normalizeHebrewToken(w);
      if (!n) continue;
      const prev = m.get(n);
      if (prev === undefined || e.l < prev) m.set(n, e.l);
    }
  }
  corpusFormMinLevelCache = m;
  return corpusFormMinLevelCache;
}

/**
 * All normalized word forms appearing in `LEGACY_CORPUS_D` headwords
 * (single- and multi-word entries split).
 */
export function getCorpusNormalizedFormSet(): ReadonlySet<string> {
  if (corpusFormSetCache) return corpusFormSetCache;
  const s = new Set(getCorpusFormMinLevelMap().keys());
  corpusFormSetCache = s;
  return corpusFormSetCache;
}

export type PassageCorpusValidation = {
  tokenCount: number;
  /** Normalized unknown forms (no niqqud). */
  unknownForms: string[];
  /** Share of tokens whose normalized form appears in corpus headwords (0–1). */
  knownFormRatio: number;
};

/**
 * Cross-check passage tokens against dictionary headwords in `corpus-d`.
 * Unknown tokens may still be valid (names, neologisms, inflected forms not
 * listed as separate headwords).
 */
export function validatePassageAgainstCorpusD(text: string): PassageCorpusValidation {
  const raw = tokenizeHebrewWords(text);
  const corpus = getCorpusNormalizedFormSet();
  const unknown = new Set<string>();
  let known = 0;
  for (const t of raw) {
    const n = normalizeHebrewToken(t);
    if (!n) continue;
    if (corpus.has(n)) known += 1;
    else unknown.add(n);
  }
  const tokenCount = raw.length;
  const knownFormRatio = tokenCount === 0 ? 1 : known / tokenCount;
  return {
    tokenCount,
    unknownForms: [...unknown].sort(),
    knownFormRatio,
  };
}

export type PassageCorpusLevelValidation = PassageCorpusValidation & {
  /** Forms attested in corpus only above `maxLevel`. */
  outOfLevelForms: string[];
};

/**
 * Same as {@link validatePassageAgainstCorpusD}, but classifies tokens by
 * minimum headword level in `LEGACY_CORPUS_D`.
 */
export function validatePassageAgainstCorpusLevel(
  text: string,
  maxLevel: number,
): PassageCorpusLevelValidation {
  const raw = tokenizeHebrewWords(text);
  const levels = getCorpusFormMinLevelMap();
  const unknown = new Set<string>();
  const outLevel = new Set<string>();
  let known = 0;
  for (const t of raw) {
    const n = normalizeHebrewToken(t);
    if (!n) continue;
    const L = levels.get(n);
    if (L === undefined) unknown.add(n);
    else if (L > maxLevel) outLevel.add(n);
    else known += 1;
  }
  const tokenCount = raw.length;
  const knownFormRatio = tokenCount === 0 ? 1 : known / tokenCount;
  return {
    tokenCount,
    unknownForms: [...unknown].sort(),
    knownFormRatio,
    outOfLevelForms: [...outLevel].sort(),
  };
}

/** Rough bucket for authoring pipelines (not linguistic POS tagging). */
export function suggestRegisterFromSourceNote(note: string): HebrewPassageRegister {
  const lower = note.toLowerCase();
  if (/talmud|mishnah|gemara|midrash|parash|סוגיא/i.test(note)) {
    return "rabbinic";
  }
  if (/news|journal|interview|עיתונות|רדיו|טלוויזיה/i.test(lower)) {
    return "media";
  }
  if (/story|novel|poem|סיפורת|ספרות/i.test(lower)) {
    return "literary";
  }
  return "media";
}

export function formatValidationReport(
  v: PassageCorpusValidation,
  title = "Corpus overlap",
): string {
  const pct = Math.round(v.knownFormRatio * 1000) / 10;
  const lines = [
    `${title}`,
    `  Tokens: ${v.tokenCount}`,
    `  Known headword overlap: ${pct}%`,
    `  Unknown forms (${v.unknownForms.length}): ${v.unknownForms.slice(0, 40).join(", ")}${v.unknownForms.length > 40 ? " …" : ""}`,
  ];
  return lines.join("\n");
}
