"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Hebrew } from "@/components/Hebrew";
import { HebrewAudioControls } from "@/components/HebrewAudioControls";
import { SaveWordButton } from "@/components/SaveWordButton";
import { useHebrewSpeech } from "@/hooks/useHebrewSpeech";
import { stripNikkud } from "@/lib/hebrew-nikkud";

const PUNCT_RE = /[.,!?;:'"־–—(){}[\]׃]/g;

function cleanToken(token: string): string {
  return token.replace(PUNCT_RE, "");
}

function tokenizeWords(line: string): string[] {
  return line.trim().split(/\s+/).filter(Boolean);
}

/** Split on sentence end + following whitespace; keep closing punctuation on the segment. */
function splitSentences(paragraph: string): string[] {
  return paragraph
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function zipAlignedPhrases(he: string, en: string): { he: string; en: string }[] {
  const hs = splitSentences(he);
  const es = splitSentences(en);
  if (hs.length === es.length && hs.length > 0) {
    return hs.map((h, i) => ({ he: h, en: es[i] ?? "" }));
  }
  return [{ he: he.trim(), en: en.trim() }];
}

function mapHeWordToEnIndex(
  heIdx: number,
  heCount: number,
  enCount: number,
): number {
  if (enCount <= 1) return 0;
  if (heCount <= 1) return 0;
  return Math.min(
    enCount - 1,
    Math.round((heIdx / (heCount - 1)) * (enCount - 1)),
  );
}

type Props = {
  he: string;
  en: string;
  showNikkud: boolean;
  glossByWord?: Record<string, string>;
  showSaveWord?: boolean;
  /** Larger body text (lesson story). */
  heClassName?: string;
  enClassName?: string;
};

export function BilingualReadAloudPassage({
  he,
  en,
  showNikkud,
  glossByWord,
  showSaveWord = false,
  heClassName = "text-lg text-ink",
  enClassName = "text-sm italic leading-relaxed text-ink-muted",
}: Props) {
  const heDisplay = showNikkud ? he : stripNikkud(he);
  const phrases = useMemo(() => zipAlignedPhrases(heDisplay, en), [heDisplay, en]);

  const heTokensByPhrase = useMemo(
    () => phrases.map((p) => tokenizeWords(p.he)),
    [phrases],
  );
  const enTokensByPhrase = useMemo(
    () => phrases.map((p) => tokenizeWords(p.en)),
    [phrases],
  );

  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    stop: stopHook,
  } = useHebrewSpeech();

  const [playing, setPlaying] = useState(false);
  const [activePhrase, setActivePhrase] = useState<number | null>(null);
  const [activeHeWord, setActiveHeWord] = useState<number | null>(null);
  const [activeEnWord, setActiveEnWord] = useState<number | null>(null);
  const [picked, setPicked] = useState<{
    pi: number;
    wi: number;
  } | null>(null);

  const runGen = useRef(0);
  const playingRef = useRef(false);

  const stopAll = useCallback(() => {
    runGen.current += 1;
    playingRef.current = false;
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
    stopHook();
    setPlaying(false);
    setActivePhrase(null);
    setActiveHeWord(null);
    setActiveEnWord(null);
  }, [stopHook]);

  useEffect(() => () => stopAll(), [stopAll]);

  const speakHebrewWord = useCallback(
    (word: string): Promise<void> => {
      return new Promise((resolve) => {
        if (typeof window === "undefined") {
          resolve();
          return;
        }
        const w = word.trim();
        if (!w) {
          resolve();
          return;
        }
        const u = new SpeechSynthesisUtterance(cleanToken(w) || w);
        u.lang = "he-IL";
        u.rate = rate;
        if (selectedVoice) u.voice = selectedVoice.voice;
        u.addEventListener("end", () => resolve(), { once: true });
        u.addEventListener("error", () => resolve(), { once: true });
        window.speechSynthesis.speak(u);
      });
    },
    [rate, selectedVoice],
  );

  const playFrom = useCallback(
    async (startPhrase: number, startWord: number) => {
      const gen = ++runGen.current;
      playingRef.current = true;
      setPlaying(true);

      for (let pi = startPhrase; pi < phrases.length; pi++) {
        if (runGen.current !== gen || !playingRef.current) break;
        const heWords = heTokensByPhrase[pi] ?? [];
        const enWords = enTokensByPhrase[pi] ?? [];
        const enN = enWords.length;
        const heN = heWords.length;
        let wStart = pi === startPhrase ? startWord : 0;
        if (wStart >= heWords.length) continue;

        for (let wi = wStart; wi < heWords.length; wi++) {
          if (runGen.current !== gen || !playingRef.current) break;
          const enI = mapHeWordToEnIndex(wi, heN, enN);
          setActivePhrase(pi);
          setActiveHeWord(wi);
          setActiveEnWord(enI);
          await speakHebrewWord(heWords[wi] ?? "");
        }
      }

      if (runGen.current === gen) {
        playingRef.current = false;
        setPlaying(false);
        setActivePhrase(null);
        setActiveHeWord(null);
        setActiveEnWord(null);
      }
    },
    [phrases.length, heTokensByPhrase, enTokensByPhrase, speakHebrewWord],
  );

  const onPlayToggle = useCallback(() => {
    if (playing) {
      stopAll();
      return;
    }
    void playFrom(0, 0);
  }, [playing, playFrom, stopAll]);

  const onTapHebrewWord = useCallback(
    async (pi: number, wi: number) => {
      const w = heTokensByPhrase[pi]?.[wi];
      if (!w) return;
      const clean = cleanToken(w);
      setPicked({ pi, wi });
      runGen.current += 1;
      if (typeof window !== "undefined") window.speechSynthesis.cancel();
      setPlaying(false);

      const enWords = enTokensByPhrase[pi] ?? [];
      const heWords = heTokensByPhrase[pi] ?? [];
      const enI = mapHeWordToEnIndex(wi, heWords.length, enWords.length);
      setActivePhrase(pi);
      setActiveHeWord(wi);
      setActiveEnWord(enI);
      await speakHebrewWord(w);
      setActivePhrase(null);
      setActiveHeWord(null);
      setActiveEnWord(null);
    },
    [heTokensByPhrase, enTokensByPhrase, speakHebrewWord],
  );

  const reveal = useMemo(() => {
    if (!picked) return null;
    const w = heTokensByPhrase[picked.pi]?.[picked.wi];
    if (!w) return null;
    const c = cleanToken(w);
    const gloss = glossByWord?.[c];
    return { clean: c, gloss };
  }, [picked, heTokensByPhrase, glossByWord]);

  const playLabel = playing ? "Stop" : "Play read-aloud";

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPlayToggle}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-label text-[10px] uppercase tracking-wide transition ${
            playing
              ? "border-sage/40 bg-sage/15 text-sage"
              : "border-ink/15 text-ink-muted hover:border-sage/30 hover:bg-sage/5 hover:text-sage"
          }`}
          aria-pressed={playing}
        >
          <svg
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5"
            fill="currentColor"
            aria-hidden
          >
            {playing ? (
              <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
            ) : (
              <path d="M8 5v10l8-5-8-5z" />
            )}
          </svg>
          {playLabel}
        </button>
        <span className="font-label text-[9px] text-ink-faint">
          Hebrew audio · matched English follows
        </span>
      </div>

      {voices.length > 0 && selectedVoice ? (
        <div className="-mx-1 mb-3 overflow-hidden rounded-xl border border-ink/10">
          <HebrewAudioControls
            rate={rate}
            setRate={setRate}
            voices={voices}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
          />
        </div>
      ) : (
        <p className="mb-3 font-label text-[9px] text-amber-800/90">
          Add a Hebrew voice in your system/browser settings for clearer audio.
        </p>
      )}

      <Hebrew
        as="div"
        className={`text-right leading-relaxed [word-break:normal] ${heClassName}`.trim()}
      >
        {phrases.map((_, pi) => (
          <span key={`h-${pi}`} className="inline">
            {(heTokensByPhrase[pi] ?? []).map((w, wi) => (
              <span key={`${pi}-${wi}-${w}`} className="inline">
                {wi > 0 ? "\u00A0" : null}
                <button
                  type="button"
                  onClick={() => onTapHebrewWord(pi, wi)}
                  className={`inline-block rounded px-0.5 transition ${
                    activePhrase === pi && activeHeWord === wi
                      ? "bg-sage/30 font-medium text-ink ring-1 ring-sage/35"
                      : picked?.pi === pi && picked?.wi === wi
                        ? "text-amber"
                        : "border-b-2 border-transparent hover:border-amber"
                  }`}
                >
                  {w}
                </button>
              </span>
            ))}
            {pi < phrases.length - 1 ? " " : null}
          </span>
        ))}
      </Hebrew>

      <div
        dir="ltr"
        className={`mt-4 border-t border-ink/10 pt-4 text-left ${enClassName}`.trim()}
      >
        {phrases.map((_, pi) => (
          <span key={`e-${pi}`} className="inline">
            {(enTokensByPhrase[pi] ?? []).map((w, wi) => {
              const on =
                activePhrase === pi &&
                activeEnWord !== null &&
                activeEnWord === wi;
              return (
                <span key={`${pi}-${wi}-${w}`} className="inline">
                  {wi > 0 ? "\u00A0" : null}
                  <span
                    className={`inline-block rounded px-0.5 transition ${
                      on
                        ? "bg-sage/30 font-medium text-ink not-italic ring-1 ring-sage/35"
                        : ""
                    }`}
                  >
                    {w}
                  </span>
                </span>
              );
            })}
            {pi < phrases.length - 1 ? " " : null}
          </span>
        ))}
      </div>

      <div className="mt-2 min-h-[34px] space-y-2 text-xs text-ink-muted">
        {reveal ? (
          <>
            <span>
              <strong className="text-ink">{reveal.clean}</strong>
              {reveal.gloss ? <span> — {reveal.gloss}</span> : null}
            </span>
            {showSaveWord ? (
              <div className="flex justify-end pt-1">
                <SaveWordButton
                  variant="compact"
                  he={reveal.clean}
                  en={reveal.gloss}
                />
              </div>
            ) : null}
          </>
        ) : showSaveWord ? (
          <span className="block text-[11px] leading-relaxed text-ink-faint">
            Tap a word for audio, then bookmark it for your{" "}
            <Link href="/library" className="text-sage underline hover:text-sage/90">
              Library
            </Link>
            . Use Play for line-by-line read-aloud with highlights.
          </span>
        ) : (
          <span className="text-[11px] text-ink-faint">
            Tap any Hebrew word to hear it. Play runs the whole passage in order.
          </span>
        )}
      </div>
    </div>
  );
}
