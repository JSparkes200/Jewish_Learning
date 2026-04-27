"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import {
  loadLearnProgress,
  saveLearnProgress,
} from "@/lib/learn-progress";

// ─── question data ────────────────────────────────────────────────────────────

type PlacementQuestion = {
  id: string;
  level: 1 | 2 | 3 | 4;
  question: string;
  hebrew?: string;
  options: { id: string; text: string; hebrew?: string }[];
  correctId: string;
  explanation: string;
};

const QUESTIONS: PlacementQuestion[] = [
  // Level 1 — survival vocabulary
  {
    id: "p1",
    level: 1,
    question: "What does שָׁלוֹם mean?",
    hebrew: "שָׁלוֹם",
    options: [
      { id: "a", text: "Peace / hello / goodbye" },
      { id: "b", text: "Good morning" },
      { id: "c", text: "Thank you" },
      { id: "d", text: "Please" },
    ],
    correctId: "a",
    explanation: "שָׁלוֹם (shalom) means peace — and is the standard Hebrew greeting and farewell.",
  },
  {
    id: "p2",
    level: 1,
    question: "Which word means \"I\"?",
    options: [
      { id: "a", hebrew: "אַתָּה", text: "atah" },
      { id: "b", hebrew: "אֲנִי", text: "ani" },
      { id: "c", hebrew: "הוּא", text: "hu" },
      { id: "d", hebrew: "הִיא", text: "hi" },
    ],
    correctId: "b",
    explanation: "אֲנִי (ani) = I. אַתָּה = you (m), הוּא = he, הִיא = she.",
  },
  {
    id: "p3",
    level: 1,
    question: "How do you say \"good morning\" in Hebrew?",
    options: [
      { id: "a", hebrew: "לַיְלָה טוֹב", text: "layla tov" },
      { id: "b", hebrew: "שָׁלוֹם", text: "shalom" },
      { id: "c", hebrew: "בֹּקֶר טוֹב", text: "boker tov" },
      { id: "d", hebrew: "צָהֳרַיִם", text: "tsahoraim" },
    ],
    correctId: "c",
    explanation: "בֹּקֶר טוֹב (boker tov) — literally \"good morning.\" לַיְלָה טוֹב = good night.",
  },
  // Level 2 — agreement and basic grammar
  {
    id: "p4",
    level: 2,
    question: "Which is the feminine present-tense form of the verb כ.ת.ב (write)?",
    options: [
      { id: "a", hebrew: "כּוֹתֵב", text: "kotev (ms)" },
      { id: "b", hebrew: "כָּתְבוּ", text: "katvu (past, pl)" },
      { id: "c", hebrew: "כּוֹתֶבֶת", text: "kotevet (fs)" },
      { id: "d", hebrew: "כִּתֵּב", text: "kitév (Pi'el)" },
    ],
    correctId: "c",
    explanation: "כּוֹתֶבֶת (kotevet) is the feminine singular participle — Hebrew present tense.",
  },
  {
    id: "p5",
    level: 2,
    question: "How do you say \"the book\" in Hebrew?",
    options: [
      { id: "a", hebrew: "סֵפֶר", text: "sefer (a book)" },
      { id: "b", hebrew: "הַסֵּפֶר", text: "ha-sefer (the book)" },
      { id: "c", hebrew: "בַּסֵּפֶר", text: "ba-sefer (in the book)" },
      { id: "d", hebrew: "לַסֵּפֶר", text: "la-sefer (to the book)" },
    ],
    correctId: "b",
    explanation: "הַ- prefixes the noun to make it definite. הַסֵּפֶר = the book.",
  },
  {
    id: "p6",
    level: 2,
    question: "\"Good\" in Hebrew is טוֹב. How do you say \"good\" before a feminine noun?",
    options: [
      { id: "a", hebrew: "טוֹבִים", text: "tovim" },
      { id: "b", hebrew: "טוֹב", text: "tov" },
      { id: "c", hebrew: "טוֹבָה", text: "tova" },
      { id: "d", hebrew: "טוֹבוֹת", text: "tovot" },
    ],
    correctId: "c",
    explanation: "Adjectives agree with their noun. Feminine singular: טוֹבָה (tova). Plural forms add ־ִים (m) or ־וֹת (f).",
  },
  // Level 3 — roots and reading
  {
    id: "p7",
    level: 3,
    question: "What is the three-letter root (שׁוֹרֶשׁ) of the word שָׁלוֹם?",
    options: [
      { id: "a", text: "ש.מ.ל" },
      { id: "b", text: "ש.ל.מ" },
      { id: "c", text: "ל.ש.מ" },
      { id: "d", text: "ש.ל.ו" },
    ],
    correctId: "b",
    explanation: "The root ש.ל.מ conveys wholeness and completeness — שָׁלוֹם, שָׁלֵם (whole), לְשַׁלֵּם (to pay/complete).",
  },
  {
    id: "p8",
    level: 3,
    question: "Which form is future tense?",
    options: [
      { id: "a", hebrew: "כָּתַב", text: "katav — past" },
      { id: "b", hebrew: "כּוֹתֵב", text: "kotev — present" },
      { id: "c", hebrew: "יִכְתֹּב", text: "yikhtov — future (3ms)" },
      { id: "d", hebrew: "כָּתַבְנוּ", text: "katavnu — past (1p)" },
    ],
    correctId: "c",
    explanation: "Future tense in Hebrew uses a prefix: יִ- for 3rd person masculine. יִכְתֹּב = he will write.",
  },
  {
    id: "p9",
    level: 3,
    question: "What does לִפְנֵי mean?",
    hebrew: "לִפְנֵי",
    options: [
      { id: "a", text: "after" },
      { id: "b", text: "without" },
      { id: "c", text: "next to" },
      { id: "d", text: "before / in front of" },
    ],
    correctId: "d",
    explanation: "לִפְנֵי (lifney) — before, in front of. From פָּנִים (face, front). לִפְנֵי שָׁנָה = a year ago (lit. before a year).",
  },
  // Level 4 — binyanim and advanced
  {
    id: "p10",
    level: 4,
    question: "Which infinitive form shows the Pi'el binyan?",
    options: [
      { id: "a", hebrew: "לִכְתֹּב", text: "likhtov (Qal)" },
      { id: "b", hebrew: "לְהַכְתִּיב", text: "lehakhtiv (Hif'il)" },
      { id: "c", hebrew: "לְכַתֵּב", text: "lekhatev (Pi'el)" },
      { id: "d", hebrew: "לְהִתְכַּתֵּב", text: "lehitkhatev (Hitpa'el)" },
    ],
    correctId: "c",
    explanation: "Pi'el is marked by a dagesh (doubling) in the middle root letter. לְכַתֵּב — to address (a letter), to write extensively.",
  },
  {
    id: "p11",
    level: 4,
    question: "What does the suffix ־ִים indicate?",
    options: [
      { id: "a", text: "Feminine plural" },
      { id: "b", text: "Masculine plural" },
      { id: "c", text: "Construct state (possession)" },
      { id: "d", text: "Definite singular" },
    ],
    correctId: "b",
    explanation: "The suffix ־ִים marks masculine plural: סְפָרִים (books), יְלָדִים (boys). Feminine plural typically uses ־וֹת.",
  },
  {
    id: "p12",
    level: 4,
    question: "What does בְּרֵאשִׁית mean (the opening word of Genesis)?",
    hebrew: "בְּרֵאשִׁית",
    options: [
      { id: "a", text: "In the end" },
      { id: "b", text: "At the beginning" },
      { id: "c", text: "In the middle" },
      { id: "d", text: "From the source" },
    ],
    correctId: "b",
    explanation: "בְּ = in; רֵאשִׁית = beginning/first fruits (from רֹאשׁ, head). Literally: \"In the beginning.\"",
  },
];

