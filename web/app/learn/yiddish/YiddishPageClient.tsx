"use client";

import Link from "next/link";
import { YIDDISH_SECTIONS } from "@/data/yiddish-course";
import {
  yiddishSectionUnlocked,
  yiddishSectionsDoneCount,
} from "@/lib/yiddish-progress";
import { useYiddishProgressSync } from "@/lib/use-yiddish-progress-sync";

export function YiddishPageClient() {
  const [progress] = useYiddishProgressSync();
  const done = yiddishSectionsDoneCount(progress);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
      <header className="mb-8">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Parallel track
        </p>
        <h1 className="mt-1 font-hebrew text-2xl text-ink">ייִדיש</h1>
        <p className="mt-2 text-sm text-ink-muted">
          A separate mini-course from Hebrew Alef–Dalet: own saves in this
          browser. Work through sections in order; each ends with an MCQ set
          (pass ~72% to mark complete).
        </p>
        <p className="mt-2 text-xs text-ink-faint">
          Progress:{" "}
          <strong className="text-ink">
            {done}/{YIDDISH_SECTIONS.length}
          </strong>{" "}
          sections.
        </p>
      </header>

      <ol className="space-y-3">
        {YIDDISH_SECTIONS.map((sec, idx) => {
          const open = yiddishSectionUnlocked(progress, sec.id);
          const complete = progress.completedSections[sec.id] === true;
          return (
            <li key={sec.id}>
              <div
                className={`rounded-2xl border p-4 ${
                  complete
                    ? "border-sage/35 bg-sage/5"
                    : open
                      ? "border-ink/12 bg-parchment-card/80"
                      : "border-ink/10 bg-parchment-deep/30 opacity-70"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      Section {idx + 1}
                    </p>
                    <h2 className="mt-1 font-label text-sm text-ink">
                      {sec.label}
                    </h2>
                    <p className="mt-1 text-xs text-ink-muted">{sec.blurb}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 font-label text-[9px] uppercase tracking-wide ${
                      complete
                        ? "bg-sage/20 text-sage"
                        : open
                          ? "bg-amber/15 text-amber"
                          : "bg-ink/10 text-ink-muted"
                    }`}
                  >
                    {complete ? "Done" : open ? "Open" : "Locked"}
                  </span>
                </div>
                {open ? (
                  <div className="mt-3">
                    <Link
                      href={`/learn/yiddish/${encodeURIComponent(sec.id)}`}
                      className="inline-block rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
                    >
                      {complete ? "Review section →" : "Open section →"}
                    </Link>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-ink-faint">
                    Finish the previous section first.
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-center text-xs text-ink-faint">
        <Link href="/learn" className="text-sage underline">
          ← Learn home
        </Link>
      </p>
    </div>
  );
}
