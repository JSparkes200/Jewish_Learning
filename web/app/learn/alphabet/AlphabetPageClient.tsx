"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import { AlphabetTracePad } from "@/components/AlphabetTracePad";
import {
  ALPHABET_LETTERS,
  ALPHABET_LETTER_IDS,
  getLetterById,
  type AlphabetLetterMeta,
} from "@/data/alphabet-letters";
import { ALPHABET_TRACK_BLURB, ALPHABET_TRACK_TITLE } from "@/data/course-post-foundation";
import { getDeveloperModeBypass } from "@/lib/developer-mode";
import {
  guestMayPracticeAlphabetLetter,
  guestMayTakeAlphabetFinalExam,
} from "@/lib/guest-alphabet";
import {
  areAllAlphabetLettersTraced,
  completeAlphabetTrack,
  resolveAlphabetGateStatus,
  saveLearnProgress,
  setAlphabetGate,
  setAlphabetLetterTraced,
  type LearnProgressState,
} from "@/lib/learn-progress";
import { useLearnProgressSync } from "@/lib/use-learn-progress-sync";
import { AlphabetFinalExam } from "./AlphabetFinalExam";

function LetterPickerBlock({
  title,
  hint,
  letters,
  traced,
  activeLetterId,
  onPick,
}: {
  title: string;
  hint?: string;
  letters: readonly AlphabetLetterMeta[];
  traced: LearnProgressState["alphabetLettersTraced"];
  activeLetterId: string;
  onPick: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        {title}
      </h2>
      {hint ? (
        <p className="mt-1 max-w-prose text-[11px] leading-snug text-ink-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {letters.map((L) => (
          <button
            key={L.id}
            type="button"
            onClick={() => onPick(L.id)}
            className={`rounded-lg border px-3 py-2 font-hebrew text-lg ${
              activeLetterId === L.id
                ? "border-sage bg-sage/15 text-ink"
                : "border-ink/15 bg-parchment-card text-ink-muted"
            }`}
          >
            {traced?.[L.id] ? "✓ " : ""}
            {L.char}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AlphabetPageClient() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const guestMode = authLoaded && !isSignedIn;
  const [progress, setProgress] = useLearnProgressSync({});
  const [activeLetterId, setActiveLetterId] = useState(ALPHABET_LETTERS[0].id);
  const [showFinal, setShowFinal] = useState(false);

  const effective = resolveAlphabetGateStatus(progress);
  const traced = progress.alphabetLettersTraced;
  const nTraced = useMemo(
    () => ALPHABET_LETTER_IDS.filter((id) => traced?.[id]).length,
    [traced],
  );
  const allLessonsDone = areAllAlphabetLettersTraced(progress);
  const trackDone =
    progress.alphabetFinalExamPassed === true || effective === "passed";

  const beginPractice = () => {
    setProgress((p) => {
      const next = setAlphabetGate(p, "in_progress");
      saveLearnProgress(next);
      return next;
    });
  };

  const markLetterPracticed = (id: string) => {
    if (!guestMayPracticeAlphabetLetter(id, !!isSignedIn)) return;
    setProgress((p) => {
      const next = setAlphabetLetterTraced(p, id, true);
      saveLearnProgress(next);
      return next;
    });
  };

  const applySkip = () => {
    setProgress((p) => {
      const next = setAlphabetGate(p, "skipped");
      saveLearnProgress(next);
      return next;
    });
  };

  const applySimulate = () => {
    setProgress((p) => {
      const next = completeAlphabetTrack(p);
      saveLearnProgress(next);
      return next;
    });
  };

  const activeLetter = getLetterById(activeLetterId);
  const mayPracticeActiveLetter =
    !activeLetter ||
    guestMayPracticeAlphabetLetter(activeLetter.id, !!isSignedIn);

  const printLetters = useMemo(
    () => ALPHABET_LETTERS.filter((l) => l.section === "print"),
    [],
  );
  const finalLetters = useMemo(
    () => ALPHABET_LETTERS.filter((l) => l.section === "final"),
    [],
  );

  const onFinalComplete = (next: LearnProgressState) => {
    setProgress(next);
    setShowFinal(false);
  };

  if (effective === "skipped") {
    return (
      <div>
        <nav className="mb-6">
          <Link
            href="/learn"
            className="font-label text-[10px] uppercase tracking-[0.2em] text-sage hover:underline"
          >
            ← Learn
          </Link>
        </nav>
        <p className="text-sm text-ink-muted">
          You chose to skip the alphabet track. You can still open it anytime from
          Learn.
        </p>
        {isSignedIn ? (
          <Link
            href="/learn"
            className="mt-4 inline-block text-sage underline"
          >
            Learn home →
          </Link>
        ) : (
          <p className="mt-4 text-sm text-ink-muted">
            <Link href="/sign-in" className="text-sage underline">
              Sign in
            </Link>{" "}
            to open the full Alef–Dalet course and sync progress.
          </p>
        )}
      </div>
    );
  }

  if (trackDone) {
    return (
      <div>
        <nav className="mb-6">
          <Link
            href="/learn"
            className="font-label text-[10px] uppercase tracking-[0.2em] text-sage hover:underline"
          >
            ← Learn
          </Link>
        </nav>
        <header className="mb-6">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            Pre-foundation
          </p>
          <h1 className="font-hebrew text-2xl text-ink">{ALPHABET_TRACK_TITLE}</h1>
        </header>
        <div className="rounded-2xl border border-sage/35 bg-sage/10 p-4">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
            Completed
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Alphabet track marked complete. Continue to Alef–Dalet when you are
            ready.
          </p>
          {isSignedIn ? (
            <Link
              href="/learn"
              className="mt-3 inline-block rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            >
              Open Learn →
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="mt-3 inline-block rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            >
              Sign in for the course →
            </Link>
          )}
        </div>
      </div>
    );
  }

  const showLessonUi = effective === "in_progress";

  return (
    <div>
      <nav className="mb-6">
        <Link
          href="/learn"
          className="font-label text-[10px] uppercase tracking-[0.2em] text-sage hover:underline"
        >
          ← Learn
        </Link>
      </nav>

      <header className="mb-6">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Pre-foundation
        </p>
        <h1 className="font-hebrew text-2xl text-ink">{ALPHABET_TRACK_TITLE}</h1>
        <p className="mt-2 text-sm text-ink-muted">{ALPHABET_TRACK_BLURB}</p>
      </header>

      {guestMode ? (
        <div className="mb-6 rounded-2xl border border-sage/25 bg-sage/5 p-4 text-xs leading-relaxed text-ink-muted">
          <strong className="text-ink">Guest mode.</strong> Trace and mark the
          first four print letters (א–ד). Open any letter to preview sounds.{" "}
          <Link href="/sign-in" className="text-sage underline">
            Sign in
          </Link>{" "}
          for the rest of the alphabet, the final exam, and the full course.
        </div>
      ) : null}

      <div className="mb-6 rounded-2xl border border-ink/12 bg-parchment-card/80 p-4">
        <p className="font-label text-[9px] uppercase tracking-[0.15em] text-ink-muted">
          Status
        </p>
        <p className="mt-2 text-sm text-ink">
          Gate: <strong className="text-sage">{effective}</strong> · Letters
          practiced:{" "}
          <strong className="text-ink">
            {nTraced}/{ALPHABET_LETTERS.length}
          </strong>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={applySkip}
            className="rounded-lg bg-sage px-4 py-2 font-label text-[9px] uppercase tracking-wide text-white hover:brightness-110"
          >
            I already read Hebrew — skip
          </button>
          {getDeveloperModeBypass() || isSignedIn ? (
            <button
              type="button"
              onClick={applySimulate}
              className="rounded-lg border border-amber/30 px-4 py-2 font-label text-[9px] uppercase tracking-wide text-amber hover:bg-amber/10"
            >
              Simulate full completion (dev)
            </button>
          ) : null}
        </div>
      </div>

      {effective === "unseen" ? (
        <div className="mb-8 rounded-2xl border border-sage/30 bg-sage/5 p-6 text-center">
          <p className="text-sm text-ink-muted">
            Trace every print letter and each sofit form on the pad (touch or
            mouse), check your trace, or mark as practiced if drawing is difficult.
            Then take the final: six traces + twelve sound questions.
          </p>
          <button
            type="button"
            onClick={beginPractice}
            className="mt-4 rounded-xl bg-sage px-6 py-3 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
          >
            Begin alphabet practice
          </button>
        </div>
      ) : null}

      {showLessonUi && !showFinal ? (
        <section className="mb-8 space-y-8">
          <LetterPickerBlock
            title="Print letters (22)"
            letters={printLetters}
            traced={traced}
            activeLetterId={activeLetterId}
            onPick={setActiveLetterId}
          />
          <LetterPickerBlock
            title="Final forms — sofit (5)"
            hint="Used at the end of a word; same sounds as כ מ נ פ צ."
            letters={finalLetters}
            traced={traced}
            activeLetterId={activeLetterId}
            onPick={setActiveLetterId}
          />

          {activeLetter ? (
            <div className="mt-6 rounded-2xl border border-ink/10 bg-parchment-card/90 p-4">
              <p className="text-sm text-ink">
                <strong className="font-hebrew text-2xl">{activeLetter.char}</strong>{" "}
                — {activeLetter.name}
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                Sound: {activeLetter.sound}
              </p>
              {mayPracticeActiveLetter ? (
                <>
                  <div className="mt-4">
                    <AlphabetTracePad
                      key={activeLetterId}
                      letter={activeLetter.char}
                      onPass={() => markLetterPracticed(activeLetter.id)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => markLetterPracticed(activeLetter.id)}
                    className="mt-4 rounded-lg border border-ink/15 px-4 py-2 font-label text-[9px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
                  >
                    Mark as practiced (no drawing)
                  </button>
                </>
              ) : (
                <div className="mt-4 rounded-xl border border-sage/20 bg-parchment-deep/40 p-4 text-sm text-ink-muted">
                  <p>
                    Guest previews stop after א–ד.{" "}
                    <Link href="/sign-in" className="text-sage underline">
                      Sign in
                    </Link>{" "}
                    to trace this letter and continue the full Alef–Bet track.
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {allLessonsDone ? (
            <div className="mt-8 rounded-2xl border border-sage/30 bg-sage/5 p-4 text-center">
              {guestMayTakeAlphabetFinalExam(!!isSignedIn) ? (
                <>
                  <p className="text-sm font-medium text-ink">
                    All letters practiced — ready for the final exam.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowFinal(true)}
                    className="mt-3 rounded-xl bg-sage px-6 py-3 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
                  >
                    Start final exam
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-ink-muted">
                    You&apos;ve reached the guest practice limit for tracing. Sign
                    in to take the final exam and unlock the full course.
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <Link
                      href="/sign-in"
                      className="inline-block rounded-xl bg-sage px-6 py-3 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      className="inline-block rounded-xl border border-sage/40 px-6 py-3 font-label text-[10px] uppercase tracking-wide text-sage hover:bg-sage/10"
                    >
                      Create account
                    </Link>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      {showLessonUi && showFinal && allLessonsDone ? (
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setShowFinal(false)}
            className="mb-4 font-label text-[10px] uppercase tracking-wide text-sage hover:underline"
          >
            ← Back to letters
          </button>
          <AlphabetFinalExam onComplete={onFinalComplete} />
        </div>
      ) : null}

      <Hebrew as="p" className="mt-8 text-center text-sm text-ink-faint">
        אָלֶף־בֵּית
      </Hebrew>
    </div>
  );
}
