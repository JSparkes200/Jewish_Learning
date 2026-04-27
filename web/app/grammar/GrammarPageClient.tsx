"use client";

import { useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import {
  GRAMMAR_SECTIONS,
  type GrammarSection,
  type GrammarTable,
} from "@/data/grammar-reference";

// ─── icons ────────────────────────────────────────────────────────────────────

function ChevronDownIcon({
  open,
  className = "h-4 w-4",
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── verb table ───────────────────────────────────────────────────────────────

function VerbTable({ table }: { table: GrammarTable }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-ink/10">
      <div className="border-b border-ink/10 bg-parchment-deep/40 px-3 py-2">
        <p className="font-label text-[10px] uppercase tracking-wide text-ink-muted">
          {table.title}
        </p>
        {table.subtitle ? (
          <p className="mt-0.5 font-hebrew text-sm text-ink-faint">
            {table.subtitle}
          </p>
        ) : null}
      </div>
      <div className="divide-y divide-ink/6">
        {table.rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1.4fr_1fr] items-baseline gap-2 px-3 py-2 hover:bg-parchment-deep/20"
          >
            <Hebrew className="text-xs text-ink-muted">{row.pronoun}</Hebrew>
            <Hebrew className="text-base font-medium text-ink">
              {row.form}
            </Hebrew>
            <div>
              <span className="font-label text-[10px] text-ink-faint">
                {row.transliteration}
              </span>
              <span className="ml-2 text-xs text-ink-muted">
                {row.pronounEn}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── collapsible section ─────────────────────────────────────────────────────

function SectionCard({ section }: { section: GrammarSection }) {
  const [open, setOpen] = useState(section.id === "verbs");

  return (
    <div className="surface-elevated overflow-hidden">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-parchment-deep/20"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-semibold text-ink">
              {section.title}
            </h2>
            {section.heTitle ? (
              <Hebrew className="text-sm text-ink-faint">
                {section.heTitle}
              </Hebrew>
            ) : null}
          </div>
          {!open ? (
            <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">
              {section.intro}
            </p>
          ) : null}
        </div>
        <ChevronDownIcon open={open} className="h-5 w-5 shrink-0 text-ink-faint" />
      </button>

      {open ? (
        <div className="border-t border-ink/8 px-5 pb-5 pt-4">
          <p className="text-sm leading-relaxed text-ink-muted">
            {section.intro}
          </p>

          {/* Verb tables */}
          {section.tables?.map((table) => (
            <VerbTable key={table.id} table={table} />
          ))}

          {/* List items */}
          {section.items && section.items.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {section.items.map((item, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-ink/8 bg-parchment-deep/20 px-3 py-2.5"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <Hebrew className="text-base font-semibold text-ink">
                      {item.hebrew}
                    </Hebrew>
                    <span className="font-label text-[10px] text-ink-faint">
                      {item.transliteration}
                    </span>
                    <span className="text-xs text-ink-muted">
                      {item.english}
                    </span>
                  </div>
                  {item.note ? (
                    <p className="mt-1 text-[11px] leading-snug text-ink-faint">
                      {item.note}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function GrammarPageClient() {
  return (
    <div className="mx-auto max-w-lg space-y-4 pb-8">
      {/* Page header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="section-label">Reference</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">
            Grammar
          </h1>
          <Hebrew as="p" className="mt-1 text-lg text-ink">
            דִּקְדּוּק
          </Hebrew>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            Quick-access tables for verb conjugations, noun patterns, particles,
            and more. Open any section while you study — tap it again to close.
          </p>
        </div>
      </div>

      {/* Sections */}
      {GRAMMAR_SECTIONS.map((section) => (
        <SectionCard key={section.id} section={section} />
      ))}

      {/* Footer note */}
      <p className="pt-2 text-center text-[11px] text-ink-faint">
        Paradigm root: כ.ת.ב (write) · Modern Israeli pronunciation
      </p>
    </div>
  );
}
