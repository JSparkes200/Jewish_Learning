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
    blurb: "שלום, good day, how are you — shared roots with Hebrew, different phonology.",
  },
  {
    id: "yid-2",
    label: "Pronouns & זײַן",
    blurb: "איך, דו, ער/זי/עס, מיר — present of “to be” in context.",
  },
  {
    id: "yid-3",
    label: "Questions & negation",
    blurb: "וואָס, וווּ, וואָרום, נישׁט — basic question words and “not.”",
  },
  {
    id: "yid-4",
    label: "Home & food",
    blurb: "Rooms, family, bread & tea — high-frequency nouns.",
  },
  {
    id: "yid-5",
    label: "Review mix",
    blurb: "Short phrases pulling prior lessons together.",
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
