"use client";

import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { RabbiLevel } from "@/lib/rabbi-types";

export type RabbiCardProps = {
  /** Headword or phrase (may include nikkud). */
  targetHe: string;
  learnerLevel: RabbiLevel;
  translit?: string;
  meaningEn?: string;
  /** Pre-computed retrieval text (optional); skips server-side LightRAG subprocess */
  ragContext?: string;
  className?: string;
  /** Use tighter padding when nested inside another card */
  embedded?: boolean;
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

  const pad = embedded ? "p-3" : "p-4";

  return (
    <div
      className={`rounded-2xl border border-ink/12 bg-parchment-card/90 ${pad} ${className}`.trim()}
    >
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
          className="cursor-pointer rounded-xl border border-ink/12 bg-parchment-deep/30 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted transition hover:border-sage/35 hover:bg-parchment-deep/50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-parchment-card disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Thinking…" : open ? "Hide" : "Expand"}
        </button>
      </div>

      <p className="mt-2 text-xs text-ink-muted">
        Language and culture notes only — not halachic or theological authority.
      </p>

      {error ? (
        <p className="mt-3 text-sm text-rust" role="alert">
          {error}
        </p>
      ) : null}

      {open && markdown ? (
        <div className="mt-4 border-t border-sage/20 pt-4">
          {retrieval ? (
            <p className="mb-3 font-label text-[9px] uppercase tracking-wide text-ink-faint">
              Retrieval: {retrieval}
            </p>
          ) : null}
          <article className="rabbi-md max-w-none text-ink font-hebrew" dir="auto">
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
