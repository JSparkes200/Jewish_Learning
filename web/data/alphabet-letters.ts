/**
 * Print Alef–Bet (22 letters) + five sofit (final) forms + final exam packs.
 * IDs are stable in {@link LearnProgressState.alphabetLettersTraced}.
 */

import type { McqDrillPack } from "./section-drill-types";

export type AlphabetLetterMeta = {
  id: string;
  /** Isolated print form (no nikkud) for tracing. */
  char: string;
  /** Latin name for UI. */
  name: string;
  /** Short sound / value hint for learners. */
  sound: string;
  /** Lesson group for layout (print block vs sofit block). */
  section: "print" | "final";
};

export const ALPHABET_LETTERS: readonly AlphabetLetterMeta[] = [
  { id: "al-alef", char: "א", name: "Alef", sound: "silent / glottal stop", section: "print" },
  { id: "al-bet", char: "ב", name: "Bet", sound: "b or v (vet)", section: "print" },
  { id: "al-gimel", char: "ג", name: "Gimel", sound: "g", section: "print" },
  { id: "al-dalet", char: "ד", name: "Dalet", sound: "d", section: "print" },
  { id: "al-he", char: "ה", name: "He", sound: "h (often silent at end of word)", section: "print" },
  { id: "al-vav", char: "ו", name: "Vav", sound: "v, o, or u", section: "print" },
  { id: "al-zayin", char: "ז", name: "Zayin", sound: "z", section: "print" },
  { id: "al-chet", char: "ח", name: "Chet", sound: "voiceless pharyngeal (rough h)", section: "print" },
  { id: "al-tet", char: "ט", name: "Tet", sound: "t", section: "print" },
  { id: "al-yod", char: "י", name: "Yod", sound: "y, or i/e vowel", section: "print" },
  { id: "al-kaf", char: "כ", name: "Kaf", sound: "k or kh (chaf)", section: "print" },
  { id: "al-lamed", char: "ל", name: "Lamed", sound: "l", section: "print" },
  { id: "al-mem", char: "מ", name: "Mem", sound: "m", section: "print" },
  { id: "al-nun", char: "נ", name: "Nun", sound: "n", section: "print" },
  { id: "al-samekh", char: "ס", name: "Samekh", sound: "s", section: "print" },
  { id: "al-ayin", char: "ע", name: "Ayin", sound: "pharyngeal / often silent in modern", section: "print" },
  { id: "al-pe", char: "פ", name: "Pe", sound: "p or f (fe)", section: "print" },
  { id: "al-tsadi", char: "צ", name: "Tsadi", sound: "ts", section: "print" },
  { id: "al-qof", char: "ק", name: "Qof", sound: "k (back)", section: "print" },
  { id: "al-resh", char: "ר", name: "Resh", sound: "r (rolled or uvular)", section: "print" },
  { id: "al-shin", char: "ש", name: "Shin / Sin", sound: "sh or s (dot position)", section: "print" },
  { id: "al-tav", char: "ת", name: "Tav", sound: "t", section: "print" },
  { id: "al-kaf-sofit", char: "ך", name: "Final kaf", sound: "like כ at end of a word", section: "final" },
  { id: "al-mem-sofit", char: "ם", name: "Final mem", sound: "like מ at end of a word", section: "final" },
  { id: "al-nun-sofit", char: "ן", name: "Final nun", sound: "like נ at end of a word", section: "final" },
  { id: "al-pe-sofit", char: "ף", name: "Final pe", sound: "like פ at end of a word", section: "final" },
  { id: "al-tsadi-sofit", char: "ץ", name: "Final tsadi", sound: "like צ at end of a word", section: "final" },
];

export const ALPHABET_LETTER_IDS: readonly string[] = ALPHABET_LETTERS.map(
  (l) => l.id,
);

/** Six letters traced again on the final (spread across print + one sofit). */
export const ALPHABET_FINAL_TRACE_IDS: readonly string[] = [
  "al-alef",
  "al-tet",
  "al-lamed",
  "al-ayin",
  "al-shin",
  "al-tsadi-sofit",
];

/** Sound final: need 10/12 correct (~same bar as legacy 5/6). */
export const ALPHABET_FINAL_SOUND_MIN_PCT = 10 / 12;

export const ALPHABET_FINAL_SOUND_PACK: McqDrillPack = {
  kind: "mcq",
  title: "Alphabet final — sounds",
  intro:
    "You’ll match each letter to how it usually sounds in print Hebrew and in final (sofit) form.",
  items: [
    {
      id: "afs-1",
      promptHe: "א",
      correctEn: "silent / glottal stop (alef)",
      distractorsEn: ["always “a” vowel", "b sound", "h sound"],
    },
    {
      id: "afs-2",
      promptHe: "ב",
      correctEn: "b or v (dot determines bet vs vet)",
      distractorsEn: ["only g", "only d", "always silent"],
    },
    {
      id: "afs-3",
      promptHe: "ח",
      correctEn: "voiceless pharyngeal / “rough h” (chet)",
      distractorsEn: ["same as ה always", "k sound", "sh sound"],
    },
    {
      id: "afs-4",
      promptHe: "ט",
      correctEn: "t (tet)",
      distractorsEn: ["only s", "only r", "always silent"],
    },
    {
      id: "afs-5",
      promptHe: "י",
      correctEn: "y, or i/e vowel (yod)",
      distractorsEn: ["only m", "only q", "never a vowel"],
    },
    {
      id: "afs-6",
      promptHe: "ס",
      correctEn: "s (samekh)",
      distractorsEn: ["ts only", "sh only", "k only"],
    },
    {
      id: "afs-7",
      promptHe: "ע",
      correctEn: "pharyngeal / often silent in modern Hebrew (ayin)",
      distractorsEn: ["always “a”", "always z", "same as א always"],
    },
    {
      id: "afs-8",
      promptHe: "פ",
      correctEn: "p or f (pe / fe)",
      distractorsEn: ["only b", "only t", "only kh"],
    },
    {
      id: "afs-9",
      promptHe: "ק",
      correctEn: "k (back, qof)",
      distractorsEn: ["always silent", "only g", "only ts"],
    },
    {
      id: "afs-10",
      promptHe: "ר",
      correctEn: "r (resh — rolled or uvular)",
      distractorsEn: ["l only", "w only", "always silent"],
    },
    {
      id: "afs-11",
      promptHe: "ש",
      correctEn: "sh or s (shin / sin — dot position)",
      distractorsEn: ["only z", "only kh", "only h"],
    },
    {
      id: "afs-12",
      promptHe: "ן",
      correctEn: "like נ at the end of a word (final nun)",
      distractorsEn: ["like מ at end", "like צ at end", "never at end of word"],
    },
  ],
};

export function getLetterById(id: string): AlphabetLetterMeta | undefined {
  return ALPHABET_LETTERS.find((l) => l.id === id);
}
