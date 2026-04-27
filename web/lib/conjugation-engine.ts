/**
 * Conjugation “referee”: normalizes learner input and checks it against curated
 * root + binyan + task puzzles. Full generative morphology is out of scope; the
 * bank is the source of truth for grading.
 */

import {
  getConjugationEnrichment,
  type ConjugationExample,
} from "@/lib/conjugation-puzzle-enrichment";
import { stripNikkud } from "@/lib/hebrew-nikkud";

export type ConjugationTaskKind =
  | "infinitive"
  | "past_3ms"
  | "past_3fs"
  | "present_3ms";

export type ConjugationPuzzle = {
  id: string;
  /** Display like כ׳·ת׳·ב׳ */
  rootLetters: string;
  /** Corpus / progress key (unvowelled root letters) */
  rootKey: string;
  binyanLabel: string;
  taskEn: string;
  taskKind: ConjugationTaskKind;
  expectedAccepted: readonly string[];
  difficulty: 1 | 2 | 3 | 4;
  hintEn?: string;
};

/** Curated puzzles; extend as you add lessons. */
export const CONJUGATION_PUZZLES: readonly ConjugationPuzzle[] = [
  // —— Difficulty 1: Pa‘al · infinitive (foundation) ——
  {
    id: "hlk-paal-inf",
    rootLetters: "ה׳·ל׳·כ׳",
    rootKey: "הלך",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לָלֶכֶת"],
    difficulty: 1,
  },
  {
    id: "ktb-paal-inf",
    rootLetters: "כ׳·ת׳·ב׳",
    rootKey: "כתב",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לִכְתֹּב"],
    difficulty: 1,
  },
  {
    id: "amr-paal-inf",
    rootLetters: "א׳·מ׳·ר׳",
    rootKey: "אמר",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לוֹמַר"],
    difficulty: 1,
  },
  {
    id: "yd3-paal-inf",
    rootLetters: "י׳·ד׳·ע׳",
    rootKey: "ידע",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לָדַעַת"],
    difficulty: 1,
    hintEn: "Pe–Yod: the י drops in the infinitive pattern.",
  },
  {
    id: "rah-paal-inf",
    rootLetters: "ר׳·א׳·ה׳",
    rootKey: "ראה",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לִרְאוֹת"],
    difficulty: 1,
    hintEn: "Lamed–He roots reshape the ending in לִ…",
  },
  {
    id: "shm-paal-inf",
    rootLetters: "ש׳·מ׳·ע׳",
    rootKey: "שמע",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לִשְׁמֹעַ"],
    difficulty: 1,
  },
  {
    id: "ahb-paal-inf",
    rootLetters: "א׳·ה׳·ב׳",
    rootKey: "אהב",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לֶאֱהֹב"],
    difficulty: 1,
  },
  {
    id: "bw2-paal-inf",
    rootLetters: "ב׳·ו׳·א׳",
    rootKey: "בוא",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לָבוֹא"],
    difficulty: 1,
    hintEn: "Hollow root: the middle radical hides and reappears.",
  },
  {
    id: "ntn-paal-inf",
    rootLetters: "נ׳·ת׳·נ׳",
    rootKey: "נתן",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לָתֵת"],
    difficulty: 1,
    hintEn: "Pe–Nun: the first נ disappears in the infinitive.",
  },
  // —— Difficulty 2: Pa‘al · past / present ——
  {
    id: "ktb-paal-past-ms",
    rootLetters: "כ׳·ת׳·ב׳",
    rootKey: "כתב",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Past tense · 3rd · masculine · singular",
    taskKind: "past_3ms",
    expectedAccepted: ["כָּתַב"],
    difficulty: 2,
  },
  {
    id: "amr-paal-past-ms",
    rootLetters: "א׳·מ׳·ר׳",
    rootKey: "אמר",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Past tense · 3rd · masculine · singular",
    taskKind: "past_3ms",
    expectedAccepted: ["אָמַר"],
    difficulty: 2,
  },
  {
    id: "yd3-paal-past-ms",
    rootLetters: "י׳·ד׳·ע׳",
    rootKey: "ידע",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Past tense · 3rd · masculine · singular",
    taskKind: "past_3ms",
    expectedAccepted: ["יָדַע"],
    difficulty: 2,
  },
  {
    id: "shm-paal-past-ms",
    rootLetters: "ש׳·מ׳·ע׳",
    rootKey: "שמע",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Past tense · 3rd · masculine · singular",
    taskKind: "past_3ms",
    expectedAccepted: ["שָׁמַע"],
    difficulty: 2,
  },
  {
    id: "ktb-paal-pres-ms",
    rootLetters: "כ׳·ת׳·ב׳",
    rootKey: "כתב",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Present · 3rd · masculine · singular",
    taskKind: "present_3ms",
    expectedAccepted: ["כּוֹתֵב"],
    difficulty: 2,
  },
  {
    id: "hlk-paal-pres-ms",
    rootLetters: "ה׳·ל׳·כ׳",
    rootKey: "הלך",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Present · 3rd · masculine · singular",
    taskKind: "present_3ms",
    expectedAccepted: ["הוֹלֵךְ"],
    difficulty: 2,
  },
  // —— Difficulty 3: other binyanim (still high-frequency) ——
  {
    id: "ktb-hitpaal-inf",
    rootLetters: "כ׳·ת׳·ב׳",
    rootKey: "כתב",
    binyanLabel: "הִתְפַּעֵל (Hitpa‘el)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לְהִתְכַּתֵּב"],
    difficulty: 3,
    hintEn: "Correspond / write back and forth — the hitpa‘el of כ–ת–ב.",
  },
  {
    id: "yd3-hifil-inf",
    rootLetters: "י׳·ד׳·ע׳",
    rootKey: "ידע",
    binyanLabel: "הִפְעִיל (Hif‘il)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לְהוֹדִיעַ"],
    difficulty: 3,
  },
  {
    id: "kns-nifal-inf",
    rootLetters: "כ׳·נ׳·ס׳",
    rootKey: "כנס",
    binyanLabel: "נִפְעַל (Nif‘al)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לְהִכָּנֵס"],
    difficulty: 3,
  },
  {
    id: "slm-piel-inf",
    rootLetters: "ש׳·ל׳·מ׳",
    rootKey: "שלם",
    binyanLabel: "פִּעֵל (Pi‘el)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לְשַׁלֵּם"],
    difficulty: 3,
  },
  {
    id: "shm-hifil-past-ms",
    rootLetters: "ש׳·מ׳·ע׳",
    rootKey: "שמע",
    binyanLabel: "הִפְעִיל (Hif‘il)",
    taskEn: "Past tense · 3rd · masculine · singular",
    taskKind: "past_3ms",
    expectedAccepted: ["הִשְׁמִיעַ"],
    difficulty: 3,
  },
  // —— Difficulty 4: register / finer agreement ——
  {
    id: "ktb-paal-past-fs",
    rootLetters: "כ׳·ת׳·ב׳",
    rootKey: "כתב",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Past tense · 3rd · feminine · singular",
    taskKind: "past_3fs",
    expectedAccepted: ["כָּתְבָה"],
    difficulty: 4,
  },
  {
    id: "amr-paal-past-fs",
    rootLetters: "א׳·מ׳·ר׳",
    rootKey: "אמר",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Past tense · 3rd · feminine · singular",
    taskKind: "past_3fs",
    expectedAccepted: ["אָמְרָה"],
    difficulty: 4,
  },
  {
    id: "rah-paal-past-fs",
    rootLetters: "ר׳·א׳·ה׳",
    rootKey: "ראה",
    binyanLabel: "פָּעַל (Pa‘al)",
    taskEn: "Past tense · 3rd · feminine · singular",
    taskKind: "past_3fs",
    expectedAccepted: ["רָאֲתָה", "רָאתָה"],
    difficulty: 4,
  },
  {
    id: "lmd-piel-inf",
    rootLetters: "ל׳·מ׳·ד׳",
    rootKey: "למד",
    binyanLabel: "פִּעֵל (Pi‘el)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לְלַמֵּד"],
    difficulty: 4,
  },
  {
    id: "psh-hitpaal-inf",
    rootLetters: "פ׳·ש׳·ט׳",
    rootKey: "פשט",
    binyanLabel: "הִתְפַּעֵל (Hitpa‘el)",
    taskEn: "Infinitive",
    taskKind: "infinitive",
    expectedAccepted: ["לְהִתְפַּשֵּׁט"],
    difficulty: 4,
    hintEn: "Relax / unwind (reflexive).",
  },
];

