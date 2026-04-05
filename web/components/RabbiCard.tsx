"use client";

import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Hebrew } from "@/components/Hebrew";
import type { RabbiLevel } from "@/lib/rabbi-types";

/** Payload registered from drills and passed into the shell modal. */
export type RabbiAskPayload = {
  targetHe: string;
  learnerLevel: RabbiLevel;
  translit?: string;
  meaningEn?: string;
  ragContext?: string;
};

export type RabbiCardProps = RabbiAskPayload & {
  className?: string;
  /** Use tighter padding when nested inside another card */
  embedded?: boolean;
  /**
   * `inline` — expand/collapse in place (lesson cards).
   * `sheet` — used inside the app modal; fetches on open / when props change.
   */
  variant?: "inline" | "sheet";
};

type ApiOk = { markdown: string; retrieval: string };
type ApiErr = { error: string };

export function RabbiCard({
  targetHe,
  learnerLevel,
  translit,
  meaningEn,
  ragContext,
  className = "",
  embedded = false,
  variant = "inline",
}: RabbiCardProps) {
  const [open, setOpen] = useState(false);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [retrieval, setRetrieval] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rabbi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetHe,
          level: learnerLevel,
          translit,
          meaningEn,
          ragContext,
        }),
      });
      const data = (await res.json()) as ApiOk | ApiErr;
      if (!res.ok) {
        setError("error" in data ? data.error : "Request failed");
        return;
      }
      if ("markdown" in data) {
        setMarkdown(data.markdown);
        setRetrieval(data.retrieval ?? null);
      }
      setOpen(true);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [targetHe, learnerLevel, translit, meaningEn, ragContext]);

  useEffect(() => {
    if (variant !== "sheet") return;
    setMarkdown(null);
    setError(null);
    setOpen(false);
    void ask();
  }, [variant, targetHe, learnerLevel, translit, meaningEn, ragContext, ask]);

  const pad = embedded ? "p-3.5" : "p-5";
  const isSheet = variant === "sheet";
  const showArticle = isSheet ? markdown != null : open && markdown != null;

  const shellClass = isSheet
    ? className.trim()
    : `rounded-3xl border-2 border-sage/20 bg-gradient-to-br from-parchment-card/95 to-parchment-deep/35 shadow-sm ${pad} ${className}`.trim();

  return (
    <div className={shellClass}>
      {isSheet ? (
        <>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage">
            Ask the Rabbi
          </p>
          <Hebrew
            as="p"
            className="mt-2 text-right text-xl font-medium leading-relaxed text-ink"
          >
            {targetHe}
          </Hebrew>
          {meaningEn ? (
            <p className="mt-1 text-xs text-ink-muted">
              You&apos;re exploring: <span className="text-ink">{meaningEn}</span>
            </p>
          ) : null}
        </>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
            Ask the Rabbi
          </p>
          <button
            type="button"
            onClick={() => {
              if (!open && markdown == null && !loading) {
                void ask();
              } else {
                setOpen((v) => !v);
              }
            }}
            disabled={loading}
            aria-expanded={open}
            className="cursor-pointer rounded-2xl border-2 border-sage/25 bg-parchment-deep/40 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted shadow-sm transition hover:border-sage/45 hover:bg-parchment-deep/60 hover:text-ink hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-parchment-card disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Thinking…" : open ? "Hide" : "Expand"}
          </button>
        </div>
      )}

      <p className="mt-2 text-xs text-ink-muted">
        These are language and culture notes — warm context, not halachic or
        theological rulings.
      </p>

      {isSheet && loading && !markdown ? (
        <div
          className="mt-5 space-y-2 rounded-2xl border border-sage/15 bg-parchment-deep/30 p-4"
          aria-busy="true"
        >
          <div className="h-3 w-[78%] animate-pulse rounded-full bg-parchment-deep/60" />
          <div className="h-3 w-full animate-pulse rounded-full bg-parchment-deep/50" />
          <div className="h-3 w-5/6 animate-pulse rounded-full bg-parchment-deep/50" />
          <p className="pt-1 text-[11px] text-ink-faint">
            Pulling notes that match your level and this headword…
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-rust" role="alert">
          {error}
        </p>
      ) : null}

      {showArticle && markdown ? (
        <div className="mt-4 border-t border-sage/20 pt-4">
          {retrieval ? (
            <p className="mb-3 font-label text-[9px] uppercase tracking-wide text-ink-faint">
              Retrieval: {retrieval}
            </p>
          ) : null}
          <article className="rabbi-md max-w-none font-hebrew text-ink" dir="auto">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="mt-6 border-b border-ink/10 pb-1 font-label text-[11px] uppercase tracking-[0.15em] text-sage first:mt-0">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="mt-2 text-sm leading-relaxed text-ink">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mt-2 list-outside list-disc space-y-2 ps-6 text-sm marker:text-sage/80">
                    {children}
                  </ul>
                ),
                li: ({ children }) => <li className="leading-relaxed ps-1">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-medium text-ink">{children}</strong>
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </article>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => void ask()}
              disabled={loading}
              className="cursor-pointer text-xs text-sage underline hover:text-sage/90 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
