/**
 * Post-bridge specialty tracks: domain “badges” with Bronze → Silver → Gold depth.
 *
 * **Vocab / content reality:** `web/data/corpus-d.ts` has large breadth (lemma `l`
 * tags 1–4+), but **domain-tuned reading lines and MCQ banks are the bottleneck**,
 * not raw dictionary count. These packs ship **small authored drills**; expand by
 * adding items here or wiring passages from `/reading` + comprehension later.
 *
 * **Unlock:** {@link getBridgeModulePassed} must be true (bridge final passed).
 * **Tier order:** bronze → silver → gold per track (sequential).
 * **Lengths:** Bronze 8, Silver 15, Gold 25 MCQs (see `specialty-tier-packs.ts` + `specialty-tier-packs-traditional.ts`).
 */

export const SPECIALTY_TIER_IDS = ["bronze", "silver", "gold"] as const;
export type SpecialtyTierId = (typeof SPECIALTY_TIER_IDS)[number];

/**
 * Pass targets scale with tier length (8 / 15 / 25 items in packs).
 */
export const SPECIALTY_PASS_PCT: Record<SpecialtyTierId, number> = {
  bronze: 6 / 8,
  silver: 13 / 15,
  gold: 23 / 25,
};

/** Modern Israeli Hebrew domains vs rabbinic / JBA text literacy. */
export type SpecialtyTrackGroup = "modern_hebrew" | "traditional_texts";

export type SpecialtyTrackMeta = {
  id: string;
  title: string;
  /** Short English blurb for the hub card. */
  blurb: string;
  /** Hebrew keyword aligned with bridge unit 4 copy. */
  domainHe: string;
  /** Pedagogical focus for authors. */
  focus: string;
  group: SpecialtyTrackGroup;
};

export const SPECIALTY_TRACKS: readonly SpecialtyTrackMeta[] = [
  {
    id: "news",
    title: "News & journalism",
    blurb: "Headlines, reports, and journalistic register (עִתּוֹנוּת).",
    domainHe: "עִתּוֹנוּת",
    focus: "Scanning, bylines, neutral vs opinion framing.",
    group: "modern_hebrew",
  },
  {
    id: "literature",
    title: "Literature",
    blurb: "Narrative voice, imagery, and literary Hebrew (סִפְרוּת).",
    domainHe: "סִפְרוּת",
    focus: "Tone, character, figurative language — not press summaries.",
    group: "modern_hebrew",
  },
  {
    id: "spoken",
    title: "Goal-oriented speech",
    blurb: "Colloquial strategies for real situations (דִּבּוּר מֻכְוָּן).",
    domainHe: "דִּבּוּר מֻכְוָּן",
    focus: "Interviews, planning, hedging, turn-taking — spoken pragmatics.",
    group: "modern_hebrew",
  },
  {
    id: "talmudic",
    title: "Talmudic / rabbinic Hebrew",
    blurb: "Mishnah–Talmud register: lemmas, argument, and citation habits (לָשׁוֹן הַתַּלְמוּד).",
    domainHe: "לָשׁוֹן הַתַּלְמוּד",
    focus: "תנא/אמורא, stam, proof textures — not spoken street Hebrew.",
    group: "traditional_texts",
  },
  {
    id: "aramaic",
    title: "Jewish Babylonian Aramaic",
    blurb: "Core lemmas and frames in the Talmud’s Aramaic stratum (אֲרָמִית).",
    domainHe: "אֲרָמִית בַּבְלִית",
    focus: "High-frequency particles, questions, and connectives in sugya text.",
    group: "traditional_texts",
  },
];

export const SPECIALTY_TRACK_IDS: readonly string[] = SPECIALTY_TRACKS.map(
  (t) => t.id,
);

export function getSpecialtyTrackMeta(id: string): SpecialtyTrackMeta | undefined {
  return SPECIALTY_TRACKS.find((t) => t.id === id);
}

/** Stable storage key in {@link LearnProgressState.specialtyTierPassed}. */
export function specialtyTierStorageKey(
  trackId: string,
  tier: SpecialtyTierId,
): string {
  return `${trackId}:${tier}`;
}

export function parseSpecialtyTierKey(
  key: string,
): { trackId: string; tier: SpecialtyTierId } | null {
  const parts = key.split(":");
  if (parts.length !== 2) return null;
  const [trackId, tier] = parts;
  if (!SPECIALTY_TRACK_IDS.includes(trackId)) return null;
  if (!SPECIALTY_TIER_IDS.includes(tier as SpecialtyTierId)) return null;
  return { trackId, tier: tier as SpecialtyTierId };
}

export function isValidSpecialtyTierStorageKey(key: string): boolean {
  return parseSpecialtyTierKey(key) != null;
}

export function getSpecialtyPassMinCorrect(total: number, tier: SpecialtyTierId): number {
  if (total <= 0) return 0;
  return Math.ceil(SPECIALTY_PASS_PCT[tier] * total - 1e-9);
}

/** Pack id convention in {@link getSpecialtyTierMcqPack} — `specialty-tier-packs.ts`. */
export function specialtyTierPackId(
  trackId: string,
  tier: SpecialtyTierId,
): string {
  return `${trackId}-${tier}`;
}
