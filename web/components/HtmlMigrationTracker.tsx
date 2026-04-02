"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  HTML_MIGRATION_PHASE_LABELS,
  computeHtmlFullMigration,
  htmlMigrationStatusLabel,
  recommendedNextWorkstreams,
  type HtmlMigrationPhase,
  type HtmlMigrationStatus,
} from "@/lib/html-full-migration";

function statusStyles(status: HtmlMigrationStatus): string {
  switch (status) {
    case "done":
      return "border-sage/40 bg-sage/15 text-sage";
    case "partial":
      return "border-amber/40 bg-amber/15 text-amber";
    case "not_started":
      return "border-ink/15 bg-parchment-deep/40 text-ink-muted";
    default:
      return "border-ink/15 text-ink-muted";
  }
}

const PHASE_ORDER: HtmlMigrationPhase[] = [
  "foundation",
  "learner",
  "engine",
  "platform",
];

type Props = {
  variant?: "compact" | "full";
};

export function HtmlMigrationTracker({ variant = "full" }: Props) {
  const { percent, earned, max, rows, byPhase } = useMemo(
    () => computeHtmlFullMigration(),
    [],
  );
  const nextUp = useMemo(() => recommendedNextWorkstreams(5), []);

  if (variant === "compact") {
    return (
      <div className="rounded-2xl border border-ink/10 border-t-burg/25 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Full HTML migration
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          1:1 scope vs the old single-file app — workstreams, not the shorter
          product checklist on Developer.
        </p>
        <p className="mt-3 text-2xl font-semibold tabular-nums text-ink">
          {percent}
          <span className="text-lg font-normal text-ink-muted">%</span>
        </p>
        <p className="text-[11px] text-ink-muted">
          {earned} / {max} weighted points
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-parchment-deep/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-burg/80 via-rust/80 to-amber/70 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <Link
          href="/migration"
          className="mt-4 inline-block font-label text-[10px] uppercase tracking-wide text-sage hover:underline"
        >
          Roadmap &amp; breakdown →
        </Link>
      </div>
    );
  }

  return (
    <div
      id="html-migration"
      className="scroll-mt-24 space-y-8 rounded-2xl border border-ink/12 bg-parchment-card/80 p-5"
    >
      <header>
        <h2 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          HTML → Next migration (full scope)
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          This tracker maps major subsystems in{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            hebrew-v8.2.html
          </code>{" "}
          (routes, corpus, auth, tools). It is intentionally separate from the
          shorter{" "}
          <Link href="/developer#legacy-parity" className="text-sage underline">
            product checklist
          </Link>{" "}
          on Developer. Update statuses in{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            lib/html-full-migration.ts
          </code>{" "}
          as each slice ships.
        </p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-4xl font-semibold tabular-nums text-ink">
              {percent}
              <span className="text-2xl font-normal text-ink-muted">%</span>
            </p>
            <p className="text-[11px] text-ink-muted">
              {earned} / {max} points · done = full weight · partial = half ·
              not started = 0
            </p>
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-parchment-deep/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-burg/70 via-rust/70 to-sage/80 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </header>

      <section className="rounded-xl border border-sage/20 bg-sage/5 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.15em] text-sage">
          Suggested next slices
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Ordered by implementation sequence hint (`suggestedOrder` in source).
          Finish one workstream per PR where possible.
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink">
          {nextUp.map((w) => (
            <li key={w.id}>
              <span className="font-medium">{w.label}</span>
              <span className="text-ink-muted"> — </span>
              <span className="text-xs text-ink-muted">{w.legacyRef}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          By phase
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {PHASE_ORDER.map((p) => {
            const meta = HTML_MIGRATION_PHASE_LABELS[p];
            const b = byPhase[p];
            return (
              <div
                key={p}
                className="rounded-xl border border-ink/10 bg-parchment-deep/30 p-3"
              >
                <p className="font-label text-[10px] uppercase tracking-wide text-ink">
                  {meta.title}
                </p>
                <p className="mt-1 text-[11px] text-ink-muted">{meta.blurb}</p>
                <p className="mt-2 text-lg font-semibold tabular-nums text-ink">
                  {b.percent}
                  <span className="text-sm font-normal text-ink-muted">%</span>
                  <span className="ml-2 text-[10px] font-normal text-ink-faint">
                    ({b.earned}/{b.max} pts)
                  </span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-parchment-deep/80">
                  <div
                    className="h-full rounded-full bg-sage/70"
                    style={{ width: `${b.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          All workstreams
        </p>
        <ul className="mt-4 space-y-4">
          {PHASE_ORDER.map((phase) => (
            <li key={phase}>
              <p className="mb-2 font-label text-[9px] uppercase tracking-[0.2em] text-burg/80">
                {HTML_MIGRATION_PHASE_LABELS[phase].title}
              </p>
              <ul className="space-y-2">
                {rows
                  .filter((r) => r.phase === phase)
                  .map((row) => (
                    <li
                      key={row.id}
                      className="rounded-lg border border-ink/8 bg-parchment-deep/25 px-3 py-2.5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-ink">
                            {row.label}
                          </p>
                          <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                            {row.legacyRef}
                          </p>
                          <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                            {row.detail}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span
                            className={`rounded-md border px-2 py-0.5 font-label text-[9px] uppercase tracking-wide ${statusStyles(row.status)}`}
                          >
                            {htmlMigrationStatusLabel(row.status)}
                          </span>
                          <span className="font-mono text-[10px] text-ink-faint">
                            {row.earned}/{row.weight}
                          </span>
                          <span className="text-[9px] text-ink-faint">
                            order {row.suggestedOrder}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
