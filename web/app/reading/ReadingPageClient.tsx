"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import { ReadingTapCarousel } from "@/components/ReadingTapCarousel";
import { READING_HUB_ENTRIES } from "@/data/reading-hub";
import {
  LEARN_PROGRESS_EVENT,
  createEmptyLearnProgressState,
  loadLearnProgress,
  type LearnProgressState,
} from "@/lib/learn-progress";

export function ReadingPageClient() {
  const [progress, setProgress] = useState<LearnProgressState>(() =>
    createEmptyLearnProgressState(),
  );

  const sync = useCallback(() => {
    setProgress(loadLearnProgress());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(LEARN_PROGRESS_EVENT, sync);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, sync);
  }, [sync]);

  const active = progress.activeLevel;

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <nav className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.15em] text-ink-muted">
        <Link href="/" className="text-sage hover:underline">
          Home
        </Link>
        <span className="text-ink-faint">/</span>
        <span className="text-ink">Reading</span>
      </nav>

      <header>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Reading passages
        </p>
        <Hebrew
          as="h1"
          className="mt-2 block text-3xl leading-snug text-ink sm:text-4xl"
        >
          קְרִיאָה
        </Hebrew>
        <p className="mt-2 text-sm italic text-ink-muted">
          Course stories, guided Aleph reading, saved library snippets, and the
          same combined carousel as legacy (
          <code className="text-[11px]">JT</code> Jewish Texts,{" "}
          <code className="text-[11px]">RD</code> course readings, library
          saves) — word tap, listen, notes, Sefaria links, and RD quizzes.
        </p>
      </header>

      <ReadingTapCarousel activeLevel={active} />

      <p className="rounded-xl border border-ink/10 bg-parchment-card/50 px-3 py-2 text-[11px] text-ink-muted">
        Active level for unlock hints:{" "}
        <strong className="text-ink">{active}</strong> (change on{" "}
        <Link href="/learn" className="text-sage underline">
          Learn home
        </Link>
        ). You can still open any link below.
      </p>

      <ul className="space-y-3">
        {READING_HUB_ENTRIES.map((e) => {
          const later = e.minLevel > active;
          return (
            <li key={e.id}>
              <Link
                href={e.href}
                className={`block rounded-2xl border bg-parchment-card/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${e.borderClass} ${
                  later ? "opacity-85" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden>
                    {e.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-label text-[11px] uppercase tracking-wide text-ink">
                        {e.label}
                      </span>
                      <span className="rounded-md bg-parchment-deep/60 px-2 py-0.5 font-mono text-[9px] text-ink-muted">
                        L{e.minLevel}+
                      </span>
                      {later ? (
                        <span className="text-[9px] uppercase tracking-wide text-amber">
                          Later track
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">{e.description}</p>
                  </div>
                  <span className="shrink-0 text-rust" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="rounded-2xl border border-ink/10 bg-parchment-deep/25 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Comprehension drills
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Longer guided readings with questions live in{" "}
          <strong className="text-ink">Learn</strong> as marked comprehension
          sections (ported from legacy).
        </p>
        <Link
          href="/learn"
          className="mt-3 inline-block font-label text-[10px] uppercase tracking-wide text-sage underline"
        >
          Open Learn →
        </Link>
      </section>

      <p className="flex flex-wrap justify-center gap-4 border-t border-ink/10 pt-4 text-[11px]">
        <Link href="/study" className="text-sage underline">
          Study
        </Link>
        <Link href="/numbers" className="text-sage underline">
          Numbers
        </Link>
        <Link href="/progress" className="text-sage underline">
          Progress
        </Link>
      </p>
    </div>
  );
}
