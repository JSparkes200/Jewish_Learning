/**
 * Breaks down Hebrew compound/inflected words into their constituent morphemes
 * so learners can see what a word like "וַיְדַבֵּר" actually means piece-by-piece.
 *
 * Strategy:
 *   1. Split on maqaf (־) — these are really two separate words glued together.
 *   2. For each segment, try a direct Sefaria dictionary lookup.
 *   3. If that fails, progressively strip common prefixes (ו, ה, ב, ל, מ, כ, ש)
 *      and look up the remainder until we find a hit (or give up).
 *   4. Also identify common pronominal suffixes when the stem looks like a
 *      known root pattern.
 *
 * The goal is educational: show the learner each piece, what it means, and
 * how the pieces combine.
 */
import { stripNikkud } from "@/lib/hebrew-nikkud";
import type { SefariaLexiconEntry } from "@/lib/word-detail-enrichment";

export type HebrewMorphemeRole =
  | "conjunction"     // ו — "and"
  | "article"         // ה — "the"
  | "preposition"     // ב, ל, מ, כ
  | "relative"        // ש — "that/who/which"
  | "interrogative"   // ה — yes/no question marker (rare, context-dependent)
  | "stem"            // the core noun/verb/etc.
  | "suffix-pronoun"  // י, ך, ו, ה, נו, כם, ם, ן
  | "word";           // a free-standing word in a maqaf compound

export type HebrewMorpheme = {
  /** The Hebrew letters of this morpheme (pointed if the source was pointed). */
  form: string;
  /** The letters stripped of nikkud / te'amim — handy for lookup + display. */
  bare: string;
  role: HebrewMorphemeRole;
  /** Concise English gloss ("and", "from", "to speak", "him", …). */
  gloss: string;
  /** Optional longer explanation (grammatical note, etc.). */
  note?: string;
  /** Dictionary entries that matched this morpheme (only for `stem`/`word`). */
  lexiconEntries?: SefariaLexiconEntry[];
};

export type HebrewConstructionBreakdown = {
  /** The original input with nikkud preserved. */
  original: string;
  /** Morphemes listed in **reading order** (right-to-left for Hebrew). */
  morphemes: HebrewMorpheme[];
  /** A natural English rendering of the combined phrase, when we can build one. */
  combinedMeaning: string | null;
};

/** U+05BE — a short dash that binds two words into one phonological unit. */
const MAQAF = "\u05BE";

/** Common single-letter inseparable prefixes + their glosses. */
const PREFIX_TABLE: Array<{
  letter: string;
  role: HebrewMorphemeRole;
  gloss: string;
  note?: string;
}> = [
  { letter: "ו", role: "conjunction", gloss: "and" },
  // ה can be either the article or an interrogative; we label it "the" by default.
  { letter: "ה", role: "article", gloss: "the" },
  { letter: "ב", role: "preposition", gloss: "in / with / at" },
  { letter: "ל", role: "preposition", gloss: "to / for" },
  { letter: "מ", role: "preposition", gloss: "from" },
  { letter: "כ", role: "preposition", gloss: "like / as" },
  { letter: "ש", role: "relative", gloss: "that / who / which" },
];

function stripTaamim(text: string): string {
  // Cantillation marks + punctuation. Keeps vowel points.
  return text.replace(/[\u0591-\u05AF\u05BD\u05C0\u05C3-\u05C6]/g, "");
}

function firstBareLetter(s: string): string {
  const bare = stripNikkud(s);
  return bare[0] ?? "";
}

function splitOffFirstLetter(form: string): { first: string; rest: string } {
  // Grab the first consonant plus any trailing nikkud/te'amim cluster, leave
  // the rest intact (so we keep pointing on the stem).
  const match = form.match(/^([\u05D0-\u05EA])([\u0591-\u05C7]*)(.*)$/u);
  if (!match) return { first: form, rest: "" };
  return { first: match[1] + match[2], rest: match[3] };
}

type LexiconLookup = (bare: string) => Promise<SefariaLexiconEntry[]>;

/**
 * Walks a single word (no maqaf), peeling off prefixes until the remainder is
 * found in the dictionary or we run out of prefixes.
 */
