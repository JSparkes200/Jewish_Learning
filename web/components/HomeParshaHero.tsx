"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { HebrewAudioControls } from "@/components/HebrewAudioControls";
import { Hebrew } from "@/components/Hebrew";
import { SaveWordButton } from "@/components/SaveWordButton";
import { useHebrewSpeech } from "@/hooks/useHebrewSpeech";
import type { ParshaSnapshot } from "@/lib/hebcal-parsha";
import type { ParshaPassagePayload } from "@/lib/sefaria-parsha";
import type { WordDetailEnrichment } from "@/lib/word-detail-enrichment";
import {
  getHebrewDateLineLocal,
  getParshaSnapshotLocal,
} from "@/lib/parsha-local";

const PARSHA_SPEECH_KEY = "home-parsha-torah-reading";

/**
 * Convert an English Tanakh ref like "Leviticus 16:1-20:27" into Hebrew,
 * e.g. "וַיִּקְרָא ט״ז:א׳–כ׳:כ״ז". Returns `null` if the book can't be mapped.
 */
const TORAH_BOOK_EN_TO_HE: Record<string, string> = {
  Genesis: "בראשית",
  Exodus: "שמות",
  Leviticus: "ויקרא",
  Numbers: "במדבר",
  Deuteronomy: "דברים",
};

function numberToHebrewNumeral(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return String(value);
  let remaining = Math.floor(value);
  const hundreds = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];
  const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
  let out = "";
  if (remaining >= 100) {
    out += hundreds[Math.floor(remaining / 100)];
    remaining %= 100;
  }
  if (remaining === 15) {
    out += "טו";
  } else if (remaining === 16) {
    out += "טז";
  } else {
    out += tens[Math.floor(remaining / 10)] + ones[remaining % 10];
  }
  if (out.length === 1) return `${out}׳`;
  return `${out.slice(0, -1)}״${out.slice(-1)}`;
}

function toHebrewRef(ref: string): string | null {
  const match = ref.match(/^([A-Za-z]+)\s+(\d+):(\d+)(?:\s*-\s*(\d+):(\d+))?$/);
  if (!match) return null;
  const [, book, c1, v1, c2, v2] = match;
  const heBook = TORAH_BOOK_EN_TO_HE[book];
  if (!heBook) return null;
  const start = `${numberToHebrewNumeral(Number(c1))}:${numberToHebrewNumeral(Number(v1))}`;
  if (c2 && v2) {
    const end = `${numberToHebrewNumeral(Number(c2))}:${numberToHebrewNumeral(Number(v2))}`;
    return `${heBook} ${start}–${end}`;
  }
  return `${heBook} ${start}`;
}

/** Vertical auto-scroll band inside the reading viewport (px). */
const READING_EDGE_SCROLL_PX = 80;
const READING_EDGE_SCROLL_STEP = 8;

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

/**
 * Weekly parsha summary + full Torah reading (Hebrew with English beneath) and TTS.
 */
