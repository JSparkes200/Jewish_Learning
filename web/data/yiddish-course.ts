/**
 * Yiddish track (separate from Alef–Dalet Hebrew): own sections + local storage.
 * Uses Hebrew script for prompts; Romanizations in English glosses where helpful.
 */

export type YiddishSectionMeta = {
  id: string;
  label: string;
  blurb: string;
};

export const YIDDISH_SECTIONS: readonly YiddishSectionMeta[] = [
  {
    id: "yid-1",
    label: "Greetings & cognates",
    blurb: "Hello, good day, how are you. We'll start with the words you might already know from Hebrew, but with a Yiddish twist.",
  },
  {
    id: "yid-2",
    label: "Pronouns & the verb 'to be'",
    blurb: "I, you, he, she, it, we. Unlike Hebrew, Yiddish uses the verb 'to be' in the present tense.",
  },
  {
    id: "yid-3",
    label: "Questions & negation",
    blurb: "What, where, why, and not. The essential tools for asking questions and disagreeing.",
  },
  {
    id: "yid-4",
    label: "Home & food",
    blurb: "Rooms, family, bread, and tea. The cozy, everyday nouns of the Yiddish home.",
  },
  {
    id: "yid-5",
    label: "Review mix",
    blurb: "Putting it all together. Short phrases that mix greetings, questions, and food.",
  },
];

export const YIDDISH_SECTION_IDS: readonly string[] = YIDDISH_SECTIONS.map(
  (s) => s.id,
);

export function getYiddishSectionMeta(
  id: string,
): YiddishSectionMeta | undefined {
  return YIDDISH_SECTIONS.find((s) => s.id === id);
}
