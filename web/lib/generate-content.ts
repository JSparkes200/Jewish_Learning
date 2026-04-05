/**
 * Per-item “mnemonic” + optional cultural vibe for Learn drills.
 * Authors can set `mnemonic` / `vibeNote` on `McqItem`; this fills gaps playfully.
 */

export type GenerateContentInput = {
  promptHe: string;
  correctEn: string;
  /** Transliteration when you have it (roots, corpus-backed rows). */
  translit?: string;
  /** Shoresh letters (e.g. הלך) for root-flavored copy. */
  shoresh?: string;
  /** Hand-authored pun or image hook. */
  mnemonic?: string;
  /** Extra layer beyond the gloss (corpus `col`, pedagogy). */
  culturalNote?: string;
};

export type GeneratedContent = {
  mnemonic: string;
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

function firstGloss(en: string): string {
  return en.split("/")[0]?.trim() || en.trim();
}

function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function autoMnemonic(input: GenerateContentInput): string {
  const gloss = firstGloss(input.correctEn);
  const key = `${input.promptHe}|${gloss}`;
  const variant = simpleHash(key) % 4;
  const t = input.translit?.trim();

  if (t) {
    const templates = [
      `Say “${t}” like you’re hailing a friend across the café — your mouth shapes the Hebrew before your brain argues.`,
      `Pin “${t}” to one silly English sound-alike you won’t forget, then swap back to the real word in Hebrew.`,
      `Whisper “${t}” three times; you’re teaching your face muscles the password for ${gloss}.`,
      `Think of ${gloss} as a sticker labeled “${t}” on your mental flashcard — peel it when you see the Hebrew.`,
    ];
    return templates[variant] ?? templates[0]!;
  }

  const fallbacks = [
    `Picture yourself needing “${gloss}” in line at a kiosk — which Hebrew pops first? That’s the hook.`,
    `You’ll reuse ${gloss} ten times today in your head; let this Hebrew be the voice you pick.`,
    `Tie ${gloss} to one tiny movie scene in your mind — same scene every time you see this word.`,
    `Make ${gloss} personal: who would you say it to? Drop them into the sentence with this Hebrew.`,
  ];
  return fallbacks[variant] ?? fallbacks[0]!;
}

function rootVibe(shoresh?: string): string | undefined {
  if (!shoresh?.trim()) return undefined;
  const k = normRootKey(shoresh);
  return ROOT_VIBE_LINES[k];
}

/**
 * Returns a mnemonic line (pun / visual / mouth-feel) and optional vibe beyond the gloss.
 */
export function generateContent(input: GenerateContentInput): GeneratedContent {
  const trimmedMnemonic = input.mnemonic?.trim();
  const trimmedNote = input.culturalNote?.trim();
  const fromRoot = rootVibe(input.shoresh);

  const mnemonic = trimmedMnemonic || autoMnemonic(input);
  const vibeLine = trimmedNote || fromRoot;

  return { mnemonic, vibeLine };
}
