"use client";

import { useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import { SaveWordButton } from "@/components/SaveWordButton";
import { speakHebrew } from "@/lib/speech-hebrew";

const PUNCT_RE = /[.,!?;:'"־–—(){}[\]׃]/g;

function cleanToken(token: string): string {
  return token.replace(PUNCT_RE, "");
}

function tokenize(he: string): string[] {
  return he.trim().split(/\s+/).filter(Boolean);
}

export function HebrewTapText({
  text,
  className = "",
  glossByWord,
  showSaveWord = false,
}: {
  text: string;
  className?: string;
  glossByWord?: Record<string, string>;
  /** When true, offers “Save word” for the tapped token (uses optional gloss as English hint). */
  showSaveWord?: boolean;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const tokens = useMemo(() => tokenize(text), [text]);
  const reveal = useMemo(() => {
    if (picked == null) return null;
    const token = tokens[picked];
    if (!token) return null;
    const clean = cleanToken(token);
    const gloss = glossByWord?.[clean];
    return { clean, gloss };
  }, [picked, tokens, glossByWord]);

  return (
    <div>
      <Hebrew as="div" className={`text-right leading-relaxed ${className}`.trim()}>
        {tokens.map((w, i) => (
          <button
            key={`${i}-${w}`}
            type="button"
            onClick={() => {
              const clean = cleanToken(w);
              if (!clean) return;
              speakHebrew(clean);
              setPicked(i);
            }}
            className={`mx-0.5 inline-block border-b-2 border-transparent transition hover:border-amber ${
              picked === i ? "text-amber" : ""
            }`}
          >
            {w}
          </button>
        ))}
      </Hebrew>
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
        ) : (
          <span>Tap any word to hear audio.</span>
        )}
      </div>
    </div>
  );
}