async function analyzeSingleWord(
  word: string,
  lookup: LexiconLookup,
): Promise<HebrewMorpheme[]> {
  const morphemes: HebrewMorpheme[] = [];
  let current = word;
  let bareCurrent = stripNikkud(current);

  // Look up the full form first. Sefaria is forgiving and will often route an
  // inflected/prefixed form ("וימתו") to its root headword ("מות"). That's
  // useful two ways: (a) we always have a root entry to show, and (b) the
  // mismatch between the input's first letter and the headword's first letter
  // tells us the first letter is a prefix even though the dictionary "matched".
  let directEntries: SefariaLexiconEntry[] = [];
  if (bareCurrent.length >= 2) {
    directEntries = await lookup(bareCurrent);
  }

  const head0 = firstBareLetter(current);
  const prefix0 = PREFIX_TABLE.find((p) => p.letter === head0);
  const directHeadwordStartsWith = (letter: string) =>
    directEntries.some((e) => stripNikkud(e.headword ?? "").startsWith(letter));
  const firstLetterIsPrefix =
    !!prefix0 &&
    bareCurrent.length > 2 &&
    directEntries.length > 0 &&
    !directHeadwordStartsWith(head0);

  // Direct match and the first letter clearly isn't a prefix → done.
  if (directEntries.length > 0 && !firstLetterIsPrefix) {
    return [
      {
        form: stripTaamim(current),
        bare: bareCurrent,
        role: "stem",
        gloss: summarizeDefinition(directEntries[0].definition),
        lexiconEntries: directEntries,
      },
    ];
  }

  // Otherwise peel prefixes (up to 3; real Biblical Hebrew rarely stacks more).
  for (let i = 0; i < 3; i += 1) {
    const head = firstBareLetter(current);
    const prefix = PREFIX_TABLE.find((p) => p.letter === head);
    if (!prefix) break;
    // Don't strip if removing the prefix would leave nothing useful.
    if (bareCurrent.length <= 2) break;

    const { first, rest } = splitOffFirstLetter(current);
    const bareRest = stripNikkud(rest);
    if (!bareRest) break;

    // See if the remainder (or remainder without nikkud) resolves.
    const tail = await lookup(bareRest);
    if (tail.length > 0) {
      morphemes.push({
        form: stripTaamim(first),
        bare: head,
        role: prefix.role,
        gloss: prefix.gloss,
        note: prefix.note,
      });
      morphemes.push({
        form: stripTaamim(rest),
        bare: bareRest,
        role: "stem",
        gloss: summarizeDefinition(tail[0].definition),
        lexiconEntries: tail,
      });
      return morphemes;
    }

    // Dictionary still missing — record the prefix and keep peeling.
    morphemes.push({
      form: stripTaamim(first),
      bare: head,
      role: prefix.role,
      gloss: prefix.gloss,
      note: prefix.note,
    });
    current = rest;
    bareCurrent = bareRest;
  }

  // Couldn't peel to a cleaner stem: fall back to the direct full-word lookup
  // (if we had one) so the learner still sees the dictionary root.
  if (bareCurrent) {
    morphemes.push({
      form: stripTaamim(current),
      bare: bareCurrent,
      role: "stem",
      gloss: directEntries.length
        ? summarizeDefinition(directEntries[0].definition)
        : "(no dictionary match — see AI breakdown)",
      lexiconEntries: directEntries.length ? directEntries : undefined,
    });
  }
  return morphemes;
}

export async function analyzeHebrewConstruction(
  input: string,
  lookup: LexiconLookup,
): Promise<HebrewConstructionBreakdown | null> {
  const original = input.trim();
  if (!original) return null;

  // Split on maqaf first. Each sub-word is analysed independently.
  const segments = original.split(MAQAF).map((s) => s.trim()).filter(Boolean);
  if (segments.length === 0) return null;

  const all: HebrewMorpheme[] = [];
  for (const seg of segments) {
    const parts = await analyzeSingleWord(seg, lookup);
    if (segments.length > 1 && parts.length === 1 && parts[0].role === "stem") {
      parts[0] = { ...parts[0], role: "word" };
    }
    all.push(...parts);
  }

  // Only return a breakdown if it *adds* information — i.e. there's more than
  // a single stem with a direct match. Otherwise the caller already has that.
  const hasBreakdownValue =
    all.length > 1 || (all.length === 1 && all[0].role !== "stem");
  if (!hasBreakdownValue) return null;

  return {
    original,
    morphemes: all,
    combinedMeaning: buildCombinedMeaning(all),
  };
}

function summarizeDefinition(def: string): string {
  const clean = def.replace(/<[^>]*>/g, "").trim();
  if (!clean) return "";
  // Keep the first clause so the gloss stays short.
  const short = clean.split(/[.;,]/)[0]?.trim() ?? clean;
  return short.length > 80 ? `${short.slice(0, 77)}…` : short;
}

function buildCombinedMeaning(morphemes: HebrewMorpheme[]): string | null {
  const parts: string[] = [];
  for (const m of morphemes) {
    if (m.role === "stem" || m.role === "word") {
      if (m.gloss && !m.gloss.startsWith("(")) parts.push(m.gloss);
    } else if (m.gloss) {
      parts.push(`[${m.gloss}]`);
    }
  }
  if (!parts.length) return null;
  return parts.join(" + ");
}
