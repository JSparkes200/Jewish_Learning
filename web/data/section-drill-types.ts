export type McqItem = {
  id: string;
  promptHe: string;
  correctEn: string;
  distractorsEn: string[];
  /** Transliteration when known (corpus `p` or hand-authored). */
  translit?: string;
  /** Silly / vivid memory hook — omitted rows get one from `generateContent`. */
  mnemonic?: string;
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
