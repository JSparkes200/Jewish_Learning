/**
 * Optional cultural vibe for Learn drills.
 * Authors can set `vibeNote` on `McqItem`; this fills gaps playfully.
 */

export type GenerateContentInput = {
  promptHe: string;
  correctEn: string;
  /** Transliteration when you have it (roots, corpus-backed rows). */
  translit?: string;
  /** Shoresh letters (e.g. הלך) for root-flavored copy. */
  shoresh?: string;
  /** Extra layer beyond the gloss (corpus `col`, pedagogy). */
  culturalNote?: string;
};

export type GeneratedContent = {
  vibeLine?: string;
};

/** Extra color for common roots — not definitions, but “how it lives in the language.” */
const ROOT_VIBE_LINES: Record<string, string> = {
  הלך:
    "Same shoresh as הלכה (halakha): everyday walking and the Jewish sense of practice as the path you live — one root, familiar words, deep cultural echo.",
  כתב:
    "You’re in the scribble family — anything from a text to an address lives on this root.",
  אמר:
    "Speech acts: what you say out loud and what gets quoted as a ‘saying’ share this spine.",
  ידע:
    "From ‘I know’ to דעת (da’at) — knowledge as something you hold, not just a fact.",
  ראה:
    "Seeing and appearing — Hebrew often ties perception to what shows up in front of you.",
  שמע:
    "Hearing and obeying share this root — ‘listen up’ and ‘accept’ feel related in Hebrew.",
  אהב:
    "Love vocabulary hugs this shoresh; you’ll spot it in warm, people-centered phrases.",
  בוא:
    "Come / arrival — invitations and ‘here we go’ energy cluster on this root.",
  נתן:
    "Giving, handing, letting — your ‘I got you’ verbs often grow from here.",
  שלם:
    "Completeness and peace — שלום sits on this letters; you’re in the wholeness family.",
};

function normRootKey(shoresh: string): string {
  return shoresh.replace(/[\u0591-\u05C7]/g, "").trim();
}

function rootVibe(shoresh?: string): string | undefined {
  if (!shoresh?.trim()) return undefined;
  const k = normRootKey(shoresh);
  return ROOT_VIBE_LINES[k];
}

/**
 * Returns an optional vibe beyond the gloss.
 */
export function generateContent(input: GenerateContentInput): GeneratedContent {
  const trimmedNote = input.culturalNote?.trim();
  const fromRoot = rootVibe(input.shoresh);

  const vibeLine = trimmedNote || fromRoot;

  return { vibeLine };
}
