"use client";

import { useState, useEffect } from "react";
import { Hebrew } from "@/components/Hebrew";
import type { SectionLessonPrimer } from "@/data/course-section-primers";
import { HebrewAudioControls } from "@/components/HebrewAudioControls";
import {
  useHebrewSpeech,
  tokenizeHebrew,
} from "@/hooks/useHebrewSpeech";

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Speaker icon */
function SpeakerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
    </svg>
  );
}

/** Stop icon */
function StopIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <rect x="4" y="4" width="12" height="12" rx="2" />
    </svg>
  );
}

/** Play button for a single Hebrew word or phrase */
function PlayButton({
  text,
  speechKey,
  activeKey,
  speak,
  className = "",
}: {
  text: string;
  speechKey: string;
  activeKey: string | null;
  speak: (text: string, key: string) => void;
  className?: string;
}) {
  const isPlaying = activeKey === speechKey;
  return (
    <button
      type="button"
      onClick={() => speak(text, speechKey)}
      className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
        isPlaying
          ? "bg-sage/20 text-sage"
          : "text-ink-faint hover:bg-sage/10 hover:text-sage"
      } ${className}`}
      aria-label={isPlaying ? "Stop" : `Play audio for ${text}`}
    >
      {isPlaying ? (
        <StopIcon className="h-3 w-3" />
      ) : (
        <SpeakerIcon className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

/**
 * Renders Hebrew sentence text with per-word highlighting during playback.
 * Falls back gracefully when boundary events aren't supported (Firefox).
 */
function HighlightedHebrewText({
  text,
  speechKey,
  activeKey,
  activeWordIndex,
  speak,
}: {
  text: string;
  speechKey: string;
  activeKey: string | null;
  activeWordIndex: number;
  speak: (text: string, key: string) => void;
}) {
  const isPlaying = activeKey === speechKey;
  const tokens = tokenizeHebrew(text);

  return (
    <div className="flex items-start gap-2">
      <button
        type="button"
        onClick={() => speak(text, speechKey)}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition ${
          isPlaying
            ? "bg-sage/20 text-sage"
            : "text-ink-faint hover:bg-sage/10 hover:text-sage"
        }`}
        aria-label={isPlaying ? "Stop" : "Play sentence"}
      >
        {isPlaying ? (
          <StopIcon className="h-2.5 w-2.5" />
        ) : (
          <SpeakerIcon className="h-3 w-3" />
        )}
      </button>
      <Hebrew
        as="p"
        className="flex-1 flex-wrap text-right text-xs leading-relaxed text-ink-muted"
      >
        {tokens.map((word, i) => (
          <span
            key={`${i}-${word}`}
            className={`transition-colors duration-100 ${
              isPlaying && activeWordIndex === i
                ? "rounded-sm bg-sage/20 text-sage"
                : ""
            }`}
          >
            {word}
            {i < tokens.length - 1 ? " " : ""}
          </span>
        ))}
      </Hebrew>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function LessonPrimerPanel({
  primer,
  defaultOpen = false,
}: {
  primer: SectionLessonPrimer;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    activeKey,
    activeWordIndex,
    speak,
    stop,
  } = useHebrewSpeech();

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stop();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, stop]);

  function handleClose() {
    stop();
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-5 w-full rounded-2xl border border-sage/20 bg-parchment-deep/25 px-4 py-3 text-left font-label text-[10px] uppercase tracking-[0.18em] text-sage shadow-sm transition hover:border-sage/40 hover:bg-parchment-deep/35"
      >
        Review Lesson
      </button>

      {open && (
        <div
          className="fixed inset-x-0 bottom-0 z-[110] flex justify-center px-4 pt-10"
          style={{ top: "40px" }}
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          <div
            className="relative flex max-h-[min(82dvh,600px)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-ink/15 bg-parchment-card shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lesson-primer-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/10 bg-parchment-deep/30 px-4 py-3">
              <div>
                <p className="font-label text-[9px] uppercase tracking-[0.2em] text-ink-muted">
                  Lesson primer
                </p>
                <h2
                  id="lesson-primer-title"
                  className="mt-0.5 font-label text-[11px] uppercase tracking-[0.18em] text-sage"
                >
                  Review Lesson
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-7 w-7 items-center justify-center rounded-full text-ink-faint transition hover:bg-ink/8 hover:text-ink"
                aria-label="Close"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  className="h-3.5 w-3.5"
                >
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>

            {/* Audio controls bar */}
            <HebrewAudioControls
              rate={rate}
              setRate={setRate}
              voices={voices}
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
            />

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-5 px-4 pb-6 pt-4">
                {/* Intro */}
                <p className="text-sm leading-relaxed text-ink">
                  These are the words and ideas you&apos;ll encounter in this
                  lesson.
                  Tap{" "}
                  <span className="font-medium text-sage">Ask the Rabbi</span>{" "}
                  on any card to go deeper.
                </p>

                {/* Words & phrases */}
                {primer.words && primer.words.length > 0 && (
                  <div>
                    <p className="font-label text-[9px] uppercase tracking-wide text-ink-faint">
                      Words &amp; phrases
                    </p>
                    <ul className="mt-2 space-y-2">
                      {primer.words.map((w, i) => {
                        const key = `word-${i}`;
                        const isPlaying = activeKey === key;
                        return (
                          <li
                            key={`${w.he}-${i}`}
                            className={`rounded-2xl border px-3 py-2.5 transition-colors ${
                              isPlaying
                                ? "border-sage/30 bg-sage/8"
                                : "border-ink/8 bg-parchment-card/70"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <Hebrew className="text-base text-ink">
                                  {w.he}
                                </Hebrew>
                                <p className="text-xs text-ink-muted">{w.en}</p>
                                {w.hint ? (
                                  <p className="mt-1 text-[11px] text-ink-faint">
                                    {w.hint}
                                  </p>
                                ) : null}
                              </div>
                              <PlayButton
                                text={w.he}
                                speechKey={key}
                                activeKey={activeKey}
                                speak={speak}
                                className="mt-0.5 shrink-0"
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Grammar focus */}
                {primer.grammar && primer.grammar.length > 0 && (
                  <div>
                    <p className="font-label text-[9px] uppercase tracking-wide text-ink-faint">
                      Grammar focus
                    </p>
                    <ul className="mt-2 space-y-2">
                      {primer.grammar.map((line, i) => {
                        const key = `grammar-${i}`;
                        const hasHebrew = /[\u0590-\u05FF]/.test(line);
                        return (
                          <li key={line} className="text-xs leading-relaxed">
                            {hasHebrew ? (
                              <HighlightedHebrewText
                                text={line}
                                speechKey={key}
                                activeKey={activeKey}
                                activeWordIndex={activeWordIndex}
                                speak={speak}
                              />
                            ) : (
                              <span className="text-ink-muted">{line}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Ideas & context */}
                {primer.ideas && primer.ideas.length > 0 && (
                  <div>
                    <p className="font-label text-[9px] uppercase tracking-wide text-ink-faint">
                      Ideas &amp; context
                    </p>
                    <ul className="mt-2 space-y-2">
                      {primer.ideas.map((line, i) => {
                        const key = `idea-${i}`;
                        const hasHebrew = /[\u0590-\u05FF]/.test(line);
                        return (
                          <li key={line} className="text-xs leading-relaxed">
                            {hasHebrew ? (
                              <HighlightedHebrewText
                                text={line}
                                speechKey={key}
                                activeKey={activeKey}
                                activeWordIndex={activeWordIndex}
                                speak={speak}
                              />
                            ) : (
                              <span className="text-ink-muted">{line}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
