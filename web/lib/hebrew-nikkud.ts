/**
 * Strip Hebrew vowel points and common combining marks for “bare” display.
 * Does not remove punctuation (maqaf, sof pasuq, geresh). For ambiguous
 * homographs, prefer dual-authored strings later.
 */
const NIKKUD_AND_COMBINING_RE =
  /[\u0591-\u05AF\u05B0-\u05BC\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/g;

export function stripNikkud(s: string): string {
  if (!s) return s;
  return s.replace(NIKKUD_AND_COMBINING_RE, "");
}
