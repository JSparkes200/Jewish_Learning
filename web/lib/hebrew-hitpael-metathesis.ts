/**
 * Hitpa'el infinitives normally show the prefix לְהִת + stem.
 * When the first root consonant is a sibilant (ס ז ש צ), the ת metathesizes
 * before that letter: לְהִסְתַּדֵּר (root ס־ד־ר), not לְהִתְסַדֵּר.
 */

const UNMETATHESIZED_SIBILANT_HITPAEL = /^לְהִתְ[סשצז]/u;

/** True if the string looks like the dispreferred un-metathesized Hitpa'el spelling for a sibilant-initial root. */
export function looksLikeUnmetathesizedSibilantHitpael(s: string): boolean {
  return UNMETATHESIZED_SIBILANT_HITPAEL.test(s.trim());
}
