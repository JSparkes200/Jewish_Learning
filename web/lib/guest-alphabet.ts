/**
 * Guest try-before-signup: first print letters of the Alef–Bet track only.
 * Full alphabet completion + final exam require a Clerk session (see AlphabetPageClient).
 */

/** First four print letters: א ב ג ד — trace + “mark practiced” allowed for guests. */
export const GUEST_ALPHABET_PRACTICE_LETTER_IDS: readonly string[] = [
  "al-alef",
  "al-bet",
  "al-gimel",
  "al-dalet",
];

export function guestMayPracticeAlphabetLetter(
  letterId: string,
  isSignedIn: boolean,
): boolean {
  if (isSignedIn) return true;
  return GUEST_ALPHABET_PRACTICE_LETTER_IDS.includes(letterId);
}

export function guestMayTakeAlphabetFinalExam(isSignedIn: boolean): boolean {
  return isSignedIn;
}
