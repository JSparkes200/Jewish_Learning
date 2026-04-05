/**
 * Second-person, warm copy for Learn drills (avoid robotic imperatives).
 * Prefer “you’ll / you’re / your” over bare commands.
 */

export const LEARN_VOICE = {
  mcqDefaultIntro:
    "You’ll lock each Hebrew snippet to a meaning you can actually use — tap the gloss that matches what you’d say in real life.",
  drillPrepEyebrow: "Before you dive in",
  drillPrepCta: "I’m ready — let’s go",
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
  mnemonicEyebrow: "A hook to remember",
  vibeEyebrow: "Why it matters in the culture",
  correctSentenceTitle: "Which line sounds alive?",
  correctSentenceIntro:
    "You’re choosing the line a real speaker would actually say — not the textbook-ish broken one.",
  correctSentenceCompleteTitle: "Round complete",
  correctSentenceEncourageWrong:
    "No worries — your ear is calibrating. Peek at the pattern, then try the next one.",
  correctSentenceNext: "Next challenge",
  correctSentenceFinish: "Finish",
  /** Section lesson hub (intro card) */
  sectionIntroEyebrow: "Your lesson",
  sectionIntroLead:
    "You’ll move through a few short beats — warm-up, practice, then ear training when it fits — so nothing feels like a wall of boxes.",
  sectionIntroStartWithWarmup: "Preview warm-up",
  sectionIntroStartLesson: "Start lesson",
  sectionIntroSkipWarmup: "Skip warm-up — start practice",
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

/** Friendly “challenge” framing for correct-sentence cues (replaces “Pick the…”). */
export function buildCorrectSentenceUserPrompt(targetEn: string): string {
  const t = targetEn.trim();
  return `You’re listening like you’re in the room: which sentence uses “${t}” the way a fluent speaker would — clean word order, no extra junk?`;
}
