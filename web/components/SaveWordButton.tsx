"use client";

/**
 * Bookmark control for a Hebrew headword (+ optional gloss fields).
 *
 * Security: toggles localStorage via `saved-words` helpers only; user text is
 * rendered as React children/text — never interpret as HTML.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  isIdentitySaved,
  loadSavedWords,
  MAX_SAVED_WORDS,
  SAVED_WORDS_EVENT,
  toggleSavedWordIdentity,
  clampWordField,
} from "@/lib/saved-words";

type SaveWordButtonProps = {
  /** Hebrew lemma (nikkud allowed). */
  he: string;
  translit?: string;
  /** English gloss or MCQ answer line — included in bookmark identity. */
  en?: string;
  colloquial?: string;
  /** `compact`: icon-first chip for drill headers. `default`: labeled control. */
  variant?: "default" | "compact";
  className?: string;
};

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.75}
      className="h-[1.15em] w-[1.15em] shrink-0"
      aria-hidden
    >
      {filled ? (
        <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5v15.25l-6-3.5-6 3.5V4.5Z" />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5v15.25l-6-3.5-6 3.5V4.5Z"
        />
      )}
    </svg>
  );
}

export function SaveWordButton({
  he,
  translit,
  en,
  colloquial,
  variant = "default",
  className = "",
}: SaveWordButtonProps) {
  const identity = useMemo(() => {
    const h = clampWordField(he);
    return {
      he: h,
      translit: translit ? clampWordField(translit) : undefined,
      en: en ? clampWordField(en) : undefined,
      colloquial: colloquial ? clampWordField(colloquial) : undefined,
    };
  }, [he, translit, en, colloquial]);

  const [saved, setSaved] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  /** DOM timers are `number` in browsers; avoid `NodeJS.Timeout` from Node typings. */
  const hintTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (hintTimeoutRef.current != null) {
        window.clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = null;
      }
    },
    [],
  );

  const sync = useCallback(() => {
    if (!identity.he) {
      setSaved(false);
      return;
    }
    setSaved(
      isIdentitySaved(loadSavedWords(), {
        he: identity.he,
        translit: identity.translit,
        en: identity.en,
      }),
    );
  }, [identity.he, identity.translit, identity.en]);

  useEffect(() => {
    sync();
  }, [sync]);

  useEffect(() => {
    const onEvt = () => sync();
    window.addEventListener(SAVED_WORDS_EVENT, onEvt);
    return () => window.removeEventListener(SAVED_WORDS_EVENT, onEvt);
  }, [sync]);

  const onClick = useCallback(() => {
    if (hintTimeoutRef.current != null) {
      window.clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    setHint(null);
    if (!identity.he) return;
    const r = toggleSavedWordIdentity({
      he: identity.he,
      translit: identity.translit,
      en: identity.en,
      colloquial: identity.colloquial,
    });
    setSaved(r.saved);
    if (r.atCapacity) {
      setHint(`List full (${MAX_SAVED_WORDS}). Remove one in Library.`);
      return;
    }
    if (r.saved) {
      setHint("Saved to Library");
      hintTimeoutRef.current = window.setTimeout(() => {
        hintTimeoutRef.current = null;
        setHint((h) => (h === "Saved to Library" ? null : h));
      }, 2200);
    }
  }, [identity]);

  if (!identity.he) return null;

  const label = saved ? "Remove word from saved list" : "Save word to Library list";
  const isCompact = variant === "compact";

  return (
    <div className={`inline-flex flex-col items-end gap-0.5 ${className}`.trim()}>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={label}
        title={saved ? "Remove from saved words" : "Save word — view in Library"}
        className={`inline-flex items-center gap-2 rounded-xl border font-label uppercase tracking-[0.12em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-parchment-card ${
          saved
            ? "border-sage/50 bg-sage/15 text-sage hover:bg-sage/20"
            : "border-ink/12 bg-parchment-deep/25 text-ink-muted hover:border-sage/35 hover:bg-parchment-deep/45 hover:text-ink"
        } ${
          isCompact
            ? "px-2.5 py-1.5 text-[9px]"
            : "px-3 py-2 text-[10px]"
        }`}
      >
        <BookmarkIcon filled={saved} />
        {!isCompact ? (
          <span>{saved ? "Saved" : "Save word"}</span>
        ) : null}
      </button>
      {hint ? (
        <p
          className="max-w-[14rem] text-right font-body text-[10px] text-sage"
          role="status"
          aria-live="polite"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
