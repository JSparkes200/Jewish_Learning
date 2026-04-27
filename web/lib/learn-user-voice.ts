/**
 * Second-person, warm copy for Learn drills (avoid robotic imperatives).
 * Prefer “you’ll / you’re / your” over bare commands.
 */

export const LEARN_VOICE = {
  mcqCompleteTitle: "Nice run",
  mcqCompleteBody:
    "You’ve worked through this set. When it feels solid, mark the section complete below so your path stays honest.",
  mcqPracticeAgain: "Run it again",
  mcqQuestionEyebrow: "Your turn",
  mcqLoadingChoices: "Mixing your options…",
  mcqCorrect: "Yes — that’s the one you’d want in conversation.",
  mcqReveal: "Here’s the match",
  mcqNext: "Next question",
  mcqFinish: "Finish this round",
  vibeEyebrow: "Why it matters in the culture",
  correctSentenceTitle: "Which line is more natural?",
  correctSentenceIntro:
    "You’re choosing the line a real speaker would actually say — not the textbook-ish broken one.",
  correctSentenceCompleteTitle: "Round complete",
  correctSentenceEncourageWrong:
    "No worries — your ear is calibrating. Peek at the pattern, then try the next one.",
  correctSentenceNext: "Next challenge",
  correctSentenceFinish: "Finish",
  /** Section lesson hub (intro card) */
  sectionIntroEyebrow: "Your lesson",
  /**
   * First sentence is filled by `buildSectionIntroLead` from section title + step flow.
   * @deprecated kept for one-off; prefer `buildSectionIntroLead()`.
   */
  sectionIntroLead:
    "This section is sequenced in short beats. Review the words below and use the speaker on each line before you start the lesson — same TTS the drills use.",
  sectionIntroVocabHeading: "Words & expressions in this section",
  sectionIntroVocabTtsNote:
    "Each speaker uses your device’s Hebrew text-to-speech (same as the practice drills) — a quick ear check before you begin.",
  sectionIntroStartLesson: "Start lesson",
  sectionStepLabel: (n: number, total: number) => `Step ${n} of ${total}`,
  sectionStepBack: "Back one step",
  sectionContinueReading: "Continue — reading check",
  sectionContinueStory: "Continue — story",
  sectionContinueVocab: "Continue — meaning match",
  sectionContinueRoots: "Continue — root explorer",
  sectionContinueNumbers: "Continue — listen & tap",
  sectionContinueSentences: "Continue — how real sentences sound",
  sectionWrapEyebrow: "You made it through",
  sectionWrapBody:
    "You can replay any step from “Previous step,” run a drill again, or mark the section complete when it feels honest.",
  studyTapWordEyebrow: "Study — tap the Hebrew",
  studyTapWordBody:
    "You’ll see an English cue — tap the Hebrew you’d actually want on the tip of your tongue.",
  numbersListenEyebrow: "Listen & tap",
  numbersListenBody:
    "You’ll play a spoken number (0–10), then tap the Hebrew you heard. Your browser’s Hebrew voice does the talking when it can.",
  numbersListenPlay: "Play number",
  numbersListenSr:
    "You’re matching the sound you heard to the right Hebrew number word.",
  numbersOrdinalSubline:
    "You’ll match this position to the Hebrew ordinal a speaker would use.",
  numbersDaysSubline:
    "You’ll tap the Hebrew day name that fits this English cue.",
  numbersTimeSubline:
    "You’ll pick the Hebrew time word you’d actually hear in the wild.",
  readingQuizTransliteration:
    "You’re locking sound to spelling — which option matches how you’d say this word out loud?",
  readingQuizWordChoice:
    "You’re reading for meaning — which Hebrew line matches the English idea?",
  comprehensionCompleteTitle: "Reading check — complete",
  comprehensionCompleteBody:
    "You’re building real reading stamina — mark the section below when you’re ready to move on.",
  comprehensionPracticeAgain: "Run questions again",
} as const;

export function learnVoiceStudyTapWordBody(level: number): string {
  return `${LEARN_VOICE.studyTapWordBody} (level ${level} pool).`;
}

/**
 * What each journey step is called in the intro synopsis (lowercase, for mid-sentence use).
 */
const INTRO_STEP_PHRASE: Record<string, string> = {
  comp: "a reading check on a short text",
  story: "a compact story in Hebrew",
  roots: "root-family work",
  nums: "numbers you can hear in context",
  mcq: "vocabulary and meaning match",
  sent: "how natural sentences are built",
  slot: "root slot practice",
  smikhut: "construct-state (smikhut) patterns",
};

/**
 * Cohesive “calm-sea” intro: synopsis of the journey + pointer to the vocab/tts list.
 */
export function buildSectionIntroLead(
  title: string,
  stepKeys: readonly string[],
): string {
  if (stepKeys.length === 0) {
    return `${title} is sequenced in short, focused beats. When vocabulary appears below, you can hear every Hebrew line with the speaker before you start the lesson.`;
  }
  const phrases = stepKeys.map(
    (k) => INTRO_STEP_PHRASE[k] ?? "practice in context",
  );
  const flow =
    phrases.length === 1
      ? phrases[0]!
      : phrases.length === 2
        ? `${phrases[0]} and ${phrases[1]}`
        : `${phrases.slice(0, -1).join(", ")} and ${phrases[phrases.length - 1]!}`;
  return `${title} walks you through ${flow} — a steady arc so reading, form, and ear training stay in step. The list below names the main Hebrew you’ll work with, each paired with a gloss. Tap a speaker to hear that line with your system’s Hebrew text-to-speech (same as in the drills), so your ear and eye move together.`;
}

/** Friendly “challenge” framing for correct-sentence cues (replaces “Pick the…”). */
export function buildCorrectSentenceUserPrompt(targetEn: string): string {
  const t = targetEn.trim();
  return `You’re listening like you’re in the room: which sentence uses “${t}” the way a fluent speaker would — clean word order, no extra junk?`;
}
