export type McqItem = {
  id: string;
  promptHe: string;
  correctEn: string;
  distractorsEn: string[];
  /**
   * English question prompt; choices are Hebrew (`correctHe` + `distractorsHe`).
   * When set, `promptHe` can be a short placeholder (e.g. "—") for corpus keys.
   */
  choicesAreHebrew?: boolean;
  promptEn?: string;
  correctHe?: string;
  distractorsHe?: string[];
  /** Transliteration when known (corpus `p` or hand-authored). */
  translit?: string;
  /** Beyond-the-gloss color (corpus `col`, culture, pedagogy). */
  vibeNote?: string;
  /** Shoresh letters for root-flavored `generateContent` vibes. */
  shoresh?: string;
};

export type McqDrillPack = {
  kind: "mcq";
  title: string;
  intro?: string;
  items: McqItem[];
};
