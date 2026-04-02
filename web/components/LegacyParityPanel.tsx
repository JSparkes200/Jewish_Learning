"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  computeLegacyParity,
  legacyParityStatusLabel,
  type LegacyParityStatus,
} from "@/lib/legacy-parity";

function statusStyles(status: LegacyParityStatus): string {
  switch (status) {
    case "done":
      return "border-sage/40 bg-sage/15 text-sage";
    case "partial":
      return "border-amber/40 bg-amber/15 text-amber";
    case "planned":
      return "border-ink/15 bg-parchment-deep/40 text-ink-muted";
    default:
      return "border-ink/15 text-ink-muted";
  }
}

type Props = {
  variant?: "compact" | "full";
};

export function LegacyParityPanel({ variant = "full" }: Props) {
  const { percent, earned, max, rows } = useMemo(
    () => computeLegacyParity(),
    [],
  );

  if (variant === "compact") {
    return (
      <div className="rounded-2xl border border-ink/10 border-t-sage/25 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Product checklist
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Maintainer-only weighted score vs the old single-file app. Full
          workstream list:{" "}
          <Link href="/migration" className="text-sage hover:underline">
            Migration roadmap
          </Link>
          .
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
            className="h-full rounded-full bg-gradient-to-r from-sage to-sage/80 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <Link
          href="/developer#legacy-parity"
          className="mt-4 inline-block font-label text-[10px] uppercase tracking-wide text-sage hover:underline"
        >
          Full breakdown →
        </Link>
      </div>
    );
  }

  return (
    <div
      id="legacy-parity"
      className="scroll-mt-24 rounded-xl border border-ink/12 bg-parchment-card/80 p-4"
    >
      <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        Product checklist (weighted)
      </h3>
      <p className="mt-2 text-xs text-ink-muted">
        Not shown on Progress — edit items in{" "}
        <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
          lib/legacy-parity.ts
        </code>
        . The{" "}
        <Link href="/migration" className="text-sage hover:underline">
          migration roadmap
        </Link>{" "}
        tracks the larger HTML workstreams (
        <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
          lib/html-full-migration.ts
        </code>
        ).
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-semibold tabular-nums text-ink">
            {percent}
            <span className="text-xl font-normal text-ink-muted">%</span>
          </p>
          <p className="text-[11px] text-ink-muted">
            {earned} / {max} points · done = full weight, partial = half,
            planned = 0
          </p>
        </div>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-parchment-deep/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sage via-amber/90 to-sage/70"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ul className="mt-5 space-y-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-ink/8 bg-parchment-deep/25 px-3 py-2"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{row.label}</p>
                {row.detail ? (
                  <p className="mt-0.5 text-[11px] text-ink-muted">
                    {row.detail}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span
                  className={`rounded-md border px-2 py-0.5 font-label text-[9px] uppercase tracking-wide ${statusStyles(row.status)}`}
                >
                  {legacyParityStatusLabel(row.status)}
                </span>
                <span className="font-mono text-[10px] text-ink-faint">
                  {row.earned}/{row.weight}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
