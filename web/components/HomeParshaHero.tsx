"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import type { ParshaSnapshot } from "@/lib/hebcal-parsha";
import {
  getHebrewDateLineLocal,
  getParshaSnapshotLocal,
} from "@/lib/parsha-local";

/**
 * Top “diary card” — weekly parsha + Hebrew date (computed locally; works offline).
 */
export function HomeParshaHero() {
  const [parsha, setParsha] = useState<ParshaSnapshot | null>(null);
  const [hebrewDate, setHebrewDate] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="surface-elevated overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            Today
          </p>
          <p className="mt-0.5 text-sm font-medium text-ink">{todayLabel}</p>
          {hebrewDate ? (
            <p className="mt-1 font-hebrew text-lg leading-snug text-sage sm:text-xl">
              {hebrewDate}
            </p>
          ) : null}
        </div>
        {parsha ? (
          <Link
            href={parsha.readUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-label text-[9px] uppercase tracking-wide text-sage underline underline-offset-2"
          >
            Read →
          </Link>
        ) : null}
      </div>

      <div className="mt-4 border-t border-ink/10 pt-4">
        <p className="font-label text-[9px] uppercase tracking-[0.15em] text-ink-faint">
          Parashat hashavua
        </p>
        {loading ? (
          <p className="mt-2 h-6 w-48 animate-pulse rounded bg-parchment-deep/60 text-sm" />
        ) : err ? (
          <p className="mt-2 text-sm text-rust">{err}</p>
        ) : !parsha && hebrewDate ? (
          <p className="mt-2 text-xs text-ink-muted">
            Torah portion unavailable right now. Hebrew date loaded above; try
            again later or open{" "}
            <a
              href="https://www.sefaria.org/calendars"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage underline"
            >
              Sefaria calendars
            </a>
            .
          </p>
        ) : parsha ? (
          <>
            <p className="mt-1 text-lg font-semibold leading-snug text-ink">
              {parsha.title}
            </p>
            {parsha.hebrew ? (
              <Hebrew
                as="p"
                className="mt-1 text-xl font-medium leading-snug text-ink sm:text-2xl"
              >
                {parsha.hebrew}
              </Hebrew>
            ) : null}
            <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">
              Portion for the approaching Shabbat (Diaspora schedule), computed
              on your device. Tap Read for Sefaria search or full text when
              online.
            </p>
          </>
        ) : null}
      </div>

      <Hebrew
        as="p"
        className="mt-4 text-center text-lg font-medium text-ink-muted sm:text-xl"
      >
        בְּרוּכִים הַבָּאִים
      </Hebrew>
    </section>
  );
}
