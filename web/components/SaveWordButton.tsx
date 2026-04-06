"use client";

/**
 * Bookmark control for a Hebrew headword (+ optional gloss fields).
 *
 * Security: toggles localStorage via `saved-words` helpers only; user text is
 * rendered as React children/text — never interpret as HTML.
 */

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
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
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
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
      setHint(
        isSignedIn
          ? "Saved to Library — synced to your account (when online)."
          : "Saved on this device — open Library anytime here.",
      );
      hintTimeoutRef.current = window.setTimeout(() => {
        hintTimeoutRef.current = null;
        setHint((h) =>
          h === "Saved to Library — synced to your account (when online)." ||
          h === "Saved on this device — open Library anytime here."
            ? null
            : h,
        );
      }, 2800);
    }
  }, [identity, isSignedIn]);

  if (!identity.he) return null;

  const label = saved ? "Remove word from saved list" : "Save word to Library list";
  const isCompact = variant === "compact";

  const showGuestLibraryHint =
    authLoaded && !isSignedIn && !saved && identity.he;

  return (
    <div className={`inline-flex w-full max-w-[18rem] flex-col items-end gap-2 ${className}`.trim()}>
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
          className="w-full text-right font-body text-[10px] leading-snug text-sage"
          role="status"
          aria-live="polite"
        >
          {hint}
        </p>
      ) : null}
      {showGuestLibraryHint ? (
        <div
          className="w-full rounded-2xl border border-sage/25 bg-gradient-to-br from-sage/8 to-parchment-deep/40 p-3 text-left shadow-sm"
          role="note"
        >
          <p className="font-label text-[8px] uppercase tracking-[0.14em] text-sage/90">
            Library and progress
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-muted">
            Save words to your{" "}
            <strong className="font-medium text-ink">Library</strong> to track
            what you&apos;re studying with this course. Create a free account so
            bookmarks can sync across devices and stay with your profile.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Link
              href="/sign-up"
              className="inline-flex items-center rounded-lg bg-sage px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.12em] text-white transition hover:brightness-110"
            >
              Sign up free
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center rounded-lg border border-ink/15 bg-parchment-card/90 px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.12em] text-ink-muted transition hover:border-sage/35 hover:text-ink"
            >
              Sign in
            </Link>
          </div>
        </div>
      ) : null}
      {authLoaded && isSignedIn && saved ? (
        <p className="w-full text-right text-[10px] leading-snug text-ink-faint">
          View and edit saved words under{" "}
          <Link href="/library" className="text-sage underline hover:text-sage/90">
            Library
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