const MAQAF = "\u05BE";
const HYPHEN = "-";

export function normalizeHebrewInput(raw: string): string {
  let s = raw.normalize("NFC").trim();
  s = s.replace(/\s+/g, " ");
  s = s.replace(new RegExp(`[${HYPHEN}]`, "g"), MAQAF);
  return s;
}

function lettersOnlyUnpointed(s: string): string {
  return stripNikkud(s).replace(/[^\u0590-\u05FF]/g, "");
}

/** Bare Hebrew letters for comparing conjugation surfaces (ignore nikkud / punctuation). */
export function conjugationBareKey(surface: string): string {
  return lettersOnlyUnpointed(surface);
}

/**
 * True if the learner string matches any accepted surface (strict NFC), or
 * matches any accepted form with nikkud stripped on both sides.
 */
export function conjugationAnswerMatches(
  userInput: string,
  expectedAccepted: readonly string[],
): boolean {
  const u = normalizeHebrewInput(userInput);
  if (!u) return false;
  const uBare = lettersOnlyUnpointed(u);
  if (!uBare) return false;

  for (const exp of expectedAccepted) {
    const e = normalizeHebrewInput(exp);
    if (u === e) return true;
    if (uBare === lettersOnlyUnpointed(e)) return true;
  }
  return false;
}