// ─── scoring ──────────────────────────────────────────────────────────────────

function scoreToLevel(correct: number, levelScores: Record<number, number>): number {
  // Level 4 if strong across levels 3+4; level 3 if strong in 1+2+3; etc.
  const l4 = (levelScores[4] ?? 0);
  const l3 = (levelScores[3] ?? 0);
  const l2 = (levelScores[2] ?? 0);
  const l1 = (levelScores[1] ?? 0);

  if (l4 >= 2 && l3 >= 2 && l2 >= 2) return 4;
  if (l3 >= 2 && l2 >= 2 && l1 >= 2) return 3;
  if (l2 >= 2 && l1 >= 2) return 2;
  return 1;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-parchment-deep/60">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-sage transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

type Phase = "intro" | "quiz" | "result";

export function PlacementPageClient() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [resultLevel, setResultLevel] = useState<number>(1);

  const currentQ = QUESTIONS[qIndex];

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (selected !== null) return;
      setSelected(optionId);
      setShowExplanation(true);
      setAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
    },
    [selected, currentQ],
  );

  const handleNext = useCallback(() => {
    if (qIndex + 1 >= QUESTIONS.length) {
      // compute result
      const levelScores: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
      let totalCorrect = 0;
      for (const q of QUESTIONS) {
        if (answers[q.id] === q.correctId) {
          levelScores[q.level] = (levelScores[q.level] ?? 0) + 1;
          totalCorrect++;
        }
      }
      // include last answer
      if (selected === currentQ.correctId) {
        levelScores[currentQ.level] = (levelScores[currentQ.level] ?? 0) + 1;
        totalCorrect++;
      }
      const level = scoreToLevel(totalCorrect, levelScores);
      setResultLevel(level);

      // save to progress
      const progress = loadLearnProgress();
      if (progress.activeLevel < level) {
        saveLearnProgress({ ...progress, activeLevel: level });
      }

      setPhase("result");
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  }, [qIndex, answers, selected, currentQ]);

  // ── intro ─────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-md">
        <div className="surface-elevated p-6 text-center">
          <Hebrew as="p" className="text-3xl font-medium text-ink">
            מֵאַיִן אַתָּה?
          </Hebrew>
          <p className="mt-1 font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            Placement Quiz
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            12 questions across four levels. There's no pass or fail — just find
            the right starting point. The result sets your active level in the
            course.
          </p>
          <ul className="mt-4 space-y-1.5 text-left text-xs text-ink-muted">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-label text-[9px] uppercase text-sage">1–3</span>
              <span>Survival vocabulary — greetings, pronouns, basic phrases</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-label text-[9px] uppercase text-amber">4–6</span>
              <span>Elementary — noun gender, verb present tense, the article</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-label text-[9px] uppercase text-rust">7–9</span>
              <span>Intermediate — roots, tenses, prepositions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-label text-[9px] uppercase text-burg">10–12</span>
              <span>Advanced — binyanim, suffixes, Biblical vocabulary</span>
            </li>
          </ul>
          <button
            type="button"
            className="btn-elevated-primary mt-6 w-full"
            onClick={() => setPhase("quiz")}
          >
            Start quiz
          </button>
          <Link
            href="/learn"
            className="mt-3 block text-xs text-ink-faint underline hover:text-ink-muted"
          >
            Skip — take me to Level 1
          </Link>
        </div>
      </div>
    );
  }

  // ── result ────────────────────────────────────────────────────────────────
  if (phase === "result") {
    const levelNames = ["", "Aleph", "Bet", "Gimel", "Dalet"];
    const levelDescs = [
      "",
      "Start with sounds, greetings, and survival Hebrew — voweled text all the way.",
      "You have the basics. Dive into verb agreement, conversation, and tradition hooks.",
      "Strong foundation. Tackle richer passages, Jewish vocabulary, and root patterns.",
      "Impressive. Jump to essay-register texts, advanced grammar, and the exit exams.",
    ];
    const LEVEL_COLORS = ["", "text-sage", "text-amber", "text-rust", "text-burg"];

    return (
      <div className="mx-auto max-w-md">
        <div className="surface-elevated p-6 text-center">
          <p className="section-label">Your starting point</p>
          <p className={`mt-3 font-hebrew text-5xl font-bold ${LEVEL_COLORS[resultLevel]}`}>
            {["", "א", "ב", "ג", "ד"][resultLevel]}
          </p>
          <p className="mt-2 text-xl font-semibold text-ink">
            Level {resultLevel} — {levelNames[resultLevel]}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {levelDescs[resultLevel]}
          </p>
          <p className="mt-3 text-xs text-ink-faint">
            This has been set as your active level. You can always change it
            from the Learn page.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href={`/learn/${resultLevel}`} className="btn-elevated-primary text-center">
              Open Level {resultLevel}
            </Link>
            <Link href="/learn" className="btn-elevated-secondary text-center">
              Back to Learn hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── quiz ──────────────────────────────────────────────────────────────────
  const isCorrect = selected === currentQ.correctId;
  const LEVEL_LABELS = ["", "Level 1", "Level 2", "Level 3", "Level 4"];

  return (
    <div className="mx-auto max-w-md space-y-4">
      {/* header */}
      <div className="flex items-center justify-between gap-3">
        <p className="section-label">
          Question {qIndex + 1} of {QUESTIONS.length}
        </p>
        <span className="font-label text-[10px] uppercase tracking-wide text-ink-faint">
          {LEVEL_LABELS[currentQ.level]}
        </span>
      </div>
      <ProgressBar current={qIndex} total={QUESTIONS.length} />

      {/* question card */}
      <div className="surface-elevated p-5">
        <p className="text-sm font-medium leading-snug text-ink">
          {currentQ.question}
        </p>
        {currentQ.hebrew ? (
          <Hebrew as="p" className="mt-2 text-3xl text-center font-medium text-ink">
            {currentQ.hebrew}
          </Hebrew>
        ) : null}

        {/* options */}
        <ul className="mt-4 space-y-2">
          {currentQ.options.map((opt) => {
            let state: "idle" | "correct" | "wrong" | "missed" = "idle";
            if (selected !== null) {
              if (opt.id === currentQ.correctId) state = "correct";
              else if (opt.id === selected) state = "wrong";
            }
            const baseClass =
              "w-full cursor-pointer rounded-xl border px-4 py-3 text-left transition";
            const stateClass =
              state === "correct"
                ? "border-sage/60 bg-sage/10 text-sage"
                : state === "wrong"
                  ? "border-rust/60 bg-rust/10 text-rust"
                  : selected !== null
                    ? "cursor-default border-ink/10 opacity-60"
                    : "border-ink/15 hover:border-sage/40 hover:bg-sage/5";

            return (
              <li key={opt.id}>
                <button
                  type="button"
                  className={`${baseClass} ${stateClass}`}
                  onClick={() => handleAnswer(opt.id)}
                  disabled={selected !== null}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-label text-[10px] uppercase text-ink-faint">
                      {opt.id.toUpperCase()}
                    </span>
                    <div className="flex flex-wrap items-baseline gap-2">
                      {opt.hebrew ? (
                        <Hebrew className="text-base">{opt.hebrew}</Hebrew>
                      ) : null}
                      <span className="text-xs">{opt.text}</span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* explanation */}
        {showExplanation ? (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-xs leading-relaxed ${
              isCorrect
                ? "border-sage/30 bg-sage/8 text-sage-dark"
                : "border-amber/30 bg-amber/8 text-amber-dark"
            }`}
          >
            <p className="font-medium mb-1">{isCorrect ? "Correct" : "Not quite"}</p>
            <p className="text-ink-muted">{currentQ.explanation}</p>
          </div>
        ) : null}

        {/* next */}
        {selected !== null ? (
          <button
            type="button"
            className="btn-elevated-primary mt-4 w-full"
            onClick={handleNext}
          >
            {qIndex + 1 >= QUESTIONS.length ? "See my result" : "Next question"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