export function HomeParshaHero() {
  const [parsha, setParsha] = useState<ParshaSnapshot | null>(null);
  const [hebrewDate, setHebrewDate] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [passage, setPassage] = useState<ParshaPassagePayload | null>(null);
  const [passageLoading, setPassageLoading] = useState(true);
  const [passageErr, setPassageErr] = useState<string | null>(null);
  const [hoveredVerseIndex, setHoveredVerseIndex] = useState<number | null>(
    null,
  );

  const readingScrollRef = useRef<HTMLDivElement>(null);
  const edgeZoneRef = useRef<"up" | "down" | null>(null);
  const edgeRafRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(false);

  const modalScrollRef = useRef<HTMLDivElement>(null);
  const modalEdgeZoneRef = useRef<"up" | "down" | null>(null);
  const modalEdgeRafRef = useRef<number | null>(null);

  const [selectedVerseIndex, setSelectedVerseIndex] = useState<number | null>(null);
  const [nikkudEnabled, setNikkudEnabled] = useState(false);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [wordDetails, setWordDetails] = useState<
    Record<string, { status: "loading" | "error" | "success"; data?: WordDetailEnrichment }>
  >({});
  const fetchedWordsRef = useRef<Set<string>>(new Set());

  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    activeKey,
    speak,
    stop,
  } = useHebrewSpeech();

  useEffect(() => {
    const t = new Date();
    const y = t.getFullYear();
    const m = t.getMonth() + 1;
    const d = t.getDate();
    const p = getParshaSnapshotLocal(y, m, d);
    const hd = getHebrewDateLineLocal(y, m, d);
    setParsha(p);
    setHebrewDate(hd);
    setErr(!p && !hd ? "Calendar data unavailable for today." : null);
    setLoading(false);

    let cancelled = false;
    setPassageLoading(true);
    setPassageErr(null);

    fetch(`/api/parsha-passage?y=${y}&m=${m}&d=${d}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(body?.error ?? "Could not load portion text.");
        }
        return res.json() as Promise<ParshaPassagePayload>;
      })
      .then((data) => {
        if (!cancelled) {
          setPassage(data);
          setPassageErr(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setPassage(null);
          setPassageErr(
            e instanceof Error ? e.message : "Could not load portion text.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setPassageLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const stopReadingEdgeScroll = () => {
    if (edgeRafRef.current != null) {
      cancelAnimationFrame(edgeRafRef.current);
      edgeRafRef.current = null;
    }
  };

  useEffect(() => () => stopReadingEdgeScroll(), []);

  const startReadingEdgeScrollLoop = () => {
    if (edgeRafRef.current != null) return;

    const tick = () => {
      const el = readingScrollRef.current;
      const zone = edgeZoneRef.current;
      if (!el || !zone) {
        edgeRafRef.current = null;
        return;
      }

      const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
      const step = READING_EDGE_SCROLL_STEP;

      if (zone === "up") {
        if (el.scrollTop <= 0) {
          edgeZoneRef.current = null;
          edgeRafRef.current = null;
          return;
        }
        el.scrollTop = Math.max(0, el.scrollTop - step);
      } else {
        if (el.scrollTop >= maxScroll - 0.5) {
          edgeZoneRef.current = null;
          edgeRafRef.current = null;
          return;
        }
        el.scrollTop = Math.min(maxScroll, el.scrollTop + step);
      }

      edgeRafRef.current = requestAnimationFrame(tick);
    };

    edgeRafRef.current = requestAnimationFrame(tick);
  };

  const onReadingPanePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduceMotionRef.current) return;

    const el = readingScrollRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const h = rect.height;
    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);

    let zone: "up" | "down" | null = null;
    if (y >= 0 && y < READING_EDGE_SCROLL_PX && el.scrollTop > 0.5) {
      zone = "up";
    } else if (
      y > h - READING_EDGE_SCROLL_PX &&
      y <= h &&
      el.scrollTop < maxScroll - 0.5
    ) {
      zone = "down";
    }

    edgeZoneRef.current = zone;

    if (zone) {
      startReadingEdgeScrollLoop();
    } else {
      stopReadingEdgeScroll();
    }
  };

  const onReadingPanePointerLeave = () => {
    edgeZoneRef.current = null;
    stopReadingEdgeScroll();
  };

  const stopModalEdgeScroll = () => {
    if (modalEdgeRafRef.current != null) {
      cancelAnimationFrame(modalEdgeRafRef.current);
      modalEdgeRafRef.current = null;
    }
  };

  useEffect(() => () => stopModalEdgeScroll(), []);

  const startModalEdgeScrollLoop = () => {
    if (modalEdgeRafRef.current != null) return;

    const tick = () => {
      const el = modalScrollRef.current;
      const zone = modalEdgeZoneRef.current;
      if (!el || !zone) {
        modalEdgeRafRef.current = null;
        return;
      }

      const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
      const step = READING_EDGE_SCROLL_STEP;

      if (zone === "up") {
        if (el.scrollTop <= 0) {
          modalEdgeZoneRef.current = null;
          modalEdgeRafRef.current = null;
          return;
        }
        el.scrollTop = Math.max(0, el.scrollTop - step);
      } else {
        if (el.scrollTop >= maxScroll - 0.5) {
          modalEdgeZoneRef.current = null;
          modalEdgeRafRef.current = null;
          return;
        }
        el.scrollTop = Math.min(maxScroll, el.scrollTop + step);
      }

      modalEdgeRafRef.current = requestAnimationFrame(tick);
    };

    modalEdgeRafRef.current = requestAnimationFrame(tick);
  };

  const onModalPanePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduceMotionRef.current) return;

    const el = modalScrollRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const h = rect.height;
    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);

    let zone: "up" | "down" | null = null;
    if (y >= 0 && y < READING_EDGE_SCROLL_PX && el.scrollTop > 0.5) {
      zone = "up";
    } else if (
      y > h - READING_EDGE_SCROLL_PX &&
      y <= h &&
      el.scrollTop < maxScroll - 0.5
    ) {
      zone = "down";
    }

    modalEdgeZoneRef.current = zone;

    if (zone) {
      startModalEdgeScrollLoop();
    } else {
      stopModalEdgeScroll();
    }
  };

  const onModalPanePointerLeave = () => {
    modalEdgeZoneRef.current = null;
    stopModalEdgeScroll();
  };

  useEffect(() => {
    if (selectedVerseIndex === null) {
      stopModalEdgeScroll();
      modalEdgeZoneRef.current = null;
    }
  }, [selectedVerseIndex]);

  useEffect(() => {
    if (selectedVerseIndex === null || selectedWordIndex === null || !passage) return;
    const verse = passage.verses[selectedVerseIndex];
    if (!verse) return;
    
    const words = verse.he.split(" ");
    const rawWord = words[selectedWordIndex];
    if (!rawWord) return;

    const bareWord = stripNikkud(rawWord);
    if (!bareWord || fetchedWordsRef.current.has(bareWord)) return;

    fetchedWordsRef.current.add(bareWord);
    let cancelled = false;
    setWordDetails((prev) => ({ ...prev, [bareWord]: { status: "loading" } }));

    fetch(`/api/word-detail?he=${encodeURIComponent(bareWord)}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) throw new Error("Sign in to view dictionary definitions.");
          throw new Error("Could not load word details.");
        }
        return res.json() as Promise<WordDetailEnrichment>;
      })
      .then((data) => {
        if (!cancelled) {
          setWordDetails((prev) => ({ ...prev, [bareWord]: { status: "success", data } }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWordDetails((prev) => ({
            ...prev,
            [bareWord]: { status: "error", data: undefined },
          }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedWordIndex, selectedVerseIndex, passage]);

  const hebrewReadingPlain = useMemo(() => {
    if (!passage?.verses.length) return "";
    return passage.verses.map((v) => v.he).join(" ");
  }, [passage]);

  const stripNikkud = (text: string) => {
    // Strip vowel points + cantillation marks, but keep the maqaf (U+05BE)
    // so compound words like "אֶל־מֹשֶׁה" stay recognisable as two pieces.
    return text.replace(/[\u0591-\u05BD\u05BF-\u05C7]/g, "");
  };

  const stripTaamim = (text: string) => {
    return text.replace(/[\u0591-\u05AF\u05BD\u05C0\u05C3-\u05C6]/g, "");
  };

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const readUrl =
    passage?.sefariaReadUrl ?? parsha?.readUrl ?? "https://www.sefaria.org/";

  const isParshaPlaying = activeKey === PARSHA_SPEECH_KEY;

  const renderVerseModal = () => {
    if (selectedVerseIndex === null || !passage) return null;
    const verse = passage.verses[selectedVerseIndex];
    if (!verse) return null;

    const words = verse.he.split(" ");
    const selectedWord = selectedWordIndex !== null ? words[selectedWordIndex] : null;
    const bareSelectedWord = selectedWord ? stripNikkud(selectedWord) : null;
    const details = bareSelectedWord ? wordDetails[bareSelectedWord] : null;

    return createPortal(
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <button
          type="button"
          className="absolute inset-0 cursor-default border-0 bg-ink/20 backdrop-blur-sm"
          onClick={() => {
            setSelectedVerseIndex(null);
            setSelectedWordIndex(null);
          }}
          aria-label="Close verse modal"
        />
        <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-sage/35 bg-gradient-to-br from-white/95 via-[rgb(252,250,246)]/95 to-teal-950/[0.05] shadow-[0_32px_72px_-20px_rgba(30,22,14,0.35),0_12px_28px_-8px_rgba(15,118,110,0.18),inset_0_1px_0_0_rgba(255,255,255,0.92)] backdrop-blur-xl ring-1 ring-teal-600/[0.14]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgb(20_184_166/0.09)_0%,transparent_38%,transparent_62%,rgb(34_197_94/0.06)_100%)] opacity-70" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/45 to-transparent" aria-hidden />

          <div className="relative z-10 flex shrink-0 items-center justify-between gap-2 border-b border-ink/10 bg-white/55 px-4 py-2.5 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                Verse {selectedVerseIndex + 1}
              </span>
              <button
                type="button"
                onClick={() => setNikkudEnabled((prev) => !prev)}
                className={`rounded-full border px-2.5 py-0.5 font-label text-[9px] uppercase tracking-wider transition-colors ${
                  nikkudEnabled
                    ? "border-teal-500/30 bg-teal-500/15 text-teal-800"
                    : "border-ink/10 bg-white/60 text-ink-muted hover:bg-teal-500/10 hover:text-teal-900"
                }`}
              >
                Nikkud {nikkudEnabled ? "On" : "Off"}
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => speak(stripNikkud(verse.he), "verse-modal-speech")}
                className="flex items-center gap-1.5 rounded-full border border-teal-900/15 bg-white/60 px-2.5 py-1 font-label text-[9px] uppercase tracking-wider text-ink-muted shadow-sm transition hover:bg-teal-500/10 hover:text-teal-900"
                aria-label="Play verse audio"
              >
                <SpeakerIcon className="h-3.5 w-3.5" />
                Play
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedVerseIndex(null);
                  setSelectedWordIndex(null);
                }}
                className="rounded-full p-1 text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
                aria-label="Close verse modal"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-8 bg-gradient-to-b from-white/70 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-8 bg-gradient-to-t from-white/70 to-transparent"
              aria-hidden
            />
            <div
              ref={modalScrollRef}
              onPointerMove={onModalPanePointerMove}
              onPointerLeave={onModalPanePointerLeave}
              className="relative h-full max-h-[calc(85vh-3.5rem)] overflow-y-auto overscroll-y-contain [scrollbar-color:rgb(44_36_22/0.22)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/22"
            >
              <div className="flex flex-col gap-4 px-5 py-5 sm:px-7">
                <Hebrew as="div" className="flex flex-wrap justify-center gap-x-2 gap-y-3 text-center text-2xl leading-relaxed text-ink sm:text-3xl">
                  {words.map((word, wIdx) => {
                    const isSelected = selectedWordIndex === wIdx;
                    const displayWord = nikkudEnabled ? stripTaamim(word) : stripNikkud(word);
                    return (
                      <span
                        key={wIdx}
                        onClick={() => setSelectedWordIndex(wIdx)}
                        className={`cursor-pointer rounded-lg px-1.5 py-0.5 transition-colors ${
                          isSelected ? "bg-teal-500/15 text-teal-900 ring-1 ring-teal-500/30" : "hover:bg-ink/5"
                        }`}
                      >
                        {displayWord}
                      </span>
                    );
                  })}
                </Hebrew>

                <p className="text-center font-body text-sm leading-relaxed text-ink-muted sm:text-base">
                  {verse.en}
                </p>
              </div>

              <div className="border-t border-ink/8 bg-white/35 px-5 py-4 backdrop-blur-sm sm:px-7">
                {selectedWord && bareSelectedWord ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <Hebrew className="text-xl font-medium text-ink">{stripTaamim(selectedWord)}</Hebrew>
                        <button
                          type="button"
                          onClick={() => speak(selectedWord, `word-modal-speech-${bareSelectedWord}`)}
                          className="rounded-full p-1 text-teal-700/60 transition-colors hover:bg-teal-500/10 hover:text-teal-900"
                          aria-label="Pronounce word"
                        >
                          <SpeakerIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="font-label text-[9px] uppercase tracking-wider text-teal-700/70">
                        Definition
                      </span>
                    </div>
                    <SaveWordButton
                      he={bareSelectedWord}
                      variant="compact"
                      className="!ml-auto !w-auto !max-w-none shrink-0"
                    />
                  </div>
                  {details?.status === "loading" ? (
                    <p className="text-sm text-ink-muted animate-pulse">Loading details...</p>
                  ) : details?.status === "error" ? (
                    <p className="text-sm text-rust">Sign in to view dictionary definitions.</p>
                  ) : details?.status === "success" && details.data ? (
                    <div className="text-sm text-ink-muted">
                      {details.data.breakdown && details.data.breakdown.morphemes.length > 1 ? (
                        <div className="mb-3 rounded-md bg-teal-500/5 p-2.5 ring-1 ring-teal-500/15">
                          <p className="mb-1.5 font-label text-[9px] uppercase tracking-wider text-teal-800/70">
                            Breakdown
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5" dir="rtl">
                            {details.data.breakdown.morphemes.map((m, idx) => (
                              <div
                                key={idx}
                                className={`flex flex-col items-center rounded px-2 py-1 text-center ${
                                  m.role === "stem" || m.role === "word"
                                    ? "bg-teal-500/15 ring-1 ring-teal-500/25"
                                    : "bg-ink/5 ring-1 ring-ink/10"
                                }`}
                              >
                                <Hebrew className="text-sm font-medium text-ink">{m.form}</Hebrew>
                                <span className="mt-0.5 font-body text-[10px] leading-tight text-ink-muted" dir="ltr">
                                  {m.gloss}
                                </span>
                              </div>
                            ))}
                          </div>
                          {details.data.breakdown.combinedMeaning && (
                            <p className="mt-2 font-body text-xs italic leading-relaxed text-ink-muted" dir="ltr">
                              <span className="font-label text-[9px] uppercase tracking-wider text-teal-800/70">Combined: </span>
                              {details.data.breakdown.combinedMeaning}
                            </p>
                          )}
                        </div>
                      ) : null}
                      {details.data.lexiconEntries && details.data.lexiconEntries.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {details.data.lexiconEntries.slice(0, 2).map((entry, idx) => (
                            <div key={idx} className="rounded-md bg-white/40 p-2.5 shadow-sm ring-1 ring-ink/5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-baseline gap-2">
                                  <Hebrew className="text-base font-medium text-ink">{entry.headword}</Hebrew>
                                  <button
                                    type="button"
                                    onClick={() => speak(entry.headword, `dict-speech-${idx}`)}
                                    className="rounded-full p-0.5 text-teal-700/40 transition-colors hover:bg-teal-500/10 hover:text-teal-900"
                                    aria-label="Pronounce dictionary word"
                                  >
                                    <SpeakerIcon className="h-3 w-3" />
                                  </button>
                                  {entry.pronunciation && (
                                    <span className="font-mono text-[10px] text-teal-700/70">{entry.pronunciation}</span>
                                  )}
                                </div>
                                <span className="text-[9px] uppercase tracking-wider text-ink-faint">{entry.parent_lexicon}</span>
                              </div>
                              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{entry.definition}</p>
                            </div>
                          ))}
                        </div>
                      ) : details.data.rootFamily ? (
                        <p>
                          <strong className="font-medium text-ink">Root:</strong>{" "}
                          <Hebrew className="font-medium">{details.data.rootFamily.root}</Hebrew> — {details.data.rootFamily.meaning}
                        </p>
                      ) : details.data.breakdown && details.data.breakdown.morphemes.length > 1 ? null : (
                        <p>No dictionary definition found.</p>
                      )}
                      {details.data.wikiExtract ? (
                        <p className="mt-3 border-t border-ink/5 pt-2 text-xs line-clamp-2">{details.data.wikiExtract}</p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm italic text-ink-faint">
                  Click on a Hebrew word above to see its dictionary breakdown.
                </p>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <section className="surface-elevated overflow-hidden p-5">
      <div className="grid grid-cols-1 gap-5 border-b border-ink/10 pb-5 sm:grid-cols-[auto_1fr] sm:items-end sm:gap-8">
        <div className="flex flex-col gap-1">
          <p className="font-label text-[9px] uppercase tracking-[0.22em] text-ink-faint">
            Today
          </p>
          <p className="text-sm font-semibold leading-tight text-ink">
            {todayLabel}
          </p>
          {hebrewDate ? (
            <Hebrew
              as="p"
              className="mt-0.5 text-base leading-snug text-sage/80 sm:text-lg"
            >
              {hebrewDate}
            </Hebrew>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-1.5 sm:items-end sm:text-right">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-sage/40 sm:w-10" aria-hidden />
            <p className="font-label text-[9px] uppercase tracking-[0.22em] text-sage/70">
              Parashat Hashavua
            </p>
          </div>
          {loading ? (
            <div className="h-7 w-48 animate-pulse rounded bg-parchment-deep/60" />
          ) : err ? (
            <p className="text-sm text-rust">{err}</p>
          ) : !parsha && hebrewDate ? (
            <p className="text-xs italic text-ink-muted">
              Torah portion unavailable right now.
            </p>
          ) : parsha ? (
            <div className="flex flex-col items-start gap-1 sm:items-end">
              {passage?.parshaTitleHe || parsha.hebrew ? (
                <Hebrew
                  as="p"
                  className="text-2xl font-semibold leading-tight text-ink sm:text-[1.65rem]"
                >
                  {passage?.parshaTitleHe || parsha.hebrew}
                </Hebrew>
              ) : null}
              <p className="font-body text-[15px] font-medium italic leading-tight tracking-wide text-ink-muted">
                {passage?.parshaTitleEn || parsha.title}
              </p>
            </div>
          ) : null}

          {parsha || passage ? (
            <Link
              href={readUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-sage/30 bg-sage/5 px-3 py-1 font-label text-[9px] uppercase tracking-[0.18em] text-sage transition hover:border-sage/50 hover:bg-sage/10"
            >
              Read on Sefaria
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M4.25 10a.75.75 0 01.75-.75h9.546L10.72 5.427a.75.75 0 011.06-1.06l5 5a.75.75 0 010 1.06l-5 5a.75.75 0 11-1.06-1.06l3.826-3.823H5a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          ) : null}
        </div>
      </div>

      {passageLoading ? (
        <div
          className="mt-4 space-y-2 border-t border-ink/8 pt-4"
          aria-busy="true"
          aria-label="Loading weekly portion text"
        >
          <div className="h-4 w-full animate-pulse rounded bg-parchment-deep/50" />
          <div className="h-4 w-full animate-pulse rounded bg-parchment-deep/50" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-parchment-deep/60" />
        </div>
      ) : passage && hebrewReadingPlain ? (
        <div className="mt-4 border-t border-ink/10 pt-3">
          <div
            className={[
              "relative isolate overflow-hidden rounded-2xl",
              "border border-sage/35",
              "bg-gradient-to-br from-white/80 via-[rgb(252,250,246)]/92 to-teal-950/[0.04]",
              "shadow-[0_26px_60px_-18px_rgba(30,22,14,0.28),0_8px_24px_-8px_rgba(15,118,110,0.12),inset_0_1px_0_0_rgba(255,255,255,0.9)]",
              "backdrop-blur-[18px]",
              "ring-1 ring-teal-600/[0.14]",
              "translate-y-0 transition-[box-shadow,transform] duration-300 motion-reduce:transition-none",
              "hover:-translate-y-0.5 hover:shadow-[0_32px_72px_-20px_rgba(30,22,14,0.32),0_12px_28px_-8px_rgba(15,118,110,0.14),inset_0_1px_0_0_rgba(255,255,255,0.92)]",
              "motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-[0_26px_60px_-18px_rgba(30,22,14,0.28),0_8px_24px_-8px_rgba(15,118,110,0.12),inset_0_1px_0_0_rgba(255,255,255,0.9)]",
            ].join(" ")}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(118deg,rgb(20_184_166/0.09)_0%,transparent_38%,transparent_62%,rgb(34_197_94/0.06)_100%)] opacity-70"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-teal-400/45 to-transparent"
              aria-hidden
            />

            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-white/45 px-3 py-2.5 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => speak(hebrewReadingPlain, PARSHA_SPEECH_KEY)}
                  className={`flex h-9 items-center gap-2 rounded-full border border-ink/10 px-3 font-label text-[10px] uppercase tracking-[0.12em] shadow-[0_1px_2px_rgba(44,36,22,0.06)] transition ${
                    isParshaPlaying
                      ? "bg-teal-500/15 text-teal-800 ring-1 ring-teal-500/25"
                      : "bg-white/60 text-ink-muted hover:bg-teal-500/10 hover:text-teal-900"
                  }`}
                  aria-pressed={isParshaPlaying}
                  aria-label={
                    isParshaPlaying
                      ? "Stop reading"
                      : "Play Torah reading in Hebrew"
                  }
                >
                  {isParshaPlaying ? (
                    <StopIcon className="h-3.5 w-3.5" />
                  ) : (
                    <SpeakerIcon className="h-3.5 w-3.5" />
                  )}
                  {isParshaPlaying ? "Stop" : "Listen"}
                </button>
                {passage.ref ? (
                  <div className="flex flex-col items-end gap-0.5 text-right leading-tight">
                    <span
                      dir="rtl"
                      className="font-mono text-[9px] tracking-wide text-ink-muted/90"
                    >
                      {passage.ref}
                    </span>
                    {toHebrewRef(passage.ref) ? (
                      <Hebrew
                        as="span"
                        className="text-[11px] font-medium leading-tight text-sage/85"
                      >
                        {toHebrewRef(passage.ref)}
                      </Hebrew>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="border-b border-ink/8 bg-white/35 px-2 py-2 backdrop-blur-sm">
                <HebrewAudioControls
                  rate={rate}
                  setRate={setRate}
                  voices={voices}
                  selectedVoice={selectedVoice}
                  setSelectedVoice={setSelectedVoice}
                />
              </div>

              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-14 bg-gradient-to-b from-teal-600/12 to-transparent"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-14 bg-gradient-to-t from-teal-600/12 to-transparent"
                  aria-hidden
                />

                <div
                  ref={readingScrollRef}
                  onPointerMove={onReadingPanePointerMove}
                  onPointerLeave={onReadingPanePointerLeave}
                  className="h-[300px] overflow-y-auto overscroll-y-contain px-3 pb-3 pt-2 [scrollbar-color:rgb(44_36_22/0.22)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/22"
                >
                  <div className="divide-y divide-ink/[0.07]">
                    {passage.verses.map((verse, i) => {
                    const enGlow = hoveredVerseIndex === i;
                      return (
                        <div
                          key={`v-${i}`}
                          className="grid grid-cols-1 gap-x-5 gap-y-2 py-4 first:pt-2 last:pb-2 md:grid-cols-2 md:items-start md:gap-y-1 md:py-3"
                        >
                          <div
                            className="min-w-0 cursor-pointer outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-teal-600/30"
                            tabIndex={0}
                            onClick={() => setSelectedVerseIndex(i)}
                            onMouseEnter={() => setHoveredVerseIndex(i)}
                            onMouseLeave={() => setHoveredVerseIndex(null)}
                            onFocus={() => setHoveredVerseIndex(i)}
                            onBlur={() => setHoveredVerseIndex(null)}
                            aria-label={`Hebrew verse ${i + 1}`}
                          >
                            <Hebrew
                              as="p"
                              className="text-right text-[14px] font-medium leading-[1.65] tracking-wide text-ink sm:text-[15px]"
                            >
                              {stripNikkud(verse.he)}
                            </Hebrew>
                          </div>
                          <p
                            className={`parsha-verse-en min-w-0 text-left font-body text-[12px] leading-relaxed text-ink-muted sm:text-[13px] md:border-l md:border-ink/12 md:pl-5 ${
                              enGlow
                                ? "rounded-md bg-[rgba(250,236,200,0.42)] shadow-[inset_0_0_0_1px_rgba(184,140,48,0.28),0_0_20px_rgba(212,175,55,0.2),0_0_8px_rgba(180,130,40,0.14)]"
                                : ""
                            }`}
                          >
                            {verse.en}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : passageErr ? (
        <p className="mt-4 border-t border-ink/10 pt-4 text-[11px] text-ink-muted">
          {passageErr}
        </p>
      ) : null}

      <Hebrew
        as="p"
        className="mt-4 text-center text-lg font-medium text-ink-muted sm:text-xl"
      >
        בְּרוּכִים הַבָּאִים
      </Hebrew>
      {renderVerseModal()}
    </section>
  );
}