export function validateConjugationAnswer(
  userInput: string,
  puzzle: ConjugationPuzzle,
): boolean {
  return conjugationAnswerMatches(userInput, puzzle.expectedAccepted);
}

export function conjugationPuzzlesForMaxDifficulty(
  maxDifficulty: 1 | 2 | 3 | 4,
): ConjugationPuzzle[] {
  return CONJUGATION_PUZZLES.filter((p) => p.difficulty <= maxDifficulty);
}

export function pickRandomConjugationPuzzle(
  maxDifficulty: 1 | 2 | 3 | 4,
  rng: () => number = Math.random,
): ConjugationPuzzle | null {
  const pool = conjugationPuzzlesForMaxDifficulty(maxDifficulty);
  if (!pool.length) return null;
  return pool[Math.floor(rng() * pool.length)]!;
}

/** Four distinct Hebrew forms: one correct, three distractors from the same difficulty pool. */
export function buildConjugationMcqChoices(
  puzzle: ConjugationPuzzle,
  maxDifficulty: 1 | 2 | 3 | 4,
  rng: () => number = Math.random,
): { choices: string[]; correctIndex: number } {
  const correct = puzzle.expectedAccepted[0] ?? "";
  const correctBare = lettersOnlyUnpointed(correct);
  const pool = conjugationPuzzlesForMaxDifficulty(maxDifficulty);
  const candidates: string[] = [];
  const seen = new Set<string>([correctBare]);

  const pushForm = (s: string | undefined) => {
    if (!s) return;
    const b = lettersOnlyUnpointed(s);
    if (!b || seen.has(b)) return;
    seen.add(b);
    candidates.push(s);
  };

  for (const p of pool) {
    if (p.id === puzzle.id) continue;
    for (const exp of p.expectedAccepted) {
      pushForm(exp);
    }
  }
  for (const p of CONJUGATION_PUZZLES) {
    if (candidates.length >= 24) break;
    if (p.id === puzzle.id) continue;
    for (const exp of p.expectedAccepted) {
      pushForm(exp);
    }
  }

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j]!, candidates[i]!];
  }

  let distractors = candidates.slice(0, 3);
  if (distractors.length < 3) {
    for (const p of CONJUGATION_PUZZLES) {
      if (distractors.length >= 3) break;
      if (p.id === puzzle.id) continue;
      for (const exp of p.expectedAccepted) {
        if (distractors.length >= 3) break;
        const s = exp;
        const b = lettersOnlyUnpointed(s);
        if (b === correctBare) continue;
        if (distractors.some((d) => lettersOnlyUnpointed(d) === b)) continue;
        distractors.push(s);
      }
    }
  }

  const choices = [correct, ...distractors.slice(0, 3)];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [choices[i], choices[j]] = [choices[j]!, choices[i]!];
  }
  const correctIndex = choices.findIndex(
    (c) => lettersOnlyUnpointed(c) === correctBare,
  );
  return { choices, correctIndex: Math.max(0, correctIndex) };
}

/** Rich feedback for slot conjugation drills (summary + gloss + examples). */
export type ConjugationFeedbackDetail = {
  summary: string;
  targetForm: string;
  glossEn: string;
  examples: readonly ConjugationExample[];
};

export function buildConjugationFeedbackDetail(
  puzzle: ConjugationPuzzle,
  ok: boolean,
  attempt: string,
): ConjugationFeedbackDetail {
  const target = puzzle.expectedAccepted[0] ?? "";
  const enr = getConjugationEnrichment(puzzle.id);
  const glossEn =
    enr?.glossEn ??
    `This form belongs to root ${puzzle.rootKey} in ${puzzle.binyanLabel} for “${puzzle.taskEn}”.`;
  const examples: readonly ConjugationExample[] =
    enr?.examples ??
    ([
      {
        he: target,
        en: `Model use: plug ${target} when the reels show this root, pattern, and task.`,
      },
    ] as const);

  let summary: string;
  if (ok) {
    const tail = puzzle.hintEn ? ` Note: ${puzzle.hintEn}` : "";
    summary = `Correct. The shoresh ${puzzle.rootKey} (${puzzle.rootLetters}) in ${puzzle.binyanLabel} for the task “${puzzle.taskEn}” surfaces as ${target}.${tail}`;
  } else {
    const a = attempt.trim() || "(no answer entered)";
    const hint = puzzle.hintEn
      ? puzzle.hintEn
      : "Check the binyan’s vowels and any ל־ / ת־ / הִ־ prefix pattern for this task.";
    summary = `That doesn’t match. You answered “${a}”, but for root ${puzzle.rootKey}, pattern ${puzzle.binyanLabel}, and task “${puzzle.taskEn}”, the expected form is ${target}. ${hint}`;
  }
  return { summary, targetForm: target, glossEn, examples };
}

/** Teacher-style feedback after the learner checks an answer. */
export function explainConjugationResult(
  puzzle: ConjugationPuzzle,
  ok: boolean,
  attempt: string,
): string {
  return buildConjugationFeedbackDetail(puzzle, ok, attempt).summary;
}
